import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';

export default function Contact() {
    return (
        <GuestLayout>
            <Head title="Contact | Visit Halden" />

            <section className="bg-[#f8f7f3] py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Contact
                        </span>
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                            Visit Halden.
                        </h1>
                        <p className="animate-fade-slide-up animation-delay-200 mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            Lunch and dinner at 18 Mercer Lane. Last seating is
                            19:00.
                        </p>
                    </div>

                    {/* Featured Imagery Container */}
                    <div className="animate-fade-slide-up animation-delay-200 mt-10 border border-[#dedbd3] bg-white p-3 sm:mt-12 sm:p-4 lg:p-5">
                        <div className="overflow-hidden bg-[#f0eee6]">
                            <img
                                src="/images/host.png"
                                alt="A host welcoming guests at Halden"
                                className="h-64 w-full object-cover object-center sm:h-80 lg:h-[28rem]"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#1d1d1d]/60">
                            <span>The host</span>
                            <span>18 Mercer Lane</span>
                        </div>
                    </div>

                    {/* White Card */}
                    <div className="animate-fade-slide-up animation-delay-300 mt-10 border border-[#dedbd3] bg-white p-8 sm:mt-12 sm:p-12 lg:p-16">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
                            {/* Left: Contact & Hours Details */}
                            <div className="space-y-8 lg:col-span-7">
                                <div>
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Location
                                    </span>
                                    <p className="mt-2 font-heading text-2xl font-normal text-[#1d1d1d] sm:text-3xl">
                                        18 Mercer Lane
                                    </p>
                                    <p className="mt-1 text-sm text-[#1d1d1d]/75">
                                        One dining room. Daylight, oak wood, and
                                        linen.
                                    </p>
                                </div>

                                <div className="border-t border-[#dedbd3] pt-6">
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Hours & Seating
                                    </span>
                                    <p className="mt-2 font-heading text-2xl font-normal text-[#1d1d1d] sm:text-3xl">
                                        Lunch and dinner, 11:00 to 21:00
                                    </p>
                                    <p className="mt-1 text-sm text-[#1d1d1d]/75">
                                        Last seating 19:00. Every table is held
                                        for two hours.
                                    </p>
                                </div>

                                <div className="border-t border-[#dedbd3] pt-6">
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Direct Contact
                                    </span>
                                    <div className="mt-2">
                                        <a
                                            href="mailto:hello@halden.test"
                                            className="font-heading text-2xl font-normal text-[#1d1d1d] underline underline-offset-4 transition-colors hover:text-[#2f4a3c] sm:text-3xl"
                                        >
                                            hello@halden.test
                                        </a>
                                    </div>
                                    <p className="mt-1 text-sm text-[#1d1d1d]/75">
                                        For general questions or private dining
                                        inquiries by email.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Table Reservation Details */}
                            <div className="flex flex-col justify-between border-t border-[#dedbd3] pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10 lg:col-span-5 lg:pl-12">
                                <div>
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Reservations
                                    </span>
                                    <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                                        Join us
                                    </h2>
                                    <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/85">
                                        No contact form. A reservation is made
                                        on{' '}
                                        <Link
                                            href={reserve.url()}
                                            className="font-medium text-[#1d1d1d] underline underline-offset-4 transition-colors hover:text-[#2f4a3c]"
                                        >
                                            {reserve.url()}
                                        </Link>
                                        .
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-[#1d1d1d]/70">
                                        We hold each table for two hours so you
                                        can enjoy your meal without rush. Choose
                                        your date, party size, and hour to
                                        secure a table.
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 sm:mt-10">
                                    <Button
                                        nativeButton={false}
                                        render={<Link href={reserve.url()} />}
                                        className="group h-12 w-full justify-center rounded-full bg-[#1f1d1b] px-8 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 active:scale-98 sm:h-13 sm:text-sm"
                                    >
                                        <span>Reserve a table</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
