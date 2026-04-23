import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import {
    motion, AnimatePresence,
    useMotionValue, useSpring, useTransform
} from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import {
    CheckCircle2, Clock, Upload, Trophy,
    Megaphone, AlertTriangle, Info, ArrowRight,
    Calendar, Sparkles, Bell, CalendarPlus,
    UserCheck, FileUp, Star, Gift,
    ChevronRight, ChevronDown, Zap, Rocket
} from 'lucide-react';

/* ══════════════════════════════════════════════
   3D TILT CARD
══════════════════════════════════════════════ */
function TiltCard({ children, className = '', intensity = 12 }) {
    const ref   = useRef(null);
    const rotX  = useSpring(0, { stiffness: 250, damping: 28 });
    const rotY  = useSpring(0, { stiffness: 250, damping: 28 });
    const shine = useMotionValue(0);

    const onMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const r  = el.getBoundingClientRect();
        rotX.set(-((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * intensity);
        rotY.set( ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * intensity);
        shine.set(((e.clientX - r.left) / r.width) * 100);
    }, [intensity]);

    const onLeave = useCallback(() => { rotX.set(0); rotY.set(0); }, []);
    const bg = useTransform(shine, [0, 100],
        ['rgba(99,102,241,0)', 'rgba(99,102,241,0.10)']);

    return (
        <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 700 }}
            className={`relative ${className}`}>
            <motion.div style={{ background: bg }}
                className="absolute inset-0 rounded-2xl pointer-events-none z-10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {children}
        </motion.div>
    );
}

/* ══════════════════════════════════════════════
   FLOAT EMOJI
══════════════════════════════════════════════ */
function FloatEmoji({ emoji, x, delay }) {
    return (
        <motion.span className="absolute text-2xl pointer-events-none select-none"
            style={{ left: x, bottom: 0 }}
            initial={{ y: 0, opacity: 1, scale: 0.5 }}
            animate={{ y: -120, opacity: 0, scale: 1.2, rotate: [-10, 10, -5, 0] }}
            transition={{ duration: 1.4, delay, ease: 'easeOut' }}>
            {emoji}
        </motion.span>
    );
}

/* ══════════════════════════════════════════════
   CONFETTI BURST
══════════════════════════════════════════════ */
const CONFETTI_COLORS = ['#6366f1','#34d399','#fbbf24','#f472b6','#60a5fa','#a78bfa'];
function ConfettiBurst({ active }) {
    if (!active) return null;
    return (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-20">
            {Array.from({ length: 12 }, (_, i) => (
                <motion.div key={i} className="absolute w-2 h-2 rounded-sm"
                    style={{ background: CONFETTI_COLORS[i % CONFETTI_COLORS.length], left: '50%', top: '50%' }}
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    animate={{
                        x: Math.cos((i / 12) * Math.PI * 2) * (30 + (i * 7) % 30),
                        y: Math.sin((i / 12) * Math.PI * 2) * (30 + (i * 7) % 30),
                        rotate: 360 * (i % 2 === 0 ? 1 : -1),
                        opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }} />
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════════
   FLOW STEPS
══════════════════════════════════════════════ */
const FLOW_STEPS = [
    { step:1, icon:CalendarPlus, label:'Daftar Event',      desc:'Pilih event & kategori favoritmu',        grad:'from-indigo-500 to-blue-600',   shadow:'shadow-indigo-300',  userAction:true, actionLabel:'Daftar Sekarang', actionRoute:'events.index',               emoji:'🎯' },
    { step:2, icon:UserCheck,    label:'Admin Approve',     desc:'Tunggu konfirmasi admin 1–2 hari',         grad:'from-violet-500 to-purple-600', shadow:'shadow-violet-300',  waiting:true,                                                                             emoji:'⏳' },
    { step:3, icon:FileUp,       label:'Upload Karya',      desc:'Unggah karya terbaikmu!',                  grad:'from-rose-500 to-pink-600',     shadow:'shadow-rose-300',    userAction:true, actionLabel:'Upload Karya',    actionRoute:'user.registrations.index',   emoji:'🎨' },
    { step:4, icon:Star,         label:'Juri Menilai',      desc:'Juri profesional menilai karyamu',         grad:'from-amber-500 to-orange-500',  shadow:'shadow-amber-300',   waiting:true,                                                                             emoji:'⭐' },
    { step:5, icon:Trophy,       label:'Pengumuman',        desc:'Pantau hasilnya di dashboard!',            grad:'from-emerald-500 to-teal-600',  shadow:'shadow-emerald-300', highlight:true,                                                                            emoji:'🏆' },
    { step:6, icon:Gift,         label:'Hadiah & Sertifikat',desc:'Pemenang dapat hadiah & sertifikat',      grad:'from-yellow-400 to-amber-500',  shadow:'shadow-yellow-300',  highlight:true,                                                                            emoji:'🎁' },
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id:i, left:`${(i*337)%100}%`, top:`${(i*271)%100}%`,
    dur:2.5+(i%4), delay:(i%5)*0.6, size:3+(i%3),
    color:['#818cf8','#60a5fa','#34d399','#fbbf24','#f472b6'][i%5],
}));

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.5,ease:[0.22,1,0.36,1]}} };

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Dashboard({ registrations, announcements }) {
    const [burstIdx,    setBurstIdx]    = useState(null);
    const [floatEmojis, setFloatEmojis] = useState([]);

    const stats = [
        { label:'Pendaftaran',  value:registrations.length,                                             icon:Calendar,    grad:'from-indigo-500 to-blue-600',   shadow:'shadow-indigo-200',  emoji:'📋' },
        { label:'Disetujui',    value:registrations.filter(r=>r.status==='approved').length,            icon:CheckCircle2,grad:'from-emerald-500 to-teal-600',   shadow:'shadow-emerald-200', emoji:'✅' },
        { label:'Sudah Upload', value:registrations.filter(r=>r.submission).length,                     icon:Upload,      grad:'from-violet-500 to-purple-600',  shadow:'shadow-violet-200',  emoji:'🎨' },
        { label:'Pengumuman',   value:announcements.length,                                             icon:Bell,        grad:'from-amber-500 to-orange-500',   shadow:'shadow-amber-200',   emoji:'📢' },
    ];

    function handleStatHover(i) {
        setBurstIdx(i);
        const emojis = [stats[i].emoji,'✨','🎉'];
        setFloatEmojis(emojis.map((em, j) => ({ id:Date.now()+j, emoji:em, x:`${20+j*30}%`, delay:j*0.15 })));
        setTimeout(() => setFloatEmojis([]), 1600);
    }

    return (
        <UserLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* ── HERO BANNER ── */}
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.7}}
                className="relative overflow-hidden rounded-3xl mb-8
                           bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                           p-7 text-white shadow-2xl shadow-indigo-950/40">
                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage:`linear-gradient(rgba(99,102,241,0.5) 1px,transparent 1px),
                                     linear-gradient(90deg,rgba(99,102,241,0.5) 1px,transparent 1px)`,
                    backgroundSize:'40px 40px'}} />
                <motion.div className="absolute w-64 h-64 rounded-full pointer-events-none"
                    style={{background:'radial-gradient(circle,#6366f1 0%,transparent 70%)',top:'-20%',right:'-5%',opacity:0.2}}
                    animate={{scale:[1,1.4,1]}} transition={{duration:7,repeat:Infinity,ease:'easeInOut'}}/>
                <motion.div className="absolute w-48 h-48 rounded-full pointer-events-none"
                    style={{background:'radial-gradient(circle,#06b6d4 0%,transparent 70%)',bottom:'-15%',left:'5%',opacity:0.15}}
                    animate={{scale:[1.2,1,1.2]}} transition={{duration:9,repeat:Infinity,ease:'easeInOut'}}/>
                {PARTICLES.map(p => (
                    <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                        style={{width:p.size,height:p.size,background:p.color,left:p.left,top:p.top}}
                        animate={{y:[0,-18,0],opacity:[0.2,0.8,0.2]}}
                        transition={{duration:p.dur,repeat:Infinity,delay:p.delay}}/>
                ))}
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                    <div>
                        <motion.div initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
                            className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30
                                       text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300"/> Selamat Datang Kembali!
                        </motion.div>
                        <motion.h1 initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
                            className="text-2xl font-black text-white tracking-tight">
                            Dashboard Peserta 🪁
                        </motion.h1>
                        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
                            className="text-slate-300 text-sm mt-1">
                            Pantau pendaftaran & karya kamu semua di sini.
                        </motion.p>
                    </div>
                    <motion.div animate={{rotate:[0,8,-4,0],y:[0,-10,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}
                        style={{transformStyle:'preserve-3d'}} className="hidden sm:block shrink-0">
                        <svg width="80" height="96" viewBox="0 0 100 120" fill="none">
                            <defs>
                                <linearGradient id="kg-hero" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#60a5fa"/>
                                </linearGradient>
                                <filter id="ks-hero"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.5"/></filter>
                            </defs>
                            <polygon points="50,5 95,50 50,85 5,50" fill="url(#kg-hero)" filter="url(#ks-hero)"/>
                            <line x1="50" y1="5" x2="50" y2="85" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <polygon points="50,5 95,50 50,50 5,50" fill="rgba(255,255,255,0.1)"/>
                            <path d="M50 85 Q45 97 50 108 Q55 117 50 120" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                            {[93,101,109].map((y,i)=><circle key={i} cx={50+(i%2===0?-4:4)} cy={y} r="2.5" fill="#818cf8" opacity="0.7"/>)}
                        </svg>
                    </motion.div>
                </div>
            </motion.div>

            {/* ── STAT CARDS ── */}
            <motion.div initial="hidden" animate="show" variants={stagger}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s,i) => (
                    <motion.div key={i} variants={fadeUp}>
                        <TiltCard className="group" intensity={14}>
                            <motion.div
                                onHoverStart={()=>handleStatHover(i)}
                                onHoverEnd={()=>setBurstIdx(null)}
                                whileHover={{y:-6}}
                                className={`relative bg-white rounded-2xl p-5 shadow-lg ${s.shadow}
                                            border border-gray-100 flex items-center gap-4 overflow-hidden cursor-default`}>
                                <ConfettiBurst active={burstIdx===i}/>
                                <div className="absolute inset-0 pointer-events-none">
                                    <AnimatePresence>
                                        {burstIdx===i && floatEmojis.map(fe=>(
                                            <FloatEmoji key={fe.id} emoji={fe.emoji} x={fe.x} delay={fe.delay}/>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <motion.div className={`w-12 h-12 bg-gradient-to-br ${s.grad} rounded-xl
                                                         flex items-center justify-center shadow-md shrink-0`}
                                    whileHover={{rotate:[-10,10,0],scale:1.1}} transition={{duration:0.4}}>
                                    <s.icon className="w-5 h-5 text-white"/>
                                </motion.div>
                                <div>
                                    <motion.p className="text-2xl font-black text-gray-800 tabular-nums"
                                        key={s.value} initial={{scale:1.3,color:'#6366f1'}}
                                        animate={{scale:1,color:'#1f2937'}} transition={{duration:0.4}}>
                                        {s.value}
                                    </motion.p>
                                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                </div>
                                <div className={`absolute -bottom-3 -right-3 w-16 h-16
                                                 bg-gradient-to-br ${s.grad} opacity-5 rounded-full`}/>
                            </motion.div>
                        </TiltCard>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── COMPETITION FLOW ── */}
            <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.15}}
                className="mb-8 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="relative overflow-hidden px-6 py-5 border-b border-gray-100
                                bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage:`linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),
                                         linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)`,
                        backgroundSize:'30px 30px'}}/>
                    <div className="relative flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <motion.div animate={{rotate:[0,15,-10,0]}} transition={{duration:4,repeat:Infinity}}
                                className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-white"/>
                            </motion.div>
                            <div>
                                <h2 className="font-black text-white text-base">Alur Kompetisi</h2>
                                <p className="text-indigo-200 text-xs">Ikuti 6 langkah ini untuk menjadi juara 🏆</p>
                            </div>
                        </div>
                        <motion.span animate={{scale:[1,1.05,1]}} transition={{duration:2,repeat:Infinity}}
                            className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30
                                       text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                            Panduan Peserta
                        </motion.span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="hidden md:block">
                        <div className="flex items-stretch gap-0">
                            {FLOW_STEPS.slice(0,4).map((s,i)=>(
                                <FlowStep3D key={s.step} step={s} isLast={i===3} dir="right" index={i}/>
                            ))}
                        </div>
                        <div className="flex justify-end pr-[calc(12.5%-20px)] my-2">
                            <motion.div animate={{y:[0,6,0]}} transition={{duration:1.2,repeat:Infinity}}
                                className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200
                                           rounded-full flex items-center justify-center shadow-sm">
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                                    <path d="M6 1v12M2 9l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </motion.div>
                        </div>
                        <div className="flex items-stretch gap-0 flex-row-reverse">
                            {FLOW_STEPS.slice(4).map((s,i)=>(
                                <FlowStep3D key={s.step} step={s} isLast={i===FLOW_STEPS.slice(4).length-1} dir="left" index={i+4}/>
                            ))}
                            <div className="flex-1 flex items-center">
                                <div className="flex-1 border-t-2 border-dashed border-gray-100"/>
                                <div className="flex-1 border-t-2 border-dashed border-gray-100"/>
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden space-y-2">
                        {FLOW_STEPS.map((s,i)=>(
                            <FlowStepMobile key={s.step} step={s} isLast={i===FLOW_STEPS.length-1} index={i}/>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── PENDAFTARAN + PENGUMUMAN ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PENDAFTARAN */}
                <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{duration:0.6,delay:0.2}}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-indigo-600"/>
                            </div>
                            <h2 className="font-bold text-gray-800">Pendaftaran Saya</h2>
                        </div>
                        <Link href={route('user.registrations.index')}
                            className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3"/>
                        </Link>
                    </div>
                    <div className="p-6">
                        {registrations.length === 0 ? (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-10">
                                <motion.div animate={{y:[0,-10,0],rotate:[0,5,-3,0]}} transition={{duration:3,repeat:Infinity}}
                                    className="text-5xl mb-3">📋</motion.div>
                                <p className="text-gray-500 text-sm mb-4">Belum ada pendaftaran. Yuk mulai!</p>
                                <Link href={route('events.index')}
                                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600
                                               text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200
                                               hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-300">
                                    Lihat Event Tersedia <ArrowRight className="w-3.5 h-3.5"/>
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {registrations.slice(0,4).map((reg,i)=>(
                                        <RegistrationItem key={reg.id} reg={reg} index={i}/>
                                    ))}
                                </AnimatePresence>
                                {registrations.length > 4 && (
                                    <Link href={route('user.registrations.index')}
                                        className="block text-center text-sm text-indigo-600 font-semibold hover:underline pt-2">
                                        +{registrations.length-4} pendaftaran lainnya →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ════════════════════════════════════
                    PENGUMUMAN — with expandable detail
                ════════════════════════════════════ */}
                <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{duration:0.6,delay:0.3}}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Megaphone className="w-4 h-4 text-amber-600"/>
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-800">Pengumuman Terbaru</h2>
                                {announcements.length > 0 && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        Klik pengumuman untuk lihat detail
                                    </p>
                                )}
                            </div>
                        </div>
                        {announcements.length > 0 && (
                            <motion.span animate={{scale:[1,1.15,1]}} transition={{duration:1.5,repeat:Infinity}}
                                className="bg-red-500 text-white text-xs font-black
                                           px-2.5 py-1 rounded-full shadow-sm shadow-red-200">
                                {announcements.length} baru
                            </motion.span>
                        )}
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto max-h-[480px]">
                        {announcements.length === 0 ? (
                            <div className="text-center py-10">
                                <motion.div animate={{rotate:[0,12,-6,0]}} transition={{duration:4,repeat:Infinity}}
                                    className="text-5xl mb-3">📢</motion.div>
                                <p className="text-gray-400 text-sm">Belum ada pengumuman terbaru.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {announcements.map((a,i)=>(
                                    <AnnouncementItem key={a.id} ann={a} index={i}/>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}

/* ══════════════════════════════════════════════
   ANNOUNCEMENT ITEM — expandable
══════════════════════════════════════════════ */
function AnnouncementItem({ ann, index }) {
    const [expanded, setExpanded] = useState(false);

    const typeCfg = {
        winner:  { icon:Trophy,        border:'border-l-amber-400',  bg:'bg-amber-50',   activeBg:'bg-amber-100/60',  text:'text-amber-700',  label:'Pemenang 🏆'   },
        warning: { icon:AlertTriangle, border:'border-l-red-400',    bg:'bg-red-50',     activeBg:'bg-red-100/60',    text:'text-red-700',    label:'Peringatan ⚠️' },
        update:  { icon:Info,          border:'border-l-blue-400',   bg:'bg-blue-50',    activeBg:'bg-blue-100/60',   text:'text-blue-700',   label:'Update 🔄'     },
        info:    { icon:Info,          border:'border-l-indigo-400', bg:'bg-indigo-50',  activeBg:'bg-indigo-100/60', text:'text-indigo-700', label:'Info ℹ️'       },
    };
    const cfg  = typeCfg[ann.type] ?? typeCfg.info;
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity:0, x:16 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay: index * 0.08 }}
            layout
            className={`rounded-2xl border-l-4 ${cfg.border} overflow-hidden
                        transition-all duration-300 cursor-pointer
                        ${expanded ? cfg.activeBg + ' shadow-md' : cfg.bg + ' hover:shadow-sm'}`}
            onClick={() => setExpanded(v => !v)}>

            {/* ── Header row ── */}
            <div className="flex items-start gap-3 p-4">
                <motion.div
                    whileHover={{ rotate: [0,-10,10,0] }}
                    transition={{ duration:0.3 }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center
                                 shrink-0 ${cfg.text} bg-white/80 shadow-sm mt-0.5`}>
                    <Icon className="w-4 h-4"/>
                </motion.div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wide
                                          ${cfg.text} bg-white/60 px-2 py-0.5 rounded-full`}>
                            {cfg.label}
                        </span>
                        {ann.event?.title && (
                            <span className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">
                                {ann.event.title}
                            </span>
                        )}
                    </div>
                    <p className={`font-bold text-gray-800 text-sm leading-snug
                                   ${expanded ? '' : 'truncate'}`}>
                        {ann.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(ann.published_at).toLocaleDateString('id-ID',{
                            day:'numeric', month:'long', year:'numeric'
                        })}
                    </p>
                </div>

                {/* Expand toggle */}
                <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0
                                ${cfg.text} bg-white/60 border border-white/80 shadow-sm mt-0.5`}>
                    <ChevronDown className="w-3.5 h-3.5"/>
                </motion.div>
            </div>

            {/* ── Expanded content ── */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0">
                            {/* Divider */}
                            <div className={`h-px mb-3 bg-gradient-to-r from-transparent
                                             via-current to-transparent opacity-20 ${cfg.text}`}/>

                            {ann.content ? (
                                <motion.p
                                    initial={{ opacity:0, y:6 }}
                                    animate={{ opacity:1, y:0 }}
                                    transition={{ delay:0.1 }}
                                    className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {ann.content}
                                </motion.p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">
                                    Tidak ada detail tambahan.
                                </p>
                            )}

                            {/* Footer info */}
                            <motion.div
                                initial={{ opacity:0 }}
                                animate={{ opacity:1 }}
                                transition={{ delay:0.15 }}
                                className="flex items-center gap-3 mt-4 pt-3 border-t border-white/60 flex-wrap">
                                {ann.event?.title && (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500
                                                     bg-white/60 px-2.5 py-1 rounded-lg">
                                        📅 {ann.event.title}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-xs text-gray-400
                                                 bg-white/60 px-2.5 py-1 rounded-lg ml-auto">
                                    🕐 {new Date(ann.published_at).toLocaleDateString('id-ID',{
                                        weekday:'long', day:'numeric', month:'long', year:'numeric'
                                    })}
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ══════════════════════════════
   FLOW STEP — Desktop 3D
══════════════════════════════ */
function FlowStep3D({ step, isLast, dir, index }) {
    const Icon = step.icon;
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{delay:index*0.08,duration:0.5,ease:[0.22,1,0.36,1]}}
            className="flex items-center flex-1 min-w-0">
            <TiltCard intensity={16} className="flex-1 min-w-0">
                <motion.div
                    onHoverStart={()=>setHovered(true)}
                    onHoverEnd={()=>setHovered(false)}
                    whileHover={{y:-8,scale:1.04}}
                    transition={{type:'spring',stiffness:280,damping:20}}
                    className={`relative flex flex-col items-center text-center px-2 py-4 mx-1
                                rounded-2xl border-2 transition-all duration-300 cursor-default overflow-hidden
                                ${hovered ? 'border-indigo-200 bg-gradient-to-b from-white to-indigo-50/40 shadow-xl shadow-indigo-100'
                                          : 'border-gray-100 bg-white shadow-sm'}`}>
                    <AnimatePresence>
                        {hovered && (
                            <motion.span key="float"
                                className="absolute top-1 right-2 text-lg pointer-events-none"
                                initial={{opacity:0,y:4,scale:0.6}} animate={{opacity:1,y:-4,scale:1}}
                                exit={{opacity:0}} transition={{duration:0.3}}>
                                {step.emoji}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <motion.div className={`relative w-14 h-14 bg-gradient-to-br ${step.grad} rounded-2xl
                                             flex items-center justify-center shadow-lg ${step.shadow} mb-3 shrink-0`}
                        animate={hovered?{rotateY:360}:{rotateY:0}} transition={{duration:0.6,ease:'easeInOut'}}
                        style={{transformStyle:'preserve-3d'}}>
                        <Icon className="w-6 h-6 text-white"/>
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-white border-2 border-gray-200
                                         rounded-full text-[10px] font-black text-gray-600
                                         flex items-center justify-center shadow-sm">{step.step}</span>
                        {step.waiting && (
                            <motion.span className="absolute inset-0 rounded-2xl border-2 border-white/60"
                                animate={{scale:[1,1.25],opacity:[0.6,0]}} transition={{duration:1.4,repeat:Infinity}}/>
                        )}
                    </motion.div>
                    <p className="text-xs font-black text-gray-800 leading-tight mb-1">{step.label}</p>
                    <p className="text-[10px] text-gray-400 leading-tight max-w-[85px]">{step.desc}</p>
                    <div className="mt-2">
                        {step.userAction && (
                            <Link href={route(step.actionRoute)}
                                className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600
                                           to-blue-600 text-white text-[10px] font-bold px-2.5 py-1
                                           rounded-lg shadow-sm shadow-indigo-200 hover:-translate-y-0.5
                                           hover:shadow-indigo-300 transition-all duration-200">
                                {step.actionLabel} <ChevronRight className="w-2.5 h-2.5"/>
                            </Link>
                        )}
                        {step.waiting && (
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500
                                             text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                                <Clock className="w-2.5 h-2.5"/> Menunggu
                            </span>
                        )}
                        {step.highlight && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100
                                             to-yellow-100 text-amber-700 text-[10px] font-bold px-2.5 py-1
                                             rounded-lg border border-amber-200">
                                <Trophy className="w-2.5 h-2.5"/> Hasil!
                            </span>
                        )}
                    </div>
                </motion.div>
            </TiltCard>
            {!isLast && (
                <motion.div initial={{scaleX:0}} animate={{scaleX:1}}
                    transition={{delay:index*0.08+0.35,duration:0.4}}
                    style={{transformOrigin:dir==='right'?'left':'right'}}
                    className="flex items-center gap-0.5 shrink-0 mx-0.5">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"/>
                    <ChevronRight className="w-3 h-3 text-gray-300 -ml-1"/>
                </motion.div>
            )}
        </motion.div>
    );
}

/* ══════════════════════════════
   FLOW STEP — Mobile
══════════════════════════════ */
function FlowStepMobile({ step, isLast, index }) {
    const Icon = step.icon;
    return (
        <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:index*0.07}}
            className="flex items-start gap-4">
            <div className="flex flex-col items-center shrink-0">
                <motion.div whileHover={{scale:1.1,rotate:5}}
                    className={`relative w-11 h-11 bg-gradient-to-br ${step.grad} rounded-xl
                                 flex items-center justify-center shadow-md ${step.shadow}`}>
                    <Icon className="w-5 h-5 text-white"/>
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-gray-200
                                     rounded-full text-[9px] font-black text-gray-600 flex items-center justify-center">
                        {step.step}
                    </span>
                </motion.div>
                {!isLast && (
                    <motion.div className="w-px mt-1 bg-gradient-to-b from-gray-200 to-transparent"
                        initial={{height:0}} animate={{height:28}} transition={{delay:index*0.07+0.3}}/>
                )}
            </div>
            <div className="flex-1 pb-1 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-800 text-sm">{step.label}</p>
                    <span className="text-sm">{step.emoji}</span>
                    {step.userAction && (
                        <Link href={route(step.actionRoute)}
                            className="inline-flex items-center gap-1 bg-indigo-600 text-white
                                       text-[10px] font-bold px-2 py-0.5 rounded-lg hover:bg-indigo-700 transition-colors">
                            {step.actionLabel} <ChevronRight className="w-2.5 h-2.5"/>
                        </Link>
                    )}
                    {step.waiting && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500
                                         text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                            <Clock className="w-2.5 h-2.5"/> Menunggu
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
            </div>
        </motion.div>
    );
}

/* ══════════════════════════════
   REGISTRATION ITEM
══════════════════════════════ */
function RegistrationItem({ reg, index }) {
    const hasSubmission = !!reg.submission;
    const isApproved    = reg.status === 'approved';
    const statusCfg = {
        pending:  { label:'Menunggu',  bg:'bg-amber-100',   text:'text-amber-800',   dot:'bg-amber-400'   },
        approved: { label:'Disetujui', bg:'bg-emerald-100', text:'text-emerald-800', dot:'bg-emerald-400' },
        rejected: { label:'Ditolak',   bg:'bg-red-100',     text:'text-red-800',     dot:'bg-red-400'     },
    };
    const cfg = statusCfg[reg.status] ?? statusCfg.pending;
    return (
        <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:index*0.07}}
            whileHover={{x:4}}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100
                       hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200">
            <motion.div animate={{scale:[1,1.4,1]}} transition={{duration:2,repeat:Infinity,delay:index*0.3}}
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`}/>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{reg.event.title}</p>
                <p className="text-xs text-gray-400 truncate">{reg.category.name}</p>
            </div>
            <div className="shrink-0">
                {isApproved && !hasSubmission ? (
                    <Link href={route('user.submissions.create', reg.id)}
                        className="flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-blue-600
                                   text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm
                                   shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5
                                   transition-all duration-200">
                        <Upload className="w-3 h-3"/> Upload
                    </Link>
                ) : isApproved && hasSubmission ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700
                                     bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                        ✅ Sudah Upload
                    </span>
                ) : (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                    </span>
                )}
            </div>
        </motion.div>
    );
}