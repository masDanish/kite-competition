import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const STATUS_COLOR = {
    draft:    'bg-gray-100 text-gray-600',
    open:     'bg-green-100 text-green-700',
    closed:   'bg-yellow-100 text-yellow-700',
    ongoing:  'bg-blue-100 text-blue-700',
    finished: 'bg-purple-100 text-purple-700',
};

export default function ReportsIndex({ events }) {
    return (
        <AdminLayout header="Laporan & Statistik">
            <Head title="Laporan" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow p-5 text-center">
                    <p className="text-3xl font-bold text-blue-600">{events.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Event</p>
                </div>
                <div className="bg-white rounded-xl shadow p-5 text-center">
                    <p className="text-3xl font-bold text-green-600">
                        {events.filter(e => e.status === 'open').length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Event Aktif</p>
                </div>
                <div className="bg-white rounded-xl shadow p-5 text-center">
                    <p className="text-3xl font-bold text-purple-600">
                        {events.filter(e => e.status === 'finished').length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Event Selesai</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-700">Daftar Event & Statistik</h2>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-600">Event</th>
                            <th className="p-4 text-left font-medium text-gray-600">Status</th>
                            <th className="p-4 text-left font-medium text-gray-600">Peserta</th>
                            <th className="p-4 text-left font-medium text-gray-600">Juri</th>
                            <th className="p-4 text-left font-medium text-gray-600">Periode</th>
                            <th className="p-4 text-left font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    Belum ada event.
                                </td>
                            </tr>
                        ) : events.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{event.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {event.location ?? 'Lokasi belum ditentukan'}
                                    </p>
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${STATUS_COLOR[event.status]}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {event.registrations_count}
                                    {event.max_participants && (
                                        <span className="text-gray-400">
                                            /{event.max_participants}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600">
                                    {event.jury_assignments_count}
                                </td>
                                <td className="p-4 text-xs text-gray-500">
                                    <p>{event.event_start}</p>
                                    <p>s/d {event.event_end}</p>
                                </td>
                                <td className="p-4">
                                    <Link
                                        href={route('admin.reports.leaderboard', event.id)}
                                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5
                                                   rounded-lg hover:bg-blue-100 transition
                                                   font-medium whitespace-nowrap"
                                    >
                                        🏆 Leaderboard
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}