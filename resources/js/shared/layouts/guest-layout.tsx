import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { home, privacy, reserve, terms } from '@/routes';

const navLinks = [
    { href: '/#story', label: 'The Dining Room' },
    { href: '/#menu', label: 'Seasonal Menu' },
    { href: '/#private', label: 'The Long Table' },
    { href: '/#visit', label: 'Visit & Hours' },
];

export default function GuestLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col overflow-x-clip scroll-smooth bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1f1d1b]/95 text-[#f8f7f3] backdrop-blur-md transition-colors duration-200">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:h-18 sm:px-8 lg:px-12">
                    <Link
                        href={home.url()}
                        className="font-heading text-xl tracking-tight transition-opacity hover:opacity-90 sm:text-2xl"
                    >
                        Halden
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 lg:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-xs font-medium tracking-wide text-[#f8f7f3]/80 uppercase transition-colors hover:text-[#f8f7f3]"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="group h-10 rounded-full bg-[#f8f7f3] px-5 text-xs font-semibold tracking-wider text-[#1f1d1b] uppercase transition-all duration-300 hover:bg-white active:scale-98"
                        >
                            <span>Reserve</span>
                            <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:translate-x-0.5">
                                <ArrowRight className="size-3" />
                            </span>
                        </Button>
                    </nav>

                    {/* Mobile Navigation Controls */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <Button
                            nativeButton={false}
                            render={<Link href={reserve.url()} />}
                            className="h-9 rounded-full bg-[#f8f7f3] px-4 text-[11px] font-semibold tracking-wider text-[#1f1d1b] uppercase hover:bg-white active:scale-98"
                        >
                            Reserve
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#f8f7f3] hover:bg-white/10 hover:text-white"
                            aria-expanded={open}
                            aria-label={open ? 'Close menu' : 'Menu'}
                            onClick={() => setOpen((current) => !current)}
                        >
                            {open ? (
                                <X className="size-5" />
                            ) : (
                                <Menu className="size-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {open && (
                    <nav className="flex animate-in flex-col gap-1 border-t border-white/10 bg-[#1f1d1b] px-6 py-4 duration-150 fade-in slide-in-from-top-2 lg:hidden">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="py-2.5 text-xs font-medium tracking-wider text-[#f8f7f3]/85 uppercase transition-colors hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-white/15 bg-[#1f1d1b] text-[#f8f7f3]">
                <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 lg:px-12">
                    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Link
                                href={home.url()}
                                className="font-heading text-2xl tracking-tight text-[#f8f7f3]"
                            >
                                Halden
                            </Link>
                            <div className="mt-3 flex flex-col gap-1 text-sm text-[#f8f7f3]/75">
                                <p>18 Mercer Lane</p>
                                <p>
                                    Lunch and dinner, 11:00 to 21:00. Last
                                    seating 19:00.
                                </p>
                                <p className="mt-1 text-xs text-[#f8f7f3]/60">
                                    Direct inquiries: hello@halden.test
                                </p>
                            </div>
                        </div>

                        <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#f8f7f3]/80">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="underline-offset-4 transition-colors hover:text-white hover:underline"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link
                                href={reserve.url()}
                                className="font-semibold text-white underline-offset-4 hover:underline"
                            >
                                Reserve a table
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#f8f7f3]/60 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Halden Dining Room. All
                            rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href={terms.url()}
                                className="underline-offset-4 transition-colors hover:text-white hover:underline"
                            >
                                Terms
                            </Link>
                            <Link
                                href={privacy.url()}
                                className="underline-offset-4 transition-colors hover:text-white hover:underline"
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
