import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    UserCircle2, Lock, Trash2, ShieldCheck,
    Star, Settings
} from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const TABS = [
    { key: 'profile',  label: 'Profil',    icon: UserCircle2 },
    { key: 'password', label: 'Password',  icon: Lock        },
    { key: 'danger',   label: 'Hapus Akun',icon: Trash2      },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left:  `${5 + (i * 17) % 90}%`,
    top:   `${10 + (i * 13) % 80}%`,
    dur:   3 + (i % 4),
    delay: (i % 3) * 0.8,
}));

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-500" />
                    Pengaturan Profil
                </h2>
            }>
            <Head title="Pengaturan Profil" />

            <div className="py-8 px-4">
                <div className="mx-auto max-w-3xl space-y-5">

                    {/* ═══ DARK HERO BANNER ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="relative overflow-hidden rounded-3xl
                                   bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                                   p-7 text-white shadow-2xl shadow-indigo-950/40">

                        {/* Grid overlay */}
                        <div className="absolute inset-0 opacity-[0.07]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
                                backgroundSize: '44px 44px',
                            }} />

                        {/* Orbs */}
                        <motion.div className="absolute w-72 h-72 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', top: '-20%', right: '-8%', opacity: 0.18 }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
                        <motion.div className="absolute w-48 h-48 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', bottom: '-15%', left: '5%', opacity: 0.15 }}
                            animate={{ scale: [1.2, 1, 1.2] }}
                            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

                        {/* Particles */}
                        {PARTICLES.map(p => (
                            <motion.div key={p.id}
                                className="absolute w-1 h-1 bg-indigo-300 rounded-full pointer-events-none"
                                style={{ left: p.left, top: p.top }}
                                animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
                                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }} />
                        ))}

                        {/* Hero content */}
                        <div className="relative z-10 flex flex-col sm:flex-row items-start
                                        sm:items-center gap-5">

                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: 4 }}
                                transition={{ type: 'spring', stiffness: 280 }}
                                className="relative shrink-0">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500
                                                to-blue-600 rounded-2xl flex items-center
                                                justify-center text-4xl font-black text-white
                                                shadow-xl shadow-indigo-500/40 border-2
                                                border-indigo-400/40">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                {/* Online indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400
                                                rounded-full border-2 border-slate-900
                                                flex items-center justify-center">
                                    <motion.span className="absolute w-full h-full bg-emerald-400
                                                             rounded-full"
                                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }} />
                                    <span className="w-2 h-2 bg-emerald-300 rounded-full" />
                                </div>
                            </motion.div>

                            {/* Name & email */}
                            <div className="flex-1 min-w-0">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-1.5 bg-indigo-500/20
                                               border border-indigo-400/30 text-indigo-300
                                               text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    Akun Pengguna
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-2xl font-black text-white tracking-tight">
                                    {user.name}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-slate-400 text-sm mt-0.5">
                                    {user.email}
                                </motion.p>
                            </div>

                            {/* Floating stars */}
                            <motion.div
                                animate={{ rotate: [0, 12, -6, 0], y: [0, -4, 0] }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="hidden sm:flex flex-col items-center gap-1.5 opacity-50">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <Star className="w-3 h-3 fill-indigo-400 text-indigo-400" />
                                <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                            </motion.div>
                        </div>

                        {/* Bottom stat row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="relative z-10 mt-6 pt-5 border-t border-white/10
                                       flex gap-8 flex-wrap">
                            {[
                                { label: 'Status',   value: 'Aktif'                    },
                                { label: 'Platform', value: 'Kite Competition'             },
                            ].map((s, i) => (
                                <div key={i}>
                                    <p className="text-slate-500 text-xs font-medium">{s.label}</p>
                                    <p className="text-white font-bold text-sm mt-0.5">{s.value}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ═══ TAB SWITCHER ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5
                                   flex gap-1.5">
                        {TABS.map(tab => {
                            const Icon     = tab.icon;
                            const isActive = activeTab === tab.key;
                            const isDanger = tab.key === 'danger';
                            return (
                                <motion.button key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    whileTap={{ scale: 0.96 }}
                                    className={`relative flex-1 flex items-center justify-center
                                                gap-2 py-2.5 px-4 rounded-xl text-sm font-bold
                                                transition-all duration-200
                                                ${isActive
                                                    ? isDanger
                                                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-200'
                                                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200'
                                                    : isDanger
                                                        ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                                                        : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/60'
                                                }`}>
                                    <Icon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {/* ═══ ANIMATED PANEL ═══ */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 18, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

                            {activeTab === 'profile' && (
                                <PanelCard
                                    iconGrad="from-indigo-500 to-blue-600"
                                    iconShadow="shadow-indigo-200"
                                    icon={UserCircle2}
                                    title="Informasi Profil"
                                    subtitle="Perbarui nama lengkap dan alamat email akunmu">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-2xl" />
                                </PanelCard>
                            )}

                            {activeTab === 'password' && (
                                <PanelCard
                                    iconGrad="from-emerald-500 to-teal-600"
                                    iconShadow="shadow-emerald-200"
                                    icon={Lock}
                                    title="Ubah Password"
                                    subtitle="Gunakan password panjang dan acak agar akunmu tetap aman">
                                    <UpdatePasswordForm className="max-w-2xl" />
                                </PanelCard>
                            )}

                            {activeTab === 'danger' && (
                                <PanelCard
                                    iconGrad="from-red-500 to-rose-600"
                                    iconShadow="shadow-red-200"
                                    icon={Trash2}
                                    title="Hapus Akun"
                                    subtitle="Tindakan ini permanen dan tidak dapat dibatalkan"
                                    danger>
                                    <DeleteUserForm className="max-w-2xl" />
                                </PanelCard>
                            )}

                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ── Panel Card ── */
function PanelCard({ icon: Icon, iconGrad, iconShadow, title, subtitle, danger, children }) {
    return (
        <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden
                         ${danger ? 'border-red-100' : 'border-gray-100'}`}>
            {/* Top accent bar */}
            <div className={`h-1 bg-gradient-to-r ${iconGrad}`} />

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${iconGrad} rounded-xl
                                 flex items-center justify-center shadow-md ${iconShadow} shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className={`font-bold ${danger ? 'text-red-600' : 'text-gray-800'}`}>
                        {title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                </div>
            </div>

            <div className="p-6">{children}</div>
        </div>
    );
}