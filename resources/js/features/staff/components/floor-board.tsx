import { Link } from '@inertiajs/react';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import { ReservationServiceLabel } from '@/features/staff/components/reservation-badges';
import {
    FloorStatusCounts,
    floorTableCardTone,
    TableStatusLabel,
} from '@/features/staff/components/table-floor-status';
import type { FloorTableCard } from '@/features/staff/types';
import { tables as tablesRoute } from '@/routes/staff';

type FloorBoardProps = {
    tables: FloorTableCard[];
    onSelectTable?: (tableId: string) => void;
    showViewAllLink?: boolean;
};

export default function FloorBoard({
    tables,
    onSelectTable,
    showViewAllLink = false,
}: FloorBoardProps) {
    const inServiceCount = tables.filter(
        (t) => t.status === 'In service',
    ).length;
    const reservedCount = tables.filter((t) => t.status === 'Reserved').length;
    const openCount = tables.filter((t) => t.status === 'Open').length;

    return (
        <div className="border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
            <div className="flex flex-col gap-3 border-b border-[#dedbd3]/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="font-heading text-xl font-semibold tracking-tight text-[#1d1d1d]">
                            Dining Room Floor Plan
                        </h2>
                        <span className="text-xs font-medium text-[#1d1d1d]/55">
                            {tables.length}{' '}
                            {tables.length === 1 ? 'table' : 'tables'}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-[#1d1d1d]/60">
                        Live occupancy • 2-hour seated windows per table
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <FloorStatusCounts
                        inService={inServiceCount}
                        reserved={reservedCount}
                        open={openCount}
                    />

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

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {tables.map((table) => (
                    <button
                        key={table.id}
                        type="button"
                        onClick={() => onSelectTable?.(table.id)}
                        className={`group relative flex flex-col justify-between border-2 p-3.5 text-left transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:ring-[#2f4a3c]/40 focus-visible:outline-none ${floorTableCardTone(table.status)}`}
                    >
                        <div>
                            <div className="relative mb-3 aspect-16/10 w-full overflow-hidden bg-stone-100">
                                <img
                                    src={
                                        table.image_url ||
                                        '/images/dining-table.png'
                                    }
                                    alt={table.name}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className="inline-flex items-center gap-1 bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                                        <Users className="size-2.5 text-white/80" />
                                        {table.capacity}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-1">
                                <h3 className="font-heading text-base font-semibold text-[#1d1d1d]">
                                    {table.name}
                                </h3>
                                {table.service && (
                                    <ReservationServiceLabel
                                        service={table.service}
                                    />
                                )}
                            </div>

                            <div className="mt-2 min-h-[44px]">
                                <p className="line-clamp-2 text-[11px] font-medium text-[#1d1d1d]">
                                    {table.partyInfo}
                                </p>
                                {table.timeSlot && (
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-[#1d1d1d]/60">
                                        <Clock className="size-2.5 shrink-0" />
                                        <span>{table.timeSlot}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 border-t border-[#dedbd3]/60 pt-2.5">
                            <TableStatusLabel status={table.status} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
