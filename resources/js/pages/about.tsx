import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import GuestLayout from '@/layouts/guest-layout';

export default function About() {
    return (
        <GuestLayout>
            <Head title="Our story | Welcome to the table" />

            <section className="bg-[#f8f7f3] py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Our story
                        </span>
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                            Welcome to the table.
                        </h1>
                    </div>

                    {/* Featured Imagery Container */}
                    <div className="animate-fade-slide-up animation-delay-200 mt-10 border border-[#dedbd3] bg-white p-3 sm:p-4 lg:p-5 sm:mt-12">
                        <div className="overflow-hidden bg-[#f0eee6]">
                            <img
                                src="/images/dining-room.png"
                                alt="The Halden dining room set with oak wood and linen-covered tables in natural daylight"
                                className="h-64 w-full object-cover object-center sm:h-80 lg:h-[28rem]"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#1d1d1d]/60">
                            <span>The dining room</span>
                            <span>18 Mercer Lane</span>
                        </div>
                    </div>

                    {/* Editorial Story Narrative */}
                    <div className="animate-fade-slide-up animation-delay-300 mt-10 border border-[#dedbd3] bg-white p-8 sm:p-12 lg:p-16 sm:mt-12">
                        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg sm:leading-relaxed">
                            <p>
                                Halden is one dining room. A quiet room built with oak wood, linen-covered tables, and natural daylight.
                            </p>
                            <p>
                                Service runs from 11:00 to 21:00. A reservation holds a table for two hours, and the last seating is 19:00.
                            </p>
                            <p>
                                Every table is held for two full hours with no rush, no second seatings breathing down your neck, so you can linger over bread and wine.
                            </p>
                        </div>

                        <div className="mt-10 border-t border-[#dedbd3] pt-6 sm:mt-12 sm:pt-8">
                            <Link
                                href="/reserve"
                                className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-[#1d1d1d] underline underline-offset-6 transition-colors hover:text-[#2f4a3c]"
                            >
                                <span>Reserve a table</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
