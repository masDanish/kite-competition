import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function ResultsIndex({ results }) {
    return (
        <UserLayout header="Hasil Penilaian Saya">
            <Head title="Hasil" />

            {results.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">🏆</p>
                    <p>Belum ada hasil yang tersedia.</p>
                    <p className="text-sm mt-1">
                        Hasil akan muncul setelah event selesai dan penilaian selesai.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((result, idx) => (
                        <div key={idx}
                            className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {result.registration.event.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {result.registration.category.name}
                                    </p>
                                </div>
                                {result.rank && (
                                    <div className="text-center">
                                        <span className="text-3xl">
                                            {MEDAL[result.rank - 1] || `#${result.rank}`}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Peringkat {result.rank}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {result.submission ? (
                                <>
                                    <div className="border-t pt-4 mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            Karya: {result.submission.title}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl font-bold text-blue-600">
                                                {result.final_score ?? '-'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Skor Akhir (dari 100)
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown per kriteria */}
                                    {result.submission.scores?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                Detail Penilaian per Kriteria:
                                            </p>
                                            <div className="space-y-2">
                                                {Object.entries(
                                                    result.submission.scores.reduce((acc, s) => {
                                                        const key = s.criteria?.name || 'Lainnya';
                                                        if (!acc[key]) acc[key] = [];
                                                        acc[key].push(s.score);
                                                        return acc;
                                                    }, {})
                                                ).map(([name, scores]) => {
                                                    const avg = (scores.reduce((a, b) => a + b, 0)
                                                        / scores.length).toFixed(1);
                                                    return (
                                                        <div key={name}
                                                            className="flex items-center gap-3">
                                                            <span className="text-xs text-gray-600
                                                                             w-32 shrink-0">
                                                                {name}
                                                            </span>
                                                            <div className="flex-1 bg-gray-100
                                                                            rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-500 h-2
                                                                               rounded-full"
                                                                    style={{ width: `${avg}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium
                                                                             text-blue-600 w-10
                                                                             text-right">
                                                                {avg}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-400 border-t pt-4">
                                    Karya belum diupload.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}