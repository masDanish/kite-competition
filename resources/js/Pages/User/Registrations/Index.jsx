import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';

export default function RegistrationsIndex({ registrations }) {
    return (
        <UserLayout header="Pendaftaran Saya">
            <Head title="Pendaftaran Saya" />

            {registrations.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-gray-500 mb-4">Belum ada pendaftaran.</p>
                    <Link
                        href={route('events.index')}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg
                                   text-sm hover:bg-blue-700 transition"
                    >
                        Lihat Event Tersedia
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {registrations.map(reg => (
                        <div key={reg.id}
                            className="bg-white rounded-xl shadow p-5 flex justify-between
                                       items-start gap-4">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">
                                    {reg.event.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Kategori: {reg.category.name}
                                </p>
                                {reg.team_name && (
                                    <p className="text-sm text-gray-500">
                                        Tim: {reg.team_name}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    Didaftarkan:{' '}
                                    {new Date(reg.created_at).toLocaleDateString('id-ID')}
                                </p>

                                {/* Status karya */}
                                {reg.status === 'approved' && (
                                    reg.submission ? (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">
                                                Karya: {reg.submission.title}
                                            </p>
                                            <StatusBadge status={reg.submission.status} />
                                        </div>
                                    ) : (
                                        <Link
                                            href={route('user.submissions.create', reg.id)}
                                            className="mt-3 inline-block bg-green-600 text-white
                                                       px-4 py-2 rounded-lg text-sm
                                                       hover:bg-green-700 transition"
                                        >
                                            📤 Upload Karya Sekarang
                                        </Link>
                                    )
                                )}
                            </div>

                            <StatusBadge status={reg.status} />
                        </div>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}

function StatusBadge({ status }) {
    const config = {
        pending:   { label: 'Menunggu',  class: 'bg-yellow-100 text-yellow-800' },
        approved:  { label: 'Disetujui', class: 'bg-green-100 text-green-800'  },
        rejected:  { label: 'Ditolak',   class: 'bg-red-100 text-red-800'      },
        submitted: { label: 'Dikirim',   class: 'bg-blue-100 text-blue-800'    },
        draft:     { label: 'Draft',     class: 'bg-gray-100 text-gray-700'    },
        approved:  { label: 'Disetujui', class: 'bg-green-100 text-green-700'  },
    };
    const c = config[status] ?? config.draft;
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${c.class}`}>
            {c.label}
        </span>
    );
}