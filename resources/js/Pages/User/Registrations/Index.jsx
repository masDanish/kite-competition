import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, Users, Clock, CheckCircle2, Upload, XCircle, AlertCircle, Trophy } from 'lucide-react';

export default function RegistrationsIndex({ registrations }) {

    const stagger = {
        show: { transition: { staggerChildren: 0.08 } }
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <UserLayout header="Pendaftaran Saya">
            <Head title="Pendaftaran Saya" />

            {/* Header Stats */}
            {registrations.length > 0 && (
                <motion.div
                    initial="hidden" animate="show" variants={stagger}
                    className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        {
                            label: 'Total Daftar',
                            value: registrations.length,
                            icon: Calendar,
                            color: 'from-indigo-500 to-blue-600',
                            bg: 'bg-indigo-50',
                            text: 'text-indigo-600',
                        },
                        {
                            label: 'Disetujui',
                            value: registrations.filter(r => r.status === 'approved').length,
                            icon: CheckCircle2,
                            color: 'from-emerald-500 to-teal-600',
                            bg: 'bg-emerald-50',
                            text: 'text-emerald-600',
                        },
                        {
                            label: 'Karya Dikirim',
                            value: registrations.filter(r => r.submission).length,
                            icon: Upload,
                            color: 'from-violet-500 to-purple-600',
                            bg: 'bg-violet-50',
                            text: 'text-violet-600',
                        },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={fadeUp}
                            whileHover={{ y: -3, scale: 1.02 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100
                                       p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color}
                                             rounded-xl flex items-center justify-center
                                             shadow-lg shrink-0`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className={`text-2xl font-black ${stat.text}`}>
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Empty State */}
            <AnimatePresence>
                {registrations.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24
                                   bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <motion.div
                            animate={{ y: [0, -12, 0], rotate: [0, 5, -3, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-7xl mb-6">
                            🪁
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Belum Ada Pendaftaran
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">
                            Kamu belum mendaftar ke event manapun.
                            Mulai eksplorasi dan ikuti kompetisi sekarang!
                        </p>
                        <Link href={route('events.index')}
                            className="flex items-center gap-2 bg-gradient-to-r
                                       from-indigo-600 to-blue-600 text-white font-semibold
                                       px-6 py-3 rounded-xl hover:shadow-lg
                                       hover:shadow-indigo-200 hover:-translate-y-0.5
                                       transition-all duration-300 text-sm">
                            🔍 Lihat Event Tersedia
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Registration Cards */}
            <motion.div
                initial="hidden" animate="show" variants={stagger}
                className="space-y-4">
                {registrations.map((reg, i) => (
                    <RegistrationCard key={reg.id} reg={reg} variants={fadeUp} />
                ))}
            </motion.div>
        </UserLayout>
    );
}

function RegistrationCard({ reg, variants }) {
    const hasSubmission = !!reg.submission;
    const isApproved   = reg.status === 'approved';
    const isRejected   = reg.status === 'rejected';
    const isPending    = reg.status === 'pending';

    const statusConfig = {
        pending:  {
            label: 'Menunggu Review',
            icon:  AlertCircle,
            card:  'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50',
            badge: 'bg-amber-100 text-amber-800 border border-amber-200',
            dot:   'bg-amber-400',
        },
        approved: {
            label: 'Disetujui',
            icon:  CheckCircle2,
            card:  'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50',
            badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
            dot:   'bg-emerald-400',
        },
        rejected: {
            label: 'Ditolak',
            icon:  XCircle,
            card:  'border-red-200 bg-gradient-to-r from-red-50 to-rose-50',
            badge: 'bg-red-100 text-red-800 border border-red-200',
            dot:   'bg-red-400',
        },
    };

    const cfg    = statusConfig[reg.status] ?? statusConfig.pending;
    const Icon   = cfg.icon;

    return (
        <motion.div variants={variants}
            whileHover={{ y: -2, scale: 1.005 }}
            className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden
                        transition-shadow duration-300 hover:shadow-md ${cfg.card}`}>

            {/* Top accent bar */}
            <div className={`h-1 w-full ${
                reg.status === 'approved' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                reg.status === 'rejected' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                                            'bg-gradient-to-r from-amber-400 to-orange-500'
            }`} />

            <div className="p-6">
                <div className="flex items-start justify-between gap-4">

                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">

                        {/* Event title */}
                        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                            {reg.event.title}
                        </h3>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-3 mt-2.5">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{reg.category.name}</span>
                            </div>
                            {reg.team_name && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Users className="w-3.5 h-3.5 text-violet-400" />
                                    <span>{reg.team_name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                    {new Date(reg.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Submission area */}
                        {isApproved && (
                            <div className="mt-4">
                                {hasSubmission ? (
                                    /* Sudah Upload */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 bg-white/80
                                                   border border-emerald-200 rounded-xl p-3">
                                        <div className="w-9 h-9 bg-emerald-100 rounded-lg
                                                        flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Karya dikirim</p>
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                {reg.submission.title}
                                            </p>
                                        </div>
                                        <SubmissionStatusBadge status={reg.submission.status} />
                                    </motion.div>
                                ) : (
                                    /* Belum Upload */
                                    <motion.div
                                        animate={{ scale: [1, 1.01, 1] }}
                                        transition={{ duration: 2.5, repeat: Infinity }}>
                                        <Link
                                            href={route('user.submissions.create', reg.id)}
                                            className="inline-flex items-center gap-2
                                                       bg-gradient-to-r from-indigo-600 to-blue-600
                                                       text-white font-semibold px-5 py-2.5
                                                       rounded-xl text-sm shadow-md
                                                       shadow-indigo-200 hover:shadow-indigo-300
                                                       hover:-translate-y-0.5 transition-all
                                                       duration-300">
                                            <Upload className="w-4 h-4" />
                                            Upload Karya Sekarang
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Rejection reason */}
                        {isRejected && reg.rejection_reason && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 flex items-start gap-2 bg-red-50 border
                                           border-red-200 rounded-xl p-3">
                                <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-red-700 mb-0.5">
                                        Alasan Penolakan:
                                    </p>
                                    <p className="text-xs text-red-600">
                                        {reg.rejection_reason}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Pending info */}
                        {isPending && (
                            <p className="mt-3 text-xs text-amber-700 flex items-center gap-1.5">
                                <motion.span
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-2 h-2 bg-amber-500 rounded-full inline-block" />
                                Sedang ditinjau oleh admin, harap tunggu...
                            </p>
                        )}
                    </div>

                    {/* Right: Status Badge */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold
                                         px-3 py-1.5 rounded-full ${cfg.badge}`}>
                            <motion.span
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                        </span>

                        {/* Upload done indicator */}
                        {isApproved && hasSubmission && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="flex items-center gap-1 text-xs font-bold
                                           text-emerald-700 bg-emerald-100 border
                                           border-emerald-200 px-2.5 py-1 rounded-full">
                                ✅ Sudah Upload
                            </motion.span>
                        )}

                        {/* Hasil penilaian jika ada */}
                        {reg.submission?.status === 'approved' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-1 text-xs text-amber-600
                                           font-semibold">
                                <Trophy className="w-3.5 h-3.5" />
                                Dalam Penilaian
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SubmissionStatusBadge({ status }) {
    const config = {
        draft:     { label: 'Draft',         class: 'bg-gray-100 text-gray-600 border-gray-200'     },
        submitted: { label: 'Menunggu',      class: 'bg-blue-100 text-blue-700 border-blue-200'     },
        approved:  { label: 'Disetujui',     class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        rejected:  { label: 'Dikembalikan',  class: 'bg-red-100 text-red-700 border-red-200'        },
    };
    const c = config[status] ?? config.draft;
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border
                          shrink-0 ${c.class}`}>
            {c.label}
        </span>
    );
}