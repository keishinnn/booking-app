import { Head } from "@inertiajs/react";
import {
    CheckCircle2,
    Users,
    Grid3X3,
    Clock,
    CalendarCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import FloorBoard from "@/features/staff/components/floor-board";
import {
    initialReservations,
    initialTables,
} from "@/features/staff/components/mock-data";
import ReservationList from "@/features/staff/components/reservation-list";
import StaffLayout from "@/shared/layouts/staff-layout";
import type {
    Reservation,
    ReservationServiceFilter,
    ReservationStatusFilter,
    TableState,
} from "@/features/staff/types";

export default function StaffDashboard() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<ReservationStatusFilter>("All");
    const [serviceFilter, setServiceFilter] =
        useState<ReservationServiceFilter>("All");
    const [reservations, setReservations] =
        useState<Reservation[]>(initialReservations);
    const [tables, setTables] = useState<TableState[]>(initialTables);
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
                statusFilter === "All" || res.status === statusFilter;

            const matchesService =
                serviceFilter === "All" || res.service === serviceFilter;

            return matchesQuery && matchesStatus && matchesService;
        });
    }, [reservations, search, statusFilter, serviceFilter]);

    const handleSeatParty = (
        id: string,
        guestName: string,
        tableLabel: string,
    ) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Seated" } : r)),
        );
        setTables((prev) =>
            prev.map((t) =>
                tableLabel.includes(t.name)
                    ? {
                          ...t,
                          status: "Occupied",
                          partyInfo: `${guestName}, seated`,
                      }
                    : t,
            ),
        );
        setActionMessage(`Seated ${guestName} at ${tableLabel}.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleCompleteParty = (id: string, guestName: string) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Completed" } : r)),
        );
        setActionMessage(`Service completed for ${guestName}. Table reset.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleResetTable = (tableId: number) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          status: "Open",
                          partyInfo: "Available for walk-in",
                      }
                    : t,
            ),
        );
        setActionMessage(`Table ${tableId} reset to open.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const activeSeatedCount = tables.filter(
        (t) => t.status === "Occupied",
    ).length;
    const totalCovers = reservations.reduce(
        (acc, curr) => acc + curr.partySize,
        0,
    );

    return (
        <StaffLayout
            reservationCount={reservations.length}
            activeTablesCount={`${activeSeatedCount}/${tables.length}`}
            searchValue={search}
            onSearchChange={setSearch}
        >
            <Head title="Staff Overview | Halden" />

            <div className="mx-auto max-w-8xl space-y-6">
                {/* Action Feedback Toast */}
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

                {/* Dashboard Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Service Overview
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Today's floor operations, active dinner service, and
                            live guest seating
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#1d1d1d]/60">
                        <span>
                            Capacity: <strong>20 covers</strong>
                        </span>
                        <span>•</span>
                        <span>
                            Shift: <strong>Dinner</strong>
                        </span>
                    </div>
                </div>

                {/* Streamlined Shift Summary Bar (Clean, no AI slop) */}
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
                                Active Seating
                            </span>
                            <p className="font-heading text-xl font-semibold text-[#1d1d1d]">
                                {activeSeatedCount} of 5 Tables
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
                                19:00 (2 Parties)
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
                                {reservations.length} Booked
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floor Board Section with Table Photos */}
                <FloorBoard
                    tables={tables}
                    onResetTable={handleResetTable}
                    showViewAllLink={true}
                />

                {/* Active Reservations Ledger Section */}
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
                        setSearch("");
                        setStatusFilter("All");
                        setServiceFilter("All");
                    }}
                    onSeatParty={handleSeatParty}
                    onCompleteParty={handleCompleteParty}
                    showViewAllLink={true}
                    title="Active Seating & Bookings"
                />
            </div>
        </StaffLayout>
    );
}
