import { Link } from '@inertiajs/react';
import TableForm from '@/features/admin/components/table-form';
import AdminLayout from '@/features/admin/layouts/admin-layout';
import type { DiningTable } from '@/features/staff/types';
import { index, update } from '@/routes/admin/tables';

type ImageOption = {
    value: string;
    label: string;
};

type EditTableProps = {
    table: DiningTable;
    imageOptions: ImageOption[];
};

export default function AdminTablesEdit({
    table,
    imageOptions,
}: EditTableProps) {
    return (
        <AdminLayout title={`Edit ${table.name}`}>
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                    Catalog
                </p>
                <h2 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                    Edit {table.name}
                </h2>
            </div>

            <TableForm
                formProps={update.form(table.id)}
                imageOptions={imageOptions}
                defaults={{
                    name: table.name,
                    capacity: table.capacity,
                    image_url: table.image_url,
                }}
                submitLabel="Save changes"
                cancelSlot={
                    <Link
                        href={index.url()}
                        className="text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                    >
                        Cancel
                    </Link>
                }
            />
        </AdminLayout>
    );
}
