import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';

export default function RegistrationCreate({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id:    event.id,
        category_id: '',
        team_name:   '',
        notes:       '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('user.registrations.store'));
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm " +
                       "focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <UserLayout header="Daftar Event">
            <Head title="Pendaftaran" />

            {/* Detail Event */}
            <div className="bg-white rounded-xl shadow p-6 mb-6 max-w-2xl">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h2>
                {event.location && (
                    <p className="text-sm text-gray-500 mb-3">📍 {event.location}</p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 border-t pt-3">
                    <div>
                        <p className="text-xs text-gray-400">Pendaftaran</p>
                        <p>{event.registration_start} s/d {event.registration_end}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Pelaksanaan</p>
                        <p>{event.event_start} s/d {event.event_end}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pilih Kategori *
                    </label>
                    <select className={inputClass} value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}>
                        <option value="">-- Pilih Kategori --</option>
                        {event.categories.map(cat => (
                            <option key={cat.id} value={cat.id}
                                disabled={cat.is_full}>
                                {cat.name}
                                {cat.max_participants
                                    ? ` (sisa ${cat.remaining_slot ?? '?'} slot)`
                                    : ''}
                                {cat.is_full ? ' — PENUH' : ''}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Tim (opsional)
                    </label>
                    <input className={inputClass} value={data.team_name}
                        onChange={e => setData('team_name', e.target.value)}
                        placeholder="Isi jika mengikuti sebagai tim" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan (opsional)
                    </label>
                    <textarea className={inputClass} rows={3} value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        placeholder="Pertanyaan atau informasi tambahan..." />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={processing || !data.category_id}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                                   hover:bg-blue-700 disabled:opacity-50 transition">
                        {processing ? 'Mendaftar...' : '✅ Kirim Pendaftaran'}
                    </button>
                    <a href={route('events.index')}
                        className="px-6 py-2.5 border rounded-lg text-sm text-gray-600
                                   hover:bg-gray-50 transition">
                        Batal
                    </a>
                </div>
            </form>
        </UserLayout>
    );
}