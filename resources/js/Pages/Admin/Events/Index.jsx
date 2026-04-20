import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

const STATUS_COLOR = {
    draft:    'bg-gray-100 text-gray-700',
    open:     'bg-green-100 text-green-700',
    closed:   'bg-yellow-100 text-yellow-700',
    ongoing:  'bg-blue-100 text-blue-700',
    finished: 'bg-purple-100 text-purple-700',
};

export default function EventsIndex({ events }) {
    function changeStatus(eventId, status) {
    router.patch(route('admin.events.status', eventId), {
        status: status
    });
}
    

    return (
        <AdminLayout header="Manajemen Event">
            <Head title="Event" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                    Total: <strong>{events.total}</strong> event
                </p>
                <Link
                    href={route('admin.events.create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm
                               hover:bg-blue-700 transition font-medium"
                >
                    + Buat Event Baru
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-600">Event</th>
                            <th className="p-4 text-left font-medium text-gray-600">Periode</th>
                            <th className="p-4 text-left font-medium text-gray-600">Peserta</th>
                            <th className="p-4 text-left font-medium text-gray-600">Status</th>
                            <th className="p-4 text-left font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.data.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{event.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        oleh {event.creator?.name}
                                    </p>
                                </td>
                                <td className="p-4 text-gray-600">
                                    <p>{event.event_start} s/d</p>
                                    <p>{event.event_end}</p>
                                </td>
                                <td className="p-4">
                                    <span className="font-semibold">{event.registrations_count}</span>
                                    {event.max_participants && (
                                        <span className="text-gray-400">
                                            /{event.max_participants}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={event.status}
                                        onChange={e => changeStatus(event.id, e.target.value)}
                                        className={`text-xs px-2 py-1 rounded-full font-medium
                                            border-0 cursor-pointer
                                            ${STATUS_COLOR[event.status]}`}
                                    >
                                        {['draft','open','closed','ongoing','finished'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
    <Link
        href={route('admin.events.edit', event.id)}
        className="text-blue-600 hover:underline text-xs"
    >
        Edit
    </Link>

    <Link
        href={route('admin.reports.leaderboard', event.id)}
        className="text-green-600 hover:underline text-xs"
    >
        Leaderboard
    </Link>

    <Link
        href={route('admin.jury.index', event.id)}
        className="text-purple-600 hover:underline text-xs"
    >
        Juri
    </Link>

    <button
        onClick={() => {
            if (confirm('Hapus event ini?')) {
                router.delete(route('admin.events.destroy', event.id));
            }
        }}
        className="text-red-500 hover:underline text-xs"
    >
        Hapus
    </button>
</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-4 flex justify-between items-center border-t text-sm text-gray-500">
                    <span>Halaman {events.current_page} dari {events.last_page}</span>
                    <div className="flex gap-2">
                        {events.prev_page_url && (
                            <Link href={events.prev_page_url}
                                className="px-3 py-1 border rounded hover:bg-gray-50">
                                ← Sebelumnya
                            </Link>
                        )}
                        {events.next_page_url && (
                            <Link href={events.next_page_url}
                                className="px-3 py-1 border rounded hover:bg-gray-50">
                                Selanjutnya →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}