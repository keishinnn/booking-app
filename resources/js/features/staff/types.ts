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

export type ReservationStatus =
    | 'Seated'
    | 'Confirmed'
    | 'Completed'
    | 'Cancelled';

export type ReservationService = 'Lunch' | 'Dinner';

export type Reservation = {
    id: string;
    time: string;
    guestName: string;
    email: string;
    phone: string;
    table: string;
    partySize: number;
    status: ReservationStatus;
    service: ReservationService;
    notes?: string;
};

export type ReservationStatusFilter =
    | 'All'
    | 'Seated'
    | 'Confirmed'
    | 'Completed';

export type ReservationServiceFilter = 'All' | 'Dinner' | 'Lunch';
