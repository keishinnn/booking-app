import { Form, Head } from '@inertiajs/react';
import StaffLayout from '@/shared/layouts/staff-layout';
import { destroy, update } from '@/routes/profile';
import { update as updatePassword } from '@/routes/profile/password';

type ProfileProps = {
    profile: {
        name: string;
        email: string;
        role: 'staff' | 'admin';
        is_only_admin: boolean;
    };
};

const fieldClass =
    'w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none';

const labelClass =
    'mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase';

export default function Profile({ profile }: ProfileProps) {
    const roleLabel = profile.role === 'admin' ? 'Admin' : 'Floor staff';

    return (
        <StaffLayout>
            <Head title="Profile | Halden" />

            <div>
                <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                    Account
                </p>
                <h1 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                    Your profile
                </h1>
                <p className="mt-2 max-w-xl text-sm text-[#1d1d1d]/70">
                    Update the name and email used to sign in, or change your
                    password.
                </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <section className="border border-[#dedbd3] bg-white p-6 sm:p-8">
                    <h2 className="font-heading text-2xl text-[#1d1d1d]">
                        Details
                    </h2>
                    <p className="mt-1 text-sm text-[#1d1d1d]/70">
                        Signed in as {roleLabel}.
                    </p>

                    <Form
                        key={`${profile.name}-${profile.email}`}
                        {...update.form()}
                        className="mt-6 space-y-5"
                        options={{ preserveScroll: true }}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div>
                                    <label
                                        htmlFor="profile-name"
                                        className={labelClass}
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="profile-name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        defaultValue={profile.name}
                                        className={fieldClass}
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="profile-email"
                                        className={labelClass}
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="profile-email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        defaultValue={profile.email}
                                        className={fieldClass}
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-opacity disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Saving…'
                                            : 'Save profile'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                <section className="border border-[#dedbd3] bg-white p-6 sm:p-8">
                    <h2 className="font-heading text-2xl text-[#1d1d1d]">
                        Password
                    </h2>
                    <p className="mt-1 text-sm text-[#1d1d1d]/70">
                        Use at least 8 characters.
                    </p>

                    <Form
                        {...updatePassword.form()}
                        errorBag="updatePassword"
                        resetOnSuccess
                        className="mt-6 space-y-5"
                        options={{ preserveScroll: true }}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div>
                                    <label
                                        htmlFor="current-password"
                                        className={labelClass}
                                    >
                                        Current password
                                    </label>
                                    <input
                                        id="current-password"
                                        name="current_password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className={fieldClass}
                                    />
                                    {errors.current_password && (
                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                            {errors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="new-password"
                                        className={labelClass}
                                    >
                                        New password
                                    </label>
                                    <input
                                        id="new-password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={8}
                                        autoComplete="new-password"
                                        className={fieldClass}
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="new-password-confirmation"
                                        className={labelClass}
                                    >
                                        Confirm new password
                                    </label>
                                    <input
                                        id="new-password-confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        className={fieldClass}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-opacity disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Saving…'
                                            : 'Update password'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>
            </div>

            <section className="mt-6 border border-[#8a4b3b]/30 bg-white p-6 sm:p-8">
                <h2 className="font-heading text-2xl text-[#8a4b3b]">
                    Delete account
                </h2>
                {profile.is_only_admin ? (
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#1d1d1d]/75">
                        This is the last admin account, so it cannot be deleted.
                        Create another admin before removing this one.
                    </p>
                ) : (
                    <>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#1d1d1d]/75">
                            Deleting your account signs you out immediately.
                            Enter your current password to confirm.
                        </p>
                        <Form
                            {...destroy.form()}
                            errorBag="deleteProfile"
                            className="mt-6 max-w-md space-y-5"
                            options={{ preserveScroll: true }}
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label
                                            htmlFor="delete-password"
                                            className={labelClass}
                                        >
                                            Current password
                                        </label>
                                        <input
                                            id="delete-password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            className={fieldClass}
                                        />
                                        {errors.password && (
                                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 rounded-full bg-[#8a4b3b] px-6 text-xs font-semibold tracking-wide text-white uppercase transition-opacity disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Deleting…'
                                            : 'Delete account'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </>
                )}
            </section>
        </StaffLayout>
    );
}
