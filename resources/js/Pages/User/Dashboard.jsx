import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ registrations, announcements }) {
    return (
        <UserLayout header="Dashboard Saya">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pendaftaran saya */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">Pendaftaran Saya</h2>
                    {registrations.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>Belum ada pendaftaran.</p>
                            <Link href="/events" className="text-blue-600 hover:underline mt-2 block">
                                Lihat Event Tersedia →
                            </Link>
                        </div>
                    ) : (
                        registrations.map(reg => (
                            <div key={reg.id} className="border rounded-lg p-4 mb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{reg.event.title}</p>
                                        <p className="text-sm text-gray-500">{reg.category.name}</p>
                                    </div>
                                    <StatusBadge status={reg.status} />
                                </div>
                                {reg.status === 'approved' && !reg.submission && (
                                    <Link
                                        href={route('user.submissions.create', reg.id)}
                                        className="mt-3 block text-center bg-green-600 text-white
                                                   py-1.5 rounded-lg text-sm hover:bg-green-700"
                                    >
                                        Upload Karya Sekarang
                                    </Link>
                                )}
                                {reg.submission && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Karya: <span className="font-medium">{reg.submission.title}</span>
                                        <StatusBadge status={reg.submission.status} className="ml-2" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pengumuman */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">Pengumuman Terbaru</h2>
                    {announcements.map(a => (
                        <div key={a.id} className={`p-4 rounded-lg mb-3 border-l-4
                            ${a.type === 'winner' ? 'border-yellow-400 bg-yellow-50' :
                              a.type === 'warning' ? 'border-red-400 bg-red-50' :
                              'border-blue-400 bg-blue-50'}`}>
                            <p className="font-medium text-sm">{a.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{a.event.title}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(a.published_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}

function StatusBadge({ status }) {
    const config = {
        pending:   { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-800' },
        approved:  { label: 'Disetujui', class: 'bg-green-100 text-green-800' },
        rejected:  { label: 'Ditolak', class: 'bg-red-100 text-red-800' },
        submitted: { label: 'Dikirim', class: 'bg-blue-100 text-blue-800' },
        draft:     { label: 'Draft', class: 'bg-gray-100 text-gray-800' },
    };
    const c = config[status] || config.draft;
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.class}`}>
            {c.label}
        </span>
    );
}