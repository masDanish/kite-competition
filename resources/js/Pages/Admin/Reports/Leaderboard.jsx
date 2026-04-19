import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ event, leaderboard, criteria, jury_count }) {
    return (
        <AdminLayout header={`Leaderboard: ${event.title}`}>
            <Head title="Leaderboard" />

            {/* Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{leaderboard.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Karya</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-3xl font-bold text-teal-600">{jury_count}</p>
                    <p className="text-sm text-gray-500 mt-1">Jumlah Juri</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">{criteria.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Kriteria Penilaian</p>
                </div>
            </div>

            {/* Podium Top 3 */}
            {leaderboard.length >= 3 && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl
                                border border-yellow-200 p-6 mb-6">
                    <h2 className="text-center font-bold text-gray-700 mb-4">🏆 Podium</h2>
                    <div className="flex justify-center items-end gap-6">
                        {/* 2nd */}
                        <div className="text-center">
                            <div className="bg-gray-200 rounded-t-lg w-24 h-20 flex items-end
                                            justify-center pb-2">
                                <span className="text-2xl">🥈</span>
                            </div>
                            <p className="text-sm font-medium mt-2">{leaderboard[1].user.name}</p>
                            <p className="text-xs text-gray-500">{leaderboard[1].final_score}</p>
                        </div>
                        {/* 1st */}
                        <div className="text-center">
                            <div className="bg-yellow-300 rounded-t-lg w-28 h-28 flex items-end
                                            justify-center pb-2">
                                <span className="text-3xl">🥇</span>
                            </div>
                            <p className="text-sm font-bold mt-2">{leaderboard[0].user.name}</p>
                            <p className="text-xs text-gray-500">{leaderboard[0].final_score}</p>
                        </div>
                        {/* 3rd */}
                        <div className="text-center">
                            <div className="bg-orange-200 rounded-t-lg w-24 h-14 flex items-end
                                            justify-center pb-2">
                                <span className="text-2xl">🥉</span>
                            </div>
                            <p className="text-sm font-medium mt-2">{leaderboard[2].user.name}</p>
                            <p className="text-xs text-gray-500">{leaderboard[2].final_score}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel lengkap */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-gray-700">Peringkat Lengkap</h2>
                    <a
                        href={route('admin.reports.export', event.id)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ⬇ Export CSV
                    </a>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left">Rank</th>
                            <th className="p-3 text-left">Peserta</th>
                            <th className="p-3 text-left">Kategori</th>
                            <th className="p-3 text-left">Karya</th>
                            <th className="p-3 text-right">Skor Akhir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leaderboard.map((item, idx) => (
                            <tr key={item.id}
                                className={`hover:bg-gray-50 ${idx < 3 ? 'bg-yellow-50' : ''}`}>
                                <td className="p-3 font-bold text-lg">
                                    {MEDAL[idx] || `#${idx + 1}`}
                                </td>
                                <td className="p-3 font-medium">{item.user.name}</td>
                                <td className="p-3 text-gray-500">{item.category?.name}</td>
                                <td className="p-3">{item.title}</td>
                                <td className="p-3 text-right font-bold text-blue-600">
                                    {item.final_score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}