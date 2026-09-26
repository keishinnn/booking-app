import { Head, Link } from '@inertiajs/react';
import { Button } from '@/shared/components/ui/button';
import StaffLayout from '@/shared/layouts/staff-layout';
import { index as adminAdmins } from '@/routes/admin/admins';
import { index as adminStaff } from '@/routes/admin/staff';
import { index as adminTables } from '@/routes/admin/tables';

export default function AdminDashboard() {
    return (
        <StaffLayout>
            <Head title="Admin | Halden" />

            <div>
                <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                    Admin
                </p>
                <h1 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                    Halden control
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#1d1d1d]/80">
                    Manage the dining room catalog, floor staff, and admin
                    accounts, then return to the floor for service.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={adminTables.url()}>
                        <Button className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase">
                            Manage tables
                        </Button>
                    </Link>
                    <Link href={adminStaff.url()}>
                        <Button className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase">
                            Manage staff
                        </Button>
                    </Link>
                    <Link href={adminAdmins.url()}>
                        <Button className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase">
                            Manage admins
                        </Button>
                    </Link>
                </div>
            </div>
        </StaffLayout>
    );
}
