import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Filter,
    Trash2,
    Shield,
    CalendarDays,
    Mail
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const ROLE_COLOR = {
    admin: 'bg-red-100 text-red-700',
    jury: 'bg-teal-100 text-teal-700',
    user: 'bg-blue-100 text-blue-700',
};

const inputClass =
    "border border-gray-200 rounded-2xl px-4 py-2.5 text-sm bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 " +
    "transition-all duration-200";

export default function UsersIndex({ users, filters }) {

    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    function applyFilter() {
        router.get(route('admin.users.index'),
            { search, role: roleFilter },
            { preserveState: true }
        );
    }

    function changeRole(userId, newRole) {
        if (confirm(`Ubah role menjadi "${newRole}"?`)) {
            router.patch(route('admin.users.role', userId), { role: newRole });
        }
    }

    return (
        <AdminLayout header="Manajemen Pengguna">
            <Head title="Pengguna" />

            {/* HERO */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl
                bg-gradient-to-br from-slate-800 via-indigo-900 to-blue-900
                p-6 mb-8 text-white"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm font-medium">
                                Panel Administrator
                            </span>
                        </div>
                        <h1 className="text-2xl font-black">
                            Manajemen Pengguna 👥
                        </h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Total{' '}
                            <span className="font-bold text-white">
                                {users.total}
                            </span>{' '}
                            pengguna terdaftar.
                        </p>
                    </div>

                    <div className="text-5xl hidden md:block">
                        👤
                    </div>
                </div>
            </motion.div>

            {/* FILTER */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6"
            >
                <div className="flex items-center gap-3 px-6 py-4 border-b">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Filter className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="font-bold text-gray-800">
                        Filter Pengguna
                    </h2>
                </div>

                <div className="p-6 flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-gray-500">
                            Cari
                        </label>
                        <input
                            className={`w-full ${inputClass}`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Nama / email..."
                        />
                    </div>

                    <div className="min-w-[160px]">
                        <label className="text-xs font-bold text-gray-500">
                            Role
                        </label>
                        <select
                            className={`w-full ${inputClass}`}
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                        >
                            <option value="">Semua</option>
                            <option value="admin">Admin</option>
                            <option value="jury">Juri</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <button
                        onClick={applyFilter}
                        className="bg-gradient-to-br from-indigo-600 to-blue-600
                        text-white px-5 py-2.5 rounded-2xl text-sm font-bold"
                    >
                        Terapkan
                    </button>
                </div>
            </motion.div>

            {/* TABLE */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div className="px-6 py-4 border-b font-bold text-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Daftar Pengguna
                </div>

                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Pengguna</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Registrasi</th>
                            <th className="p-4 text-left">Karya</th>
                            <th className="p-4 text-left">Bergabung</th>
                            <th className="p-4 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {users.data.map(user => (
                            <tr key={user.id} className="hover:bg-indigo-50/40">
                                <td className="p-4">
                                    <div className="font-semibold">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {user.email}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={e =>
                                            changeRole(user.id, e.target.value)
                                        }
                                        className={`text-xs px-3 py-1 rounded-full
                                        ${ROLE_COLOR[user.role]}`}
                                    >
                                        <option value="admin">admin</option>
                                        <option value="jury">jury</option>
                                        <option value="user">user</option>
                                    </select>
                                </td>

                                <td className="p-4">
                                    {user.registrations_count}
                                </td>

                                <td className="p-4">
                                    {user.submissions_count}
                                </td>

                                <td className="p-4 text-xs text-gray-500">
                                    {new Date(user.created_at)
                                        .toLocaleDateString('id-ID')}
                                </td>

                                <td className="p-4">
                                    <button
                                        onClick={() => {
                                            if (confirm(`Hapus ${user.name}?`)) {
                                                router.delete(
                                                    route('admin.users.destroy', user.id)
                                                );
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700
                                        text-xs flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

        </AdminLayout>
    );
}