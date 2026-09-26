import { Head } from '@inertiajs/react';
import { Clock, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ReservationServiceLabel } from '@/features/staff/components/reservation-badges';
import {
    floorTableCardTone,
    TableStatusLabel,
} from '@/features/staff/components/table-floor-status';
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

        return floorTables.filter((table) => {
            const haystack = [
                table.name,
                String(table.capacity),
                table.status,
                table.partyInfo,
                table.service ?? '',
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });
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
        <StaffLayout
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search tables by name, seats, or status..."
        >
            <Head title="Staff Tables | Halden" />

            <div className="max-w-8xl mx-auto space-y-6">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        Floor inventory
                    </p>
                    <h1 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                        Dining tables
                    </h1>
                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                        {filteredTables.length} of {tables.length} tables ·{' '}
                        {totalSeats} seats · Today {today}
                    </p>
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
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`overflow-hidden border-2 text-left transition-shadow hover:shadow-xs focus-visible:ring-2 focus-visible:ring-[#2f4a3c]/40 focus-visible:outline-none ${floorTableCardTone(table.status)}`}
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
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#dedbd3]/70 pt-3">
                    <TableStatusLabel status={table.status} />
                    {table.service && (
                        <ReservationServiceLabel service={table.service} />
                    )}
                </div>
            </div>
        </button>
    );
}
