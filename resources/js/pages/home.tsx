import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';

const bands = [
    {
        title: 'Welcome to the table.',
        body: 'Halden is one dining room. Lunch and dinner, with every table held for two hours.',
        href: '/about',
        label: 'Our story',
        image: '/images/dining-room.png',
        alt: 'The Halden dining room in daylight',
    },
    {
        title: 'Reserve a table.',
        body: 'Choose a day, a party, and an hour. We hold the table for two hours.',
        href: '/reserve',
        label: 'Reserve',
        image: '/images/host.png',
        alt: 'A host beside a set table',
    },
    {
        title: 'Lunch and dinner.',
        body: 'A short menu, served from 11:00. The last seating is 19:00.',
        href: '/menu',
        label: 'See the menu',
        image: '/images/lunch.png',
        alt: 'A lunch plate on a linen table',
    },
    {
        title: 'The long table.',
        body: 'Table 5 seats six, in the room with everyone else.',
        href: '/private',
        label: 'Private dining',
        image: '/images/long-table.png',
        alt: 'A long table set for six',
    },
];

export default function Home() {
    return (
        <GuestLayout>
            <Head title="A table, when you want it" />

            <section className="grid lg:min-h-[calc(100vh-4.25rem)] lg:grid-cols-2">
                <div className="flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-24">
                    <h1 className="max-w-xl font-heading text-[2.25rem] leading-[1.02] font-normal tracking-tight sm:text-5xl lg:text-[4.75rem] lg:leading-[0.95] lg:tracking-[-0.03em]">
                        A table, when you want it.
                    </h1>
                    <p className="mt-5 max-w-md text-base leading-relaxed sm:mt-8 sm:text-lg">
                        Lunch and dinner at Halden. Last seating is 19:00.
                    </p>
                    <Button
                        nativeButton={false}
                        render={<Link href="/reserve" />}
                        className="mt-8 h-11 w-fit rounded-full px-6 text-xs font-semibold tracking-wide uppercase sm:mt-10 sm:h-12 sm:px-7 sm:text-sm"
                    >
                        Reserve
                    </Button>
                </div>
                <img
                    src="/images/dining-table.png"
                    alt="A Halden table set for lunch in daylight"
                    className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
                />
            </section>

            {bands.map((band, index) => (
                <section
                    key={band.title}
                    className="grid border-t border-[#dedbd3] lg:grid-cols-2"
                >
                    <div
                        className={`flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                    >
                        <h2 className="max-w-md font-heading text-[2rem] leading-[1.05] font-normal tracking-tight sm:text-5xl lg:text-6xl">
                            {band.title}
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed sm:mt-6 sm:text-lg">
                            {band.body}
                        </p>
                        <Link
                            href={band.href}
                            className="mt-6 inline-block w-fit text-sm underline underline-offset-4"
                        >
                            {band.label}
                        </Link>
                    </div>
                    <img
                        src={band.image}
                        alt={band.alt}
                        className="aspect-[16/10] w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[24rem]"
                    />
                </section>
            ))}

            <section className="bg-primary text-primary-foreground">
                <div className="flex w-full flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-24">
                    <h2 className="font-heading text-[2rem] leading-none font-normal tracking-tight sm:text-5xl lg:text-6xl">
                        Ready for a table?
                    </h2>
                    <Button
                        nativeButton={false}
                        render={<Link href="/reserve" />}
                        className="h-11 rounded-full bg-primary-foreground px-6 text-xs font-semibold tracking-wide text-primary uppercase hover:bg-primary-foreground/90"
                    >
                        Reserve
                    </Button>
                </div>
            </section>
        </GuestLayout>
    );
}
