import { Head } from '@inertiajs/react';
import {
    Users,
    CheckCircle2,
    Clock,
    Search,
    X,
    MapPin,
    Check,
    RotateCcw,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { initialTables } from '@/features/staff/components/mock-data';
import StaffLayout from '@/shared/layouts/staff-layout';
import type { TableState, TableStatus } from '@/features/staff/types';

export default function StaffTablesPage() {
    const [tables, setTables] = useState<TableState[]>(initialTables);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | TableStatus>(
        'All',
    );
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const filteredTables = useMemo(() => {
        return tables.filter((table) => {
            const query = search.trim().toLowerCase();
            const matchesQuery =
                !query ||
                table.name.toLowerCase().includes(query) ||
                (table.subtitle &&
                    table.subtitle.toLowerCase().includes(query)) ||
                (table.location &&
                    table.location.toLowerCase().includes(query)) ||
                (table.partyInfo &&
                    table.partyInfo.toLowerCase().includes(query));

            const matchesStatus =
                statusFilter === 'All' || table.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [tables, search, statusFilter]);

    const handleResetTable = (tableId: number) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          status: 'Open' as TableStatus,
                          statusLabel: 'Open',
                          partyInfo: 'Available for walk-in',
                          timeSlot: 'Free all evening',
                      }
                    : t,
            ),
        );
        setActionMessage(
            `Table ${tableId} has been cleared and reset to Open.`,
        );
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleSeatWalkin = (tableId: number) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          status: 'Occupied' as TableStatus,
                          statusLabel: 'Occupied',
                          partyInfo: 'Walk-in party seated',
                          timeSlot: 'Seated just now',
                      }
                    : t,
            ),
        );
        setActionMessage(`Walk-in party seated at Table ${tableId}.`);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleSeatReserved = (tableId: number) => {
        setTables((prev) =>
            prev.map((t) =>
                t.id === tableId
                    ? {
                          ...t,
                          status: 'Occupied' as TableStatus,
                          statusLabel: 'Occupied',
                          partyInfo: `${t.partyInfo?.replace('Reserved 19:00', '') || 'Guest'} • Seated`,
                      }
                    : t,
            ),
        );
        setActionMessage(
            `Reserved party marked as seated at Table ${tableId}.`,
        );
        setTimeout(() => setActionMessage(null), 4000);
    };

    const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
    const reservedCount = tables.filter((t) => t.status === 'Reserved').length;
    const openCount = tables.filter((t) => t.status === 'Open').length;

    return (
        <StaffLayout activeTablesCount={`${occupiedCount}/${tables.length}`}>
            <Head title="Staff Tables | Halden" />

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

                {/* Page Title & Context Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Dining Room Tables
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Visual dining room floor, actual table arrangements,
                            and live seating states
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#1d1d1d]/60">
                        <span>5 Tables</span>
                        <span>•</span>
                        <span>20 Max Covers</span>
                        <span>•</span>
                        <span>Main Hall</span>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#dedbd3] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-xs">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter table, location, or party..."
                            className="h-10 w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/50 pr-4 pl-10 text-xs text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/40 focus:border-[#1f1d1b] focus:bg-white focus:ring-1 focus:ring-[#1f1d1b] focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-xs text-[#1d1d1d]/50">
                            Status:
                        </span>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('All')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                statusFilter === 'All'
                                    ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3] shadow-2xs'
                                    : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70 hover:bg-[#f8f7f3]'
                            }`}
                        >
                            All ({tables.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('Occupied')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                statusFilter === 'Occupied'
                                    ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3] shadow-2xs'
                                    : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70 hover:bg-[#f8f7f3]'
                            }`}
                        >
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Occupied ({occupiedCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('Reserved')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                statusFilter === 'Reserved'
                                    ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3] shadow-2xs'
                                    : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70 hover:bg-[#f8f7f3]'
                            }`}
                        >
                            <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                            Reserved ({reservedCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('Open')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                statusFilter === 'Open'
                                    ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3] shadow-2xs'
                                    : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70 hover:bg-[#f8f7f3]'
                            }`}
                        >
                            <span className="size-1.5 rounded-full bg-stone-400" />
                            Open ({openCount})
                        </button>

                        {(search || statusFilter !== 'All') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('All');
                                }}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                            >
                                <X className="size-3.5" />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Photo-First Table Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTables.map((table) => {
                        const isOccupied = table.status === 'Occupied';
                        const isReserved = table.status === 'Reserved';
                        const isOpen = table.status === 'Open';

                        return (
                            <div
                                key={table.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-xs transition-all hover:shadow-md"
                            >
                                <div>
                                    {/* Table Actual Photo Preview */}
                                    <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                                        <img
                                            src={
                                                table.image ||
                                                '/images/dining-table.png'
                                            }
                                            alt={table.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                                        {/* Status Badge floating on top-left */}
                                        <div className="absolute top-3 left-3">
                                            {isOccupied && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1f1d1b]/95 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#f8f7f3] uppercase shadow-xs backdrop-blur-xs">
                                                    <span className="size-1.5 rounded-full bg-amber-400" />
                                                    Occupied
                                                </span>
                                            )}
                                            {isReserved && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#2f4a3c]/95 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#f8f7f3] uppercase shadow-xs backdrop-blur-xs">
                                                    <span className="size-1.5 rounded-full bg-emerald-400" />
                                                    {table.statusLabel ||
                                                        'Reserved'}
                                                </span>
                                            )}
                                            {isOpen && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dedbd3] bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#1d1d1d] uppercase shadow-xs backdrop-blur-xs">
                                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                                    Open
                                                </span>
                                            )}
                                        </div>

                                        {/* Capacity Badge floating on top-right */}
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-xs">
                                                <Users className="size-3.5 text-white/80" />
                                                <span>
                                                    Seats {table.capacity}
                                                </span>
                                            </span>
                                        </div>

                                        {/* Table Name Title over Image bottom */}
                                        <div className="absolute right-3 bottom-3 left-3 text-white">
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="font-heading text-xl font-normal text-white drop-shadow-xs">
                                                    {table.name}
                                                </h3>
                                                {table.subtitle && (
                                                    <span className="text-xs font-medium text-emerald-300 drop-shadow-xs">
                                                        {table.subtitle}
                                                    </span>
                                                )}
                                            </div>
                                            {table.location && (
                                                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
                                                    <MapPin className="size-3 text-white/70" />
                                                    <span>
                                                        {table.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Information Body */}
                                    <div className="p-4 sm:p-5">
                                        <div className="rounded-xl border border-[#dedbd3]/70 bg-[#f8f7f3]/70 p-3.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-semibold text-[#1d1d1d]">
                                                        {table.partyInfo ||
                                                            'No active party'}
                                                    </p>
                                                    {table.timeSlot && (
                                                        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#1d1d1d]/60">
                                                            <Clock className="size-3 text-[#1d1d1d]/50" />
                                                            <span>
                                                                {table.timeSlot}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span
                                                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                        isOccupied
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : isReserved
                                                              ? 'bg-[#2f4a3c]/15 text-[#2f4a3c]'
                                                              : 'bg-emerald-100 text-emerald-800'
                                                    }`}
                                                >
                                                    {isOccupied
                                                        ? 'Seated'
                                                        : isReserved
                                                          ? 'Booked'
                                                          : 'Available'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Actions Footer */}
                                <div className="flex items-center justify-between gap-2 border-t border-[#dedbd3]/70 bg-[#faf9f6]/40 p-4 sm:px-5">
                                    <span className="text-[11px] text-[#1d1d1d]/50">
                                        Table #{table.id} • Main Floor
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {isOpen && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSeatWalkin(table.id)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f1d1b] px-3.5 py-1.5 text-xs font-semibold text-[#f8f7f3] shadow-2xs transition-colors hover:bg-[#1f1d1b]/85"
                                            >
                                                <Check className="size-3.5" />
                                                <span>Seat Walk-in</span>
                                            </button>
                                        )}

                                        {isReserved && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleResetTable(
                                                            table.id,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-xl border border-[#dedbd3] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1d1d1d]/70 transition-colors hover:bg-[#f8f7f3]"
                                                    title="Release table"
                                                >
                                                    <RotateCcw className="size-3" />
                                                    <span>Release</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSeatReserved(
                                                            table.id,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2f4a3c] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#2f4a3c]/85"
                                                >
                                                    <Check className="size-3.5" />
                                                    <span>Seat Party</span>
                                                </button>
                                            </>
                                        )}

                                        {isOccupied && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleResetTable(table.id)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#dedbd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1d1d] shadow-2xs transition-colors hover:bg-[#f8f7f3]"
                                            >
                                                <RotateCcw className="size-3.5" />
                                                <span>Clear & Reset</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </StaffLayout>
    );
}
