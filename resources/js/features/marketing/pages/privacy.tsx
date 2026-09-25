import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { home, reserve } from '@/routes';

export default function Privacy() {
    return (
        <GuestLayout>
            <Head title="Privacy Policy | Halden" />

            <section className="bg-[#f8f7f3] py-16 sm:py-24 lg:py-28">
                <div className="mx-auto max-w-3xl px-5 sm:px-8">
                    <p className="text-xs font-semibold tracking-wider text-[#2f4a3c] uppercase">
                        Guest Care
                    </p>
                    <h1 className="mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem]">
                        Privacy policy.
                    </h1>

                    <div className="mt-12 space-y-10 border-t border-[#dedbd3] pt-10 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                        <div>
                            <h2 className="font-heading text-xl text-[#1d1d1d] sm:text-2xl">
                                Information We Hold
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/80 sm:text-base">
                                When you reserve a table at Halden, we store
                                your full name, email address, phone number,
                                party size, reservation date, seating time, and
                                any optional dietary requests you provide.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-heading text-xl text-[#1d1d1d] sm:text-2xl">
                                How Information Is Used
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/80 sm:text-base">
                                Your information is used strictly to confirm
                                your booking, prepare the kitchen for special
                                requests, and contact you if dining arrangements
                                change. We do not sell, rent, or share guest
                                contact details with third-party marketers.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-heading text-xl text-[#1d1d1d] sm:text-2xl">
                                Data Inquiries
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/80 sm:text-base">
                                If you would like us to review, update, or
                                delete your contact record after your visit,
                                please contact us directly at hello@halden.test.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[#dedbd3] pt-8">
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="group h-12 rounded-full bg-[#1f1d1b] px-7 text-xs font-semibold tracking-wider text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 active:scale-98"
                        >
                            <span>Reserve a table</span>
                            <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight className="size-3.5" />
                            </span>
                        </Button>

                        <Link
                            href={home.url()}
                            className="text-sm font-medium text-[#1d1d1d] underline underline-offset-6 transition-colors hover:text-[#2f4a3c]"
                        >
                            Back to Halden
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
