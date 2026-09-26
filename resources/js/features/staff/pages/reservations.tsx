import { Form, Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    ReservationServiceLabel,
    ReservationStatusLabel,
} from '@/features/staff/components/reservation-badges';
import ReservationForm from '@/features/staff/components/reservation-form';
import ReservationRowActions from '@/features/staff/components/reservation-row-actions';
import type {
    DiningReservation,
    DiningTable,
    ReservationServiceFilter,
    ReservationStatusFilter,
} from '@/features/staff/types';
import {
    complete,
    destroy,
    noShow,
    seat,
    store,
    update,
    walkIn,
} from '@/routes/staff/reservations';
import PortalDialog from '@/shared/components/portal-dialog';
import StaffLayout from '@/shared/layouts/staff-layout';

type StaffReservationsPageProps = {
    reservations: DiningReservation[];
    tables: DiningTable[];
    startTimes: string[];
};

const fieldClassName =
    'w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none';

const labelClassName =
    'mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase';

export default function StaffReservationsPage({
    reservations,
    tables,
    startTimes,
}: StaffReservationsPageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<ReservationStatusFilter>('All');
    const [serviceFilter, setServiceFilter] =
        useState<ReservationServiceFilter>('All');
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [walkInOpen, setWalkInOpen] = useState(false);
    const [editing, setEditing] = useState<DiningReservation | null>(null);
    const [cancelling, setCancelling] = useState<DiningReservation | null>(
        null,
    );

    const filteredReservations = useMemo(() => {
        return reservations.filter((reservation) => {
            const query = search.trim().toLowerCase();
            const tableName = reservation.table?.name ?? '';
            const matchesQuery =
                !query ||
                reservation.guest_name.toLowerCase().includes(query) ||
                reservation.email.toLowerCase().includes(query) ||
                reservation.phone.toLowerCase().includes(query) ||
                tableName.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === 'All' || reservation.status === statusFilter;

            const matchesService =
                serviceFilter === 'All' ||
                reservation.service === serviceFilter;

            return matchesQuery && matchesStatus && matchesService;
        });
    }, [reservations, search, statusFilter, serviceFilter]);

    const activeCount = reservations.filter(
        (reservation) => reservation.status === 'confirmed',
    ).length;

    return (
        <StaffLayout
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search guests, email, phone, or table..."
        >
            <Head title="Staff Reservations | Halden" />

            <div className="max-w-8xl relative mx-auto space-y-6 pb-24">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Reservations ledger
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Guest bookings, table assignments, and arrival
                            schedule
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xs text-[#1d1d1d]/60">
                            {activeCount} confirmed ·{' '}
                            {filteredReservations.length} shown ·{' '}
                            {reservations.length} total
                        </p>
                        <button
                            type="button"
                            onClick={() => setWalkInOpen(true)}
                            className="h-10 rounded-full bg-[#1f1d1b] px-5 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase"
                        >
                            Walk-in
                        </button>
                    </div>
                </div>

                <div className="border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex border border-[#dedbd3] bg-[#f8f7f3] p-1">
                            {(['All', 'Dinner', 'Lunch'] as const).map(
                                (service) => (
                                    <button
                                        key={service}
                                        type="button"
                                        onClick={() =>
                                            setServiceFilter(service)
                                        }
                                        className={`px-3 py-1 text-xs font-medium ${
                                            serviceFilter === service
                                                ? 'bg-white font-semibold text-[#1d1d1d] shadow-2xs'
                                                : 'text-[#1d1d1d]/65'
                                        }`}
                                    >
                                        {service}
                                    </button>
                                ),
                            )}
                        </div>

                        {(['All', 'confirmed', 'cancelled'] as const).map(
                            (status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-2.5 py-1.5 text-xs font-medium ${
                                        statusFilter === status
                                            ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3]'
                                            : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70'
                                    }`}
                                >
                                    {status === 'All'
                                        ? 'All'
                                        : status === 'confirmed'
                                          ? 'Confirmed'
                                          : 'Cancelled'}
                                </button>
                            ),
                        )}
                    </div>

                    <div className="mt-5 overflow-hidden border border-[#dedbd3]/80">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[#dedbd3] bg-[#faf9f6] text-[11px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                        <th className="px-4 py-3">When</th>
                                        <th className="px-4 py-3">Guest</th>
                                        <th className="px-4 py-3">Table</th>
                                        <th className="px-4 py-3">Service</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dedbd3]/60 bg-white">
                                    {filteredReservations.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-12 text-center text-sm text-[#1d1d1d]/50"
                                            >
                                                No reservations match these
                                                filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReservations.map(
                                            (reservation) => {
                                                const menuOpen =
                                                    menuOpenId ===
                                                    reservation.id;

                                                return (
                                                    <tr
                                                        key={reservation.id}
                                                        className="hover:bg-[#f8f7f3]/60"
                                                    >
                                                        <td className="px-4 py-3.5">
                                                            <div className="font-mono text-sm font-semibold">
                                                                {
                                                                    reservation.starts_at
                                                                }
                                                            </div>
                                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                                {
                                                                    reservation.reserved_on
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="font-medium">
                                                                {
                                                                    reservation.guest_name
                                                                }
                                                            </div>
                                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                                {
                                                                    reservation.email
                                                                }{' '}
                                                                ·{' '}
                                                                {
                                                                    reservation.phone
                                                                }
                                                            </div>
                                                            {reservation.notes && (
                                                                <div className="mt-1 text-[11px] font-medium text-[#2f4a3c]">
                                                                    Note:{' '}
                                                                    {
                                                                        reservation.notes
                                                                    }
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="text-xs font-semibold">
                                                                {reservation
                                                                    .table
                                                                    ?.name ??
                                                                    '—'}
                                                            </div>
                                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                                {
                                                                    reservation.party_size
                                                                }{' '}
                                                                {reservation.party_size ===
                                                                1
                                                                    ? 'guest'
                                                                    : 'guests'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <ReservationServiceLabel
                                                                service={
                                                                    reservation.service
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <ReservationStatusLabel
                                                                status={
                                                                    reservation.status
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3.5 text-right">
                                                            <ReservationRowActions
                                                                reservation={
                                                                    reservation
                                                                }
                                                                open={menuOpen}
                                                                onToggle={() =>
                                                                    setMenuOpenId(
                                                                        menuOpen
                                                                            ? null
                                                                            : reservation.id,
                                                                    )
                                                                }
                                                                onClose={() =>
                                                                    setMenuOpenId(
                                                                        null,
                                                                    )
                                                                }
                                                                onEdit={() => {
                                                                    setMenuOpenId(
                                                                        null,
                                                                    );
                                                                    setEditing(
                                                                        reservation,
                                                                    );
                                                                }}
                                                                onSeat={() => {
                                                                    setMenuOpenId(
                                                                        null,
                                                                    );
                                                                    router.post(
                                                                        seat.url(
                                                                            reservation.id,
                                                                        ),
                                                                        {},
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }}
                                                                onComplete={() => {
                                                                    setMenuOpenId(
                                                                        null,
                                                                    );
                                                                    router.post(
                                                                        complete.url(
                                                                            reservation.id,
                                                                        ),
                                                                        {},
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }}
                                                                onNoShow={() => {
                                                                    setMenuOpenId(
                                                                        null,
                                                                    );
                                                                    router.post(
                                                                        noShow.url(
                                                                            reservation.id,
                                                                        ),
                                                                        {},
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }}
                                                                onCancel={() => {
                                                                    setMenuOpenId(
                                                                        null,
                                                                    );
                                                                    setCancelling(
                                                                        reservation,
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    aria-label="Add reservation"
                    className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1d1b] text-[#f8f7f3] shadow-lg transition-transform hover:scale-[1.03] active:scale-95 sm:right-8 sm:bottom-8"
                >
                    <Plus className="size-6" strokeWidth={2.25} />
                </button>
            </div>

            {createOpen && (
                <PortalDialog
                    title="Add reservation"
                    eyebrow="Ledger"
                    size="lg"
                    onClose={() => setCreateOpen(false)}
                >
                    <ReservationForm
                        formKey="create-reservation"
                        formProps={store.form()}
                        tables={tables}
                        startTimes={startTimes}
                        submitLabel="Create reservation"
                        onCancel={() => setCreateOpen(false)}
                        onSuccess={() => setCreateOpen(false)}
                    />
                </PortalDialog>
            )}

            {walkInOpen && (
                <PortalDialog
                    title="Seat walk-in"
                    eyebrow="Ledger"
                    size="lg"
                    onClose={() => setWalkInOpen(false)}
                >
                    <Form
                        {...walkIn.form()}
                        className="space-y-3"
                        options={{ preserveScroll: true }}
                        onSuccess={() => setWalkInOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div>
                                    <label
                                        htmlFor="ledger_walk_in_table_id"
                                        className={labelClassName}
                                    >
                                        Table
                                    </label>
                                    <select
                                        id="ledger_walk_in_table_id"
                                        name="table_id"
                                        required
                                        defaultValue=""
                                        className={fieldClassName}
                                    >
                                        <option value="" disabled>
                                            Select a table
                                        </option>
                                        {tables.map((table) => (
                                            <option
                                                key={table.id}
                                                value={table.id}
                                            >
                                                {table.name} · seats{' '}
                                                {table.capacity}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.table_id && (
                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                            {errors.table_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="ledger_walk_in_guest_name"
                                        className={labelClassName}
                                    >
                                        Guest name
                                    </label>
                                    <input
                                        id="ledger_walk_in_guest_name"
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
                                            htmlFor="ledger_walk_in_email"
                                            className={labelClassName}
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="ledger_walk_in_email"
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
                                            htmlFor="ledger_walk_in_phone"
                                            className={labelClassName}
                                        >
                                            Phone
                                        </label>
                                        <input
                                            id="ledger_walk_in_phone"
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
                                        htmlFor="ledger_walk_in_party_size"
                                        className={labelClassName}
                                    >
                                        Party size
                                    </label>
                                    <input
                                        id="ledger_walk_in_party_size"
                                        name="party_size"
                                        type="number"
                                        min={1}
                                        max={50}
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
                                        htmlFor="ledger_walk_in_notes"
                                        className={labelClassName}
                                    >
                                        Notes
                                    </label>
                                    <textarea
                                        id="ledger_walk_in_notes"
                                        name="notes"
                                        rows={2}
                                        className={fieldClassName}
                                    />
                                    {errors.notes && (
                                        <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setWalkInOpen(false)}
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
                </PortalDialog>
            )}

            {editing && (
                <PortalDialog
                    title={`Edit ${editing.guest_name}`}
                    eyebrow="Ledger"
                    size="lg"
                    onClose={() => setEditing(null)}
                >
                    <ReservationForm
                        formKey={`edit-reservation-${editing.id}`}
                        formProps={update.form(editing.id)}
                        tables={tables}
                        startTimes={startTimes}
                        showStatus={
                            editing.status === 'confirmed' ||
                            editing.status === 'cancelled'
                        }
                        defaults={{
                            table_id: editing.table_id,
                            guest_name: editing.guest_name,
                            email: editing.email,
                            phone: editing.phone,
                            party_size: editing.party_size,
                            reserved_on: editing.reserved_on,
                            starts_at: editing.starts_at,
                            notes: editing.notes,
                            ...(editing.status === 'confirmed' ||
                            editing.status === 'cancelled'
                                ? { status: editing.status }
                                : {}),
                        }}
                        submitLabel="Save changes"
                        onCancel={() => setEditing(null)}
                        onSuccess={() => setEditing(null)}
                    />
                </PortalDialog>
            )}

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
                        onSuccess={() => setCancelling(null)}
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
        </StaffLayout>
    );
}
