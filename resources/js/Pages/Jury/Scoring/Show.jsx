import JuryLayout from '@/Layouts/JuryLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ScoringShow({ event, submissions, criteria }) {
    const [selected, setSelected] = useState(null);

    return (
        <JuryLayout header={`Penilaian: ${event.title}`}>
            <Head title="Penilaian Karya" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daftar karya */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">Karya Peserta</h2>
                    {submissions.map(sub => (
                        <div
                            key={sub.id}
                            onClick={() => setSelected(sub)}
                            className={`p-4 border rounded-lg mb-3 cursor-pointer transition
                                ${selected?.id === sub.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'hover:border-gray-300'}`}
                        >
                            <p className="font-medium">{sub.title}</p>
                            <p className="text-sm text-gray-500">
                                {sub.registration.user.name} — {sub.registration.category.name}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full
                                ${sub.my_scores_count > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'}`}>
                                {sub.my_scores_count > 0 ? 'Sudah Dinilai' : 'Belum Dinilai'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form penilaian */}
                {selected && (
                    <ScoreForm submission={selected} criteria={criteria} event={event} />
                )}
            </div>
        </JuryLayout>
    );
}

function ScoreForm({ submission, criteria, event }) {
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
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-lg mb-1">{submission.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{submission.description}</p>

            {submission.photo_url && (
                <img
                    src={`/storage/${submission.photo_url}`}
                    alt="Foto karya"
                    className="rounded-lg mb-4 w-full object-cover max-h-48"
                />
            )}

            <form onSubmit={submit}>
                {criteria.map((criterion, i) => (
                    <div key={criterion.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <label className="block font-medium text-sm mb-1">
                            {criterion.name}
                            <span className="text-gray-400 font-normal ml-1">
                                (Maks: {criterion.max_score}, Bobot: {criterion.weight}x)
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
                            className="w-full border rounded-lg p-2 mb-2"
                        />
                        <textarea
                            placeholder="Komentar (opsional)"
                            value={data.scores[i].comment}
                            onChange={e => {
                                const scores = [...data.scores];
                                scores[i].comment = e.target.value;
                                setData('scores', scores);
                            }}
                            className="w-full border rounded-lg p-2 text-sm"
                            rows={2}
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700
                               disabled:opacity-50 font-medium transition"
                >
                    {processing ? 'Menyimpan...' : 'Simpan Penilaian'}
                </button>
            </form>
        </div>
    );
}