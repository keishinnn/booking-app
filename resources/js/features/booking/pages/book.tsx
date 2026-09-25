import { Head, router } from '@inertiajs/react';
import { useRef, useState, useTransition } from 'react';
import ReservationFilters from '@/features/booking/components/reservation-filters';
import ReservationForm from '@/features/booking/components/reservation-form';
import TablePicker from '@/features/booking/components/table-picker';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';
import type {
    BookingFilterField,
    BookPageProps,
    Table,
} from '@/features/booking/types';

export default function Book({ filters, tables }: BookPageProps) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const formSectionRef = useRef<HTMLDivElement>(null);
    const [, startTransition] = useTransition();

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const hasAllFilters = Boolean(
        filters.date && filters.party_size && filters.starts_at,
    );

    const handleFilterChange = (field: BookingFilterField, value: string) => {
        setSelectedTable(null);

        const newDate = field === 'date' ? value : (filters.date ?? '');
        const newPartySize =
            field === 'party_size'
                ? value
                : filters.party_size
                  ? String(filters.party_size)
                  : '';
        const newStartsAt =
            field === 'starts_at' ? value : (filters.starts_at ?? '');

        const params: Record<string, string | number> = {};
        if (newDate) {
            params.date = newDate;
        }
        if (newPartySize) {
            params.party_size = Number(newPartySize);
        }
        if (newStartsAt) {
            params.starts_at = newStartsAt;
        }

        startTransition(() => {
            router.get(reserve.url(), params, {
                preserveState: true,
                replace: true,
            });
        });
    };

    const handleSelectTable = (table: Table) => {
        if (selectedTable?.id === table.id) {
            setSelectedTable(null);
            return;
        }

        setSelectedTable(table);
        setTimeout(() => {
            formSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 80);
    };

    const activeTable = tables.find((t) => t.id === selectedTable?.id) ?? null;

    return (
        <GuestLayout>
            <Head title="Reserve a table | Halden" />

            <section className="min-h-[calc(100vh-4.5rem)] bg-[#f8f7f3] py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-wider text-[#2f4a3c] uppercase">
                            Reservations
                        </span>
                        <h1 className="mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
                            Reserve a table.
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            Lunch and dinner daily from 11:00 to 21:00. Last
                            seating is at 19:00.
                        </p>
                    </div>

                    <ReservationFilters
                        filters={filters}
                        today={today}
                        onFilterChange={handleFilterChange}
                    />

                    {!hasAllFilters ? (
                        <div className="mt-10 rounded-2xl border border-[#dedbd3] bg-white p-8 text-center shadow-2xs sm:p-14">
                            <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                Select a date, party size, and time to view open
                                tables.
                            </p>
                            <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                Every reservation includes our guaranteed
                                two-hour table hold.
                            </p>
                        </div>
                    ) : tables.length === 0 ? (
                        <div className="mt-10 rounded-2xl border border-[#dedbd3] bg-white p-8 text-center shadow-2xs sm:p-14">
                            <h2 className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                No tables currently open for that seating.
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                Please try an adjacent time slot or another
                                date. Lunch and dinner are served from 11:00 to
                                21:00.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 space-y-10">
                            <TablePicker
                                tables={tables}
                                selectedTableId={activeTable?.id ?? null}
                                onSelectTable={handleSelectTable}
                            />

                            {activeTable && (
                                <ReservationForm
                                    table={activeTable}
                                    filters={filters}
                                    formSectionRef={formSectionRef}
                                />
                            )}
                        </div>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}
