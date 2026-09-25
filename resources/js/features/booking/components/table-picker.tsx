import { Check, Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { Table } from '@/features/booking/types';

type TablePickerProps = {
    tables: Array<Table>;
    selectedTableId: number | null;
    onSelectTable: (table: Table) => void;
};

const tableMeta: Record<
    number,
    { image: string; tag: string; setting: string }
> = {
    1: {
        image: '/images/dining-table.png',
        tag: 'Window Setting',
        setting:
            'Mercer Lane window view with generous daylight and linen bench seating.',
    },
    2: {
        image: '/images/dining-table.png',
        tag: 'Window Setting',
        setting:
            'Quiet corner table with soft morning daylight and linen place settings.',
    },
    3: {
        image: '/images/dining-table.png',
        tag: 'Hearth Setting',
        setting:
            'Centered in the dining room, warmed by the wood-fired kitchen hearth.',
    },
    4: {
        image: '/images/dining-table.png',
        tag: 'Banquette Setting',
        setting:
            'Generous bench seating with handcrafted Swedish white oak dining table.',
    },
    5: {
        image: '/images/long-table.png',
        tag: 'The Long Table',
        setting:
            'Solid oak dining table for family celebrations and shared plates.',
    },
};

export default function TablePicker({
    tables,
    selectedTableId,
    onSelectTable,
}: TablePickerProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#dedbd3] pb-3">
                <h2 className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                    Select a table
                </h2>
                <span className="text-xs text-[#1d1d1d]/60">
                    {tables.length} {tables.length === 1 ? 'table' : 'tables'}{' '}
                    available
                </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tables.map((table) => {
                    const isSelected = selectedTableId === table.id;
                    const meta = tableMeta[table.id] ?? {
                        image: '/images/dining-table.png',
                        tag: 'Dining Room',
                        setting: 'Swedish oak table set with natural linen.',
                    };

                    return (
                        <div
                            key={table.id}
                            onClick={() => onSelectTable(table)}
                            className={`group flex cursor-pointer flex-col justify-between rounded-2xl border bg-white p-3 transition-all duration-300 ${
                                isSelected
                                    ? 'border-[#1f1d1b] shadow-sm ring-2 ring-[#1f1d1b]'
                                    : 'border-[#dedbd3] hover:border-[#1d1d1d]/50 hover:shadow-2xs'
                            }`}
                        >
                            <div>
                                {/* Photo Container */}
                                <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-stone-100">
                                    <img
                                        src={meta.image}
                                        alt={table.name}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                                    />
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-[#1f1d1b] text-[#f8f7f3] shadow-xs">
                                            <Check className="size-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Table Meta */}
                                <div className="p-3 pt-4">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                            {meta.tag}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-[#1d1d1d]/70">
                                            <Users className="size-3.5" />
                                            <span>Seats {table.capacity}</span>
                                        </div>
                                    </div>

                                    <h3 className="mt-1 font-heading text-2xl font-normal text-[#1d1d1d]">
                                        {table.name}
                                    </h3>

                                    <p className="mt-2 text-xs leading-relaxed text-[#1d1d1d]/75">
                                        {meta.setting}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectTable(table);
                                    }}
                                    className={`w-full rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-98 ${
                                        isSelected
                                            ? 'bg-[#1f1d1b] text-[#f8f7f3] hover:bg-[#1f1d1b]/90'
                                            : 'border border-[#1f1d1b] bg-transparent text-[#1d1d1d] hover:bg-[#1f1d1b] hover:text-[#f8f7f3]'
                                    }`}
                                >
                                    {isSelected
                                        ? 'Table selected'
                                        : `Select ${table.name}`}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
