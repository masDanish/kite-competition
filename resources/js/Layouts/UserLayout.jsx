import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/Assets/logo.png';
import {
    LayoutDashboard, CalendarDays, ClipboardList,
    Trophy, User, LogOut, Menu, X, ChevronDown
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard',   href: 'user.dashboard',           icon: LayoutDashboard },
    { label: 'Event',       href: 'events.index',             icon: CalendarDays    },
    { label: 'Pendaftaran', href: 'user.registrations.index', icon: ClipboardList   },
    { label: 'Hasil',       href: 'user.results.index',       icon: Trophy          },
];

export default function UserLayout({ children, header }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const [mobileOpen, setMobileOpen]   = useState(false);
    const [dropdownOpen, setDropdown]   = useState(false);
    const [scrolled, setScrolled]       = useState(false);
    const [flashVisible, setFlash]      = useState(true);
    const dropRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        setFlash(true);
        const t = setTimeout(() => setFlash(false), 4000);
        return () => clearTimeout(t);
    }, [flash?.success, flash?.error, flash?.info]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* ══ NAVBAR ══ */}
            <motion.nav
                animate={{
                    boxShadow: scrolled
                        ? '0 4px 24px rgba(0,0,0,0.08)'
                        : '0 1px 0 rgba(0,0,0,0.06)',
                }}
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex h-14 sm:h-16 items-center justify-between gap-2">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
                            <img src={Logo} className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
                            <div className="hidden xs:block sm:block leading-tight">
                                <p className="font-black text-indigo-700 text-xs sm:text-sm whitespace-nowrap">
                                    Kite Competition
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                    Design • Fly • Compete
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
                            {navItems.map(item => {
                                const active = route().current(item.href);
                                return (
                                    <Link key={item.href} href={route(item.href)}>
                                        <motion.div
                                            whileHover={{ y: -1 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`relative flex items-center gap-1.5 px-3 lg:px-4 py-2
                                                        rounded-xl text-xs lg:text-sm font-semibold transition-all
                                                        duration-200
                                                ${active
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                                                }`}>
                                            <item.icon size={14} />
                                            <span className="hidden lg:inline">{item.label}</span>
                                            <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right: User dropdown + mobile toggle */}
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

                            {/* Desktop User Dropdown */}
                            <div ref={dropRef} className="relative hidden md:block">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setDropdown(!dropdownOpen)}
                                    className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-xl
                                               hover:bg-gray-100 transition-colors">
                                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br
                                                    from-indigo-500 to-blue-600 flex items-center
                                                    justify-center text-white text-xs font-bold
                                                    shadow-sm shadow-indigo-200 flex-shrink-0">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <p className="text-sm font-semibold text-gray-800 leading-none">
                                            {user?.name?.split(' ')[0]}
                                        </p>
                                        <p className="text-[10px] text-indigo-500 font-medium mt-0.5">
                                            Peserta
                                        </p>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="hidden lg:block">
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute right-0 mt-2 w-52 bg-white border
                                                       border-gray-100 rounded-2xl shadow-xl
                                                       shadow-black/10 overflow-hidden z-50">

                                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50
                                                            to-blue-50 border-b border-gray-100">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <div className="p-1.5">
                                                <Link href={route('profile.edit')}
                                                    onClick={() => setDropdown(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5
                                                               rounded-xl text-sm text-gray-700
                                                               hover:bg-gray-50 transition-colors">
                                                    <User size={15} className="text-indigo-400" />
                                                    Edit Profil
                                                </Link>
                                            </div>

                                            <div className="p-1.5 border-t border-gray-100">
                                                <Link href={route('logout')} method="post" as="button"
                                                    className="flex items-center gap-3 w-full px-3 py-2.5
                                                               rounded-xl text-sm text-red-600
                                                               hover:bg-red-50 transition-colors">
                                                    <LogOut size={15} />
                                                    Keluar
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <AnimatePresence mode="wait">
                                    {mobileOpen ? (
                                        <motion.div key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}>
                                            <X size={20} className="text-gray-600" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}>
                                            <Menu size={20} className="text-gray-600" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu — full overlay */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileOpen(false)}
                                className="fixed inset-0 top-14 bg-black/20 backdrop-blur-sm z-40 md:hidden" />

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="relative overflow-hidden border-t border-gray-100 bg-white md:hidden z-50 shadow-xl">
                                <div className="px-3 py-4 space-y-1">
                                    {navItems.map(item => (
                                        <Link key={item.href} href={route(item.href)}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl
                                                        text-sm font-semibold transition-colors
                                                ${route().current(item.href)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'}`}>
                                            <item.icon size={16} />
                                            {item.label}
                                        </Link>
                                    ))}

                                    <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
                                        <div className="px-4 py-2 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br
                                                            from-indigo-500 to-blue-600 flex items-center
                                                            justify-center text-white text-sm font-bold shrink-0">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Link href={route('profile.edit')}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                       text-sm text-gray-600 hover:bg-gray-100">
                                            <User size={16} /> Edit Profil
                                        </Link>
                                        <Link href={route('logout')} method="post" as="button"
                                            className="flex items-center gap-3 w-full px-4 py-3
                                                       rounded-xl text-sm text-red-600 hover:bg-red-50">
                                            <LogOut size={16} /> Keluar
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ══ FLASH MESSAGES ══ */}
            <AnimatePresence>
                {flashVisible && (flash?.success || flash?.error || flash?.info) && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mt-3 sm:mt-4">
                        {flash?.success && (
                            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border
                                            border-emerald-200 text-emerald-800 rounded-2xl text-sm
                                            font-medium shadow-sm">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center
                                                justify-center text-white text-xs shrink-0 mt-0.5">✓</div>
                                <span>{flash.success}</span>
                            </div>
                        )}
                        {flash?.error && (
                            <div className="flex items-start gap-3 p-3.5 bg-red-50 border
                                            border-red-200 text-red-800 rounded-2xl text-sm
                                            font-medium shadow-sm">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center
                                                justify-center text-white text-xs shrink-0 mt-0.5">✕</div>
                                <span>{flash.error}</span>
                            </div>
                        )}
                        {flash?.info && (
                            <div className="flex items-start gap-3 p-3.5 bg-blue-50 border
                                            border-blue-200 text-blue-800 rounded-2xl text-sm
                                            font-medium shadow-sm">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center
                                                justify-center text-white text-xs shrink-0 mt-0.5">ℹ</div>
                                <span>{flash.info}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ PAGE HEADER ══ */}
            {header && (
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mt-4 sm:mt-6">
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3">
                        <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-indigo-500 to-blue-600
                                        rounded-full shrink-0" />
                        <h1 className="text-lg sm:text-xl font-black text-gray-800">{header}</h1>
                    </motion.div>
                </div>
            )}

            {/* ══ CONTENT ══ */}
            <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-10 sm:pb-12">
                <motion.div
                    key={header}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}>
                    {children}
                </motion.div>
            </main>
        </div>
    );
}