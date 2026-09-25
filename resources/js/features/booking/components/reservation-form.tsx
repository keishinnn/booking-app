import { Form } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
            className="rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-2xs sm:p-10"
        >
            <div className="border-b border-[#dedbd3] pb-6">
                <span className="text-xs font-semibold tracking-wider text-[#2f4a3c] uppercase">
                    Guest Details
                </span>
                <h2 className="mt-2 font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                    {table.name} at {filters.starts_at}
                </h2>
                <p className="mt-1 text-xs text-[#1d1d1d]/70 sm:text-sm">
                    Reserved exclusively for your party of {filters.party_size}{' '}
                    for two full hours.
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
                            <div className="flex items-start gap-3.5 rounded-xl border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 p-5 text-[#2f4a3c]">
                                <CheckCircle2 className="size-5 shrink-0" />
                                <div>
                                    <p className="font-heading text-lg font-normal">
                                        Table reserved successfully.
                                    </p>
                                    <p className="mt-1 text-xs text-[#1d1d1d]/75">
                                        We look forward to welcoming you to
                                        Halden on {filters.date} at{' '}
                                        {filters.starts_at}.
                                    </p>
                                </div>
                            </div>
                        )}

                        {(errors.table_id ||
                            (errors as Record<string, string>).table ||
                            (errors as Record<string, string>).error) && (
                            <div className="rounded-xl border border-[#8a4b3b]/30 bg-[#8a4b3b]/10 p-4 text-[#8a4b3b]">
                                <p className="text-sm font-medium">
                                    {errors.table_id ||
                                        (errors as Record<string, string>)
                                            .table ||
                                        (errors as Record<string, string>)
                                            .error ||
                                        'That table is no longer available. Please select another table.'}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="guest_name"
                                    className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="guest_name"
                                    name="guest_name"
                                    required
                                    placeholder="Astrid Lind"
                                    className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/35 focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
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
                                    className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="astrid@example.com"
                                    className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/35 focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
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
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                            >
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                placeholder="+46 8 123 45 67"
                                className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/35 focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
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
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                            >
                                Dietary Preferences or Occasion (Optional)
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                placeholder="Please let us know of any allergies, pescatarian preferences, or celebrations."
                                className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/35 focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
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
                                className="group h-12 rounded-full bg-[#1f1d1b] px-8 text-xs font-semibold tracking-wider text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 hover:shadow-xs active:scale-98 disabled:opacity-50"
                            >
                                <span>
                                    {processing
                                        ? 'Holding table...'
                                        : 'Confirm reservation'}
                                </span>
                                <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                                    <ArrowRight className="size-3.5" />
                                </span>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
