import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
    Search, MapPin, Clock, Tag, Sparkles,
    ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
    id: i, left: `${(i * 337) % 100}%`, top: `${(i * 271) % 100}%`,
    dur: 2.5 + (i % 4), delay: (i % 5) * 0.6,
    size: 2 + (i % 3),
    color: ['#818cf8','#60a5fa','#34d399','#fbbf24','#f472b6'][i % 5],
}));

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
            style={{ rotateX: rotX, rotateY: rotY, transformStyle:'preserve-3d', perspective: 700 }}
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

export default function EventsIndex({ events, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    function doSearch(e) {
        e.preventDefault();
        router.get(route('events.index'), { search }, { preserveState: true });
    }

    return (
        <UserLayout header="Event Tersedia">
            <Head title="Event" />

            {/* ── HERO BANNER ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-3xl mb-8
                           bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                           p-7 text-white shadow-2xl shadow-indigo-950/40">

                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:`linear-gradient(rgba(99,102,241,0.5) 1px,transparent 1px),
                                         linear-gradient(90deg,rgba(99,102,241,0.5) 1px,transparent 1px)`,
                        backgroundSize:'40px 40px'
                    }} />

                {/* Orbs */}
                <motion.div className="absolute w-64 h-64 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,#6366f1 0%,transparent 70%)',
                             top:'-20%', right:'-5%', opacity:0.2 }}
                    animate={{ scale:[1,1.4,1] }}
                    transition={{ duration:7, repeat:Infinity, ease:'easeInOut' }} />
                <motion.div className="absolute w-48 h-48 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,#06b6d4 0%,transparent 70%)',
                             bottom:'-15%', left:'5%', opacity:0.15 }}
                    animate={{ scale:[1.2,1,1.2] }}
                    transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }} />

                {/* Particles */}
                {PARTICLES.map(p => (
                    <motion.div key={p.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{ width:p.size, height:p.size, background:p.color,
                                 left:p.left, top:p.top }}
                        animate={{ y:[0,-18,0], opacity:[0.2,0.8,0.2] }}
                        transition={{ duration:p.dur, repeat:Infinity, delay:p.delay }} />
                ))}

                <div className="relative z-10 flex flex-col sm:flex-row justify-between
                                items-start sm:items-center gap-5">
                    <div>
                        <motion.div
                            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                            transition={{ delay:0.2 }}
                            className="inline-flex items-center gap-2 bg-indigo-500/20
                                       border border-indigo-400/30 text-indigo-300 text-xs
                                       font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            Temukan Kompetisi Terbaik
                        </motion.div>
                        <motion.h1
                            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                            transition={{ delay:0.3 }}
                            className="text-2xl font-black text-white tracking-tight">
                            Event Tersedia 🪁
                        </motion.h1>
                        <motion.p
                            initial={{ opacity:0 }} animate={{ opacity:1 }}
                            transition={{ delay:0.4 }}
                            className="text-slate-300 text-sm mt-1">
                            Daftarkan diri dan tunjukkan kemampuan terbaikmu!
                        </motion.p>
                    </div>
                    <motion.div
                        animate={{ rotate:[0,8,-4,0], y:[0,-10,0] }}
                        transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
                        style={{ transformStyle:'preserve-3d' }}
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

            {/* ── SEARCH BAR ── */}
            <motion.form
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:0.15 }}
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
                <motion.button type="submit"
                    whileHover={{ y:-2, scale:1.02 }} whileTap={{ scale:0.97 }}
                    className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white
                               px-6 py-3 rounded-2xl text-sm font-bold shadow-lg
                               shadow-indigo-200 hover:shadow-indigo-300 transition-all
                               duration-300 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Cari
                </motion.button>
            </motion.form>

            {/* ── CARDS ── */}
            {events.data.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="flex flex-col items-center justify-center py-24
                               bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <motion.div animate={{ y:[0,-12,0], rotate:[0,5,-3,0] }}
                        transition={{ duration:5, repeat:Infinity }}
                        className="text-7xl mb-4">🪁</motion.div>
                    <p className="text-gray-400 text-sm">
                        Belum ada event yang tersedia saat ini.
                    </p>
                </motion.div>
            ) : (
                <motion.div initial="hidden" animate="show" variants={stagger}
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

            {/* ── PAGINATION ── */}
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

function EventCard({ event }) {
    const [hovered, setHovered] = useState(false);
    const isOpen   = event.status === 'open';
    const daysLeft = Math.ceil(
        (new Date(event.registration_end) - new Date()) / (1000*60*60*24)
    );

    return (
        <TiltCard intensity={8} className="h-full">
            <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y:-6 }}
                transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100
                           overflow-hidden flex flex-col h-full
                           hover:shadow-xl hover:shadow-indigo-100/50
                           hover:border-indigo-200 transition-shadow duration-300">

                {/* Poster / placeholder */}
                {event.poster ? (
                    <div className="relative overflow-hidden">
                        <motion.img
                            src={`/storage/${event.poster}`}
                            alt={event.title}
                            animate={{ scale: hovered ? 1.06 : 1 }}
                            transition={{ duration:0.4 }}
                            className="w-full h-44 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t
                                        from-black/30 to-transparent" />
                    </div>
                ) : (
                    <div className="relative w-full h-44 bg-gradient-to-br
                                    from-slate-900 via-indigo-950 to-blue-950
                                    flex items-center justify-center overflow-hidden">
                        {/* Mini particles */}
                        {[...Array(8)].map((_,i) => (
                            <motion.div key={i}
                                className="absolute rounded-full"
                                style={{ width:3, height:3,
                                         background:['#818cf8','#60a5fa','#34d399'][i%3],
                                         left:`${(i*337)%100}%`, top:`${(i*271)%100}%` }}
                                animate={{ y:[0,-10,0], opacity:[0.2,0.8,0.2] }}
                                transition={{ duration:2+i%3, repeat:Infinity, delay:i*0.4 }} />
                        ))}
                        <motion.div
                            animate={{ rotate:[0,8,-4,0] }}
                            transition={{ duration:5, repeat:Infinity }}>
                            <svg width="56" height="68" viewBox="0 0 100 120" fill="none">
                                <defs>
                                    <linearGradient id={`kg-c-${event.id}`} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#818cf8"/>
                                        <stop offset="100%" stopColor="#60a5fa"/>
                                    </linearGradient>
                                </defs>
                                <polygon points="50,5 95,50 50,85 5,50"
                                    fill={`url(#kg-c-${event.id})`} opacity="0.9"/>
                                <line x1="50" y1="5" x2="50" y2="85"
                                    stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                                <line x1="5" y1="50" x2="95" y2="50"
                                    stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                                <path d="M50 85 Q45 97 50 108"
                                    stroke="#60a5fa" strokeWidth="2"
                                    strokeLinecap="round" fill="none"/>
                            </svg>
                        </motion.div>
                    </div>
                )}

                {/* Top accent bar */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ scaleX:0 }} animate={{ scaleX:1 }} exit={{ scaleX:0 }}
                            className="h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500
                                       origin-left" />
                    )}
                </AnimatePresence>

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-800 leading-tight text-sm">
                            {event.title}
                        </h3>
                        <motion.span
                            animate={isOpen ? { scale:[1,1.08,1] } : {}}
                            transition={{ duration:2, repeat:Infinity }}
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold
                                        shrink-0 border
                                ${isOpen
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            {isOpen ? '● Buka' : '● Tutup'}
                        </motion.span>
                    </div>

                    {event.location && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                            <MapPin className="w-3 h-3 shrink-0"/> {event.location}
                        </p>
                    )}

                    {event.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {event.categories.map(cat => (
                                <span key={cat.id}
                                    className="flex items-center gap-1 text-xs bg-indigo-50
                                               text-indigo-600 px-2 py-0.5 rounded-full
                                               font-medium border border-indigo-100">
                                    <Tag className="w-2.5 h-2.5"/> {cat.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {isOpen && daysLeft > 0 && (
                        <motion.p
                            animate={{ opacity:[1,0.6,1] }}
                            transition={{ duration:2, repeat:Infinity }}
                            className="flex items-center gap-1 text-xs text-amber-500
                                       mb-3 font-medium">
                            <Clock className="w-3 h-3 shrink-0"/>
                            Pendaftaran tutup dalam {daysLeft} hari
                        </motion.p>
                    )}

                    <div className="flex-1" />

                    {isOpen ? (
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
                    ) : (
                        <div className="mt-2 py-2.5 rounded-2xl text-sm font-bold text-center
                                        bg-gray-100 text-gray-400 cursor-not-allowed select-none">
                            Pendaftaran Ditutup
                        </div>
                    )}
                </div>
            </motion.div>
        </TiltCard>
    );
}