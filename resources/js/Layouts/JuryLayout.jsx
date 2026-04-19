import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { label: 'Dashboard', href: 'jury.dashboard',      icon: '🏠' },
    { label: 'Penilaian', href: 'jury.events.index',   icon: '📝' },
];

export default function JuryLayout({ children, header }) {
    const { auth, flash } = usePage().props;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <aside className="w-60 bg-teal-800 text-white flex flex-col shrink-0">
                <div className="px-5 py-5 border-b border-teal-700">
                    <p className="font-bold">🪁 Kite Competition</p>
                    <p className="text-teal-300 text-xs mt-0.5">Panel Juri</p>
                </div>
                <nav className="flex-1 py-4">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className={`flex items-center gap-3 px-5 py-3 text-sm transition
                                hover:bg-teal-700
                                ${route().current(item.href)
                                    ? 'bg-teal-600'
                                    : 'text-teal-100'}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-teal-700 text-sm text-teal-300">
                    <p className="font-medium text-white">{auth.user.name}</p>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="mt-2 text-teal-400 hover:text-white"
                    >
                        Keluar →
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm px-6 py-4">
                    <h1 className="text-lg font-semibold text-gray-700">{header}</h1>
                </header>

                {flash?.success && (
                    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200
                                    text-green-700 rounded-lg text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}