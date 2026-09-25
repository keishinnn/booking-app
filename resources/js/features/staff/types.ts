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

export type ReservationStatusFilter = 'All' | ReservationStatus;

export type ReservationServiceFilter = 'All' | 'Dinner' | 'Lunch';
