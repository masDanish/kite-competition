import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/Assets/logo.png';
import { LayoutDashboard, ClipboardCheck, LogOut, ChevronLeft } from "lucide-react";

const navItems = [
    { label: 'Dashboard', href: 'jury.dashboard',    icon: LayoutDashboard, color: 'text-teal-400'  },
    { label: 'Penilaian', href: 'jury.events.index', icon: ClipboardCheck,  color: 'text-cyan-400'  },
];

export default function JuryLayout({ children, header }) {
    const { auth = { user: null }, flash = {} } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const [flashVisible, setFlash]  = useState(true);

    useEffect(() => {
        setFlash(true);
        const t = setTimeout(() => setFlash(false), 4000);
        return () => clearTimeout(t);
    }, [flash?.success, flash?.error]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

            {/* ══ SIDEBAR ══ */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 240 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col shrink-0 overflow-hidden
                           bg-gradient-to-b from-teal-900 to-slate-900
                           border-r border-teal-800/40">

                <div className="absolute inset-0 bg-gradient-to-b from-teal-600/10
                                to-transparent pointer-events-none" />

                {/* Logo */}
                <div className={`relative flex items-center border-b border-teal-800/40
                                 py-5 transition-all duration-300
                                 ${collapsed ? 'px-4 justify-center' : 'px-5 gap-3'}`}>
                    <motion.img
                        src={Logo}
                        animate={{ width: collapsed ? 32 : 38 }}
                        className="object-contain shrink-0 rounded-xl"
                    />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}>
                                <p className="font-black text-white text-sm whitespace-nowrap">
                                    Kite Competition
                                </p>
                                <p className="text-teal-400 text-[11px] font-medium">
                                    Panel Juri
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2 overflow-x-hidden">
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
                                            ? 'bg-teal-600 shadow-lg shadow-teal-900/50'
                                            : 'hover:bg-teal-800/40'}`}>

                                    {active && (
                                        <motion.div layoutId="activeJuryNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2
                                                       w-1 h-6 bg-teal-300 rounded-r-full" />
                                    )}

                                    <item.icon size={18}
                                        className={active ? 'text-white' : item.color} />

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
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="border-t border-teal-800/40 p-3 space-y-2">
                    {!collapsed && (
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
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm font-medium">
                                        Keluar
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>
                </div>

                {/* Collapse button */}
                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="absolute -right-3 top-20 w-6 h-6 bg-teal-700 border
                               border-teal-600 rounded-full flex items-center justify-center
                               text-teal-200 hover:bg-teal-500 transition-colors z-10 shadow-lg">
                    <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronLeft size={12} />
                    </motion.div>
                </motion.button>
            </motion.aside>

            {/* ══ MAIN ══ */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Topbar */}
                <header className="bg-white border-b border-gray-100 px-6 py-3.5
                                   flex items-center justify-between shadow-sm shrink-0">
                    <div>
                        <h1 className="text-base font-bold text-gray-800">{header}</h1>
                        <p className="text-xs text-gray-400">Panel Penilaian Juri</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400
                                        to-cyan-500 flex items-center justify-center text-white
                                        text-sm font-bold shadow-md shadow-teal-200">
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

                {/* Flash */}
                <AnimatePresence>
                    {flashVisible && flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -16, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -16, height: 0 }}
                            className="mx-6 mt-4 overflow-hidden">
                            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border
                                            border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
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
                                            border-red-200 text-red-800 rounded-xl text-sm font-medium">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center
                                                justify-center text-white text-xs shrink-0">✕</div>
                                {flash.error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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