import { Head, router, useHttp } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, Clock, Users } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import ReservationFilters from '@/features/booking/components/reservation-filters';
import ReservationForm from '@/features/booking/components/reservation-form';
import TablePicker from '@/features/booking/components/table-picker';
import GuestLayout from '@/shared/layouts/guest-layout';
import { reserve } from '@/routes';
import { availability } from '@/routes/reserve';
import type {
    BookingFilterField,
    BookPageProps,
    Table,
} from '@/features/booking/types';

const tableCopyByName: Record<
    string,
    { tag: string; setting: string; fallbackImage: string }
> = {
    'Table 1': {
        tag: 'Window Setting',
        setting:
            'Mercer Lane window view with generous daylight and linen bench seating.',
        fallbackImage: '/images/dining-table.png',
    },
    'Table 2': {
        tag: 'Window Setting',
        setting:
            'Quiet corner table with soft morning daylight and linen place settings.',
        fallbackImage: '/images/dining-table.png',
    },
    'Table 3': {
        tag: 'Hearth Setting',
        setting:
            'Centered in the dining room, warmed by the wood-fired kitchen hearth.',
        fallbackImage: '/images/dining-table.png',
    },
    'Table 4': {
        tag: 'Banquette Setting',
        setting:
            'Generous bench seating with handcrafted Swedish white oak dining table.',
        fallbackImage: '/images/lunch.png',
    },
    'Table 5': {
        tag: 'The Long Table',
        setting:
            'Solid oak dining table for family celebrations and shared plates.',
        fallbackImage: '/images/long-table.png',
    },
};

type LocalFilters = {
    date: string | null;
    party_size: number | null;
    starts_at: string | null;
};

type AvailabilityResponse = {
    tables: Table[];
};

export default function Book({
    filters,
    tables: initialTables,
}: BookPageProps) {
    const formSectionRef = useRef<HTMLDivElement>(null);
    const [, startTransition] = useTransition();
    const [localFilters, setLocalFilters] = useState<LocalFilters>({
        date: filters.date,
        party_size: filters.party_size,
        starts_at: filters.starts_at,
    });
    const [tables, setTables] = useState<Table[]>(initialTables);
    const { get, processing, cancel } = useHttp<
        Record<string, never>,
        AvailabilityResponse
    >();

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const hasAllFilters = Boolean(
        localFilters.date &&
            localFilters.party_size &&
            localFilters.starts_at,
    );

    const isStep2 = Boolean(
        filters.step === 2 &&
            filters.table_id &&
            localFilters.date &&
            localFilters.party_size &&
            localFilters.starts_at,
    );

    useEffect(() => {
        if (isStep2) {
            return;
        }

        if (
            !localFilters.date ||
            !localFilters.party_size ||
            !localFilters.starts_at
        ) {
            setTables([]);

            const params: Record<string, string | number> = {};
            if (localFilters.date) {
                params.date = localFilters.date;
            }
            if (localFilters.party_size) {
                params.party_size = localFilters.party_size;
            }
            if (localFilters.starts_at) {
                params.starts_at = localFilters.starts_at;
            }

            const nextUrl =
                Object.keys(params).length > 0
                    ? reserve.url({ query: params })
                    : reserve.url();

            window.history.replaceState(window.history.state, '', nextUrl);

            return;
        }

        const params = {
            date: localFilters.date,
            party_size: localFilters.party_size,
            starts_at: localFilters.starts_at,
        };

        window.history.replaceState(
            window.history.state,
            '',
            reserve.url({ query: params }),
        );

        void get(availability.url({ query: params }), {
            onSuccess: (response) => {
                setTables(response.tables);
            },
            onError: () => {
                setTables([]);
            },
        });

        return () => {
            cancel();
        };
        // get/cancel from useHttp are stable enough for this fetch; omit from deps
        // to avoid re-fetch loops when the hook returns new function identities.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localFilters.date, localFilters.party_size, localFilters.starts_at, isStep2]);

    const handleFilterChange = (field: BookingFilterField, value: string) => {
        setLocalFilters((current) => ({
            ...current,
            [field]:
                field === 'party_size'
                    ? value === ''
                        ? null
                        : Number(value)
                    : value === ''
                      ? null
                      : value,
        }));
    };

    const handleSelectTable = (table: Table) => {
        const params: Record<string, string | number> = {
            date: localFilters.date ?? '',
            party_size: localFilters.party_size ?? '',
            starts_at: localFilters.starts_at ?? '',
            table_id: table.id,
            step: 2,
        };

        startTransition(() => {
            router.get(reserve.url(), params, {
                preserveState: true,
                replace: false,
            });
        });
    };

    const handleBackToStep1 = () => {
        const params: Record<string, string | number> = {};
        if (localFilters.date) {
            params.date = localFilters.date;
        }
        if (localFilters.party_size) {
            params.party_size = localFilters.party_size;
        }
        if (localFilters.starts_at) {
            params.starts_at = localFilters.starts_at;
        }

        startTransition(() => {
            router.get(reserve.url(), params, {
                preserveState: true,
                replace: false,
            });
        });
    };

    const displayFilters = {
        ...filters,
        date: localFilters.date,
        party_size: localFilters.party_size,
        starts_at: localFilters.starts_at,
    };

    const selectedTableId = filters.table_id ?? null;
    const activeTable: Table | null =
        (selectedTableId &&
            (tables.find((table) => table.id === selectedTableId) ||
                initialTables.find(
                    (table) => table.id === selectedTableId,
                ))) ||
        null;

    const selectedCopy = activeTable
        ? (tableCopyByName[activeTable.name] ?? {
              tag: 'Dining Room',
              setting: 'Swedish oak dining table set with natural linen.',
              fallbackImage: '/images/dining-table.png',
          })
        : null;

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
                            {isStep2 ? 'Your details.' : 'Reserve a table.'}
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            {isStep2
                                ? 'Review your table selection and provide guest contact information.'
                                : 'Lunch and dinner daily from 11:00 to 21:00. Last seating at 19:00.'}
                        </p>
                    </div>

                    <div className="mt-10 mb-10 flex items-center justify-between border-b border-[#dedbd3] pb-6 sm:mt-12 sm:mb-12">
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

                    {!isStep2 ? (
                        <div className="space-y-10">
                            <ReservationFilters
                                filters={displayFilters}
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
                            ) : processing && tables.length === 0 ? (
                                <div className="rounded-2xl border border-[#dedbd3] bg-white p-8 text-center shadow-2xs sm:p-14">
                                    <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                        Checking open tables…
                                    </p>
                                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                        Looking for seats that fit your party
                                        and seating time.
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
                                <div
                                    className={
                                        processing
                                            ? 'opacity-60 transition-opacity'
                                            : 'transition-opacity'
                                    }
                                >
                                    <TablePicker
                                        tables={tables}
                                        selectedTableId={selectedTableId}
                                        onSelectTable={handleSelectTable}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
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
                                <div className="rounded-2xl border border-[#dedbd3] bg-white p-4 shadow-2xs sm:p-6 lg:col-span-5">
                                    <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-stone-100">
                                        <img
                                            src={
                                                activeTable?.image_url ||
                                                selectedCopy?.fallbackImage ||
                                                '/images/dining-table.png'
                                            }
                                            alt={
                                                activeTable?.name ||
                                                'Selected table'
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="mt-5 border-b border-[#dedbd3] pb-5">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                            {selectedCopy?.tag}
                                        </span>
                                        <h3 className="mt-1 font-heading text-2xl font-normal text-[#1d1d1d]">
                                            {activeTable?.name}
                                        </h3>
                                        <p className="mt-1 text-xs leading-relaxed text-[#1d1d1d]/70">
                                            {selectedCopy?.setting}
                                        </p>
                                    </div>

                                    <div className="mt-5 space-y-3.5 text-xs">
                                        <div className="flex items-center gap-3 text-[#1d1d1d]">
                                            <Calendar className="size-4 text-[#2f4a3c]" />
                                            <span>
                                                <strong>Date:</strong>{' '}
                                                {localFilters.date}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-[#1d1d1d]">
                                            <Clock className="size-4 text-[#2f4a3c]" />
                                            <span>
                                                <strong>Time:</strong>{' '}
                                                {localFilters.starts_at} (2-hour
                                                dining hold)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-[#1d1d1d]">
                                            <Users className="size-4 text-[#2f4a3c]" />
                                            <span>
                                                <strong>Party:</strong>{' '}
                                                {localFilters.party_size}{' '}
                                                {Number(
                                                    localFilters.party_size,
                                                ) === 1
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

                                <div className="lg:col-span-7">
                                    {activeTable && (
                                        <ReservationForm
                                            table={activeTable}
                                            filters={displayFilters}
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
