import type { FloorTableStatus } from '@/features/staff/types';

const statusTone = {
    'In service': {
        label: 'bg-[#1f1d1b] text-[#f8f7f3]',
        count: 'text-[#1f1d1b]',
        card: 'border-[#1f1d1b] bg-white',
    },
    Reserved: {
        label: 'bg-[#b45309] text-white',
        count: 'text-[#b45309]',
        card: 'border-[#b45309] bg-[#fffaf3]',
    },
    Open: {
        label: 'bg-[#1a7a4c] text-white',
        count: 'text-[#1a7a4c]',
        card: 'border-[#1a7a4c] bg-[#f3faf6]',
    },
} as const;

export function floorTableCardTone(status: FloorTableStatus): string {
    return statusTone[status].card;
}

export function TableStatusLabel({ status }: { status: FloorTableStatus }) {
    return (
        <span
            className={`inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${statusTone[status].label}`}
        >
            {status}
        </span>
    );
}

type FloorStatusCountsProps = {
    inService: number;
    reserved: number;
    open: number;
};

export function FloorStatusCounts({
    inService,
    reserved,
    open,
}: FloorStatusCountsProps) {
    const items = [
        {
            key: 'in-service',
            count: inService,
            label: 'In service',
            tone: statusTone['In service'],
        },
        {
            key: 'reserved',
            count: reserved,
            label: 'Reserved',
            tone: statusTone.Reserved,
        },
        {
            key: 'open',
            count: open,
            label: 'Open',
            tone: statusTone.Open,
        },
    ] as const;

    return (
        <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {items.map((item) => (
                <div key={item.key} className="flex items-baseline gap-1.5">
                    <dt className="order-2 text-xs text-[#1d1d1d]/55">
                        {item.label}
                    </dt>
                    <dd
                        className={`order-1 font-heading text-sm font-semibold tabular-nums ${item.tone.count}`}
                    >
                        {item.count}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
