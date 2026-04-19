import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth = { user: null } }) {
    return (
        <>
            <Head title="Kite Competition" />
            <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>

                {/* Navbar */}
                <nav style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '16px 24px',
                    background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        🪁 Kite Competition
                    </span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {auth.user ? (
                            <Link
                                href={
                                    auth.user.role === 'admin' ? route('admin.dashboard') :
                                    auth.user.role === 'jury'  ? route('jury.dashboard')  :
                                                                 route('user.dashboard')
                                }
                                style={{
                                    background: '#2563eb', color: 'white',
                                    padding: '8px 20px', borderRadius: '8px',
                                    textDecoration: 'none', fontSize: '14px'
                                }}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    style={{
                                        color: '#374151', textDecoration: 'none',
                                        fontSize: '14px', padding: '8px 16px'
                                    }}
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    style={{
                                        background: '#2563eb', color: 'white',
                                        padding: '8px 20px', borderRadius: '8px',
                                        textDecoration: 'none', fontSize: '14px'
                                    }}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <main style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    minHeight: 'calc(100vh - 65px)', textAlign: 'center',
                    padding: '0 24px'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🪁</div>
                    <h1 style={{
                        fontSize: '36px', fontWeight: 'bold',
                        color: '#1e3a8a', marginBottom: '12px'
                    }}>
                        Selamat Datang di Kite Competition
                    </h1>
                    <p style={{
                        color: '#6b7280', fontSize: '18px', marginBottom: '32px'
                    }}>
                        Platform lomba desain layang-layang online
                    </p>
                    <Link
                        href={route('register')}
                        style={{
                            background: '#2563eb', color: 'white',
                            padding: '14px 36px', borderRadius: '10px',
                            textDecoration: 'none', fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Daftar Sekarang
                    </Link>
                </main>
            </div>
        </>
    );
}