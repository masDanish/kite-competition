import { Link, Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Logo from '@/Assets/logo.png';

export default function Welcome({ auth = { user: null } }) {

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            <Head title="Kite Competition" />

            <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-100 relative overflow-hidden">

                {/* BACKGROUND BLOBS */}
                <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl top-10 left-10 animate-pulse" />
                <div className="absolute w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />

                {/* NAVBAR */}
                <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

                        {/* LOGO */}
                        <motion.div
                            className="flex items-center gap-2"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                        >
                            <div className="flex items-center gap-2">
    <img src={Logo} className="w-20 h-17" />
</div>
                            <div>
                                <p className="font-bold text-indigo-700">Kite Competition</p>
                                <p className="text-xs text-gray-500">Design & Fly Platform</p>
                            </div>
                        </motion.div>

                        {/* BUTTON */}
                        <div className="flex gap-3">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={route('user.dashboard')}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>Login</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                    </div>
                </header>

                {/* HERO */}
                <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={fadeUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 leading-tight">
                            Fly Your Creativity Higher Than Ever
                        </h1>

                        <p className="mt-4 text-gray-600 text-lg">
                            Join global kite designers, compete fairly, and showcase your imagination in a modern digital competition platform.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <Button asChild>
                                <Link href={route('register')}>Join Competition</Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="#about">Learn More</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* HERO IMAGE */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1200&q=80"
                            className="rounded-xl shadow-xl object-cover h-[360px] w-full"
                        />
                    </motion.div>

                </section>

                {/* ABOUT */}
                <motion.section
                    id="about"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="max-w-4xl mx-auto text-center px-6"
                >
                    <h2 className="text-3xl font-bold text-indigo-800">About Event</h2>
                    <p className="mt-4 text-gray-600">
                        A global platform for kite designers with fair judging, real-time scoring, and creative freedom.
                    </p>
                </motion.section>

                {/* FEATURES */}
                <section className="max-w-6xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-6">

                    {[
                        { icon: "🎨", title: "Creative Design", desc: "Express unlimited creativity in your kite design." },
                        { icon: "⚖️", title: "Fair Judging", desc: "Transparent and professional evaluation system." },
                        { icon: "🏆", title: "Live Ranking", desc: "Real-time leaderboard updates." },
                    ].map((f, i) => (
                        <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }}>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-2xl">{f.icon}</div>
                                    <h3 className="font-semibold mt-2">{f.title}</h3>
                                    <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                </section>

                {/* GALLERY */}
                <section className="max-w-6xl mx-auto px-6 mt-20">
                    <h2 className="text-3xl font-bold text-center text-indigo-800">
                        Festival Gallery
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5 mt-8">

                        {[
                            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1520975958221-8b3c2f0c3f0a?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1520975693411-9c3c2f0c3f0a?auto=format&fit=crop&w=800&q=80",
                        ].map((img, i) => (
                            <motion.img
                                key={i}
                                src={img}
                                whileHover={{ scale: 1.05 }}
                                onError={(e) => {
                                    e.target.src = "https://placehold.co/800x500?text=Image";
                                }}
                                className="rounded-xl shadow-md h-52 w-full object-cover"
                            />
                        ))}

                    </div>
                </section>

                {/* FOOTER */}
                <footer className="mt-24 border-t bg-white/70 backdrop-blur-md">

                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 py-10">

                        <div>
                            <h3 className="font-bold text-indigo-700">Kite Competition</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                A global creative competition platform.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Navigation</h3>
                            <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                <li>Home</li>
                                <li>Competition</li>
                                <li>Leaderboard</li>
                                <li>Contact</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold">Social Media</h3>
                            <div className="flex gap-4 mt-3 text-gray-600">

    <a href="#" className="hover:text-blue-600 transition">
        <FaFacebookF className="w-5 h-5" />
    </a>

    <a href="#" className="hover:text-pink-500 transition">
        <FaInstagram className="w-5 h-5" />
    </a>

    <a href="#" className="hover:text-sky-500 transition">
        <FaTwitter className="w-5 h-5" />
    </a>

    <a href="#" className="hover:text-red-500 transition">
        <FaYoutube className="w-5 h-5" />
    </a>

</div>
                        </div>

                    </div>

                    <div className="text-center text-xs text-gray-500 pb-6">
                        © {new Date().getFullYear()} Kite Competition
                    </div>

                </footer>

            </div>
        </>
    );
}