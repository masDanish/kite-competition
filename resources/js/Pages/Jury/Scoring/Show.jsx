import JuryLayout from '@/Layouts/JuryLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, FileText, Save, ChevronRight, Sparkles, Zap } from 'lucide-react';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
    id: i, left: `${(i * 337) % 100}%`, top: `${(i * 271) % 100}%`,
    dur: 2.5 + (i % 4), delay: (i % 5) * 0.6, size: 2 + (i % 3),
    color: ['#2dd4bf','#67e8f9','#34d399','#a5f3fc'][i % 4],
}));

const stagger = { show: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

/* ══ STAR RATING ══ */
function StarRating({ value, max, onChange }) {
    const [hover, setHover] = useState(null);
    const stars = Math.min(max, 10); // cap visual stars at 10
    const pct   = (hover ?? value) / max;

    return (
        <div>
            {/* Numeric input */}
            <div className="flex items-center gap-3 mb-2">
                <input
                    type="number" min="0" max={max}
                    value={value}
                    onChange={e => onChange(Math.min(max, Math.max(0, Number(e.target.value))))}
                    className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold
                               text-center focus:outline-none focus:ring-2 focus:ring-teal-400
                               focus:border-transparent transition-all duration-200"
                />
                <span className="text-xs text-gray-400">/ {max}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ width: `${(value / max) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full" />
                </div>
                <span className={`text-xs font-black tabular-nums
                    ${pct >= 0.8 ? 'text-emerald-600' : pct >= 0.5 ? 'text-teal-600' : 'text-amber-500'}`}>
                    {Math.round(pct * 100)}%
                </span>
            </div>
        </div>
    );
}

export default function ScoringShow({ event, submissions, criteria }) {
    const [selected, setSelected] = useState(null);

    return (
        <JuryLayout header={`Penilaian: ${event.title}`}>
            <Head title="Penilaian Karya" />

            {/* ── HERO BANNER ── */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-3xl mb-8
                           bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950
                           p-6 text-white shadow-2xl shadow-teal-950/40">
                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }} />
                <motion.div className="absolute w-56 h-56 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)', top: '-20%', right: '-5%', opacity: 0.18 }}
                    animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
                {PARTICLES.map(p => (
                    <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                        style={{ width: p.size, height: p.size, background: p.color, left: p.left, top: p.top }}
                        animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
                ))}
                <div className="relative z-10 flex justify-between items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3.5 h-3.5 text-teal-300" />
                            <span className="text-teal-300 text-xs font-semibold">Penilaian Karya</span>
                        </div>
                        <h1 className="text-xl font-black text-white leading-tight max-w-lg truncate">
                            {event.title}
                        </h1>
                        <p className="text-slate-300 text-xs mt-1">
                            {submissions.length} karya · {criteria.length} kriteria penilaian
                        </p>
                    </div>
                    <motion.div animate={{ rotate: [0, 8, -4, 0] }} transition={{ duration: 5, repeat: Infinity }}
                        className="hidden sm:block text-5xl shrink-0">⚖️</motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── SUBMISSION LIST ── */}
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="relative overflow-hidden px-6 py-4 border-b border-gray-100
                                    bg-gradient-to-r from-teal-600 to-cyan-600">
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                        }} />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <motion.div animate={{ rotate: [0, 10, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}
                                    className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="font-black text-white text-sm">Karya Peserta</h2>
                                    <p className="text-teal-200 text-[10px]">Klik untuk pilih karya yang akan dinilai</p>
                                </div>
                            </div>
                            <span className="bg-white/20 border border-white/30 text-white text-xs
                                             font-bold px-2.5 py-1 rounded-full">
                                {submissions.filter(s => s.my_scores_count > 0).length}/{submissions.length} dinilai
                            </span>
                        </div>
                    </div>

                    <div className="p-4 space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
                        {submissions.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                                    className="text-5xl mb-3">📭</motion.div>
                                <p className="text-sm">Belum ada karya yang dikirim.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {submissions.map((sub, i) => (
                                    <SubmissionCard key={sub.id} sub={sub} index={i}
                                        isSelected={selected?.id === sub.id}
                                        onSelect={() => setSelected(sub)} />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </motion.div>

                {/* ── SCORE FORM ── */}
                <div>
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key={selected.id}
                                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                                <ScoreForm submission={selected} criteria={criteria} event={event} />
                            </motion.div>
                        ) : (
                            <motion.div key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="hidden lg:flex bg-white rounded-3xl shadow-sm border-2
                                           border-dashed border-teal-200 items-center justify-center
                                           text-center p-12 h-full min-h-[300px]">
                                <div>
                                    <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, -3, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="text-5xl mb-4">📝</motion.div>
                                    <p className="font-bold text-gray-600 mb-1">Pilih Karya</p>
                                    <p className="text-sm text-gray-400">
                                        Pilih karya di sebelah kiri untuk mulai memberikan penilaian
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </JuryLayout>
    );
}

/* ══ SUBMISSION CARD ══ */
function SubmissionCard({ sub, index, isSelected, onSelect }) {
    const isScored = sub.my_scores_count > 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={onSelect}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.99 }}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                        ${isSelected
                            ? 'border-teal-400 bg-teal-50/60 shadow-md shadow-teal-100'
                            : 'border-gray-100 bg-white hover:border-teal-200 hover:shadow-sm'}`}>

            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm
                                 font-bold text-white shrink-0 shadow-sm
                                 ${isSelected
                                     ? 'bg-gradient-to-br from-teal-400 to-cyan-500'
                                     : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                    {sub.registration?.user?.name?.charAt(0).toUpperCase() ?? '?'}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{sub.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {sub.registration?.user?.name}
                        <span className="mx-1.5 text-gray-300">·</span>
                        {sub.registration?.category?.name}
                    </p>
                </div>

                {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}>
                        <ChevronRight className="w-4 h-4 text-teal-500 shrink-0" />
                    </motion.div>
                )}
            </div>

            <div className="mt-2.5">
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1
                                  rounded-full font-semibold border
                                  ${isScored
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    <motion.span animate={{ scale: isScored ? [1,1.3,1] : 1 }}
                        transition={{ duration: 1.5, repeat: isScored ? Infinity : 0 }}
                        className={`w-1.5 h-1.5 rounded-full ${isScored ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {isScored ? `Sudah Dinilai (${sub.my_scores_count})` : 'Belum Dinilai'}
                </span>
            </div>
        </motion.div>
    );
}

/* ══ SCORE FORM ══ */
function ScoreForm({ submission, criteria, event }) {
    const { data, setData, post, processing, wasSuccessful } = useForm({
        scores: criteria.map(c => ({
            criteria_id: c.id,
            score: 0,
            comment: '',
        })),
    });

    function submit(e) {
        e.preventDefault();
        post(route('jury.submissions.score', submission.id));
    }

    const totalWeighted = criteria.reduce((sum, c, i) => {
        return sum + (Number(data.scores[i]?.score) || 0) * c.weight;
    }, 0);
    const maxWeighted = criteria.reduce((sum, c) => sum + c.max_score * c.weight, 0);
    const overallPct  = maxWeighted > 0 ? Math.round((totalWeighted / maxWeighted) * 100) : 0;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-cyan-500" />

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl
                                    flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                        {submission.registration?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-black text-gray-800 text-base leading-tight truncate">
                            {submission.title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{submission.description}</p>
                    </div>
                </div>

                {/* Preview image */}
                {submission.photo_url && (
                    <motion.img
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={`/storage/${submission.photo_url}`}
                        alt="Foto karya"
                        className="rounded-2xl mt-4 w-full object-cover max-h-48
                                   border border-teal-100 shadow-sm hover:shadow-md
                                   hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                    />
                )}

                {/* Overall score preview */}
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${overallPct}%` }} transition={{ duration: 0.4 }}
                            className={`h-2 rounded-full bg-gradient-to-r
                                        ${overallPct >= 80 ? 'from-emerald-400 to-teal-500'
                                                           : 'from-teal-400 to-cyan-500'}`} />
                    </div>
                    <span className={`text-xs font-black tabular-nums
                        ${overallPct >= 80 ? 'text-emerald-600' : 'text-teal-600'}`}>
                        {overallPct}%
                    </span>
                    <span className="text-xs text-gray-400">skor tertimbang</span>
                </div>
            </div>

            {/* Criteria form */}
            <form onSubmit={submit} className="p-6 space-y-4">
                {criteria.map((criterion, i) => (
                    <motion.div key={criterion.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50
                                   hover:border-teal-200 hover:bg-teal-50/20 transition-all duration-200">
                        <label className="block text-xs font-black text-gray-700 mb-0.5 uppercase tracking-wide">
                            {criterion.name}
                        </label>
                        <p className="text-[10px] text-gray-400 mb-3">
                            Nilai maks: <span className="font-bold text-teal-600">{criterion.max_score}</span>
                            &nbsp;· Bobot: <span className="font-bold text-cyan-600">{criterion.weight}×</span>
                        </p>

                        <StarRating
                            value={Number(data.scores[i]?.score) || 0}
                            max={criterion.max_score}
                            onChange={(val) => {
                                const scores = [...data.scores];
                                scores[i] = { ...scores[i], score: val };
                                setData('scores', scores);
                            }}
                        />

                        <textarea
                            placeholder="Komentar opsional..."
                            value={data.scores[i]?.comment}
                            onChange={e => {
                                const scores = [...data.scores];
                                scores[i] = { ...scores[i], comment: e.target.value };
                                setData('scores', scores);
                            }}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mt-2
                                       text-xs focus:ring-2 focus:ring-teal-400 focus:border-transparent
                                       focus:bg-white outline-none transition-all duration-200
                                       placeholder:text-gray-300 resize-none bg-white"
                            rows={2} />
                    </motion.div>
                ))}

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={processing}
                    whileHover={!processing ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!processing ? { scale: 0.98 } : {}}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r
                               from-teal-500 to-cyan-500 text-white py-3 rounded-2xl font-bold
                               text-sm shadow-lg shadow-teal-200 hover:shadow-teal-300
                               disabled:opacity-60 disabled:cursor-not-allowed
                               transition-all duration-200 mt-2">
                    {processing ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Simpan Penilaian
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}