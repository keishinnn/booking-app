import { Head, Link } from '@inertiajs/react';
import { Search, Users, Clock, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import StaffLayout from '@/layouts/staff-layout';

type TableStatus = 'Occupied' | 'Reserved' | 'Open';

interface TableState {
    id: number;
    name: string;
    subtitle?: string;
    capacity: number;
    status: TableStatus;
    statusLabel?: string;
    partyInfo?: string;
    timeSlot?: string;
}

interface Reservation {
    id: string;
    time: string;
    guestName: string;
    email: string;
    phone: string;
    table: string;
    partySize: number;
    status: 'Seated' | 'Confirmed' | 'Completed' | 'Cancelled';
    service: 'Lunch' | 'Dinner';
    notes?: string;
}

const initialTables: TableState[] = [
    {
        id: 1,
        name: 'Table 1',
        capacity: 2,
        status: 'Occupied',
        statusLabel: 'Occupied',
        partyInfo: 'Sara Lindqvist, 2 guests',
        timeSlot: '18:30–20:30',
    },
    {
        id: 2,
        name: 'Table 2',
        capacity: 2,
        status: 'Open',
        statusLabel: 'Open',
        partyInfo: 'Available for walk-in',
        timeSlot: 'Free until 20:00',
    },
    {
        id: 3,
        name: 'Table 3',
        capacity: 4,
        status: 'Reserved',
        statusLabel: 'Reserved 19:00',
        partyInfo: 'Henrik Berg, 4 guests',
        timeSlot: '19:00–21:00',
    },
    {
        id: 4,
        name: 'Table 4',
        capacity: 4,
        status: 'Open',
        statusLabel: 'Open',
        partyInfo: 'Available for walk-in',
        timeSlot: 'Free all evening',
    },
    {
        id: 5,
        name: 'Table 5',
        subtitle: 'The Long Table',
        capacity: 6,
        status: 'Reserved',
        statusLabel: 'Reserved 19:00',
        partyInfo: 'Elena Rost, 6 guests',
        timeSlot: '19:00–21:00',
    },
];

const initialReservations: Reservation[] = [
    {
        id: 'res-1',
        time: '18:30',
        guestName: 'Sara Lindqvist',
        email: 'sara@example.com',
        phone: '+46 70 123 4567',
        table: 'Table 1',
        partySize: 2,
        status: 'Seated',
        service: 'Dinner',
        notes: 'Window preference • Celebrating quiet dinner',
    },
    {
        id: 'res-2',
        time: '19:00',
        guestName: 'Henrik Berg',
        email: 'henrik.berg@nordic.se',
        phone: '+46 70 234 5678',
        table: 'Table 3',
        partySize: 4,
        status: 'Confirmed',
        service: 'Dinner',
        notes: 'Wedding anniversary',
    },
    {
        id: 'res-3',
        time: '19:00',
        guestName: 'Elena Rost',
        email: 'elena@rost.design',
        phone: '+46 73 987 6543',
        table: 'Table 5 (The Long Table)',
        partySize: 6,
        status: 'Confirmed',
        service: 'Dinner',
        notes: 'Private tasting menu requested',
    },
    {
        id: 'res-4',
        time: '12:00',
        guestName: 'Jonas Dahl',
        email: 'jonas.dahl@stockholm.se',
        phone: '+46 70 555 1234',
        table: 'Table 2',
        partySize: 2,
        status: 'Completed',
        service: 'Lunch',
        notes: 'Lunch service',
    },
    {
        id: 'res-5',
        time: '13:00',
        guestName: 'Astrid Lind',
        email: 'astrid@lind.org',
        phone: '+46 72 333 4455',
        table: 'Table 4',
        partySize: 4,
        status: 'Completed',
        service: 'Lunch',
        notes: 'Dairy intolerance noted',
    },
];

export default function StaffDashboard() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Seated' | 'Confirmed' | 'Completed'>('All');
    const [serviceFilter, setServiceFilter] = useState<'All' | 'Dinner' | 'Lunch'>('All');
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
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
                statusFilter === 'All' || res.status === statusFilter;

            const matchesService =
                serviceFilter === 'All' || res.service === serviceFilter;

            return matchesQuery && matchesStatus && matchesService;
        });
    }, [reservations, search, statusFilter, serviceFilter]);

    const handleSeatParty = (id: string, guestName: string, tableLabel: string) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Seated' } : r))
        );
        setActionMessage(`Seated ${guestName} at ${tableLabel}.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleCompleteParty = (id: string, guestName: string) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r))
        );
        setActionMessage(`Service completed for ${guestName}. Table reset.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    return (
        <StaffLayout>
            <Head title="Staff Dashboard | Halden" />

            <div className="mx-auto max-w-7xl">
                {/* Notification toast if action triggered */}
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

                {/* Editorial Header */}
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

                {/* Three Key Metrics Cards */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {/* Card 1: Total Covers */}
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

                    {/* Card 2: Active Tables */}
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

                    {/* Card 3: Next Seating */}
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

                {/* Live Table Status Grid */}
                <div className="mt-10">
                    <div className="flex items-center justify-between pb-3">
                        <div>
                            <h2 className="text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase">
                                Live Dining Room Status
                            </h2>
                            <p className="text-xs text-[#1d1d1d]/60">
                                2-hour seated windows per table
                            </p>
                        </div>
                        <span className="text-xs text-[#1d1d1d]/60">
                            Capacity: 20 seats
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {tables.map((table) => {
                            const isOccupied = table.status === 'Occupied';
                            const isReserved = table.status === 'Reserved';
                            const isOpen = table.status === 'Open';

                            return (
                                <div
                                    key={table.id}
                                    className={`flex flex-col justify-between border bg-white p-5 transition-colors ${
                                        isOccupied
                                            ? 'border-[#1f1d1b]'
                                            : isReserved
                                            ? 'border-[#2f4a3c]/40'
                                            : 'border-[#dedbd3]'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-heading text-lg font-normal text-[#1d1d1d]">
                                                    {table.name}
                                                </h3>
                                                {table.subtitle && (
                                                    <p className="text-[11px] font-medium text-[#2f4a3c]">
                                                        {table.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="shrink-0 text-xs text-[#1d1d1d]/60">
                                                Seats {table.capacity}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-xs font-medium text-[#1d1d1d]">
                                                {table.partyInfo}
                                            </p>
                                            {table.timeSlot && (
                                                <p className="mt-0.5 text-[11px] text-[#1d1d1d]/60">
                                                    {table.timeSlot}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-[#dedbd3]/60">
                                        {isOccupied && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1d1b] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#f8f7f3] uppercase">
                                                <span className="size-1.5 rounded-full bg-amber-400" />
                                                Occupied
                                            </span>
                                        )}
                                        {isReserved && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                                <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                                                {table.statusLabel || 'Reserved'}
                                            </span>
                                        )}
                                        {isOpen && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1d1d1d]/75 uppercase">
                                                <span className="size-1.5 rounded-full bg-stone-400" />
                                                Open
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Today's Reservations Table & Filters */}
                <div className="mt-10 border border-[#dedbd3] bg-white p-6 sm:p-8">
                    {/* Header with Title and Count */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#dedbd3] pb-6">
                        <div>
                            <h2 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d]">
                                Today's Reservations
                            </h2>
                            <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                Showing {filteredReservations.length} of {reservations.length} reservations
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#1d1d1d]/60">
                                Service:
                            </span>
                            {(['All', 'Dinner', 'Lunch'] as const).map((service) => (
                                <button
                                    key={service}
                                    type="button"
                                    onClick={() => setServiceFilter(service)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                        serviceFilter === service
                                            ? 'bg-[#1f1d1b] text-[#f8f7f3]'
                                            : 'border border-[#dedbd3] bg-[#f8f7f3]/60 text-[#1d1d1d]/70 hover:border-[#1d1d1d]/30'
                                    }`}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter controls: Search and Status pills */}
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Input */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by guest name or email..."
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 py-2.5 pr-4 pl-10 text-xs text-[#1d1d1d] placeholder:text-[#1d1d1d]/40 transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                        </div>

                        {/* Status Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-[#1d1d1d]/60">Status:</span>
                            {(['All', 'Confirmed', 'Seated', 'Completed'] as const).map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                        statusFilter === status
                                            ? 'bg-[#1f1d1b] text-[#f8f7f3]'
                                            : 'border border-[#dedbd3] bg-[#f8f7f3]/60 text-[#1d1d1d]/70 hover:border-[#1d1d1d]/30'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                            {(search || statusFilter !== 'All' || serviceFilter !== 'All') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('All');
                                        setServiceFilter('All');
                                    }}
                                    className="ml-1 text-xs text-[#1d1d1d]/60 underline hover:text-[#1d1d1d]"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Clean responsive HTML table */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-[#dedbd3] text-[11px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    <th className="py-3 pr-4 pl-1">Time</th>
                                    <th className="py-3 px-4">Guest Name</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Table</th>
                                    <th className="py-3 px-4">Party Size</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 pr-1 pl-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dedbd3]/50">
                                {filteredReservations.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-12 text-center text-sm text-[#1d1d1d]/60"
                                        >
                                            No reservations match your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReservations.map((res) => (
                                        <tr
                                            key={res.id}
                                            className="transition-colors hover:bg-[#f8f7f3]/60"
                                        >
                                            {/* Time */}
                                            <td className="py-4 pr-4 pl-1 font-mono text-sm font-semibold text-[#1d1d1d]">
                                                {res.time}
                                            </td>

                                            {/* Guest Name & Notes */}
                                            <td className="py-4 px-4">
                                                <div className="font-medium text-[#1d1d1d]">
                                                    {res.guestName}
                                                </div>
                                                {res.notes && (
                                                    <p className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                        {res.notes}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Contact */}
                                            <td className="py-4 px-4 text-xs text-[#1d1d1d]/75">
                                                <div>{res.email}</div>
                                                <div className="mt-0.5 text-[#1d1d1d]/60">{res.phone}</div>
                                            </td>

                                            {/* Table */}
                                            <td className="py-4 px-4 text-xs font-medium text-[#1d1d1d]">
                                                {res.table}
                                            </td>

                                            {/* Party Size */}
                                            <td className="py-4 px-4 text-xs text-[#1d1d1d]/80">
                                                {res.partySize} {res.partySize === 1 ? 'guest' : 'guests'}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-4">
                                                {res.status === 'Seated' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1d1b] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#f8f7f3] uppercase">
                                                        <span className="size-1.5 rounded-full bg-amber-400" />
                                                        Seated
                                                    </span>
                                                )}
                                                {res.status === 'Confirmed' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                                        <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                                                        Confirmed
                                                    </span>
                                                )}
                                                {res.status === 'Completed' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                                        <span className="size-1.5 rounded-full bg-stone-400" />
                                                        Completed
                                                    </span>
                                                )}
                                                {res.status === 'Cancelled' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8a4b3b]/30 bg-[#8a4b3b]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#8a4b3b] uppercase">
                                                        <span className="size-1.5 rounded-full bg-[#8a4b3b]" />
                                                        Cancelled
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 pr-1 pl-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {res.status === 'Confirmed' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSeatParty(res.id, res.guestName, res.table)}
                                                            className="rounded-full bg-[#1f1d1b] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#f8f7f3] uppercase transition-colors hover:bg-[#1f1d1b]/80"
                                                        >
                                                            Seat Party
                                                        </button>
                                                    )}
                                                    {res.status === 'Seated' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCompleteParty(res.id, res.guestName)}
                                                            className="rounded-full border border-[#dedbd3] bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1d1d1d] uppercase transition-colors hover:bg-[#f8f7f3]"
                                                        >
                                                            Clear Table
                                                        </button>
                                                    )}
                                                    {res.status === 'Completed' && (
                                                        <span className="text-xs text-[#1d1d1d]/50 italic">
                                                            Archived
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer Summary */}
                    <div className="mt-6 flex flex-col gap-2 border-t border-[#dedbd3] pt-4 text-xs text-[#1d1d1d]/60 sm:flex-row sm:items-center sm:justify-between">
                        <span>Halden Floor Book • Floor Host on duty: Maja Eklund</span>
                        <Link
                            href="/reservations"
                            className="font-medium text-[#1d1d1d] underline underline-offset-4 hover:text-[#2f4a3c]"
                        >
                            Open full guest reservation ledger →
                        </Link>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
