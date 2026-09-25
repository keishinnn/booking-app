import type {
    DiningReservation,
    DiningTable,
    FloorTableCard,
    FloorTableStatus,
} from '@/features/staff/types';

const WINDOW_HOURS = 2;

function parseStartsAtMinutes(startsAt: string): number {
    const [hours, minutes] = startsAt.split(':').map(Number);

    return hours * 60 + (minutes || 0);
}

function formatEndTime(startsAt: string): string {
    const startMinutes = parseStartsAtMinutes(startsAt);
    const endMinutes = startMinutes + WINDOW_HOURS * 60;
    const hours = Math.floor(endMinutes / 60) % 24;
    const minutes = endMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function reservationTimeWindow(startsAt: string): string {
    return `${startsAt}–${formatEndTime(startsAt)}`;
}

function isWindowActive(
    startsAt: string,
    now: Date,
    today: string,
): boolean {
    const todayDate = today.slice(0, 10);
    const nowDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    if (nowDate !== todayDate) {
        return false;
    }

    const startMinutes = parseStartsAtMinutes(startsAt);
    const endMinutes = startMinutes + WINDOW_HOURS * 60;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
}

function isUpcoming(startsAt: string, now: Date, today: string): boolean {
    const todayDate = today.slice(0, 10);
    const nowDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    if (nowDate !== todayDate) {
        return true;
    }

    const startMinutes = parseStartsAtMinutes(startsAt);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return startMinutes > nowMinutes;
}

function previewCopy(reservation: DiningReservation): {
    partyInfo: string;
    timeSlot: string;
    service: 'Lunch' | 'Dinner';
} {
    return {
        partyInfo: `${reservation.guest_name}, ${reservation.party_size} guests`,
        timeSlot: reservationTimeWindow(reservation.starts_at),
        service: reservation.service,
    };
}

export function buildFloorTableCards(
    tables: DiningTable[],
    reservations: DiningReservation[],
    today: string,
    now: Date = new Date(),
): FloorTableCard[] {
    return tables.map((table) => {
        const tableReservations = reservations
            .filter((reservation) => reservation.table_id === table.id)
            .slice()
            .sort(
                (a, b) =>
                    parseStartsAtMinutes(a.starts_at) -
                    parseStartsAtMinutes(b.starts_at),
            );

        const inService = tableReservations.find((reservation) =>
            isWindowActive(reservation.starts_at, now, today),
        );

        if (inService) {
            const preview = previewCopy(inService);

            return {
                id: table.id,
                name: table.name,
                capacity: table.capacity,
                image_url: table.image_url,
                status: 'In service' satisfies FloorTableStatus,
                partyInfo: preview.partyInfo,
                timeSlot: preview.timeSlot,
                service: preview.service,
            };
        }

        const next = tableReservations.find((reservation) =>
            isUpcoming(reservation.starts_at, now, today),
        );

        if (next) {
            const preview = previewCopy(next);

            return {
                id: table.id,
                name: table.name,
                capacity: table.capacity,
                image_url: table.image_url,
                status: 'Reserved' satisfies FloorTableStatus,
                partyInfo: preview.partyInfo,
                timeSlot: preview.timeSlot,
                service: preview.service,
            };
        }

        return {
            id: table.id,
            name: table.name,
            capacity: table.capacity,
            image_url: table.image_url,
            status: 'Open' satisfies FloorTableStatus,
            partyInfo: 'Available for walk-in',
            timeSlot: null,
            service: null,
        };
    });
}
