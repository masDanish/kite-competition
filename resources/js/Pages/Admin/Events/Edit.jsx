import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EventEdit({ event }) {
    const { data, setData, patch, processing, errors } = useForm({
        title:              event.title,
        description:        event.description,
        rules:              event.rules ?? '',
        location:           event.location ?? '',
        registration_start: event.registration_start,
        registration_end:   event.registration_end,
        event_start:        event.event_start,
        event_end:          event.event_end,
        max_participants:   event.max_participants ?? '',
        status:             event.status,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.events.update', event.id));
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm " +
                       "focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <AdminLayout header="Edit Event">
            <Head title="Edit Event" />

            <form onSubmit={submit} className="max-w-4xl space-y-6">

                {/* Informasi Dasar */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Informasi Event</h2>

                    <div>
                        <label className={labelClass}>Judul Event *</label>
                        <input className={inputClass} value={data.title}
                            onChange={e => setData('title', e.target.value)} />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Deskripsi *</label>
                        <textarea className={inputClass} rows={4} value={data.description}
                            onChange={e => setData('description', e.target.value)} />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Peraturan</label>
                        <textarea className={inputClass} rows={3} value={data.rules}
                            onChange={e => setData('rules', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Lokasi</label>
                            <input className={inputClass} value={data.location}
                                onChange={e => setData('location', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Maks. Peserta</label>
                            <input type="number" className={inputClass}
                                value={data.max_participants}
                                onChange={e => setData('max_participants', e.target.value)}
                                placeholder="Kosongkan jika tidak dibatasi" />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Status</label>
                        <select className={inputClass} value={data.status}
                            onChange={e => setData('status', e.target.value)}>
                            <option value="draft">Draft</option>
                            <option value="open">Open (Buka Pendaftaran)</option>
                            <option value="closed">Closed (Tutup Pendaftaran)</option>
                            <option value="ongoing">Ongoing (Sedang Berlangsung)</option>
                            <option value="finished">Finished (Selesai)</option>
                        </select>
                    </div>
                </div>

                {/* Periode */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Periode Event</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Mulai Pendaftaran *</label>
                            <input type="date" className={inputClass}
                                value={data.registration_start}
                                onChange={e => setData('registration_start', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Tutup Pendaftaran *</label>
                            <input type="date" className={inputClass}
                                value={data.registration_end}
                                onChange={e => setData('registration_end', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Mulai Event *</label>
                            <input type="date" className={inputClass}
                                value={data.event_start}
                                onChange={e => setData('event_start', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Selesai Event *</label>
                            <input type="date" className={inputClass}
                                value={data.event_end}
                                onChange={e => setData('event_end', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Kategori (read only di edit, tampilkan saja) */}
                {event.categories?.length > 0 && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-semibold text-gray-700 mb-3">
                            Kategori Terdaftar
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {event.categories.map(cat => (
                                <span key={cat.id}
                                    className="bg-blue-50 text-blue-700 text-sm px-3 py-1
                                               rounded-full border border-blue-200">
                                    {cat.name}
                                    {cat.max_participants && (
                                        <span className="text-blue-400 ml-1">
                                            (maks. {cat.max_participants})
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            * Untuk mengubah kategori, hubungi developer atau hapus dan buat event baru.
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button type="submit" disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                                   hover:bg-blue-700 disabled:opacity-50 transition">
                        {processing ? 'Menyimpan...' : '💾 Simpan Perubahan'}
                    </button>
                    <a href={route('admin.events.index')}
                        className="px-6 py-2.5 border rounded-lg text-sm text-gray-600
                                   hover:bg-gray-50 transition">
                        Batal
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}