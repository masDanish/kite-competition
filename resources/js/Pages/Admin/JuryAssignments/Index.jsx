import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCog, PlusCircle, Trash2, ToggleLeft,
    ToggleRight, Tag, Users, ShieldCheck,
    CheckCircle2, XCircle, Save
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

const inputClass =
    "w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent " +
    "placeholder:text-gray-300 transition-all duration-200";

const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

export default function JuryAssignmentsIndex({ event, availableJury }) {
    const assignments = event.jury_assignments ?? [];

    const { data, setData, post, processing, reset } = useForm({
        user_id:     '',
        category_id: '',
    });

    function assign(e) {
        e.preventDefault();
        post(route('admin.jury.assign', event.id), { onSuccess: () => reset() });
    }

    function remove(assignmentId) {
        if (confirm('Hapus penugasan juri ini?')) {
            router.delete(route('admin.jury.destroy', assignmentId));
        }
    }

    function toggle(assignmentId) {
        router.patch(route('admin.jury.toggle', assignmentId));
    }

    const activeCount   = assignments.filter(a => a.is_active).length;
    const inactiveCount = assignments.length - activeCount;

    return (
        <AdminLayout header={`Penugasan Juri — ${event.title}`}>
            <Head title="Penugasan Juri" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <UserCog className="w-4 h-4 text-indigo-300 shrink-0" />
                            <span className="text-indigo-300 text-xs sm:text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black">Penugasan Juri 👨‍⚖️</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1 truncate max-w-[260px] sm:max-w-lg">
                            {event.title}
                        </p>
                    </div>
                    {/* Stats chips */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-emerald-500/20 border
                                         border-emerald-400/30 text-emerald-300 text-xs font-bold
                                         px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {activeCount} Aktif
                        </span>
                        {inactiveCount > 0 && (
                            <span className="flex items-center gap-1.5 bg-slate-500/20 border
                                             border-slate-400/30 text-slate-300 text-xs font-bold
                                             px-3 py-1.5 rounded-full">
                                <XCircle className="w-3.5 h-3.5" />
                                {inactiveCount} Nonaktif
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

                {/* ── Form Assign ── */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                            <PlusCircle className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h2 className="font-bold text-gray-800 text-sm sm:text-base">Tambah Juri</h2>
                    </div>
                    <form onSubmit={assign} className="p-4 sm:p-6 space-y-4">
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Pilih Juri *
                                </span>
                            </label>
                            <select className={inputClass}
                                value={data.user_id}
                                onChange={e => setData('user_id', e.target.value)}>
                                <option value="">-- Pilih Juri --</option>
                                {availableJury.map(j => (
                                    <option key={j.id} value={j.id}>{j.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Kategori (opsional)
                                </span>
                            </label>
                            <select className={inputClass}
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}>
                                <option value="">Semua Kategori</option>
                                {event.categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" disabled={processing || !data.user_id}
                            className="flex items-center justify-center gap-2 w-full
                                       bg-gradient-to-br from-indigo-600 to-blue-600 text-white
                                       py-3 rounded-2xl text-sm font-bold shadow-md shadow-indigo-200
                                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       disabled:translate-y-0 transition-all duration-200 active:scale-95">
                            {processing ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30
                                                     border-t-white rounded-full animate-spin" />
                                    Menugaskan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Tugaskan Juri
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* ── Daftar Juri ── */}
                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h2 className="font-bold text-gray-800 text-sm sm:text-base">Juri Ditugaskan</h2>
                        </div>
                        {assignments.length > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold
                                             px-2.5 py-1 rounded-full border border-indigo-200 shrink-0">
                                {assignments.length} juri
                            </span>
                        )}
                    </div>

                    <div className="p-4 sm:p-6">
                        {assignments.length === 0 ? (
                            <div className="flex flex-col items-center py-10 sm:py-12 text-gray-400">
                                <motion.div animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="text-4xl mb-3">👨‍⚖️</motion.div>
                                <p className="text-sm">Belum ada juri yang ditugaskan.</p>
                            </div>
                        ) : (
                            <motion.div
                                initial="hidden" animate="show" variants={stagger}
                                className="space-y-3">
                                <AnimatePresence>
                                    {assignments.map(a => (
                                        <AssignmentCard
                                            key={a.id}
                                            assignment={a}
                                            onToggle={() => toggle(a.id)}
                                            onRemove={() => remove(a.id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}

/* ── Assignment Card ── */
function AssignmentCard({ assignment: a, onToggle, onRemove }) {
    return (
        <motion.div
            variants={fadeUp}
            layout
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-2xl border
                        transition-all duration-200 gap-2
                        ${a.is_active
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : 'border-gray-200 bg-gray-50/50 opacity-60'}`}>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Avatar */}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center
                                 text-white font-bold text-sm shrink-0
                                 ${a.is_active
                                     ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                                     : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                    {a.jury?.name?.charAt(0).toUpperCase() ?? 'J'}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{a.jury?.name}</p>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="truncate">{a.category?.name ?? 'Semua Kategori'}</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                {/* Status badge — hidden on xs */}
                <span className={`text-xs font-bold px-2 py-1 rounded-full hidden sm:inline-flex
                                  items-center gap-1.5
                                  ${a.is_active
                                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                      : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full
                        ${a.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {a.is_active ? 'Aktif' : 'Nonaktif'}
                </span>

                {/* Toggle */}
                <button onClick={onToggle}
                    className={`flex items-center gap-1 text-xs font-bold px-2 sm:px-2.5 py-1.5
                                rounded-xl border transition-all duration-200 active:scale-95
                                ${a.is_active
                                    ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'}`}>
                    {a.is_active
                        ? <ToggleRight className="w-3.5 h-3.5" />
                        : <ToggleLeft  className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">
                        {a.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </span>
                </button>

                {/* Remove */}
                <button onClick={onRemove}
                    className="flex items-center gap-1 text-xs font-bold px-2 sm:px-2.5 py-1.5
                               bg-red-50 text-red-600 border border-red-100 rounded-xl
                               hover:bg-red-100 active:scale-95 transition-all duration-200">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}