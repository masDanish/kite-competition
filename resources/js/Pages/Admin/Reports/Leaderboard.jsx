import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Trophy, UserCog, Star, Download,
    BarChart3, Tag, ChevronDown, ChevronUp,
    Medal, Users
} from 'lucide-react';

const fadeUp  = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const MEDAL_CFG = [
    {
        emoji: '🥇', podiumH: 'h-28 sm:h-32',
        podiumBg: 'from-amber-300 to-yellow-400',
        shadow: 'shadow-amber-200', ring: 'ring-amber-300', nameBold: true,
    },
    {
        emoji: '🥈', podiumH: 'h-20 sm:h-24',
        podiumBg: 'from-slate-300 to-gray-400',
        shadow: 'shadow-gray-200', ring: 'ring-gray-300', nameBold: false,
    },
    {
        emoji: '🥉', podiumH: 'h-14 sm:h-16',
        podiumBg: 'from-orange-300 to-amber-400',
        shadow: 'shadow-orange-200', ring: 'ring-orange-300', nameBold: false,
    },
];

const CATEGORY_COLORS = [
    { grad: 'from-indigo-500 to-blue-600',   light: 'bg-indigo-50',  border: 'border-indigo-200', text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700 border-indigo-200'  },
    { grad: 'from-violet-500 to-purple-600', light: 'bg-violet-50',  border: 'border-violet-200', text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700 border-violet-200'  },
    { grad: 'from-teal-500 to-emerald-600',  light: 'bg-teal-50',    border: 'border-teal-200',   text: 'text-teal-700',    badge: 'bg-teal-100 text-teal-700 border-teal-200'        },
    { grad: 'from-rose-500 to-pink-600',     light: 'bg-rose-50',    border: 'border-rose-200',   text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700 border-rose-200'        },
    { grad: 'from-amber-500 to-orange-600',  light: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700 border-amber-200'     },
    { grad: 'from-cyan-500 to-sky-600',      light: 'bg-cyan-50',    border: 'border-cyan-200',   text: 'text-cyan-700',    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200'        },
];

export default function Leaderboard({ event, leaderboard, criteria, jury_count }) {

    const grouped = leaderboard.reduce((acc, item) => {
        const key = item.category?.name ?? 'Umum';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => b.final_score - a.final_score);
    });

    const categoryNames = Object.keys(grouped);
    const [activeTab, setActiveTab] = useState(categoryNames[0] ?? null);

    const stats = [
        { label: 'Total Karya',       value: leaderboard.length,    icon: BarChart3, grad: 'from-indigo-500 to-blue-600',   shadow: 'shadow-indigo-200'  },
        { label: 'Total Kategori',    value: categoryNames.length,  icon: Tag,       grad: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200'  },
        { label: 'Jumlah Juri',       value: jury_count,            icon: UserCog,   grad: 'from-emerald-500 to-teal-600',  shadow: 'shadow-emerald-200' },
        { label: 'Kriteria',          value: criteria.length,       icon: Star,      grad: 'from-amber-500 to-orange-500',  shadow: 'shadow-amber-200'   },
    ];

    return (
        <AdminLayout header={`Leaderboard: ${event.title}`}>
            <Head title="Leaderboard" />

            {/* ── Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br
                           from-slate-800 via-indigo-900 to-blue-900 p-4 sm:p-6 mb-6 sm:mb-8 text-white">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                        }} />
                </div>
                <div className="relative z-10 flex justify-between items-start sm:items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
                            <span className="text-indigo-300 text-xs sm:text-sm font-medium">
                                Leaderboard Event
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black">🏆 Leaderboard</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1 truncate max-w-[260px] sm:max-w-lg">
                            {event.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                            {categoryNames.map((name) => (
                                <span key={name}
                                    className="text-xs bg-white/15 backdrop-blur-sm border
                                               border-white/20 text-white px-2.5 sm:px-3 py-0.5 sm:py-1
                                               rounded-full font-medium">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-4xl sm:text-5xl hidden sm:block shrink-0">
                        🏆
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div
                initial="hidden" animate="show" variants={stagger}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {stats.map((s, i) => (
                    <motion.div key={i} variants={fadeUp}
                        whileHover={{ y: -4, scale: 1.03 }}
                        className={`bg-white rounded-2xl p-3 sm:p-5 shadow-lg ${s.shadow}
                                    border border-gray-100 flex items-center gap-3 sm:gap-4`}>
                        <div className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br ${s.grad} rounded-xl
                                         flex items-center justify-center shadow-md shrink-0`}>
                            <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-gray-800">{s.value}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Tab Selector Kategori ── */}
            {categoryNames.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                    {categoryNames.map((name, i) => {
                        const color   = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                        const isActive = activeTab === name;
                        return (
                            <motion.button
                                key={name}
                                onClick={() => setActiveTab(name)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5
                                            rounded-2xl text-xs sm:text-sm font-bold border-2
                                            transition-all duration-200
                                            ${isActive
                                                ? `bg-gradient-to-r ${color.grad} text-white
                                                   border-transparent shadow-lg`
                                                : `bg-white ${color.border} ${color.text}`}`}>
                                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                                <span className="truncate max-w-[100px] sm:max-w-none">{name}</span>
                                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-black shrink-0
                                                  ${isActive
                                                      ? 'bg-white/20 text-white'
                                                      : color.badge + ' border'}`}>
                                    {grouped[name].length}
                                </span>
                            </motion.button>
                        );
                    })}
                </motion.div>
            )}

            {/* ── Leaderboard per Kategori ── */}
            <AnimatePresence mode="wait">
                {categoryNames.map((catName, catIdx) => {
                    if (catName !== activeTab && categoryNames.length > 1) return null;
                    const items = grouped[catName];
                    const color = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length];

                    return (
                        <motion.div
                            key={catName}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}>

                            {/* Kategori header */}
                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between
                                             gap-3 mb-4 sm:mb-5 pb-4 border-b-2 ${color.border}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${color.grad}
                                                     rounded-xl flex items-center justify-center
                                                     shadow-md shrink-0`}>
                                        <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className={`font-black text-lg sm:text-xl ${color.text}`}>
                                            {catName}
                                        </h2>
                                        <p className="text-xs text-gray-400">
                                            {items.length} peserta · {criteria.length} kriteria penilaian
                                        </p>
                                    </div>
                                </div>
                                <a href={route('admin.reports.export', event.id)}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r
                                               ${color.grad} text-white text-xs font-bold rounded-2xl
                                               shadow-md hover:-translate-y-0.5 hover:shadow-lg
                                               active:scale-95 transition-all duration-200 self-start sm:self-auto`}>
                                    <Download className="w-3.5 h-3.5 shrink-0" />
                                    Export Excel
                                </a>
                            </div>

                            {/* Podium */}
                            {items.length >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className={`relative overflow-hidden rounded-2xl sm:rounded-3xl
                                               ${color.light} border ${color.border}
                                               p-4 sm:p-8 mb-5 sm:mb-6`}>
                                    <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40
                                                    bg-white/40 rounded-full translate-x-1/3 -translate-y-1/3" />
                                    <div className="absolute bottom-0 left-0 w-20 sm:w-28 h-20 sm:h-28
                                                    bg-white/30 rounded-full -translate-x-1/4 translate-y-1/4" />

                                    <h3 className={`relative z-10 text-center font-black
                                                    text-sm sm:text-base mb-4 sm:mb-6 flex items-center
                                                    justify-center gap-2 ${color.text}`}>
                                        <Trophy className="w-4 h-4" />
                                        Podium — {catName}
                                    </h3>

                                    <div className="relative z-10 flex justify-center items-end
                                                    gap-2 sm:gap-4 md:gap-8">
                                        {[1, 0, 2].map(rank => {
                                            const cfg  = MEDAL_CFG[rank];
                                            const item = items[rank];
                                            if (!item) return null;
                                            return (
                                                <motion.div
                                                    key={rank}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + rank * 0.08, duration: 0.5 }}
                                                    className="flex flex-col items-center gap-1.5 sm:gap-2
                                                               w-20 sm:w-28 md:w-36">
                                                    <motion.div
                                                        animate={rank === 0 ? { y: [0, -6, 0] } : {}}
                                                        transition={{ duration: 3, repeat: Infinity }}
                                                        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl
                                                                    bg-gradient-to-br ${cfg.podiumBg}
                                                                    flex flex-col items-center
                                                                    justify-center shadow-lg ${cfg.shadow}
                                                                    ring-2 ${cfg.ring}`}>
                                                        <span className="text-xl sm:text-2xl leading-none">
                                                            {cfg.emoji}
                                                        </span>
                                                    </motion.div>

                                                    <div className="text-center w-full px-1">
                                                        <p className={`text-[10px] sm:text-xs leading-tight
                                                                       text-gray-800 truncate
                                                                       ${cfg.nameBold ? 'font-black' : 'font-semibold'}`}>
                                                            {item.user.name}
                                                        </p>
                                                        <p className="text-[9px] sm:text-[10px] text-gray-500
                                                                      mt-0.5 truncate">
                                                            {item.title}
                                                        </p>
                                                    </div>

                                                    <div className={`w-full ${cfg.podiumH}
                                                                     bg-gradient-to-t ${cfg.podiumBg}
                                                                     rounded-t-2xl shadow-md ${cfg.shadow}
                                                                     flex flex-col items-center
                                                                     justify-start pt-2 gap-0.5`}>
                                                        <span className="font-black text-white text-xs sm:text-sm
                                                                         drop-shadow">
                                                            {item.final_score}
                                                        </span>
                                                        <span className="text-white/80 text-[9px] sm:text-[10px] font-medium">
                                                            poin
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Tabel lengkap */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm
                                            border border-gray-100 overflow-hidden mb-6 sm:mb-8">

                                {/* Table header — hidden on mobile */}
                                <div className={`hidden sm:block px-4 sm:px-5 py-3
                                                 bg-gradient-to-r ${color.grad}`}>
                                    <div className="grid grid-cols-12 text-xs font-bold text-white
                                                    uppercase tracking-wider">
                                        <span className="col-span-1 text-center">Rank</span>
                                        <span className="col-span-3">Peserta</span>
                                        <span className="col-span-3">Judul Karya</span>
                                        {criteria.slice(0, 3).map(c => (
                                            <span key={c.id}
                                                className="col-span-1 text-center hidden lg:block truncate"
                                                title={c.name}>
                                                {c.name.split(' ')[0]}
                                            </span>
                                        ))}
                                        <span className="col-span-1 text-center ml-auto">Skor</span>
                                    </div>
                                </div>

                                {/* Mobile header */}
                                <div className={`sm:hidden px-4 py-2.5 bg-gradient-to-r ${color.grad}`}>
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                                        Peringkat Peserta
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    <AnimatePresence>
                                        {items.map((item, idx) => (
                                            <LeaderboardRow
                                                key={item.id}
                                                item={item}
                                                idx={idx}
                                                criteria={criteria}
                                                color={color}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className={`px-4 sm:px-5 py-3 ${color.light} border-t ${color.border}
                                                flex flex-col sm:flex-row sm:items-center
                                                justify-between gap-1`}>
                                    <span className={`text-xs font-semibold ${color.text}`}>
                                        Total {items.length} peserta di kategori {catName}
                                    </span>
                                    <span className={`text-xs ${color.text} font-bold`}>
                                        Rata-rata:{' '}
                                        {(items.reduce((s, i) => s + i.final_score, 0) / items.length).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </AdminLayout>
    );
}

/* ══════════════════════════════
   ROW TABLE
══════════════════════════════ */
function LeaderboardRow({ item, idx, criteria, color }) {
    const [expanded, setExpanded] = useState(false);
    const isTop3  = idx < 3;
    const medals  = ['🥇', '🥈', '🥉'];
    const rowBg   = idx === 0 ? 'bg-amber-50/70'
                  : idx === 1 ? 'bg-slate-50/70'
                  : idx === 2 ? 'bg-orange-50/70'
                  : 'bg-white';

    const scoreColor = idx === 0 ? 'text-amber-500'
                     : idx === 1 ? 'text-slate-500'
                     : idx === 2 ? 'text-orange-500'
                     : 'text-indigo-600';

    return (
        <>
            {/* Desktop row */}
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.4 }}
                className={`hidden sm:grid grid-cols-12 items-center px-4 sm:px-5 py-3 sm:py-3.5
                            ${rowBg} hover:bg-opacity-100 transition-all duration-150
                            cursor-pointer group`}
                onClick={() => setExpanded(!expanded)}>

                <div className="col-span-1 flex justify-center">
                    {isTop3 ? (
                        <span className="text-lg sm:text-xl">{medals[idx]}</span>
                    ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7
                                         bg-gray-100 rounded-lg text-xs font-black text-gray-500">
                            {idx + 1}
                        </span>
                    )}
                </div>

                <div className="col-span-3 flex items-center gap-2">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center
                                     text-white text-xs font-bold shrink-0
                                     bg-gradient-to-br ${isTop3
                                         ? 'from-amber-400 to-orange-500'
                                         : color.grad}`}>
                        {item.user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className={`text-xs sm:text-sm truncate
                                   ${isTop3 ? 'font-black text-gray-800' : 'font-semibold text-gray-700'}`}>
                        {item.user.name}
                    </p>
                </div>

                <div className="col-span-3 min-w-0">
                    <p className="text-xs text-gray-500 italic truncate">{item.title}</p>
                </div>

                {criteria.slice(0, 3).map(c => (
                    <div key={c.id} className="col-span-1 text-center hidden lg:block">
                        <span className="text-xs text-gray-600 font-medium">
                            {item.score_per_criteria?.[c.name] ?? '—'}
                        </span>
                    </div>
                ))}

                <div className="col-span-1 flex items-center justify-end gap-1.5">
                    <span className={`font-black text-base sm:text-lg ${scoreColor}`}>
                        {item.final_score}
                    </span>
                    <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-300 group-hover:text-gray-500 transition-colors">
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Mobile row */}
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.4 }}
                className={`sm:hidden flex items-center justify-between px-3 py-3
                            ${rowBg} cursor-pointer`}
                onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 w-7 flex justify-center">
                        {isTop3 ? (
                            <span className="text-lg">{medals[idx]}</span>
                        ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6
                                             bg-gray-100 rounded-lg text-xs font-black text-gray-500">
                                {idx + 1}
                            </span>
                        )}
                    </div>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center
                                     text-white text-xs font-bold shrink-0
                                     bg-gradient-to-br ${isTop3
                                         ? 'from-amber-400 to-orange-500'
                                         : color.grad}`}>
                        {item.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className={`text-xs truncate ${isTop3 ? 'font-black text-gray-800' : 'font-semibold text-gray-700'}`}>
                            {item.user.name}
                        </p>
                        <p className="text-[10px] text-gray-400 italic truncate">{item.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`font-black text-base ${scoreColor}`}>{item.final_score}</span>
                    <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-300">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Expanded breakdown */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`overflow-hidden ${rowBg} border-t border-dashed border-gray-100`}>
                        <div className="px-3 sm:px-6 py-3 sm:py-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                Breakdown Nilai per Kriteria
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                {criteria.map(c => {
                                    const score = item.score_per_criteria?.[c.name] ?? null;
                                    const pct   = score !== null ? (score / c.max_score) * 100 : 0;
                                    return (
                                        <div key={c.id}
                                            className="bg-white rounded-xl sm:rounded-2xl border
                                                       border-gray-100 shadow-sm p-2.5 sm:p-3">
                                            <p className="text-[10px] font-bold text-gray-500
                                                          uppercase tracking-wide mb-1 truncate">
                                                {c.name}
                                            </p>
                                            <div className="flex items-end justify-between mb-1.5 sm:mb-2">
                                                <span className={`text-lg sm:text-xl font-black ${scoreColor}`}>
                                                    {score ?? '—'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    / {c.max_score}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <motion.div
                                                    className={`h-1.5 rounded-full bg-gradient-to-r ${color.grad}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                Bobot: {c.weight}× — {pct.toFixed(0)}%
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}