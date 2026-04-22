import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Logo from '@/Assets/logo.png';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="min-h-screen flex items-center justify-center
                            bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                            px-6 relative overflow-hidden">

                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />

                <motion.div className="absolute w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', top: '15%', right: '10%', opacity: 0.15 }}
                    animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />

                {[...Array(10)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute w-1 h-1 bg-indigo-300 rounded-full pointer-events-none"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-xl
                               shadow-2xl shadow-black/40 rounded-3xl overflow-hidden
                               grid md:grid-cols-2 border border-white/10">

                    {/* LEFT */}
                    <div className="hidden md:flex flex-col justify-center items-center
                                    bg-gradient-to-br from-indigo-600 to-blue-700 text-white
                                    p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-full" />

                        <motion.div animate={{ rotate: [0, 8, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="text-7xl mb-6 relative z-10">🔐</motion.div>

                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <img src={Logo} className="w-10 h-10 object-contain rounded-xl" />
                            <div>
                                <p className="font-black text-white text-lg leading-none">Kite Competition</p>
                                <p className="text-indigo-200 text-xs font-medium">Design • Fly • Compete</p>
                            </div>
                        </div>

                        <p className="relative z-10 text-sm text-indigo-100 text-center leading-relaxed max-w-xs">
                            Please confirm your password before continuing.
                        </p>

                        <div className="relative z-10 flex gap-1 mt-6">
                            {[...Array(3)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-indigo-300 text-indigo-300" />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="p-8 bg-white/5 backdrop-blur-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-white">Confirm Password</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                This area is protected for your security
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Please enter your password to continue accessing this secure section.
                            </p>

                            <div>
                                <InputLabel htmlFor="password" value="Password"
                                    className="text-slate-300 text-sm font-medium" />
                                <TextInput
                                    id="password" type="password" value={data.password}
                                    className="mt-1 block w-full rounded-xl border-white/10
                                               bg-white/10 text-white placeholder:text-slate-500
                                               focus:ring-indigo-500 focus:border-indigo-500"
                                    isFocused
                                    onChange={(e) => setData('password', e.target.value)} />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <motion.button type="submit" disabled={processing}
                                whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                                className="w-full flex items-center justify-center gap-2
                                           bg-gradient-to-r from-indigo-500 to-blue-600
                                           text-white font-bold py-3 rounded-xl
                                           shadow-lg shadow-indigo-500/30 transition-all
                                           disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? 'Confirming...' : 'Confirm Password'}
                                {!processing && <ArrowRight className="w-4 h-4" />}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </GuestLayout>
    );
}