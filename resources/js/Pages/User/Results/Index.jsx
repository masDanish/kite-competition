import UserLayout from '@/Layouts/UserLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useRef, useCallback, useState } from 'react';
import {
    Trophy, Star, Target, TrendingUp,
    Award, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
    id:i, left:`${(i*337)%100}%`, top:`${(i*271)%100}%`,
    dur:2.5+(i%4), delay:(i%5)*0.6, size:2+(i%3),
    color:['#818cf8','#60a5fa','#34d399','#fbbf24','#f472b6'][i%5],
}));

const MEDAL_CONFIG = [
    { emoji:'🥇', label:'Juara 1', bg:'from-yellow-400 to-amber-500',
      shadow:'shadow-amber-200', text:'text-amber-700', ring:'ring-amber-300' },
    { emoji:'🥈', label:'Juara 2', bg:'from-slate-400 to-gray-500',
      shadow:'shadow-gray-200',  text:'text-gray-700',  ring:'ring-gray-300'  },
    { emoji:'🥉', label:'Juara 3', bg:'from-orange-400 to-amber-600',
      shadow:'shadow-orange-200',text:'text-orange-700',ring:'ring-orange-300'},
];

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

const stagger = { show:{ transition:{ staggerChildren:0.1 } } };
const fadeUp  = {
    hidden:{ opacity:0, y:24 },
    show:  { opacity:1, y:0, transition:{ duration:0.55, ease:[0.22,1,0.36,1] } }
};

export default function ResultsIndex({ results }) {
    const bestRank = results.length > 0
        ? Math.min(...results.filter(r=>r.rank).map(r=>r.rank))
        : null;
    const avgScore = results.length > 0 && results.some(r=>r.final_score)
        ? (results.filter(r=>r.final_score)
                  .reduce((a,b)=>a+b.final_score,0)
           / results.filter(r=>r.final_score).length).toFixed(1)
        : null;

    const summaryStats = [
        { label:'Peringkat Terbaik', value: bestRank?`#${bestRank}`:'-',
          icon:Trophy, grad:'from-amber-500 to-orange-500', shadow:'shadow-amber-200' },
        { label:'Rata-rata Skor',    value: avgScore??'-',
          icon:Star,   grad:'from-indigo-500 to-blue-600',  shadow:'shadow-indigo-200' },
        { label:'Total Event',       value: results.length,
          icon:Award,  grad:'from-emerald-500 to-teal-600', shadow:'shadow-emerald-200' },
    ];

    return (
        <UserLayout header="Hasil Penilaian">
            <Head title="Hasil Penilaian"/>

            {/* ── HERO BANNER ── */}
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
                transition={{duration:0.7}}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-6 sm:mb-8
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
                <motion.div className="absolute w-36 sm:w-48 h-36 sm:h-48 rounded-full pointer-events-none"
                    style={{background:'radial-gradient(circle,#fbbf24 0%,transparent 70%)',
                            bottom:'-15%',left:'5%',opacity:0.12}}
                    animate={{scale:[1.2,1,1.2]}} transition={{duration:9,repeat:Infinity}}/>

                {PARTICLES.map(p=>(
                    <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
                        style={{width:p.size,height:p.size,background:p.color,left:p.left,top:p.top}}
                        animate={{y:[0,-18,0],opacity:[0.2,0.8,0.2]}}
                        transition={{duration:p.dur,repeat:Infinity,delay:p.delay}}/>
                ))}

                <div className="relative z-10 flex justify-between items-center gap-4">
                    <div className="min-w-0">
                        <motion.div initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.2}}
                            className="inline-flex items-center gap-2 bg-indigo-500/20
                                       border border-indigo-400/30 text-indigo-300 text-xs
                                       font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300 shrink-0"/>
                            Hasil Kompetisi
                        </motion.div>
                        <motion.h1 initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.3}}
                            className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Hasil Penilaian 🏆
                        </motion.h1>
                        <motion.p initial={{opacity:0}} animate={{opacity:1}}
                            transition={{delay:0.4}}
                            className="text-slate-300 text-xs sm:text-sm mt-1">
                            Lihat skor dan peringkatmu dari setiap event.
                        </motion.p>
                    </div>
                    <motion.div animate={{rotate:[0,8,-4,0],y:[0,-10,0]}}
                        transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}
                        className="text-4xl sm:text-6xl shrink-0">🏆</motion.div>
                </div>
            </motion.div>

            {/* ── EMPTY STATE ── */}
            <AnimatePresence>
                {results.length === 0 && (
                    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                        className="flex flex-col items-center justify-center py-20 sm:py-28
                                   bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 px-4">
                        <motion.div animate={{y:[0,-12,0],rotate:[0,5,-3,0]}}
                            transition={{duration:5,repeat:Infinity}}
                            className="text-6xl sm:text-8xl mb-6">🏆</motion.div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Belum Ada Hasil</h3>
                        <p className="text-gray-400 text-sm text-center max-w-sm">
                            Hasil penilaian akan muncul setelah event selesai
                            dan semua juri telah memberikan penilaian.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {results.length > 0 && (
                <>
                    {/* ── SUMMARY CARDS ── */}
                    <motion.div initial="hidden" animate="show" variants={stagger}
                        className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                        {summaryStats.map((s, i) => (
                            <motion.div key={i} variants={fadeUp}>
                                <TiltCard intensity={12} className="group">
                                    <motion.div whileHover={{y:-6}}
                                        className={`relative bg-white rounded-xl sm:rounded-2xl
                                                    p-3 sm:p-5 shadow-lg ${s.shadow}
                                                    border border-gray-100
                                                    flex flex-col sm:flex-row items-center sm:items-center
                                                    gap-2 sm:gap-4 overflow-hidden`}>
                                        <motion.div
                                            whileHover={{rotate:[-10,10,0],scale:1.1}}
                                            transition={{duration:0.4}}
                                            className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br ${s.grad}
                                                         rounded-lg sm:rounded-xl flex items-center
                                                         justify-center shadow-md shrink-0`}>
                                            <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/>
                                        </motion.div>
                                        <div className="text-center sm:text-left min-w-0">
                                            <motion.p
                                                className="text-lg sm:text-2xl font-black text-gray-800 leading-none"
                                                key={String(s.value)}
                                                initial={{scale:1.3,color:'#6366f1'}}
                                                animate={{scale:1,color:'#1f2937'}}
                                                transition={{duration:0.4}}>
                                                {s.value}
                                            </motion.p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-tight">
                                                {s.label}
                                            </p>
                                        </div>
                                        <div className={`absolute -bottom-3 -right-3 w-12 sm:w-16 h-12 sm:h-16
                                                         bg-gradient-to-br ${s.grad} opacity-5 rounded-full`}/>
                                    </motion.div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ── RESULT CARDS ── */}
                    <motion.div initial="hidden" animate="show" variants={stagger}
                        className="space-y-4 sm:space-y-5">
                        {results.map((result, idx) => (
                            <ResultCard key={idx} result={result} index={idx}/>
                        ))}
                    </motion.div>
                </>
            )}
        </UserLayout>
    );
}

function ResultCard({ result, index }) {
    const [expanded, setExpanded] = useState(false);
    const rank   = result.rank;
    const medal  = rank && rank <= 3 ? MEDAL_CONFIG[rank-1] : null;
    const score  = result.final_score ?? 0;
    const scores = result.submission?.scores ?? [];

    const byKriteria = scores.reduce((acc, s) => {
        const key = s.criteria?.name ?? 'Lainnya';
        if (!acc[key]) acc[key] = [];
        acc[key].push(s.score);
        return acc;
    }, {});
    const kriteriaEntries = Object.entries(byKriteria).map(([name, vals]) => ({
        name, avg: vals.reduce((a,b)=>a+b,0)/vals.length,
    }));

    return (
        <motion.div
            variants={{
                hidden:{ opacity:0, y:30 },
                show:  { opacity:1, y:0, transition:{ duration:0.55, delay:index*0.1 } }
            }}
            whileHover={{y:-3}}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100
                       overflow-hidden hover:shadow-xl hover:shadow-indigo-100/30
                       hover:border-indigo-100 transition-all duration-300">

            <div className={`h-1.5 w-full bg-gradient-to-r ${
                medal ? medal.bg : 'from-indigo-400 to-blue-500'}`}/>

            <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-5">

                    {/* Medal / Rank */}
                    <div className="shrink-0">
                        {medal ? (
                            <TiltCard intensity={18}>
                                <motion.div animate={{rotate:[0,-5,5,0]}}
                                    transition={{duration:4,repeat:Infinity,delay:index}}
                                    className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${medal.bg}
                                                 rounded-xl sm:rounded-2xl flex flex-col items-center
                                                 justify-center shadow-lg ${medal.shadow}
                                                 ring-2 ${medal.ring}`}>
                                    <span className="text-xl sm:text-2xl leading-none">{medal.emoji}</span>
                                    <span className="text-white text-[9px] sm:text-[10px] font-bold mt-0.5">
                                        {medal.label}
                                    </span>
                                </motion.div>
                            </TiltCard>
                        ) : rank ? (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100
                                             to-gray-200 rounded-xl sm:rounded-2xl flex flex-col
                                             items-center justify-center border border-gray-200">
                                <span className="text-lg sm:text-xl font-black text-gray-600">#{rank}</span>
                                <span className="text-gray-400 text-[9px] sm:text-[10px]">Peringkat</span>
                            </div>
                        ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl
                                             flex items-center justify-center">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"/>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2">
                            {result.registration.event.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
                            {result.registration.category.name}
                        </p>

                        {result.submission ? (
                            <>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-1">
                                    Karya: <span className="font-semibold text-gray-800">
                                        {result.submission.title}
                                    </span>
                                </p>

                                {/* Score */}
                                <div className="mt-3 sm:mt-4">
                                    <div className="flex items-end gap-2 sm:gap-3 mb-2 flex-wrap">
                                        <motion.span
                                            initial={{opacity:0,scale:0.5}}
                                            animate={{opacity:1,scale:1}}
                                            transition={{type:'spring',stiffness:200,
                                                        delay:0.3+index*0.1}}
                                            className={`text-4xl sm:text-5xl font-black ${
                                                medal ? medal.text : 'text-indigo-600'}`}>
                                            {Number(score).toFixed(1)}
                                        </motion.span>
                                        <div className="mb-1">
                                            <span className="text-gray-400 text-xs sm:text-sm">/ 100</span>
                                            <p className="text-[10px] sm:text-xs text-gray-400">Skor Akhir</p>
                                        </div>
                                        {medal && (
                                            <motion.div initial={{scale:0}} animate={{scale:1}}
                                                transition={{type:'spring',stiffness:300,delay:0.5}}
                                                className={`flex items-center gap-1 sm:gap-1.5
                                                             bg-gradient-to-r ${medal.bg}
                                                             text-white text-[10px] sm:text-xs font-bold
                                                             px-2 sm:px-3 py-1 sm:py-1.5 rounded-full
                                                             shadow-md ${medal.shadow}`}>
                                                <TrendingUp className="w-3 h-3"/>
                                                {medal.label}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Score bar */}
                                    <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full bg-gradient-to-r ${
                                                medal ? medal.bg : 'from-indigo-500 to-blue-500'}`}
                                            initial={{width:0}}
                                            animate={{width:`${(score/100)*100}%`}}
                                            transition={{duration:1.2,delay:0.4+index*0.1,ease:'easeOut'}}/>
                                    </div>
                                </div>

                                {kriteriaEntries.length > 0 && (
                                    <button onClick={() => setExpanded(!expanded)}
                                        className="mt-3 sm:mt-4 flex items-center gap-1.5 text-xs sm:text-sm
                                                   text-indigo-600 font-semibold hover:underline">
                                        {expanded
                                            ? <><ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4"/> Sembunyikan Detail</>
                                            : <><ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4"/> Lihat Detail per Kriteria</>
                                        }
                                    </button>
                                )}

                                <AnimatePresence>
                                    {expanded && kriteriaEntries.length > 0 && (
                                        <motion.div
                                            initial={{opacity:0,height:0}}
                                            animate={{opacity:1,height:'auto'}}
                                            exit={{opacity:0,height:0}}
                                            transition={{duration:0.35}}
                                            className="overflow-hidden">
                                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 space-y-2.5 sm:space-y-3">
                                                <p className="text-[10px] sm:text-xs font-bold text-gray-500
                                                               uppercase tracking-wider mb-2 sm:mb-3">
                                                    Detail Penilaian per Kriteria
                                                </p>
                                                {kriteriaEntries.map((k, ki) => (
                                                    <div key={ki} className="flex items-center gap-2 sm:gap-3">
                                                        <span className="text-[11px] sm:text-xs text-gray-600
                                                                         w-28 sm:w-36 shrink-0 font-medium
                                                                         leading-tight line-clamp-2">
                                                            {k.name}
                                                        </span>
                                                        <div className="flex-1 bg-gray-100 rounded-full
                                                                        h-1.5 sm:h-2 overflow-hidden">
                                                            <motion.div
                                                                className="h-full rounded-full bg-gradient-to-r
                                                                           from-indigo-400 to-blue-500"
                                                                initial={{width:0}}
                                                                animate={{width:`${k.avg}%`}}
                                                                transition={{duration:0.9,delay:ki*0.08}}/>
                                                        </div>
                                                        <span className="text-[11px] sm:text-xs font-black
                                                                         text-indigo-600 w-8 sm:w-10 text-right shrink-0">
                                                            {k.avg.toFixed(1)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-400
                                            bg-gray-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3
                                            border border-gray-100">
                                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/>
                                Karya belum diupload untuk event ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}