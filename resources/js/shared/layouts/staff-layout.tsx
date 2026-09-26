import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import StaffHeader from '@/shared/layouts/staff/header';
import StaffMobileDrawer from '@/shared/layouts/staff/mobile-drawer';
import {
    buildAccountNavItems,
    buildAdminNavItems,
    buildFloorNavItems,
    initials,
} from '@/shared/layouts/staff/nav';
import StaffSidebar from '@/shared/layouts/staff/sidebar';
import type { Auth } from '@/shared/types/auth';

interface StaffLayoutProps {
    children: ReactNode;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
}

export default function StaffLayout({
    children,
    searchValue,
    onSearchChange,
    searchPlaceholder,
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

    const floorNavItems = buildFloorNavItems(url);
    const adminNavItems = isAdmin ? buildAdminNavItems(url) : [];
    const accountNavItems = buildAccountNavItems(url);

    return (
        <div className="flex min-h-screen bg-[#f8f7f3] text-[#1d1d1d]">
            <StaffSidebar
                collapsed={sidebarCollapsed}
                isAdmin={isAdmin}
                floorNavItems={floorNavItems}
                adminNavItems={adminNavItems}
                accountNavItems={accountNavItems}
            />

            <StaffMobileDrawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                isAdmin={isAdmin}
                displayName={displayName}
                displayRole={displayRole}
                displayInitials={displayInitials}
                floorNavItems={floorNavItems}
                adminNavItems={adminNavItems}
                accountNavItems={accountNavItems}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <StaffHeader
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    searchPlaceholder={searchPlaceholder}
                    sidebarCollapsed={sidebarCollapsed}
                    onToggleSidebar={() =>
                        setSidebarCollapsed(!sidebarCollapsed)
                    }
                    onOpenMobile={() => setMobileOpen(true)}
                    displayName={displayName}
                    displayEmail={displayEmail}
                    displayRole={displayRole}
                    displayInitials={displayInitials}
                    isAdmin={isAdmin}
                    floorNavItems={floorNavItems}
                    adminNavItems={adminNavItems}
                    accountNavItems={accountNavItems}
                />

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
