import { Head } from '@inertiajs/react';
import {
    Grid3X3,
    Users,
    CheckCircle2,
    Armchair,
    DoorOpen,
    Info,
} from 'lucide-react';
import { useState } from 'react';
import FloorBoard from '@/features/staff/components/floor-board';
import { initialTables } from '@/features/staff/components/mock-data';
import StaffLayout from '@/shared/layouts/staff-layout';
import type { TableState, TableStatus } from '@/features/staff/types';

export default function StaffTablesPage() {
    const [tables, setTables] = useState<TableState[]>(initialTables);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

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

    const totalCapacity = tables.reduce((acc, curr) => acc + curr.capacity, 0);
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

                {/* Page Title & Breadcrumbs */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Dining Room Tables
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Real-time floor layout, table occupancy, seating
                            turnovers, and walk-in availability
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#1d1d1d]/60">
                        <span>
                            Room: <strong>Main Dining Hall</strong>
                        </span>
                        <span>•</span>
                        <span>
                            Reserved: <strong>{reservedCount}</strong>
                        </span>
                        <span>•</span>
                        <span>
                            Windows: <strong>2-hour limit</strong>
                        </span>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <Grid3X3 className="size-6 text-[#1d1d1d]" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Total Tables
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {tables.length} Tables
                                </h3>
                            </div>
                            <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                                Active Floor
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Fixed dining configuration
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-[#1d1d1d]">
                            <Users className="size-6 text-[#1d1d1d]" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Max Capacity
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {totalCapacity} Seats
                                </h3>
                            </div>
                            <span className="rounded-full border border-[#2f4a3c]/20 bg-[#2f4a3c]/10 px-2 py-0.5 text-xs font-semibold text-[#2f4a3c]">
                                Full Hall
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Across tables 1 through 5
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-amber-700">
                            <Armchair className="size-6 text-amber-700" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Occupied
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {occupiedCount}
                                </h3>
                            </div>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                                {Math.round(
                                    (occupiedCount / tables.length) * 100,
                                )}
                                % Seated
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Currently dining
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] text-emerald-700">
                            <DoorOpen className="size-6 text-emerald-700" />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                    Open For Walk-In
                                </span>
                                <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-[#1d1d1d]">
                                    {openCount}
                                </h3>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                Available Now
                            </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#1d1d1d]/60">
                            Immediate seating possible
                        </p>
                    </div>
                </div>

                {/* Live Floor Board Component */}
                <FloorBoard tables={tables} onResetTable={handleResetTable} />

                {/* Table Specifications & Quick Operations Card */}
                <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
                    <div className="flex items-center gap-2 border-b border-[#dedbd3]/70 pb-4">
                        <Info className="size-4 text-[#1d1d1d]/50" />
                        <h2 className="font-heading text-lg font-semibold text-[#1d1d1d]">
                            Table Details & Quick Actions
                        </h2>
                    </div>

                    <div className="mt-4 divide-y divide-[#dedbd3]/60">
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dedbd3] bg-[#f8f7f3] font-heading text-sm font-semibold text-[#1d1d1d]">
                                        T{table.id}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-[#1d1d1d]">
                                                {table.name}
                                            </span>
                                            {table.subtitle && (
                                                <span className="text-xs font-medium text-[#2f4a3c]">
                                                    ({table.subtitle})
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                            Max {table.capacity} guests •{' '}
                                            {table.partyInfo}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
                                            table.status === 'Occupied'
                                                ? 'bg-[#1f1d1b] text-white'
                                                : table.status === 'Reserved'
                                                  ? 'border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 text-[#2f4a3c]'
                                                  : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70'
                                        }`}
                                    >
                                        <span
                                            className={`size-1.5 rounded-full ${
                                                table.status === 'Occupied'
                                                    ? 'bg-amber-400'
                                                    : table.status ===
                                                        'Reserved'
                                                      ? 'bg-[#2f4a3c]'
                                                      : 'bg-stone-400'
                                            }`}
                                        />
                                        {table.status}
                                    </span>

                                    {table.status === 'Open' ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSeatWalkin(table.id)
                                            }
                                            className="rounded-lg bg-[#1f1d1b] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#1f1d1b]/85"
                                        >
                                            Seat Walk-in
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleResetTable(table.id)
                                            }
                                            className="rounded-lg border border-[#dedbd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1d1d] shadow-2xs transition-colors hover:bg-[#f8f7f3]"
                                        >
                                            Reset Table
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
