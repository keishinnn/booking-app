import { Link } from "@inertiajs/react";
import { dashboard } from "@/routes/staff";
import { StaffNavList, type StaffNavItem } from "@/shared/layouts/staff/nav";

type StaffSidebarProps = {
    collapsed: boolean;
    isAdmin: boolean;
    floorNavItems: StaffNavItem[];
    adminNavItems: StaffNavItem[];
    accountNavItems: StaffNavItem[];
};

export default function StaffSidebar({
    collapsed,
    isAdmin,
    floorNavItems,
    adminNavItems,
    accountNavItems,
}: StaffSidebarProps) {
    return (
        <aside
            className={`sticky top-0 hidden h-screen shrink-0 flex-col justify-between border-r border-[#dedbd3] bg-white transition-all duration-300 lg:flex ${
                collapsed ? "w-20 px-3 py-6" : "w-72 px-6 py-6"
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
                                {isAdmin ? "Admin" : "Staff"}
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
        </aside>
    );
}
