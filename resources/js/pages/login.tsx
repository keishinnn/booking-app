import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';

type LoginPageProps = {
    error?: string;
};

export default function Login({ error }: LoginPageProps) {
    const page = usePage<{ flash?: { error?: string | null } }>();
    const flashError = error || page.props.flash?.error;

    return (
        <GuestLayout>
            <Head title="Staff Login | Halden" />

            <section className="min-h-[calc(100vh-4.25rem)] bg-[#f8f7f3]">
                <div className="mx-auto max-w-xl px-5 py-16 sm:py-20 lg:py-24">
                    {/* Editorial Header */}
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Floor Access
                        </span>
                        <h1 className="mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl">
                            Staff portal.
                        </h1>
                        <p className="mt-3 text-base leading-relaxed text-[#1d1d1d]/80">
                            Sign in to manage floor reservations, seatings, and table status.
                        </p>
                    </div>

                    {/* Centered Login Card */}
                    <div className="mt-10 border border-[#dedbd3] bg-white p-8 shadow-none sm:p-10">
                        <Form action="/login" method="post" className="space-y-6">
                            {({ errors, processing }) => {
                                const generalError =
                                    (errors as Record<string, string>).error ||
                                    flashError;

                                return (
                                    <>
                                        {generalError && (
                                            <div className="border border-[#8a4b3b]/30 bg-[#8a4b3b]/10 p-4 text-[#8a4b3b]">
                                                <p className="text-xs font-medium text-[#8a4b3b]">
                                                    {generalError}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="staff@halden.test"
                                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                            />
                                            {errors.email && (
                                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                            />
                                            {errors.password && (
                                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                name="remember"
                                                className="h-4 w-4 cursor-pointer rounded-none border border-[#dedbd3] accent-[#1f1d1b] focus:ring-0 focus:outline-none"
                                            />
                                            <label
                                                htmlFor="remember"
                                                className="cursor-pointer text-xs text-[#1d1d1d]/80 select-none"
                                            >
                                                Keep me signed in on this device
                                            </label>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 w-full rounded-full bg-[#1f1d1b] text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 disabled:opacity-50"
                                        >
                                            {processing ? 'Signing in...' : 'Sign in'}
                                        </Button>

                                        <div className="mt-6 border border-[#dedbd3] bg-[#f8f7f3] p-4 text-xs text-[#1d1d1d]/75">
                                            Demo floor access: staff@halden.test / password
                                        </div>
                                    </>
                                );
                            }}
                        </Form>
                    </div>

                    {/* Navigation Link below Card */}
                    <div className="mt-8 text-center text-sm text-[#1d1d1d]/75">
                        Looking for a table?{' '}
                        <Link
                            href="/"
                            className="font-medium text-[#1d1d1d] underline underline-offset-4 transition-colors hover:text-[#2f4a3c]"
                        >
                            Return to Halden dining room
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
