import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const MEDAL_CONFIG = [
    { emoji: '🥇', label: 'Juara 1',  bg: 'from-yellow-400 to-amber-500',   shadow: 'shadow-amber-200',  text: 'text-amber-700',  ring: 'ring-amber-300' },
    { emoji: '🥈', label: 'Juara 2',  bg: 'from-slate-400 to-gray-500',     shadow: 'shadow-gray-200',   text: 'text-gray-700',   ring: 'ring-gray-300'  },
    { emoji: '🥉', label: 'Juara 3',  bg: 'from-orange-400 to-amber-600',   shadow: 'shadow-orange-200', text: 'text-orange-700', ring: 'ring-orange-300'},
];

const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export default function ResultsIndex({ results }) {

    const bestRank  = results.length > 0
        ? Math.min(...results.filter(r => r.rank).map(r => r.rank))
        : null;
    const avgScore  = results.length > 0 && results.some(r => r.final_score)
        ? (results.filter(r => r.final_score)
                  .reduce((a, b) => a + b.final_score, 0)
           / results.filter(r => r.final_score).length).toFixed(1)
        : null;

    return (
        <UserLayout header="Hasil Penilaian">
            <Head title="Hasil Penilaian" />

            {/* Empty State */}
            <AnimatePresence>
                {results.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-28
                                   bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <motion.div
                            animate={{ y: [0, -12, 0], rotate: [0, 5, -3, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="text-8xl mb-6">🏆</motion.div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Belum Ada Hasil
                        </h3>
                        <p className="text-gray-400 text-sm text-center max-w-sm">
                            Hasil penilaian akan muncul setelah event selesai
                            dan semua juri telah memberikan penilaian.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {results.length > 0 && (
                <>
                    {/* Summary Cards */}
                    <motion.div
                        initial="hidden" animate="show" variants={stagger}
                        className="grid grid-cols-3 gap-4 mb-8">

                        <motion.div variants={fadeUp}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-amber-500 to-orange-500
                                       rounded-2xl p-5 text-white shadow-lg shadow-amber-200">
                            <Trophy className="w-6 h-6 mb-2 opacity-80" />
                            <p className="text-3xl font-black">
                                {bestRank ? `#${bestRank}` : '-'}
                            </p>
                            <p className="text-amber-100 text-xs mt-0.5">Peringkat Terbaik</p>
                        </motion.div>

                        <motion.div variants={fadeUp}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-indigo-500 to-blue-600
                                       rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                            <Star className="w-6 h-6 mb-2 opacity-80" />
                            <p className="text-3xl font-black">{avgScore ?? '-'}</p>
                            <p className="text-indigo-100 text-xs mt-0.5">Rata-rata Skor</p>
                        </motion.div>

                        <motion.div variants={fadeUp}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-emerald-500 to-teal-600
                                       rounded-2xl p-5 text-white shadow-lg shadow-emerald-200">
                            <Award className="w-6 h-6 mb-2 opacity-80" />
                            <p className="text-3xl font-black">{results.length}</p>
                            <p className="text-emerald-100 text-xs mt-0.5">Total Event</p>
                        </motion.div>
                    </motion.div>

                    {/* Result Cards */}
                    <motion.div
                        initial="hidden" animate="show" variants={stagger}
                        className="space-y-5">
                        {results.map((result, idx) => (
                            <ResultCard key={idx} result={result} index={idx} />
                        ))}
                    </motion.div>
                </>
            )}
        </UserLayout>
    );
}

function ResultCard({ result, index }) {
    const [expanded, setExpanded] = useState(false);
    const rank   = result.rank;
    const medal  = rank && rank <= 3 ? MEDAL_CONFIG[rank - 1] : null;
    const score  = result.final_score ?? 0;
    const scores = result.submission?.scores ?? [];

    // Kelompokkan skor per kriteria
    const byKriteria = scores.reduce((acc, s) => {
        const key = s.criteria?.name ?? 'Lainnya';
        if (!acc[key]) acc[key] = [];
        acc[key].push(s.score);
        return acc;
    }, {});

    const kriteriaEntries = Object.entries(byKriteria).map(([name, vals]) => ({
        name,
        avg: vals.reduce((a, b) => a + b, 0) / vals.length,
    }));

    const maxScore = 100;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.55, delay: index * 0.1 } }
            }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${
                medal ? medal.bg : 'from-indigo-400 to-blue-500'
            }`} />

            <div className="p-6">
                <div className="flex items-start gap-5">

                    {/* Medal / Rank */}
                    <div className="shrink-0">
                        {medal ? (
                            <motion.div
                                animate={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: index }}
                                className={`w-16 h-16 bg-gradient-to-br ${medal.bg}
                                             rounded-2xl flex flex-col items-center
                                             justify-center shadow-lg ${medal.shadow}
                                             ring-2 ${medal.ring}`}>
                                <span className="text-2xl leading-none">{medal.emoji}</span>
                                <span className="text-white text-[10px] font-bold mt-0.5">
                                    {medal.label}
                                </span>
                            </motion.div>
                        ) : rank ? (
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100
                                             to-gray-200 rounded-2xl flex flex-col
                                             items-center justify-center border border-gray-200">
                                <span className="text-xl font-black text-gray-600">
                                    #{rank}
                                </span>
                                <span className="text-gray-400 text-[10px]">Peringkat</span>
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex
                                             items-center justify-center">
                                <Target className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {result.registration.event.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {result.registration.category.name}
                        </p>

                        {result.submission ? (
                            <>
                                <p className="text-sm text-gray-600 mt-2">
                                    Karya:{' '}
                                    <span className="font-semibold text-gray-800">
                                        {result.submission.title}
                                    </span>
                                </p>

                                {/* Score display */}
                                <div className="mt-4">
                                    <div className="flex items-end gap-3 mb-2">
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, delay: 0.3 + index * 0.1 }}
                                            className={`text-5xl font-black ${
                                                medal ? medal.text : 'text-indigo-600'
                                            }`}>
                                            {Number(score).toFixed(1)}
                                        </motion.span>
                                        <div className="mb-1">
                                            <span className="text-gray-400 text-sm">/ {maxScore}</span>
                                            <p className="text-xs text-gray-400">Skor Akhir</p>
                                        </div>
                                        {medal && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                                                className={`ml-auto flex items-center gap-1.5
                                                             bg-gradient-to-r ${medal.bg}
                                                             text-white text-xs font-bold
                                                             px-3 py-1.5 rounded-full
                                                             shadow-md ${medal.shadow}`}>
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                {medal.label}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Score bar */}
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <motion.div
                                            className={`h-2.5 rounded-full bg-gradient-to-r ${
                                                medal ? medal.bg : 'from-indigo-500 to-blue-500'
                                            }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(score / maxScore) * 100}%` }}
                                            transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>

                                {/* Expand button */}
                                {kriteriaEntries.length > 0 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="mt-4 flex items-center gap-1.5 text-sm
                                                   text-indigo-600 font-semibold hover:underline">
                                        {expanded ? (
                                            <><ChevronUp className="w-4 h-4" /> Sembunyikan Detail</>
                                        ) : (
                                            <><ChevronDown className="w-4 h-4" /> Lihat Detail per Kriteria</>
                                        )}
                                    </button>
                                )}

                                {/* Kriteria breakdown */}
                                <AnimatePresence>
                                    {expanded && kriteriaEntries.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.35 }}
                                            className="overflow-hidden">
                                            <div className="mt-4 pt-4 border-t border-gray-100
                                                            space-y-3">
                                                <p className="text-xs font-bold text-gray-500
                                                               uppercase tracking-wider mb-3">
                                                    Detail Penilaian per Kriteria
                                                </p>
                                                {kriteriaEntries.map((k, ki) => (
                                                    <div key={ki} className="flex items-center gap-3">
                                                        <span className="text-xs text-gray-600
                                                                         w-36 shrink-0 font-medium">
                                                            {k.name}
                                                        </span>
                                                        <div className="flex-1 bg-gray-100
                                                                        rounded-full h-2 overflow-hidden">
                                                            <motion.div
                                                                className="h-2 rounded-full bg-gradient-to-r
                                                                           from-indigo-400 to-blue-500"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(k.avg / 100) * 100}%` }}
                                                                transition={{ duration: 0.9, delay: ki * 0.08, ease: 'easeOut' }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-black
                                                                         text-indigo-600 w-10 text-right">
                                                            {k.avg.toFixed(1)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-400
                                            bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <Target className="w-4 h-4" />
                                Karya belum diupload untuk event ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}