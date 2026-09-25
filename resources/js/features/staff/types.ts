export type DiningTable = {
    id: string;
    name: string;
    capacity: number;
    image_url: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ReservationStatus = 'confirmed' | 'cancelled';

export type DiningReservation = {
    id: number;
    table_id: string;
    table: {
        id: string;
        name: string;
        capacity: number;
    } | null;
    guest_name: string;
    email: string;
    phone: string;
    party_size: number;
    reserved_on: string;
    starts_at: string;
    status: ReservationStatus;
    notes: string | null;
    service: 'Lunch' | 'Dinner';
    created_at?: string | null;
    updated_at?: string | null;
};

/** @deprecated Prefer DiningReservation for live data */
export type TableStatus = 'Occupied' | 'Reserved' | 'Open';

export type TableState = {
    id: number;
    name: string;
    subtitle?: string;
    capacity: number;
    status: TableStatus;
    statusLabel?: string;
    partyInfo?: string;
    timeSlot?: string;
    image?: string;
    location?: string;
};

/** @deprecated Prefer DiningReservation */
export type Reservation = {
    id: string;
    time: string;
    guestName: string;
    email: string;
    phone: string;
    table: string;
    partySize: number;
    status: 'Seated' | 'Confirmed' | 'Completed' | 'Cancelled';
    service: 'Lunch' | 'Dinner';
    notes?: string;
};

export type ReservationStatusFilter =
    | 'All'
    | 'confirmed'
    | 'cancelled'
    | 'Confirmed'
    | 'Seated'
    | 'Completed';

export type ReservationServiceFilter = 'All' | 'Dinner' | 'Lunch';
