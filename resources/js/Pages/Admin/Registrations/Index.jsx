import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function RegistrationsIndex({ registrations, events, filters }) {
    const [eventFilter, setEventFilter] = useState(filters?.event_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');
    const [rejectModal, setRejectModal] = useState(null);

    function applyFilter() {
        router.get(route('admin.registrations.index'),
            { event_id: eventFilter, status: statusFilter },
            { preserveState: true, preserveScroll: true }
        );
    }

    function approve(id) {
        if (confirm('Setujui pendaftaran ini?')) {
            router.patch(route('admin.registrations.approve', id), {}, {
                preserveScroll: true
            });
        }
    }

    return (
        <AdminLayout header="Manajemen Pendaftaran">
            <Head title="Pendaftaran" />

            {/* Filter */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 items-end flex-wrap">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Filter Event</label>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={eventFilter}
                        onChange={e => setEventFilter(e.target.value)}
                    >
                        <option value="">Semua Event</option>
                        {events?.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                    </select>
                </div>

                <button
                    onClick={applyFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm
                               hover:bg-blue-700 transition"
                >
                    Terapkan Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left">Peserta</th>
                            <th className="p-4 text-left">Event</th>
                            <th className="p-4 text-left">Kategori</th>
                            <th className="p-4 text-left">Tim</th>
                            <th className="p-4 text-left">Tanggal Daftar</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {registrations?.data?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">
                                    Tidak ada data pendaftaran.
                                </td>
                            </tr>
                        )}

                        {registrations?.data?.map(reg => (
                            <tr key={reg.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-medium">{reg.user?.name}</p>
                                    <p className="text-xs text-gray-400">{reg.user?.email}</p>
                                </td>

                                <td className="p-4 text-gray-600 text-xs">
                                    {reg.event?.title}
                                </td>

                                <td className="p-4 text-gray-600 text-xs">
                                    {reg.category?.name}
                                </td>

                                <td className="p-4 text-gray-500 text-xs">
                                    {reg.team_name ?? '-'}
                                </td>

                                <td className="p-4 text-gray-500 text-xs">
                                    {new Date(reg.created_at).toLocaleDateString('id-ID')}
                                </td>

                                <td className="p-4">
                                    <StatusBadge status={reg.status} />
                                </td>

                                <td className="p-4">
                                    {reg.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approve(reg.id)}
                                                className="text-xs bg-green-100 text-green-700
                                                           px-3 py-1 rounded-lg hover:bg-green-200"
                                            >
                                                ✅ Setujui
                                            </button>

                                            <button
                                                onClick={() => setRejectModal({
                                                    id: reg.id,
                                                    name: reg.user?.name
                                                })}
                                                className="text-xs bg-red-100 text-red-700
                                                           px-3 py-1 rounded-lg hover:bg-red-200"
                                            >
                                                ❌ Tolak
                                            </button>
                                        </div>
                                    )}

                                    {reg.status === 'rejected' && reg.rejection_reason && (
                                        <p className="text-xs text-gray-400 italic max-w-xs">
                                            Alasan: {reg.rejection_reason}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {registrations?.last_page > 1 && (
                    <div className="p-4 flex justify-between items-center border-t text-sm">
                        <span className="text-gray-500">
                            Halaman {registrations.current_page} dari {registrations.last_page}
                        </span>

                        <div className="flex gap-2">
                            {registrations.prev_page_url && (
                                <Link
                                    href={registrations.prev_page_url}
                                    className="px-3 py-1 border rounded hover:bg-gray-50"
                                >
                                    ← Sebelumnya
                                </Link>
                            )}

                            {registrations.next_page_url && (
                                <Link
                                    href={registrations.next_page_url}
                                    className="px-3 py-1 border rounded hover:bg-gray-50"
                                >
                                    Selanjutnya →
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Reject */}
            {rejectModal && (
                <RejectModal
                    name={rejectModal.name}
                    onConfirm={(reason) => {
                        router.patch(
                            route('admin.registrations.reject', rejectModal.id),
                            { reason },
                            { onSuccess: () => setRejectModal(null) }
                        );
                    }}
                    onClose={() => setRejectModal(null)}
                />
            )}
        </AdminLayout>
    );
}

function RejectModal({ name, onConfirm, onClose }) {
    const [reason, setReason] = useState('');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h3 className="font-semibold mb-2">Tolak Pendaftaran</h3>

                <p className="text-sm text-gray-500 mb-4">
                    Pendaftaran dari <strong>{name}</strong> akan ditolak.
                </p>

                <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
                    rows={3}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Alasan penolakan..."
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        Batal
                    </button>

                    <button
                        disabled={!reason.trim()}
                        onClick={() => onConfirm(reason)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm
                                   disabled:opacity-50"
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        pending:  { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800' },
        approved: { label: 'Disetujui', class: 'bg-green-100 text-green-800' },
        rejected: { label: 'Ditolak',  class: 'bg-red-100 text-red-800' },
    };

    const c = config[status] ?? config.pending;

    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.class}`}>
            {c.label}
        </span>
    );
}