import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import {
    CalendarDays, MapPin, Clock, Users, Tag,
    MessageSquare, CheckCircle2, AlertCircle,
    Sparkles, ChevronRight, Shield, Timer
} from 'lucide-react';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
    id: i, left:`${(i*337)%100}%`, top:`${(i*271)%100}%`,
    dur:2.5+(i%4), delay:(i%5)*0.6, size:2+(i%3),
    color:['#818cf8','#60a5fa','#34d399','#fbbf24','#f472b6'][i%5],
}));

function TiltCard({ children, className='', intensity=10 }) {
    const ref=useRef(null);
    const rotX=useSpring(0,{stiffness:250,damping:28});
    const rotY=useSpring(0,{stiffness:250,damping:28});
    const onMove=useCallback((e)=>{
        const r=ref.current?.getBoundingClientRect(); if(!r) return;
        rotX.set(-((e.clientY-r.top-r.height/2)/(r.height/2))*intensity);
        rotY.set(((e.clientX-r.left-r.width/2)/(r.width/2))*intensity);
    },[intensity]);
    const onLeave=useCallback(()=>{rotX.set(0);rotY.set(0);},[]);
    return (
        <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
            style={{rotateX:rotX,rotateY:rotY,transformStyle:'preserve-3d',perspective:700}}
            className={className}>
            {children}
        </motion.div>
    );
}

export default function RegistrationCreate({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id:    event.id,
        category_id: '',
        team_name:   '',
        notes:       '',
    });
    const [selectedCat, setSelectedCat] = useState(null);

    function handleCategoryChange(catId) {
        setData('category_id', catId);
        setSelectedCat(event.categories.find(c => c.id == catId) ?? null);
    }
    function submit(e) { e.preventDefault(); post(route('user.registrations.store')); }

    const inputClass = `w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm
                        text-gray-800 bg-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-400
                        focus:border-transparent transition-all duration-200`;

    const daysLeft = Math.ceil(
        (new Date(event.registration_end) - new Date()) / (1000*60*60*24)
    );

    return (
        <UserLayout header="Daftar Event">
            <Head title="Pendaftaran Event" />

            {/* ── HERO BANNER ── */}
            <motion.div
                initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.7 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-5 sm:mb-8
                           bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                           p-5 sm:p-7 text-white shadow-2xl shadow-indigo-950/40">

                <div className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:`linear-gradient(rgba(99,102,241,0.5) 1px,transparent 1px),
                                         linear-gradient(90deg,rgba(99,102,241,0.5) 1px,transparent 1px)`,
                        backgroundSize:'40px 40px'
                    }}/>
                <motion.div className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full pointer-events-none"
                    style={{background:'radial-gradient(circle,#6366f1 0%,transparent 70%)',
                            top:'-20%',right:'-5%',opacity:0.2}}
                    animate={{scale:[1,1.4,1]}} transition={{duration:7,repeat:Infinity}}/>
                {PARTICLES.map(p => (
                    <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                        style={{width:p.size,height:p.size,background:p.color,left:p.left,top:p.top}}
                        animate={{y:[0,-18,0],opacity:[0.2,0.8,0.2]}}
                        transition={{duration:p.dur,repeat:Infinity,delay:p.delay}}/>
                ))}

                <div className="relative z-10 flex justify-between items-start gap-4 sm:gap-5">
                    <div className="flex-1 min-w-0">
                        <motion.div initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.2}}
                            className="inline-flex items-center gap-2 bg-indigo-500/20
                                       border border-indigo-400/30 text-indigo-300 text-xs
                                       font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300"/>
                            Pendaftaran Event
                        </motion.div>
                        <motion.h1 initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.3}}
                            className="text-lg sm:text-xl md:text-2xl font-black leading-tight mb-2">
                            {event.title}
                        </motion.h1>
                        <motion.div initial={{opacity:0}} animate={{opacity:1}}
                            transition={{delay:0.4}}
                            className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                            {event.location && (
                                <span className="flex items-center gap-1.5 text-indigo-200 text-xs sm:text-sm">
                                    <MapPin className="w-3.5 h-3.5"/> {event.location}
                                </span>
                            )}
                            {daysLeft > 0 && (
                                <span className="flex items-center gap-1.5 bg-white/20
                                                 text-white font-semibold px-2.5 sm:px-3 py-1 rounded-full
                                                 text-xs backdrop-blur-sm">
                                    <Timer className="w-3 h-3"/> Tutup {daysLeft} hari lagi
                                </span>
                            )}
                        </motion.div>
                    </div>
                    <motion.div animate={{rotate:[0,8,-4,0],y:[0,-10,0]}}
                        transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}
                        className="hidden sm:block shrink-0">
                        <svg width="64" height="78" viewBox="0 0 100 120" fill="none">
                            <defs>
                                <linearGradient id="kg-rc" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#818cf8"/>
                                    <stop offset="100%" stopColor="#60a5fa"/>
                                </linearGradient>
                                <filter id="ks-rc">
                                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#6366f1" floodOpacity="0.5"/>
                                </filter>
                            </defs>
                            <polygon points="50,5 95,50 50,85 5,50" fill="url(#kg-rc)" filter="url(#ks-rc)"/>
                            <line x1="50" y1="5" x2="50" y2="85" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <path d="M50 85 Q45 97 50 108 Q55 117 50 120" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                        </svg>
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* ── INFO SIDEBAR ── (shows below on mobile via order) */}
                <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                    transition={{duration:0.6,delay:0.15}}
                    className="lg:order-none order-last space-y-3 sm:space-y-4">

                    {/* Detail Event */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600
                                            rounded-lg flex items-center justify-center shadow-sm">
                                <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"/>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base">Detail Event</h3>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                            <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-indigo-50
                                            rounded-xl sm:rounded-2xl border border-indigo-100">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 mt-0.5 shrink-0"/>
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-indigo-700 mb-0.5">Pendaftaran</p>
                                    <p className="text-xs sm:text-sm text-indigo-800 font-medium">
                                        {new Date(event.registration_start).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}
                                        {' — '}
                                        {new Date(event.registration_end).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-emerald-50
                                            rounded-xl sm:rounded-2xl border border-emerald-100">
                                <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 shrink-0"/>
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-emerald-700 mb-0.5">Pelaksanaan</p>
                                    <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                                        {new Date(event.event_start).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}
                                        {' — '}
                                        {new Date(event.event_end).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kategori list */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-violet-500 to-purple-600
                                            rounded-lg flex items-center justify-center shadow-sm">
                                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"/>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base">Kategori</h3>
                        </div>
                        <div className="space-y-2">
                            {event.categories.map(cat => (
                                <div key={cat.id}
                                    className={`flex items-center justify-between p-2.5 sm:p-3
                                                rounded-xl sm:rounded-2xl border transition-all duration-200
                                        ${cat.is_full
                                            ? 'bg-gray-50 border-gray-100 opacity-60'
                                            : selectedCat?.id === cat.id
                                                ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                                : 'bg-gray-50 border-gray-100'}`}>
                                    <div>
                                        <p className={`text-xs sm:text-sm font-semibold ${cat.is_full?'text-gray-400':'text-gray-800'}`}>
                                            {cat.name}
                                        </p>
                                        {cat.max_participants && (
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                                                {cat.is_full ? 'Slot penuh' : `Sisa ${cat.remaining_slot??'?'} slot`}
                                            </p>
                                        )}
                                    </div>
                                    {cat.is_full ? (
                                        <span className="text-[9px] sm:text-[10px] bg-red-100 text-red-600 font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                                            PENUH
                                        </span>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-indigo-300 flex items-center justify-center">
                                            {selectedCat?.id === cat.id && (
                                                <motion.div initial={{scale:0}} animate={{scale:1}}
                                                    className="w-2 h-2 bg-indigo-600 rounded-full"/>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Penting */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl
                                    border border-amber-100 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700"/>
                            </div>
                            <h3 className="font-bold text-amber-800 text-xs sm:text-sm">Info Penting</h3>
                        </div>
                        <ul className="space-y-1.5 sm:space-y-2">
                            {[
                                'Pendaftaran hanya bisa dilakukan sekali per event',
                                'Pastikan memilih kategori yang sesuai',
                                'Karya dapat diupload setelah pendaftaran disetujui',
                            ].map((info, i) => (
                                <motion.li key={i}
                                    initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                                    transition={{delay:0.3+i*0.1}}
                                    className="flex items-start gap-2 text-[10px] sm:text-xs text-amber-700">
                                    <span className="w-4 h-4 bg-amber-200 rounded-full flex items-center justify-center
                                                     text-amber-700 font-bold shrink-0 mt-0.5 text-[10px]">
                                        {i+1}
                                    </span>
                                    {info}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* ── FORM ── */}
                <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                    transition={{duration:0.6,delay:0.2}}
                    className="lg:col-span-2">

                    <form onSubmit={submit} className="space-y-4 sm:space-y-5">

                        {/* Pilih Kategori */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-violet-500 to-purple-600
                                                rounded-lg flex items-center justify-center shadow-sm">
                                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"/>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Pilih Kategori</h3>
                                <span className="text-red-400 text-sm">*</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                                {event.categories.map(cat => (
                                    <motion.button key={cat.id} type="button"
                                        disabled={cat.is_full}
                                        onClick={() => !cat.is_full && handleCategoryChange(cat.id)}
                                        whileHover={!cat.is_full?{y:-2}:{}}
                                        whileTap={!cat.is_full?{scale:0.98}:{}}
                                        className={`relative text-left w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl
                                                    border-2 transition-all duration-200 overflow-hidden
                                            ${cat.is_full
                                                ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                                                : data.category_id == cat.id
                                                    ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100'
                                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'}`}>

                                        <AnimatePresence>
                                            {data.category_id == cat.id && (
                                                <motion.div
                                                    initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
                                                    className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6
                                                               bg-indigo-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white"/>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500
                                                        to-blue-600 rounded-lg sm:rounded-xl flex items-center
                                                        justify-center mb-2 sm:mb-3 shadow-md shadow-indigo-200">
                                            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"/>
                                        </div>
                                        <p className="font-bold text-gray-800 text-xs sm:text-sm pr-6 sm:pr-8">
                                            {cat.name}
                                        </p>
                                        {cat.description && (
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2">
                                                {cat.description}
                                            </p>
                                        )}
                                        <div className="mt-1.5 sm:mt-2">
                                            {cat.max_participants ? (
                                                <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5
                                                                   rounded-full ${cat.is_full
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {cat.is_full ? '🔴 Penuh' : `✅ ${cat.remaining_slot??'?'} slot`}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-600
                                                                 font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
                                                    Tidak terbatas
                                                </span>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {errors.category_id && (
                                    <motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
                                        exit={{opacity:0}}
                                        className="text-red-500 text-xs flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3"/> {errors.category_id}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {selectedCat && (
                                    <motion.div
                                        initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                                        exit={{opacity:0,height:0}} className="overflow-hidden">
                                        <div className="flex items-center gap-2 mt-3 p-3 bg-indigo-50
                                                        rounded-xl sm:rounded-2xl border border-indigo-100">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0"/>
                                            <p className="text-xs sm:text-sm text-indigo-800">
                                                Kamu memilih <strong>{selectedCat.name}</strong>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Info Tambahan */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-500 to-emerald-600
                                                rounded-lg flex items-center justify-center shadow-sm">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"/>
                                </div>
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Informasi Tambahan</h3>
                                <span className="text-xs text-gray-400">(opsional)</span>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400"/> Nama Tim
                                    </span>
                                </label>
                                <input className={inputClass} value={data.team_name}
                                    onChange={e => setData('team_name', e.target.value)}
                                    placeholder="Isi jika mengikuti sebagai tim"/>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400"/>
                                        Catatan untuk Admin
                                    </span>
                                </label>
                                <textarea className={inputClass} rows={3} value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Pertanyaan atau informasi tambahan..."/>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-2 sm:gap-3">
                            <motion.button type="submit"
                                disabled={processing || !data.category_id}
                                whileHover={!processing&&data.category_id?{y:-2,scale:1.02}:{}}
                                whileTap={!processing&&data.category_id?{scale:0.97}:{}}
                                className="flex-1 flex items-center justify-center gap-2
                                           bg-gradient-to-r from-indigo-600 to-blue-600
                                           text-white font-bold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg
                                           shadow-indigo-200 hover:shadow-indigo-300
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           transition-all duration-300 text-sm">
                                {processing ? (
                                    <>
                                        <motion.div animate={{rotate:360}}
                                            transition={{duration:1,repeat:Infinity,ease:'linear'}}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>
                                        Mendaftar...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4"/>
                                        Kirim Pendaftaran
                                        <ChevronRight className="w-4 h-4"/>
                                    </>
                                )}
                            </motion.button>
                            <motion.a href={route('events.index')}
                                whileHover={{y:-2}} whileTap={{scale:0.97}}
                                className="px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl sm:rounded-2xl
                                           text-sm font-semibold text-gray-600
                                           hover:border-gray-300 hover:bg-gray-50
                                           transition-all duration-200">
                                Batal
                            </motion.a>
                        </div>

                        {!data.category_id && (
                            <motion.p initial={{opacity:0}} animate={{opacity:1}}
                                className="text-center text-xs text-gray-400">
                                * Pilih kategori terlebih dahulu
                            </motion.p>
                        )}
                    </form>
                </motion.div>
            </div>
        </UserLayout>
    );
}