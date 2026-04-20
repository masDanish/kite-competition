import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 px-6">

                {/* CARD */}
                <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">

                    {/* LEFT SIDE (branding) */}
                    <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">

                        <div className="text-6xl animate-bounce">🪁</div>

                        <h1 className="text-2xl font-bold mt-4 text-center">
                            Kite Competition
                        </h1>

                        <p className="text-sm text-indigo-100 mt-2 text-center">
                            Fly your creativity higher and join global competition
                        </p>

                        <div className="mt-6 text-5xl opacity-20">
                            ✦ ✧ ✦
                        </div>
                    </div>

                    {/* RIGHT SIDE (form) */}
                    <div className="p-8">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Welcome Back 👋
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Login to continue your kite journey
                        </p>

                        {status && (
                            <div className="mt-3 text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-4">

                            {/* EMAIL */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* REMEMBER */}
                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </div>

                            {/* BUTTON */}
                            <PrimaryButton
                                className="w-full bg-indigo-600 hover:bg-indigo-700 transition"
                                disabled={processing}
                            >
                                Log in
                            </PrimaryButton>

                            {/* LINKS */}
                            <div className="flex justify-between text-sm mt-3">

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-gray-500 hover:text-indigo-600"
                                    >
                                        Forgot password?
                                    </Link>
                                )}

                                <Link
                                    href={route('register')}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Create account
                                </Link>

                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </GuestLayout>
    );
}