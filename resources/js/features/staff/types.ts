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

export type FloorTableStatus = 'In service' | 'Reserved' | 'Open';

/** @deprecated Prefer FloorTableStatus for live floor */
export type TableStatus = FloorTableStatus | 'Occupied';

export type FloorTableCard = {
    id: string;
    name: string;
    capacity: number;
    image_url: string | null;
    status: FloorTableStatus;
    partyInfo: string;
    timeSlot: string | null;
    service: 'Lunch' | 'Dinner' | null;
};

/** @deprecated Prefer FloorTableCard for live floor */
export type TableState = {
    id: number | string;
    name: string;
    subtitle?: string;
    capacity: number;
    status: TableStatus;
    statusLabel?: string;
    partyInfo?: string;
    timeSlot?: string;
    image?: string;
    image_url?: string | null;
    location?: string;
    service?: 'Lunch' | 'Dinner' | null;
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
