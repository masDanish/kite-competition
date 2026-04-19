import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function JuryAssignmentsIndex({ event, availableJury }) {
    const assignments = event.jury_assignments ?? [];

    const { data, setData, post, processing, reset } = useForm({
        user_id:     '',
        category_id: '',
    });

    function assign(e) {
        e.preventDefault();
        post(route('admin.jury.assign', event.id), {
            onSuccess: () => reset(),
        });
    }

    function remove(assignmentId) {
        if (confirm('Hapus penugasan juri ini?')) {
            router.delete(route('admin.jury.destroy', assignmentId));
        }
    }

    function toggle(assignmentId) {
        router.patch(route('admin.jury.toggle', assignmentId));
    }

    return (
        <AdminLayout header={`Penugasan Juri — ${event.title}`}>
            <Head title="Penugasan Juri" />

            <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Form Assign */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">Tambah Juri</h2>
                    <form onSubmit={assign} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pilih Juri *
                            </label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.user_id}
                                onChange={e => setData('user_id', e.target.value)}
                            >
                                <option value="">-- Pilih Juri --</option>
                                {availableJury.map(j => (
                                    <option key={j.id} value={j.id}>{j.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori (opsional)
                            </label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 text-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                            >
                                <option value="">Semua Kategori</option>
                                {event.categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" disabled={processing || !data.user_id}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm
                                       hover:bg-blue-700 disabled:opacity-50 transition font-medium">
                            {processing ? 'Menugaskan...' : '+ Tugaskan Juri'}
                        </button>
                    </form>
                </div>

                {/* Daftar Juri Aktif */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">
                        Juri Ditugaskan
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({assignments.length} juri)
                        </span>
                    </h2>

                    {assignments.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">
                            Belum ada juri yang ditugaskan.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {assignments.map(a => (
                                <div key={a.id}
                                    className={`flex items-center justify-between p-3
                                        rounded-lg border transition
                                        ${a.is_active
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">
                                            {a.jury?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {a.category?.name ?? 'Semua Kategori'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full
                                            font-medium
                                            ${a.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-200 text-gray-500'}`}>
                                            {a.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                        <button onClick={() => toggle(a.id)}
                                            className="text-xs text-blue-600 hover:underline">
                                            {a.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                        </button>
                                        <button onClick={() => remove(a.id)}
                                            className="text-xs text-red-500 hover:underline">
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}