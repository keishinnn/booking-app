import { Head } from '@inertiajs/react';
import { Clock, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import TableScheduleModal from '@/features/staff/components/table-schedule-modal';
import { buildFloorTableCards } from '@/features/staff/lib/build-floor-table-cards';
import type {
    DiningReservation,
    DiningTable,
    FloorTableCard,
} from '@/features/staff/types';
import StaffLayout from '@/shared/layouts/staff-layout';

type StaffTablesPageProps = {
    tables: DiningTable[];
    reservations: DiningReservation[];
    today: string;
};

export default function StaffTablesPage({
    tables,
    reservations,
    today,
}: StaffTablesPageProps) {
    const [search, setSearch] = useState('');
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const todaysReservations = useMemo(
        () =>
            reservations.filter(
                (reservation) => reservation.reserved_on === today,
            ),
        [reservations, today],
    );

    const floorTables = useMemo(
        () => buildFloorTableCards(tables, todaysReservations, today),
        [tables, todaysReservations, today],
    );

    const filteredTables = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return floorTables;
        }

        return floorTables.filter(
            (table) =>
                table.name.toLowerCase().includes(query) ||
                String(table.capacity).includes(query),
        );
    }, [floorTables, search]);

    const selectedTable = useMemo(
        () => tables.find((table) => table.id === selectedTableId) ?? null,
        [tables, selectedTableId],
    );

    const selectedTableReservations = useMemo(() => {
        if (!selectedTableId) {
            return [];
        }

        return reservations.filter(
            (reservation) => reservation.table_id === selectedTableId,
        );
    }, [reservations, selectedTableId]);

    const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);
    return (
        <StaffLayout>
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
                            {tables.length} tables · {totalSeats} seats · Today{' '}
                            {today}
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
                            <FloorTableItem
                                key={table.id}
                                table={table}
                                onSelect={() => setSelectedTableId(table.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedTable && (
                <TableScheduleModal
                    table={selectedTable}
                    today={today}
                    reservations={selectedTableReservations}
                    onClose={() => setSelectedTableId(null)}
                />
            )}
        </StaffLayout>
    );
}

function FloorTableItem({
    table,
    onSelect,
}: {
    table: FloorTableCard;
    onSelect: () => void;
}) {
    const isInService = table.status === 'In service';
    const isReserved = table.status === 'Reserved';

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`overflow-hidden border bg-white text-left transition-shadow hover:shadow-xs focus-visible:ring-2 focus-visible:ring-[#2f4a3c]/40 focus-visible:outline-none ${
                isInService
                    ? 'border-[#1f1d1b] ring-1 ring-[#1f1d1b]/10'
                    : isReserved
                      ? 'border-[#2f4a3c]/40'
                      : 'border-[#dedbd3]'
            }`}
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

                <div className="min-h-[40px]">
                    <p className="text-sm font-medium text-[#1d1d1d]">
                        {table.partyInfo}
                    </p>
                    {table.timeSlot && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#1d1d1d]/60">
                            <Clock className="size-3 shrink-0" />
                            <span>{table.timeSlot}</span>
                            {table.service && (
                                <span className="font-semibold tracking-wide text-[#2f4a3c] uppercase">
                                    · {table.service}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-[#dedbd3]/70 pt-3">
                    {isInService && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1f1d1b] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#f8f7f3] uppercase">
                            <span className="size-1.5 rounded-full bg-amber-400" />
                            In service
                        </span>
                    )}
                    {isReserved && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                            <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                            Reserved
                        </span>
                    )}
                    {table.status === 'Open' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1d1d1d]/70 uppercase">
                            <span className="size-1.5 rounded-full bg-stone-400" />
                            Open
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}
