import { Head } from '@inertiajs/react';
import {
    Users,
    Grid3X3,
    Clock,
    CalendarCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import FloorBoard from '@/features/staff/components/floor-board';
import ReservationList from '@/features/staff/components/reservation-list';
import TableScheduleModal from '@/features/staff/components/table-schedule-modal';
import { buildFloorTableCards } from '@/features/staff/lib/build-floor-table-cards';
import StaffLayout from '@/shared/layouts/staff-layout';
import type {
    DiningReservation,
    DiningTable,
    ReservationServiceFilter,
    ReservationStatusFilter,
} from '@/features/staff/types';

type StaffDashboardProps = {
    tables: DiningTable[];
    reservations: DiningReservation[];
    today: string;
};

export default function StaffDashboard({
    tables,
    reservations: upcomingReservations,
    today,
}: StaffDashboardProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<ReservationStatusFilter>('All');
    const [serviceFilter, setServiceFilter] =
        useState<ReservationServiceFilter>('All');
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const todaysReservations = useMemo(
        () =>
            upcomingReservations.filter(
                (reservation) => reservation.reserved_on === today,
            ),
        [upcomingReservations, today],
    );

    const floorTables = useMemo(
        () => buildFloorTableCards(tables, todaysReservations, today),
        [tables, todaysReservations, today],
    );

    const selectedTable = useMemo(
        () => tables.find((table) => table.id === selectedTableId) ?? null,
        [tables, selectedTableId],
    );

    const selectedTableReservations = useMemo(() => {
        if (!selectedTableId) {
            return [];
        }

        return upcomingReservations.filter(
            (reservation) => reservation.table_id === selectedTableId,
        );
    }, [upcomingReservations, selectedTableId]);

    const filteredReservations = useMemo(() => {
        return todaysReservations.filter((reservation) => {
            const query = search.trim().toLowerCase();
            const tableName = reservation.table?.name ?? '';
            const matchesQuery =
                !query ||
                reservation.guest_name.toLowerCase().includes(query) ||
                reservation.email.toLowerCase().includes(query) ||
                reservation.phone.toLowerCase().includes(query) ||
                tableName.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === 'All' || reservation.status === statusFilter;

            const matchesService =
                serviceFilter === 'All' ||
                reservation.service === serviceFilter;

            return matchesQuery && matchesStatus && matchesService;
        });
    }, [todaysReservations, search, statusFilter, serviceFilter]);

    const filteredFloorTables = useMemo(() => {
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

    const inServiceCount = floorTables.filter(
        (t) => t.status === 'In service',
    ).length;
    const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);
    const totalCovers = todaysReservations.reduce(
        (acc, curr) => acc + curr.party_size,
        0,
    );

    const nextArrival = useMemo(() => {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const upcoming = todaysReservations
            .filter((reservation) => reservation.status === 'confirmed')
            .map((reservation) => {
                const [hours, minutes] = reservation.starts_at
                    .split(':')
                    .map(Number);
                return {
                    reservation,
                    minutes: hours * 60 + (minutes || 0),
                };
            })
            .filter(({ minutes }) => minutes >= nowMinutes)
            .sort((a, b) => a.minutes - b.minutes);

        if (upcoming.length === 0) {
            return null;
        }

        const firstTime = upcoming[0].reservation.starts_at;
        const partiesAtTime = upcoming.filter(
            ({ reservation }) => reservation.starts_at === firstTime,
        ).length;

        return { time: firstTime, parties: partiesAtTime };
    }, [todaysReservations]);

    return (
        <StaffLayout
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search guests, tables, bookings..."
        >
            <Head title="Staff Overview | Halden" />

            <div className="max-w-8xl mx-auto space-y-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Service Overview
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Today&apos;s floor operations and live table
                            schedule · {today}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#1d1d1d]/60">
                        <span>
                            Capacity: <strong>{totalSeats} covers</strong>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-y divide-[#dedbd3]/70 overflow-hidden border border-[#dedbd3] bg-white shadow-xs sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                    <div className="flex items-center gap-3.5 p-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <Users className="size-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                Total Covers
                            </span>
                            <p className="font-heading text-xl font-semibold text-[#1d1d1d]">
                                {totalCovers} Guests
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <Grid3X3 className="size-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                In Service
                            </span>
                            <p className="font-heading text-xl font-semibold text-[#1d1d1d]">
                                {inServiceCount} of {tables.length} Tables
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                Next Arrival
                            </span>
                            <p className="font-heading text-xl font-semibold text-[#1d1d1d]">
                                {nextArrival
                                    ? `${nextArrival.time} (${nextArrival.parties} ${nextArrival.parties === 1 ? 'Party' : 'Parties'})`
                                    : 'None left'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <CalendarCheck className="size-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                Bookings
                            </span>
                            <p className="font-heading text-xl font-semibold text-[#1d1d1d]">
                                {todaysReservations.length} Booked
                            </p>
                        </div>
                    </div>
                </div>

                <FloorBoard
                    tables={filteredFloorTables}
                    onSelectTable={setSelectedTableId}
                    showViewAllLink={true}
                />

                <ReservationList
                    reservations={todaysReservations}
                    filteredReservations={filteredReservations}
                    search={search}
                    statusFilter={statusFilter}
                    serviceFilter={serviceFilter}
                    onStatusFilterChange={setStatusFilter}
                    onServiceFilterChange={setServiceFilter}
                    onClearFilters={() => {
                        setSearch('');
                        setStatusFilter('All');
                        setServiceFilter('All');
                    }}
                    showViewAllLink={true}
                    title="Today's bookings"
                />
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
