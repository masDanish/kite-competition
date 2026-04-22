import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    FileText, CalendarDays, Tag, MapPin,
    Users, Save, X, Info, Pencil,
    ClipboardList, ShieldCheck
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

const STATUS_OPTS = [
    { value: 'draft',    label: 'Draft'                          },
    { value: 'open',     label: 'Open — Buka Pendaftaran'        },
    { value: 'closed',   label: 'Closed — Tutup Pendaftaran'     },
    { value: 'ongoing',  label: 'Ongoing — Sedang Berlangsung'   },
    { value: 'finished', label: 'Finished — Selesai'             },
];

const STATUS_BADGE = {
    draft:    { bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
    open:     { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    closed:   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    ongoing:  { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    finished: { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
};

/* ── Section Card wrapper ── */
function SectionCard({ icon: Icon, iconBg, iconColor, title, children, delay = 0 }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
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

/* ── Error message ── */
function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium">
            <Info className="w-3 h-3 shrink-0" /> {msg}
        </p>
    );
}

export default function EventEdit({ event }) {
    const { data, setData, patch, processing, errors } = useForm({
        title:              event.title,
        description:        event.description,
        rules:              event.rules ?? '',
        location:           event.location ?? '',
        registration_start: event.registration_start,
        registration_end:   event.registration_end,
        event_start:        event.event_start,
        event_end:          event.event_end,
        max_participants:   event.max_participants ?? '',
        status:             event.status,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.events.update', event.id));
    }

    const statusCfg = STATUS_BADGE[data.status] ?? STATUS_BADGE.draft;

    return (
        <AdminLayout header="Edit Event">
            <Head title="Edit Event" />

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
                            <Pencil className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">
                                Panel Administrator
                            </span>
                        </div>
                        <h1 className="text-2xl font-black">Edit Event ✏️</h1>
                        <p className="text-slate-300 text-sm mt-1 max-w-sm truncate">
                            {event.title}
                        </p>
                    </div>
                    {/* Current status badge */}
                    <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl
                                    font-bold text-sm ${statusCfg.bg} ${statusCfg.text}`}>
                        <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                    </div>
                </div>
            </motion.div>

            <form onSubmit={submit} className="max-w-4xl space-y-6">

                {/* ── Informasi Event ── */}
                <SectionCard icon={FileText} iconBg="bg-indigo-100" iconColor="text-indigo-600"
                    title="Informasi Event" delay={0.1}>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Judul Event *</label>
                            <input className={inputClass} value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Judul event..." />
                            <FieldError msg={errors.title} />
                        </div>
                        <div>
                            <label className={labelClass}>Deskripsi *</label>
                            <textarea className={inputClass} rows={4} value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi lengkap event..." />
                            <FieldError msg={errors.description} />
                        </div>
                        <div>
                            <label className={labelClass}>Peraturan</label>
                            <textarea className={inputClass} rows={3} value={data.rules}
                                onChange={e => setData('rules', e.target.value)}
                                placeholder="Peraturan dan syarat keikutsertaan..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Lokasi
                                    </span>
                                </label>
                                <input className={inputClass} value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="Kota / Online" />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Maks. Peserta
                                    </span>
                                </label>
                                <input type="number" className={inputClass}
                                    value={data.max_participants}
                                    onChange={e => setData('max_participants', e.target.value)}
                                    placeholder="Kosongkan = tidak dibatasi" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Status Event
                                </span>
                            </label>
                            <select className={inputClass} value={data.status}
                                onChange={e => setData('status', e.target.value)}>
                                {STATUS_OPTS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </SectionCard>

                {/* ── Periode ── */}
                <SectionCard icon={CalendarDays} iconBg="bg-emerald-100" iconColor="text-emerald-600"
                    title="Periode Event" delay={0.15}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Mulai Pendaftaran *', key: 'registration_start' },
                            { label: 'Tutup Pendaftaran *', key: 'registration_end'   },
                            { label: 'Mulai Event *',       key: 'event_start'        },
                            { label: 'Selesai Event *',     key: 'event_end'          },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <label className={labelClass}>{label}</label>
                                <input type="date" className={inputClass}
                                    value={data[key]}
                                    onChange={e => setData(key, e.target.value)} />
                                <FieldError msg={errors[key]} />
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── Kategori (read-only) ── */}
                {event.categories?.length > 0 && (
                    <SectionCard icon={Tag} iconBg="bg-violet-100" iconColor="text-violet-600"
                        title="Kategori Terdaftar" delay={0.2}>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {event.categories.map(cat => (
                                <span key={cat.id}
                                    className="flex items-center gap-1.5 bg-violet-50 text-violet-700
                                               text-sm px-3 py-1.5 rounded-full border border-violet-100
                                               font-semibold">
                                    <Tag className="w-3 h-3 shrink-0" />
                                    {cat.name}
                                    {cat.max_participants && (
                                        <span className="text-violet-400 font-normal">
                                            · maks. {cat.max_participants}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50
                                      border border-gray-100 rounded-xl px-3 py-2">
                            <Info className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                            Untuk mengubah kategori, hubungi developer atau buat event baru.
                        </p>
                    </SectionCard>
                )}

                {/* ── Actions ── */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3 pb-8">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-gradient-to-br from-indigo-600
                                   to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm
                                   shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg
                                   hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200">
                        <Save className="w-4 h-4" />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <Link href={route('admin.events.index')}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-200
                                   rounded-2xl text-sm font-bold text-gray-500 bg-white shadow-sm
                                   hover:border-red-200 hover:text-red-500 hover:-translate-y-0.5
                                   transition-all duration-200">
                        <X className="w-4 h-4" />
                        Batal
                    </Link>
                </motion.div>
            </form>
        </AdminLayout>
    );
}