import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    CalendarDays, MapPin, Clock, Users, Tag,
    MessageSquare, CheckCircle2, AlertCircle,
    Sparkles, ChevronRight, ArrowRight, Info,
    Shield, Timer
} from 'lucide-react';

export default function RegistrationCreate({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id:    event.id,
        category_id: '',
        team_name:   '',
        notes:       '',
    });

    const [selectedCat, setSelectedCat] = useState(null);

    function handleCategoryChange(catId) {
        setData('category_id', catId);
        const cat = event.categories.find(c => c.id == catId);
        setSelectedCat(cat ?? null);
    }

    function submit(e) {
        e.preventDefault();
        post(route('user.registrations.store'));
    }

    const inputClass = `w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm
                        text-gray-800 bg-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-400
                        focus:border-transparent transition-all duration-200`;

    const daysLeft = Math.ceil(
        (new Date(event.registration_end) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
        <UserLayout header="Daftar Event">
            <Head title="Pendaftaran Event" />

            {/* ══ BANNER ══ */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-indigo-600 via-blue-600 to-cyan-600 p-6 mb-8 text-white">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }} />
                </div>
                <div className="relative z-10 flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                            <span className="text-indigo-200 text-sm font-medium">
                                Pendaftaran Event
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black leading-tight mb-2">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap gap-3 text-sm">
                            {event.location && (
                                <span className="flex items-center gap-1.5 text-indigo-200">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {event.location}
                                </span>
                            )}
                            {daysLeft > 0 && (
                                <span className="flex items-center gap-1.5 bg-white/20
                                                 text-white font-semibold px-3 py-1 rounded-full
                                                 text-xs backdrop-blur-sm">
                                    <Timer className="w-3 h-3" />
                                    Tutup dalam {daysLeft} hari
                                </span>
                            )}
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl hidden md:block shrink-0">
                        🪁
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ══ LEFT: EVENT INFO ══ */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="space-y-5">

                    {/* Periode */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CalendarDays className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Detail Event</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl">
                                <Clock className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-indigo-700 mb-0.5">
                                        Pendaftaran
                                    </p>
                                    <p className="text-sm text-indigo-800 font-medium">
                                        {new Date(event.registration_start).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-indigo-500">s/d</p>
                                    <p className="text-sm text-indigo-800 font-medium">
                                        {new Date(event.registration_end).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl">
                                <CalendarDays className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-emerald-700 mb-0.5">
                                        Pelaksanaan
                                    </p>
                                    <p className="text-sm text-emerald-800 font-medium">
                                        {new Date(event.event_start).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-emerald-500">s/d</p>
                                    <p className="text-sm text-emerald-800 font-medium">
                                        {new Date(event.event_end).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kategori tersedia */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                <Tag className="w-4 h-4 text-violet-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Kategori</h3>
                        </div>
                        <div className="space-y-2">
                            {event.categories.map(cat => (
                                <div key={cat.id}
                                    className={`flex items-center justify-between p-3 rounded-2xl
                                        border transition-all duration-200
                                        ${cat.is_full
                                            ? 'bg-gray-50 border-gray-100 opacity-60'
                                            : selectedCat?.id === cat.id
                                                ? 'bg-indigo-50 border-indigo-200'
                                                : 'bg-gray-50 border-gray-100 hover:border-indigo-200'}`}>
                                    <div>
                                        <p className={`text-sm font-semibold ${
                                            cat.is_full ? 'text-gray-400' : 'text-gray-800'
                                        }`}>
                                            {cat.name}
                                        </p>
                                        {cat.max_participants && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {cat.is_full
                                                    ? 'Slot penuh'
                                                    : `Sisa ${cat.remaining_slot ?? '?'} slot`}
                                            </p>
                                        )}
                                    </div>
                                    {cat.is_full ? (
                                        <span className="text-[10px] bg-red-100 text-red-600
                                                         font-bold px-2 py-0.5 rounded-full">
                                            PENUH
                                        </span>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-indigo-300
                                                        flex items-center justify-center">
                                            {selectedCat?.id === cat.id && (
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl
                                    border border-amber-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <h3 className="font-bold text-amber-800 text-sm">Info Penting</h3>
                        </div>
                        <ul className="space-y-2">
                            {[
                                'Pendaftaran hanya bisa dilakukan sekali per event',
                                'Pastikan memilih kategori yang sesuai',
                                'Karya dapat diupload setelah pendaftaran disetujui',
                            ].map((info, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                                    {info}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* ══ RIGHT: FORM ══ */}
                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-2">

                    <form onSubmit={submit} className="space-y-5">

                        {/* Pilih Kategori */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <Tag className="w-4 h-4 text-violet-600" />
                                </div>
                                <h3 className="font-bold text-gray-800">Pilih Kategori</h3>
                                <span className="text-red-400 text-sm">*</span>
                            </div>

                            {/* Category cards — pilih dengan klik */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                {event.categories.map(cat => (
                                    <motion.button
                                        key={cat.id}
                                        type="button"
                                        disabled={cat.is_full}
                                        onClick={() => !cat.is_full && handleCategoryChange(cat.id)}
                                        whileHover={!cat.is_full ? { scale: 1.02, y: -2 } : {}}
                                        whileTap={!cat.is_full ? { scale: 0.98 } : {}}
                                        className={`relative text-left p-4 rounded-2xl border-2
                                                    transition-all duration-200 overflow-hidden
                                            ${cat.is_full
                                                ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                                                : data.category_id == cat.id
                                                    ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                                                    : 'border-gray-200 bg-white hover:border-indigo-300'}`}>

                                        {/* Selected indicator */}
                                        <AnimatePresence>
                                            {data.category_id == cat.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute top-3 right-3 w-6 h-6
                                                               bg-indigo-600 rounded-full flex
                                                               items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500
                                                        to-blue-600 rounded-xl flex items-center
                                                        justify-center mb-3 shadow-md shadow-indigo-200">
                                            <Tag className="w-4 h-4 text-white" />
                                        </div>

                                        <p className="font-bold text-gray-800 text-sm pr-6">
                                            {cat.name}
                                        </p>

                                        {cat.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {cat.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-2">
                                            {cat.max_participants ? (
                                                <span className={`text-xs font-semibold px-2 py-0.5
                                                                   rounded-full ${
                                                    cat.is_full
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {cat.is_full
                                                        ? '🔴 Penuh'
                                                        : `✅ ${cat.remaining_slot ?? '?'} slot tersisa`}
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-blue-100 text-blue-600
                                                                 font-semibold px-2 py-0.5 rounded-full">
                                                    Tidak terbatas
                                                </span>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {errors.category_id && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-xs flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.category_id}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Selected category preview */}
                            <AnimatePresence>
                                {selectedCat && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden">
                                        <div className="flex items-center gap-2 mt-3 p-3
                                                        bg-indigo-50 rounded-2xl border
                                                        border-indigo-100">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                                            <p className="text-sm text-indigo-800">
                                                Kamu memilih kategori{' '}
                                                <strong>{selectedCat.name}</strong>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Nama Tim + Catatan */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-teal-600" />
                                </div>
                                <h3 className="font-bold text-gray-800">Informasi Tambahan</h3>
                                <span className="text-xs text-gray-400 font-normal">(opsional)</span>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-gray-400" />
                                        Nama Tim
                                    </span>
                                </label>
                                <input className={inputClass} value={data.team_name}
                                    onChange={e => setData('team_name', e.target.value)}
                                    placeholder="Isi jika mengikuti sebagai tim" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                                        Catatan untuk Admin
                                    </span>
                                </label>
                                <textarea className={inputClass} rows={3} value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Pertanyaan atau informasi tambahan yang ingin disampaikan..." />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3">
                            <motion.button
                                type="submit"
                                disabled={processing || !data.category_id}
                                whileHover={!processing && data.category_id ? { y: -2, scale: 1.02 } : {}}
                                whileTap={!processing && data.category_id ? { scale: 0.97 } : {}}
                                className="flex-1 flex items-center justify-center gap-2
                                           bg-gradient-to-r from-indigo-600 to-blue-600
                                           text-white font-bold py-3.5 rounded-2xl shadow-lg
                                           shadow-indigo-200 hover:shadow-indigo-300
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           disabled:hover:shadow-none transition-all duration-300">
                                {processing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white/30
                                                       border-t-white rounded-full" />
                                        Mendaftar...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Kirim Pendaftaran
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>

                            <motion.a
                                href={route('events.index')}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-6 py-3.5 border-2 border-gray-200 rounded-2xl
                                           text-sm font-semibold text-gray-600
                                           hover:border-gray-300 hover:bg-gray-50
                                           transition-all duration-200">
                                Batal
                            </motion.a>
                        </div>

                        {!data.category_id && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-xs text-gray-400">
                                * Pilih kategori terlebih dahulu untuk mengirim pendaftaran
                            </motion.p>
                        )}
                    </form>
                </motion.div>
            </div>
        </UserLayout>
    );
}