import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import {
    Upload, FileText, Image, Link2, Info,
    CheckCircle2, AlertCircle, Sparkles,
    Film, ChevronRight
} from 'lucide-react';

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
    id:i, left:`${(i*337)%100}%`, top:`${(i*271)%100}%`,
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

export default function SubmissionCreate({ registration }) {
    const { data, setData, post, processing, errors } = useForm({
        registration_id: registration.id,
        title:           '',
        description:     '',
        design_file:     null,
        photo_url:       null,
        video_url:       '',
    });

    const [designPreview, setDesignPreview] = useState(null);
    const [photoPreview,  setPhotoPreview]  = useState(null);

    function handleDesignFile(e) {
        const file = e.target.files[0]; if(!file) return;
        setData('design_file', file);
        setDesignPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : 'pdf');
    }
    function handlePhoto(e) {
        const file = e.target.files[0]; if(!file) return;
        setData('photo_url', file);
        setPhotoPreview(URL.createObjectURL(file));
    }
    function submit(e) {
        e.preventDefault();
        post(route('user.submissions.store'), { forceFormData:true });
    }

    const inputClass = `w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm
                        text-gray-800 bg-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-400
                        focus:border-transparent transition-all duration-200`;

    const steps = [
        { label:'Isi Judul & Deskripsi', icon:FileText,    done:!!data.title },
        { label:'Upload File Desain',    icon:Upload,      done:!!data.design_file },
        { label:'Upload Foto Karya',     icon:Image,       done:!!data.photo_url },
        { label:'Kirim Karya',           icon:CheckCircle2,done:false },
    ];
    const completedSteps = steps.filter(s=>s.done).length;
    const progressPct    = Math.round((completedSteps/(steps.length-1))*100);

    return (
        <UserLayout header="Upload Karya">
            <Head title="Upload Karya"/>

            {/* ── HERO BANNER ── */}
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
                transition={{duration:0.7}}
                className="relative overflow-hidden rounded-3xl mb-8
                           bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950
                           p-7 text-white shadow-2xl shadow-indigo-950/40">

                <div className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:`linear-gradient(rgba(99,102,241,0.5) 1px,transparent 1px),
                                         linear-gradient(90deg,rgba(99,102,241,0.5) 1px,transparent 1px)`,
                        backgroundSize:'40px 40px'
                    }}/>

                <motion.div className="absolute w-64 h-64 rounded-full pointer-events-none"
                    style={{background:'radial-gradient(circle,#a78bfa 0%,transparent 70%)',
                            top:'-20%',right:'-5%',opacity:0.2}}
                    animate={{scale:[1,1.4,1]}} transition={{duration:7,repeat:Infinity}}/>
                <motion.div className="absolute w-48 h-48 rounded-full pointer-events-none"
                    style={{background:'radial-gradient(circle,#60a5fa 0%,transparent 70%)',
                            bottom:'-15%',left:'5%',opacity:0.15}}
                    animate={{scale:[1.2,1,1.2]}} transition={{duration:9,repeat:Infinity}}/>

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
                            className="inline-flex items-center gap-2 bg-violet-500/20
                                       border border-violet-400/30 text-violet-300 text-xs
                                       font-semibold px-3 py-1.5 rounded-full mb-3">
                            <Sparkles className="w-3 h-3 text-yellow-300"/>
                            Tunjukkan Kreativitasmu!
                        </motion.div>
                        <motion.h1 initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                            transition={{delay:0.3}}
                            className="text-2xl font-black text-white tracking-tight">
                            Upload Karya Layangan 🎨
                        </motion.h1>
                        <motion.p initial={{opacity:0}} animate={{opacity:1}}
                            transition={{delay:0.4}}
                            className="text-slate-300 text-sm mt-1">
                            {registration.event.title}
                            <span className="mx-2 opacity-40">•</span>
                            Kategori: <strong className="text-white">
                                {registration.category.name}
                            </strong>
                        </motion.p>
                    </div>
                    <motion.div animate={{rotate:[0,8,-4,0],y:[0,-10,0]}}
                        transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}
                        className="hidden md:block text-6xl shrink-0">🎨</motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT SIDEBAR ── */}
                <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}}
                    transition={{duration:0.6,delay:0.15}}
                    className="space-y-4">

                    {/* Progress */}
                    <TiltCard intensity={6}>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5
                                        hover:shadow-lg hover:shadow-indigo-100/40
                                        hover:border-indigo-200 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600
                                                rounded-lg flex items-center justify-center shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-white"/>
                                </div>
                                <h3 className="font-bold text-gray-800">Progres Upload</h3>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                    <span>{completedSteps} dari {steps.length-1} langkah</span>
                                    <span className="font-bold text-indigo-600">{progressPct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                        className="h-2.5 rounded-full bg-gradient-to-r
                                                   from-indigo-500 to-blue-500"
                                        animate={{width:`${progressPct}%`}}
                                        transition={{duration:0.6,ease:'easeOut'}}/>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {steps.map((s, i) => (
                                    <motion.div key={i} animate={{opacity:1}}
                                        className={`flex items-center gap-3 p-2.5 rounded-xl
                                                    transition-colors duration-200
                                                    ${s.done?'bg-emerald-50':'bg-gray-50'}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center
                                                         justify-center shrink-0 transition-all
                                            ${s.done
                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm'
                                                : i===completedSteps
                                                    ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-sm'
                                                    : 'bg-gray-200'}`}>
                                            {s.done
                                                ? <CheckCircle2 className="w-3.5 h-3.5 text-white"/>
                                                : <s.icon className={`w-3.5 h-3.5 ${
                                                    i===completedSteps?'text-white':'text-gray-400'}`}/>}
                                        </div>
                                        <span className={`text-xs font-semibold ${
                                            s.done ? 'text-emerald-700 line-through opacity-70' :
                                            i===completedSteps ? 'text-indigo-700' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </TiltCard>

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl
                                    border border-amber-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center
                                            justify-center">
                                <Info className="w-4 h-4 text-amber-700"/>
                            </div>
                            <h3 className="font-bold text-amber-800 text-sm">Tips Karya Terbaik</h3>
                        </div>
                        <ul className="space-y-2">
                            {[
                                'Foto karya dalam resolusi tinggi (min. 1200×800)',
                                'Deskripsi yang detail meningkatkan nilai',
                                'File desain lengkap memudahkan juri',
                                'Video demo layangan jadi nilai plus',
                            ].map((tip, i) => (
                                <motion.li key={i}
                                    initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                                    transition={{delay:0.3+i*0.1}}
                                    className="flex items-start gap-2 text-xs text-amber-700">
                                    <span className="w-4 h-4 bg-amber-200 rounded-full flex items-center
                                                     justify-center text-amber-700 font-bold shrink-0
                                                     mt-0.5 text-[10px]">{i+1}</span>
                                    {tip}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* ── RIGHT FORM ── */}
                <motion.div initial={{opacity:0,x:24}} animate={{opacity:1,x:0}}
                    transition={{duration:0.6,delay:0.2}}
                    className="lg:col-span-2">

                    <form onSubmit={submit} className="space-y-5">

                        {/* Judul & Deskripsi */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600
                                                rounded-lg flex items-center justify-center shadow-sm">
                                    <FileText className="w-4 h-4 text-white"/>
                                </div>
                                <h3 className="font-bold text-gray-800">Informasi Karya</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Judul Karya <span className="text-red-400">*</span>
                                </label>
                                <input className={inputClass} value={data.title}
                                    onChange={e=>setData('title',e.target.value)}
                                    placeholder="Contoh: Layangan Naga Merah — Motif Batik Solo"/>
                                <AnimatePresence>
                                    {errors.title && (
                                        <motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
                                            exit={{opacity:0}}
                                            className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3"/> {errors.title}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Deskripsi Karya
                                </label>
                                <textarea className={inputClass} rows={4} value={data.description}
                                    onChange={e=>setData('description',e.target.value)}
                                    placeholder="Ceritakan konsep, inspirasi, dan keunikan desain..."/>
                                <p className="text-xs text-gray-400 mt-1.5 text-right">
                                    {data.description.length} karakter
                                </p>
                            </div>
                        </div>

                        {/* Upload Files */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600
                                                rounded-lg flex items-center justify-center shadow-sm">
                                    <Upload className="w-4 h-4 text-white"/>
                                </div>
                                <h3 className="font-bold text-gray-800">Berkas Karya</h3>
                            </div>

                            {/* Design file */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    File Desain
                                    <span className="text-gray-400 font-normal ml-1">
                                        (PDF/JPG/PNG, maks. 5MB)
                                    </span>
                                </label>
                                <label className={`flex flex-col items-center justify-center w-full
                                                   border-2 border-dashed rounded-2xl cursor-pointer
                                                   transition-all duration-200 overflow-hidden
                                                   ${data.design_file
                                                       ? 'border-indigo-300 bg-indigo-50'
                                                       : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40'}`}>
                                    {designPreview ? (
                                        <div className="w-full p-4 flex items-center gap-4">
                                            {designPreview==='pdf' ? (
                                                <div className="w-14 h-14 bg-red-100 rounded-xl flex
                                                                items-center justify-center shrink-0">
                                                    <FileText className="w-7 h-7 text-red-500"/>
                                                </div>
                                            ) : (
                                                <img src={designPreview} alt="preview"
                                                    className="w-14 h-14 rounded-xl object-cover
                                                               shrink-0 border border-gray-200"/>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {data.design_file?.name}
                                                </p>
                                                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                                                    ✅ File siap diupload
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 py-8 px-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex
                                                            items-center justify-center mb-1 border
                                                            border-indigo-100">
                                                <Upload className="w-5 h-5 text-indigo-400"/>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-600">
                                                Klik untuk pilih file
                                            </p>
                                            <p className="text-xs text-gray-400">atau drag & drop</p>
                                        </div>
                                    )}
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleDesignFile} className="hidden"/>
                                </label>
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Foto Karya <span className="text-red-400">*</span>
                                    <span className="text-gray-400 font-normal ml-1">
                                        (JPG/PNG, maks. 3MB)
                                    </span>
                                </label>
                                <label className={`flex flex-col items-center justify-center w-full
                                                   border-2 border-dashed rounded-2xl cursor-pointer
                                                   transition-all duration-200 overflow-hidden
                                                   ${data.photo_url
                                                       ? 'border-emerald-300 bg-emerald-50'
                                                       : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40'}`}>
                                    {photoPreview ? (
                                        <div className="w-full">
                                            <img src={photoPreview} alt="foto preview"
                                                className="w-full max-h-52 object-cover"/>
                                            <div className="px-4 py-2.5 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                                                <p className="text-xs font-semibold text-emerald-700">
                                                    {data.photo_url?.name} — siap diupload
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 py-8 px-4">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex
                                                            items-center justify-center mb-1 border
                                                            border-emerald-100">
                                                <Image className="w-5 h-5 text-emerald-400"/>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-600">
                                                Klik untuk pilih foto
                                            </p>
                                            <p className="text-xs text-gray-400">JPG atau PNG</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*"
                                        onChange={handlePhoto} className="hidden"/>
                                </label>
                                <AnimatePresence>
                                    {errors.photo_url && (
                                        <motion.p initial={{opacity:0}} animate={{opacity:1}}
                                            className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3"/> {errors.photo_url}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Video */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    <span className="flex items-center gap-1.5">
                                        <Film className="w-3.5 h-3.5 text-gray-400"/>
                                        Link Video
                                        <span className="text-gray-400 font-normal">
                                            (YouTube/GDrive, opsional)
                                        </span>
                                    </span>
                                </label>
                                <div className="relative">
                                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                       w-4 h-4 text-gray-400"/>
                                    <input className={`${inputClass} pl-10`} value={data.video_url}
                                        onChange={e=>setData('video_url',e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."/>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3">
                            <motion.button type="submit"
                                disabled={processing||!data.title||!data.photo_url}
                                whileHover={!processing&&data.title&&data.photo_url?{y:-2,scale:1.02}:{}}
                                whileTap={!processing&&data.title&&data.photo_url?{scale:0.97}:{}}
                                className="flex-1 flex items-center justify-center gap-2
                                           bg-gradient-to-r from-indigo-600 to-blue-600
                                           text-white font-bold py-3.5 rounded-2xl shadow-lg
                                           shadow-indigo-200 hover:shadow-indigo-300
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           transition-all duration-300">
                                {processing ? (
                                    <>
                                        <motion.div animate={{rotate:360}}
                                            transition={{duration:1,repeat:Infinity,ease:'linear'}}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>
                                        Mengunggah...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4"/>
                                        Kirim Karya
                                        <ChevronRight className="w-4 h-4"/>
                                    </>
                                )}
                            </motion.button>
                            <motion.a href={route('user.dashboard')}
                                whileHover={{y:-2}} whileTap={{scale:0.97}}
                                className="px-6 py-3.5 border-2 border-gray-200 rounded-2xl
                                           text-sm font-semibold text-gray-600 hover:border-gray-300
                                           hover:bg-gray-50 transition-all duration-200">
                                Batal
                            </motion.a>
                        </div>

                        {(!data.title||!data.photo_url) && (
                            <motion.p initial={{opacity:0}} animate={{opacity:1}}
                                className="text-center text-xs text-gray-400">
                                * Judul dan Foto Karya wajib diisi sebelum mengirim
                            </motion.p>
                        )}
                    </form>
                </motion.div>
            </div>
        </UserLayout>
    );
}