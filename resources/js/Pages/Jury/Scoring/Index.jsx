import JuryLayout from '@/Layouts/JuryLayout';
import { Head, Link } from "@inertiajs/react";

export default function Index({ assignments }) {
    return (
        <JuryLayout header="Penilaian Juri">
            <Head title="Penilaian Juri" />

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-semibold text-gray-700 mb-4">
                    Event yang Perlu Dinilai
                </h2>

                {assignments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">
                        Belum ada penugasan event.
                    </p>
                ) : (
                    assignments.map(a => (
                        <div
                            key={a.id}
                            className="border rounded-lg p-4 mb-3 hover:border-teal-300 transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {a.event?.title}
                                    </p>

                                    {a.category && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Kategori: {a.category.name}
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={route(
                                        "jury.submissions.index",
                                        a.event.id
                                    )}
                                    className="bg-teal-600 text-white text-xs px-3 py-1.5
                                               rounded-lg hover:bg-teal-700 transition"
                                >
                                    Nilai Sekarang →
                                </Link>
                            </div>

                            {a.progress && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Progres Penilaian</span>
                                        <span>
                                            {a.progress.scored_submissions}/
                                            {a.progress.total_submissions} karya
                                            ({a.progress.percentage}%)
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-teal-500 h-2 rounded-full transition-all"
                                            style={{ width: `${a.progress.percentage}%` }}
                                        />
                                    </div>

                                    {a.progress.is_complete && (
                                        <p className="text-xs text-teal-600 mt-1 font-medium">
                                            ✓ Penilaian selesai
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </JuryLayout>
    );
}