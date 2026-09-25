import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/shared/layouts/guest-layout';
import { home } from '@/routes';
import type { ConfirmedReservation } from '@/features/booking/types';

type ConfirmationPageProps = {
    reservation: ConfirmedReservation;
};

function formatDisplayDate(isoDate: string): string {
    const date = new Date(`${isoDate}T12:00:00`);

    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export default function Confirmation({ reservation }: ConfirmationPageProps) {
    return (
        <GuestLayout>
            <Head title="You're booked | Halden" />

            <section className="min-h-[calc(100vh-4.5rem)] bg-[#f8f7f3] py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-xl px-5 sm:px-8">
                    <h1 className="font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl">
                        You&apos;re booked.
                    </h1>

                    <div className="mt-10 space-y-4 rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-2xs sm:p-8">
                        <p className="font-heading text-2xl text-[#1d1d1d]">
                            {reservation.guest_name}
                        </p>
                        <dl className="space-y-3 text-sm text-[#1d1d1d]/80">
                            <div className="flex justify-between gap-4 border-b border-[#dedbd3]/70 pb-3">
                                <dt className="text-[#1d1d1d]/55">Table</dt>
                                <dd className="font-medium text-[#1d1d1d]">
                                    {reservation.table?.name ?? 'Table'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-[#dedbd3]/70 pb-3">
                                <dt className="text-[#1d1d1d]/55">Date</dt>
                                <dd className="font-medium text-[#1d1d1d]">
                                    {formatDisplayDate(reservation.reserved_on)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-[#dedbd3]/70 pb-3">
                                <dt className="text-[#1d1d1d]/55">Time</dt>
                                <dd className="font-medium text-[#1d1d1d]">
                                    {reservation.starts_at}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#1d1d1d]/55">Party</dt>
                                <dd className="font-medium text-[#1d1d1d]">
                                    Party of {reservation.party_size}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <p className="mt-6 text-sm text-[#1d1d1d]/70">
                        This table is yours for two hours.
                    </p>

                    <div className="mt-8">
                        <Link
                            href={home.url()}
                            className="text-sm font-semibold text-[#2f4a3c] underline underline-offset-4 transition-colors hover:text-[#1d1d1d]"
                        >
                            Halden
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
