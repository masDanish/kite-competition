import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays, Users, Clock, FileUp,
    CheckCircle2, XCircle, Sparkles, ShieldCheck,
    ChevronRight, UserCircle2, Tag, CalendarCheck2
} from 'lucide-react';
import { useState } from 'react';

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Dashboard({ stats, recentEvents, pendingRegistrations }) {
    const statCards = [
        {
            label:  'Total Event',
            value:  stats.events,
            icon:   CalendarDays,
            grad:   'from-indigo-500 to-blue-600',
            shadow: 'shadow-indigo-200',
        },
        {
            label:  'Total Peserta',
            value:  stats.users,
            icon:   Users,
            grad:   'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-200',
        },
        {
            label:  'Menunggu Approve',
            value:  stats.pending,
            icon:   Clock,
            grad:   'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-200',
        },
        {
            label:  'Karya Dikirim',
            value:  stats.submissions,
            icon:   FileUp,
            grad:   'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-200',
        },
    ];

    return (
        <AdminLayout header="Dashboard Admin">
            <Head title="Admin Dashboard" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-6 mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/5
                                    rounded-full" />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">
                                Panel Administrator
                            </span>
                        </div>
                        <h1 className="text-2xl font-black">Dashboard Admin ⚡</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Kelola event, peserta, dan karya dari satu tempat.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl hidden md:block">
                        🛡️
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div
                initial="hidden" animate="show" variants={stagger}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s, i) => (
                    <motion.div key={i} variants={fadeUp}
                        whileHover={{ y: -4, scale: 1.03 }}
                        className={`bg-white rounded-2xl p-5 shadow-lg ${s.shadow}
                                    border border-gray-100 flex items-center gap-4`}>
                        <div className={`w-12 h-12 bg-gradient-to-br ${s.grad} rounded-xl
                                         flex items-center justify-center shadow-md shrink-0`}>
                            <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-800">{s.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Pending Registrations ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <h2 className="font-bold text-gray-800">Pendaftaran Menunggu Persetujuan</h2>
                    </div>
                    {pendingRegistrations.length > 0 && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold
                                         px-2.5 py-1 rounded-full border border-amber-200">
                            {pendingRegistrations.length} menunggu
                        </span>
                    )}
                </div>

                <div className="p-6">
                    {pendingRegistrations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-14">
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-5xl mb-3">✅</motion.div>
                            <p className="text-gray-400 text-sm">
                                Semua pendaftaran sudah ditangani.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 rounded-xl">
                                            <th className="px-4 py-3 text-left text-xs font-bold
                                                           text-gray-500 uppercase tracking-wider
                                                           rounded-l-xl">
                                                Peserta
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold
                                                           text-gray-500 uppercase tracking-wider">
                                                Event
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold
                                                           text-gray-500 uppercase tracking-wider">
                                                Kategori
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold
                                                           text-gray-500 uppercase tracking-wider">
                                                Tanggal Daftar
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold
                                                           text-gray-500 uppercase tracking-wider
                                                           rounded-r-xl">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <AnimatePresence>
                                            {pendingRegistrations.map((reg, i) => (
                                                <TableRow key={reg.id} reg={reg} index={i} />
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {pendingRegistrations.map((reg, i) => (
                                    <MobileRegCard key={reg.id} reg={reg} index={i} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </AdminLayout>
    );
}

/* ── Table Row (Desktop) ── */
function TableRow({ reg, index }) {
    const [loading, setLoading] = useState(null);

    function approve() {
        setLoading('approve');
        router.patch(route('admin.registrations.approve', reg.id), {}, {
            onFinish: () => setLoading(null)
        });
    }

    function reject() {
        const reason = prompt('Alasan penolakan?');
        if (!reason) return;
        setLoading('reject');
        router.patch(route('admin.registrations.reject', reg.id), { reason }, {
            onFinish: () => setLoading(null)
        });
    }

    return (
        <motion.tr
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="hover:bg-indigo-50/30 transition-colors duration-150">
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400
                                    to-blue-500 flex items-center justify-center text-white
                                    text-xs font-bold shrink-0">
                        {reg.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{reg.user.name}</span>
                </div>
            </td>
            <td className="px-4 py-3.5">
                <p className="text-gray-700 text-sm font-medium truncate max-w-[180px]">
                    {reg.event.title}
                </p>
            </td>
            <td className="px-4 py-3.5">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1
                                 rounded-full font-semibold border border-indigo-100">
                    {reg.category.name}
                </span>
            </td>
            <td className="px-4 py-3.5 text-gray-500 text-xs">
                {new Date(reg.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })}
            </td>
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                    <ActionButton
                        onClick={approve}
                        loading={loading === 'approve'}
                        variant="approve"
                        label="Approve"
                        icon={CheckCircle2}
                    />
                    <ActionButton
                        onClick={reject}
                        loading={loading === 'reject'}
                        variant="reject"
                        label="Reject"
                        icon={XCircle}
                    />
                </div>
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function MobileRegCard({ reg, index }) {
    const [loading, setLoading] = useState(null);

    function approve() {
        setLoading('approve');
        router.patch(route('admin.registrations.approve', reg.id), {}, {
            onFinish: () => setLoading(null)
        });
    }

    function reject() {
        const reason = prompt('Alasan penolakan?');
        if (!reason) return;
        setLoading('reject');
        router.patch(route('admin.registrations.reject', reg.id), { reason }, {
            onFinish: () => setLoading(null)
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50
                       hover:border-indigo-200 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400
                                to-blue-500 flex items-center justify-center text-white
                                font-bold text-sm shrink-0">
                    {reg.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{reg.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{reg.event.title}</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5
                                 rounded-full font-semibold border border-indigo-100 shrink-0">
                    {reg.category.name}
                </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
                📅 {new Date(reg.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })}
            </p>
            <div className="flex gap-2">
                <ActionButton onClick={approve} loading={loading === 'approve'}
                    variant="approve" label="Approve" icon={CheckCircle2} full />
                <ActionButton onClick={reject} loading={loading === 'reject'}
                    variant="reject" label="Reject" icon={XCircle} full />
            </div>
        </motion.div>
    );
}

/* ── Reusable Action Button ── */
function ActionButton({ onClick, loading, variant, label, icon: Icon, full }) {
    const styles = {
        approve: {
            base:  'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
            pulse: 'bg-emerald-500',
        },
        reject: {
            base:  'bg-red-500 hover:bg-red-600 shadow-red-200',
            pulse: 'bg-red-400',
        },
    };
    const s = styles[variant];

    return (
        <button
            onClick={onClick}
            disabled={!!loading}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl
                        text-white text-xs font-bold shadow-md transition-all duration-200
                        hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60
                        disabled:cursor-not-allowed ${s.base} ${full ? 'flex-1' : ''}`}>
            {loading ? (
                <span className={`w-3 h-3 rounded-full ${s.pulse} animate-ping`} />
            ) : (
                <Icon className="w-3.5 h-3.5" />
            )}
            {label}
        </button>
    );
}