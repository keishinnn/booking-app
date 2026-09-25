export type Table = {
    id: string;
    name: string;
    capacity: number;
    image_url?: string | null;
};

export type BookingFilters = {
    date: string | null;
    party_size: number | null;
    starts_at: string | null;
    table_id?: string | null;
    step?: number | null;
};

export type BookPageProps = {
    filters: BookingFilters;
    tables: Array<Table>;
    startTimes?: string[];
};

export type BookingFilterField = 'date' | 'party_size' | 'starts_at';

export type ConfirmedReservation = {
    id: number;
    guest_name: string;
    email: string;
    phone: string;
    party_size: number;
    reserved_on: string;
    starts_at: string;
    status: string;
    notes: string | null;
    service: 'Lunch' | 'Dinner';
    table: {
        id: string;
        name: string;
        capacity: number;
    } | null;
};
