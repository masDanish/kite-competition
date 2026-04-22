import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, Info, Save, ShieldCheck, Sparkles } from 'lucide-react';

const labelClass =
    "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium">
            <Info className="w-3 h-3 shrink-0" /> {msg}
        </motion.p>
    );
}

/* ── Password strength calc ── */
function getStrength(pw) {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8)  s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0-5
}

const STRENGTH_CFG = [
    { label: 'Lemah',      bar: 'w-1/5', color: 'bg-red-400'    },
    { label: 'Kurang',     bar: 'w-2/5', color: 'bg-orange-400' },
    { label: 'Sedang',     bar: 'w-3/5', color: 'bg-amber-400'  },
    { label: 'Kuat',       bar: 'w-4/5', color: 'bg-emerald-400'},
    { label: 'Sangat Kuat',bar: 'w-full',color: 'bg-emerald-500'},
];

function StrengthBar({ password }) {
    const s = getStrength(password);
    if (!password) return null;
    const cfg = STRENGTH_CFG[Math.min(s - 1, 4)] ?? STRENGTH_CFG[0];
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${cfg.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: cfg.bar.replace('w-', '') === 'full' ? '100%' : cfg.bar.replace('w-', '').replace('/', '%').replace(/(\d+)%(\d+)/, (_, n, d) => `${Math.round(n/d*100)}%`) }}
                    transition={{ duration: 0.4 }}
                    style={{ width: cfg.bar === 'w-full' ? '100%' : cfg.bar === 'w-1/5' ? '20%' : cfg.bar === 'w-2/5' ? '40%' : cfg.bar === 'w-3/5' ? '60%' : '80%' }}
                />
            </div>
            <p className={`text-xs mt-1 font-semibold`}
                style={{ color: cfg.color.replace('bg-', '').includes('red') ? '#f87171' : cfg.color.includes('orange') ? '#fb923c' : cfg.color.includes('amber') ? '#fbbf24' : '#34d399' }}>
                Kekuatan: {cfg.label}
            </p>
        </motion.div>
    );
}

/* ── Password input with show/hide ── */
function PasswordInput({ id, value, onChange, autoComplete, placeholder, inputRef, label }) {
    const [show, setShow] = useState(false);
    return (
        <div className="group">
            <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    {label}
                </span>
            </label>
            <div className="relative">
                <input
                    id={id}
                    ref={inputRef}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-12
                               text-sm bg-gray-50/50 focus:outline-none focus:ring-2
                               focus:ring-emerald-400 focus:border-transparent focus:bg-white
                               placeholder:text-gray-300 transition-all duration-200"
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1
                               text-gray-400 hover:text-gray-600 rounded-lg
                               hover:bg-gray-100 transition-all duration-150">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={show ? 'hide' : 'show'}
                            initial={{ opacity: 0, rotate: -10 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 10 }}
                            transition={{ duration: 0.15 }}>
                            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.div>
                    </AnimatePresence>
                </button>
                {/* Focus glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none
                                group-focus-within:ring-4 group-focus-within:ring-emerald-100
                                transition-all duration-200" />
            </div>
        </div>
    );
}

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput        = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password:      '',
            password:              '',
            password_confirmation: '',
        });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    /* Check if confirm matches */
    const confirmMatch =
        data.password_confirmation.length > 0 &&
        data.password === data.password_confirmation;

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-5">

                {/* Current password */}
                <PasswordInput
                    id="current_password"
                    inputRef={currentPasswordInput}
                    label="Password Saat Ini"
                    value={data.current_password}
                    onChange={e => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                    placeholder="Password yang sedang kamu gunakan"
                />
                <FieldError msg={errors.current_password} />

                {/* New password + strength */}
                <div>
                    <PasswordInput
                        id="password"
                        inputRef={passwordInput}
                        label="Password Baru"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Buat password yang kuat"
                    />
                    <StrengthBar password={data.password} />
                    <FieldError msg={errors.password} />
                </div>

                {/* Confirm password */}
                <div>
                    <PasswordInput
                        id="password_confirmation"
                        label="Konfirmasi Password Baru"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Ulangi password baru"
                    />
                    {/* Match indicator */}
                    <AnimatePresence>
                        {data.password_confirmation.length > 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex items-center gap-1 text-xs mt-1.5 font-semibold
                                            ${confirmMatch ? 'text-emerald-500' : 'text-red-400'}`}>
                                {confirmMatch
                                    ? <><CheckCircle2 className="w-3 h-3" /> Password cocok!</>
                                    : <><Info className="w-3 h-3" /> Password belum cocok</>}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <FieldError msg={errors.password_confirmation} />
                </div>

                {/* Tip box */}
                <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-100
                                rounded-2xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-700 leading-relaxed">
                        Gunakan minimal 12 karakter dengan kombinasi huruf besar, angka,
                        dan simbol agar akunmu lebih aman.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-1">
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: processing ? 1 : 1.02, y: processing ? 0 : -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500
                                   to-teal-600 text-white px-7 py-2.5 rounded-2xl font-bold
                                   text-sm shadow-lg shadow-emerald-200/60 disabled:opacity-60
                                   disabled:cursor-not-allowed transition-all duration-200">
                        {processing ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30
                                                 border-t-white rounded-full animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                Ubah Password
                            </>
                        )}
                    </motion.button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveTo="opacity-0 scale-95">
                        <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-600
                                      bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            Password diperbarui!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}