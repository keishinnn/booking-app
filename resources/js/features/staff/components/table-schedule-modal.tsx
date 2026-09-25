import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useId, type ReactNode } from 'react';
import { reservationTimeWindow } from '@/features/staff/lib/build-floor-table-cards';
import type { DiningReservation, DiningTable } from '@/features/staff/types';
import { useLockBodyScroll } from '@/shared/lib/use-lock-body-scroll';
import { reservations as reservationsRoute } from '@/routes/staff';

type TableScheduleModalProps = {
    table: DiningTable;
    today: string;
    reservations: DiningReservation[];
    onClose: () => void;
};

export default function TableScheduleModal({
    table,
    today,
    reservations,
    onClose,
}: TableScheduleModalProps) {
    const titleId = useId();

    useLockBodyScroll();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-[#1d1d1d]/45 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col border border-[#dedbd3] bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#dedbd3] px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Floor schedule
                        </p>
                        <h3
                            id={titleId}
                            className="mt-1 font-heading text-2xl text-[#1d1d1d]"
                        >
                            {table.name}
                        </h3>
                        <p className="mt-1 text-xs text-[#1d1d1d]/60">
                            Seats {table.capacity} · Today · {today}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center text-[#1d1d1d]/55 hover:bg-[#f8f7f3]"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    {reservations.length === 0 ? (
                        <p className="text-sm text-[#1d1d1d]/70">
                            No reservations today
                        </p>
                    ) : (
                        <ul className="divide-y divide-[#dedbd3]/80">
                            {reservations.map((reservation) => (
                                <li
                                    key={reservation.id}
                                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-heading text-base font-semibold text-[#1d1d1d]">
                                            {reservationTimeWindow(
                                                reservation.starts_at,
                                            )}
                                        </span>
                                        <ServiceChip
                                            service={reservation.service}
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-[#1d1d1d]">
                                        {reservation.guest_name}
                                        <span className="font-normal text-[#1d1d1d]/55">
                                            {' '}
                                            · {reservation.party_size}{' '}
                                            {reservation.party_size === 1
                                                ? 'guest'
                                                : 'guests'}
                                        </span>
                                    </p>
                                    {reservation.notes && (
                                        <p className="text-xs text-[#1d1d1d]/55">
                                            {reservation.notes}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="border-t border-[#dedbd3] px-5 py-3 sm:px-6">
                    <Link
                        href={reservationsRoute.url()}
                        className="text-xs font-semibold text-[#1d1d1d] underline-offset-2 hover:underline"
                    >
                        Open reservations ledger
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ServiceChip({
    service,
}: {
    service: 'Lunch' | 'Dinner';
}): ReactNode {
    return (
        <span className="inline-flex rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#1d1d1d]/75 uppercase">
            {service}
        </span>
    );
}
