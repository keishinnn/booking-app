import { Link } from '@inertiajs/react';
import { ReservationServiceLabel } from '@/features/staff/components/reservation-badges';
import { reservationTimeWindow } from '@/features/staff/lib/build-floor-table-cards';
import type { DiningReservation, DiningTable } from '@/features/staff/types';
import { reservations as reservationsRoute } from '@/routes/staff';
import PortalDialog from '@/shared/components/portal-dialog';

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
    return (
        <PortalDialog
            title={table.name}
            eyebrow="Floor schedule"
            onClose={onClose}
        >
            <p className="-mt-2 mb-4 text-xs text-[#1d1d1d]/60">
                Seats {table.capacity} · From {today}
            </p>

            {reservations.length === 0 ? (
                <p className="text-sm text-[#1d1d1d]/70">
                    No upcoming reservations
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
                                    {reservation.reserved_on}{' '}
                                    {reservationTimeWindow(
                                        reservation.starts_at,
                                    )}
                                </span>
                                <ReservationServiceLabel
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

            <div className="mt-5 border-t border-[#dedbd3] pt-3">
                <Link
                    href={reservationsRoute.url()}
                    className="text-xs font-semibold text-[#1d1d1d] underline-offset-2 hover:underline"
                >
                    Open reservations ledger
                </Link>
            </div>
        </PortalDialog>
    );
}
