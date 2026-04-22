import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Megaphone, CalendarDays, FileText, Tag,
    Save, X, Info, Trophy, RefreshCw,
    AlertTriangle, Eye, PlusCircle, Pencil
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
    {
        value: 'info',
        label: 'Info',
        icon:  Info,
        active:   'bg-indigo-100 border-indigo-400 text-indigo-700',
        inactive: 'border-gray-200 text-gray-500 hover:border-gray-300',
    },
    {
        value: 'winner',
        label: 'Pemenang',
        icon:  Trophy,
        active:   'bg-amber-100 border-amber-400 text-amber-700',
        inactive: 'border-gray-200 text-gray-500 hover:border-gray-300',
    },
    {
        value: 'update',
        label: 'Update',
        icon:  RefreshCw,
        active:   'bg-blue-100 border-blue-400 text-blue-700',
        inactive: 'border-gray-200 text-gray-500 hover:border-gray-300',
    },
    {
        value: 'warning',
        label: 'Peringatan',
        icon:  AlertTriangle,
        active:   'bg-red-100 border-red-400 text-red-700',
        inactive: 'border-gray-200 text-gray-500 hover:border-gray-300',
    },
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
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ delay }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <h2 className="font-bold text-gray-800">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </motion.div>
    );
}

/* ════════════════════════════════════════
   CREATE
════════════════════════════════════════ */
export function AnnouncementsCreate({ events }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id:     '',
        title:        '',
        content:      '',
        type:         'info',
        is_published: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.announcements.store'));
    }

    return (
        <AdminLayout header="Buat Pengumuman">
            <Head title="Buat Pengumuman" />

            {/* Banner */}
            <motion.div
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-6 mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <PlusCircle className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-2xl font-black">Buat Pengumuman 📢</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Isi detail pengumuman yang akan ditampilkan kepada peserta.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl hidden md:block">📢</motion.div>
                </div>
            </motion.div>

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <AnnouncementFormFields
                    data={data} setData={setData}
                    errors={errors} events={events}
                />
                <FormActions
                    processing={processing}
                    submitLabel="Simpan Pengumuman"
                    backRoute={route('admin.announcements.index')}
                />
            </form>
        </AdminLayout>
    );
}

/* ════════════════════════════════════════
   EDIT
════════════════════════════════════════ */
export function AnnouncementsEdit({ announcement, events }) {
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

            {/* Banner */}
            <motion.div
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-6 mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Pencil className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">Panel Administrator</span>
                        </div>
                        <h1 className="text-2xl font-black">Edit Pengumuman ✏️</h1>
                        <p className="text-slate-300 text-sm mt-1 max-w-md truncate">
                            {announcement.title}
                        </p>
                    </div>
                    <PublishStatusChip published={data.is_published} />
                </div>
            </motion.div>

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <AnnouncementFormFields
                    data={data} setData={setData}
                    errors={errors} events={events}
                />
                <FormActions
                    processing={processing}
                    submitLabel="Simpan Perubahan"
                    backRoute={route('admin.announcements.index')}
                />
            </form>
        </AdminLayout>
    );
}

/* ── Shared form fields ── */
function AnnouncementFormFields({ data, setData, errors, events }) {
    return (
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
                        placeholder="Contoh: Pengumuman Pemenang Lomba Layangan 2025" />
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
                    <div className="flex gap-3 flex-wrap">
                        {TYPE_OPTS.map(opt => {
                            const Icon      = opt.icon;
                            const isActive  = data.type === opt.value;
                            return (
                                <motion.label
                                    key={opt.value}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl
                                                border-2 cursor-pointer text-sm font-bold
                                                transition-all duration-200
                                                ${isActive ? opt.active : opt.inactive}`}>
                                    <input type="radio" name="type" value={opt.value}
                                        checked={isActive}
                                        onChange={() => setData('type', opt.value)}
                                        className="hidden" />
                                    <Icon className="w-3.5 h-3.5" />
                                    {opt.label}
                                </motion.label>
                            );
                        })}
                    </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setData('is_published', !data.is_published)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full
                                    transition-colors duration-300 focus:outline-none shrink-0
                                    ${data.is_published ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                        <motion.span
                            layout
                            className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
                            animate={{ x: data.is_published ? 22 : 4 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <div>
                        <p className="text-sm font-bold text-gray-700">
                            {data.is_published ? '✅ Langsung tayangkan' : 'Simpan sebagai draft'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {data.is_published
                                ? 'Peserta akan langsung melihat pengumuman ini'
                                : 'Pengumuman tidak akan terlihat oleh peserta'}
                        </p>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

/* ── Form Action Buttons ── */
function FormActions({ processing, submitLabel, backRoute }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex gap-3 pb-8">
            <button type="submit" disabled={processing}
                className="flex items-center gap-2 bg-gradient-to-br from-indigo-600
                           to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm
                           shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg
                           hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:translate-y-0 transition-all duration-200">
                {processing ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                         rounded-full animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        {submitLabel}
                    </>
                )}
            </button>
            <Link href={backRoute}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200
                           rounded-2xl text-sm font-bold text-gray-500 bg-white shadow-sm
                           hover:border-red-200 hover:text-red-500 hover:-translate-y-0.5
                           transition-all duration-200">
                <X className="w-4 h-4" /> Batal
            </Link>
        </motion.div>
    );
}

/* ── Publish chip for edit banner ── */
function PublishStatusChip({ published }) {
    return (
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl
                         font-bold text-sm shrink-0
                         ${published
                             ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                             : 'bg-slate-500/20 border border-slate-400/30 text-slate-300'}`}>
            <span className={`w-2 h-2 rounded-full ${published ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            {published ? 'Sedang Tayang' : 'Draft'}
        </div>
    );
}

export default AnnouncementsCreate;