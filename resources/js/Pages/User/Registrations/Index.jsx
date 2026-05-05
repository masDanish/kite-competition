// ═══════════════════════════════════════════════
// RegistrationsIndex.jsx — Responsive version
// ═══════════════════════════════════════════════
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useRef, useCallback } from 'react';
import {
    Calendar, Tag, Users, Clock, CheckCircle2,
    Upload, XCircle, AlertCircle, Trophy, Sparkles
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

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
    hidden: { opacity:0, y:24 },
    show:   { opacity:1, y:0, transition:{ duration:0.5, ease:[0.22,1,0.36,1] } }
};

export default function RegistrationsIndex({ registrations }) {
    const stats = [
        { label:'Total Daftar',  value:registrations.length,
          icon:Calendar,    grad:'from-indigo-500 to-blue-600',   shadow:'shadow-indigo-200' },
        { label:'Disetujui',     value:registrations.filter(r=>r.status==='approved').length,
          icon:CheckCircle2,grad:'from-emerald-500 to-teal-600',  shadow:'shadow-emerald-200' },
        { label:'Karya Dikirim', value:registrations.filter(r=>r.submission).length,
          icon:Upload,      grad:'from-violet-500 to-purple-600', shadow:'shadow-violet-200' },
    ];

    return (
        <UserLayout header="Pendaftaran Saya">
            <Head title="Pendaftaran Saya"/>

            {/* ── HERO BANNER ── */}
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
                transition={{duration:0.7}}
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
                {PARTICLES.map(p=>(
                    <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                        style={{width:p.size,height:p.size,background:p.color,left:p.left,top:p.top}}
                        animate={{y:[0,-18,0],opacity:[0.2,0.8,0.2]}}
                        transition={{duration:p.dur,repeat:Infinity,delay:p.delay}}/>
                ))}

                <div className="relative z-10 flex justify-between items-center gap-5">
                    <div>
                        <motion.div initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.2}}
                            className="inline-flex items-center gap-2 bg-indigo-500/20
                                       border border-indigo-400/30 text-indigo-300 text-xs
                                       font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300"/>
                            Riwayat Pendaftaran
                        </motion.div>
                        <motion.h1 initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.3}}
                            className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Pendaftaran Saya 📋
                        </motion.h1>
                        <motion.p initial={{opacity:0}} animate={{opacity:1}}
                            transition={{delay:0.4}}
                            className="text-slate-300 text-xs sm:text-sm mt-1">
                            Pantau status pendaftaran dan karya kamu.
                        </motion.p>
                    </div>
                    <motion.div animate={{rotate:[0,8,-4,0],y:[0,-10,0]}}
                        transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}
                        className="hidden sm:block text-5xl sm:text-6xl shrink-0">
                        📋
                    </motion.div>
                </div>
            </motion.div>

            {/* ── STAT CARDS ── */}
            {registrations.length > 0 && (
                <motion.div initial="hidden" animate="show" variants={stagger}
                    className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8">
                    {stats.map((s, i) => (
                        <motion.div key={i} variants={fadeUp}>
                            <TiltCard intensity={12} className="group">
                                <motion.div whileHover={{y:-4}}
                                    className={`relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg
                                                ${s.shadow} border border-gray-100
                                                flex items-center gap-2 sm:gap-4 overflow-hidden`}>
                                    <motion.div
                                        className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br ${s.grad}
                                                     rounded-lg sm:rounded-xl flex items-center justify-center
                                                     shadow-md shrink-0`}>
                                        <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/>
                                    </motion.div>
                                    <div className="min-w-0">
                                        <p className="text-xl sm:text-2xl font-black text-gray-800">
                                            {s.value}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">{s.label}</p>
                                    </div>
                                </motion.div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ── EMPTY STATE ── */}
            <AnimatePresence>
                {registrations.length === 0 && (
                    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                        className="flex flex-col items-center justify-center py-16 sm:py-24
                                   bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <motion.div
                            animate={{y:[0,-12,0],rotate:[0,5,-3,0]}}
                            transition={{duration:5,repeat:Infinity}}
                            className="text-6xl sm:text-7xl mb-6">🪁</motion.div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                            Belum Ada Pendaftaran
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 sm:mb-8 text-center max-w-xs px-4">
                            Kamu belum mendaftar ke event manapun.
                        </p>
                        <motion.div whileHover={{y:-2,scale:1.02}} whileTap={{scale:0.97}}>
                            <Link href={route('events.index')}
                                className="flex items-center gap-2 bg-gradient-to-r
                                           from-indigo-600 to-blue-600 text-white font-semibold
                                           px-5 sm:px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 text-sm">
                                🔍 Lihat Event Tersedia
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── REGISTRATION CARDS ── */}
            <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-3 sm:space-y-4">
                {registrations.map((reg, i) => (
                    <RegistrationCard key={reg.id} reg={reg} variants={fadeUp}/>
                ))}
            </motion.div>
        </UserLayout>
    );
}

function RegistrationCard({ reg, variants }) {
    const hasSubmission = !!reg.submission;
    const isApproved = reg.status === 'approved';
    const isRejected = reg.status === 'rejected';
    const isPending  = reg.status === 'pending';
    const eventFinished = reg.event?.status === 'finished';

    const statusConfig = {
        pending:  { label:'Menunggu Review', icon:AlertCircle,
                    bar:'from-amber-400 to-orange-500',
                    badge:'bg-amber-100 text-amber-800 border-amber-200', dot:'bg-amber-400' },
        approved: { label:'Disetujui',       icon:CheckCircle2,
                    bar:'from-emerald-400 to-teal-500',
                    badge:'bg-emerald-100 text-emerald-800 border-emerald-200', dot:'bg-emerald-400' },
        rejected: { label:'Ditolak',         icon:XCircle,
                    bar:'from-red-400 to-rose-500',
                    badge:'bg-red-100 text-red-800 border-red-200', dot:'bg-red-400' },
    };
    const cfg  = statusConfig[reg.status] ?? statusConfig.pending;
    const Icon = cfg.icon;

    return (
        <motion.div variants={variants}
            whileHover={{y:-2}}
            className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden
                       hover:shadow-xl hover:shadow-indigo-100/30 hover:border-indigo-100
                       transition-all duration-300">

            <div className={`h-1 w-full bg-gradient-to-r ${cfg.bar}`}/>

            <div className="p-4 sm:p-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight truncate">
                            {reg.event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2.5">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400"/>
                                <span>{reg.category.name}</span>
                            </div>
                            {reg.team_name && (
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400"/>
                                    <span className="truncate max-w-[100px]">{reg.team_name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock className="w-3 h-3"/>
                                <span>
                                    {new Date(reg.created_at).toLocaleDateString('id-ID',
                                        {day:'numeric',month:'short',year:'numeric'})}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                        <span className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold
                                         px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${cfg.badge}`}>
                            <motion.span animate={{scale:[1,1.3,1]}}
                                transition={{duration:2,repeat:Infinity}}
                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* Submission area */}
                {isApproved && !eventFinished && (
                    <div className="mt-3 sm:mt-4">
                        {hasSubmission ? (
                            <motion.div initial={{opacity:0,scale:0.95}}
                                animate={{opacity:1,scale:1}}
                                className="flex items-center gap-2 sm:gap-3 bg-emerald-50
                                           border border-emerald-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-400
                                                to-teal-500 rounded-xl flex items-center
                                                justify-center shrink-0 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-white"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs text-gray-500">Karya dikirim</p>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                        {reg.submission.title}
                                    </p>
                                </div>
                                <SubmissionStatusBadge status={reg.submission.status}/>
                            </motion.div>
                        ) : (
                            <motion.div animate={{scale:[1,1.01,1]}}
                                transition={{duration:2.5,repeat:Infinity}}>
                                <Link
                                    href={route('user.submissions.create', reg.id)}
                                    className="inline-flex items-center gap-2
                                               bg-gradient-to-r from-indigo-600 to-blue-600
                                               text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5
                                               rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-200
                                               hover:shadow-indigo-300 hover:-translate-y-0.5
                                               transition-all duration-300">
                                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
                                    Upload Karya
                                </Link>
                            </motion.div>
                        )}
                    </div>
                )}

                {isApproved && hasSubmission && (
                    <motion.div initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}}
                        transition={{type:'spring',stiffness:300,damping:20}}
                        className="mt-2 flex items-center gap-1 text-xs text-amber-600 font-semibold">
                        <Trophy className="w-3.5 h-3.5"/> Dalam Penilaian
                    </motion.div>
                )}

                {isRejected && reg.rejection_reason && (
                    <motion.div initial={{opacity:0,height:0}}
                        animate={{opacity:1,height:'auto'}}
                        className="mt-3 flex items-start gap-2 bg-red-50 border
                                   border-red-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-3">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/>
                        <div>
                            <p className="text-[10px] sm:text-xs font-semibold text-red-700 mb-0.5">
                                Alasan Penolakan:
                            </p>
                            <p className="text-[10px] sm:text-xs text-red-600">{reg.rejection_reason}</p>
                        </div>
                    </motion.div>
                )}

                {isPending && (
                    <p className="mt-2 sm:mt-3 text-xs text-amber-700 flex items-center gap-1.5">
                        <motion.span animate={{opacity:[1,0.4,1]}}
                            transition={{duration:1.5,repeat:Infinity}}
                            className="w-2 h-2 bg-amber-500 rounded-full inline-block"/>
                        Sedang ditinjau oleh admin...
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function SubmissionStatusBadge({ status }) {
    const config = {
        draft:     { label:'Draft',        class:'bg-gray-100 text-gray-600 border-gray-200'          },
        submitted: { label:'Menunggu',     class:'bg-blue-100 text-blue-700 border-blue-200'          },
        approved:  { label:'Disetujui',    class:'bg-emerald-100 text-emerald-700 border-emerald-200' },
        rejected:  { label:'Dikembalikan', class:'bg-red-100 text-red-700 border-red-200'             },
    };
    const c = config[status] ?? config.draft;
    return (
        <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full font-semibold border shrink-0 ${c.class}`}>
            {c.label}
        </span>
    );
}