import type { TableState } from '@/features/staff/types';

type FloorBoardProps = {
    tables: TableState[];
};

export default function FloorBoard({ tables }: FloorBoardProps) {
    return (
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

                            <div className="mt-5 border-t border-[#dedbd3]/60 pt-3">
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
    );
}
