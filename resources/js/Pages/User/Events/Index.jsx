import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function EventsIndex({ events, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    function doSearch(e) {
        e.preventDefault();
        router.get(route('events.index'), { search }, { preserveState: true });
    }

    return (
        <UserLayout header="Event Tersedia">
            <Head title="Event" />

            <form onSubmit={doSearch} className="flex gap-3 mb-6">
                <input
                    className="flex-1 border rounded-lg px-4 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari event..."
                />
                <button type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Cari
                </button>
            </form>

            {events.data.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">🪁</p>
                    <p>Belum ada event yang tersedia saat ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.data.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
                {events.prev_page_url && (
                    <Link href={events.prev_page_url}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        ← Sebelumnya
                    </Link>
                )}
                {events.next_page_url && (
                    <Link href={events.next_page_url}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        Selanjutnya →
                    </Link>
                )}
            </div>
        </UserLayout>
    );
}

function EventCard({ event }) {
    const isOpen     = event.status === 'open';
    const daysLeft   = Math.ceil(
        (new Date(event.registration_end) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
            {event.poster ? (
                <img src={`/storage/${event.poster}`}
                    alt={event.title}
                    className="w-full h-44 object-cover" />
            ) : (
                <div className="w-full h-44 bg-gradient-to-br from-blue-400 to-blue-600
                                flex items-center justify-center text-5xl">
                    🪁
                </div>
            )}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 leading-tight">{event.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2
                        ${isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {event.status}
                    </span>
                </div>
                {event.location && (
                    <p className="text-xs text-gray-500 mb-2">📍 {event.location}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                    {event.categories?.map(cat => (
                        <span key={cat.id}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {cat.name}
                        </span>
                    ))}
                </div>
                {isOpen && daysLeft > 0 && (
                    <p className="text-xs text-orange-500 mb-3">
                        ⏳ Pendaftaran tutup dalam {daysLeft} hari
                    </p>
                )}
                <Link
                    href={route('user.registrations.create', event.id)}
                    className={`block text-center py-2 rounded-lg text-sm font-medium transition
                        ${isOpen
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                    {isOpen ? 'Daftar Sekarang' : 'Pendaftaran Ditutup'}
                </Link>
            </div>
        </div>
    );
}