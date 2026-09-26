import { Form, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ReservationServiceLabel,
    ReservationStatusLabel,
} from '@/features/staff/components/reservation-badges';
import { reservationTimeWindow } from '@/features/staff/lib/build-floor-table-cards';
import type { DiningReservation, DiningTable } from '@/features/staff/types';
import { reservations as reservationsRoute } from '@/routes/staff';
import {
    complete,
    destroy,
    noShow,
    seat,
    walkIn,
} from '@/routes/staff/reservations';
import PortalDialog from '@/shared/components/portal-dialog';

type TableScheduleModalProps = {
    table: DiningTable;
    today: string;
    reservations: DiningReservation[];
    onClose: () => void;
};

const fieldClassName =
    'w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none';

const labelClassName =
    'mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase';

const actionButtonClassName =
    'border border-[#dedbd3] bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#1d1d1d] uppercase hover:bg-[#f8f7f3]';

export default function TableScheduleModal({
    table,
    today,
    reservations,
    onClose,
}: TableScheduleModalProps) {
    const [walkInOpen, setWalkInOpen] = useState(false);
    const [cancelling, setCancelling] = useState<DiningReservation | null>(
        null,
    );

    const isOpenForWalkIn = !reservations.some(
        (reservation) =>
            reservation.reserved_on === today &&
            (reservation.status === 'confirmed' ||
                reservation.status === 'seated'),
    );

    const postStatus = (url: string) => {
        router.post(url, {}, { preserveScroll: true });
    };

    return (
        <>
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
                        {reservations.map((reservation) => {
                            const canCancel =
                                reservation.status === 'confirmed' ||
                                reservation.status === 'seated';

                            return (
                                <li
                                    key={reservation.id}
                                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
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
                                        <ReservationStatusLabel
                                            status={reservation.status}
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
                                    <div className="flex flex-wrap gap-1.5">
                                        {reservation.status === 'confirmed' && (
                                            <>
                                                <button
                                                    type="button"
                                                    className={
                                                        actionButtonClassName
                                                    }
                                                    onClick={() =>
                                                        postStatus(
                                                            seat.url(
                                                                reservation.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Seat
                                                </button>
                                                <button
                                                    type="button"
                                                    className={
                                                        actionButtonClassName
                                                    }
                                                    onClick={() =>
                                                        postStatus(
                                                            noShow.url(
                                                                reservation.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    No-show
                                                </button>
                                            </>
                                        )}
                                        {reservation.status === 'seated' && (
                                            <button
                                                type="button"
                                                className={actionButtonClassName}
                                                onClick={() =>
                                                    postStatus(
                                                        complete.url(
                                                            reservation.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Complete
                                            </button>
                                        )}
                                        {canCancel && (
                                            <button
                                                type="button"
                                                className="border border-[#8a4b3b]/30 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#8a4b3b] uppercase hover:bg-[#8a4b3b]/8"
                                                onClick={() =>
                                                    setCancelling(reservation)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {isOpenForWalkIn && (
                    <div className="mt-5 border-t border-[#dedbd3] pt-4">
                        {!walkInOpen ? (
                            <button
                                type="button"
                                onClick={() => setWalkInOpen(true)}
                                className="h-10 rounded-full bg-[#1f1d1b] px-5 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase"
                            >
                                Walk-in
                            </button>
                        ) : (
                            <Form
                                {...walkIn.form()}
                                className="space-y-3"
                                options={{ preserveScroll: true }}
                                onSuccess={() => {
                                    setWalkInOpen(false);
                                    onClose();
                                }}
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="table_id"
                                            value={table.id}
                                        />
                                        <div>
                                            <label
                                                htmlFor="walk_in_guest_name"
                                                className={labelClassName}
                                            >
                                                Guest name
                                            </label>
                                            <input
                                                id="walk_in_guest_name"
                                                name="guest_name"
                                                type="text"
                                                required
                                                className={fieldClassName}
                                            />
                                            {errors.guest_name && (
                                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                    {errors.guest_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="walk_in_email"
                                                    className={labelClassName}
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    id="walk_in_email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className={fieldClassName}
                                                />
                                                {errors.email && (
                                                    <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="walk_in_phone"
                                                    className={labelClassName}
                                                >
                                                    Phone
                                                </label>
                                                <input
                                                    id="walk_in_phone"
                                                    name="phone"
                                                    type="text"
                                                    required
                                                    className={fieldClassName}
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="walk_in_party_size"
                                                className={labelClassName}
                                            >
                                                Party size
                                            </label>
                                            <input
                                                id="walk_in_party_size"
                                                name="party_size"
                                                type="number"
                                                min={1}
                                                max={table.capacity}
                                                required
                                                defaultValue={2}
                                                className={fieldClassName}
                                            />
                                            {errors.party_size && (
                                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                    {errors.party_size}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="walk_in_notes"
                                                className={labelClassName}
                                            >
                                                Notes
                                            </label>
                                            <textarea
                                                id="walk_in_notes"
                                                name="notes"
                                                rows={2}
                                                className={fieldClassName}
                                            />
                                            {errors.notes && (
                                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                    {errors.notes}
                                                </p>
                                            )}
                                            {errors.table_id && (
                                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                                    {errors.table_id}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setWalkInOpen(false)
                                                }
                                                className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="h-10 rounded-full bg-[#1f1d1b] px-5 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase disabled:opacity-50"
                                            >
                                                {processing
                                                    ? 'Seating…'
                                                    : 'Seat walk-in'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        )}
                    </div>
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

            {cancelling && (
                <PortalDialog
                    title="Cancel reservation"
                    tone="danger"
                    size="lg"
                    onClose={() => setCancelling(null)}
                >
                    <p className="text-sm leading-relaxed text-[#1d1d1d]/80">
                        Cancel{' '}
                        <span className="font-semibold text-[#1d1d1d]">
                            {cancelling.guest_name}
                        </span>
                        ’s booking for {cancelling.reserved_on} at{' '}
                        {cancelling.starts_at}? The row is kept as cancelled so
                        the table can be booked again.
                    </p>
                    <Form
                        {...destroy.form(cancelling.id)}
                        className="mt-6 flex flex-wrap items-center justify-end gap-3"
                        options={{ preserveScroll: true }}
                        onSuccess={() => {
                            setCancelling(null);
                            onClose();
                        }}
                    >
                        {({ processing }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setCancelling(null)}
                                    className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                                >
                                    Keep booking
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 rounded-full bg-[#8a4b3b] px-6 text-xs font-semibold tracking-wide text-white uppercase disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Cancelling…'
                                        : 'Cancel reservation'}
                                </button>
                            </>
                        )}
                    </Form>
                </PortalDialog>
            )}
        </>
    );
}
