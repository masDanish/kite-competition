import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { label: 'Dashboard',      href: 'admin.dashboard',              icon: '🏠' },
    { label: 'Event',          href: 'admin.events.index',           icon: '📅' },
    { label: 'Pengguna',       href: 'admin.users.index',            icon: '👥' },
    { label: 'Pendaftaran',    href: 'admin.registrations.index',    icon: '📋' },
    { label: 'Karya',          href: 'admin.submissions.index',      icon: '🪁' },
    { label: 'Pengumuman',     href: 'admin.announcements.index',    icon: '📢' },
    { label: 'Laporan',        href: 'admin.reports.index',          icon: '📊' },
];

export default function AdminLayout({ children, header }) {
    const { auth = { user: null }, flash = {} } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white
                               flex flex-col transition-all duration-300 shrink-0`}>
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
                    <span className="text-2xl">🪁</span>
                    {sidebarOpen && (
                        <span className="font-bold text-sm leading-tight">
                            Kite Competition<br/>
                            <span className="text-gray-400 font-normal text-xs">Admin Panel</span>
                        </span>
                    )}
                </div>

                <nav className="flex-1 py-4 overflow-y-auto">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition
                                hover:bg-gray-700
                                ${route().current(item.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300'}`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-gray-700 p-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 text-sm text-gray-400 hover:text-white w-full"
                    >
                        <span>🚪</span>
                        {sidebarOpen && <span>Keluar</span>}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700"
                        >☰</button>
                        <h1 className="text-lg font-semibold text-gray-700">{header}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{auth.user.name}</span>
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white
                                        flex items-center justify-center text-sm font-bold">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200
                                    text-green-700 rounded-lg text-sm">
                        ✅ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200
                                    text-red-700 rounded-lg text-sm">
                        ❌ {flash.error}
                    </div>
                )}

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}