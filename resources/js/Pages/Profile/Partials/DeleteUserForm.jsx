import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, AlertTriangle, X, Lock,
    Eye, EyeOff, Info, ShieldAlert
} from 'lucide-react';

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${10 + (i * 19) % 80}%`,
    top:  `${5  + (i * 17) % 60}%`,
    dur:  2 + (i % 3),
    delay: (i % 4) * 0.5,
}));

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-red-400 text-xs mt-1.5 font-medium">
            <Info className="w-3 h-3 shrink-0" /> {msg}
        </motion.p>
    );
}

export default function DeleteUserForm({ className = '' }) {
    const [confirming, setConfirming] = useState(false);
    const [showPwd,    setShowPwd]    = useState(false);
    const [typed,      setTyped]      = useState('');
    const passwordInput = useRef();

    const CONFIRM_PHRASE = 'hapus akun saya';

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({ password: '' });

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError:   () => passwordInput.current?.focus(),
            onFinish:  () => reset(),
        });
    };

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
        setShowPwd(false);
        setTyped('');
    };

    const phraseMatch = typed.toLowerCase() === CONFIRM_PHRASE;
    const canSubmit   = phraseMatch && data.password.trim().length > 0 && !processing;

    return (
        <section className={className}>

            {/* ── Warning block ── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border border-red-200
                           bg-gradient-to-r from-red-50 to-rose-50 p-5 mb-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full
                                translate-x-1/3 -translate-y-1/3 opacity-60" />
                <div className="relative flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 border border-red-200 rounded-xl
                                    flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="font-bold text-red-700 text-sm">Zona Berbahaya</p>
                        <p className="text-red-600 text-xs mt-1 leading-relaxed">
                            Setelah akun dihapus, semua data termasuk pendaftaran, karya, dan
                            riwayat kompetisi akan dihapus secara <strong>permanen</strong> dan
                            tidak dapat dipulihkan kembali.
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.button
                onClick={() => setConfirming(true)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500
                           to-rose-600 text-white rounded-2xl text-sm font-bold
                           shadow-lg shadow-red-200/60 hover:shadow-xl hover:shadow-red-200/80
                           transition-all duration-200">
                <Trash2 className="w-4 h-4" />
                Hapus Akun Saya
            </motion.button>

            {/* ════════════════════════════════
                CONFIRM MODAL — dark dramatic
            ════════════════════════════════ */}
            <AnimatePresence>
                {confirming && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.65)' }}>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.88, y: 32 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 16 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative overflow-hidden w-full max-w-md
                                       bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                                       rounded-3xl shadow-2xl border border-white/10">

                            {/* Grid overlay */}
                            <div className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(239,68,68,0.4) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(239,68,68,0.4) 1px, transparent 1px)`,
                                    backgroundSize: '32px 32px',
                                }} />

                            {/* Red glow orb */}
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full
                                            pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)' }} />

                            {/* Particles */}
                            {PARTICLES.map(p => (
                                <motion.div key={p.id}
                                    className="absolute w-0.5 h-0.5 bg-red-400 rounded-full pointer-events-none"
                                    style={{ left: p.left, top: p.top }}
                                    animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }}
                                    transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
                            ))}

                            {/* ── Modal Header ── */}
                            <div className="relative z-10 flex items-center justify-between
                                            px-6 pt-6 pb-0">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="w-11 h-11 bg-gradient-to-br from-red-500
                                                   to-rose-600 rounded-2xl flex items-center
                                                   justify-center shadow-lg shadow-red-500/40">
                                        <AlertTriangle className="w-5 h-5 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-black text-white text-lg leading-tight">
                                            Hapus Akun?
                                        </h3>
                                        <p className="text-red-400 text-xs font-medium">
                                            Tindakan ini tidak dapat dibatalkan
                                        </p>
                                    </div>
                                </div>
                                <button onClick={closeModal}
                                    className="w-8 h-8 flex items-center justify-center
                                               rounded-xl bg-white/10 hover:bg-white/20
                                               text-slate-400 hover:text-white transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* ── Modal Body ── */}
                            <form onSubmit={deleteUser}>
                                <div className="relative z-10 px-6 py-5 space-y-5">

                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Semua data akunmu akan dihapus secara{' '}
                                        <span className="text-red-400 font-bold">permanen</span>.
                                        Untuk melanjutkan, ketik kalimat konfirmasi dan masukkan passwordmu.
                                    </p>

                                    {/* Confirmation phrase */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400
                                                          uppercase tracking-wider mb-1.5">
                                            Ketik: <span className="text-red-400 font-black normal-case
                                                                     tracking-normal">"{CONFIRM_PHRASE}"</span>
                                        </label>
                                        <input
                                            value={typed}
                                            onChange={e => setTyped(e.target.value)}
                                            placeholder={CONFIRM_PHRASE}
                                            className="w-full bg-white/5 border border-white/10
                                                       rounded-2xl px-4 py-2.5 text-sm text-white
                                                       placeholder:text-slate-600 focus:outline-none
                                                       focus:ring-2 focus:ring-red-500/50
                                                       focus:border-red-500/50 transition-all duration-200"
                                        />
                                        <AnimatePresence>
                                            {typed.length > 0 && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className={`text-xs mt-1.5 font-semibold
                                                        ${phraseMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {phraseMatch ? '✅ Terkonfirmasi' : '❌ Belum cocok'}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400
                                                          uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Lock className="w-3 h-3" /> Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                ref={passwordInput}
                                                type={showPwd ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                placeholder="Masukkan passwordmu..."
                                                className="w-full bg-white/5 border border-white/10
                                                           rounded-2xl px-4 py-2.5 pr-11 text-sm
                                                           text-white placeholder:text-slate-600
                                                           focus:outline-none focus:ring-2
                                                           focus:ring-red-500/50 focus:border-red-500/50
                                                           transition-all duration-200"
                                            />
                                            <button type="button"
                                                onClick={() => setShowPwd(s => !s)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2
                                                           text-slate-500 hover:text-slate-300
                                                           transition-colors p-1 rounded-lg
                                                           hover:bg-white/10">
                                                <AnimatePresence mode="wait" initial={false}>
                                                    <motion.div key={showPwd ? 'hide' : 'show'}
                                                        initial={{ opacity: 0, rotate: -10 }}
                                                        animate={{ opacity: 1, rotate: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.15 }}>
                                                        {showPwd
                                                            ? <EyeOff className="w-4 h-4" />
                                                            : <Eye    className="w-4 h-4" />}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </button>
                                        </div>
                                        <FieldError msg={errors.password} />
                                    </div>
                                </div>

                                {/* ── Footer buttons ── */}
                                <div className="relative z-10 flex gap-3 px-6 pb-6">
                                    <button type="button" onClick={closeModal}
                                        className="flex-1 flex items-center justify-center gap-2
                                                   py-2.5 bg-white/10 border border-white/10 rounded-2xl
                                                   text-sm font-bold text-slate-300 hover:bg-white/20
                                                   hover:text-white transition-all duration-200">
                                        <X className="w-4 h-4" /> Batal
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={!canSubmit}
                                        whileHover={canSubmit ? { scale: 1.02, y: -1 } : {}}
                                        whileTap={canSubmit  ? { scale: 0.97 } : {}}
                                        className="flex-1 flex items-center justify-center gap-2
                                                   py-2.5 bg-gradient-to-r from-red-500 to-rose-600
                                                   text-white rounded-2xl text-sm font-bold
                                                   shadow-lg shadow-red-500/40
                                                   disabled:opacity-40 disabled:cursor-not-allowed
                                                   disabled:shadow-none transition-all duration-200">
                                        {processing ? (
                                            <>
                                                <span className="w-3.5 h-3.5 border-2 border-white/30
                                                                 border-t-white rounded-full animate-spin" />
                                                Menghapus...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Hapus Selamanya
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}