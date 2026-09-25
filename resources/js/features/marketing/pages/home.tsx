import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock, Mail, MapPin } from 'lucide-react';
import RevealSection from '@/features/marketing/components/reveal-section';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';

const lunchItems = [
    { name: 'Greens', line: 'Leaves, lemon, cold-pressed rapeseed oil' },
    { name: 'Market soup', line: 'Prepared fresh from morning delivery' },
    {
        name: 'Roast Chicken',
        line: 'Heritage bird, sourdough bread, crisp bitter salad',
    },
];

const dinnerItems = [
    { name: 'Nordic Crudo', line: 'White fish, citrus broth, sea salt' },
    {
        name: 'Daily Pasta',
        line: 'Hand-rolled ribbons, seasonal sauce of the day',
    },
    { name: 'Aged Steak', line: 'Carved for the table to share, herb butter' },
    { name: 'Dark Chocolate', line: 'Whipped cream, sea salt, quiet finish' },
];

export default function Home() {
    return (
        <GuestLayout>
            <Head title="A table, when you want it | Halden" />

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden border-b border-[#dedbd3] lg:min-h-[calc(100vh-4.25rem)]">
                <div className="grid lg:min-h-[calc(100vh-4.25rem)] lg:grid-cols-2">
                    <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20 xl:px-20">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Nordic Dining • 18 Mercer Lane
                        </span>

                        <h1 className="animate-fade-slide-up animation-delay-100 mt-4 max-w-xl font-heading text-[2.75rem] leading-[1.02] font-normal tracking-tight sm:text-5xl lg:text-[4.5rem] lg:leading-[0.96] lg:tracking-[-0.03em]">
                            A table, when you want it.
                        </h1>

                        <p className="animate-fade-slide-up animation-delay-200 mt-5 max-w-lg text-base leading-relaxed text-[#1d1d1d]/85 sm:mt-7 sm:text-lg">
                            Halden is one dining room in the city. We hold every
                            table for two hours, giving you the time to sit
                            down, share bread, and linger.
                        </p>

                        <div className="animate-fade-slide-up animation-delay-300 mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                            <Button
                                nativeButton={false}
                                render={<Link href={reserve.url()} />}
                                className="group h-12 rounded-full bg-[#1f1d1b] px-7 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 hover:shadow-md active:scale-98 sm:h-13 sm:px-8 sm:text-sm"
                            >
                                <span>Reserve a table</span>
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>

                            <a
                                href="#menu"
                                className="inline-flex items-center text-sm font-medium text-[#1d1d1d] underline-offset-6 transition-colors hover:text-[#2f4a3c] hover:underline"
                            >
                                View seasonal menu
                            </a>
                        </div>

                        <div className="animate-fade-slide-up animation-delay-400 mt-12 grid grid-cols-3 gap-3 border-t border-[#dedbd3] pt-6 sm:mt-16 sm:gap-6">
                            <div>
                                <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                    2 Hours
                                </p>
                                <p className="mt-0.5 text-xs text-[#1d1d1d]/70">
                                    Held for you
                                </p>
                            </div>
                            <div>
                                <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                    5 Tables
                                </p>
                                <p className="mt-0.5 text-xs text-[#1d1d1d]/70">
                                    Single room
                                </p>
                            </div>
                            <div>
                                <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                    11 – 21:00
                                </p>
                                <p className="mt-0.5 text-xs text-[#1d1d1d]/70">
                                    Daily service
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-[22rem] overflow-hidden bg-[#f0eee6] sm:min-h-[28rem] lg:min-h-full">
                        <div className="group relative h-full w-full overflow-hidden">
                            <img
                                src="/images/dining-table.png"
                                alt="A Halden table set for dining with natural linen and stoneware"
                                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />
                            <div className="absolute bottom-5 left-5 z-10 rounded-full border border-white/30 bg-[#1f1d1b]/80 px-4 py-1.5 text-xs font-medium tracking-wide text-[#f8f7f3] backdrop-blur-md">
                                Table 2 • Natural daylight by the window
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. OUR STORY SECTION (#story) */}
            <section
                id="story"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-[#f8f7f3] py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <RevealSection className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            01 / The Dining Room
                        </span>
                        <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                            Welcome to the table.
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                            Halden is one dining room. A quiet sanctuary built
                            with Swedish oak wood, natural linen, and generous
                            daylight. We seat just twenty guests at any moment,
                            with no second seating waiting for your table so you
                            can linger over bread and wine.
                        </p>
                    </RevealSection>

                    {/* Featured Photo Frame */}
                    <RevealSection className="mt-12 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white p-3 shadow-xs sm:p-4">
                        <div className="aspect-16/9 overflow-hidden rounded-xl bg-[#f0eee6] sm:aspect-21/9">
                            <img
                                src="/images/dining-room.png"
                                alt="The Halden dining room in daylight"
                                className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-103"
                            />
                        </div>
                        <div className="mt-3 flex items-center justify-between px-2 text-xs text-[#1d1d1d]/60">
                            <span>Main Dining Hall • 20 Seats Maximum</span>
                            <span>18 Mercer Lane</span>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* 3. SEASONAL MENU SECTION (#menu) */}
            <section
                id="menu"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-white py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <RevealSection className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            02 / The Kitchen
                        </span>
                        <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                            Lunch and dinner.
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            A focused seasonal menu served daily from 11:00.
                            Last seating at 19:00. Honest Nordic preparations,
                            local market ingredients, and wine poured for the
                            table.
                        </p>
                    </RevealSection>

                    {/* Editorial Food Photo Banner */}
                    <RevealSection className="mt-10 overflow-hidden rounded-2xl border border-[#dedbd3] bg-[#f0eee6] shadow-xs">
                        <img
                            src="/images/lunch.png"
                            alt="Seasonal dishes served at Halden"
                            className="h-64 w-full object-cover object-center sm:h-80 lg:h-[24rem]"
                        />
                    </RevealSection>

                    {/* Menu Cards */}
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Lunch Card */}
                        <RevealSection className="flex flex-col justify-between rounded-2xl border border-[#dedbd3] bg-[#f8f7f3] p-8 shadow-xs sm:p-10">
                            <div>
                                <div className="flex items-center justify-between border-b border-[#dedbd3] pb-5">
                                    <div>
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                            Midday Service
                                        </span>
                                        <h3 className="mt-1 font-heading text-2xl font-normal text-[#1d1d1d]">
                                            Lunch
                                        </h3>
                                    </div>
                                    <span className="font-mono text-xs text-[#1d1d1d]/60">
                                        11:00 – 15:00
                                    </span>
                                </div>

                                <ul className="mt-6 space-y-6">
                                    {lunchItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex flex-col"
                                        >
                                            <span className="font-heading text-lg font-medium text-[#1d1d1d]">
                                                {item.name}
                                            </span>
                                            <span className="mt-1 text-sm text-[#1d1d1d]/75">
                                                {item.line}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </RevealSection>

                        {/* Dinner Card */}
                        <RevealSection className="flex flex-col justify-between rounded-2xl border border-[#dedbd3] bg-[#f8f7f3] p-8 shadow-xs sm:p-10">
                            <div>
                                <div className="flex items-center justify-between border-b border-[#dedbd3] pb-5">
                                    <div>
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                            Evening Service
                                        </span>
                                        <h3 className="mt-1 font-heading text-2xl font-normal text-[#1d1d1d]">
                                            Dinner
                                        </h3>
                                    </div>
                                    <span className="font-mono text-xs text-[#1d1d1d]/60">
                                        17:00 – 21:00
                                    </span>
                                </div>

                                <ul className="mt-6 space-y-6">
                                    {dinnerItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className="flex flex-col"
                                        >
                                            <span className="font-heading text-lg font-medium text-[#1d1d1d]">
                                                {item.name}
                                            </span>
                                            <span className="mt-1 text-sm text-[#1d1d1d]/75">
                                                {item.line}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* 4. THE LONG TABLE / PRIVATE DINING (#private) */}
            <section
                id="private"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-[#f8f7f3] py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <RevealSection className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-xs">
                        <div className="grid lg:grid-cols-12">
                            <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-6 lg:p-14">
                                <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                    03 / Private Dining
                                </span>
                                <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl">
                                    The long table.
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-[#1d1d1d]/85 sm:text-base">
                                    Table 5 seats six, placed right in the
                                    warmth of the room. Built for celebrations,
                                    long stories, and shared plates with friends
                                    or family.
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-[#1d1d1d]/75">
                                    No minimum spends, no fixed tasting
                                    requirements, and no inquiries to file. Book
                                    Table 5 directly for a party of six just
                                    like any other table.
                                </p>

                                <div className="mt-6 border-t border-[#dedbd3] pt-4">
                                    <Button
                                        nativeButton={false}
                                        render={<Link href={reserve.url()} />}
                                        className="h-11 w-fit rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase shadow-xs transition-all hover:bg-[#1f1d1b]/90"
                                    >
                                        Reserve Table 5
                                    </Button>
                                </div>
                            </div>

                            <div className="relative min-h-[18rem] overflow-hidden bg-stone-100 lg:col-span-6 lg:min-h-full">
                                <img
                                    src="/images/long-table.png"
                                    alt="The long table at Halden set for six guests"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-xs">
                                    Table 5 • Seats up to 6
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* 5. VISIT, HOURS & CONTACT (#visit) */}
            <section
                id="visit"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-white py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <RevealSection className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            04 / Location & Hours
                        </span>
                        <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                            Visit Halden.
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            One dining room at 18 Mercer Lane. Daylight, oak
                            wood, and honest hospitality.
                        </p>
                    </RevealSection>

                    <RevealSection className="mt-10 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-xs">
                        <div className="grid grid-cols-1 divide-y divide-[#dedbd3] md:grid-cols-12 md:divide-x md:divide-y-0">
                            {/* Host image */}
                            <div className="relative aspect-square overflow-hidden bg-stone-100 sm:aspect-auto sm:min-h-[22rem] md:col-span-5">
                                <img
                                    src="/images/host.png"
                                    alt="A host welcoming guests at Halden"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-3 left-3 rounded-full bg-[#1f1d1b]/80 px-3 py-1 text-xs text-white backdrop-blur-xs">
                                    Floor Host on Duty • Maja Eklund
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex flex-col justify-between space-y-6 p-8 sm:p-10 md:col-span-7">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3.5">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                                            <MapPin className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                                Address
                                            </p>
                                            <p className="mt-0.5 font-heading text-lg text-[#1d1d1d]">
                                                18 Mercer Lane
                                            </p>
                                            <p className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                Near the market square • Street
                                                parking available
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                                            <Clock className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                                Service Hours
                                            </p>
                                            <p className="mt-0.5 font-heading text-lg text-[#1d1d1d]">
                                                11:00 – 21:00 daily
                                            </p>
                                            <p className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                Last seating 19:00 • 2-hour
                                                window guaranteed
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3.5">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                                            <Mail className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                                Direct Contact
                                            </p>
                                            <a
                                                href="mailto:hello@halden.test"
                                                className="mt-0.5 block font-heading text-lg text-[#1d1d1d] underline underline-offset-4 transition-colors hover:text-[#2f4a3c]"
                                            >
                                                hello@halden.test
                                            </a>
                                            <p className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                For special dietary inquiries
                                                and party arrangements
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#dedbd3]/70 pt-4">
                                    <Button
                                        nativeButton={false}
                                        render={<Link href={reserve.url()} />}
                                        className="h-11 w-full justify-center rounded-full bg-[#1f1d1b] text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase shadow-xs transition-all hover:bg-[#1f1d1b]/90"
                                    >
                                        <span>Find a table</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* 6. CLOSING INVITATION BANNER */}
            <section className="bg-primary text-primary-foreground">
                <RevealSection>
                    <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-24">
                        <div className="max-w-xl">
                            <h2 className="font-heading text-3xl leading-tight font-normal tracking-tight sm:text-4xl lg:text-5xl">
                                Ready for a table?
                            </h2>
                            <p className="mt-3 text-base text-primary-foreground/80 sm:text-lg">
                                Reserve your spot for lunch or dinner. Every
                                reservation includes our two-hour table
                                guarantee with no rush.
                            </p>
                        </div>
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="group h-12 shrink-0 rounded-full bg-primary-foreground px-8 text-xs font-semibold tracking-wide text-primary uppercase transition-all duration-300 hover:bg-primary-foreground/90 hover:shadow-lg active:scale-98 sm:h-13 sm:px-9 sm:text-sm"
                        >
                            <span>Reserve your table</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </div>
                </RevealSection>
            </section>
        </GuestLayout>
    );
}
