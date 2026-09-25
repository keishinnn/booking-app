import { Form, Link } from '@inertiajs/react';
import type { DiningTable } from '@/features/staff/types';
import AdminLayout from '@/features/admin/layouts/admin-layout';
import { Button } from '@/shared/components/ui/button';
import { create, destroy, edit } from '@/routes/admin/tables';

type TablesIndexProps = {
    tables: DiningTable[];
};

export default function AdminTablesIndex({ tables }: TablesIndexProps) {
    return (
        <AdminLayout title="Tables">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        Catalog
                    </p>
                    <h2 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                        Dining tables
                    </h2>
                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                        Create and update tables used by the floor and booking
                        flow.
                    </p>
                </div>
                <Link href={create.url()}>
                    <Button className="h-10 rounded-full bg-[#1f1d1b] px-5 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase">
                        Add table
                    </Button>
                </Link>
            </div>

            <div className="mt-8 overflow-hidden border border-[#dedbd3] bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-[#dedbd3] bg-[#f8f7f3] text-xs tracking-wider text-[#1d1d1d]/60 uppercase">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Table</th>
                            <th className="px-4 py-3 font-semibold">Seats</th>
                            <th className="px-4 py-3 font-semibold">Image</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-10 text-center text-[#1d1d1d]/60"
                                >
                                    No tables yet. Add the first dining table.
                                </td>
                            </tr>
                        ) : (
                            tables.map((table) => (
                                <tr
                                    key={table.id}
                                    className="border-b border-[#dedbd3] last:border-0"
                                >
                                    <td className="px-4 py-4 font-medium text-[#1d1d1d]">
                                        {table.name}
                                    </td>
                                    <td className="px-4 py-4 text-[#1d1d1d]/75">
                                        {table.capacity}
                                    </td>
                                    <td className="px-4 py-4">
                                        {table.image_url ? (
                                            <img
                                                src={table.image_url}
                                                alt=""
                                                className="h-12 w-16 object-cover"
                                            />
                                        ) : (
                                            <span className="text-[#1d1d1d]/45">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Link
                                                href={edit.url(table.id)}
                                                className="text-xs font-medium underline underline-offset-4"
                                            >
                                                Edit
                                            </Link>
                                            <Form
                                                {...destroy.form(table.id)}
                                                onSubmit={(event) => {
                                                    if (
                                                        !confirm(
                                                            `Delete ${table.name}?`,
                                                        )
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                {({ processing }) => (
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="text-xs font-medium text-[#8a4b3b] underline underline-offset-4 disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </Form>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
