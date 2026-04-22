import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays, Users, PlusCircle, Pencil,
    Trophy, UserCog, Trash2, ChevronLeft,
    ChevronRight, ShieldCheck, Sparkles, LayoutList
} from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};

const STATUS_CFG = {
    draft:    { label: 'Draft',    bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
    open:     { label: 'Open',     bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    closed:   { label: 'Closed',   bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    ongoing:  { label: 'Ongoing',  bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    finished: { label: 'Finished', bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
};

const STATUSES = ['draft', 'open', 'closed', 'ongoing', 'finished'];

export default function EventsIndex({ events }) {
    function changeStatus(eventId, status) {
        router.patch(route('admin.events.status', eventId), { status });
    }

    return (
        <AdminLayout header="Manajemen Event">
            <Head title="Event" />

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
                            <LayoutList className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">
                                Panel Administrator
                            </span>
                        </div>
                        <h1 className="text-2xl font-black">Manajemen Event 📋</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Total{' '}
                            <span className="font-bold text-white">{events.total}</span>
                            {' '}event terdaftar dalam sistem.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-5xl hidden md:block">
                            📋
                        </motion.div>
                        <Link
                            href={route('admin.events.create')}
                            className="flex items-center gap-2 bg-white text-indigo-700
                                       font-bold text-sm px-4 py-2.5 rounded-2xl shadow-lg
                                       hover:bg-indigo-50 hover:-translate-y-0.5 transition-all
                                       duration-200 shrink-0">
                            <PlusCircle className="w-4 h-4" />
                            Buat Event
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* ── Table Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <CalendarDays className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="font-bold text-gray-800">Daftar Event</h2>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-5 py-3.5 text-left text-xs font-bold
                                               text-gray-500 uppercase tracking-wider">
                                    Event
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold
                                               text-gray-500 uppercase tracking-wider">
                                    Periode
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold
                                               text-gray-500 uppercase tracking-wider">
                                    Peserta
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold
                                               text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold
                                               text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <motion.tbody
                            initial="hidden" animate="show" variants={stagger}
                            className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {events.data.map((event, i) => (
                                    <EventRow
                                        key={event.id}
                                        event={event}
                                        index={i}
                                        onStatusChange={changeStatus}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-3">
                    <AnimatePresence>
                        {events.data.map((event, i) => (
                            <EventMobileCard
                                key={event.id}
                                event={event}
                                index={i}
                                onStatusChange={changeStatus}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between
                                items-center flex-wrap gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                        Halaman{' '}
                        <span className="text-gray-700 font-bold">{events.current_page}</span>
                        {' '}dari{' '}
                        <span className="text-gray-700 font-bold">{events.last_page}</span>
                    </span>
                    <div className="flex gap-2">
                        {events.prev_page_url && (
                            <Link
                                href={events.prev_page_url}
                                className="flex items-center gap-1.5 px-4 py-2 border
                                           border-gray-200 rounded-2xl text-xs font-semibold
                                           text-gray-600 hover:border-indigo-300
                                           hover:text-indigo-600 hover:-translate-y-0.5
                                           transition-all duration-200 bg-white shadow-sm">
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Sebelumnya
                            </Link>
                        )}
                        {events.next_page_url && (
                            <Link
                                href={events.next_page_url}
                                className="flex items-center gap-1.5 px-4 py-2 border
                                           border-gray-200 rounded-2xl text-xs font-semibold
                                           text-gray-600 hover:border-indigo-300
                                           hover:text-indigo-600 hover:-translate-y-0.5
                                           transition-all duration-200 bg-white shadow-sm">
                                Selanjutnya
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}

/* ── Desktop Table Row ── */
function EventRow({ event, index, onStatusChange }) {
    const cfg = STATUS_CFG[event.status] ?? STATUS_CFG.draft;

    return (
        <motion.tr
            variants={fadeUp}
            className="hover:bg-indigo-50/30 transition-colors duration-150">

            {/* Event */}
            <td className="px-5 py-4">
                <p className="font-bold text-gray-800 text-sm">{event.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">oleh {event.creator?.name}</p>
            </td>

            {/* Periode */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{event.event_start}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5 pl-5">s/d {event.event_end}</div>
            </td>

            {/* Peserta */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center
                                    justify-center shrink-0">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">
                        {event.registrations_count}
                    </span>
                    {event.max_participants && (
                        <span className="text-xs text-gray-400">
                            / {event.max_participants}
                        </span>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <StatusSelect event={event} cfg={cfg} onChange={onStatusChange} />
            </td>

            {/* Aksi */}
            <td className="px-5 py-4">
                <ActionLinks event={event} />
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function EventMobileCard({ event, index, onStatusChange }) {
    const cfg = STATUS_CFG[event.status] ?? STATUS_CFG.draft;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50/40
                       hover:border-indigo-200 transition-colors duration-200">
            <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                    <p className="font-bold text-gray-800 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-400">oleh {event.creator?.name}</p>
                </div>
                <StatusSelect event={event} cfg={cfg} onChange={onStatusChange} />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {event.event_start} – {event.event_end}
                </span>
                <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.registrations_count}
                    {event.max_participants ? `/${event.max_participants}` : ''}
                </span>
            </div>
            <ActionLinks event={event} mobile />
        </motion.div>
    );
}

/* ── Status Select ── */
function StatusSelect({ event, cfg, onChange }) {
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                         ${cfg.bg} ${cfg.text} font-semibold text-xs`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            <select
                value={event.status}
                onChange={e => onChange(event.id, e.target.value)}
                className="bg-transparent border-0 outline-none cursor-pointer
                           font-semibold text-xs appearance-none pr-1">
                {STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                ))}
            </select>
        </div>
    );
}

/* ── Action Links ── */
function ActionLinks({ event, mobile }) {
    const base = mobile
        ? 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5'
        : 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5';

    return (
        <div className={`flex gap-2 ${mobile ? 'w-full' : ''}`}>
            <Link
                href={route('admin.events.edit', event.id)}
                className={`${base} bg-indigo-50 text-indigo-600 hover:bg-indigo-100
                             border border-indigo-100`}>
                <Pencil className="w-3 h-3" />
                Edit
            </Link>
            <Link
                href={route('admin.reports.leaderboard', event.id)}
                className={`${base} bg-emerald-50 text-emerald-700 hover:bg-emerald-100
                             border border-emerald-100`}>
                <Trophy className="w-3 h-3" />
                {mobile ? 'Board' : 'Leaderboard'}
            </Link>
            <Link
                href={route('admin.jury.index', event.id)}
                className={`${base} bg-violet-50 text-violet-700 hover:bg-violet-100
                             border border-violet-100`}>
                <UserCog className="w-3 h-3" />
                Juri
            </Link>
            <button
                onClick={() => {
                    if (confirm('Hapus event ini?')) {
                        router.delete(route('admin.events.destroy', event.id));
                    }
                }}
                className={`${base} bg-red-50 text-red-600 hover:bg-red-100
                             border border-red-100`}>
                <Trash2 className="w-3 h-3" />
                {mobile ? '' : 'Hapus'}
            </button>
        </div>
    );
}