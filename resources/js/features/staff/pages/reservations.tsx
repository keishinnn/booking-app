import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    CalendarCheck,
    UserCheck,
    Archive,
} from 'lucide-react';
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

    const confirmedCount = reservations.filter(
        (r) => r.status === 'Confirmed',
    ).length;
    const seatedCount = reservations.filter(
        (r) => r.status === 'Seated',
    ).length;
    const completedCount = reservations.filter(
        (r) => r.status === 'Completed',
    ).length;

    return (
        <StaffLayout
            reservationCount={reservations.length}
            searchValue={search}
            onSearchChange={setSearch}
        >
            <Head title="Staff Reservations | Halden" />

            <div className="max-w-8xl mx-auto space-y-6">
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

                {/* Page Title & Breadcrumb */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Reservations Ledger
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Manage dining bookings, track arriving guests, and
                            update table seating statuses
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#1d1d1d]/60">
                        <span>
                            Total Registered:{' '}
                            <strong>{reservations.length}</strong>
                        </span>
                        <span>•</span>
                        <span>
                            Active:{' '}
                            <strong>{confirmedCount + seatedCount}</strong>
                        </span>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <Calendar className="size-6 text-[#1d1d1d]" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Total Bookings
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {reservations.length}
                                </h3>
                            </div>
                            <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                                Today
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Combined lunch & dinner reservations
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#2f4a3c]">
                            <CalendarCheck className="size-6 text-[#2f4a3c]" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Confirmed
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {confirmedCount} Parties
                                </h3>
                            </div>
                            <span className="rounded-full border border-[#2f4a3c]/20 bg-[#2f4a3c]/10 px-2 py-0.5 text-xs font-semibold text-[#2f4a3c]">
                                Pending Arrival
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Scheduled for tonight's service
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-amber-700">
                            <UserCheck className="size-6 text-amber-700" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Currently Seated
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {seatedCount}
                                </h3>
                            </div>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                                In Service
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Active table dining sessions
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-stone-600">
                            <Archive className="size-6 text-stone-600" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Completed
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {completedCount}
                                </h3>
                            </div>
                            <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                                Cleared
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Earlier seatings completed
                        </p>
                    </div>
                </div>

                {/* Reservations List */}
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
