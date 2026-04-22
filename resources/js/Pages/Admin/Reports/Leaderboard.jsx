import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Users, UserCog, Star,
    Download, Tag, BarChart3, Medal
} from 'lucide-react';

const fadeUp  = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const MEDAL_CFG = [
    {
        emoji: '🥇',
        podiumH:   'h-32',
        podiumBg:  'from-amber-300 to-yellow-400',
        shadow:    'shadow-amber-200',
        nameBold:  true,
        ring:      'ring-amber-300',
        order:     1,
    },
    {
        emoji: '🥈',
        podiumH:   'h-24',
        podiumBg:  'from-slate-300 to-gray-400',
        shadow:    'shadow-gray-200',
        nameBold:  false,
        ring:      'ring-gray-300',
        order:     0,
    },
    {
        emoji: '🥉',
        podiumH:   'h-16',
        podiumBg:  'from-orange-300 to-amber-400',
        shadow:    'shadow-orange-200',
        nameBold:  false,
        ring:      'ring-orange-300',
        order:     2,
    },
];

export default function Leaderboard({ event, leaderboard, criteria, jury_count }) {
    const stats = [
        {
            label:  'Total Karya',
            value:  leaderboard.length,
            icon:   BarChart3,
            grad:   'from-indigo-500 to-blue-600',
            shadow: 'shadow-indigo-200',
        },
        {
            label:  'Jumlah Juri',
            value:  jury_count,
            icon:   UserCog,
            grad:   'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-200',
        },
        {
            label:  'Kriteria Penilaian',
            value:  criteria.length,
            icon:   Star,
            grad:   'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-200',
        },
    ];

    /* Podium order: 2nd (left), 1st (center), 3rd (right) */
    const podiumOrder = [1, 0, 2];

    return (
        <AdminLayout header={`Leaderboard: ${event.title}`}>
            <Head title="Leaderboard" />

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
                            <Trophy className="w-4 h-4 text-amber-300" />
                            <span className="text-indigo-300 text-sm font-medium">Leaderboard Event</span>
                        </div>
                        <h1 className="text-2xl font-black">🏆 Leaderboard</h1>
                        <p className="text-slate-300 text-sm mt-1 max-w-lg truncate">
                            {event.title}
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl hidden md:block">
                        🏆
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div
                initial="hidden" animate="show" variants={stagger}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

            {/* ── Podium ── */}
            {leaderboard.length >= 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative overflow-hidden rounded-3xl
                               bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50
                               border border-amber-200 p-8 mb-8">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200/30
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200/30
                                    rounded-full -translate-x-1/4 translate-y-1/4" />

                    <h2 className="relative z-10 text-center font-black text-gray-800
                                   text-lg mb-8 flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Podium Juara
                    </h2>

                    <div className="relative z-10 flex justify-center items-end gap-4 md:gap-8">
                        {podiumOrder.map(rank => {
                            const cfg  = MEDAL_CFG[rank];
                            const item = leaderboard[rank];
                            return (
                                <motion.div
                                    key={rank}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + rank * 0.1, duration: 0.5 }}
                                    className="flex flex-col items-center gap-2 w-28 md:w-36">
                                    {/* Avatar */}
                                    <motion.div
                                        animate={rank === 0
                                            ? { y: [0, -6, 0] }
                                            : {}}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br
                                                    ${cfg.podiumBg} flex items-center justify-center
                                                    text-2xl shadow-lg ${cfg.shadow}
                                                    ring-2 ${cfg.ring}`}>
                                        {cfg.emoji}
                                    </motion.div>

                                    {/* Name + score */}
                                    <div className="text-center">
                                        <p className={`text-xs leading-tight text-gray-800
                                                       ${cfg.nameBold ? 'font-black' : 'font-semibold'}`}>
                                            {item.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-full">
                                            {item.category?.name}
                                        </p>
                                    </div>

                                    {/* Podium bar */}
                                    <div className={`w-full ${cfg.podiumH} bg-gradient-to-t
                                                     ${cfg.podiumBg} rounded-t-2xl shadow-md
                                                     ${cfg.shadow} flex items-start justify-center
                                                     pt-2`}>
                                        <span className={`font-black text-white text-sm drop-shadow`}>
                                            {item.final_score}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* ── Full Leaderboard Table ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-amber-600" />
                        </div>
                        <h2 className="font-bold text-gray-800">Peringkat Lengkap</h2>
                    </div>
                    <a href={route('admin.reports.export', event.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br
                                   from-indigo-600 to-blue-600 text-white text-xs font-bold
                                   rounded-2xl shadow-md shadow-indigo-200 hover:-translate-y-0.5
                                   hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200">
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </a>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {['Rank', 'Peserta', 'Kategori', 'Karya', 'Skor Akhir'].map(h => (
                                    <th key={h} className={`px-5 py-3.5 text-xs font-bold
                                                             text-gray-500 uppercase tracking-wider
                                                             ${h === 'Skor Akhir' ? 'text-right' : 'text-left'}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody
                            initial="hidden" animate="show" variants={stagger}
                            className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {leaderboard.map((item, idx) => (
                                    <LeaderboardRow key={item.id} item={item} idx={idx} />
                                ))}
                            </AnimatePresence>
                        </motion.tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-3">
                    <AnimatePresence>
                        {leaderboard.map((item, idx) => (
                            <LeaderboardMobileCard key={item.id} item={item} idx={idx} />
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AdminLayout>
    );
}

/* ── Desktop Row ── */
function LeaderboardRow({ item, idx }) {
    const isTop3  = idx < 3;
    const medals  = ['🥇', '🥈', '🥉'];
    const rowBg   = idx === 0
        ? 'bg-amber-50/60 hover:bg-amber-50'
        : idx === 1
        ? 'bg-slate-50/60 hover:bg-slate-50'
        : idx === 2
        ? 'bg-orange-50/60 hover:bg-orange-50'
        : 'hover:bg-indigo-50/30';

    return (
        <motion.tr variants={fadeUp}
            className={`transition-colors duration-150 ${rowBg}`}>
            {/* Rank */}
            <td className="px-5 py-4">
                {isTop3 ? (
                    <span className="text-xl">{medals[idx]}</span>
                ) : (
                    <span className="inline-flex items-center justify-center w-7 h-7
                                     bg-gray-100 rounded-lg text-xs font-black text-gray-500">
                        {idx + 1}
                    </span>
                )}
            </td>
            {/* Peserta */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                                     text-white text-xs font-bold shrink-0
                                     ${isTop3
                                         ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                         : 'bg-gradient-to-br from-indigo-400 to-blue-500'}`}>
                        {item.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm ${isTop3 ? 'font-black text-gray-800' : 'font-semibold text-gray-700'}`}>
                        {item.user.name}
                    </span>
                </div>
            </td>
            {/* Kategori */}
            <td className="px-5 py-4">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1
                                 rounded-full font-semibold border border-indigo-100">
                    {item.category?.name ?? '—'}
                </span>
            </td>
            {/* Karya */}
            <td className="px-5 py-4 text-sm text-gray-600 font-medium">
                {item.title}
            </td>
            {/* Skor */}
            <td className="px-5 py-4 text-right">
                <span className={`font-black text-lg
                    ${idx === 0
                        ? 'text-amber-500'
                        : idx === 1
                        ? 'text-slate-500'
                        : idx === 2
                        ? 'text-orange-500'
                        : 'text-indigo-600'}`}>
                    {item.final_score}
                </span>
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ── */
function LeaderboardMobileCard({ item, idx }) {
    const medals = ['🥇', '🥈', '🥉'];
    const isTop3 = idx < 3;
    const cardBg = idx === 0
        ? 'border-amber-200 bg-amber-50/50'
        : idx === 1
        ? 'border-slate-200 bg-slate-50/50'
        : idx === 2
        ? 'border-orange-200 bg-orange-50/50'
        : 'border-gray-100 bg-gray-50/40';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border ${cardBg}
                        hover:border-indigo-200 transition-colors duration-200`}>
            {/* Rank */}
            <div className="shrink-0 w-9 text-center">
                {isTop3
                    ? <span className="text-2xl">{medals[idx]}</span>
                    : <span className="text-sm font-black text-gray-400">#{idx + 1}</span>
                }
            </div>
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                             text-white font-bold text-sm shrink-0
                             ${isTop3
                                 ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                                 : 'bg-gradient-to-br from-indigo-400 to-blue-500'}`}>
                {item.user.name.charAt(0).toUpperCase()}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${isTop3 ? 'font-black text-gray-800' : 'font-semibold text-gray-700'}`}>
                    {item.user.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5
                                     rounded-full border border-indigo-100 font-semibold">
                        {item.category?.name ?? '—'}
                    </span>
                    <span className="text-xs text-gray-400 truncate">{item.title}</span>
                </div>
            </div>
            {/* Score */}
            <span className={`font-black text-lg shrink-0
                ${idx === 0 ? 'text-amber-500'
                    : idx === 1 ? 'text-slate-500'
                    : idx === 2 ? 'text-orange-500'
                    : 'text-indigo-600'}`}>
                {item.final_score}
            </span>
        </motion.div>
    );
}