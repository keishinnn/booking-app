import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Users,
    Grid3X3,
    Clock,
    CalendarCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import FloorBoard from '@/features/staff/components/floor-board';
import { initialReservations } from '@/features/staff/components/mock-data';
import ReservationList from '@/features/staff/components/reservation-list';
import TableScheduleModal from '@/features/staff/components/table-schedule-modal';
import { buildFloorTableCards } from '@/features/staff/lib/build-floor-table-cards';
import StaffLayout from '@/shared/layouts/staff-layout';
import type {
    DiningReservation,
    DiningTable,
    Reservation,
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
    reservations: todayReservations,
    today,
}: StaffDashboardProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<ReservationStatusFilter>('All');
    const [serviceFilter, setServiceFilter] =
        useState<ReservationServiceFilter>('All');
    const [ledgerReservations, setLedgerReservations] =
        useState<Reservation[]>(initialReservations);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const todaysReservations = useMemo(
        () =>
            todayReservations.filter(
                (reservation) => reservation.reserved_on === today,
            ),
        [todayReservations, today],
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

        return todayReservations.filter(
            (reservation) => reservation.table_id === selectedTableId,
        );
    }, [todayReservations, selectedTableId]);

    const filteredReservations = useMemo(() => {
        return ledgerReservations.filter((res) => {
            const query = search.trim().toLowerCase();
            const matchesQuery =
                !query ||
                res.guestName.toLowerCase().includes(query) ||
                res.email.toLowerCase().includes(query) ||
                res.phone.toLowerCase().includes(query) ||
                res.table.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === 'All' || res.status === statusFilter;

            const matchesService =
                serviceFilter === 'All' || res.service === serviceFilter;

            return matchesQuery && matchesStatus && matchesService;
        });
    }, [ledgerReservations, search, statusFilter, serviceFilter]);

    const handleSeatParty = (
        id: string,
        guestName: string,
        _tableLabel: string,
    ) => {
        setLedgerReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Seated' } : r)),
        );
        setActionMessage(`Seated ${guestName}.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleCompleteParty = (id: string, guestName: string) => {
        setLedgerReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r)),
        );
        setActionMessage(`Service completed for ${guestName}.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

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
            reservationCount={todaysReservations.length}
            activeTablesCount={`${inServiceCount}/${tables.length}`}
            searchValue={search}
            onSearchChange={setSearch}
        >
            <Head title="Staff Overview | Halden" />

            <div className="max-w-8xl mx-auto space-y-6">
                {actionMessage && (
                    <div className="flex items-center justify-between rounded-xl border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 px-4 py-3 text-xs font-medium text-[#2f4a3c] shadow-2xs">
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 shrink-0 text-[#2f4a3c]" />
                            {actionMessage}
                        </span>
                        <button
                            type="button"
                            onClick={() => setActionMessage(null)}
                            className="font-semibold underline underline-offset-2 hover:opacity-80"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

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

                <div className="grid grid-cols-2 divide-y divide-[#dedbd3]/70 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-xs sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                    <div className="flex items-center gap-3.5 p-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
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
                    tables={floorTables}
                    onSelectTable={setSelectedTableId}
                    showViewAllLink={true}
                />

                <ReservationList
                    reservations={ledgerReservations}
                    filteredReservations={filteredReservations}
                    search={search}
                    statusFilter={statusFilter}
                    serviceFilter={serviceFilter}
                    onSearchChange={setSearch}
                    onStatusFilterChange={setStatusFilter}
                    onServiceFilterChange={setServiceFilter}
                    onClearFilters={() => {
                        setSearch('');
                        setStatusFilter('All');
                        setServiceFilter('All');
                    }}
                    onSeatParty={handleSeatParty}
                    onCompleteParty={handleCompleteParty}
                    showViewAllLink={true}
                    title="Active Seating & Bookings"
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
