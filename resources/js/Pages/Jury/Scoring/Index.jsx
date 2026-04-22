import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link } from "@inertiajs/react";
import { motion } from 'framer-motion';

export default function Index({ assignments }) {
    return (
        <JuryLayout header="Penilaian Juri">
            <Head title="Penilaian Juri" />

            <div className="bg-white/70 backdrop-blur rounded-xl border border-gray-100
                            shadow-sm p-6">
                <h2 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">
                    Event yang Perlu Dinilai
                </h2>

                {assignments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-10">
                        Belum ada penugasan event.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {assignments.map((a, i) => (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="border border-gray-100 rounded-xl p-4
                                           transition-all duration-200 bg-white/60
                                           hover:shadow-md hover:border-teal-200"
                            >
                                <div className="flex justify-between items-start gap-4">

                                    {/* INFO */}
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {a.event?.title}
                                        </p>
                                        {a.category && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Kategori:&nbsp;
                                                <span className="text-teal-600 font-medium">
                                                    {a.category.name}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {/* BUTTON */}
                                    <Link
                                        href={route("jury.submissions.index", a.event.id)}
                                        className="text-xs px-4 py-2 rounded-lg shrink-0
                                                   bg-teal-600 text-white font-medium
                                                   hover:bg-teal-700 transition shadow-sm
                                                   shadow-teal-200"
                                    >
                                        Nilai
                                    </Link>
                                </div>

                                {/* PROGRESS */}
                                {a.progress && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs
                                                        text-gray-400 mb-1.5">
                                            <span>Progres Penilaian</span>
                                            <span className="font-medium text-gray-600">
                                                {a.progress.scored_submissions}/
                                                {a.progress.total_submissions} karya
                                                &nbsp;({a.progress.percentage}%)
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-100 rounded-full
                                                        h-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${a.progress.percentage}%` }}
                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                className="bg-gradient-to-r from-teal-400
                                                           to-cyan-500 h-2 rounded-full"
                                            />
                                        </div>

                                        {a.progress.is_complete && (
                                            <p className="text-xs text-teal-600 mt-2 font-semibold
                                                          flex items-center gap-1">
                                                <span className="w-4 h-4 bg-teal-500 rounded-full
                                                                 flex items-center justify-center
                                                                 text-white text-[10px]">✓</span>
                                                Penilaian selesai
                                            </p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </JuryLayout>
    );
}