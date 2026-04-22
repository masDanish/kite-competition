import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Clock, Tag, CalendarDays,
    Sparkles, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function EventsIndex({ events, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    function doSearch(e) {
        e.preventDefault();
        router.get(route('events.index'), { search }, { preserveState: true });
    }

    return (
        <UserLayout header="Event Tersedia">
            <Head title="Event" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-indigo-600 via-blue-600 to-cyan-600 p-6 mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-indigo-200 text-sm font-medium">
                                Temukan Kompetisi Terbaik
                            </span>
                        </div>
                        <h1 className="text-2xl font-black">Event Tersedia 🪁</h1>
                        <p className="text-indigo-100 text-sm mt-1">
                            Daftarkan diri dan tunjukkan kemampuan terbaikmu!
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl hidden md:block">
                        🎯
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Search Bar ── */}
            <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                onSubmit={doSearch}
                className="flex gap-3 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2
                                       w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3
                                   text-sm bg-white shadow-sm focus:outline-none
                                   focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                   transition placeholder:text-gray-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari event..."
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white
                               px-6 py-3 rounded-2xl text-sm font-semibold shadow-md
                               shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg
                               hover:shadow-indigo-300 transition-all duration-300 flex
                               items-center gap-2">
                    <Search className="w-4 h-4" />
                    Cari
                </button>
            </motion.form>

            {/* ── Cards ── */}
            {events.data.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20">
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl mb-4">🪁</motion.div>
                    <p className="text-gray-400 text-sm">Belum ada event yang tersedia saat ini.</p>
                </motion.div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {events.data.map(event => (
                            <motion.div key={event.id} variants={fadeUp}>
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* ── Pagination ── */}
            {(events.prev_page_url || events.next_page_url) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center gap-3 mt-10">
                    {events.prev_page_url ? (
                        <Link
                            href={events.prev_page_url}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200
                                       rounded-2xl text-sm font-semibold text-gray-600 bg-white
                                       shadow-sm hover:border-indigo-300 hover:text-indigo-600
                                       hover:-translate-y-0.5 transition-all duration-200">
                            <ChevronLeft className="w-4 h-4" />
                            Sebelumnya
                        </Link>
                    ) : null}
                    {events.next_page_url ? (
                        <Link
                            href={events.next_page_url}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200
                                       rounded-2xl text-sm font-semibold text-gray-600 bg-white
                                       shadow-sm hover:border-indigo-300 hover:text-indigo-600
                                       hover:-translate-y-0.5 transition-all duration-200">
                            Selanjutnya
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    ) : null}
                </motion.div>
            )}
        </UserLayout>
    );
}

/* ── Event Card ── */
function EventCard({ event }) {
    const isOpen   = event.status === 'open';
    const daysLeft = Math.ceil(
        (new Date(event.registration_end) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100
                       overflow-hidden flex flex-col h-full
                       hover:shadow-lg hover:border-indigo-100 transition-shadow duration-300">

            {/* Poster / placeholder */}
            {event.poster ? (
                <img
                    src={`/storage/${event.poster}`}
                    alt={event.title}
                    className="w-full h-44 object-cover" />
            ) : (
                <div className="w-full h-44 bg-gradient-to-br from-indigo-500 via-blue-500
                                to-cyan-500 flex items-center justify-center text-5xl">
                    🪁
                </div>
            )}

            <div className="p-5 flex flex-col flex-1">

                {/* Title + status badge */}
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 leading-tight text-sm">
                        {event.title}
                    </h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold
                                     shrink-0 border
                        ${isOpen
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {isOpen ? '● Buka' : '● Tutup'}
                    </span>
                </div>

                {/* Location */}
                {event.location && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {event.location}
                    </p>
                )}

                {/* Categories */}
                {event.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {event.categories.map(cat => (
                            <span key={cat.id}
                                className="flex items-center gap-1 text-xs bg-indigo-50
                                           text-indigo-600 px-2 py-0.5 rounded-full font-medium
                                           border border-indigo-100">
                                <Tag className="w-2.5 h-2.5" />
                                {cat.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Countdown */}
                {isOpen && daysLeft > 0 && (
                    <p className="flex items-center gap-1 text-xs text-amber-500 mb-3 font-medium">
                        <Clock className="w-3 h-3 shrink-0" />
                        Pendaftaran tutup dalam {daysLeft} hari
                    </p>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA Button */}
                {isOpen ? (
                    <Link
                        href={route('user.registrations.create', event.id)}
                        className="flex items-center justify-center gap-2 mt-2 py-2.5
                                   rounded-2xl text-sm font-bold transition-all duration-300
                                   bg-gradient-to-br from-indigo-600 to-blue-600 text-white
                                   shadow-md shadow-indigo-200 hover:-translate-y-0.5
                                   hover:shadow-lg hover:shadow-indigo-300">
                        Daftar Sekarang
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                ) : (
                    <div className="mt-2 py-2.5 rounded-2xl text-sm font-bold text-center
                                    bg-gray-100 text-gray-400 cursor-not-allowed select-none">
                        Pendaftaran Ditutup
                    </div>
                )}
            </div>
        </motion.div>
    );
}