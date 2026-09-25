import { Button } from '@/shared/components/ui/button';
import type { Table } from '@/features/booking/types';

type TablePickerProps = {
    tables: Array<Table>;
    selectedTableId: number | null;
    onSelectTable: (table: Table) => void;
};

export default function TablePicker({
    tables,
    selectedTableId,
    onSelectTable,
}: TablePickerProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
                const isSelected = selectedTableId === table.id;

                return (
                    <div
                        key={table.id}
                        className={`flex flex-col justify-between border bg-white p-6 transition-all duration-200 sm:p-8 ${
                            isSelected
                                ? 'border-[#1f1d1b] ring-2 ring-[#1f1d1b]'
                                : 'border-[#dedbd3] hover:border-[#1d1d1d]/40'
                        }`}
                    >
                        <div>
                            <h3 className="font-heading text-2xl font-normal text-[#1d1d1d]">
                                {table.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#1d1d1d]/70">
                                Seats {table.capacity}
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={() => onSelectTable(table)}
                            className={`mt-6 w-full rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                                isSelected
                                    ? 'bg-[#1f1d1b] text-[#f8f7f3] hover:bg-[#1f1d1b]/90'
                                    : 'border-2 border-[#1f1d1b] bg-transparent text-[#1d1d1d] hover:bg-[#1f1d1b] hover:text-[#f8f7f3]'
                            }`}
                        >
                            {isSelected ? 'Selected' : 'Reserve'}
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}
