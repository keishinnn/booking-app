import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';

const lunchItems = [
    { name: 'Greens', line: 'Leaves, lemon, oil' },
    { name: 'Market soup', line: 'Whatever came in this morning' },
    { name: 'Chicken', line: 'Roast, bread, a green salad' },
];

const dinnerItems = [
    { name: 'Crudo', line: 'Citrus, salt' },
    { name: 'Pasta', line: 'The sauce of the day' },
    { name: 'Steak', line: 'For the table to share' },
    { name: 'Chocolate', line: 'A small finish' },
];

export default function Menu() {
    return (
        <GuestLayout>
            <Head title="Menu | Lunch and dinner" />

            <section className="bg-[#f8f7f3] py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            The Kitchen
                        </span>
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                            Lunch and dinner.
                        </h1>
                        <p className="animate-fade-slide-up animation-delay-200 mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            Served from 11:00. Last seating is 19:00.
                        </p>
                    </div>

                    {/* Editorial Photo Banner */}
                    <div className="animate-fade-slide-up animation-delay-200 mt-10 overflow-hidden border border-[#dedbd3] bg-[#f0eee6] sm:mt-12">
                        <img
                            src="/images/lunch.png"
                            alt="A seasonal lunch dish served on an artisanal ceramic plate at Halden"
                            className="h-64 w-full object-cover object-center sm:h-80 lg:h-[26rem]"
                        />
                    </div>

                    {/* Menu Cards */}
                    <div className="animate-fade-slide-up animation-delay-300 mt-10 grid grid-cols-1 gap-8 sm:mt-12 md:grid-cols-2">
                        {/* Lunch Card */}
                        <div className="flex flex-col justify-between border border-[#dedbd3] bg-white p-8 sm:p-10 lg:p-12">
                            <div>
                                <div className="border-b border-[#dedbd3] pb-6">
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Service
                                    </span>
                                    <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                                        Lunch
                                    </h2>
                                </div>

                                <ul className="mt-8 space-y-8">
                                    {lunchItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex flex-col"
                                        >
                                            <span className="font-heading text-lg font-normal text-[#1d1d1d] sm:text-xl">
                                                {item.name}
                                            </span>
                                            <span className="mt-1.5 text-sm leading-relaxed text-[#1d1d1d]/75">
                                                {item.line}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Dinner Card */}
                        <div className="flex flex-col justify-between border border-[#dedbd3] bg-white p-8 sm:p-10 lg:p-12">
                            <div>
                                <div className="border-b border-[#dedbd3] pb-6">
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        Service
                                    </span>
                                    <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                                        Dinner
                                    </h2>
                                </div>

                                <ul className="mt-8 space-y-8">
                                    {dinnerItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex flex-col"
                                        >
                                            <span className="font-heading text-lg font-normal text-[#1d1d1d] sm:text-xl">
                                                {item.name}
                                            </span>
                                            <span className="mt-1.5 text-sm leading-relaxed text-[#1d1d1d]/75">
                                                {item.line}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
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
                            <span>Reserve a table</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                        <p className="text-xs text-[#1d1d1d]/60">
                            Each table is held for two hours
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
