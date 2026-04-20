import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

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
                            Join the global kite design community and compete with creativity
                        </p>

                        <div className="mt-6 text-5xl opacity-20">
                            ✦ ✧ ✦
                        </div>
                    </div>

                    {/* RIGHT SIDE (form) */}
                    <div className="p-8">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Create Account 🚀
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Start your kite competition journey
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">

                            {/* NAME */}
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-1"
                                />
                            </div>

                            {/* BUTTON */}
                            <PrimaryButton
                                className="w-full bg-indigo-600 hover:bg-indigo-700 transition"
                                disabled={processing}
                            >
                                Create Account
                            </PrimaryButton>

                            {/* LINK */}
                            <div className="text-center text-sm mt-3">
                                <Link
                                    href={route('login')}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Already have an account? Login
                                </Link>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </GuestLayout>
    );
}