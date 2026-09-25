import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { initialReservations } from '@/features/staff/components/mock-data';
import ReservationList from '@/features/staff/components/reservation-list';
import StaffLayout from '@/shared/layouts/staff-layout';
import type {
    Reservation,
    ReservationServiceFilter,
    ReservationStatusFilter,
} from '@/features/staff/types';

export default function StaffReservationsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<ReservationStatusFilter>('All');
    const [serviceFilter, setServiceFilter] =
        useState<ReservationServiceFilter>('All');
    const [reservations, setReservations] =
        useState<Reservation[]>(initialReservations);
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
        <StaffLayout
            reservationCount={reservations.length}
            searchValue={search}
            onSearchChange={setSearch}
        >
            <Head title="Staff Reservations | Halden" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Action Feedback Banner */}
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

                {/* Page Title & Context Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Reservations Ledger
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Active guest bookings, table assignments, and
                            arrival schedule
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#1d1d1d]/60">
                        <span>Today's Ledger</span>
                        <span>•</span>
                        <span>
                            Shift: <strong>Dinner (11:00–21:00)</strong>
                        </span>
                    </div>
                </div>

                {/* Pure Functional Reservation Table with Search and Filters */}
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
                    title="All Reservations"
                />
            </div>
        </StaffLayout>
    );
}
