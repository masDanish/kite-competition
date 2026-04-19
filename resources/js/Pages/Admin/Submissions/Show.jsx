import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function SubmissionsShow({ submission }) {
    const reg      = submission.registration;
    const scores   = submission.scores ?? [];

    // Kelompokkan skor per kriteria
    const byKriteria = scores.reduce((acc, s) => {
        const name = s.criteria?.name ?? 'Lainnya';
        if (!acc[name]) acc[name] = [];
        acc[name].push(s);
        return acc;
    }, {});

    return (
        <AdminLayout header="Detail Karya">
            <Head title="Detail Karya" />

            <div className="max-w-4xl space-y-6">

                {/* Info Karya */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {submission.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                oleh <strong>{submission.user.name}</strong> —{' '}
                                {reg?.event?.title} ({reg?.category?.name})
                            </p>
                        </div>
                        <StatusBadge status={submission.status} />
                    </div>

                    {submission.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {submission.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                        {submission.photo_url && (
                            <a href={`/storage/${submission.photo_url}`}
                                target="_blank" rel="noreferrer">
                                <img
                                    src={`/storage/${submission.photo_url}`}
                                    alt="Foto karya"
                                    className="w-48 h-36 object-cover rounded-lg border
                                               hover:opacity-90 transition"
                                />
                            </a>
                        )}
                        {submission.design_file && (
                            <a href={`/storage/${submission.design_file}`}
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg
                                           text-sm text-blue-600 hover:bg-blue-50 transition">
                                📄 Lihat File Desain
                            </a>
                        )}
                        {submission.video_url && (
                            <a href={submission.video_url}
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg
                                           text-sm text-red-600 hover:bg-red-50 transition">
                                🎥 Lihat Video
                            </a>
                        )}
                    </div>
                </div>

                {/* Rekapitulasi Skor */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Rekapitulasi Penilaian
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({scores.length} penilaian diberikan)
                        </span>
                    </h3>

                    {Object.keys(byKriteria).length === 0 ? (
                        <p className="text-gray-400 text-sm">
                            Belum ada penilaian dari juri.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(byKriteria).map(([kriteria, list]) => {
                                const avg = (
                                    list.reduce((a, b) => a + b.score, 0) / list.length
                                ).toFixed(1);
                                return (
                                    <div key={kriteria}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">
                                                {kriteria}
                                            </span>
                                            <span className="font-bold text-blue-600">
                                                Rata-rata: {avg}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                style={{ width: `${avg}%` }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            {list.map((s, i) => (
                                                <div key={i}
                                                    className="flex items-start gap-3 text-xs
                                                               text-gray-600 bg-gray-50
                                                               rounded-lg px-3 py-2">
                                                    <span className="font-medium w-32 shrink-0">
                                                        {s.jury?.name ?? 'Juri'}
                                                    </span>
                                                    <span className="font-bold text-blue-700 w-8">
                                                        {s.score}
                                                    </span>
                                                    {s.comment && (
                                                        <span className="text-gray-400 italic">
                                                            "{s.comment}"
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <Link href={route('admin.submissions.index')}
                    className="inline-block px-5 py-2 border rounded-lg text-sm text-gray-600
                               hover:bg-gray-50 transition">
                    ← Kembali ke Daftar Karya
                </Link>
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ status }) {
    const config = {
        draft:     { label: 'Draft',     class: 'bg-gray-100 text-gray-700'   },
        submitted: { label: 'Dikirim',   class: 'bg-blue-100 text-blue-700'   },
        approved:  { label: 'Disetujui', class: 'bg-green-100 text-green-700' },
        rejected:  { label: 'Ditolak',   class: 'bg-red-100 text-red-700'     },
    };
    const c = config[status] ?? config.draft;
    return (
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${c.class}`}>
            {c.label}
        </span>
    );
}