import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Filter, CheckCircle2, XCircle,
    ChevronLeft, ChevronRight, Users, Tag,
    CalendarDays, Info, X, AlertTriangle,
    UserCircle2, Mail, Swords
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const STATUS_CFG = {
    pending:  { label: 'Menunggu',  bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
    approved: { label: 'Disetujui', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rejected: { label: 'Ditolak',  bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
};

const inputClass =
    "border border-gray-200 rounded-2xl px-4 py-2.5 text-sm bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent " +
    "transition-all duration-200";

export default function RegistrationsIndex({ registrations, events, filters }) {
    const [eventFilter,  setEventFilter]  = useState(filters?.event_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status   ?? '');
    const [rejectModal,  setRejectModal]  = useState(null);

    function applyFilter() {
        router.get(
            route('admin.registrations.index'),
            { event_id: eventFilter, status: statusFilter },
            { preserveState: true, preserveScroll: true }
        );
    }

    function approve(id) {
        if (confirm('Setujui pendaftaran ini?')) {
            router.patch(route('admin.registrations.approve', id), {}, { preserveScroll: true });
        }
    }

    const total = registrations?.total ?? 0;

    return (
        <AdminLayout header="Manajemen Pendaftaran">
            <Head title="Pendaftaran" />

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
                            <ClipboardList className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-2xl font-black">Manajemen Pendaftaran 📋</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Total{' '}
                            <span className="font-bold text-white">{total}</span>
                            {' '}data pendaftaran ditemukan.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl hidden md:block">
                        📝
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Filter Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Filter className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="font-bold text-gray-800">Filter Pendaftaran</h2>
                </div>
                <div className="p-6 flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs font-bold text-gray-500
                                          uppercase tracking-wider mb-1.5">
                            Filter Event
                        </label>
                        <select className={`w-full ${inputClass}`}
                            value={eventFilter}
                            onChange={e => setEventFilter(e.target.value)}>
                            <option value="">Semua Event</option>
                            {events?.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-xs font-bold text-gray-500
                                          uppercase tracking-wider mb-1.5">
                            Status
                        </label>
                        <select className={`w-full ${inputClass}`}
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}>
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                    <button
                        onClick={applyFilter}
                        className="flex items-center gap-2 bg-gradient-to-br from-indigo-600
                                   to-blue-600 text-white px-5 py-2.5 rounded-2xl text-sm
                                   font-bold shadow-md shadow-indigo-200 hover:-translate-y-0.5
                                   hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200">
                        <Filter className="w-4 h-4" />
                        Terapkan
                    </button>
                </div>
            </motion.div>

            {/* ── Table Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="font-bold text-gray-800">Daftar Pendaftaran</h2>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {['Peserta', 'Event', 'Kategori', 'Tim', 'Tanggal Daftar', 'Status', 'Aksi'].map(h => (
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

                            {registrations?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="flex flex-col items-center py-16 text-gray-400">
                                            <motion.div
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="text-5xl mb-3">📭</motion.div>
                                            <p className="text-sm">Tidak ada data pendaftaran.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            <AnimatePresence>
                                {registrations?.data?.map((reg, i) => (
                                    <RegRow
                                        key={reg.id}
                                        reg={reg}
                                        index={i}
                                        onApprove={approve}
                                        onReject={() => setRejectModal({ id: reg.id, name: reg.user?.name })}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-3">
                    {registrations?.data?.length === 0 && (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <div className="text-5xl mb-3">📭</div>
                            <p className="text-sm">Tidak ada data pendaftaran.</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {registrations?.data?.map((reg, i) => (
                            <RegMobileCard
                                key={reg.id}
                                reg={reg}
                                index={i}
                                onApprove={approve}
                                onReject={() => setRejectModal({ id: reg.id, name: reg.user?.name })}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {registrations?.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between
                                    items-center flex-wrap gap-3">
                        <span className="text-xs text-gray-400 font-medium">
                            Halaman{' '}
                            <span className="text-gray-700 font-bold">{registrations.current_page}</span>
                            {' '}dari{' '}
                            <span className="text-gray-700 font-bold">{registrations.last_page}</span>
                        </span>
                        <div className="flex gap-2">
                            {registrations.prev_page_url && (
                                <Link href={registrations.prev_page_url}
                                    className="flex items-center gap-1.5 px-4 py-2 border
                                               border-gray-200 rounded-2xl text-xs font-semibold
                                               text-gray-600 hover:border-indigo-300
                                               hover:text-indigo-600 hover:-translate-y-0.5
                                               transition-all duration-200 bg-white shadow-sm">
                                    <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
                                </Link>
                            )}
                            {registrations.next_page_url && (
                                <Link href={registrations.next_page_url}
                                    className="flex items-center gap-1.5 px-4 py-2 border
                                               border-gray-200 rounded-2xl text-xs font-semibold
                                               text-gray-600 hover:border-indigo-300
                                               hover:text-indigo-600 hover:-translate-y-0.5
                                               transition-all duration-200 bg-white shadow-sm">
                                    Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* ── Reject Modal ── */}
            <AnimatePresence>
                {rejectModal && (
                    <RejectModal
                        name={rejectModal.name}
                        onConfirm={reason => {
                            router.patch(
                                route('admin.registrations.reject', rejectModal.id),
                                { reason },
                                { onSuccess: () => setRejectModal(null) }
                            );
                        }}
                        onClose={() => setRejectModal(null)}
                    />
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}

/* ── Desktop Row ── */
function RegRow({ reg, index, onApprove, onReject }) {
    return (
        <motion.tr
            variants={fadeUp}
            className="hover:bg-indigo-50/30 transition-colors duration-150">

            {/* Peserta */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400
                                    to-blue-500 flex items-center justify-center text-white
                                    text-xs font-bold shrink-0">
                        {reg.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">{reg.user?.name}</p>
                        <p className="text-xs text-gray-400">{reg.user?.email}</p>
                    </div>
                </div>
            </td>

            {/* Event */}
            <td className="px-5 py-4">
                <p className="text-xs text-gray-600 font-medium max-w-[160px] truncate">
                    {reg.event?.title}
                </p>
            </td>

            {/* Kategori */}
            <td className="px-5 py-4">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1
                                 rounded-full font-semibold border border-indigo-100">
                    {reg.category?.name}
                </span>
            </td>

            {/* Tim */}
            <td className="px-5 py-4 text-xs text-gray-500">
                {reg.team_name ?? <span className="text-gray-300">—</span>}
            </td>

            {/* Tanggal */}
            <td className="px-5 py-4 text-xs text-gray-500">
                {new Date(reg.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                })}
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <StatusBadge status={reg.status} />
            </td>

            {/* Aksi */}
            <td className="px-5 py-4">
                <ActionCell reg={reg} onApprove={onApprove} onReject={onReject} />
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function RegMobileCard({ reg, index, onApprove, onReject }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50/40
                       hover:border-indigo-200 transition-colors duration-200">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400
                                to-blue-500 flex items-center justify-center text-white
                                font-bold text-sm shrink-0">
                    {reg.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{reg.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{reg.user?.email}</p>
                </div>
                <StatusBadge status={reg.status} />
            </div>

            <div className="flex flex-wrap gap-2 mb-3 text-xs">
                <span className="flex items-center gap-1 text-gray-500">
                    <CalendarDays className="w-3 h-3" />
                    {reg.event?.title}
                </span>
                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600
                                 px-2 py-0.5 rounded-full border border-indigo-100 font-semibold">
                    <Tag className="w-3 h-3" />
                    {reg.category?.name}
                </span>
                {reg.team_name && (
                    <span className="flex items-center gap-1 text-gray-500">
                        <Swords className="w-3 h-3" />
                        {reg.team_name}
                    </span>
                )}
            </div>

            <ActionCell reg={reg} onApprove={onApprove} onReject={onReject} mobile />
        </motion.div>
    );
}

/* ── Action Cell ── */
function ActionCell({ reg, onApprove, onReject, mobile }) {
    const base = mobile
        ? 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5'
        : 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5';

    if (reg.status === 'pending') {
        return (
            <div className={`flex gap-2 ${mobile ? 'w-full' : ''}`}>
                <button onClick={() => onApprove(reg.id)}
                    className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100
                                 hover:bg-emerald-100`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                </button>
                <button onClick={onReject}
                    className={`${base} bg-red-50 text-red-600 border border-red-100
                                 hover:bg-red-100`}>
                    <XCircle className="w-3.5 h-3.5" /> Tolak
                </button>
            </div>
        );
    }

    if (reg.status === 'rejected' && reg.rejection_reason) {
        return (
            <div className="flex items-start gap-1.5 text-xs text-gray-400 max-w-[180px]">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                <span className="italic truncate">{reg.rejection_reason}</span>
            </div>
        );
    }

    return null;
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1
                          rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

/* ── Reject Modal ── */
function RejectModal({ name, onConfirm, onClose }) {
    const [reason, setReason] = useState('');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center
                       justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Tolak Pendaftaran</h3>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl
                                   hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        Pendaftaran dari{' '}
                        <span className="font-bold text-gray-800">{name}</span>
                        {' '}akan ditolak. Berikan alasan yang jelas.
                    </p>
                    <label className="block text-xs font-bold text-gray-500
                                      uppercase tracking-wider mb-1.5">
                        Alasan Penolakan *
                    </label>
                    <textarea
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3
                                   text-sm focus:outline-none focus:ring-2 focus:ring-red-400
                                   focus:border-transparent transition-all duration-200
                                   placeholder:text-gray-300 resize-none"
                        rows={3}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Jelaskan alasan penolakan..."
                        autoFocus
                    />
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 px-6 pb-6">
                    <button onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border
                                   border-gray-200 rounded-2xl text-sm font-bold text-gray-500
                                   hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                        <X className="w-4 h-4" /> Batal
                    </button>
                    <button
                        disabled={!reason.trim()}
                        onClick={() => onConfirm(reason)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5
                                   bg-gradient-to-br from-red-500 to-red-600 text-white
                                   rounded-2xl text-sm font-bold shadow-md shadow-red-200
                                   hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-300
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   disabled:translate-y-0 transition-all duration-200">
                        <XCircle className="w-4 h-4" /> Konfirmasi Tolak
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}