import JuryLayout from '@/Layouts/JuryLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoringShow({ event, submissions, criteria }) {
    const [selected, setSelected] = useState(null);

    return (
        <JuryLayout header={`Penilaian: ${event.title}`}>
            <Head title="Penilaian Karya" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LIST KARYA */}
                <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-100
                                shadow-sm p-6">
                    <h2 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">
                        Karya Peserta
                    </h2>

                    <div className="space-y-3">
                        {submissions.map((sub, i) => (
                            <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => setSelected(sub)}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.99 }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all
                                    duration-200
                                    ${selected?.id === sub.id
                                        ? 'border-teal-400 bg-teal-50/80 shadow-sm shadow-teal-100'
                                        : 'border-gray-100 bg-white/60 hover:border-teal-200 hover:shadow-sm'
                                    }`}
                            >
                                <p className="font-semibold text-gray-800 text-sm">
                                    {sub.title}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                    {sub.registration.user.name}
                                    <span className="mx-1.5 text-gray-300">·</span>
                                    {sub.registration.category.name}
                                </p>

                                <span className={`inline-flex items-center gap-1 mt-2
                                    text-xs px-2.5 py-1 rounded-full font-medium
                                    ${sub.my_scores_count > 0
                                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full
                                        ${sub.my_scores_count > 0
                                            ? 'bg-teal-500' : 'bg-amber-500'}`}
                                    />
                                    {sub.my_scores_count > 0 ? 'Sudah Dinilai' : 'Belum Dinilai'}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* FORM PANEL */}
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.25 }}
                        >
                            <ScoreForm
                                submission={selected}
                                criteria={criteria}
                                event={event}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty state */}
                {!selected && (
                    <div className="hidden lg:flex bg-white/50 backdrop-blur rounded-xl
                                    border border-dashed border-teal-200 items-center
                                    justify-center text-center p-10">
                        <div>
                            <div className="w-12 h-12 rounded-full bg-teal-50 border
                                            border-teal-200 flex items-center justify-center
                                            mx-auto mb-3">
                                <span className="text-teal-400 text-xl">←</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Pilih karya untuk mulai menilai
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </JuryLayout>
    );
}

function ScoreForm({ submission, criteria }) {
    const { data, setData, post, processing } = useForm({
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

    return (
        <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-100
                        shadow-sm p-6">

            {/* HEADER */}
            <h2 className="font-bold text-gray-800 text-base mb-0.5">
                {submission.title}
            </h2>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                {submission.description}
            </p>

            {/* IMAGE */}
            {submission.photo_url && (
                <img
                    src={`/storage/${submission.photo_url}`}
                    alt="Foto karya"
                    className="rounded-xl mb-4 w-full object-cover max-h-52
                               border border-teal-100 shadow-sm"
                />
            )}
            

            {/* FORM */}
            <form onSubmit={submit} className="space-y-3">

                {criteria.map((criterion, i) => (
                    <div
                        key={criterion.id}
                        className="p-4 rounded-xl bg-white/60 border border-gray-100
                                   hover:border-teal-100 transition"
                    >
                        <label className="block font-semibold text-xs text-gray-700 mb-2">
                            {criterion.name}
                            <span className="text-gray-400 font-normal ml-1.5">
                                (Maks: {criterion.max_score} · Bobot: {criterion.weight}×)
                            </span>
                        </label>

                        <input
                            type="number"
                            min="0"
                            max={criterion.max_score}
                            value={data.scores[i].score}
                            onChange={e => {
                                const scores = [...data.scores];
                                scores[i].score = e.target.value;
                                setData('scores', scores);
                            }}
                            className="w-full border border-gray-200 rounded-lg p-2 mb-2
                                       text-sm focus:ring-2 focus:ring-teal-400
                                       focus:border-teal-400 outline-none transition"
                        />

                        <textarea
                            placeholder="Komentar (opsional)"
                            value={data.scores[i].comment}
                            onChange={e => {
                                const scores = [...data.scores];
                                scores[i].comment = e.target.value;
                                setData('scores', scores);
                            }}
                            className="w-full border border-gray-200 rounded-lg p-2
                                       text-xs focus:ring-2 focus:ring-teal-400
                                       focus:border-teal-400 outline-none transition
                                       placeholder:text-gray-300 resize-none"
                            rows={2}
                        />
                    </div>
                ))}

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500
                               text-white py-2.5 rounded-xl font-semibold text-sm
                               hover:from-teal-600 hover:to-cyan-600
                               disabled:opacity-50 transition shadow-sm
                               shadow-teal-200 mt-1"
                >
                    {processing ? 'Menyimpan...' : 'Simpan Penilaian'}
                </button>
            </form>
        </div>
    );
}