import { Link } from '@inertiajs/react';
import {
    Calendar,
    Grid3X3,
    LayoutDashboard,
    Library,
    Shield,
    UserRound,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { index as adminAdmins } from '@/routes/admin/admins';
import { index as adminStaff } from '@/routes/admin/staff';
import { index as adminTables } from '@/routes/admin/tables';
import { edit as editProfile } from '@/routes/profile';
import {
    dashboard,
    reservations as reservationsRoute,
    tables as tablesRoute,
} from '@/routes/staff';

export type StaffNavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    isActive: boolean;
};

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function buildFloorNavItems(url: string): StaffNavItem[] {
    return [
        {
            href: dashboard.url(),
            label: 'Overview',
            icon: LayoutDashboard,
            isActive:
                url === '/staff' ||
                url === '/staff/dashboard' ||
                url.startsWith('/staff/dashboard?'),
        },
        {
            href: reservationsRoute.url(),
            label: 'Reservations',
            icon: Calendar,
            isActive: url.startsWith('/staff/reservations'),
        },
        {
            href: tablesRoute.url(),
            label: 'Floor tables',
            icon: Grid3X3,
            isActive: url.startsWith('/staff/tables'),
        },
    ];
}

export function buildAdminNavItems(url: string): StaffNavItem[] {
    return [
        {
            href: adminTables.url(),
            label: 'Catalog',
            icon: Library,
            isActive: url.startsWith('/admin/tables'),
        },
        {
            href: adminStaff.url(),
            label: 'Staff',
            icon: Users,
            isActive: url.startsWith('/admin/staff'),
        },
        {
            href: adminAdmins.url(),
            label: 'Admins',
            icon: Shield,
            isActive: url.startsWith('/admin/admins'),
        },
    ];
}

export function buildAccountNavItems(url: string): StaffNavItem[] {
    return [
        {
            href: editProfile.url(),
            label: 'Profile',
            icon: UserRound,
            isActive: url === '/profile' || url.startsWith('/profile?'),
        },
    ];
}

type StaffNavListProps = {
    items: StaffNavItem[];
    collapsed?: boolean;
    onNavigate?: () => void;
};

export function StaffNavList({
    items,
    collapsed = false,
    onNavigate,
}: StaffNavListProps) {
    return (
        <>
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        onClick={onNavigate}
                        className={`group relative flex items-center rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                            collapsed ? 'justify-center' : ''
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
                            {!collapsed && <span>{item.label}</span>}
                        </div>
                    </Link>
                );
            })}
        </>
    );
}
