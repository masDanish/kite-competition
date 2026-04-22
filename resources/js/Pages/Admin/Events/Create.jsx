import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, CalendarDays, Tag, Star,
    PlusCircle, Trash2, Upload, MapPin,
    Users, Save, X, Info, ChevronRight,
    ClipboardList, Sparkles
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

export default function EventCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', description: '', rules: '', location: '',
        registration_start: '', registration_end: '',
        event_start: '', event_end: '',
        max_participants: '',
        poster: null,
        categories: [{ name: '', description: '', max_participants: '' }],
        criteria:   [{ name: '', description: '', max_score: 100, weight: 1 }],
    });

    /* categories */
    const addCategory    = () => setData('categories', [...data.categories, { name: '', description: '', max_participants: '' }]);
    const removeCategory = i  => setData('categories', data.categories.filter((_, idx) => idx !== i));
    const updateCategory = (i, field, value) => {
        const cats = [...data.categories]; cats[i][field] = value; setData('categories', cats);
    };

    /* criteria */
    const addCriteria    = () => setData('criteria', [...data.criteria, { name: '', description: '', max_score: 100, weight: 1 }]);
    const removeCriteria = i  => setData('criteria', data.criteria.filter((_, idx) => idx !== i));
    const updateCriteria = (i, field, value) => {
        const crits = [...data.criteria]; crits[i][field] = value; setData('criteria', crits);
    };

    function submit(e) {
        e.preventDefault();
        post(route('admin.events.store'));
    }

    return (
        <AdminLayout header="Buat Event Baru">
            <Head title="Buat Event" />

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
                        <h1 className="text-2xl font-black">Buat Event Baru ✨</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Isi semua informasi yang dibutuhkan untuk membuat event baru.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl hidden md:block">
                        🎯
                    </motion.div>
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
                                placeholder="Contoh: Lomba Desain Layangan Nasional 2025" />
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
                                    <Upload className="w-3 h-3" /> Poster Event
                                </span>
                            </label>
                            <label className="flex items-center gap-3 w-full border-2 border-dashed
                                              border-gray-200 rounded-2xl px-4 py-4 cursor-pointer
                                              hover:border-indigo-400 hover:bg-indigo-50/30
                                              transition-all duration-200 group">
                                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center
                                                justify-center shrink-0 group-hover:bg-indigo-200
                                                transition-colors">
                                    <Upload className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        {data.poster ? data.poster.name : 'Pilih file gambar'}
                                    </p>
                                    <p className="text-xs text-gray-400">PNG, JPG, WEBP maks. 2MB</p>
                                </div>
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={e => setData('poster', e.target.files[0])} />
                            </label>
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

                {/* ── Kategori ── */}
                <SectionCard icon={Tag} iconBg="bg-violet-100" iconColor="text-violet-600"
                    title="Kategori Lomba *" delay={0.2}>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {data.categories.map((cat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative border border-gray-100 rounded-2xl
                                               p-4 bg-gray-50/60">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="flex items-center gap-2 text-xs font-bold
                                                         text-violet-600 bg-violet-50 px-2.5 py-1
                                                         rounded-full border border-violet-100">
                                            <Tag className="w-3 h-3" />
                                            Kategori {i + 1}
                                        </span>
                                        {data.categories.length > 1 && (
                                            <button type="button" onClick={() => removeCategory(i)}
                                                className="flex items-center gap-1 text-xs font-bold
                                                           text-red-500 bg-red-50 px-2.5 py-1
                                                           rounded-full border border-red-100
                                                           hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-3 h-3" /> Hapus
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Nama Kategori *</label>
                                            <input className={inputClass} value={cat.name}
                                                onChange={e => updateCategory(i, 'name', e.target.value)}
                                                placeholder="Junior, Senior, Umum..." />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Maks. Peserta</label>
                                            <input type="number" className={inputClass}
                                                value={cat.max_participants}
                                                onChange={e => updateCategory(i, 'max_participants', e.target.value)}
                                                placeholder="Tidak dibatasi" />
                                        </div>
                                        <div className="col-span-full">
                                            <label className={labelClass}>Deskripsi</label>
                                            <input className={inputClass} value={cat.description}
                                                onChange={e => updateCategory(i, 'description', e.target.value)}
                                                placeholder="Deskripsi singkat kategori ini..." />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <button type="button" onClick={addCategory}
                            className="flex items-center gap-2 w-full justify-center py-3
                                       border-2 border-dashed border-violet-200 rounded-2xl
                                       text-sm font-bold text-violet-600 hover:border-violet-400
                                       hover:bg-violet-50 transition-all duration-200">
                            <PlusCircle className="w-4 h-4" />
                            Tambah Kategori
                        </button>
                    </div>
                </SectionCard>

                {/* ── Kriteria Penilaian ── */}
                <SectionCard icon={Star} iconBg="bg-amber-100" iconColor="text-amber-600"
                    title="Kriteria Penilaian *" delay={0.25}>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {data.criteria.map((crit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative border border-gray-100 rounded-2xl
                                               p-4 bg-gray-50/60">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="flex items-center gap-2 text-xs font-bold
                                                         text-amber-600 bg-amber-50 px-2.5 py-1
                                                         rounded-full border border-amber-100">
                                            <Star className="w-3 h-3" />
                                            Kriteria {i + 1}
                                        </span>
                                        {data.criteria.length > 1 && (
                                            <button type="button" onClick={() => removeCriteria(i)}
                                                className="flex items-center gap-1 text-xs font-bold
                                                           text-red-500 bg-red-50 px-2.5 py-1
                                                           rounded-full border border-red-100
                                                           hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-3 h-3" /> Hapus
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className={labelClass}>Nama Kriteria *</label>
                                            <input className={inputClass} value={crit.name}
                                                onChange={e => updateCriteria(i, 'name', e.target.value)}
                                                placeholder="Kreativitas, Teknik..." />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Nilai Maks.</label>
                                            <input type="number" className={inputClass}
                                                value={crit.max_score} min="1" max="100"
                                                onChange={e => updateCriteria(i, 'max_score', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Bobot (×)</label>
                                            <input type="number" className={inputClass}
                                                value={crit.weight} min="0.1" step="0.1"
                                                onChange={e => updateCriteria(i, 'weight', e.target.value)} />
                                        </div>
                                        <div className="col-span-full">
                                            <label className={labelClass}>Deskripsi</label>
                                            <input className={inputClass} value={crit.description}
                                                onChange={e => updateCriteria(i, 'description', e.target.value)}
                                                placeholder="Penjelasan kriteria penilaian..." />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <button type="button" onClick={addCriteria}
                            className="flex items-center gap-2 w-full justify-center py-3
                                       border-2 border-dashed border-amber-200 rounded-2xl
                                       text-sm font-bold text-amber-600 hover:border-amber-400
                                       hover:bg-amber-50 transition-all duration-200">
                            <PlusCircle className="w-4 h-4" />
                            Tambah Kriteria
                        </button>
                    </div>
                </SectionCard>

                {/* ── Actions ── */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex gap-3 pb-8">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-gradient-to-br from-indigo-600
                                   to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm
                                   shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg
                                   hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200">
                        <Save className="w-4 h-4" />
                        {processing ? 'Menyimpan...' : 'Simpan Event'}
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