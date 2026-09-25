import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { home, reserve } from '@/routes';

export default function Terms() {
    return (
        <GuestLayout>
            <Head title="Terms of Reservation | Halden" />

            <section className="bg-[#f8f7f3] py-16 sm:py-24 lg:py-28">
                <div className="mx-auto max-w-3xl px-5 sm:px-8">
                    <p className="text-xs font-semibold tracking-wider text-[#2f4a3c] uppercase">
                        Dining Policy
                    </p>
                    <h1 className="mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem]">
                        Terms of reservation.
                    </h1>

                    <div className="mt-12 space-y-10 border-t border-[#dedbd3] pt-10 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                        <div>
                            <h2 className="font-heading text-xl text-[#1d1d1d] sm:text-2xl">
                                Two-Hour Table Hold
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/80 sm:text-base">
                                Each booking reserves a dedicated table for two
                                full hours from your seating time. We do not
                                rush our guests, and we ask that parties arrive
                                promptly so the kitchen can prepare each course
                                without delay.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-heading text-xl text-[#1d1d1d] sm:text-2xl">
                                Cancellations and Adjustments
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/80 sm:text-base">
                                Because Halden has only five tables, advance
                                notice of cancellations allows another party to
                                join us. You may modify your reservation time or
                                guest count subject to room availability.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-heading text-xl text-[#1d1d1d] sm:text-2xl">
                                Dietary Notes and Special Requests
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/80 sm:text-base">
                                We cater gladly to pescatarian, vegetarian, and
                                common allergy preferences with advance notice.
                                Direct notes can be submitted during booking or
                                sent to hello@halden.test.
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
