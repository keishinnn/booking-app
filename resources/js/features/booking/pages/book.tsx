import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, Clock, Users } from 'lucide-react';
import { useRef, useTransition } from 'react';
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

const tableMeta: Record<
    number,
    {
        name: string;
        capacity: number;
        image: string;
        tag: string;
        setting: string;
    }
> = {
    1: {
        name: 'Table 1',
        capacity: 2,
        image: '/images/dining-table.png',
        tag: 'Window Setting',
        setting:
            'Mercer Lane window view with generous daylight and linen bench seating.',
    },
    2: {
        name: 'Table 2',
        capacity: 2,
        image: '/images/dining-table.png',
        tag: 'Window Setting',
        setting:
            'Quiet corner table with soft morning daylight and linen place settings.',
    },
    3: {
        name: 'Table 3',
        capacity: 4,
        image: '/images/dining-table.png',
        tag: 'Hearth Setting',
        setting:
            'Centered in the dining room, warmed by the wood-fired kitchen hearth.',
    },
    4: {
        name: 'Table 4',
        capacity: 4,
        image: '/images/dining-table.png',
        tag: 'Banquette Setting',
        setting:
            'Generous bench seating with handcrafted Swedish white oak dining table.',
    },
    5: {
        name: 'Table 5',
        capacity: 6,
        image: '/images/long-table.png',
        tag: 'The Long Table',
        setting:
            'Solid oak dining table for family celebrations and shared plates.',
    },
};

export default function Book({ filters, tables }: BookPageProps) {
    const formSectionRef = useRef<HTMLDivElement>(null);
    const [, startTransition] = useTransition();

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const hasAllFilters = Boolean(
        filters.date && filters.party_size && filters.starts_at,
    );

    const isStep2 = Boolean(
        filters.step === 2 &&
        filters.table_id &&
        filters.date &&
        filters.party_size &&
        filters.starts_at,
    );

    const handleFilterChange = (field: BookingFilterField, value: string) => {
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
        const params: Record<string, string | number> = {
            date: filters.date ?? '',
            party_size: filters.party_size ?? '',
            starts_at: filters.starts_at ?? '',
            table_id: table.id,
            step: 2,
        };

        startTransition(() => {
            router.get(reserve.url(), params, {
                preserveState: true,
                replace: false, // push history so browser back returns to step 1
            });
        });
    };

    const handleBackToStep1 = () => {
        const params: Record<string, string | number> = {};
        if (filters.date) {
            params.date = filters.date;
        }
        if (filters.party_size) {
            params.party_size = filters.party_size;
        }
        if (filters.starts_at) {
            params.starts_at = filters.starts_at;
        }

        startTransition(() => {
            router.get(reserve.url(), params, {
                preserveState: true,
                replace: false,
            });
        });
    };

    // Find table from tables list or fallback to metadata
    const selectedTableId = filters.table_id ? Number(filters.table_id) : null;
    const activeTable: Table | null =
        (selectedTableId && tables.find((t) => t.id === selectedTableId)) ||
        (selectedTableId && tableMeta[selectedTableId]
            ? {
                  id: selectedTableId,
                  name: tableMeta[selectedTableId].name,
                  capacity: tableMeta[selectedTableId].capacity,
              }
            : null);

    const selectedMeta = selectedTableId
        ? (tableMeta[selectedTableId] ?? {
              name: activeTable?.name ?? 'Table',
              capacity: activeTable?.capacity ?? 2,
              image: '/images/dining-table.png',
              tag: 'Dining Room',
              setting: 'Swedish oak dining table set with natural linen.',
          })
        : null;

    return (
        <GuestLayout>
            <Head title="Reserve a table | Halden" />

            <section className="min-h-[calc(100vh-4.5rem)] bg-[#f8f7f3] py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-wider text-[#2f4a3c] uppercase">
                            Reservations
                        </span>
                        <h1 className="mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
                            {isStep2 ? 'Your details.' : 'Reserve a table.'}
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            {isStep2
                                ? 'Review your table selection and provide guest contact information.'
                                : 'Lunch and dinner daily from 11:00 to 21:00. Last seating at 19:00.'}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="mt-10 mb-10 flex items-center justify-between border-b border-[#dedbd3] pb-6 sm:mt-12 sm:mb-12">
                        {/* Step 1 Pill */}
                        <button
                            type="button"
                            onClick={isStep2 ? handleBackToStep1 : undefined}
                            className={`flex items-center gap-3 text-left transition-opacity ${
                                isStep2
                                    ? 'cursor-pointer hover:opacity-80'
                                    : 'cursor-default'
                            }`}
                        >
                            <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                    isStep2
                                        ? 'bg-[#2f4a3c] text-[#f8f7f3]'
                                        : 'bg-[#1f1d1b] text-[#f8f7f3]'
                                }`}
                            >
                                {isStep2 ? (
                                    <Check className="size-4" />
                                ) : (
                                    <span>1</span>
                                )}
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                    Step 1
                                </p>
                                <p
                                    className={`text-sm font-medium ${
                                        !isStep2
                                            ? 'text-[#1d1d1d]'
                                            : 'text-[#1d1d1d]/75'
                                    }`}
                                >
                                    Table & Time
                                </p>
                            </div>
                        </button>

                        <div className="mx-4 h-px max-w-24 flex-1 bg-[#dedbd3] sm:max-w-32" />

                        {/* Step 2 Pill */}
                        <div className="flex items-center gap-3 text-left">
                            <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                    isStep2
                                        ? 'bg-[#1f1d1b] text-[#f8f7f3]'
                                        : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/40'
                                }`}
                            >
                                <span>2</span>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold tracking-wider text-[#1d1d1d]/50 uppercase">
                                    Step 2
                                </p>
                                <p
                                    className={`text-sm font-medium ${
                                        isStep2
                                            ? 'text-[#1d1d1d]'
                                            : 'text-[#1d1d1d]/40'
                                    }`}
                                >
                                    Guest Details
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STEP 1: Table & Time Selection */}
                    {!isStep2 ? (
                        <div className="space-y-10">
                            <ReservationFilters
                                filters={filters}
                                today={today}
                                onFilterChange={handleFilterChange}
                            />

                            {!hasAllFilters ? (
                                <div className="rounded-2xl border border-[#dedbd3] bg-white p-8 text-center shadow-2xs sm:p-14">
                                    <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                        Select a date, party size, and time to
                                        view open tables.
                                    </p>
                                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                        Every reservation includes our
                                        guaranteed two-hour table hold.
                                    </p>
                                </div>
                            ) : tables.length === 0 ? (
                                <div className="rounded-2xl border border-[#dedbd3] bg-white p-8 text-center shadow-2xs sm:p-14">
                                    <h2 className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                        No tables currently open for that
                                        seating.
                                    </h2>
                                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                        Please try an adjacent time slot or
                                        another date. Lunch and dinner are
                                        served from 11:00 to 21:00.
                                    </p>
                                </div>
                            ) : (
                                <TablePicker
                                    tables={tables}
                                    selectedTableId={selectedTableId}
                                    onSelectTable={handleSelectTable}
                                />
                            )}
                        </div>
                    ) : (
                        /* STEP 2: Guest Details & Submission */
                        <div className="space-y-8">
                            {/* Back to Step 1 Button */}
                            <div>
                                <button
                                    type="button"
                                    onClick={handleBackToStep1}
                                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase transition-colors hover:text-[#1d1d1d]"
                                >
                                    <ArrowLeft className="size-4" />
                                    <span>Back to table selection</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                                {/* Left Column: Reservation Summary Card */}
                                <div className="rounded-2xl border border-[#dedbd3] bg-white p-4 shadow-2xs sm:p-6 lg:col-span-5">
                                    <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-stone-100">
                                        <img
                                            src={
                                                selectedMeta?.image ||
                                                '/images/dining-table.png'
                                            }
                                            alt={
                                                selectedMeta?.name ||
                                                'Selected table'
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="mt-5 border-b border-[#dedbd3] pb-5">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                            {selectedMeta?.tag}
                                        </span>
                                        <h3 className="mt-1 font-heading text-2xl font-normal text-[#1d1d1d]">
                                            {selectedMeta?.name}
                                        </h3>
                                        <p className="mt-1 text-xs leading-relaxed text-[#1d1d1d]/70">
                                            {selectedMeta?.setting}
                                        </p>
                                    </div>

                                    <div className="mt-5 space-y-3.5 text-xs">
                                        <div className="flex items-center gap-3 text-[#1d1d1d]">
                                            <Calendar className="size-4 text-[#2f4a3c]" />
                                            <span>
                                                <strong>Date:</strong>{' '}
                                                {filters.date}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-[#1d1d1d]">
                                            <Clock className="size-4 text-[#2f4a3c]" />
                                            <span>
                                                <strong>Time:</strong>{' '}
                                                {filters.starts_at} (2-hour
                                                dining hold)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-[#1d1d1d]">
                                            <Users className="size-4 text-[#2f4a3c]" />
                                            <span>
                                                <strong>Party:</strong>{' '}
                                                {filters.party_size}{' '}
                                                {Number(filters.party_size) ===
                                                1
                                                    ? 'Guest'
                                                    : 'Guests'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-[#dedbd3] pt-4">
                                        <button
                                            type="button"
                                            onClick={handleBackToStep1}
                                            className="text-xs font-medium text-[#2f4a3c] underline underline-offset-4 transition-colors hover:text-[#1d1d1d]"
                                        >
                                            Change table or time
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column: Guest Details Form */}
                                <div className="lg:col-span-7">
                                    {activeTable && (
                                        <ReservationForm
                                            table={activeTable}
                                            filters={filters}
                                            formSectionRef={formSectionRef}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}
