import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_COLOR = {
    admin: 'bg-red-100 text-red-700',
    jury:  'bg-teal-100 text-teal-700',
    user:  'bg-blue-100 text-blue-700',
};

export default function UsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    function applyFilter() {
        router.get(route('admin.users.index'), { search, role: roleFilter },
            { preserveState: true });
    }

    function changeRole(userId, newRole) {
        if (confirm(`Ubah role menjadi "${newRole}"?`)) {
            router.patch(route('admin.users.role', userId), { role: newRole });
        }
    }

    return (
        <AdminLayout header="Manajemen Pengguna">
            <Head title="Pengguna" />

            {/* Filter */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 items-end">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Cari nama / email</label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilter()}
                        placeholder="Ketik nama atau email..."
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Role</label>
                    <select className="border rounded-lg px-3 py-2 text-sm"
                        value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="">Semua</option>
                        <option value="admin">Admin</option>
                        <option value="jury">Juri</option>
                        <option value="user">Peserta</option>
                    </select>
                </div>
                <button onClick={applyFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Cari
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left text-gray-600 font-medium">Pengguna</th>
                            <th className="p-4 text-left text-gray-600 font-medium">Role</th>
                            <th className="p-4 text-left text-gray-600 font-medium">Pendaftaran</th>
                            <th className="p-4 text-left text-gray-600 font-medium">Karya</th>
                            <th className="p-4 text-left text-gray-600 font-medium">Bergabung</th>
                            <th className="p-4 text-left text-gray-600 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.data.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={e => changeRole(user.id, e.target.value)}
                                        className={`text-xs px-2 py-1 rounded-full font-medium
                                            border-0 cursor-pointer ${ROLE_COLOR[user.role]}`}
                                    >
                                        <option value="admin">admin</option>
                                        <option value="jury">jury</option>
                                        <option value="user">user</option>
                                    </select>
                                </td>
                                <td className="p-4 text-gray-600">{user.registrations_count}</td>
                                <td className="p-4 text-gray-600">{user.submissions_count}</td>
                                <td className="p-4 text-gray-500 text-xs">
                                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => {
                                            if (confirm(`Hapus user ${user.name}?`)) {
                                                router.delete(route('admin.users.destroy', user.id));
                                            }
                                        }}
                                        className="text-red-500 hover:underline text-xs"
                                    >Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}