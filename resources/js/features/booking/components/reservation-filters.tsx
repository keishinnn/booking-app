import type {
    BookingFilterField,
    BookingFilters,
} from '@/features/booking/types';

const partySizeOptions = [1, 2, 3, 4, 5, 6];
const timeOptions = [
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
];

type ReservationFiltersProps = {
    filters: BookingFilters;
    today: string;
    onFilterChange: (field: BookingFilterField, value: string) => void;
};

export default function ReservationFilters({
    filters,
    today,
    onFilterChange,
}: ReservationFiltersProps) {
    return (
        <div className="mt-8 rounded-2xl border border-[#dedbd3] bg-white p-6 shadow-2xs sm:mt-10 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Date Filter */}
                <div>
                    <label
                        htmlFor="reserve-date"
                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                    >
                        Dining Date
                    </label>
                    <input
                        type="date"
                        id="reserve-date"
                        min={today}
                        value={filters.date ?? ''}
                        onChange={(e) => onFilterChange('date', e.target.value)}
                        className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
                    />
                </div>

                {/* Party Size Filter */}
                <div>
                    <label
                        htmlFor="reserve-party-size"
                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                    >
                        Party Size
                    </label>
                    <select
                        id="reserve-party-size"
                        value={filters.party_size ?? ''}
                        onChange={(e) =>
                            onFilterChange('party_size', e.target.value)
                        }
                        className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
                    >
                        <option value="">Select party size</option>
                        {partySizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} {size === 1 ? 'Guest' : 'Guests'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Filter */}
                <div>
                    <label
                        htmlFor="reserve-starts-at"
                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/70 uppercase"
                    >
                        Seating Time
                    </label>
                    <select
                        id="reserve-starts-at"
                        value={filters.starts_at ?? ''}
                        onChange={(e) =>
                            onFilterChange('starts_at', e.target.value)
                        }
                        className="w-full rounded-xl border border-[#dedbd3] bg-[#f8f7f3]/60 px-4 py-3 text-sm text-[#1d1d1d] transition-all focus:border-[#1f1d1b] focus:bg-white focus:ring-2 focus:ring-[#1f1d1b]/10 focus:outline-none"
                    >
                        <option value="">Select seating time</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time} (held for 2 hours)
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
