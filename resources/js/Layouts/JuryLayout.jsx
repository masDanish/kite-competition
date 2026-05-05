import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/Assets/logo.png';
import {
    LayoutDashboard, ClipboardCheck, LogOut,
    PanelLeftClose, PanelLeftOpen, Menu, X,
} from "lucide-react";

const navItems = [
    { label: 'Dashboard', href: 'jury.dashboard',    icon: LayoutDashboard, color: 'text-teal-400' },
    { label: 'Penilaian', href: 'jury.events.index', icon: ClipboardCheck,  color: 'text-cyan-400' },
];

export default function JuryLayout({ children, header }) {
    const { auth = { user: null }, flash = {} } = usePage().props;

    // Desktop: sidebar collapse
    const [collapsed, setCollapsed] = useState(false);
    // Mobile: drawer open/close
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [flashVisible, setFlash]    = useState(true);

    useEffect(() => {
        setFlash(true);
        const t = setTimeout(() => setFlash(false), 4000);
        return () => clearTimeout(t);
    }, [flash?.success, flash?.error]);

    // Close drawer on route change
    useEffect(() => { setDrawerOpen(false); }, [header]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

            {/* ══════════════════════════════════════
                MOBILE DRAWER OVERLAY
            ══════════════════════════════════════ */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col
                                       bg-gradient-to-b from-teal-900 to-slate-900
                                       border-r border-teal-800/40 lg:hidden">

                            <div className="absolute inset-0 bg-gradient-to-b from-teal-600/10
                                            to-transparent pointer-events-none" />

                            {/* Logo + close button */}
                            <div className="relative z-10 flex items-center justify-between
                                            px-4 py-4 border-b border-teal-800/40">
                                <div className="flex items-center gap-3">
                                    <img src={Logo} className="w-9 object-contain rounded-xl" alt="logo" />
                                    <div className="leading-tight">
                                        <p className="font-black text-white text-sm">Kite Competition</p>
                                        <p className="text-teal-400 text-[11px] font-medium">Panel Juri</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl
                                               text-slate-400 hover:text-white hover:bg-teal-800/50
                                               transition-all duration-200">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Nav */}
                            <nav className="relative z-10 flex-1 py-3 space-y-0.5 px-2 overflow-x-hidden">
                                {navItems.map((item) => {
                                    const active = route().current(item.href);
                                    return (
                                        <Link key={item.href} href={route(item.href)}
                                            onClick={() => setDrawerOpen(false)}>
                                            <motion.div
                                                whileTap={{ scale: 0.97 }}
                                                className={`relative flex items-center gap-3 px-3 py-3
                                                            rounded-xl transition-all duration-200 cursor-pointer
                                                            ${active
                                                                ? 'bg-teal-600 shadow-lg shadow-teal-900/40'
                                                                : 'hover:bg-teal-800/50'}`}>
                                                {active && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2
                                                                    w-1 h-6 bg-teal-300 rounded-r-full" />
                                                )}
                                                <item.icon size={18}
                                                    className={`shrink-0 ${active ? 'text-white' : item.color}`} />
                                                <span className={`text-sm font-medium
                                                    ${active ? 'text-white' : 'text-slate-300'}`}>
                                                    {item.label}
                                                </span>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* User + Logout */}
                            <div className="relative z-10 border-t border-teal-800/40 p-3 space-y-2">
                                <div className="flex items-center gap-3 px-2 py-2 rounded-xl
                                                bg-teal-800/30 border border-teal-700/30">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400
                                                    to-cyan-500 flex items-center justify-center
                                                    text-white text-sm font-bold shrink-0">
                                        {auth.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-semibold truncate">
                                            {auth.user?.name}
                                        </p>
                                        <p className="text-teal-400 text-xs">Juri</p>
                                    </div>
                                </div>

                                <Link href={route('logout')} method="post" as="button" className="w-full">
                                    <motion.div
                                        whileHover={{ backgroundColor: 'rgba(239,68,68,0.12)' }}
                                        whileTap={{ scale: 0.96 }}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                                   text-slate-400 hover:text-red-400
                                                   transition-all duration-200 cursor-pointer">
                                        <LogOut size={17} className="shrink-0" />
                                        <span className="text-sm font-medium">Keluar</span>
                                    </motion.div>
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════
                DESKTOP SIDEBAR
            ══════════════════════════════════════ */}
            <div className="relative shrink-0 hidden lg:flex" style={{ zIndex: 30 }}>
                <motion.aside
                    animate={{ width: collapsed ? 72 : 240 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col h-screen overflow-hidden
                               bg-gradient-to-b from-teal-900 to-slate-900
                               border-r border-teal-800/40">

                    <div className="absolute inset-0 bg-gradient-to-b from-teal-600/10
                                    to-transparent pointer-events-none" />

                    {/* Logo */}
                    <div className={`relative z-10 flex items-center border-b border-teal-800/40
                                     py-4 transition-all duration-300
                                     ${collapsed ? 'px-3 justify-center' : 'px-4 gap-3'}`}>
                        <motion.img
                            src={Logo}
                            animate={{ width: collapsed ? 34 : 38 }}
                            transition={{ duration: 0.3 }}
                            className="object-contain shrink-0 rounded-xl"
                        />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="leading-tight min-w-0">
                                    <p className="font-black text-white text-sm whitespace-nowrap">
                                        Kite Competition
                                    </p>
                                    <p className="text-teal-400 text-[11px] font-medium">Panel Juri</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Nav */}
                    <nav className="relative z-10 flex-1 py-3 space-y-0.5 px-2 overflow-x-hidden">
                        {navItems.map((item) => {
                            const active = route().current(item.href);
                            return (
                                <Link key={item.href} href={route(item.href)}>
                                    <motion.div
                                        whileHover={{ x: collapsed ? 0 : 3 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`relative flex items-center rounded-xl
                                            transition-all duration-200 cursor-pointer
                                            ${collapsed
                                                ? 'justify-center px-0 py-3'
                                                : 'gap-3 px-3 py-2.5'}
                                            ${active
                                                ? 'bg-teal-600 shadow-lg shadow-teal-900/40'
                                                : 'hover:bg-teal-800/50'}`}>
                                        {active && (
                                            <motion.div
                                                layoutId="juryActiveNav"
                                                className="absolute left-0 top-1/2 -translate-y-1/2
                                                           w-1 h-6 bg-teal-300 rounded-r-full"
                                            />
                                        )}
                                        <item.icon size={18}
                                            className={`shrink-0 ${active ? 'text-white' : item.color}`} />
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className={`text-sm font-medium whitespace-nowrap
                                                        ${active ? 'text-white' : 'text-slate-300'}`}>
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User + Logout */}
                    <div className="relative z-10 border-t border-teal-800/40 p-3 space-y-2">
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden">
                                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl
                                                    bg-teal-800/30 border border-teal-700/30 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br
                                                        from-teal-400 to-cyan-500 flex items-center
                                                        justify-center text-white text-sm font-bold shrink-0">
                                            {auth.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">
                                                {auth.user?.name}
                                            </p>
                                            <p className="text-teal-400 text-xs">Juri</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link href={route('logout')} method="post" as="button" className="w-full">
                            <motion.div
                                whileHover={{ backgroundColor: 'rgba(239,68,68,0.12)' }}
                                whileTap={{ scale: 0.96 }}
                                className={`flex items-center rounded-xl py-2.5 text-slate-400
                                            hover:text-red-400 transition-all duration-200 cursor-pointer
                                            ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}>
                                <LogOut size={17} className="shrink-0" />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-sm font-medium">
                                            Keluar
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    </div>
                </motion.aside>

                {/* Collapse toggle button */}
                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
                    className="absolute right-0 top-[70px] translate-x-1/2 z-50
                               w-8 h-8 rounded-full
                               bg-teal-800 border-2 border-teal-600
                               flex items-center justify-center shadow-xl shadow-black/30
                               text-teal-200 hover:text-white
                               hover:bg-teal-500 hover:border-teal-400
                               transition-all duration-200">
                    <AnimatePresence mode="wait">
                        {collapsed ? (
                            <motion.div key="open"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}>
                                <PanelLeftOpen size={14} />
                            </motion.div>
                        ) : (
                            <motion.div key="close"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.15 }}>
                                <PanelLeftClose size={14} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* ══════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════ */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Topbar */}
                <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-3.5
                                   flex items-center justify-between shadow-sm shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Hamburger — mobile only */}
                        <motion.button
                            onClick={() => setDrawerOpen(true)}
                            whileTap={{ scale: 0.9 }}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl
                                       bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600
                                       transition-all duration-200 shrink-0">
                            <Menu size={18} />
                        </motion.button>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                                {header}
                            </h1>
                            <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                                Panel Penilaian Juri
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal-400
                                        to-cyan-500 flex items-center justify-center text-white
                                        text-sm font-bold shadow-md shadow-teal-200 shrink-0">
                            {auth.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800 leading-none">
                                {auth.user?.name}
                            </p>
                            <p className="text-[11px] text-teal-500 font-medium mt-0.5">Juri</p>
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                <AnimatePresence>
                    {flashVisible && flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -16, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -16, height: 0 }}
                            className="mx-4 sm:mx-6 mt-3 sm:mt-4 overflow-hidden">
                            <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-emerald-50
                                            border border-emerald-200 text-emerald-800
                                            rounded-xl sm:rounded-2xl text-sm font-medium shadow-sm">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex
                                                items-center justify-center text-white
                                                text-xs shrink-0 font-bold">✓</div>
                                <span className="text-xs sm:text-sm">{flash.success}</span>
                            </div>
                        </motion.div>
                    )}
                    {flashVisible && flash?.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -16, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -16, height: 0 }}
                            className="mx-4 sm:mx-6 mt-3 sm:mt-4 overflow-hidden">
                            <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-red-50
                                            border border-red-200 text-red-800
                                            rounded-xl sm:rounded-2xl text-sm font-medium shadow-sm">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex
                                                items-center justify-center text-white
                                                text-xs shrink-0 font-bold">✕</div>
                                <span className="text-xs sm:text-sm">{flash.error}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content — extra bottom padding on mobile for bottom nav */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 pb-20 lg:pb-6">
                    <motion.div
                        key={header}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}>
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* ══════════════════════════════════════
                MOBILE BOTTOM NAV BAR
            ══════════════════════════════════════ */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden
                            bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
                            safe-area-inset-bottom">
                <div className="flex items-center justify-around px-2 py-1.5">
                    {navItems.map((item) => {
                        const active = route().current(item.href);
                        return (
                            <Link key={item.href} href={route(item.href)} className="flex-1">
                                <motion.div
                                    whileTap={{ scale: 0.92 }}
                                    className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-2xl
                                               transition-all duration-200">
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-2xl
                                                     transition-all duration-200
                                                     ${active
                                                         ? 'bg-teal-600 shadow-lg shadow-teal-200'
                                                         : 'bg-transparent'}`}>
                                        <item.icon size={18}
                                            className={active ? 'text-white' : 'text-gray-400'} />
                                    </div>
                                    <span className={`text-[10px] font-semibold transition-colors duration-200
                                                      ${active ? 'text-teal-600' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Logout in bottom nav */}
                    <Link href={route('logout')} method="post" as="button" className="flex-1">
                        <motion.div
                            whileTap={{ scale: 0.92 }}
                            className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-2xl
                                       transition-all duration-200">
                            <div className="w-10 h-10 flex items-center justify-center rounded-2xl">
                                <LogOut size={18} className="text-gray-400" />
                            </div>
                            <span className="text-[10px] font-semibold text-gray-400">Keluar</span>
                        </motion.div>
                    </Link>
                </div>
            </nav>
        </div>
    );
}