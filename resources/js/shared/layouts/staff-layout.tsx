import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Calendar,
    Grid3X3,
    LogOut,
    Menu,
    X,
    Search,
    Plus,
    ChevronDown,
    PanelLeftClose,
    PanelLeftOpen,
    Settings2,
    Library,
} from 'lucide-react';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { logout, reserve } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminTables } from '@/routes/admin/tables';
import {
    dashboard,
    reservations as reservationsRoute,
    tables as tablesRoute,
} from '@/routes/staff';
import type { Auth } from '@/shared/types/auth';

interface StaffLayoutProps {
    children: ReactNode;
    reservationCount?: number;
    activeTablesCount?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

type NavItem = {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    isActive: boolean;
    badge: string | null;
};

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export default function StaffLayout({
    children,
    reservationCount = 5,
    activeTablesCount = '3/5',
    searchValue,
    onSearchChange,
}: StaffLayoutProps) {
    const { url, props } = usePage<{
        auth: Auth;
        flash?: { success?: string | null; error?: string | null };
    }>();
    const user = props.auth.user;
    const flash = props.flash;
    const isAdmin = user?.role === 'admin';
    const displayName = user?.name ?? 'Staff';
    const displayEmail = user?.email ?? '';
    const displayRole = isAdmin ? 'Admin' : 'Floor Staff';
    const displayInitials = initials(displayName) || 'ST';
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(e.target as Node)
            ) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const floorNavItems: NavItem[] = [
        {
            href: dashboard.url(),
            label: 'Overview',
            icon: LayoutDashboard,
            isActive:
                url === '/staff' ||
                url === '/staff/dashboard' ||
                url.startsWith('/staff/dashboard?'),
            badge: null,
        },
        {
            href: reservationsRoute.url(),
            label: 'Reservations',
            icon: Calendar,
            isActive: url.startsWith('/staff/reservations'),
            badge: String(reservationCount),
        },
        {
            href: tablesRoute.url(),
            label: 'Floor tables',
            icon: Grid3X3,
            isActive: url.startsWith('/staff/tables'),
            badge: activeTablesCount,
        },
    ];

    const adminNavItems: NavItem[] = isAdmin
        ? [
              {
                  href: adminDashboard.url(),
                  label: 'Control',
                  icon: Settings2,
                  isActive:
                      url === '/admin' ||
                      url === '/admin/dashboard' ||
                      url.startsWith('/admin/dashboard?'),
                  badge: null,
              },
              {
                  href: adminTables.url(),
                  label: 'Catalog',
                  icon: Library,
                  isActive: url.startsWith('/admin/tables'),
                  badge: null,
              },
          ]
        : [];

    const renderNavItems = (
        items: NavItem[],
        options: { collapsed: boolean; onNavigate?: () => void } = {
            collapsed: false,
        },
    ) =>
        items.map((item) => {
            const Icon = item.icon;
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    title={options.collapsed ? item.label : undefined}
                    onClick={options.onNavigate}
                    className={`group relative flex items-center rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                        options.collapsed ? 'justify-center' : 'justify-between'
                    } ${
                        item.isActive
                            ? 'bg-[#1f1d1b] text-[#f8f7f3] shadow-xs'
                            : 'text-[#1d1d1d]/75 hover:bg-[#f8f7f3] hover:text-[#1d1d1d]'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Icon
                            className={`size-5 shrink-0 transition-colors ${
                                item.isActive
                                    ? 'text-[#f8f7f3]'
                                    : 'text-[#1d1d1d]/60 group-hover:text-[#1d1d1d]'
                            }`}
                        />
                        {!options.collapsed && <span>{item.label}</span>}
                    </div>

                    {!options.collapsed && item.badge && (
                        <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide transition-colors ${
                                item.isActive
                                    ? 'bg-white/20 text-white'
                                    : 'border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]/70 group-hover:border-[#1d1d1d]/20'
                            }`}
                        >
                            {item.badge}
                        </span>
                    )}

                    {options.collapsed && item.badge && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2f4a3c] px-1 text-[9px] font-bold text-white">
                            {item.badge}
                        </span>
                    )}
                </Link>
            );
        });

    return (
        <div className="flex min-h-screen bg-[#f8f7f3] text-[#1d1d1d]">
            <aside
                className={`sticky top-0 hidden h-screen shrink-0 flex-col justify-between border-r border-[#dedbd3] bg-white transition-all duration-300 lg:flex ${
                    sidebarCollapsed ? 'w-20 px-3 py-6' : 'w-72 px-6 py-6'
                }`}
            >
                <div className="flex flex-col">
                    <div className="flex items-center justify-between border-b border-[#dedbd3]/70 pb-6">
                        {!sidebarCollapsed ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={dashboard.url()}
                                    className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] transition-opacity hover:opacity-85"
                                >
                                    Halden
                                </Link>
                                <span className="inline-flex items-center rounded-md border border-[#2f4a3c]/20 bg-[#2f4a3c]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                    {isAdmin ? 'Admin' : 'Staff'}
                                </span>
                            </div>
                        ) : (
                            <Link
                                href={dashboard.url()}
                                className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f1d1b] font-heading text-lg font-bold text-[#f8f7f3]"
                                title="Halden portal"
                            >
                                H
                            </Link>
                        )}
                    </div>

                    <div className="mt-7">
                        {!sidebarCollapsed && (
                            <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                                Floor
                            </h3>
                        )}
                        <nav className="flex flex-col gap-1.5">
                            {renderNavItems(floorNavItems, {
                                collapsed: sidebarCollapsed,
                            })}
                        </nav>
                    </div>

                    {isAdmin && (
                        <div className="mt-7">
                            {!sidebarCollapsed && (
                                <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                                    Admin
                                </h3>
                            )}
                            <nav className="flex flex-col gap-1.5">
                                {renderNavItems(adminNavItems, {
                                    collapsed: sidebarCollapsed,
                                })}
                            </nav>
                        </div>
                    )}
                </div>

                <div className="border-t border-[#dedbd3]/70 pt-4">
                    {!sidebarCollapsed ? (
                        <div className="flex items-center justify-between rounded-xl border border-[#dedbd3]/60 bg-[#f8f7f3]/60 p-2.5">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f1d1b] text-xs font-semibold text-[#f8f7f3]">
                                    {displayInitials}
                                    <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-[#1d1d1d]">
                                        {displayName}
                                    </p>
                                    <p className="truncate text-[11px] text-[#1d1d1d]/60">
                                        {displayRole}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                title="Sign out"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1d1d1d]/60 shadow-2xs transition-colors hover:bg-white hover:text-rose-600"
                            >
                                <LogOut className="size-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1d1b] text-xs font-semibold text-[#f8f7f3]">
                                {displayInitials}
                                <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                title="Sign out"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1d1d1d]/60 transition-colors hover:bg-[#f8f7f3] hover:text-rose-600"
                            >
                                <LogOut className="size-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col justify-between border-r border-[#dedbd3] bg-white p-6 shadow-2xl">
                        <div>
                            <div className="flex items-center justify-between border-b border-[#dedbd3] pb-6">
                                <div className="flex items-center gap-2.5">
                                    <Link
                                        href={dashboard.url()}
                                        onClick={() => setMobileOpen(false)}
                                        className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d]"
                                    >
                                        Halden
                                    </Link>
                                    <span className="rounded-md border border-[#2f4a3c]/20 bg-[#2f4a3c]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                        {isAdmin ? 'Admin' : 'Staff'}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-lg text-[#1d1d1d] hover:bg-[#f8f7f3]"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <X className="size-5" />
                                </Button>
                            </div>

                            <div className="mt-6">
                                <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                                    Floor
                                </h3>
                                <nav className="flex flex-col gap-1.5">
                                    {renderNavItems(floorNavItems, {
                                        collapsed: false,
                                        onNavigate: () => setMobileOpen(false),
                                    })}
                                </nav>
                            </div>

                            {isAdmin && (
                                <div className="mt-6">
                                    <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                                        Admin
                                    </h3>
                                    <nav className="flex flex-col gap-1.5">
                                        {renderNavItems(adminNavItems, {
                                            collapsed: false,
                                            onNavigate: () =>
                                                setMobileOpen(false),
                                        })}
                                    </nav>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#dedbd3] pt-4">
                            <div className="flex items-center justify-between rounded-xl border border-[#dedbd3]/60 bg-[#f8f7f3]/60 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1d1b] text-xs font-semibold text-[#f8f7f3]">
                                        {displayInitials}
                                        <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[#1d1d1d]">
                                            {displayName}
                                        </p>
                                        <p className="text-[11px] text-[#1d1d1d]/60">
                                            {displayRole}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={logout.url()}
                                    method="post"
                                    as="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1d1d1d]/60 shadow-2xs transition-colors hover:bg-white hover:text-rose-600"
                                >
                                    <LogOut className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#dedbd3] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dedbd3] text-[#1d1d1d] transition-colors hover:bg-[#f8f7f3] lg:hidden"
                            aria-label="Open mobile menu"
                        >
                            <Menu className="size-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarCollapsed(!sidebarCollapsed)
                            }
                            className="hidden items-center justify-center rounded-lg p-1.5 text-[#1d1d1d]/50 transition-colors hover:bg-[#f8f7f3] hover:text-[#1d1d1d] lg:flex"
                            title={
                                sidebarCollapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                            aria-label="Toggle sidebar collapse"
                        >
                            {sidebarCollapsed ? (
                                <PanelLeftOpen className="size-4" />
                            ) : (
                                <PanelLeftClose className="size-4" />
                            )}
                        </button>

                        <div className="relative hidden w-72 sm:block md:w-96">
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchValue ?? ''}
                                onChange={(e) =>
                                    onSearchChange?.(e.target.value)
                                }
                                placeholder="Search guests, tables, bookings..."
                                className="h-10 w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 pr-14 pl-10 text-xs text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/40 focus:border-[#1f1d1b] focus:bg-white focus:ring-1 focus:ring-[#1f1d1b] focus:outline-none"
                            />
                            <div className="pointer-events-none absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-[#dedbd3] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#1d1d1d]/50 shadow-2xs">
                                <span>⌘</span>
                                <span>K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-4">
                        <Link
                            href={reserve.url()}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f1d1b] px-3.5 py-2 text-xs font-semibold tracking-wide text-[#f8f7f3] shadow-xs transition-all hover:bg-[#1f1d1b]/90 active:scale-[0.98]"
                        >
                            <Plus className="size-3.5" />
                            <span>New Reservation</span>
                        </Link>

                        <div className="relative" ref={userDropdownRef}>
                            <button
                                type="button"
                                onClick={() =>
                                    setUserDropdownOpen(!userDropdownOpen)
                                }
                                className="flex items-center gap-2.5 rounded-xl border border-[#dedbd3]/80 bg-white p-1.5 pr-2.5 shadow-2xs transition-colors hover:bg-[#f8f7f3]"
                                aria-expanded={userDropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f1d1b] text-xs font-bold text-[#f8f7f3]">
                                    {displayInitials}
                                </div>
                                <div className="hidden text-left sm:block">
                                    <p className="text-xs leading-tight font-semibold text-[#1d1d1d]">
                                        {displayName}
                                    </p>
                                    <p className="text-[10px] leading-tight text-[#1d1d1d]/60">
                                        {displayRole}
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`size-3.5 text-[#1d1d1d]/50 transition-transform ${
                                        userDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-56 animate-in rounded-2xl border border-[#dedbd3] bg-white p-2 shadow-lg duration-100 zoom-in-95 fade-in">
                                    <div className="border-b border-[#dedbd3]/70 px-3 py-2">
                                        <p className="text-xs font-semibold text-[#1d1d1d]">
                                            {displayName}
                                        </p>
                                        <p className="text-[11px] text-[#1d1d1d]/60">
                                            {displayEmail}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        {floorNavItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() =>
                                                        setUserDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#1d1d1d]/80 transition-colors hover:bg-[#f8f7f3] hover:text-[#1d1d1d]"
                                                >
                                                    <Icon className="size-4 text-[#1d1d1d]/50" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                        {isAdmin &&
                                            adminNavItems.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() =>
                                                            setUserDropdownOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#1d1d1d]/80 transition-colors hover:bg-[#f8f7f3] hover:text-[#1d1d1d]"
                                                    >
                                                        <Icon className="size-4 text-[#1d1d1d]/50" />
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                    <div className="border-t border-[#dedbd3]/70 pt-1">
                                        <Link
                                            href={logout.url()}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                                        >
                                            <LogOut className="size-4 text-rose-500" />
                                            <span>Sign out</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {(flash?.success || flash?.error) && (
                        <div
                            className={`mb-6 border px-4 py-3 text-sm ${
                                flash.error
                                    ? 'border-[#8a4b3b]/30 bg-[#8a4b3b]/10 text-[#8a4b3b]'
                                    : 'border-[#2f4a3c]/30 bg-[#2f4a3c]/10 text-[#2f4a3c]'
                            }`}
                        >
                            {flash.error || flash.success}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
