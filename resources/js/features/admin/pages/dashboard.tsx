import { Head, Link } from '@inertiajs/react';
import { Button } from '@/shared/components/ui/button';
import StaffLayout from '@/shared/layouts/staff-layout';
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
                    Manage the dining room catalog, then return to the floor for
                    service.
                </p>
                <div className="mt-8">
                    <Link href={adminTables.url()}>
                        <Button className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase">
                            Manage tables
                        </Button>
                    </Link>
                </div>
            </div>
        </StaffLayout>
    );
}
