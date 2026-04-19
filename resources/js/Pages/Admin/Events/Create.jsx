import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EventCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', description: '', rules: '', location: '',
        registration_start: '', registration_end: '',
        event_start: '', event_end: '',
        max_participants: '',
        poster: null,
        categories: [{ name: '', description: '', max_participants: '' }],
        criteria: [{ name: '', description: '', max_score: 100, weight: 1 }],
    });

    function addCategory() {
        setData('categories', [...data.categories,
            { name: '', description: '', max_participants: '' }]);
    }

    function removeCategory(i) {
        setData('categories', data.categories.filter((_, idx) => idx !== i));
    }

    function updateCategory(i, field, value) {
        const cats = [...data.categories];
        cats[i][field] = value;
        setData('categories', cats);
    }

    function addCriteria() {
        setData('criteria', [...data.criteria,
            { name: '', description: '', max_score: 100, weight: 1 }]);
    }

    function removeCriteria(i) {
        setData('criteria', data.criteria.filter((_, idx) => idx !== i));
    }

    function updateCriteria(i, field, value) {
        const crits = [...data.criteria];
        crits[i][field] = value;
        setData('criteria', crits);
    }

    function submit(e) {
        e.preventDefault();
        post(route('admin.events.store'));
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm " +
                       "focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <AdminLayout header="Buat Event Baru">
            <Head title="Buat Event" />

            <form onSubmit={submit} className="max-w-4xl space-y-6">
                {/* Informasi Dasar */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">Informasi Event</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className={labelClass}>Judul Event *</label>
                            <input className={inputClass} value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Contoh: Lomba Desain Layangan Nasional 2025" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Deskripsi *</label>
                            <textarea className={inputClass} rows={4} value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi lengkap event..." />
                        </div>
                        <div>
                            <label className={labelClass}>Peraturan</label>
                            <textarea className={inputClass} rows={3} value={data.rules}
                                onChange={e => setData('rules', e.target.value)}
                                placeholder="Peraturan dan syarat keikutsertaan..." />
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
                            <label className={labelClass}>Poster Event</label>
                            <input type="file" accept="image/*"
                                onChange={e => setData('poster', e.target.files[0])}
                                className="text-sm text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Periode */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-gray-700 mb-4">Periode Event</h2>
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

                {/* Kategori */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-700">Kategori Lomba *</h2>
                        <button type="button" onClick={addCategory}
                            className="text-sm text-blue-600 hover:underline">
                            + Tambah Kategori
                        </button>
                    </div>
                    {data.categories.map((cat, i) => (
                        <div key={i} className="border rounded-lg p-4 mb-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-600">
                                    Kategori {i + 1}
                                </span>
                                {data.categories.length > 1 && (
                                    <button type="button" onClick={() => removeCategory(i)}
                                        className="text-red-500 text-xs hover:underline">
                                        Hapus
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Nama Kategori *</label>
                                    <input className={inputClass} value={cat.name}
                                        onChange={e => updateCategory(i, 'name', e.target.value)}
                                        placeholder="Contoh: Junior, Senior, Umum" />
                                </div>
                                <div>
                                    <label className={labelClass}>Maks. Peserta</label>
                                    <input type="number" className={inputClass}
                                        value={cat.max_participants}
                                        onChange={e => updateCategory(i, 'max_participants', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass}>Deskripsi</label>
                                    <input className={inputClass} value={cat.description}
                                        onChange={e => updateCategory(i, 'description', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kriteria Penilaian */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-700">Kriteria Penilaian *</h2>
                        <button type="button" onClick={addCriteria}
                            className="text-sm text-blue-600 hover:underline">
                            + Tambah Kriteria
                        </button>
                    </div>
                    {data.criteria.map((crit, i) => (
                        <div key={i} className="border rounded-lg p-4 mb-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-600">
                                    Kriteria {i + 1}
                                </span>
                                {data.criteria.length > 1 && (
                                    <button type="button" onClick={() => removeCriteria(i)}
                                        className="text-red-500 text-xs hover:underline">
                                        Hapus
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <label className={labelClass}>Nama Kriteria *</label>
                                    <input className={inputClass} value={crit.name}
                                        onChange={e => updateCriteria(i, 'name', e.target.value)}
                                        placeholder="Contoh: Kreativitas" />
                                </div>
                                <div>
                                    <label className={labelClass}>Nilai Maks.</label>
                                    <input type="number" className={inputClass}
                                        value={crit.max_score} min="1" max="100"
                                        onChange={e => updateCriteria(i, 'max_score', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Bobot (×)</label>
                                    <input type="number" className={inputClass}
                                        value={crit.weight} min="0.1" step="0.1"
                                        onChange={e => updateCriteria(i, 'weight', e.target.value)} />
                                </div>
                                <div className="col-span-3">
                                    <label className={labelClass}>Deskripsi</label>
                                    <input className={inputClass} value={crit.description}
                                        onChange={e => updateCriteria(i, 'description', e.target.value)}
                                        placeholder="Penjelasan kriteria..." />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                                   hover:bg-blue-700 disabled:opacity-50 transition">
                        {processing ? 'Menyimpan...' : 'Simpan Event'}
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