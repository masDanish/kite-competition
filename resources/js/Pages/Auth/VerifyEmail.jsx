import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 px-4">

                <div className="w-full max-w-md bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 text-center animate-fade">

                    {/* ICON */}
                    <div className="text-5xl">📧</div>

                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-gray-800 mt-3">
                        Verify Your Email
                    </h1>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Thanks for signing up! Before getting started, please verify your email address
                        by clicking the link we just sent you.
                    </p>

                    {/* STATUS */}
                    {status === 'verification-link-sent' && (
                        <div className="mt-4 text-sm text-green-600 bg-green-50 border border-green-200 p-2 rounded-lg">
                            A new verification link has been sent to your email.
                        </div>
                    )}

                    {/* ACTIONS */}
                    <form onSubmit={submit} className="mt-6 space-y-4">

                        <PrimaryButton
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 transition"
                        >
                            Resend Verification Email
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full text-sm text-gray-500 hover:text-indigo-600 transition underline"
                        >
                            Log Out
                        </Link>

                    </form>

                </div>

            </div>
        </GuestLayout>
    );
}