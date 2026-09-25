import { Head, Form, router } from '@inertiajs/react';
import { useState, useRef, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';

type Table = {
    id: number;
    name: string;
    capacity: number;
};

type BookPageProps = {
    filters: {
        date: string | null;
        party_size: number | null;
        starts_at: string | null;
    };
    tables: Array<Table>;
};

const partySizeOptions = [1, 2, 3, 4, 5, 6];
const timeOptions = [
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
];

export default function Book({ filters, tables }: BookPageProps) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const formSectionRef = useRef<HTMLDivElement>(null);
    const [, startTransition] = useTransition();

    // Calculate local today string in YYYY-MM-DD
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const hasAllFilters = Boolean(
        filters.date && filters.party_size && filters.starts_at,
    );

    const handleFilterChange = (
        field: 'date' | 'party_size' | 'starts_at',
        value: string,
    ) => {
        setSelectedTable(null);

        const newDate = field === 'date' ? value : (filters.date ?? '');
        const newPartySize =
            field === 'party_size'
                ? value
                : (filters.party_size ? String(filters.party_size) : '');
        const newStartsAt =
            field === 'starts_at' ? value : (filters.starts_at ?? '');

        const params: Record<string, string | number> = {};
        if (newDate) params.date = newDate;
        if (newPartySize) params.party_size = Number(newPartySize);
        if (newStartsAt) params.starts_at = newStartsAt;

        startTransition(() => {
            router.get('/reserve', params, {
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

    const activeTable =
        tables.find((t) => t.id === selectedTable?.id) ?? null;

    return (
        <GuestLayout>
            <Head title="Reserve a table" />

            <section className="min-h-[calc(100vh-4.25rem)] bg-[#f8f7f3] py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    {/* Editorial Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Reservations
                        </span>
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                            Reserve a table.
                        </h1>
                        <p className="animate-fade-slide-up animation-delay-200 mt-4 text-base leading-relaxed text-[#1d1d1d]/80 sm:text-lg">
                            Lunch and dinner, 11:00 to 21:00. Last seating is 19:00.
                        </p>
                    </div>

                    {/* The Finder (Search / Filter Bar) */}
                    <div className="animate-fade-slide-up animation-delay-300 mt-10 border border-[#dedbd3] bg-white p-6 sm:mt-12 sm:p-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {/* Date Field */}
                            <div>
                                <label
                                    htmlFor="reserve-date"
                                    className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                >
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="reserve-date"
                                    min={today}
                                    value={filters.date ?? ''}
                                    onChange={(e) =>
                                        handleFilterChange('date', e.target.value)
                                    }
                                    className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                />
                            </div>

                            {/* Party Size Field */}
                            <div>
                                <label
                                    htmlFor="reserve-party-size"
                                    className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                >
                                    Party size
                                </label>
                                <select
                                    id="reserve-party-size"
                                    value={filters.party_size ?? ''}
                                    onChange={(e) =>
                                        handleFilterChange('party_size', e.target.value)
                                    }
                                    className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                >
                                    <option value="">Select party size</option>
                                    {partySizeOptions.map((size) => (
                                        <option key={size} value={size}>
                                            {size} {size === 1 ? 'guest' : 'guests'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Field */}
                            <div>
                                <label
                                    htmlFor="reserve-starts-at"
                                    className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                >
                                    Time
                                </label>
                                <select
                                    id="reserve-starts-at"
                                    value={filters.starts_at ?? ''}
                                    onChange={(e) =>
                                        handleFilterChange('starts_at', e.target.value)
                                    }
                                    className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                >
                                    <option value="">Select time</option>
                                    {timeOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table Selection & States */}
                    {!hasAllFilters ? (
                        /* State A: Filters not yet fully set */
                        <div className="animate-fade-slide-up animation-delay-400 mt-8 border border-[#dedbd3] bg-white p-8 text-center sm:p-12">
                            <p className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                Select a date, party size, and time to view available tables.
                            </p>
                            <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                We hold each table for two full hours.
                            </p>
                        </div>
                    ) : tables.length === 0 ? (
                        /* State B: Filters set, but no tables available */
                        <div className="animate-fade-slide-up animation-delay-400 mt-8 border border-[#dedbd3] bg-white p-8 text-center sm:p-12">
                            <h2 className="font-heading text-xl font-normal text-[#1d1d1d] sm:text-2xl">
                                Nothing open at that time. Try another hour.
                            </h2>
                            <p className="mt-2 text-sm text-[#1d1d1d]/70">
                                Lunch and dinner are served from 11:00 to 21:00. Last seating is 19:00.
                            </p>
                        </div>
                    ) : (
                        /* State C: Tables available */
                        <div className="animate-fade-slide-up animation-delay-400 mt-8 space-y-8">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {tables.map((table) => {
                                    const isSelected = activeTable?.id === table.id;

                                    return (
                                        <div
                                            key={table.id}
                                            className={`flex flex-col justify-between border bg-white p-6 sm:p-8 transition-all duration-200 ${
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
                                                onClick={() => handleSelectTable(table)}
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

                            {/* Guest Details Reservation Form */}
                            {activeTable && (
                                <div
                                    ref={formSectionRef}
                                    id="reservation-form"
                                    className="animate-fade-slide-up border border-[#dedbd3] bg-white p-6 sm:p-10"
                                >
                                    <div className="border-b border-[#dedbd3] pb-6">
                                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                                            Booking details
                                        </span>
                                        <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                                            {activeTable.name} is free at {filters.starts_at}.
                                        </h2>
                                        <p className="mt-1.5 text-sm text-[#1d1d1d]/75">
                                            Held for two hours from {filters.starts_at}.
                                        </p>
                                    </div>

                                    <Form
                                        action="/reservations"
                                        method="post"
                                        resetOnSuccess
                                        className="mt-8 space-y-6"
                                    >
                                        {({ errors, processing, wasSuccessful }) => (
                                            <>
                                                {/* Hidden context fields */}
                                                <input
                                                    type="hidden"
                                                    name="table_id"
                                                    value={activeTable.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="reserved_on"
                                                    value={filters.date ?? ''}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="starts_at"
                                                    value={filters.starts_at ?? ''}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="party_size"
                                                    value={filters.party_size ?? ''}
                                                />

                                                {wasSuccessful && (
                                                    <div className="border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 p-5 text-center">
                                                        <p className="font-heading text-lg font-normal text-[#2f4a3c]">
                                                            Table reserved successfully.
                                                        </p>
                                                        <p className="mt-1 text-xs text-[#1d1d1d]/70">
                                                            We look forward to welcoming you to Halden.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Conflict or general error message */}
                                                {(errors.table_id ||
                                                    (errors as Record<string, string>).table ||
                                                    (errors as Record<string, string>).error) && (
                                                    <div className="border border-[#8a4b3b]/30 bg-[#8a4b3b]/10 p-4 text-[#8a4b3b]">
                                                        <p className="text-sm font-medium">
                                                            {errors.table_id ||
                                                                (errors as Record<string, string>).table ||
                                                                (errors as Record<string, string>).error ||
                                                                'That table is already held then.'}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    {/* Guest Name */}
                                                    <div>
                                                        <label
                                                            htmlFor="guest_name"
                                                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                                        >
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="guest_name"
                                                            name="guest_name"
                                                            required
                                                            placeholder="Your full name"
                                                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] placeholder:text-[#1d1d1d]/40 transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                                        />
                                                        {errors.guest_name && (
                                                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                                {errors.guest_name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            required
                                                            placeholder="you@example.com"
                                                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] placeholder:text-[#1d1d1d]/40 transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                                        />
                                                        {errors.email && (
                                                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                                {errors.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Phone */}
                                                <div>
                                                    <label
                                                        htmlFor="phone"
                                                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                                    >
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        required
                                                        placeholder="Your phone number"
                                                        className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] placeholder:text-[#1d1d1d]/40 transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                                    />
                                                    {errors.phone && (
                                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                            {errors.phone}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Notes / Dietary requests */}
                                                <div>
                                                    <label
                                                        htmlFor="notes"
                                                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                                    >
                                                        Notes / Dietary requests (optional)
                                                    </label>
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={3}
                                                        placeholder="Allergies, preferences, or special requests"
                                                        className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] placeholder:text-[#1d1d1d]/40 transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                                    />
                                                    {errors.notes && (
                                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                            {errors.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Submit button */}
                                                <div className="pt-2">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="h-12 rounded-full bg-[#1f1d1b] px-8 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 disabled:opacity-50"
                                                    >
                                                        {processing ? 'Reserving...' : 'Reserve'}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}
