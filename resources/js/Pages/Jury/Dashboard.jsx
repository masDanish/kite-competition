import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck, Star, Zap, ChevronRight, TrendingUp } from 'lucide-react';
import {
    motion, AnimatePresence,
    useMotionValue, useSpring, useTransform
} from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

/* ══ 3D TILT CARD (disabled on touch devices) ══ */
function TiltCard({ children, className = '', intensity = 12 }) {
    const ref   = useRef(null);
    const rotX  = useSpring(0, { stiffness: 250, damping: 28 });
    const rotY  = useSpring(0, { stiffness: 250, damping: 28 });
    const shine = useMotionValue(50);

    const onMove = useCallback((e) => {
        if (window.matchMedia('(hover: none)').matches) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        rotX.set(-((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * intensity);
        rotY.set( ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * intensity);
        shine.set(((e.clientX - r.left) / r.width) * 100);
    }, [intensity]);
    const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, []);
    const shimmerBg = useTransform(shine, [0, 100],
        ['rgba(20,184,166,0)', 'rgba(20,184,166,0.10)']);

    return (
        <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 700 }}
            className={`relative ${className}`}>
            <motion.div style={{ background: shimmerBg }}
                className="absolute inset-0 rounded-2xl pointer-events-none z-10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {children}
        </motion.div>
    );
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
    id: i, left: `${(i * 337) % 100}%`, top: `${(i * 271) % 100}%`,
    dur: 2.5 + (i % 4), delay: (i % 5) * 0.6, size: 2 + (i % 3),
    color: ['#2dd4bf','#67e8f9','#34d399','#a5f3fc','#5eead4'][i % 5],
}));

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function JuryDashboard({ assignments, scoredThisMonth, totalScores }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    const stats = [
        {
            label: 'Karya Dinilai Bulan Ini', value: scoredThisMonth,
            icon: ClipboardCheck, grad: 'from-teal-400 to-cyan-500',
            shadow: 'shadow-teal-200', glow: 'rgba(45,212,191,0.25)',
            emoji: '📋',
        },
        {
            label: 'Total Penilaian Diberikan', value: totalScores,
            icon: Star, grad: 'from-cyan-400 to-teal-500',
            shadow: 'shadow-cyan-200', glow: 'rgba(103,232,249,0.25)',
            emoji: '⭐',
        },
    ];

    return (
        <JuryLayout header="Dashboard Juri">
            <Head title="Jury Dashboard" />

            {/* ── HERO BANNER ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-6 sm:mb-8
                           bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950
                           p-5 sm:p-7 text-white shadow-2xl shadow-teal-950/40">

                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }} />

                <motion.div className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', top: '-20%', right: '-5%', opacity: 0.18 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #67e8f9 0%, transparent 70%)', bottom: '-15%', left: '5%', opacity: 0.15 }}
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

                <div className="hidden sm:block">
                    {PARTICLES.map(p => (
                        <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                            style={{ width: p.size, height: p.size, background: p.color, left: p.left, top: p.top }}
                            animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
                    ))}
                </div>

                <div className="relative z-10 flex justify-between items-center gap-4 sm:gap-5">
                    <div className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30
                                       text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-2 sm:mb-3">
                            <Zap className="w-3 h-3 text-yellow-300 shrink-0" />
                            Panel Juri
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                            Dashboard Juri ⚖️
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 text-xs sm:text-sm mt-1">
                            Nilai karya peserta dengan adil dan profesional.
                        </motion.p>
                    </div>

                    <motion.div
                        animate={{ rotate: [0, 5, -3, 0], y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="hidden sm:block shrink-0 text-5xl sm:text-6xl">
                        ⚖️
                    </motion.div>
                </div>
            </motion.div>

            {/* ── STAT CARDS ── */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={stagger}
                className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {stats.map((s, i) => (
                    <motion.div key={i} variants={fadeUp}>
                        <TiltCard className="group" intensity={14}>
                            <motion.div
                                onHoverStart={() => setHoveredCard(i)}
                                onHoverEnd={() => setHoveredCard(null)}
                                whileHover={{ y: -6 }}
                                className={`relative bg-white rounded-2xl p-4 sm:p-6 shadow-lg ${s.shadow}
                                            border border-gray-100 flex items-center gap-3 sm:gap-5 overflow-hidden`}>

                                {/* Glow */}
                                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                                    animate={{ opacity: hoveredCard === i ? 1 : 0 }}
                                    style={{ background: `radial-gradient(circle at 50% 50%, ${s.glow} 0%, transparent 70%)` }}
                                    transition={{ duration: 0.3 }} />

                                <motion.div
                                    whileHover={{ rotateY: 360 }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${s.grad} rounded-xl sm:rounded-2xl
                                                flex items-center justify-center shadow-lg shrink-0`}>
                                    <s.icon size={18} className="text-white sm:hidden" />
                                    <s.icon size={24} className="text-white hidden sm:block" />
                                </motion.div>

                                <div className="min-w-0">
                                    <motion.p
                                        className="text-2xl sm:text-3xl font-black text-gray-800 tabular-nums"
                                        key={s.value}
                                        initial={{ scale: 1.3, color: '#0d9488' }}
                                        animate={{ scale: 1, color: '#1f2937' }}
                                        transition={{ duration: 0.4 }}>
                                        {s.value}
                                    </motion.p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium leading-tight">
                                        {s.label}
                                    </p>
                                </div>

                                {/* Corner emoji */}
                                <motion.span
                                    animate={hoveredCard === i
                                        ? { opacity: 1, scale: 1, rotate: 10 }
                                        : { opacity: 0, scale: 0.6, rotate: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="absolute top-2 right-2 sm:top-3 sm:right-3 text-xl sm:text-2xl pointer-events-none">
                                    {s.emoji}
                                </motion.span>

                                <div className={`absolute -bottom-4 -right-4 w-16 h-16 sm:w-20 sm:h-20
                                                 bg-gradient-to-br ${s.grad} opacity-5 rounded-full`} />
                            </motion.div>
                        </TiltCard>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── EVENT LIST ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Card Header */}
                <div className="relative overflow-hidden px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100
                                bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px',
                    }} />
                    <div className="relative flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <motion.div
                                animate={{ rotate: [0, 10, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 backdrop-blur-sm rounded-xl
                                           flex items-center justify-center shrink-0">
                                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            </motion.div>
                            <div className="min-w-0">
                                <h2 className="font-black text-white text-sm sm:text-base">Event yang Anda Tangani</h2>
                                <p className="text-teal-200 text-[10px] sm:text-xs hidden sm:block">
                                    Klik tombol Nilai untuk mulai penilaian
                                </p>
                            </div>
                        </div>
                        <motion.span
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/20 border border-white/30
                                       text-white text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5
                                       rounded-full backdrop-blur-sm shrink-0 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {assignments.length} Event
                        </motion.span>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {assignments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center py-12 sm:py-16 text-gray-400">
                            <motion.div
                                animate={{ y: [0, -8, 0], rotate: [0, 5, -3, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="text-5xl sm:text-6xl mb-4">⚖️</motion.div>
                            <p className="font-semibold text-gray-500 mb-1 text-sm sm:text-base">
                                Belum Ada Penugasan
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 text-center">
                                Admin belum menugaskan event untuk Anda.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger}
                            className="space-y-3 sm:space-y-4">
                            {assignments.map((a, i) => (
                                <AssignmentCard key={a.id} assignment={a} index={i} />
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </JuryLayout>
    );
}

function AssignmentCard({ assignment: a, index }) {
    const [hovered, setHovered] = useState(false);
    const pct        = a.progress?.percentage ?? 0;
    const isComplete = a.progress?.is_complete ?? false;

    return (
        <motion.div
            variants={fadeUp}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ y: -3 }}
            className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300
                        ${hovered ? 'border-teal-200 shadow-lg shadow-teal-100' : 'border-gray-100 shadow-sm'}`}>

            <div className={`h-1 w-full bg-gradient-to-r transition-all duration-500
                             ${isComplete ? 'from-emerald-400 to-teal-500' : 'from-teal-400 to-cyan-500'}`} />

            <div className="p-4 sm:p-5 bg-white">
                <div className="flex justify-between items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">
                            {a.event?.title}
                        </p>
                        {a.category && (
                            <span className="inline-flex items-center gap-1 mt-1.5 text-xs
                                             bg-teal-50 text-teal-700 border border-teal-100
                                             px-2 sm:px-2.5 py-0.5 rounded-full font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                <span className="truncate max-w-[120px] sm:max-w-none">{a.category.name}</span>
                            </span>
                        )}
                    </div>

                    <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.96 }} className="shrink-0">
                        <Link
                            href={route('jury.submissions.index', a.event.id)}
                            className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-teal-500
                                       to-cyan-500 text-white text-xs font-bold
                                       px-3 sm:px-4 py-2 sm:py-2.5
                                       rounded-xl shadow-md shadow-teal-200 hover:shadow-teal-300
                                       transition-all duration-200 whitespace-nowrap">
                            Nilai
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </Link>
                    </motion.div>
                </div>

                {a.progress && (
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5 sm:mb-2">
                            <span className="font-medium">Progres Penilaian</span>
                            <span className={`font-bold tabular-nums ${isComplete ? 'text-emerald-600' : 'text-teal-600'}`}>
                                {a.progress.scored_submissions}/{a.progress.total_submissions}
                                <span className="hidden sm:inline"> karya</span>
                                {' '}· {pct}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r
                                            ${isComplete ? 'from-emerald-400 to-teal-500' : 'from-teal-400 to-cyan-500'}`} />
                        </div>

                        <AnimatePresence>
                            {isComplete && (
                                <motion.p
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-2">
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-4 h-4 bg-emerald-500 rounded-full flex items-center
                                                   justify-center text-white text-[10px] shrink-0">
                                        ✓
                                    </motion.span>
                                    <span className="hidden sm:inline">Semua karya sudah dinilai! 🎉</span>
                                    <span className="sm:hidden">Selesai! 🎉</span>
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}