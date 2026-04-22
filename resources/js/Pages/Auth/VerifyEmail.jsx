import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Logo from '@/Assets/logo.png';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="min-h-screen flex items-center justify-center
                            bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                            px-6 relative overflow-hidden">

                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />

                <motion.div className="absolute w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', top: '5%', left: '5%', opacity: 0.15 }}
                    animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />

                {[...Array(10)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute w-1 h-1 bg-indigo-300 rounded-full pointer-events-none"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />
                ))}

                {/* CARD — single column, centered */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl
                               shadow-2xl shadow-black/40 rounded-3xl overflow-hidden
                               border border-white/10 p-10 text-center">

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <img src={Logo} className="w-10 h-10 object-contain rounded-xl" />
                        <div className="text-left">
                            <p className="font-black text-white text-base leading-none">
                                Kite Competition
                            </p>
                            <p className="text-indigo-300 text-xs font-medium">
                                Design • Fly • Compete
                            </p>
                        </div>
                    </div>

                    <motion.div
                        animate={{ rotate: [0, 8, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="text-6xl mb-4">
                        📧
                    </motion.div>

                    <h1 className="text-2xl font-black text-white">Verify Your Email</h1>

                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                        Thanks for signing up! Before getting started, please verify your
                        email address by clicking the link we just sent you.
                    </p>

                    {status === 'verification-link-sent' && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-sm text-emerald-400 bg-emerald-400/10
                                       border border-emerald-400/20 rounded-xl px-4 py-3">
                            A new verification link has been sent to your email.
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="mt-6 space-y-3">
                        <motion.button type="submit" disabled={processing}
                            whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                            className="w-full flex items-center justify-center gap-2
                                       bg-gradient-to-r from-indigo-500 to-blue-600
                                       text-white font-bold py-3 rounded-xl
                                       shadow-lg shadow-indigo-500/30 transition-all
                                       disabled:opacity-50 disabled:cursor-not-allowed">
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                            {!processing && <ArrowRight className="w-4 h-4" />}
                        </motion.button>

                        <Link href={route('logout')} method="post" as="button"
                            className="block w-full text-sm text-slate-500
                                       hover:text-indigo-400 transition py-2">
                            Log Out
                        </Link>
                    </form>
                </motion.div>
            </div>
        </GuestLayout>
    );
}