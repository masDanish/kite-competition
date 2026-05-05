import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Megaphone, CalendarDays, FileText, Tag,
    Save, X, Info, Trophy, RefreshCw,
    AlertTriangle, Pencil
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const inputClass =
    "w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent " +
    "placeholder:text-gray-300 transition-all duration-200";

const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

const TYPE_OPTS = [
    { value: 'info',    label: 'Info',       icon: Info,          active: 'bg-indigo-100 border-indigo-400 text-indigo-700' },
    { value: 'winner',  label: 'Pemenang',   icon: Trophy,        active: 'bg-amber-100 border-amber-400 text-amber-700'   },
    { value: 'update',  label: 'Update',     icon: RefreshCw,     active: 'bg-blue-100 border-blue-400 text-blue-700'      },
    { value: 'warning', label: 'Peringatan', icon: AlertTriangle, active: 'bg-red-100 border-red-400 text-red-700'         },
];

function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium">
            <Info className="w-3 h-3 shrink-0" /> {msg}
        </p>
    );
}

function SectionCard({ icon: Icon, iconBg, iconColor, title, children, delay = 0 }) {
    return (
        <motion.div
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <h2 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h2>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </motion.div>
    );
}

export default function AnnouncementsEdit({ announcement, events }) {
    const { data, setData, patch, processing, errors } = useForm({
        event_id:     announcement.event_id,
        title:        announcement.title,
        content:      announcement.content,
        type:         announcement.type,
        is_published: announcement.is_published,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.announcements.update', announcement.id));
    }

    return (
        <AdminLayout header="Edit Pengumuman">
            <Head title="Edit Pengumuman" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Pencil className="w-4 h-4 text-indigo-300 shrink-0" />
                            <span className="text-indigo-300 text-xs sm:text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black">Edit Pengumuman ✏️</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1 truncate max-w-full">
                            {announcement.title}
                        </p>
                    </div>
                    {/* Live publish status */}
                    <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl
                                     font-bold text-xs sm:text-sm shrink-0
                                     ${data.is_published
                                         ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                                         : 'bg-slate-500/20 border border-slate-400/30 text-slate-300'}`}>
                        <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full
                            ${data.is_published ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                        <span className="hidden xs:inline">
                            {data.is_published ? 'Sedang Tayang' : 'Draft'}
                        </span>
                    </div>
                </div>
            </motion.div>

            <form onSubmit={submit} className="w-full max-w-2xl space-y-6">
                <SectionCard icon={Megaphone} iconBg="bg-amber-100" iconColor="text-amber-600"
                    title="Detail Pengumuman" delay={0.1}>
                    <div className="space-y-5">

                        {/* Event */}
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" /> Event *
                                </span>
                            </label>
                            <select className={inputClass} value={data.event_id}
                                onChange={e => setData('event_id', e.target.value)}>
                                <option value="">-- Pilih Event --</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                                ))}
                            </select>
                            <FieldError msg={errors.event_id} />
                        </div>

                        {/* Judul */}
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Judul Pengumuman *
                                </span>
                            </label>
                            <input className={inputClass} value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Judul pengumuman..." />
                            <FieldError msg={errors.title} />
                        </div>

                        {/* Isi */}
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Isi Pengumuman *
                                </span>
                            </label>
                            <textarea className={inputClass} rows={6} value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                placeholder="Tulis isi pengumuman di sini..." />
                            <FieldError msg={errors.content} />
                        </div>

                        {/* Tipe */}
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Tipe Pengumuman *
                                </span>
                            </label>
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                                {TYPE_OPTS.map(opt => {
                                    const Icon     = opt.icon;
                                    const isActive = data.type === opt.value;
                                    return (
                                        <motion.label key={opt.value}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5
                                                        rounded-2xl border-2 cursor-pointer
                                                        text-xs sm:text-sm font-bold transition-all duration-200
                                                        ${isActive
                                                            ? opt.active
                                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            <input type="radio" name="type" value={opt.value}
                                                checked={isActive}
                                                onChange={() => setData('type', opt.value)}
                                                className="hidden" />
                                            <Icon className="w-3.5 h-3.5 shrink-0" />
                                            {opt.label}
                                        </motion.label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Publish Toggle */}
                        <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                            <button type="button"
                                onClick={() => setData('is_published', !data.is_published)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full
                                            transition-colors duration-300 focus:outline-none shrink-0
                                            ${data.is_published ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                                <motion.span layout
                                    className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
                                    animate={{ x: data.is_published ? 22 : 4 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                            </button>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-700">
                                    {data.is_published ? '✅ Sedang tayang' : 'Draft — belum tayang'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {data.is_published
                                        ? 'Peserta dapat melihat pengumuman ini'
                                        : 'Pengumuman tidak terlihat oleh peserta'}
                                </p>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* Actions */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-col sm:flex-row gap-3 pb-8">
                    <button type="submit" disabled={processing}
                        className="flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600
                                   to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm
                                   shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg
                                   hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed
                                   disabled:translate-y-0 transition-all duration-200 w-full sm:w-auto">
                        {processing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30
                                                 border-t-white rounded-full animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <><Save className="w-4 h-4" /> Simpan Perubahan</>
                        )}
                    </button>
                    <Link href={route('admin.announcements.index')}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200
                                   rounded-2xl text-sm font-bold text-gray-500 bg-white shadow-sm
                                   hover:border-red-200 hover:text-red-500 hover:-translate-y-0.5
                                   transition-all duration-200 w-full sm:w-auto">
                        <X className="w-4 h-4" /> Batal
                    </Link>
                </motion.div>
            </form>
        </AdminLayout>
    );
}