import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Clock, Upload, XCircle, Trophy,
    Megaphone, AlertTriangle, Info, ArrowRight,
    Calendar, Sparkles, Bell, CalendarPlus,
    UserCheck, FileUp, Star, Award, Gift,
    ChevronRight, Zap
} from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

/* ══════════════════════════════════════════════
   COMPETITION FLOW DATA
   Hanya tahap-tahap yang relevan untuk peserta
══════════════════════════════════════════════ */
const FLOW_STEPS = [
    {
        step: 1,
        icon: CalendarPlus,
        label: 'Daftar Event',
        desc: 'Pilih event & kategori yang ingin kamu ikuti',
        grad: 'from-indigo-500 to-blue-600',
        shadow: 'shadow-indigo-200',
        userAction: true,
        actionLabel: 'Daftar Sekarang',
        actionRoute: 'events.index',
    },
    {
        step: 2,
        icon: UserCheck,
        label: 'Admin Approve',
        desc: 'Tunggu konfirmasi dari admin (biasanya 1–2 hari)',
        grad: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-200',
        userAction: false,
        waiting: true,
    },
    {
        step: 3,
        icon: FileUp,
        label: 'Upload Karya',
        desc: 'Unggah karya terbaikmu setelah disetujui',
        grad: 'from-rose-500 to-pink-600',
        shadow: 'shadow-rose-200',
        userAction: true,
        actionLabel: 'Upload Karya',
        actionRoute: 'user.registrations.index',
    },
    {
        step: 4,
        icon: Star,
        label: 'Juri Menilai',
        desc: 'Juri profesional akan menilai karyamu',
        grad: 'from-amber-500 to-orange-500',
        shadow: 'shadow-amber-200',
        userAction: false,
        waiting: true,
    },
    {
        step: 5,
        icon: Trophy,
        label: 'Pengumuman',
        desc: 'Pantau dashboard untuk melihat hasilnya',
        grad: 'from-emerald-500 to-teal-600',
        shadow: 'shadow-emerald-200',
        userAction: false,
        highlight: true,
    },
    {
        step: 6,
        icon: Gift,
        label: 'Hadiah & Sertifikat',
        desc: 'Pemenang mendapat hadiah & sertifikat resmi',
        grad: 'from-yellow-400 to-amber-500',
        shadow: 'shadow-yellow-200',
        userAction: false,
        highlight: true,
    },
];

export default function Dashboard({ registrations, announcements }) {

    const stats = [
        {
            label: 'Pendaftaran',
            value: registrations.length,
            icon:  Calendar,
            grad:  'from-indigo-500 to-blue-600',
            shadow:'shadow-indigo-200',
        },
        {
            label: 'Disetujui',
            value: registrations.filter(r => r.status === 'approved').length,
            icon:  CheckCircle2,
            grad:  'from-emerald-500 to-teal-600',
            shadow:'shadow-emerald-200',
        },
        {
            label: 'Sudah Upload',
            value: registrations.filter(r => r.submission).length,
            icon:  Upload,
            grad:  'from-violet-500 to-purple-600',
            shadow:'shadow-violet-200',
        },
        {
            label: 'Pengumuman',
            value: announcements.length,
            icon:  Bell,
            grad:  'from-amber-500 to-orange-500',
            shadow:'shadow-amber-200',
        },
    ];

    return (
        <UserLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* ══ GREETING BANNER ══ */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-indigo-600 via-blue-600 to-cyan-600 p-6 mb-8 text-white">
                {/* Decorative circles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }} />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-indigo-200 text-sm font-medium">
                                Selamat Datang Kembali!
                            </span>
                        </div>
                        <h1 className="text-2xl font-black">Dashboard Peserta 🪁</h1>
                        <p className="text-indigo-100 text-sm mt-1">
                            Pantau status pendaftaran dan karya kamu di sini.
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl hidden md:block">
                        🪁
                    </motion.div>
                </div>
            </motion.div>

            {/* ══ STAT CARDS ══ */}
            <motion.div
                initial="hidden" animate="show" variants={stagger}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <motion.div key={i} variants={fadeUp}
                        whileHover={{ y: -4, scale: 1.03 }}
                        className={`bg-white rounded-2xl p-5 shadow-lg ${s.shadow}
                                    border border-gray-100 flex items-center gap-4`}>
                        <div className={`w-12 h-12 bg-gradient-to-br ${s.grad} rounded-xl
                                         flex items-center justify-center shadow-md shrink-0`}>
                            <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-800">{s.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ══ COMPETITION FLOW ══ */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800">Alur Kompetisi</h2>
                        <p className="text-xs text-gray-400">Ikuti langkah-langkah berikut untuk berpartisipasi</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 bg-indigo-50
                                     border border-indigo-100 text-indigo-600 text-xs
                                     font-bold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Panduan Peserta
                    </span>
                </div>

                {/* Flow steps — desktop horizontal scroll, mobile vertical */}
                <div className="p-6">

                    {/* DESKTOP — horizontal snake */}
                    <div className="hidden md:block">
                        {/* Row 1: steps 1–4 */}
                        <div className="flex items-center gap-0">
                            {FLOW_STEPS.slice(0, 4).map((s, i) => (
                                <FlowStep key={s.step} step={s} isLast={i === 3}
                                    connector="right" index={i} />
                            ))}
                        </div>

                        {/* Snake turn: down arrow on the right */}
                        <div className="flex justify-end pr-[calc(12.5%-16px)] my-1">
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-7 h-7 bg-gray-100 rounded-full flex items-center
                                           justify-center text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </motion.div>
                        </div>

                        {/* Row 2: steps 5–6, reversed direction */}
                        <div className="flex items-center gap-0 flex-row-reverse">
                            {FLOW_STEPS.slice(4).map((s, i) => (
                                <FlowStep key={s.step} step={s} isLast={i === FLOW_STEPS.slice(4).length - 1}
                                    connector="left" index={i + 4} />
                            ))}
                            {/* Filler to keep alignment */}
                            <div className="flex-1 flex items-center gap-0">
                                {[0,1].map(k => (
                                    <div key={k} className="flex-1 h-px border-t-2 border-dashed border-gray-100" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MOBILE — vertical list */}
                    <div className="md:hidden space-y-3">
                        {FLOW_STEPS.map((s, i) => (
                            <FlowStepMobile key={s.step} step={s} isLast={i === FLOW_STEPS.length - 1} index={i} />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ══ PENDAFTARAN + PENGUMUMAN ══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PENDAFTARAN */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h2 className="font-bold text-gray-800">Pendaftaran Saya</h2>
                        </div>
                        <Link href={route('user.registrations.index')}
                            className="text-xs text-indigo-600 font-semibold hover:underline
                                       flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="p-6">
                        {registrations.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-10">
                                <motion.div animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="text-5xl mb-3">📋</motion.div>
                                <p className="text-gray-500 text-sm mb-4">Belum ada pendaftaran.</p>
                                <Link href={route('events.index')}
                                    className="inline-flex items-center gap-1.5 bg-indigo-600
                                               text-white text-sm font-semibold px-5 py-2.5
                                               rounded-xl hover:-translate-y-0.5 hover:shadow-lg
                                               hover:shadow-indigo-200 transition-all duration-300">
                                    Lihat Event Tersedia <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {registrations.slice(0, 4).map((reg, i) => (
                                        <RegistrationItem key={reg.id} reg={reg} index={i} />
                                    ))}
                                </AnimatePresence>
                                {registrations.length > 4 && (
                                    <Link href={route('user.registrations.index')}
                                        className="block text-center text-sm text-indigo-600
                                                   font-semibold hover:underline pt-2">
                                        +{registrations.length - 4} pendaftaran lainnya →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* PENGUMUMAN */}
                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Megaphone className="w-4 h-4 text-amber-600" />
                            </div>
                            <h2 className="font-bold text-gray-800">Pengumuman Terbaru</h2>
                        </div>
                        {announcements.length > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold
                                             px-2.5 py-1 rounded-full">
                                {announcements.length} baru
                            </span>
                        )}
                    </div>
                    <div className="p-6">
                        {announcements.length === 0 ? (
                            <div className="text-center py-10">
                                <motion.div animate={{ rotate: [0, 10, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="text-5xl mb-3">📢</motion.div>
                                <p className="text-gray-400 text-sm">Belum ada pengumuman terbaru.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {announcements.map((a, i) => (
                                    <AnnouncementItem key={a.id} ann={a} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </UserLayout>
    );
}

/* ══════════════════════════════
   FLOW STEP — Desktop
══════════════════════════════ */
function FlowStep({ step, isLast, connector, index }) {
    const Icon = step.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center flex-1 min-w-0">

            {/* Step card */}
            <div className="flex flex-col items-center text-center flex-1 min-w-0 px-1 group">
                {/* Icon circle */}
                <motion.div
                    whileHover={{ scale: 1.12, y: -3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`relative w-14 h-14 bg-gradient-to-br ${step.grad} rounded-2xl
                                 flex items-center justify-center shadow-lg ${step.shadow}
                                 mb-3 shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-white border-2
                                     border-gray-200 rounded-full text-[10px] font-black
                                     text-gray-600 flex items-center justify-center shadow-sm">
                        {step.step}
                    </span>
                    {/* Waiting pulse */}
                    {step.waiting && (
                        <motion.span
                            className="absolute inset-0 rounded-2xl border-2 border-white/50"
                            animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                <p className="text-xs font-black text-gray-800 leading-tight mb-1">
                    {step.label}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight max-w-[90px]">
                    {step.desc}
                </p>

                {/* User action badge */}
                {step.userAction && (
                    <Link href={route(step.actionRoute)}
                        className="mt-2 inline-flex items-center gap-1 bg-indigo-600 text-white
                                   text-[10px] font-bold px-2.5 py-1 rounded-lg
                                   hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200">
                        {step.actionLabel} <ChevronRight className="w-2.5 h-2.5" />
                    </Link>
                )}
                {step.waiting && (
                    <span className="mt-2 inline-flex items-center gap-1 bg-gray-100 text-gray-500
                                     text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                        <Clock className="w-2.5 h-2.5" /> Menunggu
                    </span>
                )}
                {step.highlight && (
                    <span className="mt-2 inline-flex items-center gap-1 bg-amber-100 text-amber-700
                                     text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        <Trophy className="w-2.5 h-2.5" /> Hasil
                    </span>
                )}
            </div>

            {/* Connector arrow */}
            {!isLast && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.07 + 0.3, duration: 0.4 }}
                    className="flex items-center shrink-0 mx-1"
                    style={{ transformOrigin: connector === 'right' ? 'left center' : 'right center' }}>
                    <div className="w-6 h-px bg-gradient-to-r from-gray-200 to-gray-300" />
                    <ChevronRight className="w-3 h-3 text-gray-300 -ml-1" />
                </motion.div>
            )}
        </motion.div>
    );
}

/* ══════════════════════════════
   FLOW STEP — Mobile vertical
══════════════════════════════ */
function FlowStepMobile({ step, isLast, index }) {
    const Icon = step.icon;
    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex items-start gap-4">

            {/* Left: icon + vertical line */}
            <div className="flex flex-col items-center shrink-0">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`relative w-11 h-11 bg-gradient-to-br ${step.grad}
                                 rounded-xl flex items-center justify-center
                                 shadow-md ${step.shadow}`}>
                    <Icon className="w-5 h-5 text-white" />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border
                                     border-gray-200 rounded-full text-[9px] font-black
                                     text-gray-600 flex items-center justify-center">
                        {step.step}
                    </span>
                </motion.div>
                {!isLast && (
                    <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-gray-100 mt-1" />
                )}
            </div>

            {/* Right: text */}
            <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-800 text-sm">{step.label}</p>
                    {step.userAction && (
                        <Link href={route(step.actionRoute)}
                            className="inline-flex items-center gap-1 bg-indigo-600 text-white
                                       text-[10px] font-bold px-2 py-0.5 rounded-lg
                                       hover:bg-indigo-700 transition-colors">
                            {step.actionLabel} <ChevronRight className="w-2.5 h-2.5" />
                        </Link>
                    )}
                    {step.waiting && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500
                                         text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                            <Clock className="w-2.5 h-2.5" /> Menunggu
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
        pending:  { label: 'Menunggu',  bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-400'   },
        approved: { label: 'Disetujui', bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-400' },
        rejected: { label: 'Ditolak',   bg: 'bg-red-100',     text: 'text-red-800',     dot: 'bg-red-400'     },
    };
    const cfg = statusCfg[reg.status] ?? statusCfg.pending;

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100
                       hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200">
            <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{reg.event.title}</p>
                <p className="text-xs text-gray-400 truncate">{reg.category.name}</p>
            </div>
            <div className="shrink-0">
                {isApproved && !hasSubmission ? (
                    <Link href={route('user.submissions.create', reg.id)}
                        className="flex items-center gap-1 bg-indigo-600 text-white
                                   text-xs font-semibold px-3 py-1.5 rounded-lg
                                   hover:bg-indigo-700 transition-colors">
                        <Upload className="w-3 h-3" /> Upload
                    </Link>
                ) : isApproved && hasSubmission ? (
                    <span className="flex items-center gap-1 text-xs font-bold
                                     text-emerald-700 bg-emerald-100 px-2.5 py-1.5
                                     rounded-lg border border-emerald-200">
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

/* ══════════════════════════════
   ANNOUNCEMENT ITEM
══════════════════════════════ */
function AnnouncementItem({ ann, index }) {
    const typeCfg = {
        winner:  { icon: Trophy,        border: 'border-l-amber-400',  bg: 'bg-amber-50',   text: 'text-amber-700',  label: 'Pemenang'   },
        warning: { icon: AlertTriangle, border: 'border-l-red-400',    bg: 'bg-red-50',     text: 'text-red-700',    label: 'Peringatan' },
        update:  { icon: Info,          border: 'border-l-blue-400',   bg: 'bg-blue-50',    text: 'text-blue-700',   label: 'Update'     },
        info:    { icon: Info,          border: 'border-l-indigo-400', bg: 'bg-indigo-50',  text: 'text-indigo-700', label: 'Info'       },
    };
    const cfg  = typeCfg[ann.type] ?? typeCfg.info;
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ x: 4 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border-l-4
                        ${cfg.border} ${cfg.bg} transition-all duration-200`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center
                             shrink-0 ${cfg.text} bg-white/70`}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</p>
                    <span className="text-xs text-gray-400">{ann.event?.title}</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm leading-snug">{ann.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                    {new Date(ann.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    })}
                </p>
            </div>
        </motion.div>
    );
}