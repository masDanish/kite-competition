import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileImage, Filter, CheckCircle2, XCircle,
    ChevronLeft, ChevronRight, Eye, Star,
    AlertTriangle, X, Tag, Image
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const STATUS_CFG = {
    draft:     { label: 'Draft',     bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
    submitted: { label: 'Dikirim',   bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    approved:  { label: 'Disetujui', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rejected:  { label: 'Ditolak',   bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
};

const inputClass =
    "border border-gray-200 rounded-2xl px-4 py-2.5 text-sm bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent " +
    "transition-all duration-200";

export default function SubmissionsIndex({ submissions, events, filters }) {
    const [eventFilter,  setEventFilter]  = useState(filters.event_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status   ?? '');
    const [rejectModal,  setRejectModal]  = useState(null);
    const [filterOpen,   setFilterOpen]   = useState(false);

    function applyFilter() {
        router.get(route('admin.submissions.index'),
            { event_id: eventFilter, status: statusFilter },
            { preserveState: true });
        setFilterOpen(false);
    }

    function approve(id) {
        if (confirm('Setujui karya ini untuk dinilai juri?')) {
            router.patch(route('admin.submissions.approve', id));
        }
    }

    return (
        <AdminLayout header="Manajemen Karya">
            <Head title="Karya" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-4 sm:p-6 mb-5 sm:mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 shrink-0" />
                            <span className="text-indigo-300 text-xs sm:text-sm font-medium truncate">
                                Panel Administrator
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black">Manajemen Karya 🎨</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1">
                            Total{' '}
                            <span className="font-bold text-white">{submissions.total}</span>
                            {' '}karya masuk dalam sistem.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-3xl sm:text-5xl shrink-0 hidden xs:block">
                        🖼️
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Filter ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-5 sm:mb-6">

                {/* Filter header — toggleable on mobile */}
                <button
                    onClick={() => setFilterOpen(v => !v)}
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4
                               border-b border-gray-100 sm:cursor-default"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                        </div>
                        <h2 className="font-bold text-gray-800 text-sm sm:text-base">Filter Karya</h2>
                    </div>
                    {/* Chevron hanya di mobile */}
                    <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 sm:hidden
                                    ${filterOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Filter body — always visible on sm+, collapsible on xs */}
                <div className={`${filterOpen ? 'block' : 'hidden'} sm:block`}>
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500
                                              uppercase tracking-wider mb-1.5">Filter Event</label>
                            <select className={`w-full ${inputClass}`}
                                value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
                                <option value="">Semua Event</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500
                                              uppercase tracking-wider mb-1.5">Status</label>
                            <select className={`w-full ${inputClass}`}
                                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="">Semua Status</option>
                                <option value="submitted">Dikirim</option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <button onClick={applyFilter}
                            className="flex items-center justify-center gap-2 bg-gradient-to-br
                                       from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-2xl
                                       text-sm font-bold shadow-md shadow-indigo-200
                                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300
                                       transition-all duration-200 w-full sm:w-auto">
                            <Filter className="w-4 h-4" /> Terapkan
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Table / Cards ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                        <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-sm sm:text-base">Daftar Karya</h2>
                </div>

                {/* Desktop Table — md+ */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                        <thead>
                            <tr className="bg-gray-50">
                                {['Karya', 'Peserta', 'Event / Kategori', 'Penilaian', 'Status', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 lg:px-5 py-3.5 text-left text-xs font-bold
                                                            text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody
                            initial="hidden" animate="show" variants={stagger}
                            className="divide-y divide-gray-50">
                            {submissions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <EmptyState />
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {submissions.data.map((sub, i) => (
                                        <SubRow key={sub.id} sub={sub} index={i}
                                            onApprove={approve}
                                            onReject={() => setRejectModal({ id: sub.id, title: sub.title })} />
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Mobile / Tablet Cards — sm and below */}
                <div className="md:hidden p-3 sm:p-4 space-y-3">
                    {submissions.data.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <AnimatePresence>
                            {submissions.data.map((sub, i) => (
                                <SubMobileCard key={sub.id} sub={sub} index={i}
                                    onApprove={approve}
                                    onReject={() => setRejectModal({ id: sub.id, title: sub.title })} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Pagination */}
                {submissions.last_page > 1 && (
                    <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-gray-100 flex
                                    justify-between items-center flex-wrap gap-3">
                        <span className="text-xs text-gray-400 font-medium">
                            Hal{' '}
                            <span className="text-gray-700 font-bold">{submissions.current_page}</span>
                            {' '}dari{' '}
                            <span className="text-gray-700 font-bold">{submissions.last_page}</span>
                        </span>
                        <div className="flex gap-2">
                            {submissions.prev_page_url && (
                                <Link href={submissions.prev_page_url}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border
                                               border-gray-200 rounded-2xl text-xs font-semibold
                                               text-gray-600 hover:border-indigo-300 hover:text-indigo-600
                                               hover:-translate-y-0.5 transition-all duration-200 bg-white shadow-sm">
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Sebelumnya</span>
                                </Link>
                            )}
                            {submissions.next_page_url && (
                                <Link href={submissions.next_page_url}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border
                                               border-gray-200 rounded-2xl text-xs font-semibold
                                               text-gray-600 hover:border-indigo-300 hover:text-indigo-600
                                               hover:-translate-y-0.5 transition-all duration-200 bg-white shadow-sm">
                                    <span className="hidden sm:inline">Selanjutnya</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
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
                        title={rejectModal.title}
                        onConfirm={reason => {
                            router.patch(route('admin.submissions.reject', rejectModal.id),
                                { reason },
                                { onSuccess: () => setRejectModal(null) });
                        }}
                        onClose={() => setRejectModal(null)}
                    />
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}

/* ── Empty State ── */
function EmptyState() {
    return (
        <div className="flex flex-col items-center py-12 sm:py-16 text-gray-400">
            <motion.div animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl sm:text-5xl mb-3">🖼️</motion.div>
            <p className="text-sm">Belum ada karya yang dikirim.</p>
        </div>
    );
}

/* ── Desktop Row ── */
function SubRow({ sub, onApprove, onReject }) {
    return (
        <motion.tr variants={fadeUp}
            className="hover:bg-indigo-50/30 transition-colors duration-150">
            {/* Karya */}
            <td className="px-4 lg:px-5 py-4">
                <div className="flex items-center gap-2 lg:gap-3">
                    {sub.photo_url ? (
                        <img src={`/storage/${sub.photo_url}`} alt="foto karya"
                            className="w-12 lg:w-14 h-9 lg:h-10 object-cover rounded-xl
                                       border border-gray-100 shrink-0" />
                    ) : (
                        <div className="w-12 lg:w-14 h-9 lg:h-10 bg-gray-100 rounded-xl
                                        flex items-center justify-center shrink-0">
                            <Image className="w-4 h-4 text-gray-300" />
                        </div>
                    )}
                    <p className="font-bold text-gray-800 text-sm max-w-[120px] lg:max-w-[160px] truncate">
                        {sub.title}
                    </p>
                </div>
            </td>
            {/* Peserta */}
            <td className="px-4 lg:px-5 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400
                                    to-blue-500 flex items-center justify-center text-white
                                    text-xs font-bold shrink-0">
                        {sub.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-xs truncate max-w-[110px] lg:max-w-none">
                            {sub.user?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[110px] lg:max-w-none">
                            {sub.user?.email}
                        </p>
                    </div>
                </div>
            </td>
            {/* Event / Kategori */}
            <td className="px-4 lg:px-5 py-4">
                <p className="text-xs text-gray-600 font-medium max-w-[120px] lg:max-w-[160px] truncate">
                    {sub.registration?.event?.title}
                </p>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5
                                 rounded-full border border-indigo-100 font-semibold">
                    {sub.registration?.category?.name}
                </span>
            </td>
            {/* Penilaian */}
            <td className="px-4 lg:px-5 py-4 text-center">
                <div className={`inline-flex items-center gap-1 text-sm font-black
                    ${sub.scores_count > 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                    <Star className="w-3.5 h-3.5" fill="currentColor" />
                    {sub.scores_count}
                </div>
                <p className="text-xs text-gray-400">nilai</p>
            </td>
            {/* Status */}
            <td className="px-4 lg:px-5 py-4">
                <StatusBadge status={sub.status} />
            </td>
            {/* Aksi */}
            <td className="px-4 lg:px-5 py-4">
                <ActionCell sub={sub} onApprove={onApprove} onReject={onReject} />
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function SubMobileCard({ sub, index, onApprove, onReject }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-gray-50/40
                       hover:border-indigo-200 transition-colors duration-200">
            {/* Top row: image + title + status */}
            <div className="flex gap-3 mb-3">
                {sub.photo_url ? (
                    <img src={`/storage/${sub.photo_url}`} alt="foto karya"
                        className="w-14 sm:w-16 h-11 sm:h-12 object-cover rounded-xl
                                   border border-gray-100 shrink-0" />
                ) : (
                    <div className="w-14 sm:w-16 h-11 sm:h-12 bg-gray-100 rounded-xl
                                    flex items-center justify-center shrink-0">
                        <Image className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">
                            {sub.title}
                        </p>
                        <StatusBadge status={sub.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{sub.user?.name}</p>
                </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs mb-3">
                <span className="text-gray-500 truncate max-w-[180px]">
                    {sub.registration?.event?.title}
                </span>
                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600
                                 px-2 py-0.5 rounded-full border border-indigo-100 font-semibold">
                    <Tag className="w-3 h-3" />
                    {sub.registration?.category?.name}
                </span>
                <span className={`flex items-center gap-1 font-bold
                    ${sub.scores_count > 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                    <Star className="w-3 h-3" fill="currentColor" />
                    {sub.scores_count} penilaian
                </span>
            </div>

            {/* Actions */}
            <ActionCell sub={sub} onApprove={onApprove} onReject={onReject} mobile />
        </motion.div>
    );
}

/* ── Action Cell ── */
function ActionCell({ sub, onApprove, onReject, mobile }) {
    const base = mobile
        ? 'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95'
        : 'flex items-center gap-1.5 px-2 lg:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap';

    return (
        <div className={`flex gap-1.5 sm:gap-2 ${mobile ? 'w-full' : 'flex-col'}`}>
            <Link href={route('admin.submissions.show', sub.id)}
                className={`${base} bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100`}>
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>Detail</span>
            </Link>
            {sub.status === 'submitted' && (
                <>
                    <button onClick={() => onApprove(sub.id)}
                        className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100`}>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Setujui</span>
                    </button>
                    <button onClick={onReject}
                        className={`${base} bg-red-50 text-red-600 border border-red-100 hover:bg-red-100`}>
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Tolak</span>
                    </button>
                </>
            )}
        </div>
    );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
    return (
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-xs font-bold
                          px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0
                          ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            <span className="leading-none">{cfg.label}</span>
        </span>
    );
}

/* ── Reject Modal ── */
function RejectModal({ title, onConfirm, onClose }) {
    const [reason, setReason] = useState('');
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center
                       justify-center z-50 p-0 sm:p-4">
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl
                           w-full sm:max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Tolak Karya</h3>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl
                                   hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-5 sm:p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        Karya <span className="font-bold text-gray-800">"{title}"</span> akan ditolak.
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
                        rows={3} value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Jelaskan alasan penolakan karya..." autoFocus />
                </div>
                <div className="flex gap-3 px-5 sm:px-6 pb-5 sm:pb-6">
                    <button onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border
                                   border-gray-200 rounded-2xl text-sm font-bold text-gray-500
                                   hover:bg-gray-50 transition-all duration-200">
                        <X className="w-4 h-4" /> Batal
                    </button>
                    <button onClick={() => reason.trim() && onConfirm(reason)}
                        disabled={!reason.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5
                                   bg-gradient-to-br from-red-500 to-red-600 text-white
                                   rounded-2xl text-sm font-bold shadow-md shadow-red-200
                                   hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-300
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   disabled:translate-y-0 transition-all duration-200">
                        <XCircle className="w-4 h-4" /> Konfirmasi
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}