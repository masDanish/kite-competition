import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 px-6">

                {/* CARD */}
                <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">

                        <div className="text-6xl animate-bounce">🔑</div>

                        <h1 className="text-2xl font-bold mt-4 text-center">
                            Reset Your Password
                        </h1>

                        <p className="text-sm text-indigo-100 mt-2 text-center">
                            Create a new secure password for your account
                        </p>

                        <div className="mt-6 text-5xl opacity-20">
                            ✦ ✧ ✦
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-8">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Set New Password
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Please enter your new password below
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">

                            {/* EMAIL (readonly feel) */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <InputLabel htmlFor="password" value="New Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <TextInput
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-lg border-gray-200 focus:ring-indigo-500"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* BUTTON */}
                            <PrimaryButton
                                className="w-full bg-indigo-600 hover:bg-indigo-700 transition"
                                disabled={processing}
                            >
                                Reset Password
                            </PrimaryButton>

                        </form>
                    </div>

                </div>
            </div>
        </GuestLayout>
    );
}