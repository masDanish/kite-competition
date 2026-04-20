import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 px-6">

                {/* CARD */}
                <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">

                    {/* LEFT SIDE (branding) */}
                    <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">

                        <div className="text-6xl animate-bounce">🔐</div>

                        <h1 className="text-2xl font-bold mt-4 text-center">
                            Reset Password
                        </h1>

                        <p className="text-sm text-indigo-100 mt-2 text-center">
                            We will send you a secure link to reset your password
                        </p>

                        <div className="mt-6 text-5xl opacity-20">
                            ✦ ✧ ✦
                        </div>
                    </div>

                    {/* RIGHT SIDE (form) */}
                    <div className="p-8">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Forgot Password?
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Enter your email to receive reset link
                        </p>

                        {status && (
                            <div className="mt-3 text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-4">

                            {/* INFO TEXT */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Don’t worry, we’ll send a password reset link to your email.
                            </p>

                            {/* EMAIL */}
                            <div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Enter your email"
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* BUTTON */}
                            <PrimaryButton
                                className="w-full bg-indigo-600 hover:bg-indigo-700 transition"
                                disabled={processing}
                            >
                                Send Reset Link
                            </PrimaryButton>

                            {/* BACK LINK */}
                            <div className="text-center text-sm mt-3">
                                <Link
                                    href={route('login')}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Back to login
                                </Link>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </GuestLayout>
    );
}