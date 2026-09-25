import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    about,
    contact,
    home,
    menu,
    privacy,
    privateMethod,
    reserve,
    terms,
} from '@/routes';

const links = [
    { href: menu.url(), label: 'Menu' },
    { href: privateMethod.url(), label: 'Private dining' },
    { href: about.url(), label: 'Our story' },
    { href: contact.url(), label: 'Contact' },
    { href: reserve.url(), label: 'Reservations' },
];

export default function GuestLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1f1d1b]/95 text-primary-foreground backdrop-blur-md transition-colors duration-200">
                <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:gap-8 lg:px-12 lg:py-4">
                    <Link
                        href={home.url()}
                        className="font-heading text-xl tracking-tight sm:text-2xl"
                    >
                        Halden
                    </Link>

                    <nav className="ml-auto hidden items-center gap-6 lg:flex">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="rounded-full bg-primary-foreground px-5 text-xs font-semibold tracking-wide text-primary uppercase hover:bg-primary-foreground/90"
                        >
                            Reserve
                        </Button>
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="h-9 rounded-full bg-primary-foreground px-3 text-[11px] font-semibold tracking-wide text-primary uppercase hover:bg-primary-foreground/90"
                        >
                            Reserve
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                            aria-expanded={open}
                            aria-label={open ? 'Close menu' : 'Menu'}
                            onClick={() => setOpen((current) => !current)}
                        >
                            {open ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>

                {open && (
                    <nav className="flex flex-col gap-4 px-6 pb-6 lg:hidden">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-white/15 bg-primary text-primary-foreground">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:px-14">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Link
                                href={home.url()}
                                className="font-heading text-2xl tracking-tight"
                            >
                                Halden
                            </Link>
                            <div className="mt-3 flex flex-col gap-1 text-sm text-primary-foreground/75">
                                <p>18 Mercer Lane</p>
                                <p>
                                    Lunch and dinner, 11:00 to 21:00. Last
                                    seating 19:00.
                                </p>
                            </div>
                        </div>

                        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Halden. All rights
                            reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href={terms.url()}
                                className="underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                            >
                                Terms
                            </Link>
                            <Link
                                href={privacy.url()}
                                className="underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                            >
                                Privacy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
