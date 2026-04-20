import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Logo from '@/Assets/logo.png';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;

    const dashboardRoute =
        user?.role === 'admin'
            ? 'admin.dashboard'
            : user?.role === 'jury'
            ? 'jury.dashboard'
            : 'user.dashboard';

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
                                <div className="flex items-center gap-2">
    <img src={Logo} className="w-20 h-20" />
</div>
                                <span className="font-bold text-indigo-700">
                                    Kite Competition
                                </span>
                            </Link>

                            <div className="hidden sm:flex gap-6 ml-6">
                                <NavLink
                                    href={route(dashboardRoute)}
                                    active={route().current(dashboardRoute)}
                                >
                                    Dashboard
                                </NavLink>
                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">

                            {/* USER DROPDOWN */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                                        <div className="text-sm text-right hidden sm:block">
                                            <div className="font-medium text-gray-800">
                                                {user?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user?.role}
                                            </div>
                                        </div>

                                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* MOBILE BUTTON */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                ☰
                            </button>

                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {open && (
                    <div className="sm:hidden border-t bg-white">
                        <div className="px-4 py-3 space-y-2">

                            <ResponsiveNavLink href={route(dashboardRoute)}>
                                Dashboard
                            </ResponsiveNavLink>

                            <div className="border-t pt-3 mt-3">
                                <div className="text-sm font-medium">{user?.name}</div>
                                <div className="text-xs text-gray-500">{user?.email}</div>
                            </div>

                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>

                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>

                        </div>
                    </div>
                )}
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-white/60 backdrop-blur border-b">
                    <div className="max-w-7xl mx-auto px-6 py-5">
                        <div className="text-lg font-semibold text-gray-800">
                            {header}
                        </div>
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