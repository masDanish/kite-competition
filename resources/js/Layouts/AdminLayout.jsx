import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/Assets/logo.png';
import {
    LayoutDashboard, CalendarDays, Users, ClipboardList,
    Image, Megaphone, BarChart3, LogOut,
    PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

const navItems = [
    { label: 'Dashboard',   href: 'admin.dashboard',           icon: LayoutDashboard, color: 'text-indigo-400' },
    { label: 'Event',       href: 'admin.events.index',        icon: CalendarDays,    color: 'text-blue-400'   },
    { label: 'Pengguna',    href: 'admin.users.index',         icon: Users,           color: 'text-violet-400' },
    { label: 'Pendaftaran', href: 'admin.registrations.index', icon: ClipboardList,   color: 'text-cyan-400'   },
    { label: 'Karya',       href: 'admin.submissions.index',   icon: Image,           color: 'text-teal-400'   },
    { label: 'Pengumuman',  href: 'admin.announcements.index', icon: Megaphone,       color: 'text-amber-400'  },
    { label: 'Laporan',     href: 'admin.reports.index',       icon: BarChart3,       color: 'text-emerald-400'},
];

export default function AdminLayout({ children, header }) {
    const { auth = { user: null }, flash = {} } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const [flashVisible, setFlash]  = useState(true);
    const [currentTime, setTime]    = useState(new Date());
    const [hoverNav, setHoverNav]   = useState(null);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        setFlash(true);
        const t = setTimeout(() => setFlash(false), 4000);
        return () => clearTimeout(t);
    }, [flash?.success, flash?.error]);

    const greeting = () => {
        const h = currentTime.getHours();
        if (h < 12) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

            {/* ══════════════════════════════════════
                SIDEBAR WRAPPER — overflow visible
                agar tombol collapse tidak terpotong
            ══════════════════════════════════════ */}
            <div className="relative shrink-0 flex" style={{ zIndex: 30 }}>
                <motion.aside
                    animate={{ width: collapsed ? 72 : 256 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col h-screen
                               bg-slate-900 border-r border-slate-700/50 overflow-hidden">

                    {/* Sidebar top glow */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b
                                    from-indigo-600/20 to-transparent pointer-events-none" />

                    {/* ── Logo ── */}
                    <div className={`relative z-10 flex items-center border-b border-slate-700/50
                                     py-4 transition-all duration-300
                                     ${collapsed ? 'px-3 justify-center' : 'px-4 gap-3'}`}>
                        <motion.img
                            src={Logo}
                            animate={{ width: collapsed ? 34 : 40 }}
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
                                    <p className="text-indigo-400 text-[11px] font-medium">
                                        Admin Panel
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Nav ── */}
                    <nav className="relative z-10 flex-1 py-3 space-y-0.5 px-2
                                    overflow-y-auto overflow-x-hidden">
                        {navItems.map((item) => {
                            const active = route().current(item.href);
                            return (
                                <div key={item.href} className="relative group/nav">
                                    <Link href={route(item.href)}>
                                        <motion.div
                                            whileHover={{ x: collapsed ? 0 : 3 }}
                                            whileTap={{ scale: 0.97 }}
                                            onHoverStart={() => setHoverNav(item.href)}
                                            onHoverEnd={() => setHoverNav(null)}
                                            className={`relative flex items-center rounded-xl
                                                transition-all duration-200 cursor-pointer
                                                ${collapsed
                                                    ? 'justify-center px-0 py-3'
                                                    : 'gap-3 px-3 py-2.5'}
                                                ${active
                                                    ? 'bg-indigo-600 shadow-lg shadow-indigo-900/40'
                                                    : 'hover:bg-slate-800/80'}`}>

                                            {/* Active bar kiri */}
                                            {active && (
                                                <motion.div
                                                    layoutId="adminActiveNav"
                                                    className="absolute left-0 top-1/2 -translate-y-1/2
                                                               w-1 h-6 bg-indigo-300 rounded-r-full"
                                                />
                                            )}

                                            <item.icon
                                                size={18}
                                                className={`shrink-0 transition-colors
                                                    ${active ? 'text-white' : item.color}`}
                                            />

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
                                </div>
                            );
                        })}
                    </nav>

                    {/* ── User info + Logout ── */}
                    <div className="relative z-10 border-t border-slate-700/50 p-3 space-y-2">
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden">
                                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl
                                                    bg-slate-800 border border-slate-700/50 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br
                                                        from-indigo-500 to-blue-600 flex items-center
                                                        justify-center text-white text-sm font-bold shrink-0">
                                            {auth.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">
                                                {auth.user?.name}
                                            </p>
                                            <p className="text-slate-400 text-xs">Administrator</p>
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

                {/* ══ TOMBOL COLLAPSE ══
                    Diletakkan di LUAR aside (sibling),
                    sehingga tidak terpotong overflow-hidden  */}
                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
                    className="absolute right-0 top-[70px] translate-x-1/2 z-50
                               w-8 h-8 rounded-full
                               bg-slate-800 border-2 border-slate-600
                               flex items-center justify-center shadow-xl shadow-black/30
                               text-slate-300 hover:text-white
                               hover:bg-indigo-600 hover:border-indigo-500
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
                <header className="bg-white border-b border-gray-100 px-6 py-3.5
                                   flex items-center justify-between shrink-0 shadow-sm">
                    <div>
                        <h1 className="text-base font-bold text-gray-800">{header}</h1>
                        <p className="text-xs text-gray-400">
                            {greeting()}, {auth.user?.name?.split(' ')[0]} 👋
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-semibold text-gray-700">
                                {currentTime.toLocaleTimeString('id-ID', {
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {currentTime.toLocaleDateString('id-ID', {
                                    weekday: 'long', day: 'numeric', month: 'long'
                                })}
                            </p>
                        </div>

                        <div className="w-px h-8 bg-gray-100 hidden md:block" />

                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br
                                            from-indigo-500 to-blue-600 flex items-center
                                            justify-center text-white text-sm font-bold
                                            shadow-md shadow-indigo-200 shrink-0">
                                {auth.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-gray-800 leading-none">
                                    {auth.user?.name}
                                </p>
                                <p className="text-[11px] text-indigo-500 font-medium mt-0.5">
                                    Administrator
                                </p>
                            </div>
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
                            className="mx-6 mt-4 overflow-hidden">
                            <div className="flex items-center gap-3 p-3.5 bg-emerald-50
                                            border border-emerald-200 text-emerald-800
                                            rounded-2xl text-sm font-medium shadow-sm">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex
                                                items-center justify-center text-white
                                                text-xs shrink-0 font-bold">✓</div>
                                {flash.success}
                            </div>
                        </motion.div>
                    )}
                    {flashVisible && flash?.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -16, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -16, height: 0 }}
                            className="mx-6 mt-4 overflow-hidden">
                            <div className="flex items-center gap-3 p-3.5 bg-red-50
                                            border border-red-200 text-red-800
                                            rounded-2xl text-sm font-medium shadow-sm">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex
                                                items-center justify-center text-white
                                                text-xs shrink-0 font-bold">✕</div>
                                {flash.error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <motion.div
                        key={header}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}>
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}