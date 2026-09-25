import { Link } from '@inertiajs/react';
import { Search, X, Check, ArrowRight } from 'lucide-react';
import { reserve } from '@/routes';
import { reservations as reservationsRoute } from '@/routes/staff';
import type {
    Reservation,
    ReservationServiceFilter,
    ReservationStatusFilter,
} from '@/features/staff/types';

type ReservationListProps = {
    reservations: Reservation[];
    filteredReservations: Reservation[];
    search: string;
    statusFilter: ReservationStatusFilter;
    serviceFilter: ReservationServiceFilter;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: ReservationStatusFilter) => void;
    onServiceFilterChange: (value: ReservationServiceFilter) => void;
    onClearFilters: () => void;
    onSeatParty: (id: string, guestName: string, tableLabel: string) => void;
    onCompleteParty: (id: string, guestName: string) => void;
    showViewAllLink?: boolean;
    title?: string;
};

export default function ReservationList({
    reservations,
    filteredReservations,
    search,
    statusFilter,
    serviceFilter,
    onSearchChange,
    onStatusFilterChange,
    onServiceFilterChange,
    onClearFilters,
    onSeatParty,
    onCompleteParty,
    showViewAllLink = false,
    title = "Today's Reservations",
}: ReservationListProps) {
    const hasActiveFilters =
        search || statusFilter !== 'All' || serviceFilter !== 'All';

    return (
        <div className="rounded-2xl border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
            {/* Card Header */}
            <div className="flex flex-col gap-4 border-b border-[#dedbd3]/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="font-heading text-xl font-semibold tracking-tight text-[#1d1d1d]">
                            {title}
                        </h2>
                        <span className="rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-xs font-semibold text-[#1d1d1d]/75">
                            {filteredReservations.length} of{' '}
                            {reservations.length}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-[#1d1d1d]/60">
                        Floor guest arrival schedule, table allocations, and
                        party statuses
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Service Tabs */}
                    <div className="inline-flex rounded-xl border border-[#dedbd3] bg-[#f8f7f3] p-1">
                        {(['All', 'Dinner', 'Lunch'] as const).map(
                            (service) => (
                                <button
                                    key={service}
                                    type="button"
                                    onClick={() =>
                                        onServiceFilterChange(service)
                                    }
                                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                                        serviceFilter === service
                                            ? 'bg-white font-semibold text-[#1d1d1d] shadow-2xs'
                                            : 'text-[#1d1d1d]/65 hover:text-[#1d1d1d]'
                                    }`}
                                >
                                    {service}
                                </button>
                            ),
                        )}
                    </div>

                    {showViewAllLink && (
                        <Link
                            href={reservationsRoute.url()}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#dedbd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1d1d] shadow-2xs transition-colors hover:bg-[#f8f7f3]"
                        >
                            <span>Full Ledger</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search guest, email, phone, or table..."
                        className="h-10 w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/50 pr-4 pl-10 text-xs text-[#1d1d1d] transition-all placeholder:text-[#1d1d1d]/40 focus:border-[#1f1d1b] focus:bg-white focus:ring-1 focus:ring-[#1f1d1b] focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-xs text-[#1d1d1d]/50">
                        Status:
                    </span>
                    {(['All', 'Confirmed', 'Seated', 'Completed'] as const).map(
                        (status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => onStatusFilterChange(status)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                                    statusFilter === status
                                        ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3] shadow-2xs'
                                        : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70 hover:bg-[#f8f7f3]'
                                }`}
                            >
                                {status}
                            </button>
                        ),
                    )}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                        >
                            <X className="size-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="mt-5 overflow-hidden rounded-xl border border-[#dedbd3]/80">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-[#dedbd3] bg-[#faf9f6] text-[11px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Guest Info</th>
                                <th className="px-4 py-3">Table & Party</th>
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
                                        No reservations found matching your
                                        criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((res) => (
                                    <tr
                                        key={res.id}
                                        className="transition-colors hover:bg-[#f8f7f3]/60"
                                    >
                                        <td className="px-4 py-3.5 font-mono text-sm font-semibold text-[#1d1d1d]">
                                            {res.time}
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-[#1d1d1d]">
                                                {res.guestName}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                {res.email} • {res.phone}
                                            </div>
                                            {res.notes && (
                                                <div className="mt-1 text-[11px] font-medium text-[#2f4a3c]">
                                                    Note: {res.notes}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <div className="text-xs font-semibold text-[#1d1d1d]">
                                                {res.table}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                {res.partySize}{' '}
                                                {res.partySize === 1
                                                    ? 'guest'
                                                    : 'guests'}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <span className="rounded-md border border-[#dedbd3] bg-[#f8f7f3] px-2 py-0.5 text-xs font-medium text-[#1d1d1d]/75">
                                                {res.service}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            {res.status === 'Seated' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-800 uppercase">
                                                    <span className="size-1.5 rounded-full bg-amber-500" />
                                                    Seated
                                                </span>
                                            )}
                                            {res.status === 'Confirmed' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#2f4a3c] uppercase">
                                                    <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                                                    Confirmed
                                                </span>
                                            )}
                                            {res.status === 'Completed' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-stone-600 uppercase">
                                                    <span className="size-1.5 rounded-full bg-stone-400" />
                                                    Completed
                                                </span>
                                            )}
                                            {res.status === 'Cancelled' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-rose-700 uppercase">
                                                    <span className="size-1.5 rounded-full bg-rose-500" />
                                                    Cancelled
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {res.status === 'Confirmed' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onSeatParty(
                                                                res.id,
                                                                res.guestName,
                                                                res.table,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg bg-[#1f1d1b] px-3 py-1.5 text-xs font-semibold text-[#f8f7f3] shadow-2xs transition-colors hover:bg-[#1f1d1b]/85"
                                                    >
                                                        <Check className="size-3.5" />
                                                        <span>Seat Party</span>
                                                    </button>
                                                )}
                                                {res.status === 'Seated' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onCompleteParty(
                                                                res.id,
                                                                res.guestName,
                                                            )
                                                        }
                                                        className="rounded-lg border border-[#dedbd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1d1d] shadow-2xs transition-colors hover:bg-[#f8f7f3]"
                                                    >
                                                        Clear Table
                                                    </button>
                                                )}
                                                {res.status === 'Completed' && (
                                                    <span className="text-xs text-[#1d1d1d]/40 italic">
                                                        Finished
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table Footer */}
            <div className="mt-4 flex flex-col gap-2 pt-2 text-xs text-[#1d1d1d]/60 sm:flex-row sm:items-center sm:justify-between">
                <span>Halden Dining Ledger • Active Host: Maja Eklund</span>
                <Link
                    href={reserve.url()}
                    className="font-medium text-[#1d1d1d] underline underline-offset-4 transition-colors hover:text-[#2f4a3c]"
                >
                    Public Booking Engine →
                </Link>
            </div>
        </div>
    );
}
