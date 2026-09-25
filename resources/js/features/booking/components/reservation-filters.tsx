import type { BookingFilterField, BookingFilters } from '@/features/booking/types';

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
        <div className="animate-fade-slide-up animation-delay-300 mt-10 border border-[#dedbd3] bg-white p-6 sm:mt-12 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                    <label
                        htmlFor="reserve-date"
                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                    >
                        Date
                    </label>
                    <input
                        type="date"
                        id="reserve-date"
                        min={today}
                        value={filters.date ?? ''}
                        onChange={(e) => onFilterChange('date', e.target.value)}
                        className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                    />
                </div>

                <div>
                    <label
                        htmlFor="reserve-party-size"
                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                    >
                        Party size
                    </label>
                    <select
                        id="reserve-party-size"
                        value={filters.party_size ?? ''}
                        onChange={(e) =>
                            onFilterChange('party_size', e.target.value)
                        }
                        className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                    >
                        <option value="">Select party size</option>
                        {partySizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} {size === 1 ? 'guest' : 'guests'}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="reserve-starts-at"
                        className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                    >
                        Time
                    </label>
                    <select
                        id="reserve-starts-at"
                        value={filters.starts_at ?? ''}
                        onChange={(e) =>
                            onFilterChange('starts_at', e.target.value)
                        }
                        className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] transition-colors focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                    >
                        <option value="">Select time</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
