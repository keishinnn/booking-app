import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { reserve } from '@/routes';
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
}: ReservationListProps) {
    return (
        <div className="mt-10 border border-[#dedbd3] bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-2 border-b border-[#dedbd3] pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-normal tracking-tight text-[#1d1d1d]">
                        Today's Reservations
                    </h2>
                    <p className="mt-1 text-xs text-[#1d1d1d]/70">
                        Showing {filteredReservations.length} of{' '}
                        {reservations.length} reservations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#1d1d1d]/60">Service:</span>
                    {(['All', 'Dinner', 'Lunch'] as const).map((service) => (
                        <button
                            key={service}
                            type="button"
                            onClick={() => onServiceFilterChange(service)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                serviceFilter === service
                                    ? 'bg-[#1f1d1b] text-[#f8f7f3]'
                                    : 'border border-[#dedbd3] bg-[#f8f7f3]/60 text-[#1d1d1d]/70 hover:border-[#1d1d1d]/30'
                            }`}
                        >
                            {service}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1d1d1d]/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by guest name or email..."
                        className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 py-2.5 pr-4 pl-10 text-xs text-[#1d1d1d] transition-colors placeholder:text-[#1d1d1d]/40 focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#1d1d1d]/60">Status:</span>
                    {(
                        ['All', 'Confirmed', 'Seated', 'Completed'] as const
                    ).map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => onStatusFilterChange(status)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                statusFilter === status
                                    ? 'bg-[#1f1d1b] text-[#f8f7f3]'
                                    : 'border border-[#dedbd3] bg-[#f8f7f3]/60 text-[#1d1d1d]/70 hover:border-[#1d1d1d]/30'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                    {(search ||
                        statusFilter !== 'All' ||
                        serviceFilter !== 'All') && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="ml-1 text-xs text-[#1d1d1d]/60 underline hover:text-[#1d1d1d]"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#dedbd3] text-[11px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                            <th className="py-3 pr-4 pl-1">Time</th>
                            <th className="px-4 py-3">Guest Name</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Table</th>
                            <th className="px-4 py-3">Party Size</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="py-3 pr-1 pl-4 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dedbd3]/50">
                        {filteredReservations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-12 text-center text-sm text-[#1d1d1d]/60"
                                >
                                    No reservations match your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredReservations.map((res) => (
                                <tr
                                    key={res.id}
                                    className="transition-colors hover:bg-[#f8f7f3]/60"
                                >
                                    <td className="py-4 pr-4 pl-1 font-mono text-sm font-semibold text-[#1d1d1d]">
                                        {res.time}
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="font-medium text-[#1d1d1d]">
                                            {res.guestName}
                                        </div>
                                        {res.notes && (
                                            <p className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                {res.notes}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 text-xs text-[#1d1d1d]/75">
                                        <div>{res.email}</div>
                                        <div className="mt-0.5 text-[#1d1d1d]/60">
                                            {res.phone}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-xs font-medium text-[#1d1d1d]">
                                        {res.table}
                                    </td>

                                    <td className="px-4 py-4 text-xs text-[#1d1d1d]/80">
                                        {res.partySize}{' '}
                                        {res.partySize === 1
                                            ? 'guest'
                                            : 'guests'}
                                    </td>

                                    <td className="px-4 py-4">
                                        {res.status === 'Seated' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1d1b] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#f8f7f3] uppercase">
                                                <span className="size-1.5 rounded-full bg-amber-400" />
                                                Seated
                                            </span>
                                        )}
                                        {res.status === 'Confirmed' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2f4a3c]/30 bg-[#2f4a3c]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                                <span className="size-1.5 rounded-full bg-[#2f4a3c]" />
                                                Confirmed
                                            </span>
                                        )}
                                        {res.status === 'Completed' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                                <span className="size-1.5 rounded-full bg-stone-400" />
                                                Completed
                                            </span>
                                        )}
                                        {res.status === 'Cancelled' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8a4b3b]/30 bg-[#8a4b3b]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#8a4b3b] uppercase">
                                                <span className="size-1.5 rounded-full bg-[#8a4b3b]" />
                                                Cancelled
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-4 pr-1 pl-4 text-right">
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
                                                    className="rounded-full bg-[#1f1d1b] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#f8f7f3] uppercase transition-colors hover:bg-[#1f1d1b]/80"
                                                >
                                                    Seat Party
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
                                                    className="rounded-full border border-[#dedbd3] bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1d1d1d] uppercase transition-colors hover:bg-[#f8f7f3]"
                                                >
                                                    Clear Table
                                                </button>
                                            )}
                                            {res.status === 'Completed' && (
                                                <span className="text-xs text-[#1d1d1d]/50 italic">
                                                    Archived
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

            <div className="mt-6 flex flex-col gap-2 border-t border-[#dedbd3] pt-4 text-xs text-[#1d1d1d]/60 sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Halden Floor Book • Floor Host on duty: Maja Eklund
                </span>
                <Link
                    href={reserve.url()}
                    className="font-medium text-[#1d1d1d] underline underline-offset-4 hover:text-[#2f4a3c]"
                >
                    Open full guest reservation ledger →
                </Link>
            </div>
        </div>
    );
}
