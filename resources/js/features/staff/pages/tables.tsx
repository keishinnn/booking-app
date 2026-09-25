import { Head } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DiningTable } from '@/features/staff/types';
import StaffLayout from '@/shared/layouts/staff-layout';

type StaffTablesPageProps = {
    tables: DiningTable[];
};

export default function StaffTablesPage({ tables }: StaffTablesPageProps) {
    const [search, setSearch] = useState('');

    const filteredTables = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return tables;
        }

        return tables.filter(
            (table) =>
                table.name.toLowerCase().includes(query) ||
                String(table.capacity).includes(query),
        );
    }, [tables, search]);

    const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);

    return (
        <StaffLayout activeTablesCount={`${tables.length}`}>
            <Head title="Staff Tables | Halden" />

            <div className="max-w-8xl mx-auto space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Floor inventory
                        </p>
                        <h1 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                            Dining tables
                        </h1>
                        <p className="mt-2 text-sm text-[#1d1d1d]/70">
                            {tables.length} tables · {totalSeats} seats total
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name or seats"
                            className="w-full border border-[#dedbd3] bg-white py-2.5 pr-3 pl-10 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:outline-none"
                        />
                    </div>
                </div>

                {filteredTables.length === 0 ? (
                    <div className="border border-[#dedbd3] bg-white px-6 py-16 text-center">
                        <p className="text-sm text-[#1d1d1d]/70">
                            No tables match this search.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredTables.map((table) => (
                            <article
                                key={table.id}
                                className="overflow-hidden border border-[#dedbd3] bg-white"
                            >
                                <div className="aspect-[4/3] bg-[#f8f7f3]">
                                    {table.image_url ? (
                                        <img
                                            src={table.image_url}
                                            alt={table.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs tracking-widest text-[#1d1d1d]/40 uppercase">
                                            No photo
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="font-heading text-2xl text-[#1d1d1d]">
                                            {table.name}
                                        </h2>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1d1d1d]/70">
                                            <Users className="size-3.5" />
                                            Seats {table.capacity}
                                        </span>
                                    </div>
                                    <p className="text-[11px] tracking-wide text-[#1d1d1d]/45 uppercase">
                                        ID {table.id.slice(0, 8)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
