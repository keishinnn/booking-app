import { Link } from '@inertiajs/react';
import TableForm from '@/features/admin/components/table-form';
import AdminLayout from '@/features/admin/layouts/admin-layout';
import { index, store } from '@/routes/admin/tables';

type ImageOption = {
    value: string;
    label: string;
};

type CreateTableProps = {
    imageOptions: ImageOption[];
};

export default function AdminTablesCreate({ imageOptions }: CreateTableProps) {
    return (
        <AdminLayout title="Add table">
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                    Catalog
                </p>
                <h2 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                    Add table
                </h2>
            </div>

            <TableForm
                formProps={store.form()}
                imageOptions={imageOptions}
                submitLabel="Create table"
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
