import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Logo from '@/Assets/logo.png';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center
                            bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                            px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">

                {/* Grid */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />

                {/* Orbs */}
                <motion.div className="absolute w-64 sm:w-96 h-64 sm:h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', top: '5%', right: '5%', opacity: 0.15 }}
                    animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 7, repeat: Infinity }} />
                <motion.div className="absolute w-52 sm:w-72 h-52 sm:h-72 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', bottom: '5%', left: '5%', opacity: 0.12 }}
                    animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 9, repeat: Infinity }} />

                {/* Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute w-1 h-1 bg-indigo-300 rounded-full pointer-events-none"
                        style={{ left: `${(i * 337) % 100}%`, top: `${(i * 271) % 100}%` }}
                        animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: (i % 5) * 0.6 }} />
                ))}

                {/* CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 w-full max-w-sm sm:max-w-4xl bg-white/10 backdrop-blur-xl
                               shadow-2xl shadow-black/40 rounded-2xl sm:rounded-3xl overflow-hidden
                               sm:grid sm:grid-cols-2 border border-white/10">

                    {/* LEFT (hidden on mobile) */}
                    <div className="hidden sm:flex flex-col justify-center items-center
                                    bg-gradient-to-br from-indigo-600 to-blue-700 text-white
                                    p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-full" />

                        <motion.div animate={{ rotate: [0, 8, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="text-7xl mb-6 relative z-10">🚀</motion.div>

                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <img src={Logo} className="w-10 h-10 object-contain rounded-xl" alt="Logo" />
                            <div>
                                <p className="font-black text-white text-lg leading-none">Kite Competition</p>
                                <p className="text-indigo-200 text-xs font-medium">Design • Fly • Compete</p>
                            </div>
                        </div>

                        <p className="relative z-10 text-sm text-indigo-100 text-center leading-relaxed max-w-xs">
                            Join the global kite design community and compete with creativity.
                        </p>

                        <div className="relative z-10 flex gap-1 mt-6">
                            {[...Array(3)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-indigo-300 text-indigo-300" />
                            ))}
                        </div>

                        <motion.div animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative z-10 mt-8 bg-white/15 border border-white/20
                                       rounded-2xl px-4 py-2.5 text-center backdrop-blur-sm">
                            <p className="text-xs font-bold text-white">Bergabung Sekarang</p>
                            <p className="text-[10px] text-indigo-200 mt-0.5">Pendaftaran 100% Gratis</p>
                        </motion.div>
                    </div>

                    {/* RIGHT */}
                    <div className="p-6 sm:p-8 bg-white/5 backdrop-blur-sm">

                        {/* Mobile branding header */}
                        <div className="flex sm:hidden items-center gap-3 mb-6 pb-5
                                        border-b border-white/10">
                            <img src={Logo} className="w-9 h-9 object-contain rounded-xl" alt="Logo"/>
                            <div>
                                <p className="font-black text-white text-base leading-none">Kite Competition</p>
                                <p className="text-indigo-300 text-xs mt-0.5">Design • Fly • Compete</p>
                            </div>
                            <span className="ml-auto text-3xl">🚀</span>
                        </div>

                        <div className="mb-5 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-black text-white">Create Account 🚀</h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Start your kite competition journey
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-3 sm:space-y-4">
                            {[
                                { id: 'name',     label: 'Full Name', type: 'text',     key: 'name',     autoComplete: 'name' },
                                { id: 'email',    label: 'Email',     type: 'email',    key: 'email',    autoComplete: 'username' },
                                { id: 'password', label: 'Password',  type: 'password', key: 'password', autoComplete: 'new-password' },
                            ].map(field => (
                                <div key={field.id}>
                                    <InputLabel htmlFor={field.id} value={field.label}
                                        className="text-slate-300 text-xs sm:text-sm font-medium" />
                                    <TextInput
                                        id={field.id} type={field.type} value={data[field.key]}
                                        className="mt-1 block w-full rounded-xl border-white/10
                                                   bg-white/10 text-white placeholder:text-slate-500
                                                   focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        autoComplete={field.autoComplete} isFocused={field.id === 'name'}
                                        onChange={(e) => setData(field.key, e.target.value)} required />
                                    <InputError message={errors[field.key]} className="mt-1" />
                                </div>
                            ))}

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password"
                                    className="text-slate-300 text-xs sm:text-sm font-medium" />
                                <TextInput
                                    id="password_confirmation" type="password"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-xl border-white/10
                                               bg-white/10 text-white placeholder:text-slate-500
                                               focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)} required />
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <motion.button type="submit" disabled={processing}
                                whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                                className="w-full flex items-center justify-center gap-2
                                           bg-gradient-to-r from-indigo-500 to-blue-600
                                           text-white font-bold py-2.5 sm:py-3 rounded-xl
                                           shadow-lg shadow-indigo-500/30 text-sm sm:text-base
                                           hover:shadow-indigo-500/50 transition-all
                                           disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? 'Creating...' : 'Create Account'}
                                {!processing && <ArrowRight className="w-4 h-4" />}
                            </motion.button>

                            <p className="text-center text-xs sm:text-sm text-slate-400 pt-1">
                                Already have an account?{' '}
                                <Link href={route('login')}
                                    className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </GuestLayout>
    );
}