import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import Logo from '@/Assets/logo.png';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const dashboardRoute =
        user?.role === 'admin' ? 'admin.dashboard'
        : user?.role === 'jury' ? 'jury.dashboard'
        : 'user.dashboard';

    const roleColor = {
        admin: 'from-violet-500 to-purple-600',
        jury:  'from-amber-500 to-orange-500',
    }[user?.role] ?? 'from-indigo-500 to-blue-600';

    const roleBadge = {
        admin: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-400' },
        jury:  { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
    }[user?.role] ?? { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-400' };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">

            {/* ═══════════════════════════════════════
                FLOATING NAVBAR
            ═══════════════════════════════════════ */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="sticky top-0 z-50 px-4 pt-3 pb-2">

                <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl
                                border border-white/60 shadow-lg shadow-black/5
                                px-5 py-3 flex justify-between items-center">

                    {/* ── Left: Logo + Nav ── */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <motion.img
                                src={Logo}
                                className="w-9 h-9 object-contain"
                                whileHover={{ rotate: 8, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                            <div className="hidden sm:block">
                                <p className="font-black text-gray-900 text-sm leading-none">
                                    Kite Competition
                                </p>
                                <p className="text-[10px] text-indigo-500 font-medium leading-none mt-0.5">
                                    Design · Fly · Compete
                                </p>
                            </div>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavItem
                                href={route(dashboardRoute)}
                                active={route().current(dashboardRoute)}
                                icon={LayoutDashboard}>
                                Dashboard
                            </NavItem>
                        </div>
                    </div>

                    {/* ── Right: User + Mobile Toggle ── */}
                    <div className="flex items-center gap-3">

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl
                                               hover:bg-gray-50 border border-transparent
                                               hover:border-gray-200 transition-all duration-200 group">

                                    {/* Avatar */}
                                    <div className={`w-8 h-8 bg-gradient-to-br ${roleColor}
                                                     rounded-xl flex items-center justify-center
                                                     text-white text-sm font-bold shadow-md shrink-0`}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + role */}
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-bold text-gray-800 leading-none">
                                            {user?.name}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 text-[10px]
                                                          font-semibold mt-0.5 ${roleBadge.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`} />
                                            {user?.role ?? 'peserta'}
                                        </span>
                                    </div>

                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block
                                                            group-hover:text-gray-600 transition-colors" />
                                </motion.button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                {/* Header in dropdown */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                                </div>

                                <Dropdown.Link href={route('profile.edit')}>
                                    <span className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Profil Saya
                                    </span>
                                </Dropdown.Link>

                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    <span className="flex items-center gap-2 text-red-500">
                                        <LogOut className="w-3.5 h-3.5" /> Keluar
                                    </span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>

                        {/* Mobile hamburger */}
                        <motion.button
                            onClick={() => setMobileOpen(o => !o)}
                            whileTap={{ scale: 0.93 }}
                            className="md:hidden w-9 h-9 flex items-center justify-center
                                       rounded-xl bg-gray-100 hover:bg-gray-200
                                       text-gray-600 transition-colors">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div key={mobileOpen ? 'x' : 'menu'}
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.15 }}>
                                    {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-7xl mx-auto mt-2 bg-white/90 backdrop-blur-xl
                                       rounded-2xl border border-white/60 shadow-lg
                                       shadow-black/5 overflow-hidden">

                            {/* User info */}
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${roleColor}
                                                 rounded-xl flex items-center justify-center
                                                 text-white font-bold text-sm shadow-md`}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
                                    <p className="text-xs text-gray-400">{user?.email}</p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="p-3 space-y-1">
                                <MobileNavItem
                                    href={route(dashboardRoute)}
                                    icon={LayoutDashboard}
                                    onClick={() => setMobileOpen(false)}>
                                    Dashboard
                                </MobileNavItem>
                                <MobileNavItem
                                    href={route('profile.edit')}
                                    icon={User}
                                    onClick={() => setMobileOpen(false)}>
                                    Profil Saya
                                </MobileNavItem>
                            </div>

                            {/* Logout */}
                            <div className="px-3 pb-3">
                                <ResponsiveNavLink method="post" href={route('logout')} as="button"
                                    className="w-full flex items-center gap-2 px-4 py-2.5
                                               rounded-xl text-sm font-bold text-red-500
                                               hover:bg-red-50 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Keluar
                                </ResponsiveNavLink>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ═══════════════════════════════════════
                PAGE HEADER
            ═══════════════════════════════════════ */}
            {header && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="max-w-7xl mx-auto px-4 mt-4">
                    <div className="bg-white/60 backdrop-blur-sm border border-white/60
                                    rounded-2xl shadow-sm px-6 py-4">
                        <div className="text-base font-bold text-gray-800 flex items-center gap-2">
                            {header}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ═══════════════════════════════════════
                MAIN CONTENT
            ═══════════════════════════════════════ */}
            <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 py-6">
                {children}
            </motion.main>

        </div>
    );
}

/* ── Desktop nav item ── */
function NavItem({ href, active, icon: Icon, children }) {
    return (
        <Link href={href}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm
                        font-semibold transition-all duration-200
                        ${active
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            {children}
        </Link>
    );
}

/* ── Mobile nav item ── */
function MobileNavItem({ href, icon: Icon, children, onClick }) {
    return (
        <Link href={href} onClick={onClick}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm
                       font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50
                       transition-all duration-200">
            {Icon && <Icon className="w-4 h-4 shrink-0 text-gray-400" />}
            {children}
        </Link>
    );
}