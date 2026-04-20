import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6">

                    {/* PROFILE INFO */}
                    <div className="bg-white/70 backdrop-blur-xl 
                                    shadow-lg rounded-2xl border p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Profile Information
                        </h3>

                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="bg-white/70 backdrop-blur-xl 
                                    shadow-lg rounded-2xl border p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Update Password
                        </h3>

                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>

                    {/* DELETE */}
                    <div className="bg-white/70 backdrop-blur-xl 
                                    shadow-lg rounded-2xl border p-6">
                        <h3 className="text-lg font-semibold text-red-600 mb-4">
                            Delete Account
                        </h3>

                        <DeleteUserForm className="max-w-2xl" />
                    </div>

                </div>
            </div>

        </AuthenticatedLayout>
    );
}