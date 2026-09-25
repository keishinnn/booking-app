import { Form } from '@inertiajs/react';
import type { RefObject } from 'react';
import { Button } from '@/shared/components/ui/button';
import { store } from '@/routes/reservations';
import type { BookingFilters, Table } from '@/features/booking/types';

type ReservationFormProps = {
    table: Table;
    filters: BookingFilters;
    formSectionRef: RefObject<HTMLDivElement | null>;
};

export default function ReservationForm({
    table,
    filters,
    formSectionRef,
}: ReservationFormProps) {
    return (
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
                    {table.name} is free at {filters.starts_at}.
                </h2>
                <p className="mt-1.5 text-sm text-[#1d1d1d]/75">
                    Held for two hours from {filters.starts_at}.
                </p>
            </div>

            <Form {...store.form()} resetOnSuccess className="mt-8 space-y-6">
                {({ errors, processing, wasSuccessful }) => (
                    <>
                        <input type="hidden" name="table_id" value={table.id} />
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

                        {(errors.table_id ||
                            (errors as Record<string, string>).table ||
                            (errors as Record<string, string>).error) && (
                            <div className="border border-[#8a4b3b]/30 bg-[#8a4b3b]/10 p-4 text-[#8a4b3b]">
                                <p className="text-sm font-medium">
                                    {errors.table_id ||
                                        (errors as Record<string, string>)
                                            .table ||
                                        (errors as Record<string, string>)
                                            .error ||
                                        'That table is already held then.'}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                                    className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors placeholder:text-[#1d1d1d]/40 focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                />
                                {errors.guest_name && (
                                    <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                        {errors.guest_name}
                                    </p>
                                )}
                            </div>

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
                                    className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors placeholder:text-[#1d1d1d]/40 focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

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
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors placeholder:text-[#1d1d1d]/40 focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.phone && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

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
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors placeholder:text-[#1d1d1d]/40 focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.notes && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

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
    );
}
