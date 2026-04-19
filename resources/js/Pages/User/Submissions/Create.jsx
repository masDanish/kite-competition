import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SubmissionCreate({ registration }) {
    const { data, setData, post, processing, errors } = useForm({
        registration_id: registration.id,
        title:           '',
        description:     '',
        design_file:     null,
        photo_url:       null,
        video_url:       '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('user.submissions.store'), {
            forceFormData: true,
        });
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm " +
                       "focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <UserLayout header="Upload Karya Layangan">
            <Head title="Upload Karya" />

            {/* Info pendaftaran */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-blue-800">{registration.event.title}</p>
                <p className="text-xs text-blue-600 mt-0.5">
                    Kategori: {registration.category.name}
                </p>
            </div>

            <form onSubmit={submit}
                className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-5">
                <div>
                    <label className={labelClass}>Judul Karya *</label>
                    <input className={inputClass} value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        placeholder="Nama desain layangan Anda" />
                    {errors.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Deskripsi Karya</label>
                    <textarea className={inputClass} rows={4} value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        placeholder="Ceritakan konsep dan keunikan desain layangan Anda..." />
                </div>

                <div>
                    <label className={labelClass}>File Desain (PDF/JPG/PNG, maks. 5MB)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setData('design_file', e.target.files[0])}
                        className="text-sm text-gray-500 w-full" />
                    {errors.design_file && (
                        <p className="text-red-500 text-xs mt-1">{errors.design_file}</p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>
                        Foto Karya *
                        <span className="text-gray-400 font-normal ml-1">(JPG/PNG, maks. 3MB)</span>
                    </label>
                    <input type="file" accept="image/*"
                        onChange={e => setData('photo_url', e.target.files[0])}
                        className="text-sm text-gray-500 w-full" />
                    {errors.photo_url && (
                        <p className="text-red-500 text-xs mt-1">{errors.photo_url}</p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Link Video (YouTube/Google Drive, opsional)</label>
                    <input className={inputClass} value={data.video_url}
                        onChange={e => setData('video_url', e.target.value)}
                        placeholder="https://youtube.com/..." />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={processing}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium
                                   hover:bg-green-700 disabled:opacity-50 transition">
                        {processing ? 'Mengunggah...' : '📤 Upload Karya'}
                    </button>
                    <a href={route('user.dashboard')}
                        className="px-6 py-2.5 border rounded-lg text-sm text-gray-600
                                   hover:bg-gray-50 transition">
                        Batal
                    </a>
                </div>
            </form>
        </UserLayout>
    );
}