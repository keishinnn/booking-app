import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';

export default function Private() {
    return (
        <GuestLayout>
            <Head title="Private dining | The long table" />

            <section className="bg-[#f8f7f3] py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Private dining
                        </span>
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                            The long table.
                        </h1>
                        <p className="animate-fade-slide-up animation-delay-200 mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            Table 5 seats six. We hold it for two hours, same as
                            every other table.
                        </p>
                    </div>

                    {/* Featured Imagery Container */}
                    <div className="animate-fade-slide-up animation-delay-200 mt-10 border border-[#dedbd3] bg-white p-3 sm:mt-12 sm:p-4 lg:p-5">
                        <div className="overflow-hidden bg-[#f0eee6]">
                            <img
                                src="/images/long-table.png"
                                alt="The long table at Halden set for six guests"
                                className="h-64 w-full object-cover object-center sm:h-80 lg:h-[26rem]"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#1d1d1d]/60">
                            <span>Table 5 · The dining room</span>
                            <span>Seats six</span>
                        </div>
                    </div>

                    {/* Editorial Content Cards */}
                    <div className="animate-fade-slide-up animation-delay-300 mt-10 grid grid-cols-1 gap-8 sm:mt-12 md:grid-cols-2">
                        {/* The Room */}
                        <div className="flex flex-col justify-between border border-[#dedbd3] bg-white p-8 sm:p-10 lg:p-12">
                            <div>
                                <div className="border-b border-[#dedbd3] pb-6">
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        The Room
                                    </span>
                                    <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                                        In the room.
                                    </h2>
                                </div>

                                <div className="mt-6 space-y-4 text-base leading-relaxed text-[#1d1d1d]/80">
                                    <p>
                                        Table 5 is in the dining room, not a
                                        separate salon or secluded back room.
                                        You share the energy, the natural
                                        daylight, and the quiet rhythm of
                                        service with the rest of the house.
                                    </p>
                                    <p>
                                        Set with comfortable oak chairs and
                                        linen, it gives a party of six ample
                                        space to sit together, share plates, and
                                        talk without being closed off from the
                                        room.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reservations */}
                        <div className="flex flex-col justify-between border border-[#dedbd3] bg-white p-8 sm:p-10 lg:p-12">
                            <div>
                                <div className="border-b border-[#dedbd3] pb-6">
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Reservations
                                    </span>
                                    <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                                        A party of six.
                                    </h2>
                                </div>

                                <div className="mt-6 space-y-4 text-base leading-relaxed text-[#1d1d1d]/80">
                                    <p>
                                        A guest books it the same way as any
                                        other table at Halden. There are no
                                        private dining inquiries to file, no
                                        fixed minimum spends, and no
                                        predetermined set menus.
                                    </p>
                                    <p>
                                        Simply choose your date and select a
                                        party of six. We hold the table for two
                                        hours, giving you the time to enjoy
                                        lunch or dinner at your own pace.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reserve Action */}
                    <div className="animate-fade-slide-up animation-delay-400 mt-12 flex flex-col items-center justify-center gap-3 text-center sm:mt-16">
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="group h-12 rounded-full bg-[#1f1d1b] px-8 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 active:scale-98 sm:h-13 sm:px-9 sm:text-sm"
                        >
                            <span>Reserve</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                        <p className="text-xs text-[#1d1d1d]/60">
                            Table 5 is held for two hours
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
