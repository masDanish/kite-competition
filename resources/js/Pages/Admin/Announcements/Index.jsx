import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, PlusCircle, Pencil, Trash2,
    Eye, EyeOff, Trophy, RefreshCw,
    AlertTriangle, Info, ChevronLeft, ChevronRight,
    CalendarDays
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const TYPE_CFG = {
    winner:  { label: 'Pemenang',   icon: Trophy,        bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
    update:  { label: 'Update',     icon: RefreshCw,     bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
    warning: { label: 'Peringatan', icon: AlertTriangle, bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400'    },
    info:    { label: 'Info',       icon: Info,          bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-400' },
};

export default function AnnouncementsIndex({ announcements }) {
    function togglePublish(ann) {
        const action = ann.is_published ? 'sembunyikan' : 'tayangkan';
        if (confirm(`${action} pengumuman ini?`)) {
            router.patch(
                ann.is_published
                    ? route('admin.announcements.unpublish', ann.id)
                    : route('admin.announcements.publish',   ann.id)
            );
        }
    }

    function destroy(id) {
        if (confirm('Hapus pengumuman ini?')) {
            router.delete(route('admin.announcements.destroy', id));
        }
    }

    return (
        <AdminLayout header="Pengumuman">
            <Head title="Pengumuman" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-start sm:items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Megaphone className="w-4 h-4 text-indigo-300 shrink-0" />
                            <span className="text-indigo-300 text-xs sm:text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black">Manajemen Pengumuman 📢</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1">
                            Total{' '}
                            <span className="font-bold text-white">{announcements.total}</span>
                            {' '}pengumuman terdaftar.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <motion.div
                            animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-3xl sm:text-5xl hidden sm:block">
                            📢
                        </motion.div>
                        <Link
                            href={route('admin.announcements.create')}
                            className="flex items-center gap-1.5 sm:gap-2 bg-white text-indigo-700
                                       font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg
                                       hover:bg-indigo-50 hover:-translate-y-0.5 transition-all
                                       duration-200 whitespace-nowrap">
                            <PlusCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            <span className="hidden xs:inline">Buat Pengumuman</span>
                            <span className="xs:hidden">Buat</span>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* ── Table Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <Megaphone className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-sm sm:text-base">Daftar Pengumuman</h2>
                </div>

                {/* Desktop Table — hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {['Judul', 'Event', 'Tipe', 'Status', 'Tanggal', 'Aksi'].map(h => (
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
                            {announcements.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="flex flex-col items-center py-16 text-gray-400">
                                            <motion.div animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="text-5xl mb-3">📭</motion.div>
                                            <p className="text-sm">Belum ada pengumuman.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {announcements.data.map(ann => (
                                        <AnnRow key={ann.id} ann={ann}
                                            onToggle={() => togglePublish(ann)}
                                            onDelete={() => destroy(ann.id)} />
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Mobile / Tablet Cards */}
                <div className="lg:hidden p-3 sm:p-4 space-y-3">
                    {announcements.data.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <div className="text-5xl mb-3">📭</div>
                            <p className="text-sm">Belum ada pengumuman.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {announcements.data.map((ann, i) => (
                                <AnnMobileCard key={ann.id} ann={ann} index={i}
                                    onToggle={() => togglePublish(ann)}
                                    onDelete={() => destroy(ann.id)} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Pagination */}
                {announcements.last_page > 1 && (
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex justify-between
                                    items-center flex-wrap gap-3">
                        <span className="text-xs text-gray-400 font-medium">
                            Halaman{' '}
                            <span className="text-gray-700 font-bold">{announcements.current_page}</span>
                            {' '}dari{' '}
                            <span className="text-gray-700 font-bold">{announcements.last_page}</span>
                        </span>
                        <div className="flex gap-2">
                            {announcements.prev_page_url && (
                                <Link href={announcements.prev_page_url}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-200
                                               rounded-2xl text-xs font-semibold text-gray-600
                                               hover:border-indigo-300 hover:text-indigo-600
                                               hover:-translate-y-0.5 transition-all duration-200
                                               bg-white shadow-sm">
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Sebelumnya</span>
                                </Link>
                            )}
                            {announcements.next_page_url && (
                                <Link href={announcements.next_page_url}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-200
                                               rounded-2xl text-xs font-semibold text-gray-600
                                               hover:border-indigo-300 hover:text-indigo-600
                                               hover:-translate-y-0.5 transition-all duration-200
                                               bg-white shadow-sm">
                                    <span className="hidden sm:inline">Selanjutnya</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </AdminLayout>
    );
}

/* ── Desktop Row ── */
function AnnRow({ ann, onToggle, onDelete }) {
    const cfg  = TYPE_CFG[ann.type] ?? TYPE_CFG.info;
    const Icon = cfg.icon;

    return (
        <motion.tr variants={fadeUp}
            className="hover:bg-indigo-50/30 transition-colors duration-150">
            <td className="px-5 py-4 max-w-[200px]">
                <p className="font-bold text-gray-800 text-sm truncate">{ann.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{ann.content}</p>
            </td>
            <td className="px-5 py-4">
                <span className="text-xs text-gray-500 font-medium">
                    {ann.event?.title ?? <span className="text-gray-300">—</span>}
                </span>
            </td>
            <td className="px-5 py-4">
                <TypeBadge type={ann.type} />
            </td>
            <td className="px-5 py-4">
                <PublishBadge published={ann.is_published} />
            </td>
            <td className="px-5 py-4 text-xs text-gray-500">
                {ann.published_at
                    ? new Date(ann.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                    : <span className="text-gray-300">—</span>}
            </td>
            <td className="px-5 py-4">
                <ActionButtons ann={ann} onToggle={onToggle} onDelete={onDelete} />
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function AnnMobileCard({ ann, index, onToggle, onDelete }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-3 sm:p-4 rounded-2xl border border-gray-100 bg-gray-50/40
                       hover:border-indigo-200 transition-colors duration-200">
            <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{ann.title}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{ann.content}</p>
                </div>
                <PublishBadge published={ann.is_published} />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                <TypeBadge type={ann.type} />
                {ann.event?.title && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-white
                                     border border-gray-100 px-2.5 py-1 rounded-full">
                        <CalendarDays className="w-3 h-3" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{ann.event.title}</span>
                    </span>
                )}
                {ann.published_at && (
                    <span className="text-xs text-gray-400">
                        {new Date(ann.published_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                    </span>
                )}
            </div>
            <ActionButtons ann={ann} onToggle={onToggle} onDelete={onDelete} mobile />
        </motion.div>
    );
}

/* ── Action Buttons ── */
function ActionButtons({ ann, onToggle, onDelete, mobile }) {
    const base = mobile
        ? 'flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95'
        : 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5';

    return (
        <div className={`flex gap-1.5 sm:gap-2 ${mobile ? 'w-full' : ''}`}>
            <Link href={route('admin.announcements.edit', ann.id)}
                className={`${base} bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100`}>
                <Pencil className="w-3.5 h-3.5 shrink-0" />
                <span className={mobile ? 'hidden xs:inline' : ''}>Edit</span>
            </Link>
            <button onClick={onToggle}
                className={`${base} border transition-all duration-200
                    ${ann.is_published
                        ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'}`}>
                {ann.is_published
                    ? <><EyeOff className="w-3.5 h-3.5 shrink-0" /><span className="hidden sm:inline"> Sembunyikan</span></>
                    : <><Eye className="w-3.5 h-3.5 shrink-0" /><span className="hidden sm:inline"> Tayangkan</span></>}
            </button>
            <button onClick={onDelete}
                className={`${base} bg-red-50 text-red-600 border border-red-100 hover:bg-red-100`}>
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                {mobile && <span className="hidden xs:inline"> Hapus</span>}
            </button>
        </div>
    );
}

/* ── Type Badge ── */
function TypeBadge({ type }) {
    const cfg  = TYPE_CFG[type] ?? TYPE_CFG.info;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-xs font-bold px-2 sm:px-2.5 py-1
                          rounded-full ${cfg.bg} ${cfg.text}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
        </span>
    );
}

/* ── Publish Badge ── */
function PublishBadge({ published }) {
    return published ? (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-bold px-2 sm:px-2.5 py-1
                          rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Tayang
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-bold px-2 sm:px-2.5 py-1
                          rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Draft
        </span>
    );
}