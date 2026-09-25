import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock, Mail, MapPin } from 'lucide-react';
import RevealSection from '@/features/marketing/components/reveal-section';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';

const lunchCourses = [
    {
        course: 'First',
        title: 'Greens & Cold-Pressed Oil',
        detail: 'Crisp bitter leaves, lemon vinaigrette, rapeseed oil',
    },
    {
        course: 'Second',
        title: 'Morning Market Soup',
        detail: 'Simmered daily from early regional farm deliveries',
    },
    {
        course: 'Main',
        title: 'Roasted Heritage Bird',
        detail: 'Wood-fired crust, toasted sourdough, herb-salted pan jus',
    },
];

const dinnerCourses = [
    {
        course: 'To Start',
        title: 'Nordic Raw Fish',
        detail: 'Line-caught white fish, clear citrus broth, sea salt flakes',
    },
    {
        course: 'Pasta',
        title: 'Hand-Rolled Ribbons',
        detail: 'Daily pasta dough, wild herbs, brown butter reduction',
    },
    {
        course: 'Main',
        title: 'Carved Aged Beef',
        detail: 'Seared over birch embers, served to share for the table',
    },
    {
        course: 'Dessert',
        title: 'Dark Chocolate & Salt',
        detail: 'Whipped fresh cream, bittersweet cocoa, sea salt crystals',
    },
];

export default function Home() {
    return (
        <GuestLayout>
            <Head title="A table, when you want it | Halden" />

            {/* 1. HERO SECTION */}
            <section className="relative border-b border-[#dedbd3] bg-[#f8f7f3]">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                        {/* Copy Column */}
                        <div className="lg:col-span-6 xl:col-span-6">
                            <p className="text-xs font-semibold tracking-[0.2em] text-[#2f4a3c] uppercase">
                                Dining Room
                            </p>

                            <h1 className="mt-4 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                                A table, when you want it.
                            </h1>

                            <p className="mt-5 max-w-md text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                                Halden is one dining room of twenty seats. We
                                hold every table for two unhurried hours.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                                <Button
                                    nativeButton={false}
                                    render={<Link href={reserve.url()} />}
                                    className="group h-12 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wider text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 hover:shadow-xs active:scale-98 sm:h-13 sm:px-8 sm:text-xs"
                                >
                                    <span>Reserve a table</span>
                                    <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                                        <ArrowRight className="size-3.5" />
                                    </span>
                                </Button>

                                <a
                                    href="#menu"
                                    className="inline-flex items-center text-sm font-medium text-[#1d1d1d] underline-offset-6 transition-colors hover:text-[#2f4a3c] hover:underline"
                                >
                                    Seasonal menu
                                </a>
                            </div>

                            {/* Service Notes */}
                            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#dedbd3] pt-6 sm:mt-14 sm:gap-6">
                                <div>
                                    <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                        2 Hours
                                    </p>
                                    <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                        Held for your party
                                    </p>
                                </div>
                                <div>
                                    <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                        20 Seats
                                    </p>
                                    <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                        Single dining room
                                    </p>
                                </div>
                                <div>
                                    <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                        11:00 - 21:00
                                    </p>
                                    <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                        Daily service
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Architectural Photo Column */}
                        <div className="lg:col-span-6 xl:col-span-6">
                            <div className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-white p-2.5 shadow-2xs">
                                <div className="aspect-4/3 overflow-hidden rounded-xl bg-stone-100 sm:aspect-16/11">
                                    <img
                                        src="/images/dining-table.png"
                                        alt="A table set with natural linen, stoneware, and daylight at Halden"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-102"
                                    />
                                </div>
                            </div>
                            <p className="mt-2.5 text-center text-xs text-[#1d1d1d]/60 sm:text-left">
                                Table 2 set for midday service by the Mercer
                                Lane window.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. THE DINING ROOM (#story) */}
            <section
                id="story"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-[#f8f7f3] py-20 sm:py-28 lg:py-32"
            >
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <RevealSection className="mx-auto max-w-2xl text-center">
                        <h2 className="font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                            Welcome to the table.
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                            Halden was built around a simple hospitality
                            promise: one dining room, Swedish oak tables,
                            generous natural light, and uninterrupted time. We
                            do not rush tables or double-book seatings. When you
                            sit down, the table is yours.
                        </p>
                    </RevealSection>

                    <RevealSection className="mt-12 sm:mt-16">
                        <div className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-white p-2.5 shadow-2xs sm:p-3">
                            <div className="aspect-16/9 overflow-hidden rounded-xl bg-stone-100 sm:aspect-21/9">
                                <img
                                    src="/images/dining-room.png"
                                    alt="The Halden dining hall with oak furniture and daylight"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-102"
                                />
                            </div>
                        </div>
                        <p className="mt-3 text-center text-xs text-[#1d1d1d]/60">
                            The Halden room on Mercer Lane. Twenty seats total
                            across five tables.
                        </p>
                    </RevealSection>
                </div>
            </section>

            {/* 3. SEASONAL MENU (#menu) */}
            <section
                id="menu"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-white py-20 sm:py-28 lg:py-32"
            >
                <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
                    <RevealSection className="max-w-xl">
                        <p className="text-xs font-semibold tracking-[0.2em] text-[#2f4a3c] uppercase">
                            Seasonal Kitchen
                        </p>
                        <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                            Midday and evening service.
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80">
                            A focused menu prepared every morning from regional
                            coastal deliveries and seasonal foraged herbs.
                            Poured with natural ciders and minimal-intervention
                            wines.
                        </p>
                    </RevealSection>

                    {/* Integrated Photo Moment */}
                    <RevealSection className="mt-10 overflow-hidden rounded-2xl border border-[#dedbd3] bg-[#f8f7f3] p-2.5 shadow-2xs sm:mt-12 sm:p-3">
                        <div className="aspect-16/7 overflow-hidden rounded-xl bg-stone-100 sm:aspect-21/8">
                            <img
                                src="/images/lunch.png"
                                alt="Seasonal preparations from the Halden kitchen"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-102"
                            />
                        </div>
                    </RevealSection>

                    {/* Degustation Columns */}
                    <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Lunch Column */}
                        <RevealSection className="flex flex-col justify-between border-t border-[#dedbd3] pt-6 sm:pt-8">
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-heading text-2xl font-normal text-[#1d1d1d] sm:text-3xl">
                                        Lunch
                                    </h3>
                                    <span className="font-mono text-xs text-[#1d1d1d]/60">
                                        11:00 - 15:00
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-[#1d1d1d]/70">
                                    Three courses designed for midday rhythm.
                                </p>

                                <div className="mt-8 space-y-6">
                                    {lunchCourses.map((item) => (
                                        <div
                                            key={item.title}
                                            className="group border-b border-[#dedbd3]/60 pb-5 last:border-b-0"
                                        >
                                            <div className="flex items-center justify-between text-xs text-[#2f4a3c]">
                                                <span className="font-semibold uppercase">
                                                    {item.course}
                                                </span>
                                            </div>
                                            <h4 className="mt-1 font-heading text-lg font-medium text-[#1d1d1d]">
                                                {item.title}
                                            </h4>
                                            <p className="mt-1 text-sm text-[#1d1d1d]/75">
                                                {item.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealSection>

                        {/* Dinner Column */}
                        <RevealSection className="flex flex-col justify-between border-t border-[#dedbd3] pt-6 sm:pt-8">
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-heading text-2xl font-normal text-[#1d1d1d] sm:text-3xl">
                                        Dinner
                                    </h3>
                                    <span className="font-mono text-xs text-[#1d1d1d]/60">
                                        17:00 - 21:00
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-[#1d1d1d]/70">
                                    Four courses celebrating fire, broth, and
                                    evening conversation.
                                </p>

                                <div className="mt-8 space-y-6">
                                    {dinnerCourses.map((item) => (
                                        <div
                                            key={item.title}
                                            className="group border-b border-[#dedbd3]/60 pb-5 last:border-b-0"
                                        >
                                            <div className="flex items-center justify-between text-xs text-[#2f4a3c]">
                                                <span className="font-semibold uppercase">
                                                    {item.course}
                                                </span>
                                            </div>
                                            <h4 className="mt-1 font-heading text-lg font-medium text-[#1d1d1d]">
                                                {item.title}
                                            </h4>
                                            <p className="mt-1 text-sm text-[#1d1d1d]/75">
                                                {item.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* 4. THE LONG TABLE (#private) */}
            <section
                id="private"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-[#f8f7f3] py-20 sm:py-28 lg:py-32"
            >
                <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
                    <RevealSection className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="order-2 lg:order-1 lg:col-span-6">
                            <h2 className="font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                                The long table.
                            </h2>

                            <p className="mt-5 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                                Table 5 sits at the heart of the room, crafted
                                from solid Swedish white oak to seat up to six
                                guests. Built for family gatherings, quiet
                                milestones, and shared dishes.
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-[#1d1d1d]/75 sm:text-base">
                                No minimum spend, no separate tasting packages,
                                and no inquiry forms. You can book Table 5
                                directly online whenever available.
                            </p>

                            <div className="mt-8 border-t border-[#dedbd3] pt-6 sm:mt-10">
                                <Button
                                    nativeButton={false}
                                    render={
                                        <Link
                                            href={`${reserve.url()}?party_size=6`}
                                        />
                                    }
                                    className="group h-12 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wider text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 hover:shadow-xs active:scale-98"
                                >
                                    <span>Reserve Table 5 (Seats 6)</span>
                                    <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                                        <ArrowRight className="size-3.5" />
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 lg:col-span-6">
                            <div className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-white p-2.5 shadow-2xs">
                                <div className="aspect-4/3 overflow-hidden rounded-xl bg-stone-100 sm:aspect-16/11">
                                    <img
                                        src="/images/long-table.png"
                                        alt="The long table at Halden set for six guests"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-102"
                                    />
                                </div>
                            </div>
                            <p className="mt-2.5 text-center text-xs text-[#1d1d1d]/60 sm:text-left">
                                Table 5 in center room, prepared with natural
                                linen and six place settings.
                            </p>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* 5. VISIT & HOURS (#visit) */}
            <section
                id="visit"
                className="scroll-mt-16 border-b border-[#dedbd3] bg-white py-20 sm:py-28 lg:py-32"
            >
                <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
                    <RevealSection className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
                        {/* Host Image Column */}
                        <div className="lg:col-span-5">
                            <div className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-[#f8f7f3] p-2.5 shadow-2xs">
                                <div className="aspect-4/5 overflow-hidden rounded-xl bg-stone-100">
                                    <img
                                        src="/images/host.png"
                                        alt="Floor host welcoming guests at Halden"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-102"
                                    />
                                </div>
                            </div>
                            <p className="mt-2.5 text-xs text-[#1d1d1d]/60">
                                Maja Eklund, floor host on Mercer Lane.
                            </p>
                        </div>

                        {/* Hospitality Directory Column */}
                        <div className="lg:col-span-7">
                            <h2 className="font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                                Visit Halden.
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80">
                                One dining room on Mercer Lane. We look forward
                                to setting a place for you.
                            </p>

                            <div className="mt-10 space-y-8 border-t border-[#dedbd3] pt-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                                        <MapPin className="size-4 text-[#2f4a3c]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                            Address
                                        </p>
                                        <p className="mt-1 font-heading text-xl text-[#1d1d1d]">
                                            18 Mercer Lane
                                        </p>
                                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                            Two blocks from the old market
                                            square. Street and garage parking
                                            nearby.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                                        <Clock className="size-4 text-[#2f4a3c]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                            Service Hours
                                        </p>
                                        <p className="mt-1 font-heading text-xl text-[#1d1d1d]">
                                            11:00 - 21:00 Daily
                                        </p>
                                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                            Last seating at 19:00. Every booking
                                            includes a two-hour table hold.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                                        <Mail className="size-4 text-[#2f4a3c]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                            Inquiries
                                        </p>
                                        <a
                                            href="mailto:hello@halden.test"
                                            className="mt-1 inline-block font-heading text-xl text-[#1d1d1d] underline underline-offset-4 transition-colors hover:text-[#2f4a3c]"
                                        >
                                            hello@halden.test
                                        </a>
                                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                            Dietary preferences and party
                                            details are always welcome in
                                            advance.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-[#dedbd3] pt-6">
                                <Button
                                    nativeButton={false}
                                    render={<Link href={reserve.url()} />}
                                    className="h-12 w-full justify-center rounded-full bg-[#1f1d1b] text-xs font-semibold tracking-wider text-[#f8f7f3] uppercase shadow-xs transition-all hover:bg-[#1f1d1b]/90 sm:w-auto sm:px-8"
                                >
                                    <span>Check table availability</span>
                                    <ArrowRight className="ml-2 size-3.5" />
                                </Button>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* 6. CLOSING INVITATION BANNER */}
            <section className="bg-[#1f1d1b] text-[#f8f7f3]">
                <RevealSection>
                    <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-24">
                        <div className="max-w-xl">
                            <h2 className="font-heading text-3xl font-normal tracking-tight text-[#f8f7f3] sm:text-4xl lg:text-5xl">
                                Ready for a table?
                            </h2>
                            <p className="mt-3 text-base text-[#f8f7f3]/80 sm:text-lg">
                                Reserve your spot for lunch or dinner. Every
                                table is held for two full hours.
                            </p>
                        </div>
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="group h-12 shrink-0 rounded-full bg-[#f8f7f3] px-8 text-xs font-semibold tracking-wider text-[#1f1d1b] uppercase transition-all duration-300 hover:bg-white hover:shadow-lg active:scale-98 sm:h-13 sm:px-9"
                        >
                            <span>Reserve a table</span>
                            <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight className="size-3.5" />
                            </span>
                        </Button>
                    </div>
                </RevealSection>
            </section>
        </GuestLayout>
    );
}
