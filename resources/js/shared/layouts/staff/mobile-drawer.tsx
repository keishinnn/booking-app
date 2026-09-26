import { Link } from '@inertiajs/react';
import { LogOut, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { logout } from '@/routes';
import { dashboard } from '@/routes/staff';
import { StaffNavList, type StaffNavItem } from '@/shared/layouts/staff/nav';

type StaffMobileDrawerProps = {
    open: boolean;
    onClose: () => void;
    isAdmin: boolean;
    displayName: string;
    displayRole: string;
    displayInitials: string;
    floorNavItems: StaffNavItem[];
    adminNavItems: StaffNavItem[];
    accountNavItems: StaffNavItem[];
};

export default function StaffMobileDrawer({
    open,
    onClose,
    isAdmin,
    displayName,
    displayRole,
    displayInitials,
    floorNavItems,
    adminNavItems,
    accountNavItems,
}: StaffMobileDrawerProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />
            <div className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col justify-between border-r border-[#dedbd3] bg-white p-6 shadow-2xl">
                <div>
                    <div className="flex items-center justify-between border-b border-[#dedbd3] pb-6">
                        <div className="flex items-center gap-2.5">
                            <Link
                                href={dashboard.url()}
                                onClick={onClose}
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
                            onClick={onClose}
                        >
                            <X className="size-5" />
                        </Button>
                    </div>

                    <div className="mt-6">
                        <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                            Floor
                        </h3>
                        <nav className="flex flex-col gap-1.5">
                            <StaffNavList
                                items={floorNavItems}
                                onNavigate={onClose}
                            />
                        </nav>
                    </div>

                    {isAdmin && (
                        <div className="mt-6">
                            <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                                Admin
                            </h3>
                            <nav className="flex flex-col gap-1.5">
                                <StaffNavList
                                    items={adminNavItems}
                                    onNavigate={onClose}
                                />
                            </nav>
                        </div>
                    )}

                    <div className="mt-6">
                        <h3 className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-[#1d1d1d]/45 uppercase">
                            Account
                        </h3>
                        <nav className="flex flex-col gap-1.5">
                            <StaffNavList
                                items={accountNavItems}
                                onNavigate={onClose}
                            />
                        </nav>
                    </div>
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
    );
}
