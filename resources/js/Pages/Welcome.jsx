import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
    Palette, Scale, Trophy, Globe, Sparkles, Rocket,
    Wind, Star, ArrowRight, ChevronDown, Play,
    Zap, Shield, Users, Award
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Logo from '@/Assets/logo.png';

/* ══════════════════════════════════════
   3D CARD
══════════════════════════════════════ */
function Card3D({ children, className = '', intensity = 15 }) {
    const cardRef = useRef(null);
    const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
    const rotateY = useSpring(0, { stiffness: 200, damping: 25 });
    const glowX   = useMotionValue(50);
    const glowY   = useMotionValue(50);

    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        rotateX.set(-dy * intensity);
        rotateY.set( dx * intensity);
        glowX.set(((e.clientX - rect.left) / rect.width)  * 100);
        glowY.set(((e.clientY - rect.top)  / rect.height) * 100);
    }, [intensity]);

    const handleMouseLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
    }, []);

    return (
        <motion.div ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
            className={`relative ${className}`}>
            <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none z-10 opacity-0
                           group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(99,102,241,0.15) 0%, transparent 60%)` }}
            />
            {children}
        </motion.div>
    );
}

/* ══════════════════════════════════════
   SVG KITE 3D
══════════════════════════════════════ */
function Kite3D({ size = 120, color1 = '#6366f1', color2 = '#3b82f6', delay = 0, className = '' }) {
    return (
        <motion.div className={`relative ${className}`}
            style={{ width: size, height: size * 1.2 }}
            animate={{ y: [0, -20, 0], rotate: [0, 4, -3, 0] }}
            transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
            <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none">
                <defs>
                    <linearGradient id={`kg${delay}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <filter id={`ks${delay}`}>
                        <feDropShadow dx="0" dy="6" stdDeviation="8"
                            floodColor={color1} floodOpacity="0.5" />
                    </filter>
                </defs>
                <polygon points="50,5 95,50 50,85 5,50"
                    fill={`url(#kg${delay})`} filter={`url(#ks${delay})`} />
                <line x1="50" y1="5" x2="50" y2="85"
                    stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <line x1="5" y1="50" x2="95" y2="50"
                    stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <polygon points="50,5 95,50 50,50 5,50"
                    fill="rgba(255,255,255,0.1)" />
                <path d="M50 85 Q45 95 50 105 Q55 115 50 118"
                    stroke={color2} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {[93, 100, 107].map((y, i) => (
                    <circle key={i} cx={50 + (i % 2 === 0 ? -4 : 4)} cy={y}
                        r="2.5" fill={color1} opacity="0.7" />
                ))}
            </svg>
        </motion.div>
    );
}

/* ══════════════════════════════════════
   PARTICLES — pre-computed untuk SSR
══════════════════════════════════════ */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    width:  (i % 4) + 1,
    height: (i % 4) + 1,
    color:  ['#818cf8','#60a5fa','#a78bfa','#34d399'][i % 4],
    left:   `${(i * 337) % 100}%`,
    top:    `${(i * 271) % 100}%`,
    dur:    3 + (i % 5),
    delay:  (i % 4) * 0.8,
    rise:   20 + (i % 4) * 10,
}));

export default function Welcome({ auth = { user: null } }) {
    const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
    const [activeFeature, setActive] = useState(null);
    const [count, setCount]          = useState({ events: 0, participants: 0, winners: 0 });
    const [activeTestimonial, setTesti] = useState(0);
    const heroRef  = useRef(null);
    const { scrollY } = useScroll();
    const heroY   = useTransform(scrollY, [0, 600], [0, -160]);
    const heroOpa = useTransform(scrollY, [0, 400],  [1, 0]);

    useEffect(() => {
        const h = (e) => setMousePos({
            x: (e.clientX / window.innerWidth  - 0.5) * 40,
            y: (e.clientY / window.innerHeight - 0.5) * 40,
        });
        window.addEventListener('mousemove', h);
        return () => window.removeEventListener('mousemove', h);
    }, []);

    useEffect(() => {
        const targets = { events: 48, participants: 1200, winners: 144 };
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const ease = 1 - Math.pow(1 - step / 80, 3);
            setCount({
                events:       Math.round(targets.events       * ease),
                participants: Math.round(targets.participants * ease),
                winners:      Math.round(targets.winners      * ease),
            });
            if (step >= 80) clearInterval(timer);
        }, 2000 / 80);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setTesti(p => (p + 1) % 3), 4000);
        return () => clearInterval(t);
    }, []);

    const features = [
        { icon: Palette, title: "Desain Kreatif",      desc: "Eksplorasi desain layangan tanpa batas dengan tools modern dan intuitif.",       color: "from-violet-500 to-purple-600", bg: "bg-violet-50",  shadow: "shadow-violet-200"  },
        { icon: Scale,   title: "Penilaian Adil",       desc: "Sistem scoring transparan dan objektif oleh juri berpengalaman di bidangnya.",   color: "from-blue-500 to-cyan-600",    bg: "bg-blue-50",    shadow: "shadow-blue-200"    },
        { icon: Trophy,  title: "Kompetisi Bergengsi",  desc: "Raih penghargaan dan pengakuan dari komunitas layangan nasional Indonesia.",     color: "from-amber-500 to-orange-600", bg: "bg-amber-50",   shadow: "shadow-amber-200"   },
        { icon: Globe,   title: "Skala Nasional",       desc: "Bersaing dengan peserta terbaik dari 34 kota di seluruh penjuru Indonesia.",     color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", shadow: "shadow-emerald-200" },
        { icon: Zap,     title: "Real-time Scoring",   desc: "Pantau hasil penilaian secara langsung, tanpa harus menunggu lama.",             color: "from-pink-500 to-rose-600",    bg: "bg-pink-50",    shadow: "shadow-pink-200"    },
        { icon: Shield,  title: "Aman & Terpercaya",   desc: "Platform terverifikasi dengan sistem keamanan data peserta tingkat enterprise.",  color: "from-indigo-500 to-blue-600",  bg: "bg-indigo-50",  shadow: "shadow-indigo-200"  },
    ];

    const kiteImages = [
        "https://images.unsplash.com/photo-1705332096769-0142c80da4ad?q=80&w=1170&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571849291280-89f81a772893?q=80&w=1074&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558641930-072bd59556f0?q=80&w=1170&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1650788998536-a77a54b2a43e?q=80&w=1174&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1715173674824-8199185aa2d2?q=80&w=1170&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1646812281105-6f20622792e6?q=80&w=1173&auto=format&fit=crop",
    ];

    const testimonials = [
        { name: "Andi Pratama",  role: "Juara 1 Kategori Senior",  text: "Platform ini mengubah cara saya berkompetisi. Sistem penilaiannya sangat transparan dan juri memberikan feedback yang membangun!", avatar: "A", color: "from-indigo-500 to-blue-600"    },
        { name: "Dewi Lestari",  role: "Peserta Terbaik 2024",      text: "Pengalaman yang luar biasa! Bisa melihat breakdown nilai per kriteria langsung dari juri profesional. Sangat memotivasi!",          avatar: "D", color: "from-violet-500 to-purple-600" },
        { name: "Rizky Fauzan",  role: "Juara 2 Kategori Junior",   text: "Desain platformnya keren dan mudah digunakan. Upload karya semudah 3 langkah. Tidak sabar untuk ikut kompetisi selanjutnya!",       avatar: "R", color: "from-teal-500 to-emerald-600"   },
    ];

    const stagger = { show: { transition: { staggerChildren: 0.1 } } };
    const fadeUp  = {
        hidden: { opacity: 0, y: 40 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <>
            <Head title="Kite Competition — Terbangkan Kreativitasmu" />
            <div className="min-h-screen bg-white overflow-x-hidden">

                {/* ════════════════════════════════════════
                    NAVBAR  — max-w-6xl + px-6 agar sama dgn konten
                ════════════════════════════════════════ */}
                <motion.header
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-0 left-0 right-0 z-50">
                    <div className="px-6 mt-4">
                        <div className="max-w-6xl mx-auto bg-white/85 backdrop-blur-xl
                                        rounded-2xl border border-white/60 shadow-lg shadow-black/8
                                        px-6 py-3 flex justify-between items-center">

                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <motion.img src={Logo} className="w-10 h-10 object-contain"
                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.4 }} />
                                <div>
                                    <p className="font-black text-gray-900 leading-none text-sm">
                                        Kite Competition
                                    </p>
                                    <p className="text-[10px] text-indigo-500 font-medium">
                                        Design • Fly • Compete
                                    </p>
                                </div>
                            </div>

                            {/* Nav links */}
                            <nav className="hidden md:flex items-center gap-1">
                                {[
                                    { label: 'Tentang',   href: '#tentang'   },
                                    { label: 'Fitur',     href: '#fitur'     },
                                    { label: 'Galeri',    href: '#galeri'    },
                                    { label: 'Testimoni', href: '#testimoni' },
                                ].map(item => (
                                    <a key={item.label} href={item.href}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600
                                                   hover:bg-indigo-50 rounded-xl transition-all duration-200
                                                   font-medium">
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            {/* Auth buttons */}
                            <div className="flex items-center gap-2">
                                {auth.user ? (
                                    <Link href={
                                        auth.user.role === 'admin' ? route('admin.dashboard') :
                                        auth.user.role === 'jury'  ? route('jury.dashboard')  :
                                                                     route('user.dashboard')
                                    }
                                        className="group flex items-center gap-2 bg-gradient-to-r
                                                   from-indigo-600 to-blue-600 text-white text-sm
                                                   font-semibold px-5 py-2.5 rounded-xl shadow-md
                                                   shadow-indigo-300 hover:shadow-indigo-400
                                                   hover:-translate-y-0.5 transition-all duration-300">
                                        Dashboard
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5
                                                               transition-transform" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700
                                                       hover:text-indigo-600 hover:bg-indigo-50
                                                       rounded-xl transition-all duration-200">
                                            Masuk
                                        </Link>
                                        <Link href={route('register')}
                                            className="flex items-center gap-1.5 bg-gradient-to-r
                                                       from-indigo-600 to-blue-600 text-white text-sm
                                                       font-semibold px-5 py-2.5 rounded-xl shadow-md
                                                       shadow-indigo-300 hover:shadow-indigo-400
                                                       hover:-translate-y-0.5 transition-all duration-300">
                                            Daftar Gratis
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* ════════════════════════════════════════
                    HERO  — max-w-6xl + px-6 = sejajar navbar
                ════════════════════════════════════════ */}
                <section ref={heroRef}
                    className="relative min-h-screen flex items-center overflow-hidden pt-28">

                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950
                                    via-indigo-950 to-blue-950" />

                    {/* Grid */}
                    <div className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px',
                        }} />

                    {/* Orbs */}
                    <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', top: '5%', left: '5%' }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', bottom: '5%', right: '5%' }}
                        animate={{ scale: [1.3, 1, 1.3], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', top: '50%', left: '50%' }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />

                    {/* Particles */}
                    {PARTICLES.map(p => (
                        <motion.div key={p.id}
                            className="absolute rounded-full pointer-events-none"
                            style={{ width: p.width, height: p.height, background: p.color, left: p.left, top: p.top }}
                            animate={{ y: [0, -p.rise, 0], opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
                        />
                    ))}

                    {/* Floating kites — right side, mouse parallax */}
                    <div className="absolute right-0 top-1/2 hidden xl:flex flex-col gap-6
                                    items-center pointer-events-none"
                        style={{
                            transform: `translate(${mousePos.x * 0.3}px, calc(-50% + ${mousePos.y * 0.3}px))`,
                            paddingRight: '4rem',
                        }}>
                        <Kite3D size={150} color1="#6366f1" color2="#3b82f6" delay={0} />
                        <Kite3D size={85}  color1="#8b5cf6" color2="#06b6d4" delay={1} />
                        <Kite3D size={65}  color1="#f59e0b" color2="#ef4444" delay={2} />
                    </div>

                    {/* ── Hero content — aligned with navbar ── */}
                    <motion.div style={{ y: heroY, opacity: heroOpa }}
                        className="relative z-10 w-full">
                        <div className="max-w-6xl mx-auto px-6">
                            <motion.div initial="hidden" animate="show" variants={stagger}
                                className="max-w-2xl">

                                {/* Badge */}
                                <motion.div variants={fadeUp}
                                    className="inline-flex items-center gap-2 bg-indigo-500/20
                                               border border-indigo-400/30 text-indigo-300
                                               text-sm font-medium px-4 py-2 rounded-full mb-6
                                               backdrop-blur-sm">
                                    <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                                    Kompetisi Layangan Terpercaya #1 Indonesia
                                    <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                                </motion.div>

                                {/* Heading */}
                                <motion.h1 variants={fadeUp}
                                    className="text-5xl md:text-6xl lg:text-7xl font-black
                                               text-white leading-[1.08] tracking-tight">
                                    Terbangkan{' '}
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400
                                                         to-cyan-400 bg-clip-text text-transparent">
                                            Kreativitasmu
                                        </span>
                                        <motion.div
                                            className="absolute -bottom-2 left-0 right-0 h-[3px]
                                                       bg-gradient-to-r from-indigo-400 via-violet-400
                                                       to-cyan-400 rounded-full"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </span>
                                    {' '}Lebih Tinggi
                                </motion.h1>

                                {/* Subtext */}
                                <motion.p variants={fadeUp}
                                    className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
                                    Platform kompetisi layangan modern dengan sistem penilaian
                                    profesional, real-time, dan transparan. Dari desain hingga
                                    performa — semua terukur secara adil oleh juri terbaik.
                                </motion.p>

                                {/* CTAs */}
                                <motion.div variants={fadeUp}
                                    className="mt-8 flex flex-wrap gap-4">
                                    <Link href={route('register')}
                                        className="group relative flex items-center gap-2 overflow-hidden
                                                   bg-gradient-to-r from-indigo-500 to-blue-600
                                                   text-white font-bold px-8 py-4 rounded-2xl text-base
                                                   shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60
                                                   hover:-translate-y-1 transition-all duration-300">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent
                                                       via-white/20 to-transparent -skew-x-12"
                                            animate={{ x: ['-150%', '150%'] }}
                                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} />
                                        Mulai Sekarang
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1
                                                               transition-transform" />
                                    </Link>
                                    <a href="#tentang"
                                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm
                                                   border border-white/25 text-white font-semibold
                                                   px-8 py-4 rounded-2xl hover:bg-white/20
                                                   transition-all duration-300">
                                        <Play className="w-4 h-4" />
                                        Pelajari Lebih
                                    </a>
                                </motion.div>

                                {/* Stats */}
                                <motion.div variants={fadeUp}
                                    className="mt-12 flex gap-10">
                                    {[
                                        { value: count.events,       suffix: '+', label: 'Event'    },
                                        { value: count.participants, suffix: '+', label: 'Peserta'   },
                                        { value: count.winners,      suffix: '+', label: 'Pemenang'  },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className="text-3xl font-black text-white tabular-nums">
                                                {stat.value.toLocaleString()}{stat.suffix}
                                            </div>
                                            <div className="text-sm text-slate-400 mt-0.5 font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.a href="#tentang"
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col
                                   items-center gap-2 text-slate-400 hover:text-white
                                   transition-colors cursor-pointer"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                        <ChevronDown className="w-5 h-5" />
                    </motion.a>
                </section>

                {/* ════════════════════════════════════════
                    ABOUT
                ════════════════════════════════════════ */}
                <section id="tentang" className="py-28">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">

                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}>
                                <div className="inline-flex items-center gap-2 bg-indigo-100
                                                text-indigo-700 text-sm font-semibold px-4 py-2
                                                rounded-full mb-5">
                                    <Wind className="w-4 h-4" />
                                    Tentang Kompetisi
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                                    Lebih dari Sekadar{' '}
                                    <span className="text-indigo-600">Kompetisi</span>
                                </h2>
                                <p className="mt-5 text-gray-600 leading-relaxed">
                                    Kite Competition hadir untuk mengembangkan kreativitas dalam
                                    dunia layangan, menggabungkan seni visual, teknik aerodinamika,
                                    dan inovasi desain dalam satu ekosistem digital yang modern.
                                </p>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Dengan sistem digital yang transparan, peserta dapat memantau
                                    hasil penilaian secara real-time dan mendapatkan feedback
                                    langsung dari juri berpengalaman di bidangnya.
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    {[
                                        { icon: '🏆', label: 'Juri Profesional', value: '15+ Juri'  },
                                        { icon: '📅', label: 'Event Per Tahun',   value: '12+ Event' },
                                        { icon: '🎯', label: 'Tingkat Kepuasan',  value: '98%'       },
                                        { icon: '🌍', label: 'Kota Peserta',      value: '34 Kota'   },
                                    ].map((item, i) => (
                                        <Card3D key={i} intensity={8} className="group">
                                            <motion.div whileHover={{ scale: 1.03 }}
                                                className="bg-gradient-to-br from-indigo-50 to-blue-50
                                                           border border-indigo-100 rounded-2xl p-4
                                                           cursor-default h-full">
                                                <div className="text-2xl mb-1">{item.icon}</div>
                                                <div className="text-xl font-black text-indigo-700">{item.value}</div>
                                                <div className="text-sm text-gray-500">{item.label}</div>
                                            </motion.div>
                                        </Card3D>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Image collage */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="relative h-[500px]">
                                {[
                                    { src: kiteImages[1], cls: 'top-0 left-0 w-64 h-48',    rotate: -2 },
                                    { src: kiteImages[2], cls: 'top-8 right-0 w-52 h-44',   rotate:  2 },
                                    { src: kiteImages[3], cls: 'bottom-0 left-8 w-56 h-48', rotate:  1 },
                                    { src: kiteImages[4], cls: 'bottom-8 right-4 w-44 h-40',rotate: -1 },
                                ].map((img, i) => (
                                    <motion.img key={i} src={img.src}
                                        className={`absolute ${img.cls} object-cover rounded-3xl shadow-xl cursor-pointer`}
                                        style={{ rotate: img.rotate }}
                                        whileHover={{ scale: 1.07, rotate: 0, zIndex: 10, boxShadow: '0 25px 50px rgba(99,102,241,0.25)' }}
                                        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                                    />
                                ))}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                               bg-white rounded-2xl shadow-2xl p-4 text-center
                                               border border-indigo-100 z-10"
                                    animate={{ y: [0, -10, 0], rotate: [0, 2, -1, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}>
                                    <img src={Logo} className="w-10 h-10 object-contain mx-auto" />
                                    <div className="text-sm font-black text-indigo-700 mt-1">#1 Platform</div>
                                    <div className="text-xs text-gray-500">Layangan Indonesia</div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    FEATURES
                ════════════════════════════════════════ */}
                <section id="fitur" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="text-center mb-16">
                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-100
                                           text-indigo-700 text-sm font-semibold px-4 py-2
                                           rounded-full mb-4">
                                <Sparkles className="w-4 h-4" /> Fitur Unggulan
                            </motion.div>
                            <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900">
                                Semua yang Kamu Butuhkan
                            </motion.h2>
                            <motion.p variants={fadeUp} className="mt-4 text-gray-500 max-w-xl mx-auto">
                                Platform lengkap untuk pengalaman kompetisi layangan terbaik.
                            </motion.p>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <motion.div key={i} variants={fadeUp}>
                                    <Card3D intensity={12} className="group h-full">
                                        <motion.div
                                            onHoverStart={() => setActive(i)}
                                            onHoverEnd={() => setActive(null)}
                                            whileHover={{ y: -6 }}
                                            className={`relative p-6 rounded-3xl border-2
                                                        transition-all duration-300 overflow-hidden
                                                        h-full bg-white cursor-default
                                                        ${activeFeature === i
                                                            ? 'border-indigo-300 shadow-2xl ' + f.shadow
                                                            : 'border-gray-100 shadow-md hover:border-indigo-200'}`}>
                                            <AnimatePresence>
                                                {activeFeature === i && (
                                                    <motion.div
                                                        className={`absolute inset-0 ${f.bg}`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.6 }}
                                                        exit={{ opacity: 0 }} />
                                                )}
                                            </AnimatePresence>
                                            <div className="relative z-10">
                                                <motion.div
                                                    className={`w-14 h-14 bg-gradient-to-br ${f.color}
                                                                 rounded-2xl flex items-center justify-center
                                                                 shadow-lg mb-4`}
                                                    whileHover={{ rotateY: 180, scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}>
                                                    <f.icon className="w-6 h-6 text-white" />
                                                </motion.div>
                                                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                                            </div>
                                            <div className={`absolute -top-4 -right-4 w-24 h-24
                                                             bg-gradient-to-br ${f.color} opacity-[0.07] rounded-full`} />
                                        </motion.div>
                                    </Card3D>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    GALLERY
                ════════════════════════════════════════ */}
                <section id="galeri" className="py-24 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="text-center mb-14">
                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-100
                                           text-indigo-700 text-sm font-semibold px-4 py-2
                                           rounded-full mb-4">
                                🖼️ Galeri
                            </motion.div>
                            <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900">
                                Karya Terbaik Peserta
                            </motion.h2>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {kiteImages.map((img, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ scale: 1.04, zIndex: 10, rotateZ: i % 2 === 0 ? 1 : -1 }}
                                    className={`relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group
                                                ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                    <img src={img}
                                        className={`w-full object-cover transition-transform duration-700
                                                    group-hover:scale-110
                                                    ${i === 0 ? 'h-72 md:h-full' : 'h-full  '}`}
                                        alt={`Galeri ${i + 1}`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70
                                                    via-transparent to-transparent opacity-0
                                                    group-hover:opacity-100 transition-opacity duration-300
                                                    flex items-end p-4">
                                        <div>
                                            <p className="text-white text-sm font-bold">Karya Peserta #{i + 1}</p>
                                            <p className="text-indigo-200 text-xs">Kite Competition 2025</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    TESTIMONIALS
                ════════════════════════════════════════ */}
                <section id="testimoni" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="text-center mb-14">
                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-100
                                           text-indigo-700 text-sm font-semibold px-4 py-2
                                           rounded-full mb-4">
                                <Star className="w-4 h-4 fill-indigo-500" /> Testimoni
                            </motion.div>
                            <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900">
                                Kata Mereka
                            </motion.h2>
                        </motion.div>

                        {/* Desktop */}
                        <div className="hidden md:grid md:grid-cols-3 gap-6">
                            {testimonials.map((t, i) => (
                                <Card3D key={i} intensity={10} className="group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.12 }}
                                        whileHover={{ y: -8 }}
                                        className="bg-white rounded-3xl p-6 shadow-lg border
                                                   border-gray-100 relative overflow-hidden h-full">
                                        <div className="absolute top-3 right-5 text-7xl font-black
                                                        text-indigo-50 leading-none select-none">"</div>
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed relative z-10 mb-5">
                                            "{t.text}"
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className={`w-11 h-11 bg-gradient-to-br ${t.color}
                                                             rounded-full flex items-center justify-center
                                                             text-white font-black text-lg shadow-md`}>
                                                {t.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                                <p className="text-xs text-indigo-500 font-medium">{t.role}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Card3D>
                            ))}
                        </div>

                        {/* Mobile carousel */}
                        <div className="md:hidden">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeTestimonial}
                                    initial={{ opacity: 0, x: 60, rotateY: 20 }}
                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                    exit={{ opacity: 0, x: -60, rotateY: -20 }}
                                    transition={{ duration: 0.45 }}
                                    className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                                        "{testimonials[activeTestimonial].text}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 bg-gradient-to-br ${testimonials[activeTestimonial].color}
                                                         rounded-full flex items-center justify-center
                                                         text-white font-black text-lg`}>
                                            {testimonials[activeTestimonial].avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {testimonials[activeTestimonial].name}
                                            </p>
                                            <p className="text-xs text-indigo-500">
                                                {testimonials[activeTestimonial].role}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            <div className="flex justify-center gap-2 mt-5">
                                {testimonials.map((_, i) => (
                                    <button key={i} onClick={() => setTesti(i)}
                                        className={`h-2.5 rounded-full transition-all duration-300
                                                    ${i === activeTestimonial
                                                        ? 'bg-indigo-600 w-8'
                                                        : 'bg-gray-200 w-2.5'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    CTA
                ════════════════════════════════════════ */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative overflow-hidden rounded-3xl
                                       bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500
                                       p-12 md:p-16 text-center shadow-2xl shadow-indigo-300">

                            {/* Decorations */}
                            <motion.div className="absolute top-0 left-0 w-72 h-72 bg-white/10
                                                    rounded-full -translate-x-1/2 -translate-y-1/2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 6, repeat: Infinity }} />
                            <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5
                                                    rounded-full translate-x-1/3 translate-y-1/3"
                                animate={{ scale: [1.2, 1, 1.2] }}
                                transition={{ duration: 8, repeat: Infinity }} />
                            <div className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                                                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px',
                                }} />

                            <div className="relative z-10">
                                <motion.div className="flex justify-center mb-6"
                                    animate={{ rotate: [0, 8, -5, 0], y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                                    <img src={Logo} className="w-20 h-20 object-contain drop-shadow-2xl" />
                                </motion.div>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                                    Siap Terbang Lebih Tinggi?
                                </h2>
                                <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                                    Bergabunglah dengan ribuan peserta dan tunjukkan kreativitas
                                    desain layangan terbaikmu kepada dunia.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link href={route('register')}
                                        className="group relative flex items-center gap-2 overflow-hidden
                                                   bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl
                                                   hover:shadow-xl hover:-translate-y-1 transition-all
                                                   duration-300 text-base">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent
                                                       via-indigo-50 to-transparent -skew-x-12"
                                            animate={{ x: ['-150%', '150%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} />
                                        Daftar Sekarang — Gratis
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link href={route('login')}
                                        className="flex items-center gap-2 border-2 border-white/40
                                                   text-white font-semibold px-8 py-4 rounded-2xl
                                                   hover:bg-white/15 transition-all duration-300">
                                        Sudah Punya Akun? Masuk
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    FOOTER
                ════════════════════════════════════════ */}
                <footer className="bg-slate-950 text-white">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/10">

                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={Logo} className="w-10 h-10 object-contain rounded-xl" />
                                    <span className="font-black text-lg">Kite Competition</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                    Platform kompetisi layangan digital terpercaya yang
                                    menggabungkan seni, teknologi, dan semangat berkompetisi.
                                </p>
                                <div className="flex gap-3 mt-5">
                                    {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                                        <motion.button key={i}
                                            whileHover={{ scale: 1.2, y: -3, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-9 h-9 bg-white/10 hover:bg-indigo-600
                                                       rounded-xl flex items-center justify-center
                                                       transition-colors duration-200 border border-white/10">
                                            <Icon size={14} />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">
                                    Navigasi
                                </h4>
                                <ul className="space-y-2.5">
                                    {['Beranda', 'Tentang', 'Fitur', 'Galeri', 'Testimoni'].map(item => (
                                        <li key={item}>
                                            <a href={`#${item.toLowerCase()}`}
                                                className="text-slate-400 hover:text-white text-sm
                                                           transition-all duration-200 hover:translate-x-1
                                                           inline-flex items-center gap-1 group">
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">
                                    Akun
                                </h4>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: 'Masuk',  href: route('login')    },
                                        { label: 'Daftar', href: route('register') },
                                    ].map(item => (
                                        <li key={item.label}>
                                            <Link href={item.href}
                                                className="text-slate-400 hover:text-white text-sm
                                                           transition-colors duration-200
                                                           inline-flex items-center gap-1 group">
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row justify-between
                                        items-center gap-4 text-slate-500 text-sm">
                            <p>© {new Date().getFullYear()} Kite Competition. All rights reserved.</p>
                            <p>Made with ❤️ by Mas Mas RPL</p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}