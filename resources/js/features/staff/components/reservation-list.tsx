import { Link } from '@inertiajs/react';
import { ArrowRight, X } from 'lucide-react';
import {
    ReservationServiceLabel,
    ReservationStatusLabel,
} from '@/features/staff/components/reservation-badges';
import { reservations as reservationsRoute } from '@/routes/staff';
import type {
    DiningReservation,
    ReservationServiceFilter,
    ReservationStatusFilter,
} from '@/features/staff/types';

type ReservationListProps = {
    reservations: DiningReservation[];
    filteredReservations: DiningReservation[];
    search: string;
    statusFilter: ReservationStatusFilter;
    serviceFilter: ReservationServiceFilter;
    onStatusFilterChange: (value: ReservationStatusFilter) => void;
    onServiceFilterChange: (value: ReservationServiceFilter) => void;
    onClearFilters: () => void;
    showViewAllLink?: boolean;
    title?: string;
};

export default function ReservationList({
    reservations,
    filteredReservations,
    search,
    statusFilter,
    serviceFilter,
    onStatusFilterChange,
    onServiceFilterChange,
    onClearFilters,
    showViewAllLink = false,
    title = "Today's reservations",
}: ReservationListProps) {
    const hasActiveFilters =
        search || statusFilter !== 'All' || serviceFilter !== 'All';

    return (
        <div className="border border-[#dedbd3] bg-white p-5 shadow-xs md:p-6">
            <div className="flex flex-col gap-4 border-b border-[#dedbd3]/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="font-heading text-xl font-semibold tracking-tight text-[#1d1d1d]">
                            {title}
                        </h2>
                        <span className="border border-[#dedbd3] bg-[#f8f7f3] px-2.5 py-0.5 text-xs font-semibold text-[#1d1d1d]/75">
                            {filteredReservations.length} of{' '}
                            {reservations.length}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-[#1d1d1d]/60">
                        Use the header search to filter guests, tables, or
                        bookings
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="inline-flex border border-[#dedbd3] bg-[#f8f7f3] p-1">
                        {(['All', 'Dinner', 'Lunch'] as const).map(
                            (service) => (
                                <button
                                    key={service}
                                    type="button"
                                    onClick={() =>
                                        onServiceFilterChange(service)
                                    }
                                    className={`px-3 py-1 text-xs font-medium transition-all ${
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
                            className="inline-flex items-center gap-1 border border-[#dedbd3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1d1d1d] shadow-2xs transition-colors hover:bg-[#f8f7f3]"
                        >
                            <span>Full ledger</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    )}
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-xs text-[#1d1d1d]/50">Status:</span>
                {(['All', 'confirmed', 'cancelled'] as const).map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => onStatusFilterChange(status)}
                        className={`px-2.5 py-1.5 text-xs font-medium transition-all ${
                            statusFilter === status
                                ? 'bg-[#1f1d1b] font-semibold text-[#f8f7f3] shadow-2xs'
                                : 'border border-[#dedbd3] bg-white text-[#1d1d1d]/70 hover:bg-[#f8f7f3]'
                        }`}
                    >
                        {status === 'All'
                            ? 'All'
                            : status === 'confirmed'
                              ? 'Confirmed'
                              : 'Cancelled'}
                    </button>
                ))}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                    >
                        <X className="size-3.5" />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            <div className="mt-5 overflow-hidden border border-[#dedbd3]/80">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-[#dedbd3] bg-[#faf9f6] text-[11px] font-semibold tracking-wider text-[#1d1d1d]/60 uppercase">
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Guest</th>
                                <th className="px-4 py-3">Table</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dedbd3]/60 bg-white">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-12 text-center text-sm text-[#1d1d1d]/50"
                                    >
                                        No reservations match these filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((reservation) => (
                                    <tr
                                        key={reservation.id}
                                        className="transition-colors hover:bg-[#f8f7f3]/60"
                                    >
                                        <td className="px-4 py-3.5 font-mono text-sm font-semibold text-[#1d1d1d]">
                                            {reservation.starts_at}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-[#1d1d1d]">
                                                {reservation.guest_name}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                {reservation.email} ·{' '}
                                                {reservation.phone}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="text-xs font-semibold text-[#1d1d1d]">
                                                {reservation.table?.name ?? '—'}
                                            </div>
                                            <div className="mt-0.5 text-xs text-[#1d1d1d]/60">
                                                {reservation.party_size}{' '}
                                                {reservation.party_size === 1
                                                    ? 'guest'
                                                    : 'guests'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <ReservationServiceLabel
                                                service={reservation.service}
                                            />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <ReservationStatusLabel
                                                status={reservation.status}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
