import { Head, Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import GuestLayout from "@/layouts/guest-layout";

function RevealSection({
    children,
    className = "",
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 motion-reduce:opacity-100 motion-reduce:translate-y-0"
            } ${className}`}
        >
            {children}
        </div>
    );
}

const bands = [
    {
        tag: "01 / GUEST EXPERIENCE",
        title: "Reserve a table.",
        body: "Choose a day, a party, and an hour. We hold every table for two full hours, giving you the time to enjoy every course at your own pace.",
        href: "/reserve",
        label: "Reserve a table",
        image: "/images/host.png",
        alt: "A welcoming host preparing a table at Halden",
        badge: "Held for 2 hours",
    },
    {
        tag: "02 / THE KITCHEN",
        title: "Lunch and dinner.",
        body: "A focused seasonal menu served from 11:00 with last seating at 19:00. Honest preparations, daily market ingredients, and wine poured for the table.",
        href: "/menu",
        label: "See the menu",
        image: "/images/lunch.png",
        alt: "A seasonal lunch dish served on artisanal ceramic plate",
        badge: "11:00 – 21:00",
    },
    {
        tag: "03 / PRIVATE DINING",
        title: "The long table.",
        body: "Table 5 seats six, right in the warmth of the room. Built for celebrations, long stories, and shared plates with friends or family.",
        href: "/private",
        label: "Private dining",
        image: "/images/long-table.png",
        alt: "A long wooden dining table set for six guests with wine glasses",
        badge: "Seats up to 6",
    },
];

export default function Home() {
    return (
        <GuestLayout>
            <Head title="A table, when you want it" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#dedbd3] lg:min-h-[calc(100vh-4.25rem)]">
                <div className="grid lg:min-h-[calc(100vh-4.25rem)] lg:grid-cols-2">
                    {/* Left Hero Column */}
                    <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20 xl:px-20">
                        {/* Hero Headline */}
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-6 max-w-xl font-heading text-[2.75rem] leading-[1.02] font-normal tracking-tight sm:text-5xl lg:text-[4.5rem] lg:leading-[0.96] lg:tracking-[-0.03em]">
                            A table, when you want it.
                        </h1>

                        {/* Supporting Copy */}
                        <p className="animate-fade-slide-up animation-delay-200 mt-5 max-w-lg text-base leading-relaxed text-[#1d1d1d]/85 sm:mt-7 sm:text-lg">
                            Halden is one dining room in the city. We hold every
                            table for two hours, giving you the time to sit
                            down, share bread, and linger.
                        </p>

                        {/* Hero Actions */}
                        <div className="animate-fade-slide-up animation-delay-300 mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                            <Button
                                nativeButton={false}
                                render={<Link href="/reserve" />}
                                className="group h-12 rounded-full bg-[#1f1d1b] px-7 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 hover:shadow-md active:scale-98 sm:h-13 sm:px-8 sm:text-sm"
                            >
                                <span>Reserve a table</span>
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>

                            <Link
                                href="/menu"
                                className="inline-flex items-center text-sm font-medium text-[#1d1d1d] underline-offset-6 transition-colors hover:underline"
                            >
                                View the menu
                            </Link>
                        </div>

                        {/* Halden Service Pillars */}
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

                    {/* Right Hero Image */}
                    <div className="relative min-h-[22rem] overflow-hidden bg-[#f0eee6] sm:min-h-[28rem] lg:min-h-full">
                        <div className="group relative h-full w-full overflow-hidden">
                            <img
                                src="/images/dining-table.png"
                                alt="A Halden table set for lunch in daylight with linen and stoneware"
                                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-5 left-5 z-10 rounded-full border border-white/30 bg-[#1f1d1b]/75 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#f8f7f3] backdrop-blur-md">
                                Table 2 • Daylight by the window
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Welcome Band: The Halden Philosophy */}
            <section className="border-b border-[#dedbd3] bg-[#f8f7f3] py-16 sm:py-24 lg:py-28">
                <RevealSection className="mx-auto max-w-4xl px-5 text-center sm:px-8">
                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        The Dining Room
                    </span>
                    <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                        Welcome to the table.
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                        Halden is one dining room. Lunch and dinner, with every
                        table held for two hours. There is no second seating
                        waiting for your spot, so sit back and take your time.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/about"
                            className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-[#1d1d1d] underline underline-offset-6 transition-colors hover:text-[#2f4a3c]"
                        >
                            <span>Read our story</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </RevealSection>
            </section>

            {/* Storytelling Bands */}
            {bands.map((band, index) => {
                const isEven = index % 2 === 1;

                return (
                    <section
                        key={band.title}
                        className="border-b border-[#dedbd3] bg-[#f8f7f3]"
                    >
                        <div className="grid lg:grid-cols-2">
                            {/* Text Column */}
                            <div
                                className={`flex flex-col justify-center px-5 py-14 sm:px-8 sm:py-18 lg:px-14 lg:py-24 xl:px-20 ${
                                    isEven ? "lg:order-2" : ""
                                }`}
                            >
                                <RevealSection>
                                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                        {band.tag}
                                    </span>
                                    <h2 className="mt-3 max-w-md font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                                        {band.title}
                                    </h2>
                                    <p className="mt-5 max-w-md text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                                        {band.body}
                                    </p>
                                    <div className="mt-7">
                                        <Link
                                            href={band.href}
                                            className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-[#1d1d1d] underline underline-offset-6 transition-colors hover:text-[#2f4a3c]"
                                        >
                                            <span>{band.label}</span>
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </RevealSection>
                            </div>

                            {/* Image Column */}
                            <div
                                className={`relative min-h-[20rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[32rem] ${
                                    isEven ? "lg:order-1" : ""
                                }`}
                            >
                                <RevealSection className="h-full w-full">
                                    <div className="group relative h-full w-full overflow-hidden">
                                        <img
                                            src={band.image}
                                            alt={band.alt}
                                            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
                                        />
                                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                                        <div className="absolute top-4 right-4 z-10 rounded-full border border-white/30 bg-[#1f1d1b]/70 px-3 py-1 text-xs font-medium text-[#f8f7f3] backdrop-blur-md">
                                            {band.badge}
                                        </div>
                                    </div>
                                </RevealSection>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Atmosphere Spotlight: Dining Room */}
            <section className="border-b border-[#dedbd3] bg-[#f8f7f3] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <RevealSection className="overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-xs">
                        <div className="grid lg:grid-cols-12">
                            <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-5 lg:p-14">
                                <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                    The Space
                                </span>
                                <h3 className="mt-3 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl lg:text-4xl">
                                    A single dining room built for conversation.
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-[#1d1d1d]/85 sm:text-base">
                                    Warm oak wood, natural linen, and generous
                                    space between tables. Halden seats just
                                    twenty guests at any moment.
                                </p>
                                <div className="mt-6">
                                    <Button
                                        nativeButton={false}
                                        render={<Link href="/reserve" />}
                                        className="h-11 w-fit rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 active:scale-98"
                                    >
                                        Find your table
                                    </Button>
                                </div>
                            </div>

                            <div className="relative min-h-[18rem] overflow-hidden lg:col-span-7 lg:min-h-full">
                                <div className="group h-full w-full overflow-hidden">
                                    <img
                                        src="/images/dining-room.png"
                                        alt="The Halden dining room in daylight"
                                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
                                    />
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* Closing Call to Action */}
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
                                guarantee.
                            </p>
                        </div>
                        <Button
                            nativeButton={false}
                            render={<Link href="/reserve" />}
                            className="group h-12 shrink-0 rounded-full bg-primary-foreground px-8 text-xs font-semibold tracking-wide text-primary uppercase transition-all duration-300 hover:bg-primary-foreground/90 hover:shadow-lg active:scale-98 sm:h-13 sm:px-9 sm:text-sm"
                        >
                            <span>Reserve</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </div>
                </RevealSection>
            </section>
        </GuestLayout>
    );
}
