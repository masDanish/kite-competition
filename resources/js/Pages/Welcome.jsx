import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
    Palette, Scale, Trophy, Globe, Sparkles, Rocket,
    Wind, Star, ArrowRight, ChevronDown, Play
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Logo from '@/Assets/logo.png';

export default function Welcome({ auth = { user: null } }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeFeature, setActiveFeature] = useState(null);
    const [count, setCount] = useState({ events: 0, participants: 0, winners: 0 });
    const heroRef = useRef(null);
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, -150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    // Mouse parallax
    useEffect(() => {
        const handle = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 30,
                y: (e.clientY / window.innerHeight - 0.5) * 30,
            });
        };
        window.addEventListener('mousemove', handle);
        return () => window.removeEventListener('mousemove', handle);
    }, []);

    // Counter animation
    useEffect(() => {
        const targets = { events: 48, participants: 1200, winners: 144 };
        const duration = 2000;
        const steps = 60;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount({
                events: Math.round(targets.events * ease),
                participants: Math.round(targets.participants * ease),
                winners: Math.round(targets.winners * ease),
            });
            if (step >= steps) clearInterval(timer);
        }, duration / steps);
        return () => clearInterval(timer);
    }, []);

    const features = [
        { icon: Palette, title: "Desain Kreatif", desc: "Eksplorasi desain layangan tanpa batas dengan tools modern.", color: "from-violet-500 to-purple-600", bg: "bg-violet-50" },
        { icon: Scale, title: "Penilaian Adil", desc: "Sistem scoring transparan dan objektif oleh juri berpengalaman.", color: "from-blue-500 to-cyan-600", bg: "bg-blue-50" },
        { icon: Trophy, title: "Kompetisi Bergengsi", desc: "Raih penghargaan dan pengakuan dari komunitas layangan nasional.", color: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
        { icon: Globe, title: "Skala Nasional", desc: "Bersaing dengan peserta terbaik dari seluruh penjuru Indonesia.", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
        { icon: Sparkles, title: "Inovasi Digital", desc: "Platform modern berbasis teknologi untuk pengalaman terbaik.", color: "from-pink-500 to-rose-600", bg: "bg-pink-50" },
        { icon: Rocket, title: "Performa Maksimal", desc: "Tampilkan karya terbaikmu dan raih posisi teratas leaderboard.", color: "from-indigo-500 to-blue-600", bg: "bg-indigo-50" },
    ];

    const kiteImages = [
        "https://images.unsplash.com/photo-1705332096769-0142c80da4ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1571849291280-89f81a772893?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1558641930-072bd59556f0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1650788998536-a77a54b2a43e?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1715173674824-8199185aa2d2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1646812281105-6f20622792e6?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const testimonials = [
        { name: "Andi Pratama", role: "Juara 1 Kategori Senior", text: "Platform ini mengubah cara saya berkompetisi. Sistem penilaiannya sangat transparan!", avatar: "A" },
        { name: "Dewi Lestari", role: "Peserta Terbaik 2024", text: "Pengalaman yang luar biasa! Bisa melihat feedback langsung dari juri profesional.", avatar: "D" },
        { name: "Rizky Fauzan", role: "Juara 2 Kategori Junior", text: "Sangat mudah digunakan dan desainnya keren. Tidak sabar untuk ikut kompetisi selanjutnya!", avatar: "R" },
    ];

    const stagger = {
        show: { transition: { staggerChildren: 0.1 } }
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };
    const fadeIn = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.8 } }
    };

    return (
        <>
            <Head title="Kite Competition — Terbangkan Kreativitasmu" />

            <div className="min-h-screen bg-white overflow-x-hidden">

                {/* ═══ NAVBAR ═══ */}
                <motion.header
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-0 left-0 right-0 z-50"
                >
                    <div className="mx-4 mt-4">
                        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl
                                        rounded-2xl border border-white/50 shadow-lg
                                        shadow-black/5 px-6 py-3.5
                                        flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br
                                                rounded-xl flex items-center
                                                justify-center text-white font-bold text-lg
                                                shadow-lg shadow-indigo-200">
                                    <img src={Logo} className="w-8 h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-none">
                                        Kite Competition
                                    </p>
                                    <p className="text-[10px] text-indigo-500 font-medium">
                                        Design • Fly • Compete
                                    </p>
                                </div>
                            </div>

                            <nav className="hidden md:flex items-center gap-1">
                                {['Tentang', 'Fitur', 'Galeri', 'Testimoni'].map(item => (
                                    <a key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600
                                                   hover:bg-indigo-50 rounded-xl transition-all duration-200
                                                   font-medium">
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            <div className="flex items-center gap-2">
                                {auth.user ? (
                                    <Link href={
                                        auth.user.role === 'admin' ? route('admin.dashboard') :
                                            auth.user.role === 'jury' ? route('jury.dashboard') :
                                                route('user.dashboard')
                                    }
                                        className="flex items-center gap-2 bg-gradient-to-r
                                                   from-indigo-600 to-blue-600 text-white text-sm
                                                   font-semibold px-5 py-2.5 rounded-xl
                                                   hover:shadow-lg hover:shadow-indigo-200
                                                   transition-all duration-300 hover:-translate-y-0.5">
                                        Dashboard <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')}
                                            className="px-4 py-2.5 text-sm font-semibold text-gray-700
                                                       hover:text-indigo-600 hover:bg-indigo-50
                                                       rounded-xl transition-all duration-200">
                                            Masuk
                                        </Link>
                                        <Link href={route('register')}
                                            className="flex items-center gap-1.5 bg-gradient-to-r
                                                       from-indigo-600 to-blue-600 text-white text-sm
                                                       font-semibold px-5 py-2.5 rounded-xl
                                                       hover:shadow-lg hover:shadow-indigo-200
                                                       transition-all duration-300 hover:-translate-y-0.5">
                                            Daftar Gratis
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* ═══ HERO ═══ */}
                <section ref={heroRef}
                    className="relative min-h-screen flex items-center justify-center
                               overflow-hidden pt-24">

                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900
                                    via-indigo-950 to-blue-950" />

                    {/* Animated grid */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px',
                        }} />

                    {/* Glowing orbs */}
                    <motion.div
                        className="absolute w-96 h-96 rounded-full opacity-20"
                        style={{
                            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
                            top: '10%', left: '10%',
                        }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute w-80 h-80 rounded-full opacity-20"
                        style={{
                            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
                            bottom: '15%', right: '10%',
                        }}
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div key={i}
                            className="absolute w-1 h-1 bg-indigo-300 rounded-full opacity-60"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}

                    {/* Mouse parallax kite */}
                    <motion.div
                        className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block"
                        style={{
                            x: mousePos.x * 0.5,
                            y: mousePos.y * 0.5,
                        }}
                        animate={{ rotate: [0, 5, -3, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                     
                    </motion.div>

                    {/* Hero Content */}
                    <motion.div
                        style={{ y: heroY, opacity: heroOpacity }}
                        className="relative z-10 max-w-6xl mx-auto px-6 text-center lg:text-left">

                        <motion.div
                            initial="hidden" animate="show" variants={stagger}
                            className="max-w-6xl">

                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-500/20
                                           border border-indigo-400/30 text-indigo-300
                                           text-sm font-medium px-4 py-2 rounded-full mb-6
                                           backdrop-blur-sm">
                                <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                                Kompetisi Layangan Terpercaya #1 Indonesia
                                <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                            </motion.div>

                            <motion.h1 variants={fadeUp}
                                className="text-5xl md:text-6xl lg:text-7xl font-black
                                           text-white leading-[1.05] tracking-tight">
                                Terbangkan{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-indigo-400 via-blue-400
                                                     to-cyan-400 bg-clip-text text-transparent">
                                        Kreativitasmu
                                    </span>
                                    <motion.div
                                        className="absolute -bottom-2 left-0 right-0 h-1
                                                   bg-gradient-to-r from-indigo-400 to-cyan-400
                                                   rounded-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 1, duration: 0.8 }}
                                    />
                                </span>
                                {' '}Lebih Tinggi
                            </motion.h1>

                            <motion.p variants={fadeUp}
                                className="mt-6 text-lg text-slate-300 leading-relaxed">
                                Platform kompetisi layangan modern dengan sistem penilaian
                                profesional, real-time, dan transparan. Dari desain hingga
                                performa — semua terukur secara adil.
                            </motion.p>

                            <motion.div variants={fadeUp}
                                className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Link href={route('register')}
                                    className="group flex items-center gap-2 bg-gradient-to-r
                                               from-indigo-500 to-blue-600 text-white font-bold
                                               px-8 py-4 rounded-2xl text-base shadow-xl
                                               shadow-indigo-500/30 hover:shadow-indigo-500/50
                                               hover:-translate-y-1 transition-all duration-300">
                                    Mulai Sekarang
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1
                                                           transition-transform" />
                                </Link>
                                <a href="#tentang"
                                    className="flex items-center gap-2 bg-white/10
                                               backdrop-blur-sm border border-white/20
                                               text-white font-semibold px-8 py-4 rounded-2xl
                                               hover:bg-white/20 transition-all duration-300">
                                    <Play className="w-4 h-4" />
                                    Pelajari Lebih
                                </a>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={fadeUp}
                                className="mt-12 flex gap-8 justify-center lg:justify-start">
                                {[
                                    { value: count.events, suffix: '+', label: 'Event' },
                                    { value: count.participants, suffix: '+', label: 'Peserta' },
                                    { value: count.winners, suffix: '+', label: 'Pemenang' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-3xl font-black text-white">
                                            {stat.value.toLocaleString()}{stat.suffix}
                                        </div>
                                        <div className="text-sm text-slate-400 mt-0.5">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <span className="text-xs font-medium">Scroll</span>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </motion.div>
                </section>

                {/* ═══ ABOUT ═══ */}
                <section id="tentang"
                    className="max-w-6xl mx-auto px-6 py-28">
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

                            <p className="mt-5 text-gray-600 leading-relaxed text-base">
                                Kite Competition hadir untuk mengembangkan kreativitas dalam
                                dunia layangan, menggabungkan seni visual, teknik aerodinamika,
                                dan inovasi desain dalam satu ekosistem digital yang modern.
                            </p>
                            <p className="mt-4 text-gray-600 leading-relaxed text-base">
                                Dengan sistem digital yang transparan, peserta dapat memantau
                                hasil penilaian secara real-time dan mendapatkan feedback
                                langsung dari juri berpengalaman di bidangnya.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {[
                                    { icon: '🏆', label: 'Juri Profesional', value: '15+ Juri' },
                                    { icon: '📅', label: 'Event Per Tahun', value: '12+ Event' },
                                    { icon: '🎯', label: 'Tingkat Kepuasan', value: '98%' },
                                    { icon: '🌍', label: 'Kota Peserta', value: '34 Kota' },
                                ].map((item, i) => (
                                    <motion.div key={i}
                                        whileHover={{ scale: 1.03 }}
                                        className="bg-gradient-to-br from-indigo-50 to-blue-50
                                                   border border-indigo-100 rounded-2xl p-4">
                                        <div className="text-2xl">{item.icon}</div>
                                        <div className="text-xl font-black text-indigo-700 mt-1">
                                            {item.value}
                                        </div>
                                        <div className="text-sm text-gray-500">{item.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Image collage */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative h-[480px]">

                            <motion.img
                                src={`${kiteImages[1]}?auto=format&fit=crop&w=600&q=80`}
                                className="absolute top-0 left-0 w-64 h-48 object-cover
                                           rounded-3xl shadow-xl"
                                whileHover={{ scale: 1.05, rotate: -1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                            <motion.img
                                src={`${kiteImages[2]}?auto=format&fit=crop&w=600&q=80`}
                                className="absolute top-8 right-0 w-52 h-44 object-cover
                                           rounded-3xl shadow-xl"
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                            <motion.img
                                src={`${kiteImages[3]}?auto=format&fit=crop&w=600&q=80`}
                                className="absolute bottom-0 left-8 w-56 h-48 object-cover
                                           rounded-3xl shadow-xl"
                                whileHover={{ scale: 1.05, rotate: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                            <motion.img
                                src={`${kiteImages[4]}?auto=format&fit=crop&w=600&q=80`}
                                className="absolute bottom-8 right-4 w-44 h-40 object-cover
                                           rounded-3xl shadow-xl"
                                whileHover={{ scale: 1.05, rotate: -1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />

                            {/* Floating badge */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2
                                           -translate-y-1/2 bg-white rounded-2xl shadow-2xl
                                           p-4 text-center border border-indigo-100 z-10"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}>
                                <div className="flex justify-center"><img src={Logo} className="w-8 h-8 object-contain" /></div>
                                <div className="text-sm font-bold text-indigo-700 mt-1">
                                    #1 Platform
                                </div>
                                <div className="text-xs text-gray-500">Layangan Indonesia</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══ FEATURES ═══ */}
                <section id="fitur" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                    <div className="max-w-6xl mx-auto px-6">

                        <motion.div
                            initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="text-center mb-16">
                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-100
                                           text-indigo-700 text-sm font-semibold px-4 py-2
                                           rounded-full mb-4">
                                <Sparkles className="w-4 h-4" />
                                Fitur Unggulan
                            </motion.div>
                            <motion.h2 variants={fadeUp}
                                className="text-4xl font-black text-gray-900">
                                Semua yang Kamu Butuhkan
                            </motion.h2>
                            <motion.p variants={fadeUp}
                                className="mt-4 text-gray-500 max-w-xl mx-auto">
                                Platform lengkap untuk pengalaman kompetisi layangan terbaik.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <motion.div key={i} variants={fadeUp}
                                    onHoverStart={() => setActiveFeature(i)}
                                    onHoverEnd={() => setActiveFeature(null)}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className={`relative p-6 rounded-3xl border-2 cursor-pointer
                                        transition-all duration-300 overflow-hidden
                                        ${activeFeature === i
                                            ? 'border-indigo-300 shadow-xl shadow-indigo-100'
                                            : 'border-gray-100 shadow-md hover:border-indigo-200'
                                        } bg-white`}>

                                    {/* Background gradient on hover */}
                                    <AnimatePresence>
                                        {activeFeature === i && (
                                            <motion.div
                                                className={`absolute inset-0 ${f.bg} opacity-50`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.5 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${f.color}
                                                         rounded-2xl flex items-center justify-center
                                                         shadow-lg mb-4`}>
                                            <f.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            {f.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>

                                    {/* Corner decoration */}
                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br
                                                     ${f.color} opacity-5 rounded-bl-full`} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══ GALLERY ═══ */}
                <section id="galeri" className="py-24 bg-white">
                    <div className="max-w-6xl mx-auto px-6">

                        <motion.div
                            initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="text-center mb-14">
                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-100
                                           text-indigo-700 text-sm font-semibold px-4 py-2
                                           rounded-full mb-4">
                                🖼️ Galeri
                            </motion.div>
                            <motion.h2 variants={fadeUp}
                                className="text-4xl font-black text-gray-900">
                                Karya Terbaik Peserta
                            </motion.h2>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {kiteImages.map((img, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    whileHover={{ scale: 1.04, zIndex: 10 }}
                                    className={`relative overflow-hidden rounded-3xl shadow-lg
                                        cursor-pointer group
                                        ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                    <img
                                        src={`${img}?auto=format&fit=crop&w=800&q=80`}
                                        className={`w-full object-cover transition-transform
                                            duration-700 group-hover:scale-110
                                            ${i === 0 ? 'h-72 md:h-full' : 'h-44'}`}
                                        alt={`Galeri ${i + 1}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t
                                                    from-black/50 via-transparent to-transparent
                                                    opacity-0 group-hover:opacity-100
                                                    transition-opacity duration-300 flex
                                                    items-end p-4">
                                        <span className="text-white text-sm font-semibold">
                                            Karya Peserta #{i + 1}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ TESTIMONIALS ═══ */}
                <section id="testimoni"
                    className="py-24 bg-gradient-to-b from-slate-50 to-white">
                    <div className="max-w-6xl mx-auto px-6">

                        <motion.div
                            initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="text-center mb-14">
                            <motion.div variants={fadeUp}
                                className="inline-flex items-center gap-2 bg-indigo-100
                                           text-indigo-700 text-sm font-semibold px-4 py-2
                                           rounded-full mb-4">
                                ⭐ Testimoni
                            </motion.div>
                            <motion.h2 variants={fadeUp}
                                className="text-4xl font-black text-gray-900">
                                Kata Mereka
                            </motion.h2>
                        </motion.div>

                        <motion.div
                            initial="hidden" whileInView="show"
                            viewport={{ once: true }} variants={stagger}
                            className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((t, i) => (
                                <motion.div key={i} variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="bg-white rounded-3xl p-6 shadow-lg
                                               border border-gray-100 relative overflow-hidden">
                                    {/* Quote mark */}
                                    <div className="absolute top-4 right-6 text-6xl font-black
                                                    text-indigo-100 leading-none select-none">
                                        "
                                    </div>
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j}
                                                className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center gap-3 mt-5">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500
                                                        to-blue-600 rounded-full flex items-center
                                                        justify-center text-white font-bold">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {t.name}
                                            </p>
                                            <p className="text-xs text-indigo-500">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══ CTA ═══ */}
                <section className="py-24 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl
                                   bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600
                                   p-16 text-center shadow-2xl shadow-indigo-300">

                        {/* Decorations */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10
                                            rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5
                                            rounded-full translate-x-1/3 translate-y-1/3" />
                        </div>

                        <div className="relative z-10">
                            <motion.div
    animate={{ rotate: [0, 10, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity }}
    className="mb-6 flex justify-center">
    <img
        src={Logo}
        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
        alt="Logo"
    />
</motion.div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                                Siap Terbang Lebih Tinggi?
                            </h2>
                            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
                                Bergabunglah dengan ribuan peserta dan tunjukkan kreativitas
                                desain layangan terbaikmu kepada dunia.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href={route('register')}
                                    className="group flex items-center gap-2 bg-white
                                               text-indigo-700 font-bold px-8 py-4 rounded-2xl
                                               hover:shadow-xl hover:-translate-y-1
                                               transition-all duration-300 text-base">
                                    Daftar Sekarang — Gratis
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1
                                                           transition-transform" />
                                </Link>
                                <Link href={route('login')}
                                    className="flex items-center gap-2 border-2 border-white/40
                                               text-white font-semibold px-8 py-4 rounded-2xl
                                               hover:bg-white/10 transition-all duration-300">
                                    Sudah Punya Akun? Masuk
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ═══ FOOTER ═══ */}
                <footer className="bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/10">

                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br
                                                rounded-xl flex items-center
                                                justify-center text-white font-bold text-lg
                                                shadow-lg shadow-indigo-200">
                                    <img src={Logo} className="w-8 h-full object-contain" />
                                </div>
                                    <span className="font-black text-lg">Kite Competition</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                    Platform kompetisi layangan digital terpercaya yang
                                    menggabungkan seni, teknologi, dan semangat berkompetisi.
                                </p>
                                <div className="flex gap-3 mt-5">
                                    {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                                        <motion.button key={i}
                                            whileHover={{ scale: 1.15, y: -2 }}
                                            className="w-9 h-9 bg-white/10 hover:bg-indigo-600
                                                       rounded-xl flex items-center justify-center
                                                       transition-colors duration-200">
                                            <Icon className="w-4 h-4" />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 text-sm uppercase tracking-wider
                                               text-slate-300">Navigasi</h4>
                                <ul className="space-y-2.5">
                                    {['Beranda', 'Tentang', 'Fitur', 'Galeri', 'Testimoni'].map(item => (
                                        <li key={item}>
                                            <a href={`#${item.toLowerCase()}`}
                                                className="text-slate-400 hover:text-white
                                                           text-sm transition-colors duration-200
                                                           hover:translate-x-1 inline-block">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 text-sm uppercase tracking-wider
                                               text-slate-300">Akun</h4>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: 'Login', href: route('login') },
                                        { label: 'Register', href: route('register') },
                                    ].map(item => (
                                        <li key={item.label}>
                                            <Link href={item.href}
                                                className="text-slate-400 hover:text-white text-sm
                                                           transition-colors duration-200">
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
                            <p>Made by Mas Mas RPL</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}