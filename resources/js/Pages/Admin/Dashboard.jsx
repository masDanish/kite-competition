import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ stats, recentEvents, pendingRegistrations }) {
    return (
        <AdminLayout header="Dashboard Admin">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Event" value={stats.events} color="bg-blue-500" />
                <StatCard label="Total Peserta" value={stats.users} color="bg-green-500" />
                <StatCard label="Menunggu Approve" value={stats.pending} color="bg-yellow-500" />
                <StatCard label="Karya Dikirim" value={stats.submissions} color="bg-purple-500" />
            </div>

            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Pendaftaran Menunggu Persetujuan</h2>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left">Peserta</th>
                            <th className="p-3 text-left">Event</th>
                            <th className="p-3 text-left">Kategori</th>
                            <th className="p-3 text-left">Tanggal Daftar</th>
                            <th className="p-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRegistrations.map(reg => (
                            <tr key={reg.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{reg.user.name}</td>
                                <td className="p-3">{reg.event.title}</td>
                                <td className="p-3">{reg.category.name}</td>
                                <td className="p-3">
                                    {new Date(reg.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => router.patch(route('admin.registrations.approve', reg.id))}
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => {
                                            const reason = prompt("Alasan penolakan?");
                                            if (reason) {
                                                router.patch(
                                                    route('admin.registrations.reject', reg.id),
                                                    { reason }
                                                );
                                            }
                                        }}
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className={`${color} text-white rounded-xl p-5 shadow`}>
            <p className="text-sm opacity-80">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
    );
}