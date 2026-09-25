import { Link } from '@inertiajs/react';
import AdminLayout from '@/features/admin/layouts/admin-layout';
import { Button } from '@/shared/components/ui/button';
import { index as adminTables } from '@/routes/admin/tables';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Overview">
            <p className="max-w-xl text-base leading-relaxed text-[#1d1d1d]/80">
                Manage the dining room catalog, then return to the floor portal
                for service.
            </p>
            <div className="mt-8">
                <Link href={adminTables.url()}>
                    <Button className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase">
                        Manage tables
                    </Button>
                </Link>
            </div>
        </AdminLayout>
    );
}
