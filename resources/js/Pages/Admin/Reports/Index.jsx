import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, CalendarDays, CheckCircle2,
    Trophy, Users, UserCog, ChevronRight,
    MapPin, TrendingUp
} from 'lucide-react';

const fadeUp  = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

const STATUS_CFG = {
    draft:    { label: 'Draft',    bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
    open:     { label: 'Open',     bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    closed:   { label: 'Closed',   bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    ongoing:  { label: 'Ongoing',  bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    finished: { label: 'Finished', bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
};

export default function ReportsIndex({ events }) {
    const totalActive   = events.filter(e => e.status === 'open').length;
    const totalFinished = events.filter(e => e.status === 'finished').length;

    const stats = [
        {
            label:  'Total Event',
            value:  events.length,
            icon:   CalendarDays,
            grad:   'from-indigo-500 to-blue-600',
            shadow: 'shadow-indigo-200',
        },
        {
            label:  'Event Aktif',
            value:  totalActive,
            icon:   TrendingUp,
            grad:   'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-200',
        },
        {
            label:  'Event Selesai',
            value:  totalFinished,
            icon:   CheckCircle2,
            grad:   'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-200',
        },
    ];

    return (
        <AdminLayout header="Laporan & Statistik">
            <Head title="Laporan" />

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
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-2xl font-black">Laporan & Statistik 📊</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Pantau performa semua event dalam satu tampilan.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl hidden md:block">
                        📊
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div
                initial="hidden" animate="show" variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((s, i) => (
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

            {/* ── Events Table ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="font-bold text-gray-800">Daftar Event & Statistik</h2>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {['Event', 'Status', 'Peserta', 'Juri', 'Periode', 'Aksi'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold
                                                            text-gray-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody
                            initial="hidden" animate="show" variants={stagger}
                            className="divide-y divide-gray-50">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="flex flex-col items-center py-16 text-gray-400">
                                            <motion.div animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="text-5xl mb-3">📭</motion.div>
                                            <p className="text-sm">Belum ada event.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {events.map(event => (
                                        <EventRow key={event.id} event={event} />
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-3">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <div className="text-5xl mb-3">📭</div>
                            <p className="text-sm">Belum ada event.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {events.map((event, i) => (
                                <EventMobileCard key={event.id} event={event} index={i} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </AdminLayout>
    );
}

/* ── Desktop Row ── */
function EventRow({ event }) {
    const cfg = STATUS_CFG[event.status] ?? STATUS_CFG.draft;
    return (
        <motion.tr variants={fadeUp}
            className="hover:bg-indigo-50/30 transition-colors duration-150">
            {/* Event */}
            <td className="px-5 py-4">
                <p className="font-bold text-gray-800 text-sm">{event.title}</p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {event.location ?? 'Lokasi belum ditentukan'}
                </p>
            </td>
            {/* Status */}
            <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold
                                  px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                </span>
            </td>
            {/* Peserta */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center
                                    justify-center shrink-0">
                        <Users className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">
                        {event.registrations_count}
                    </span>
                    {event.max_participants && (
                        <span className="text-xs text-gray-400">/ {event.max_participants}</span>
                    )}
                </div>
            </td>
            {/* Juri */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center
                                    justify-center shrink-0">
                        <UserCog className="w-3 h-3 text-violet-600" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">
                        {event.jury_assignments_count}
                    </span>
                </div>
            </td>
            {/* Periode */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{event.event_start}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 pl-5">s/d {event.event_end}</p>
            </td>
            {/* Aksi */}
            <td className="px-5 py-4">
                <Link href={route('admin.reports.leaderboard', event.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700
                               border border-amber-100 rounded-xl text-xs font-bold
                               hover:bg-amber-100 hover:-translate-y-0.5 transition-all duration-200
                               whitespace-nowrap">
                    <Trophy className="w-3.5 h-3.5" />
                    Leaderboard
                </Link>
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function EventMobileCard({ event, index }) {
    const cfg = STATUS_CFG[event.status] ?? STATUS_CFG.draft;
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50/40
                       hover:border-indigo-200 transition-colors duration-200">
            <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                    <p className="font-bold text-gray-800 text-sm">{event.title}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {event.location ?? 'Lokasi belum ditentukan'}
                    </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold
                                  px-2.5 py-1 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs mb-3">
                <span className="flex items-center gap-1 text-gray-600 font-medium">
                    <Users className="w-3 h-3 text-indigo-400" />
                    {event.registrations_count}
                    {event.max_participants ? `/${event.max_participants}` : ''} peserta
                </span>
                <span className="flex items-center gap-1 text-gray-600 font-medium">
                    <UserCog className="w-3 h-3 text-violet-400" />
                    {event.jury_assignments_count} juri
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                    <CalendarDays className="w-3 h-3" />
                    {event.event_start} – {event.event_end}
                </span>
            </div>
            <Link href={route('admin.reports.leaderboard', event.id)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-50
                           text-amber-700 border border-amber-100 rounded-2xl text-xs font-bold
                           hover:bg-amber-100 hover:-translate-y-0.5 transition-all duration-200">
                <Trophy className="w-3.5 h-3.5" />
                Lihat Leaderboard
            </Link>
        </motion.div>
    );
}