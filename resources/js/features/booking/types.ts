export type Table = {
    id: number;
    name: string;
    capacity: number;
};

export type BookingFilters = {
    date: string | null;
    party_size: number | null;
    starts_at: string | null;
    table_id?: number | null;
    step?: number | null;
};

export type BookPageProps = {
    filters: BookingFilters;
    tables: Array<Table>;
};

export type BookingFilterField = 'date' | 'party_size' | 'starts_at';
