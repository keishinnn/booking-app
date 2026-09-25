import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { logout } from '@/routes';
import { dashboard } from '@/routes/staff';
import { StaffNavList, type StaffNavItem } from '@/shared/layouts/staff/nav';

type StaffSidebarProps = {
    collapsed: boolean;
    isAdmin: boolean;
    displayName: string;
    displayRole: string;
    displayInitials: string;
    floorNavItems: StaffNavItem[];
    adminNavItems: StaffNavItem[];
};

export default function StaffSidebar({
    collapsed,
    isAdmin,
    displayName,
    displayRole,
    displayInitials,
    floorNavItems,
    adminNavItems,
}: StaffSidebarProps) {
    return (
        <aside
            className={`sticky top-0 hidden h-screen shrink-0 flex-col justify-between border-r border-[#dedbd3] bg-white transition-all duration-300 lg:flex ${
                collapsed ? 'w-20 px-3 py-6' : 'w-72 px-6 py-6'
            }`}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-between border-b border-[#dedbd3]/70 pb-6">
                    {!collapsed ? (
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
                    {!collapsed && (
                        <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                            Floor
                        </h3>
                    )}
                    <nav className="flex flex-col gap-1.5">
                        <StaffNavList
                            items={floorNavItems}
                            collapsed={collapsed}
                        />
                    </nav>
                </div>

                {isAdmin && (
                    <div className="mt-7">
                        {!collapsed && (
                            <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                                Admin
                            </h3>
                        )}
                        <nav className="flex flex-col gap-1.5">
                            <StaffNavList
                                items={adminNavItems}
                                collapsed={collapsed}
                            />
                        </nav>
                    </div>
                )}
            </div>

            <div className="border-t border-[#dedbd3]/70 pt-4">
                {!collapsed ? (
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
    );
}
