import { Form, Head } from '@inertiajs/react';
import { MoreVertical, Plus, Search, X } from 'lucide-react';
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import ReservationForm from '@/features/staff/components/reservation-form';
import type {
    DiningReservation,
    DiningTable,
    ReservationServiceFilter,
    ReservationStatusFilter,
} from '@/features/staff/types';
import StaffLayout from '@/shared/layouts/staff-layout';
import { useLockBodyScroll } from '@/shared/lib/use-lock-body-scroll';
import {
    destroy,
    store,
    update,
} from '@/actions/App/Http/Controllers/Staff/ReservationController';

type StaffReservationsPageProps = {
    reservations: DiningReservation[];
    tables: DiningTable[];
    startTimes: string[];
};

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
    const [editing, setEditing] = useState<DiningReservation | null>(null);
    const [cancelling, setCancelling] = useState<DiningReservation | null>(
        null,
    );
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (menuOpenId === null) {
            return;
        }

        const onPointerDown = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpenId(null);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [menuOpenId]);

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
            reservationCount={activeCount}
            searchValue={search}
            onSearchChange={setSearch}
        >
            <Head title="Staff Reservations | Halden" />

            <div className="max-w-8xl relative mx-auto space-y-6 pb-24">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d] sm:text-3xl">
                            Reservations ledger
                        </h1>
                        <p className="mt-1 text-xs text-[#1d1d1d]/65 sm:text-sm">
                            Guest bookings, table assignments, and arrival
                            schedule
                        </p>
                    </div>
                    <p className="text-xs text-[#1d1d1d]/60">
                        {activeCount} confirmed · {reservations.length} total
                    </p>
                </div>

                <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search guest, email, phone, or table..."
                                className="h-10 w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/50 pr-4 pl-10 text-xs focus:border-[#1f1d1b] focus:bg-white focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex rounded-xl border border-[#dedbd3] bg-[#f8f7f3] p-1">
                                {(['All', 'Dinner', 'Lunch'] as const).map(
                                    (service) => (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() =>
                                                setServiceFilter(service)
                                            }
                                            className={`rounded-lg px-3 py-1 text-xs font-medium ${
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
                                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
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
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-[#dedbd3]/80">
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
                                                            <span className="rounded-md border border-[#dedbd3] bg-[#f8f7f3] px-2 py-0.5 text-xs font-medium">
                                                                {
                                                                    reservation.service
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            {reservation.status ===
                                                            'confirmed' ? (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#2f4a3c] uppercase">
                                                                    Confirmed
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-rose-700 uppercase">
                                                                    Cancelled
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="relative px-4 py-3.5 text-right">
                                                            <button
                                                                type="button"
                                                                aria-label={`Actions for ${reservation.guest_name}`}
                                                                aria-expanded={
                                                                    menuOpen
                                                                }
                                                                onClick={() =>
                                                                    setMenuOpenId(
                                                                        menuOpen
                                                                            ? null
                                                                            : reservation.id,
                                                                    )
                                                                }
                                                                className="inline-flex h-8 w-8 items-center justify-center border border-[#dedbd3] text-[#1d1d1d]/70 hover:bg-[#f8f7f3]"
                                                            >
                                                                <MoreVertical className="size-4" />
                                                            </button>
                                                            {menuOpen && (
                                                                <div
                                                                    ref={
                                                                        menuRef
                                                                    }
                                                                    role="menu"
                                                                    className="absolute top-12 right-4 z-20 w-36 border border-[#dedbd3] bg-white p-1 shadow-lg"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        role="menuitem"
                                                                        className="flex w-full px-3 py-2 text-left text-xs font-medium hover:bg-[#f8f7f3]"
                                                                        onClick={() => {
                                                                            setMenuOpenId(
                                                                                null,
                                                                            );
                                                                            setEditing(
                                                                                reservation,
                                                                            );
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    {reservation.status ===
                                                                        'confirmed' && (
                                                                        <button
                                                                            type="button"
                                                                            role="menuitem"
                                                                            className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#8a4b3b] hover:bg-[#8a4b3b]/8"
                                                                            onClick={() => {
                                                                                setMenuOpenId(
                                                                                    null,
                                                                                );
                                                                                setCancelling(
                                                                                    reservation,
                                                                                );
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
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
                <Modal
                    title="Add reservation"
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
                </Modal>
            )}

            {editing && (
                <Modal
                    title={`Edit ${editing.guest_name}`}
                    onClose={() => setEditing(null)}
                >
                    <ReservationForm
                        formKey={`edit-reservation-${editing.id}`}
                        formProps={update.form(editing.id)}
                        tables={tables}
                        startTimes={startTimes}
                        showStatus
                        defaults={{
                            table_id: editing.table_id,
                            guest_name: editing.guest_name,
                            email: editing.email,
                            phone: editing.phone,
                            party_size: editing.party_size,
                            reserved_on: editing.reserved_on,
                            starts_at: editing.starts_at,
                            notes: editing.notes,
                            status: editing.status,
                        }}
                        submitLabel="Save changes"
                        onCancel={() => setEditing(null)}
                        onSuccess={() => setEditing(null)}
                    />
                </Modal>
            )}

            {cancelling && (
                <Modal
                    title="Cancel reservation"
                    tone="danger"
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
                </Modal>
            )}
        </StaffLayout>
    );
}

function Modal({
    title,
    children,
    onClose,
    tone = 'default',
}: {
    title: string;
    children: ReactNode;
    onClose: () => void;
    tone?: 'default' | 'danger';
}) {
    const titleId = useId();

    useLockBodyScroll();

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
                className="relative z-10 w-full max-w-2xl border border-[#dedbd3] bg-white shadow-2xl sm:max-h-[90vh] sm:overflow-y-auto"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#dedbd3] px-5 py-4 sm:px-6">
                    <div>
                        <p
                            className={`text-[10px] font-semibold tracking-widest uppercase ${
                                tone === 'danger'
                                    ? 'text-[#8a4b3b]'
                                    : 'text-[#2f4a3c]'
                            }`}
                        >
                            {tone === 'danger' ? 'Danger zone' : 'Ledger'}
                        </p>
                        <h3
                            id={titleId}
                            className="mt-1 font-heading text-2xl text-[#1d1d1d]"
                        >
                            {title}
                        </h3>
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
                <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
            </div>
        </div>
    );
}
