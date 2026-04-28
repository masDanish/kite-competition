import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { ChevronRight, TrendingUp, Zap } from 'lucide-react';

/* ══ 3D TILT CARD ══ */
function TiltCard({ children, className = '', intensity = 10 }) {
    const ref   = useRef(null);
    const rotX  = useSpring(0, { stiffness: 250, damping: 28 });
    const rotY  = useSpring(0, { stiffness: 250, damping: 28 });
    const shine = useMotionValue(50);
    const onMove = useCallback((e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        rotX.set(-((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * intensity);
        rotY.set( ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * intensity);
        shine.set(((e.clientX - r.left) / r.width) * 100);
    }, [intensity]);
    const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, []);
    const shimmerBg = useTransform(shine, [0, 100], ['rgba(20,184,166,0)', 'rgba(20,184,166,0.08)']);
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

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
    id: i, left: `${(i * 337) % 100}%`, top: `${(i * 271) % 100}%`,
    dur: 2.5 + (i % 4), delay: (i % 5) * 0.6, size: 2 + (i % 3),
    color: ['#2dd4bf','#67e8f9','#34d399','#a5f3fc','#5eead4'][i % 5],
}));

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

export default function Index({ assignments }) {
    return (
        <JuryLayout header="Penilaian Juri">
            <Head title="Penilaian Juri" />

            {/* ── HERO BANNER ── */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-3xl mb-8
                           bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950
                           p-7 text-white shadow-2xl shadow-teal-950/40">
                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }} />
                <motion.div className="absolute w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', top: '-20%', right: '-5%', opacity: 0.18 }}
                    animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
                {PARTICLES.map(p => (
                    <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                        style={{ width: p.size, height: p.size, background: p.color, left: p.left, top: p.top }}
                        animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
                ))}
                <div className="relative z-10 flex justify-between items-center gap-5">
                    <div>
                        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30
                                       text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Zap className="w-3 h-3 text-yellow-300" />
                            Panel Juri
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                            className="text-2xl font-black text-white tracking-tight">
                            Event yang Perlu Dinilai 📋
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="text-slate-300 text-sm mt-1">
                            Pilih event untuk mulai memberikan penilaian karya.
                        </motion.p>
                    </div>
                    <motion.div animate={{ rotate: [0, 8, -4, 0], y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="hidden sm:block shrink-0 text-6xl">⚖️</motion.div>
                </div>
            </motion.div>

            {/* ── LIST CARD ── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="relative overflow-hidden px-6 py-5 border-b border-gray-100
                                bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px',
                    }} />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div animate={{ rotate: [0, 12, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                                className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </motion.div>
                            <div>
                                <h2 className="font-black text-white text-base">Event Penugasan</h2>
                                <p className="text-teal-200 text-xs">Klik tombol Nilai untuk masuk ke halaman penilaian</p>
                            </div>
                        </div>
                        <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30
                                       text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {assignments.length} Event
                        </motion.span>
                    </div>
                </div>

                <div className="p-6">
                    {assignments.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center py-16 text-gray-400">
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                                className="text-6xl mb-4">⚖️</motion.div>
                            <p className="font-semibold text-gray-500 mb-1">Belum Ada Penugasan</p>
                            <p className="text-sm">Admin belum menugaskan event untuk Anda.</p>
                        </motion.div>
                    ) : (
                        <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-4">
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
    const pct = a.progress?.percentage ?? 0;
    const isComplete = a.progress?.is_complete ?? false;

    return (
        <TiltCard className="group" intensity={8}>
            <motion.div
                variants={fadeUp}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 bg-white
                            ${hovered ? 'border-teal-200 shadow-lg shadow-teal-100' : 'border-gray-100 shadow-sm'}`}>

                <div className={`h-1 w-full bg-gradient-to-r transition-all duration-500
                                 ${isComplete ? 'from-emerald-400 to-teal-500' : 'from-teal-400 to-cyan-500'}`} />

                <div className="p-5">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                            {/* Hover emoji */}
                            <AnimatePresence>
                                {hovered && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5, y: 4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="inline-block text-lg mb-1">
                                        ✨
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <p className="font-bold text-gray-800 text-sm leading-tight">{a.event?.title}</p>
                            {a.category && (
                                <span className="inline-flex items-center gap-1 mt-1.5 text-xs
                                                 bg-teal-50 text-teal-700 border border-teal-100
                                                 px-2.5 py-0.5 rounded-full font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                    {a.category.name}
                                </span>
                            )}
                        </div>

                        <motion.div whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.96 }}>
                            <Link href={route('jury.submissions.index', a.event.id)}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500
                                           to-cyan-500 text-white text-xs font-bold px-4 py-2.5
                                           rounded-xl shadow-md shadow-teal-200 hover:shadow-teal-300
                                           transition-all duration-200 shrink-0">
                                Nilai <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </motion.div>
                    </div>

                    {a.progress && (
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-2">
                                <span className="font-medium">Progres Penilaian</span>
                                <span className={`font-bold ${isComplete ? 'text-emerald-600' : 'text-teal-600'}`}>
                                    {a.progress.scored_submissions}/{a.progress.total_submissions} · {pct}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                    className={`h-2.5 rounded-full bg-gradient-to-r
                                                ${isComplete ? 'from-emerald-400 to-teal-500' : 'from-teal-400 to-cyan-500'}`} />
                            </div>
                            <AnimatePresence>
                                {isComplete && (
                                    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-2">
                                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">
                                            ✓
                                        </motion.span>
                                        Penilaian selesai! 🎉
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </TiltCard>
    );
}