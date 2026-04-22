import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import {
    Search, MapPin, Clock, Tag, Sparkles,
    ArrowRight, ChevronLeft, ChevronRight,
    Eye, Lock, CheckCircle2, Play, AlertCircle
} from 'lucide-react';

/* ── Partikel statis agar tidak re-generate tiap render ── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left:  `${(i * 337) % 100}%`,
    top:   `${(i * 271) % 100}%`,
    dur:   2.5 + (i % 4),
    delay: (i % 5) * 0.6,
    size:  2 + (i % 3),
    color: ['#818cf8','#60a5fa','#34d399','#fbbf24','#f472b6'][i % 5],
}));

/* ── 3D Tilt Card ── */
function TiltCard({ children, className = '', intensity = 10 }) {
    const ref  = useRef(null);
    const rotX = useSpring(0, { stiffness: 250, damping: 28 });
    const rotY = useSpring(0, { stiffness: 250, damping: 28 });
    const onMove = useCallback((e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        rotX.set(-((e.clientY - r.top  - r.height/2) / (r.height/2)) * intensity);
        rotY.set( ((e.clientX - r.left - r.width /2) / (r.width /2)) * intensity);
    }, [intensity]);
    const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, []);
    return (
        <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 700 }}
            className={className}>
            {children}
        </motion.div>
    );
}

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } }
};

/* ── Konfigurasi status ── */
const STATUS_CFG = {
    open:     { label: 'Buka',       dot: '●', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', pulse: true  },
    closed:   { label: 'Ditutup',    dot: '●', badge: 'bg-red-100 text-red-600 border-red-200',            pulse: false },
    ongoing:  { label: 'Berlangsung',dot: '●', badge: 'bg-blue-100 text-blue-700 border-blue-200',         pulse: true  },
    finished: { label: 'Selesai',    dot: '●', badge: 'bg-gray-100 text-gray-500 border-gray-200',         pulse: false },
    draft:    { label: 'Draft',      dot: '●', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',   pulse: false },
};

/* ── Tab filter ── */
const TABS = [
    { key: 'all',      label: 'Semua Event',    icon: Eye           },
    { key: 'open',     label: 'Sedang Buka',    icon: Play          },
    { key: 'ongoing',  label: 'Berlangsung',    icon: CheckCircle2  },
    { key: 'finished', label: 'Sudah Selesai',  icon: Lock          },
];

export default function EventsIndex({ events, filters }) {
    const [search,   setSearch]   = useState(filters.search || '');
    const [activeTab, setTab]     = useState('all');

    function doSearch(e) {
        e.preventDefault();
        router.get(route('events.index'), { search }, { preserveState: true });
    }

    /* Filter di frontend berdasarkan tab */
    const filtered = events.data.filter(ev => {
        if (activeTab === 'all')      return true;
        if (activeTab === 'open')     return ev.status === 'open';
        if (activeTab === 'ongoing')  return ev.status === 'ongoing';
        if (activeTab === 'finished') return ['finished','closed'].includes(ev.status);
        return true;
    });

    /* Hitung badge tiap tab */
    const counts = {
        all:      events.data.length,
        open:     events.data.filter(e => e.status === 'open').length,
        ongoing:  events.data.filter(e => e.status === 'ongoing').length,
        finished: events.data.filter(e => ['finished','closed'].includes(e.status)).length,
    };

    return (
        <UserLayout header="Event">
            <Head title="Daftar Event" />

            {/* ══ HERO BANNER ══ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-3xl mb-8
                           bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                           p-7 text-white shadow-2xl shadow-indigo-950/40">

                <div className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px,transparent 1px),
                                          linear-gradient(90deg,rgba(99,102,241,0.5) 1px,transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />

                <motion.div className="absolute w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#6366f1,transparent 70%)',
                             top: '-20%', right: '-5%', opacity: 0.2 }}
                    animate={{ scale: [1,1.4,1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute w-48 h-48 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle,#06b6d4,transparent 70%)',
                             bottom: '-15%', left: '5%', opacity: 0.15 }}
                    animate={{ scale: [1.2,1,1.2] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

                {PARTICLES.map(p => (
                    <motion.div key={p.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{ width: p.size, height: p.size, background: p.color,
                                 left: p.left, top: p.top }}
                        animate={{ y: [0,-18,0], opacity: [0.2,0.8,0.2] }}
                        transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
                ))}

                <div className="relative z-10 flex flex-col sm:flex-row justify-between
                                items-start sm:items-center gap-5">
                    <div>
                        <motion.div
                            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-indigo-500/20
                                       border border-indigo-400/30 text-indigo-300 text-xs
                                       font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            Semua Kompetisi Layangan
                        </motion.div>
                        <motion.h1
                            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-black text-white tracking-tight">
                            Event Lomba Layangan 🪁
                        </motion.h1>
                        <motion.p
                            initial={{ opacity:0 }} animate={{ opacity:1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 text-sm mt-1">
                            {events.data.length} event tersedia — aktif, berlangsung, maupun yang telah selesai
                        </motion.p>
                    </div>
                    <motion.div
                        animate={{ rotate:[0,8,-4,0], y:[0,-10,0] }}
                        transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
                        className="hidden sm:block shrink-0">
                        <svg width="72" height="88" viewBox="0 0 100 120" fill="none">
                            <defs>
                                <linearGradient id="kg-ev" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#818cf8"/>
                                    <stop offset="100%" stopColor="#60a5fa"/>
                                </linearGradient>
                                <filter id="ks-ev">
                                    <feDropShadow dx="0" dy="6" stdDeviation="8"
                                        floodColor="#6366f1" floodOpacity="0.5"/>
                                </filter>
                            </defs>
                            <polygon points="50,5 95,50 50,85 5,50"
                                fill="url(#kg-ev)" filter="url(#ks-ev)"/>
                            <line x1="50" y1="5" x2="50" y2="85"
                                stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <line x1="5" y1="50" x2="95" y2="50"
                                stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <polygon points="50,5 95,50 50,50 5,50"
                                fill="rgba(255,255,255,0.1)"/>
                            <path d="M50 85 Q45 97 50 108 Q55 117 50 120"
                                stroke="#60a5fa" strokeWidth="2.5"
                                strokeLinecap="round" fill="none"/>
                        </svg>
                    </motion.div>
                </div>
            </motion.div>

            {/* ══ SEARCH + FILTER TABS ══ */}
            <motion.div
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:0.15 }}
                className="space-y-4 mb-8">

                {/* Search */}
                <form onSubmit={doSearch} className="flex gap-3">
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
                            placeholder="Cari nama event..."
                        />
                    </div>
                    <motion.button type="submit"
                        whileHover={{ y:-2, scale:1.02 }} whileTap={{ scale:0.97 }}
                        className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white
                                   px-6 py-3 rounded-2xl text-sm font-bold shadow-lg
                                   shadow-indigo-200 hover:shadow-indigo-300 transition-all
                                   duration-300 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Cari
                    </motion.button>
                </form>

                {/* Tab filter */}
                <div className="flex flex-wrap gap-2">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.key;
                        const count    = counts[tab.key];
                        return (
                            <motion.button
                                key={tab.key}
                                onClick={() => setTab(tab.key)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl
                                            text-sm font-semibold border-2 transition-all duration-200
                                            ${isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-lg shadow-indigo-200'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-black
                                                  ${isActive
                                                      ? 'bg-white/20 text-white'
                                                      : 'bg-gray-100 text-gray-500'}`}>
                                    {count}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ══ CARDS ══ */}
            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity:0, scale:0.95 }}
                        animate={{ opacity:1, scale:1 }}
                        exit={{ opacity:0 }}
                        className="flex flex-col items-center justify-center py-24
                                   bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <motion.div animate={{ y:[0,-12,0], rotate:[0,5,-3,0] }}
                            transition={{ duration:5, repeat:Infinity }}
                            className="text-7xl mb-4">🪁</motion.div>
                        <p className="text-gray-500 font-semibold mb-1">
                            Tidak ada event ditemukan
                        </p>
                        <p className="text-gray-400 text-sm">
                            Coba tab lain atau ubah kata pencarian
                        </p>
                        {activeTab !== 'all' && (
                            <button onClick={() => setTab('all')}
                                className="mt-4 text-indigo-600 text-sm font-semibold
                                           hover:underline">
                                Lihat semua event →
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial="hidden" animate="show" variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(event => (
                            <motion.div key={event.id} variants={fadeUp}>
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ PAGINATION ══ */}
            {(events.prev_page_url || events.next_page_url) && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                    transition={{ delay:0.4 }}
                    className="flex justify-center gap-3 mt-10">
                    {events.prev_page_url && (
                        <Link href={events.prev_page_url}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200
                                       rounded-2xl text-sm font-semibold text-gray-600 bg-white
                                       shadow-sm hover:border-indigo-300 hover:text-indigo-600
                                       hover:-translate-y-0.5 transition-all duration-200">
                            <ChevronLeft className="w-4 h-4"/> Sebelumnya
                        </Link>
                    )}
                    {events.next_page_url && (
                        <Link href={events.next_page_url}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200
                                       rounded-2xl text-sm font-semibold text-gray-600 bg-white
                                       shadow-sm hover:border-indigo-300 hover:text-indigo-600
                                       hover:-translate-y-0.5 transition-all duration-200">
                            Selanjutnya <ChevronRight className="w-4 h-4"/>
                        </Link>
                    )}
                </motion.div>
            )}
        </UserLayout>
    );
}

/* ══════════════════════════════════════
   EVENT CARD — tampil untuk semua status
══════════════════════════════════════ */
function EventCard({ event }) {
    const [hovered, setHovered] = useState(false);

    const isOpen     = event.status === 'open';
    const isOngoing  = event.status === 'ongoing';
    const isFinished = ['finished','closed'].includes(event.status);
    const isDraft    = event.status === 'draft';

    const statusCfg  = STATUS_CFG[event.status] ?? STATUS_CFG.closed;

    const daysLeft = Math.ceil(
        (new Date(event.registration_end) - new Date()) / (1000*60*60*24)
    );

    /* Grayscale ringan untuk event yang selesai */
    const cardOpacity = isFinished ? 'opacity-80' : 'opacity-100';

    return (
        <TiltCard intensity={isFinished ? 4 : 8} className="h-full">
            <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y: -6 }}
                transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
                className={`bg-white rounded-3xl shadow-sm border overflow-hidden
                            flex flex-col h-full transition-all duration-300
                            ${isFinished
                                ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                : 'border-gray-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200'}
                            ${cardOpacity}`}>

                {/* ── Poster / Placeholder ── */}
                <div className="relative overflow-hidden">
                    {event.poster ? (
                        <>
                            <motion.img
                                src={`/storage/${event.poster}`}
                                alt={event.title}
                                animate={{ scale: hovered ? 1.06 : 1 }}
                                transition={{ duration:0.4 }}
                                className={`w-full h-44 object-cover
                                            ${isFinished ? 'grayscale-[30%]' : ''}`} />
                            <div className={`absolute inset-0 bg-gradient-to-t
                                            ${isFinished
                                                ? 'from-gray-900/60 to-transparent'
                                                : 'from-black/30 to-transparent'}`} />
                        </>
                    ) : (
                        <div className={`relative w-full h-44 flex items-center justify-center
                                         overflow-hidden
                                         ${isFinished
                                             ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                                             : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950'}`}>
                            {[...Array(8)].map((_,i) => (
                                <motion.div key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        width:3, height:3,
                                        background: isFinished
                                            ? ['#9ca3af','#6b7280','#d1d5db'][i%3]
                                            : ['#818cf8','#60a5fa','#34d399'][i%3],
                                        left:`${(i*337)%100}%`, top:`${(i*271)%100}%`
                                    }}
                                    animate={{ y:[0,-10,0], opacity:[0.2,0.8,0.2] }}
                                    transition={{ duration:2+i%3, repeat:Infinity, delay:i*0.4 }} />
                            ))}
                            <motion.div
                                animate={{ rotate:[0,8,-4,0] }}
                                transition={{ duration:5, repeat:Infinity }}>
                                <svg width="56" height="68" viewBox="0 0 100 120" fill="none">
                                    <defs>
                                        <linearGradient id={`kg-c-${event.id}`} x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor={isFinished ? '#9ca3af' : '#818cf8'}/>
                                            <stop offset="100%" stopColor={isFinished ? '#6b7280' : '#60a5fa'}/>
                                        </linearGradient>
                                    </defs>
                                    <polygon points="50,5 95,50 50,85 5,50"
                                        fill={`url(#kg-c-${event.id})`} opacity="0.9"/>
                                    <line x1="50" y1="5" x2="50" y2="85"
                                        stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                                    <line x1="5" y1="50" x2="95" y2="50"
                                        stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                                    <path d="M50 85 Q45 97 50 108"
                                        stroke={isFinished ? '#9ca3af' : '#60a5fa'}
                                        strokeWidth="2" strokeLinecap="round" fill="none"/>
                                </svg>
                            </motion.div>
                        </div>
                    )}

                    {/* Badge status di atas gambar */}
                    <div className="absolute top-3 left-3">
                        <motion.span
                            animate={statusCfg.pulse ? { scale:[1,1.06,1] } : {}}
                            transition={{ duration:2, repeat:Infinity }}
                            className={`text-xs px-2.5 py-1 rounded-full font-bold border
                                        backdrop-blur-sm ${statusCfg.badge}`}>
                            {statusCfg.dot} {statusCfg.label}
                        </motion.span>
                    </div>

                    {/* Overlay banner untuk event selesai */}
                    {isFinished && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/40 backdrop-blur-[2px] rounded-2xl
                                            px-4 py-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-300" />
                                <span className="text-white text-xs font-bold">
                                    Event Telah Selesai
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Accent bar ── */}
                <AnimatePresence>
                    {hovered && !isFinished && (
                        <motion.div
                            initial={{ scaleX:0 }} animate={{ scaleX:1 }} exit={{ scaleX:0 }}
                            className="h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 origin-left" />
                    )}
                </AnimatePresence>

                <div className="p-5 flex flex-col flex-1">
                    {/* Title + status */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-800 leading-tight text-sm line-clamp-2">
                            {event.title}
                        </h3>
                    </div>

                    {/* Lokasi */}
                    {event.location && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                            <MapPin className="w-3 h-3 shrink-0"/> {event.location}
                        </p>
                    )}

                    {/* Periode event */}
                    <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <Clock className="w-3 h-3 shrink-0"/>
                        {event.event_start} — {event.event_end}
                    </p>

                    {/* Kategori */}
                    {event.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {event.categories.slice(0, 3).map(cat => (
                                <span key={cat.id}
                                    className={`flex items-center gap-1 text-xs px-2 py-0.5
                                                rounded-full font-medium border
                                                ${isFinished
                                                    ? 'bg-gray-50 text-gray-400 border-gray-200'
                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                    <Tag className="w-2.5 h-2.5"/>
                                    {cat.name}
                                </span>
                            ))}
                            {event.categories.length > 3 && (
                                <span className="text-xs text-gray-400 self-center">
                                    +{event.categories.length - 3} lainnya
                                </span>
                            )}
                        </div>
                    )}

                    {/* Countdown — hanya saat open */}
                    {isOpen && daysLeft > 0 && (
                        <motion.p
                            animate={{ opacity:[1,0.6,1] }}
                            transition={{ duration:2, repeat:Infinity }}
                            className="flex items-center gap-1 text-xs text-amber-500 mb-3 font-medium">
                            <Clock className="w-3 h-3 shrink-0"/>
                            Pendaftaran tutup dalam {daysLeft} hari
                        </motion.p>
                    )}
                    {isOpen && daysLeft <= 0 && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mb-3 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0"/>
                            Pendaftaran sudah berakhir
                        </p>
                    )}
                    {isOngoing && (
                        <motion.p
                            animate={{ opacity:[1,0.5,1] }}
                            transition={{ duration:1.5, repeat:Infinity }}
                            className="flex items-center gap-1 text-xs text-blue-500 mb-3 font-medium">
                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>
                            Event sedang berlangsung
                        </motion.p>
                    )}

                    <div className="flex-1" />

                    {/* ── CTA BUTTON — beda per status ── */}
                    {isOpen && (
                        <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                            <Link href={route('user.registrations.create', event.id)}
                                className="flex items-center justify-center gap-2 mt-2 py-2.5
                                           rounded-2xl text-sm font-bold transition-all duration-300
                                           bg-gradient-to-br from-indigo-600 to-blue-600 text-white
                                           shadow-md shadow-indigo-200 hover:-translate-y-0.5
                                           hover:shadow-lg hover:shadow-indigo-300">
                                Daftar Sekarang <ArrowRight className="w-3.5 h-3.5"/>
                            </Link>
                        </motion.div>
                    )}

                    {isOngoing && (
                        <div className="mt-2 py-2.5 rounded-2xl text-sm font-bold text-center
                                        bg-blue-50 text-blue-600 border border-blue-200">
                            🏃 Sedang Berlangsung
                        </div>
                    )}

                    {isFinished && (
                        <div className="mt-2 space-y-2">
                            {/* Info selesai */}
                            <div className="py-2.5 rounded-2xl text-sm font-bold text-center
                                            bg-gray-100 text-gray-500 flex items-center
                                            justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-gray-400"/>
                                Event Telah Berakhir
                            </div>
                            {/* Tombol lihat hasil — jika event finished */}
                            {event.status === 'finished' && (
                                <Link href={route('user.results.index')}
                                    className="flex items-center justify-center gap-2 py-2
                                               rounded-2xl text-xs font-semibold
                                               text-indigo-600 bg-indigo-50 border border-indigo-100
                                               hover:bg-indigo-100 transition-colors duration-200">
                                    <Eye className="w-3.5 h-3.5"/>
                                    Lihat Hasil Penilaian
                                </Link>
                            )}
                        </div>
                    )}

                    {isDraft && (
                        <div className="mt-2 py-2.5 rounded-2xl text-sm font-bold text-center
                                        bg-yellow-50 text-yellow-600 border border-yellow-200">
                            ⏳ Belum Dibuka
                        </div>
                    )}

                    {/* Closed (pendaftaran tutup tapi event belum mulai) */}
                    {event.status === 'closed' && (
                        <div className="mt-2 py-2.5 rounded-2xl text-sm font-bold text-center
                                        bg-red-50 text-red-500 border border-red-100">
                            🔒 Pendaftaran Ditutup
                        </div>
                    )}
                </div>
            </motion.div>
        </TiltCard>
    );
}