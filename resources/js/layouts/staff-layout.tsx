import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    ArrowUpRight,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export default function StaffLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {
            href: '/staff/dashboard',
            label: 'Overview',
            icon: LayoutDashboard,
            isActive: url.startsWith('/staff'),
        },
        {
            href: '/reservations',
            label: 'Public Reservations',
            icon: Calendar,
            isActive: url.startsWith('/reservations'),
        },
        {
            href: '/',
            label: 'Public Dining Room',
            icon: ArrowUpRight,
            isActive: url === '/',
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8f7f3] text-[#1d1d1d]">
            {/* Desktop Sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-white/10 bg-[#1f1d1b] p-6 text-[#f8f7f3] lg:flex">
                <div>
                    {/* Brand Header */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/staff/dashboard"
                            className="font-heading text-2xl tracking-tight text-[#f8f7f3]"
                        >
                            Halden
                        </Link>
                        <span className="rounded bg-[#f8f7f3] px-2 py-0.5 text-[10px] font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Floor Book
                        </span>
                    </div>

                    {/* Service status pill in sidebar */}
                    <div className="mt-5 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#f8f7f3]/80">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="truncate">Dinner Service • 11:00–21:00</span>
                    </div>

                    {/* Navigation items */}
                    <nav className="mt-8 flex flex-col gap-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                        item.isActive
                                            ? 'bg-white/10 font-medium text-[#f8f7f3]'
                                            : 'text-[#f8f7f3]/70 hover:bg-white/5 hover:text-[#f8f7f3]'
                                    }`}
                                >
                                    <Icon className="size-4 shrink-0 text-[#f8f7f3]/80" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="border-t border-white/10 pt-5">
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold tracking-wider text-[#f8f7f3]">
                            ME
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#f8f7f3]">
                                Maja Eklund
                            </p>
                            <p className="truncate text-xs text-[#f8f7f3]/60">
                                Head Host
                            </p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <Link
                            href="/login"
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#f8f7f3]/70 transition-colors hover:bg-white/5 hover:text-[#f8f7f3]"
                        >
                            <LogOut className="size-4 shrink-0" />
                            <span>Sign out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Responsive Header & Drawer */}
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#1f1d1b] px-4 py-3 text-[#f8f7f3] lg:hidden">
                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/staff/dashboard"
                            className="font-heading text-xl tracking-tight text-[#f8f7f3]"
                        >
                            Halden
                        </Link>
                        <span className="rounded bg-[#f8f7f3] px-2 py-0.5 text-[10px] font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Floor Book
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#f8f7f3] hover:bg-white/10 hover:text-[#f8f7f3]"
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </header>

                {/* Mobile Drawer Overlay */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="fixed inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col justify-between bg-[#1f1d1b] p-6 text-[#f8f7f3] shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/staff/dashboard"
                                            className="font-heading text-2xl tracking-tight text-[#f8f7f3]"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Halden
                                        </Link>
                                        <span className="rounded bg-[#f8f7f3] px-2 py-0.5 text-[10px] font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                            Floor Book
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#f8f7f3] hover:bg-white/10"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <X className="size-5" />
                                    </Button>
                                </div>

                                <div className="mt-5 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#f8f7f3]/80">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                    </span>
                                    <span className="truncate">Dinner Service • 11:00–21:00</span>
                                </div>

                                <nav className="mt-8 flex flex-col gap-1.5">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                                    item.isActive
                                                        ? 'bg-white/10 font-medium text-[#f8f7f3]'
                                                        : 'text-[#f8f7f3]/70 hover:bg-white/5 hover:text-[#f8f7f3]'
                                                }`}
                                            >
                                                <Icon className="size-4 shrink-0 text-[#f8f7f3]/80" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="border-t border-white/10 pt-5">
                                <div className="flex items-center gap-3 px-2 py-1">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold tracking-wider text-[#f8f7f3]">
                                        ME
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-[#f8f7f3]">
                                            Maja Eklund
                                        </p>
                                        <p className="truncate text-xs text-[#f8f7f3]/60">
                                            Head Host
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#f8f7f3]/70 transition-colors hover:bg-white/5 hover:text-[#f8f7f3]"
                                    >
                                        <LogOut className="size-4 shrink-0" />
                                        <span>Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Header Bar above Content */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#dedbd3] bg-[#f8f7f3]/95 px-5 py-3.5 backdrop-blur-xs sm:px-8 lg:px-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs font-medium text-[#1d1d1d]/85 sm:text-sm">
                            Today • Dinner Service (Last seating 19:00)
                        </span>
                    </div>
                    <Button
                        nativeButton={false}
                        render={<Link href="/reserve" />}
                        className="rounded-full bg-[#1f1d1b] px-4 py-2 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90"
                    >
                        New Reservation
                    </Button>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-5 sm:p-8 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
