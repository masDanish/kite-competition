import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    FileImage, User, CalendarDays, Tag,
    Star, MessageSquare, ExternalLink,
    FileText, Video, ChevronLeft, BarChart3
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const STATUS_CFG = {
    draft:     { label: 'Draft',     bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
    submitted: { label: 'Dikirim',   bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    approved:  { label: 'Disetujui', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rejected:  { label: 'Ditolak',  bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5
                          rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function SectionCard({ icon: Icon, iconBg, iconColor, title, children, delay = 0 }) {
    return (
        <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ delay }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <h2 className="font-bold text-gray-800">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </motion.div>
    );
}

export default function SubmissionsShow({ submission }) {
    const reg    = submission.registration;
    const scores = submission.scores ?? [];

    const byKriteria = scores.reduce((acc, s) => {
        const name = s.criteria?.name ?? 'Lainnya';
        if (!acc[name]) acc[name] = [];
        acc[name].push(s);
        return acc;
    }, {});

    const totalAvg = Object.entries(byKriteria).length > 0
        ? (Object.entries(byKriteria).reduce((sum, [, list]) => {
            return sum + list.reduce((a, b) => a + b.score, 0) / list.length;
        }, 0) / Object.keys(byKriteria).length).toFixed(1)
        : null;

    return (
        <AdminLayout header="Detail Karya">
            <Head title="Detail Karya" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-6 mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FileImage className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">Detail Karya</span>
                        </div>
                        <h1 className="text-2xl font-black truncate max-w-lg">{submission.title}</h1>
                        <p className="text-slate-300 text-sm mt-1">
                            oleh <span className="font-bold text-white">{submission.user.name}</span>
                            {' '}— {reg?.event?.title}
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <StatusBadge status={submission.status} />
                    </div>
                </div>
            </motion.div>

            <div className="max-w-4xl space-y-6">

                {/* ── Info Karya ── */}
                <SectionCard icon={FileImage} iconBg="bg-violet-100" iconColor="text-violet-600"
                    title="Informasi Karya" delay={0.1}>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Foto */}
                        {submission.photo_url && (
                            <a href={`/storage/${submission.photo_url}`}
                                target="_blank" rel="noreferrer"
                                className="shrink-0">
                                <img src={`/storage/${submission.photo_url}`} alt="Foto karya"
                                    className="w-full md:w-56 h-40 object-cover rounded-2xl
                                               border border-gray-100 hover:opacity-90
                                               hover:scale-105 transition-all duration-300" />
                            </a>
                        )}
                        <div className="flex-1 space-y-3">
                            {/* Meta chips */}
                            <div className="flex flex-wrap gap-2">
                                <span className="flex items-center gap-1.5 text-xs bg-indigo-50
                                                 text-indigo-700 px-3 py-1.5 rounded-full
                                                 border border-indigo-100 font-semibold">
                                    <User className="w-3 h-3" />
                                    {submission.user.name}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs bg-blue-50
                                                 text-blue-700 px-3 py-1.5 rounded-full
                                                 border border-blue-100 font-semibold">
                                    <CalendarDays className="w-3 h-3" />
                                    {reg?.event?.title}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs bg-violet-50
                                                 text-violet-700 px-3 py-1.5 rounded-full
                                                 border border-violet-100 font-semibold">
                                    <Tag className="w-3 h-3" />
                                    {reg?.category?.name}
                                </span>
                                <div className="md:hidden">
                                    <StatusBadge status={submission.status} />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            {submission.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {submission.description}
                                </p>
                            )}

                            {/* File links */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {submission.design_file && (
                                    <a href={`/storage/${submission.design_file}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50
                                                   border border-indigo-100 rounded-2xl text-xs
                                                   font-bold text-indigo-600 hover:bg-indigo-100
                                                   hover:-translate-y-0.5 transition-all duration-200">
                                        <FileText className="w-3.5 h-3.5" />
                                        File Desain
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                {submission.video_url && (
                                    <a href={submission.video_url}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50
                                                   border border-red-100 rounded-2xl text-xs
                                                   font-bold text-red-600 hover:bg-red-100
                                                   hover:-translate-y-0.5 transition-all duration-200">
                                        <Video className="w-3.5 h-3.5" />
                                        Lihat Video
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── Rekapitulasi Skor ── */}
                <SectionCard icon={BarChart3} iconBg="bg-amber-100" iconColor="text-amber-600"
                    title={`Rekapitulasi Penilaian (${scores.length} penilaian)`} delay={0.18}>

                    {/* Rata-rata keseluruhan */}
                    {totalAvg && (
                        <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50
                                        border border-amber-100 rounded-2xl">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500
                                            rounded-2xl flex flex-col items-center justify-center
                                            text-white shadow-md shadow-amber-200 shrink-0">
                                <span className="text-xl font-black leading-none">{totalAvg}</span>
                                <span className="text-xs opacity-80">avg</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Rata-rata Keseluruhan</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Dari {Object.keys(byKriteria).length} kriteria penilaian
                                </p>
                            </div>
                        </div>
                    )}

                    {Object.keys(byKriteria).length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-gray-400">
                            <motion.div animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-4xl mb-3">⭐</motion.div>
                            <p className="text-sm">Belum ada penilaian dari juri.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {Object.entries(byKriteria).map(([kriteria, list]) => {
                                const avg = (
                                    list.reduce((a, b) => a + b.score, 0) / list.length
                                ).toFixed(1);
                                const pct = Math.min((avg / 100) * 100, 100);
                                return (
                                    <div key={kriteria}
                                        className="border border-gray-100 rounded-2xl p-4">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                                <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                                                {kriteria}
                                            </span>
                                            <span className="font-black text-indigo-600 text-sm
                                                             bg-indigo-50 px-2.5 py-1 rounded-full
                                                             border border-indigo-100">
                                                {avg} / 100
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                                className="bg-gradient-to-r from-indigo-500 to-blue-500
                                                           h-2 rounded-full" />
                                        </div>
                                        {/* Per-jury scores */}
                                        <div className="space-y-1.5">
                                            {list.map((s, i) => (
                                                <div key={i}
                                                    className="flex items-start gap-3 text-xs
                                                               bg-gray-50 rounded-xl px-3 py-2.5">
                                                    <div className="w-6 h-6 bg-gradient-to-br
                                                                    from-slate-400 to-slate-600
                                                                    rounded-lg flex items-center
                                                                    justify-center text-white
                                                                    font-bold shrink-0 text-xs">
                                                        {s.jury?.name?.charAt(0).toUpperCase() ?? 'J'}
                                                    </div>
                                                    <span className="font-semibold text-gray-600
                                                                     flex-1 truncate">
                                                        {s.jury?.name ?? 'Juri'}
                                                    </span>
                                                    <span className="font-black text-indigo-600 shrink-0">
                                                        {s.score}
                                                    </span>
                                                    {s.comment && (
                                                        <span className="flex items-start gap-1
                                                                         text-gray-400 italic flex-1
                                                                         min-w-0">
                                                            <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" />
                                                            <span className="truncate">{s.comment}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SectionCard>

                {/* ── Back Button ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}>
                    <Link href={route('admin.submissions.index')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200
                                   rounded-2xl text-sm font-bold text-gray-500 bg-white shadow-sm
                                   hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5
                                   transition-all duration-200">
                        <ChevronLeft className="w-4 h-4" />
                        Kembali ke Daftar Karya
                    </Link>
                </motion.div>
            </div>
        </AdminLayout>
    );
}