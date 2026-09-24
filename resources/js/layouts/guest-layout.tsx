import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const links = [
    { href: '/menu', label: 'Menu' },
    { href: '/private', label: 'Private dining' },
    { href: '/about', label: 'Our story' },
    { href: '/contact', label: 'Contact' },
];

export default function GuestLayout({
    children,
}: {
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
            <header className="bg-primary text-primary-foreground">
                <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:gap-8 lg:px-12 lg:py-4">
                    <Link
                        href="/"
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
                            variant="outline"
                            nativeButton={false}
                            render={<Link href="/login" />}
                            className="rounded-full border-2 border-primary-foreground bg-transparent px-5 text-xs font-semibold tracking-wide text-primary-foreground uppercase hover:bg-transparent hover:text-primary-foreground"
                        >
                            Staff login
                        </Button>
                        <Button
                            nativeButton={false}
                            render={<Link href="/reserve" />}
                            className="rounded-full bg-primary-foreground px-5 text-xs font-semibold tracking-wide text-primary uppercase hover:bg-primary-foreground/90"
                        >
                            Reserve
                        </Button>
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
                        <Button
                            nativeButton={false}
                            render={<Link href="/reserve" />}
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
                        <Link href="/login">Staff login</Link>
                    </nav>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <footer className="bg-primary text-primary-foreground">
                <div className="flex w-full flex-col gap-2 px-6 py-10 text-sm lg:px-12">
                    <p>18 Mercer Lane</p>
                    <p>Lunch and dinner, 11:00 to 21:00. Last seating 19:00.</p>
                    <p className="flex gap-4">
                        <Link href="/terms">Terms</Link>
                        <Link href="/privacy">Privacy</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
