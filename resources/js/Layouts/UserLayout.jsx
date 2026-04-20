import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from '@/Assets/logo.png';

const navItems = [
    { label: 'Dashboard', href: 'user.dashboard' },
    { label: 'Event', href: 'events.index' },
    { label: 'Pendaftaran', href: 'user.registrations.index' },
    { label: 'Hasil', href: 'user.results.index' },
    { label: 'Profil', href: 'profile.edit' },
];

export default function UserLayout({ children, header }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex h-16 justify-between items-center">

                        {/* LEFT */}
                        <div className="flex items-center gap-6">

                            <Link href="/" className="flex items-center gap-2">
                                <img src={Logo} className="w-12 h-12 object-contain" />
                                <span className="font-bold text-indigo-700">
                                    Kite Competition
                                </span>
                            </Link>

                            <div className="hidden md:flex gap-2 ml-6">
                                {navItems.map(item => (
                                    <Link
                                        key={item.href}
                                        href={route(item.href)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition
                                            ${route().current(item.href)
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">

                            {/* USER DROPDOWN */}
                            <div className="relative">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                                >
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-medium text-gray-800">
                                            {user?.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Peserta
                                        </div>
                                    </div>

                                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                                        {user?.name?.charAt(0)}
                                    </div>
                                </button>

                                {open && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden">
                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Profile
                                        </Link>

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* MOBILE BUTTON */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                ☰
                            </button>

                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {open && (
                    <div className="md:hidden border-t bg-white">
                        <div className="px-4 py-3 space-y-2">

                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t pt-3 mt-3">
                                <div className="text-sm font-medium">
                                    {user?.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.email}
                                </div>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                Logout
                            </Link>

                        </div>
                    </div>
                )}
            </nav>

            {/* FLASH */}
            {(flash?.success || flash?.error || flash?.info) && (
                <div className="max-w-7xl mx-auto px-6 mt-4">
                    {flash.success && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {flash.error}
                        </div>
                    )}
                    {flash.info && (
                        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                            {flash.info}
                        </div>
                    )}
                </div>
            )}

            {/* HEADER */}
            {header && (
                <header className="bg-white/60 backdrop-blur border-b">
                    <div className="max-w-7xl mx-auto px-6 py-5">
                        <h1 className="text-lg font-semibold text-gray-800">
                            {header}
                        </h1>
                    </div>
                </header>
            )}

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>

        </div>
    );
}