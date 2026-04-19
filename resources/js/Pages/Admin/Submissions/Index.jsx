import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SubmissionsIndex({ submissions, events, filters }) {
    const [eventFilter, setEventFilter] = useState(filters.event_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [rejectModal, setRejectModal] = useState(null);

    function applyFilter() {
        router.get(route('admin.submissions.index'),
            { event_id: eventFilter, status: statusFilter },
            { preserveState: true });
    }

    function approve(id) {
        if (confirm('Setujui karya ini untuk dinilai juri?')) {
            router.patch(route('admin.submissions.approve', id));
        }
    }

    return (
        <AdminLayout header="Manajemen Karya">
            <Head title="Karya" />

            {/* Filter */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 items-end flex-wrap">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Filter Event</label>
                    <select className="border rounded-lg px-3 py-2 text-sm"
                        value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
                        <option value="">Semua Event</option>
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select className="border rounded-lg px-3 py-2 text-sm"
                        value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">Semua</option>
                        <option value="submitted">Dikirim</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <button onClick={applyFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm
                               hover:bg-blue-700 transition">
                    Terapkan Filter
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-600">Karya</th>
                            <th className="p-4 text-left font-medium text-gray-600">Peserta</th>
                            <th className="p-4 text-left font-medium text-gray-600">Event / Kategori</th>
                            <th className="p-4 text-left font-medium text-gray-600">Penilaian</th>
                            <th className="p-4 text-left font-medium text-gray-600">Status</th>
                            <th className="p-4 text-left font-medium text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    Belum ada karya yang dikirim.
                                </td>
                            </tr>
                        ) : submissions.data.map(sub => (
                            <tr key={sub.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{sub.title}</p>
                                    {sub.photo_url && (
                                        <img
                                            src={`/storage/${sub.photo_url}`}
                                            alt="foto karya"
                                            className="mt-1 w-16 h-12 object-cover rounded"
                                        />
                                    )}
                                </td>
                                <td className="p-4">
                                    <p className="font-medium">{sub.user.name}</p>
                                    <p className="text-xs text-gray-400">{sub.user.email}</p>
                                </td>
                                <td className="p-4 text-xs text-gray-600">
                                    <p>{sub.registration?.event?.title}</p>
                                    <p className="text-gray-400">{sub.registration?.category?.name}</p>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`text-sm font-bold ${
                                        sub.scores_count > 0 ? 'text-green-600' : 'text-gray-300'
                                    }`}>
                                        {sub.scores_count}
                                    </span>
                                    <p className="text-xs text-gray-400">penilaian</p>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={sub.status} />
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1.5">
                                        <Link
                                            href={route('admin.submissions.show', sub.id)}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Lihat Detail
                                        </Link>
                                        {sub.status === 'submitted' && (
                                            <>
                                                <button onClick={() => approve(sub.id)}
                                                    className="text-xs text-green-600 hover:underline text-left">
                                                    ✅ Setujui
                                                </button>
                                                <button
                                                    onClick={() => setRejectModal({
                                                        id: sub.id, title: sub.title
                                                    })}
                                                    className="text-xs text-red-500 hover:underline text-left">
                                                    ❌ Tolak
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {submissions.last_page > 1 && (
                    <div className="p-4 flex justify-between items-center border-t text-sm">
                        <span className="text-gray-500">
                            Halaman {submissions.current_page} dari {submissions.last_page}
                        </span>
                        <div className="flex gap-2">
                            {submissions.prev_page_url && (
                                <Link href={submissions.prev_page_url}
                                    className="px-3 py-1 border rounded hover:bg-gray-50">
                                    ← Sebelumnya
                                </Link>
                            )}
                            {submissions.next_page_url && (
                                <Link href={submissions.next_page_url}
                                    className="px-3 py-1 border rounded hover:bg-gray-50">
                                    Selanjutnya →
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tolak */}
            {rejectModal && (
                <RejectModal
                    title={rejectModal.title}
                    onConfirm={(reason) => {
                        router.patch(route('admin.submissions.reject', rejectModal.id),
                            { reason },
                            { onSuccess: () => setRejectModal(null) });
                    }}
                    onClose={() => setRejectModal(null)}
                />
            )}
        </AdminLayout>
    );
}

function RejectModal({ title, onConfirm, onClose }) {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h3 className="font-semibold text-gray-800 mb-1">Tolak Karya</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Karya <strong>"{title}"</strong> akan ditolak.
                </p>
                <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-4
                               focus:outline-none focus:ring-2 focus:ring-red-400"
                    rows={3} value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Alasan penolakan karya..."
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600
                                   hover:bg-gray-50">
                        Batal
                    </button>
                    <button
                        onClick={() => reason.trim() && onConfirm(reason)}
                        disabled={!reason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm
                                   hover:bg-red-700 disabled:opacity-50 transition"
                    >
                        Konfirmasi Tolak
                    </button>
                </div>
            </div>
        </div>
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
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.class}`}>
            {c.label}
        </span>
    );
}