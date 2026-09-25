import { Link } from '@inertiajs/react';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import { tables as tablesRoute } from '@/routes/staff';
import type { TableState } from '@/features/staff/types';

type FloorBoardProps = {
    tables: TableState[];
    onResetTable?: (id: number) => void;
    showViewAllLink?: boolean;
};

export default function FloorBoard({
    tables,
    onResetTable,
    showViewAllLink = false,
}: FloorBoardProps) {
    const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
    const reservedCount = tables.filter((t) => t.status === 'Reserved').length;
    const openCount = tables.filter((t) => t.status === 'Open').length;

    return (
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
            {/* TailAdmin Card Header */}
            <div className="flex flex-col gap-3 border-b border-[#dedbd3]/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="font-heading text-xl font-semibold tracking-tight text-[#1d1d1d]">
                            Dining Room Floor Plan
                        </h2>
                        <span className="rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-xs font-medium text-[#1d1d1d]/70">
                            5 Tables
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-[#1d1d1d]/60">
                        Live occupancy • 2-hour seated windows per table
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-medium text-amber-800">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            {occupiedCount} Seated
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/20 bg-[#2f4a3c]/10 px-2.5 py-0.5 font-medium text-[#2f4a3c]">
                            <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                            {reservedCount} Reserved
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 font-medium text-stone-600">
                            <span className="size-1.5 rounded-full bg-stone-400" />
                            {openCount} Open
                        </span>
                    </div>

                    {showViewAllLink && (
                        <Link
                            href={tablesRoute.url()}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1d1d1d] transition-colors hover:text-[#2f4a3c]"
                        >
                            <span>Manage Floor</span>
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Grid of Tables */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {tables.map((table) => {
                    const isOccupied = table.status === 'Occupied';
                    const isReserved = table.status === 'Reserved';
                    const isOpen = table.status === 'Open';

                    return (
                        <div
                            key={table.id}
                            className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all hover:shadow-xs ${
                                isOccupied
                                    ? 'border-[#1f1d1b] bg-white ring-1 ring-[#1f1d1b]/10'
                                    : isReserved
                                      ? 'border-[#2f4a3c]/40 bg-white'
                                      : 'border-[#dedbd3] bg-[#faf9f6]/60'
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-heading text-lg font-semibold text-[#1d1d1d]">
                                            {table.name}
                                        </h3>
                                        {table.subtitle && (
                                            <p className="text-[11px] font-medium text-[#2f4a3c]">
                                                {table.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-md border border-[#dedbd3] bg-[#f8f7f3] px-2 py-0.5 text-[11px] font-medium text-[#1d1d1d]/70">
                                        <Users className="size-3 text-[#1d1d1d]/50" />
                                        {table.capacity}
                                    </span>
                                </div>

                                <div className="mt-3.5 min-h-[50px]">
                                    <p className="line-clamp-2 text-xs font-medium text-[#1d1d1d]">
                                        {table.partyInfo || 'No active party'}
                                    </p>
                                    {table.timeSlot && (
                                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#1d1d1d]/60">
                                            <Clock className="size-3 shrink-0" />
                                            <span>{table.timeSlot}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-[#dedbd3]/60 pt-3">
                                {isOccupied && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1d1b] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#f8f7f3] uppercase">
                                        <span className="size-1.5 rounded-full bg-amber-400" />
                                        Occupied
                                    </span>
                                )}
                                {isReserved && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                        <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                                        {table.statusLabel || 'Reserved'}
                                    </span>
                                )}
                                {isOpen && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dedbd3] bg-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1d1d1d]/70 uppercase">
                                        <span className="size-1.5 rounded-full bg-stone-400" />
                                        Open
                                    </span>
                                )}

                                {onResetTable && isOccupied && (
                                    <button
                                        type="button"
                                        onClick={() => onResetTable(table.id)}
                                        className="text-[11px] font-medium text-[#1d1d1d]/60 underline underline-offset-2 transition-colors hover:text-[#1d1d1d]"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
