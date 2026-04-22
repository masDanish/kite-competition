import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/Assets/logo.png';
import {
    LayoutDashboard, CalendarDays, Users, ClipboardList,
    Image, Megaphone, BarChart3, LogOut, ChevronLeft,
    Bell, Search, Menu
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
    const [collapsed, setCollapsed]   = useState(false);
    const [flashVisible, setFlash]    = useState(true);
    const [currentTime, setTime]      = useState(new Date());

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

            {/* ══ SIDEBAR ══ */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 256 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col shrink-0 overflow-hidden
                           bg-slate-900 border-r border-slate-700/50">

                {/* Sidebar glow */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b
                                from-indigo-600/20 to-transparent pointer-events-none" />

                {/* Logo */}
                <div className={`relative flex items-center border-b border-slate-700/50
                                 py-5 transition-all duration-300
                                 ${collapsed ? 'px-4 justify-center' : 'px-5 gap-3'}`}>
                    <motion.img
                        src={Logo}
                        animate={{ width: collapsed ? 32 : 40 }}
                        className="object-contain shrink-0 rounded-xl"
                    />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="leading-tight overflow-hidden">
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

                {/* Nav */}
                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-1 px-2">
                    {navItems.map((item) => {
                        const active = route().current(item.href);
                        return (
                            <Link key={item.href} href={route(item.href)}>
                                <motion.div
                                    whileHover={{ x: collapsed ? 0 : 4 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`relative flex items-center rounded-xl
                                        transition-all duration-200 cursor-pointer
                                        ${collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'}
                                        ${active
                                            ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50'
                                            : 'hover:bg-slate-800'}`}>

                                    {/* Active indicator */}
                                    {active && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2
                                                       w-1 h-6 bg-indigo-300 rounded-r-full"
                                        />
                                    )}

                                    <item.icon
                                        size={18}
                                        className={active ? 'text-white' : item.color}
                                    />

                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`text-sm font-medium whitespace-nowrap
                                                    ${active ? 'text-white' : 'text-slate-300'}`}>
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Tooltip when collapsed */}
                                    {collapsed && (
                                        <div className="absolute left-full ml-3 px-2 py-1
                                                        bg-slate-700 text-white text-xs rounded-lg
                                                        whitespace-nowrap opacity-0 group-hover:opacity-100
                                                        pointer-events-none transition-opacity z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="border-t border-slate-700/50 p-3 space-y-2">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 px-2 py-2 rounded-xl
                                       bg-slate-800 border border-slate-700/50">
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
                        </motion.div>
                    )}

                    <Link href={route('logout')} method="post" as="button" className="w-full">
                        <motion.div
                            whileHover={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center rounded-xl py-2.5 text-slate-400
                                        hover:text-red-400 transition-colors cursor-pointer
                                        ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}>
                            <LogOut size={17} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm font-medium">
                                        Keluar
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>
                </div>

                {/* Collapse toggle */}
                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border
                               border-slate-600 rounded-full flex items-center justify-center
                               text-slate-300 hover:text-white hover:bg-indigo-600
                               transition-colors z-10 shadow-lg">
                    <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronLeft size={12} />
                    </motion.div>
                </motion.button>
            </motion.aside>

            {/* ══ MAIN ══ */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="bg-white border-b border-gray-100 px-6 py-3.5
                                   flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-base font-bold text-gray-800">{header}</h1>
                            <p className="text-xs text-gray-400">
                                {greeting()}, {auth.user?.name?.split(' ')[0]} 👋
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Time */}
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-semibold text-gray-700">
                                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        <div className="w-px h-8 bg-gray-100" />

                        {/* Avatar */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500
                                            to-blue-600 flex items-center justify-center text-white
                                            text-sm font-bold shadow-md shadow-indigo-200">
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
                            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border
                                            border-emerald-200 text-emerald-800 rounded-xl text-sm
                                            font-medium shadow-sm">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center
                                                justify-center text-white text-xs shrink-0">✓</div>
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
                            <div className="flex items-center gap-3 p-3.5 bg-red-50 border
                                            border-red-200 text-red-800 rounded-xl text-sm
                                            font-medium shadow-sm">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center
                                                justify-center text-white text-xs shrink-0">✕</div>
                                {flash.error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <motion.div
                        key={header}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}>
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}