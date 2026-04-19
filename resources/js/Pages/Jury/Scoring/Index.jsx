import { Head, Link } from "@inertiajs/react";

export default function Index({ assignments }) {
    return (
        <>
            <Head title="Penilaian Juri" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Daftar Penugasan Penilaian
                </h1>

                {assignments.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <p className="text-gray-500">
                            Belum ada penugasan penilaian.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="bg-white shadow rounded-xl p-6 border"
                            >
                                <h2 className="text-lg font-semibold mb-2">
                                    {assignment.event?.title}
                                </h2>

                                <p className="text-sm text-gray-600 mb-4">
                                    Kategori: {assignment.category?.name}
                                </p>

                                <Link
                                    href={route(
                                        "jury.submissions.index",
                                        assignment.event.id
                                    )}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Mulai Penilaian
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}