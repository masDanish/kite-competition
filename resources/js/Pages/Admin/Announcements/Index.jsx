import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function AnnouncementsIndex({ announcements }) {
    return (
        <AdminLayout header="Pengumuman">
            <Head title="Pengumuman" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                    Total: <strong>{announcements.total}</strong> pengumuman
                </p>
                <Link
                    href={route('admin.announcements.create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm
                               hover:bg-blue-700 transition font-medium"
                >
                    + Buat Pengumuman
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-600">Judul</th>
                            <th className="p-4 text-left font-medium text-gray-600">Event</th>
                            <th className="p-4 text-left font-medium text-gray-600">Tipe</th>
                            <th className="p-4 text-left font-medium text-gray-600">Status</th>
                            <th className="p-4 text-left font-medium text-gray-600">Tanggal</th>
                            <th className="p-4 text-left font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {announcements.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    Belum ada pengumuman.
                                </td>
                            </tr>
                        ) : announcements.data.map(ann => (
                            <tr key={ann.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{ann.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                        {ann.content}
                                    </p>
                                </td>
                                <td className="p-4 text-gray-600 text-xs">
                                    {ann.event?.title ?? '-'}
                                </td>
                                <td className="p-4">
                                    <TypeBadge type={ann.type} />
                                </td>
                                <td className="p-4">
                                    {ann.is_published ? (
                                        <span className="text-xs bg-green-100 text-green-700
                                                         px-2 py-0.5 rounded-full font-medium">
                                            Tayang
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-gray-100 text-gray-600
                                                         px-2 py-0.5 rounded-full font-medium">
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-gray-500">
                                    {ann.published_at
                                        ? new Date(ann.published_at).toLocaleDateString('id-ID')
                                        : '-'}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-3">
                                        <Link
                                            href={route('admin.announcements.edit', ann.id)}
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                const action = ann.is_published
                                                    ? 'sembunyikan' : 'tayangkan';
                                                if (confirm(`${action} pengumuman ini?`)) {
                                                    router.patch(
                                                        ann.is_published
                                                            ? route('admin.announcements.unpublish', ann.id)
                                                            : route('admin.announcements.publish', ann.id)
                                                    );
                                                }
                                            }}
                                            className={`text-xs hover:underline ${
                                                ann.is_published
                                                    ? 'text-yellow-600'
                                                    : 'text-green-600'
                                            }`}
                                        >
                                            {ann.is_published ? 'Sembunyikan' : 'Tayangkan'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Hapus pengumuman ini?')) {
                                                    router.delete(
                                                        route('admin.announcements.destroy', ann.id)
                                                    );
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
                {announcements.last_page > 1 && (
                    <div className="p-4 flex justify-between items-center border-t
                                    text-sm text-gray-500">
                        <span>
                            Halaman {announcements.current_page} dari {announcements.last_page}
                        </span>
                        <div className="flex gap-2">
                            {announcements.prev_page_url && (
                                <Link href={announcements.prev_page_url}
                                    className="px-3 py-1 border rounded hover:bg-gray-50">
                                    ← Sebelumnya
                                </Link>
                            )}
                            {announcements.next_page_url && (
                                <Link href={announcements.next_page_url}
                                    className="px-3 py-1 border rounded hover:bg-gray-50">
                                    Selanjutnya →
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function TypeBadge({ type }) {
    const config = {
        winner:  { label: '🏆 Pemenang', class: 'bg-yellow-100 text-yellow-800' },
        update:  { label: '🔄 Update',   class: 'bg-blue-100 text-blue-700'    },
        warning: { label: '⚠️ Peringatan',class: 'bg-red-100 text-red-700'     },
        info:    { label: 'ℹ️ Info',      class: 'bg-gray-100 text-gray-700'    },
    };
    const c = config[type] ?? config.info;
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.class}`}>
            {c.label}
        </span>
    );
}