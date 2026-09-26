import type { ReservationStatus } from '@/features/staff/types';

type ServiceName = 'Lunch' | 'Dinner';

const serviceTone: Record<ServiceName, string> = {
    Lunch: 'bg-[#b45309] text-white',
    Dinner: 'bg-[#1f1d1b] text-[#f8f7f3]',
};

const statusTone: Record<ReservationStatus, string> = {
    confirmed: 'bg-[#1a7a4c] text-white',
    seated: 'bg-[#1d4ed8] text-white',
    completed: 'bg-[#57534e] text-white',
    no_show: 'bg-[#a16207] text-white',
    cancelled: 'bg-[#9f1239] text-white',
};

const statusLabel: Record<ReservationStatus, string> = {
    confirmed: 'Confirmed',
    seated: 'Seated',
    completed: 'Completed',
    no_show: 'No-show',
    cancelled: 'Cancelled',
};

export function ReservationServiceLabel({
    service,
}: {
    service: ServiceName;
}) {
    return (
        <span
            className={`inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${serviceTone[service]}`}
        >
            {service}
        </span>
    );
}

export function ReservationStatusLabel({
    status,
}: {
    status: ReservationStatus;
}) {
    return (
        <span
            className={`inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${statusTone[status]}`}
        >
            {statusLabel[status]}
        </span>
    );
}
