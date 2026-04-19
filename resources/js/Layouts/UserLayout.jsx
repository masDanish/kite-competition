import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { label: 'Dashboard',   href: 'user.dashboard',          icon: '🏠' },
    { label: 'Event',       href: 'events.index',            icon: '📅' },
    { label: 'Pendaftaran', href: 'user.registrations.index',icon: '📋' },
    { label: 'Hasil',       href: 'user.results.index',      icon: '🏆' },
    { label: 'Profil',      href: 'profile.edit',            icon: '👤' },
];

export default function UserLayout({ children, header }) {
    const { auth, flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar atas */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="font-bold text-lg text-blue-600">
                                🪁 Kite Competition
                            </Link>
                            <div className="hidden md:flex gap-1">
                                {navItems.map(item => (
                                    <Link
                                        key={item.href}
                                        href={route(item.href)}
                                        className={`px-3 py-2 rounded-lg text-sm transition
                                            ${route().current(item.href)
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{auth.user.name}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-500 hover:text-red-600"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Flash */}
            {(flash?.success || flash?.error || flash?.info) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    {flash.success && (
                        <div className="p-3 bg-green-50 border border-green-200
                                        text-green-700 rounded-lg text-sm">
                            ✅ {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="p-3 bg-red-50 border border-red-200
                                        text-red-700 rounded-lg text-sm">
                            ❌ {flash.error}
                        </div>
                    )}
                    {flash.info && (
                        <div className="p-3 bg-blue-50 border border-blue-200
                                        text-blue-700 rounded-lg text-sm">
                            ℹ️ {flash.info}
                        </div>
                    )}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {header && (
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">{header}</h1>
                )}
                {children}
            </main>
        </div>
    );
}