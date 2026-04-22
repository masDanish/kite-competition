import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, CheckCircle2, Info, Save, AlertCircle, Sparkles } from 'lucide-react';

/* ── Shared input style ── */
const inputBase =
    "w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-gray-50/50 " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent " +
    "focus:bg-white placeholder:text-gray-300 transition-all duration-200";

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

/* ── Floating label input wrapper ── */
function InputField({ icon: Icon, label, children }) {
    return (
        <div className="group">
            <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-indigo-400" />
                    {label}
                </span>
            </label>
            <div className="relative">
                {children}
                {/* Focus ring glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none
                                ring-0 group-focus-within:ring-4
                                group-focus-within:ring-indigo-100 transition-all duration-200" />
            </div>
        </div>
    );
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({ name: user.name, email: user.email });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">

                {/* Name */}
                <InputField icon={User} label="Nama Lengkap">
                    <input
                        id="name"
                        className={inputBase}
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        required autoFocus autoComplete="name"
                        placeholder="Nama lengkap kamu"
                    />
                    <FieldError msg={errors.name} />
                </InputField>

                {/* Email */}
                <InputField icon={Mail} label="Alamat Email">
                    <input
                        id="email"
                        type="email"
                        className={inputBase}
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required autoComplete="username"
                        placeholder="email@kamu.com"
                    />
                    <FieldError msg={errors.email} />
                </InputField>

                {/* Verify email notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50
                                   to-orange-50 border border-amber-200 rounded-2xl">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-amber-800 font-bold">Email belum terverifikasi</p>
                            <p className="text-xs text-amber-600 mt-1">
                                <Link
                                    href={route('verification.send')}
                                    method="post" as="button"
                                    className="underline font-bold hover:text-amber-800 transition">
                                    Klik di sini untuk kirim ulang email verifikasi.
                                </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Link verifikasi baru telah dikirim.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Submit */}
                <div className="flex items-center gap-4 pt-1">
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: processing ? 1 : 1.02, y: processing ? 0 : -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600
                                   to-blue-600 text-white px-7 py-2.5 rounded-2xl font-bold
                                   text-sm shadow-lg shadow-indigo-200/60 disabled:opacity-60
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
                                Simpan Perubahan
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
                            Tersimpan!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}