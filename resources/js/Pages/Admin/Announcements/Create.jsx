import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function AnnouncementsCreate({ events }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id:     '',
        title:        '',
        content:      '',
        type:         'info',
        is_published: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.announcements.store'));
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm " +
                       "focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <AdminLayout header="Buat Pengumuman">
            <Head title="Buat Pengumuman" />

            <form onSubmit={submit} className="max-w-2xl space-y-5">
                <div className="bg-white rounded-xl shadow p-6 space-y-4">

                    <div>
                        <label className={labelClass}>Event *</label>
                        <select className={inputClass} value={data.event_id}
                            onChange={e => setData('event_id', e.target.value)}>
                            <option value="">-- Pilih Event --</option>
                            {events.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.title}</option>
                            ))}
                        </select>
                        {errors.event_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.event_id}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Judul Pengumuman *</label>
                        <input className={inputClass} value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Contoh: Pengumuman Pemenang Lomba Layangan 2025" />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Isi Pengumuman *</label>
                        <textarea className={inputClass} rows={6} value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Tulis isi pengumuman di sini..." />
                        {errors.content && (
                            <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Tipe Pengumuman *</label>
                        <div className="flex gap-3 flex-wrap">
                            {[
                                { value: 'info',    label: 'ℹ️ Info',        color: 'bg-gray-100 border-gray-300'   },
                                { value: 'winner',  label: '🏆 Pemenang',    color: 'bg-yellow-100 border-yellow-400'},
                                { value: 'update',  label: '🔄 Update',      color: 'bg-blue-100 border-blue-400'   },
                                { value: 'warning', label: '⚠️ Peringatan',  color: 'bg-red-100 border-red-400'     },
                            ].map(opt => (
                                <label key={opt.value}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg
                                        border-2 cursor-pointer text-sm transition
                                        ${data.type === opt.value
                                            ? opt.color + ' border-opacity-100'
                                            : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="type" value={opt.value}
                                        checked={data.type === opt.value}
                                        onChange={() => setData('type', opt.value)}
                                        className="hidden" />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer"
                                checked={data.is_published}
                                onChange={e => setData('is_published', e.target.checked)} />
                            <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2
                                            peer-focus:ring-blue-300 rounded-full peer
                                            peer-checked:bg-blue-600 transition-all
                                            after:content-[''] after:absolute after:top-0.5
                                            after:left-0.5 after:bg-white after:rounded-full
                                            after:h-5 after:w-5 after:transition-all
                                            peer-checked:after:translate-x-4" />
                        </label>
                        <span className="text-sm text-gray-700">
                            {data.is_published
                                ? '✅ Langsung tayangkan setelah disimpan'
                                : 'Simpan sebagai draft dulu'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                                   hover:bg-blue-700 disabled:opacity-50 transition">
                        {processing ? 'Menyimpan...' : '💾 Simpan Pengumuman'}
                    </button>
                    <a href={route('admin.announcements.index')}
                        className="px-6 py-2.5 border rounded-lg text-sm text-gray-600
                                   hover:bg-gray-50 transition">
                        Batal
                    </a>
                </div>
            </form>
        </AdminLayout>
    );
}