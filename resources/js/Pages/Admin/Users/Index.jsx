import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Filter, Trash2 } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const ROLE_COLOR = {
    admin: 'bg-red-100 text-red-700',
    jury:  'bg-teal-100 text-teal-700',
    user:  'bg-blue-100 text-blue-700',
};

const inputClass =
    "border border-gray-200 rounded-2xl px-4 py-2.5 text-sm bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400 " +
    "transition-all duration-200 w-full";

export default function UsersIndex({ users, filters }) {
    const [search,     setSearch]     = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role   || '');

    function applyFilter() {
        router.get(route('admin.users.index'),
            { search, role: roleFilter },
            { preserveState: true });
    }

    function changeRole(userId, newRole) {
        if (confirm(`Ubah role menjadi "${newRole}"?`)) {
            router.patch(route('admin.users.role', userId), { role: newRole });
        }
    }

    function deleteUser(user) {
        if (confirm(`Hapus ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    }

    return (
        <AdminLayout header="Manajemen Pengguna">
            <Head title="Pengguna" />

            {/* HERO */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl
                           bg-gradient-to-br from-slate-800 via-indigo-900 to-blue-900
                           p-5 sm:p-6 mb-6 sm:mb-8 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-white/5
                                    rounded-full translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/10
                                    rounded-full -translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 flex justify-between items-center gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-indigo-300 shrink-0" />
                            <span className="text-indigo-300 text-xs sm:text-sm font-medium">
                                Panel Administrator
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black">Manajemen Pengguna 👥</h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1">
                            Total{' '}
                            <span className="font-bold text-white">{users.total}</span>
                            {' '}pengguna terdaftar.
                        </p>
                    </div>
                    <div className="text-4xl sm:text-5xl hidden sm:block shrink-0">👤</div>
                </div>
            </motion.div>

            {/* FILTER */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-sm sm:text-base">Filter Pengguna</h2>
                </div>

                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Cari</label>
                        <input
                            className={inputClass}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilter()}
                            placeholder="Nama / email..."
                        />
                    </div>
                    <div className="sm:w-44">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Role</label>
                        <select
                            className={inputClass}
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}>
                            <option value="">Semua</option>
                            <option value="admin">Admin</option>
                            <option value="jury">Juri</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <button
                        onClick={applyFilter}
                        className="flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600
                                   to-blue-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold
                                   shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
                        <Filter className="w-4 h-4" /> Terapkan
                    </button>
                </div>
            </motion.div>

            {/* TABLE / CARDS */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b font-bold text-gray-800
                                flex items-center gap-2 text-sm sm:text-base">
                    <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                    Daftar Pengguna
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Pengguna', 'Role', 'Registrasi', 'Karya', 'Bergabung', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold
                                                            text-gray-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.data.map(user => (
                                <tr key={user.id} className="hover:bg-indigo-50/40 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400
                                                            to-blue-500 flex items-center justify-center text-white
                                                            text-xs font-bold shrink-0">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-gray-800 text-sm truncate">{user.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <select
                                            value={user.role}
                                            onChange={e => changeRole(user.id, e.target.value)}
                                            className={`text-xs px-3 py-1.5 rounded-full font-semibold
                                                        cursor-pointer ${ROLE_COLOR[user.role]}`}>
                                            <option value="admin">admin</option>
                                            <option value="jury">jury</option>
                                            <option value="user">user</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-600">{user.registrations_count}</td>
                                    <td className="px-4 py-3.5 text-sm text-gray-600">{user.submissions_count}</td>
                                    <td className="px-4 py-3.5 text-xs text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <button
                                            onClick={() => deleteUser(user)}
                                            className="text-red-500 hover:text-red-700 text-xs
                                                       flex items-center gap-1 hover:-translate-y-0.5
                                                       transition-all duration-200">
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-3">
                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <div className="text-5xl mb-3">👤</div>
                            <p className="text-sm">Belum ada pengguna.</p>
                        </div>
                    ) : (
                        users.data.map((user, i) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/40
                                           hover:border-indigo-200 transition-colors duration-200">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400
                                                    to-blue-500 flex items-center justify-center text-white
                                                    font-bold shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <select
                                        value={user.role}
                                        onChange={e => changeRole(user.id, e.target.value)}
                                        className={`text-xs px-2.5 py-1 rounded-full font-semibold
                                                    cursor-pointer shrink-0 ${ROLE_COLOR[user.role]}`}>
                                        <option value="admin">admin</option>
                                        <option value="jury">jury</option>
                                        <option value="user">user</option>
                                    </select>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        📋 <span className="font-semibold text-gray-700">{user.registrations_count}</span> registrasi
                                    </span>
                                    <span className="text-gray-300">·</span>
                                    <span className="flex items-center gap-1">
                                        🖼️ <span className="font-semibold text-gray-700">{user.submissions_count}</span> karya
                                    </span>
                                    <span className="text-gray-300">·</span>
                                    <span>{new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                                </div>

                                {/* Action */}
                                <button
                                    onClick={() => deleteUser(user)}
                                    className="flex items-center gap-1.5 text-xs text-red-500
                                               hover:text-red-700 font-semibold transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" /> Hapus Pengguna
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex justify-between
                                    items-center flex-wrap gap-3">
                        <span className="text-xs text-gray-400 font-medium">
                            Halaman <span className="text-gray-700 font-bold">{users.current_page}</span>
                            {' '}dari <span className="text-gray-700 font-bold">{users.last_page}</span>
                        </span>
                        <div className="flex gap-2">
                            {users.prev_page_url && (
                                <a href={users.prev_page_url}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200
                                               rounded-2xl text-xs font-semibold text-gray-600
                                               hover:border-indigo-300 hover:text-indigo-600
                                               hover:-translate-y-0.5 transition-all duration-200 bg-white shadow-sm">
                                    ← Sebelumnya
                                </a>
                            )}
                            {users.next_page_url && (
                                <a href={users.next_page_url}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200
                                               rounded-2xl text-xs font-semibold text-gray-600
                                               hover:border-indigo-300 hover:text-indigo-600
                                               hover:-translate-y-0.5 transition-all duration-200 bg-white shadow-sm">
                                    Selanjutnya →
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </AdminLayout>
    );
}