// ═══════════════════════════════════════════════════════════
// AnnouncementItem.jsx — Drop-in replacement untuk Dashboard
// Menampilkan leaderboard mini khusus pengumuman tipe "winner"
// ═══════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Trophy, AlertTriangle, Info, ChevronDown,
    Medal, Star, Crown
} from 'lucide-react';

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = [
    { bg: 'bg-amber-100',   text: 'text-amber-700',   bar: 'from-amber-400 to-yellow-500',  ring: 'ring-amber-300'  },
    { bg: 'bg-slate-100',   text: 'text-slate-600',   bar: 'from-slate-400 to-gray-500',    ring: 'ring-slate-300'  },
    { bg: 'bg-orange-100',  text: 'text-orange-700',  bar: 'from-orange-400 to-amber-500',  ring: 'ring-orange-300' },
];

const TYPE_CFG = {
    winner:  { icon: Trophy,        border: 'border-l-amber-400',  bg: 'bg-amber-50',   activeBg: 'bg-amber-100/60',  text: 'text-amber-700',  label: 'Pemenang 🏆'  },
    warning: { icon: AlertTriangle, border: 'border-l-red-400',    bg: 'bg-red-50',     activeBg: 'bg-red-100/60',    text: 'text-red-700',    label: 'Peringatan ⚠️' },
    update:  { icon: Info,          border: 'border-l-blue-400',   bg: 'bg-blue-50',    activeBg: 'bg-blue-100/60',   text: 'text-blue-700',   label: 'Update 🔄'    },
    info:    { icon: Info,          border: 'border-l-indigo-400', bg: 'bg-indigo-50',  activeBg: 'bg-indigo-100/60', text: 'text-indigo-700', label: 'Info ℹ️'      },
};

/* ── Leaderboard Mini ── */
function WinnerLeaderboard({ leaderboard }) {
    if (!leaderboard || leaderboard.length === 0) return null;

    // Pastikan final_score selalu angka, bukan string / null
    const normalized = leaderboard.map(item => ({
        ...item,
        final_score: Number(item.final_score) || 0,
    }));

    // Urutkan dari skor tertinggi ke terendah
    const sorted   = [...normalized].sort((a, b) => b.final_score - a.final_score);
    const maxScore = sorted[0]?.final_score ?? 1;   // hindari pembagian dengan 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3">

            {/* Header */}
            <div className="flex items-center gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 bg-amber-500 text-white
                                text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm shadow-amber-200">
                    <Crown className="w-2.5 h-2.5" />
                    TOP {Math.min(sorted.length, 5)} PEMENANG
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
            </div>

            {/* ── Podium 3 teratas ── */}
            {sorted.length >= 3 && (
                <div className="flex justify-center items-end gap-2 sm:gap-3 mb-3
                                bg-gradient-to-b from-amber-50/60 to-transparent
                                rounded-2xl px-2 pt-3 pb-0 border border-amber-100/60">
                    {/*
                        Urutan visual podium: [🥈 kiri] [🥇 tengah] [🥉 kanan]
                        Kita render dalam urutan [1, 0, 2] (index sorted[])
                        Tinggi podium berdasarkan posisi podium visual:
                            - tengah (🥇, podiumPos 1) → tertinggi  → h-20 sm:h-22
                            - kiri   (🥈, podiumPos 0) → sedang     → h-14 sm:h-16
                            - kanan  (🥉, podiumPos 2) → terpendek  → h-10 sm:h-12
                    */}
                    {[
                        { dataIdx: 1, podiumPos: 0 },   // 🥈 — kiri
                        { dataIdx: 0, podiumPos: 1 },   // 🥇 — tengah (paling tinggi)
                        { dataIdx: 2, podiumPos: 2 },   // 🥉 — kanan
                    ].map(({ dataIdx, podiumPos }) => {
                        const item = sorted[dataIdx];
                        if (!item) return null;
                        const mc = MEDAL_COLORS[dataIdx];

                        // Tinggi podium sesuai posisi visual (bukan rank data)
                        const podiumHeights = [
                            'h-14 sm:h-16',   // kiri  (🥈)
                            'h-20 sm:h-22',   // tengah (🥇) — paling tinggi
                            'h-10 sm:h-12',   // kanan  (🥉)
                        ];

                        return (
                            <motion.div
                                key={dataIdx}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + dataIdx * 0.06 }}
                                className="flex flex-col items-center w-[30%] max-w-[90px]">

                                {/* Avatar + emoji */}
                                <motion.div
                                    animate={dataIdx === 0 ? { y: [0, -4, 0] } : {}}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${mc.bg}
                                                ring-2 ${mc.ring} flex items-center justify-center
                                                text-base sm:text-lg shadow-sm mb-1`}>
                                    {MEDAL_EMOJIS[dataIdx]}
                                </motion.div>

                                {/* Name */}
                                <p className={`text-[9px] sm:text-[10px] font-black ${mc.text}
                                               truncate w-full text-center leading-tight mb-0.5`}>
                                    {item.user_name.split(' ')[0]}
                                </p>

                                {/* Podium bar — tinggi sesuai posisi visual */}
                                <div className={`w-full ${podiumHeights[podiumPos]}
                                                 bg-gradient-to-t ${mc.bar} rounded-t-xl
                                                 flex flex-col items-center justify-start pt-1.5 shadow-md`}>
                                    <span className="text-white font-black text-[10px] sm:text-xs drop-shadow">
                                        {item.final_score}
                                    </span>
                                    <span className="text-white/70 text-[8px] sm:text-[9px]">poin</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Daftar lengkap */}
            <div className="space-y-1.5 mt-1">
                {sorted.map((item, idx) => {
                    const isTop3 = idx < 3;
                    const mc     = MEDAL_COLORS[idx] ?? MEDAL_COLORS[2];
                    const barPct = maxScore > 0 ? (item.final_score / maxScore) * 100 : 0;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl
                                        border transition-all duration-200
                                        ${isTop3
                                            ? mc.bg + ' border-' + (idx===0?'amber':idx===1?'slate':'orange') + '-200 shadow-sm'
                                            : 'bg-white border-gray-100'}`}>

                            {/* Rank */}
                            <div className="shrink-0 w-6 flex justify-center">
                                {isTop3
                                    ? <span className="text-sm">{MEDAL_EMOJIS[idx]}</span>
                                    : <span className="text-[10px] font-black text-gray-400
                                                       w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                                        {idx + 1}
                                      </span>}
                            </div>

                            {/* Avatar */}
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center
                                             text-white text-[9px] font-black shrink-0
                                             bg-gradient-to-br
                                             ${isTop3 ? 'from-amber-400 to-orange-500' : 'from-indigo-400 to-blue-500'}`}>
                                {item.user_name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className={`text-[10px] sm:text-xs font-bold truncate
                                                   ${isTop3 ? mc.text : 'text-gray-700'}`}>
                                        {item.user_name}
                                    </p>
                                    {item.category && (
                                        <span className="text-[8px] sm:text-[9px] bg-indigo-100 text-indigo-600
                                                         px-1.5 py-0.5 rounded-full font-semibold shrink-0 hidden sm:inline">
                                            {item.category}
                                        </span>
                                    )}
                                </div>

                                {/* Score bar */}
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-1 rounded-full bg-gradient-to-r ${mc.bar ?? 'from-indigo-400 to-blue-500'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${barPct}%` }}
                                            transition={{ duration: 0.7, delay: 0.2 + idx * 0.05, ease: 'easeOut' }}
                                        />
                                    </div>
                                    <span className={`text-[9px] sm:text-[10px] font-black shrink-0
                                                      ${isTop3 ? mc.text : 'text-indigo-600'}`}>
                                        {item.final_score}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/* ── Main Component ── */
export default function AnnouncementItem({ ann, index }) {
    const [expanded, setExpanded] = useState(false);

    const cfg  = TYPE_CFG[ann.type] ?? TYPE_CFG.info;
    const Icon = cfg.icon;
    const isWinner = ann.type === 'winner';

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            layout
            className={`rounded-xl sm:rounded-2xl border-l-4 ${cfg.border} overflow-hidden
                        transition-all duration-300 cursor-pointer
                        ${expanded ? cfg.activeBg + ' shadow-md' : cfg.bg + ' hover:shadow-sm'}`}
            onClick={() => setExpanded(v => !v)}>

            {/* ── Header row ── */}
            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center
                                 justify-center shrink-0 ${cfg.text} bg-white/80 shadow-sm mt-0.5`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wide
                                          ${cfg.text} bg-white/60 px-1.5 sm:px-2 py-0.5 rounded-full`}>
                            {cfg.label}
                        </span>

                        {/* Badge "Ada Leaderboard" khusus winner */}
                        {isWinner && ann.leaderboard?.length > 0 && (
                            <motion.span
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                className="inline-flex items-center gap-1 bg-amber-500 text-white
                                           text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full
                                           shadow-sm shadow-amber-200">
                                <Star className="w-2 h-2" />
                                Lihat Ranking
                            </motion.span>
                        )}
                    </div>

                    <p className={`font-bold text-gray-800 text-xs sm:text-sm leading-snug
                                   ${expanded ? '' : 'line-clamp-2'}`}>
                        {ann.title}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                        {new Date(ann.published_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric',
                        })}
                    </p>
                </div>

                <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center
                                justify-center shrink-0 ${cfg.text} bg-white/60 border border-white/80
                                shadow-sm mt-0.5`}>
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </motion.div>
            </div>

            {/* ── Expanded Content ── */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden">
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                            <div className={`h-px mb-3 bg-gradient-to-r from-transparent
                                             via-current to-transparent opacity-20 ${cfg.text}`} />

                            {/* Isi teks pengumuman */}
                            {ann.content ? (
                                <motion.p
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {ann.content}
                                </motion.p>
                            ) : (
                                <p className="text-xs sm:text-sm text-gray-400 italic">
                                    Tidak ada detail tambahan.
                                </p>
                            )}

                            {/* Leaderboard Mini — hanya muncul jika tipe winner */}
                            {isWinner && (
                                <WinnerLeaderboard leaderboard={ann.leaderboard} />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}