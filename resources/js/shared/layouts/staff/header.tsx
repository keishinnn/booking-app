import { Link } from '@inertiajs/react';
import {
    ChevronDown,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/routes';
import type { StaffNavItem } from '@/shared/layouts/staff/nav';

type StaffHeaderProps = {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    onOpenMobile: () => void;
    displayName: string;
    displayEmail: string;
    displayRole: string;
    displayInitials: string;
    accountNavItems: StaffNavItem[];
};

export default function StaffHeader({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search guests, tables, bookings...',
    sidebarCollapsed,
    onToggleSidebar,
    onOpenMobile,
    displayName,
    displayEmail,
    displayRole,
    displayInitials,
    accountNavItems,
}: StaffHeaderProps) {
    const searchEnabled = typeof onSearchChange === 'function';
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!searchEnabled) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchEnabled]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target as Node)
            ) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#dedbd3] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={onOpenMobile}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dedbd3] text-[#1d1d1d] transition-colors hover:bg-[#f8f7f3] lg:hidden"
                    aria-label="Open mobile menu"
                >
                    <Menu className="size-5" />
                </button>

                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="hidden items-center justify-center rounded-lg p-1.5 text-[#1d1d1d]/50 transition-colors hover:bg-[#f8f7f3] hover:text-[#1d1d1d] lg:flex"
                    title={
                        sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                    aria-label="Toggle sidebar collapse"
                >
                    {sidebarCollapsed ? (
                        <PanelLeftOpen className="size-4" />
                    ) : (
                        <PanelLeftClose className="size-4" />
                    )}
                </button>

                {searchEnabled && (
                    <div className="relative w-44 min-w-0 flex-1 sm:w-72 sm:flex-none md:w-96">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                        <input
                            ref={searchInputRef}
                            type="search"
                            value={searchValue ?? ''}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder={searchPlaceholder}
                            className="h-10 w-full border border-[#dedbd3] bg-[#f8f7f3]/60 pr-14 pl-10 text-xs text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/40 focus:border-[#1f1d1b] focus:bg-white focus:ring-1 focus:ring-[#1f1d1b] focus:outline-none"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4">
                <div className="relative" ref={userDropdownRef}>
                    <button
                        type="button"
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
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
                            <div className="pt-1">
                                {accountNavItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() =>
                                                setUserDropdownOpen(false)
                                            }
                                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#1d1d1d]/80 transition-colors hover:bg-[#f8f7f3] hover:text-[#1d1d1d]"
                                        >
                                            <Icon className="size-4 text-[#1d1d1d]/50" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
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
    );
}
