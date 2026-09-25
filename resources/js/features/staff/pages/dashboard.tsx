import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import FloorBoard from '@/features/staff/components/floor-board';
import {
    initialReservations,
    initialTables,
} from '@/features/staff/components/mock-data';
import ReservationList from '@/features/staff/components/reservation-list';
import StaffLayout from '@/shared/layouts/staff-layout';
import type {
    Reservation,
    ReservationServiceFilter,
    ReservationStatusFilter,
    TableState,
} from '@/features/staff/types';

export default function StaffDashboard() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<ReservationStatusFilter>('All');
    const [serviceFilter, setServiceFilter] =
        useState<ReservationServiceFilter>('All');
    const [reservations, setReservations] =
        useState<Reservation[]>(initialReservations);
    const [tables] = useState<TableState[]>(initialTables);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const filteredReservations = useMemo(() => {
        return reservations.filter((res) => {
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
    }, [reservations, search, statusFilter, serviceFilter]);

    const handleSeatParty = (
        id: string,
        guestName: string,
        tableLabel: string,
    ) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Seated' } : r)),
        );
        setActionMessage(`Seated ${guestName} at ${tableLabel}.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleCompleteParty = (id: string, guestName: string) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r)),
        );
        setActionMessage(`Service completed for ${guestName}. Table reset.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    return (
        <StaffLayout>
            <Head title="Staff Dashboard | Halden" />

            <div className="mx-auto max-w-7xl">
                {actionMessage && (
                    <div className="mb-6 flex items-center justify-between border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 px-4 py-3 text-xs font-medium text-[#2f4a3c]">
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 shrink-0 text-[#2f4a3c]" />
                            {actionMessage}
                        </span>
                        <button
                            type="button"
                            onClick={() => setActionMessage(null)}
                            className="text-[#2f4a3c] underline underline-offset-2 hover:opacity-80"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <div>
                    <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        Floor Management
                    </span>
                    <h1 className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl">
                        Today's service.
                    </h1>
                    <p className="mt-2 text-sm text-[#1d1d1d]/75 sm:text-base">
                        5 tables • 20 max covers • Service 11:00 to 21:00
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="border border-[#dedbd3] bg-white p-6">
                        <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                            Total Covers
                        </span>
                        <p className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d]">
                            18 Guests
                        </p>
                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                            across lunch & dinner seatings
                        </p>
                    </div>

                    <div className="border border-[#dedbd3] bg-white p-6">
                        <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                            Active Tables
                        </span>
                        <p className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d]">
                            3 of 5 Tables
                        </p>
                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                            currently seated or arriving
                        </p>
                    </div>

                    <div className="border border-[#dedbd3] bg-white p-6">
                        <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                            Next Seating
                        </span>
                        <p className="mt-2 font-heading text-3xl font-normal tracking-tight text-[#1d1d1d]">
                            19:00
                        </p>
                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                            2 parties arriving
                        </p>
                    </div>
                </div>

                <FloorBoard tables={tables} />

                <ReservationList
                    reservations={reservations}
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
                />
            </div>
        </StaffLayout>
    );
}
