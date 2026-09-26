import { MoreVertical } from 'lucide-react';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
    type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import type { DiningReservation } from '@/features/staff/types';

type ReservationRowActionsProps = {
    reservation: DiningReservation;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    onEdit: () => void;
    onCancel: () => void;
    onSeat: () => void;
    onComplete: () => void;
    onNoShow: () => void;
};

export default function ReservationRowActions({
    reservation,
    open,
    onToggle,
    onClose,
    onEdit,
    onCancel,
    onSeat,
    onComplete,
    onNoShow,
}: ReservationRowActionsProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const canCancel =
        reservation.status === 'confirmed' || reservation.status === 'seated';

    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                menuRef.current?.contains(target) ||
                buttonRef.current?.contains(target)
            ) {
                return;
            }

            onClose();
        };

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onEscape);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onEscape);
        };
    }, [open, onClose]);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                aria-label={`Actions for ${reservation.guest_name}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={onToggle}
                className="inline-flex h-8 w-8 items-center justify-center border border-[#dedbd3] text-[#1d1d1d]/70 hover:bg-[#f8f7f3]"
            >
                <MoreVertical className="size-4" />
            </button>
            {open && (
                <ActionMenu anchorRef={buttonRef} menuRef={menuRef}>
                    <button
                        type="button"
                        role="menuitem"
                        className="flex w-full px-3 py-2 text-left text-xs font-medium hover:bg-[#f8f7f3]"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                    {reservation.status === 'confirmed' && (
                        <>
                            <button
                                type="button"
                                role="menuitem"
                                className="flex w-full px-3 py-2 text-left text-xs font-medium hover:bg-[#f8f7f3]"
                                onClick={onSeat}
                            >
                                Seat
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                className="flex w-full px-3 py-2 text-left text-xs font-medium hover:bg-[#f8f7f3]"
                                onClick={onNoShow}
                            >
                                No-show
                            </button>
                        </>
                    )}
                    {reservation.status === 'seated' && (
                        <button
                            type="button"
                            role="menuitem"
                            className="flex w-full px-3 py-2 text-left text-xs font-medium hover:bg-[#f8f7f3]"
                            onClick={onComplete}
                        >
                            Complete
                        </button>
                    )}
                    {canCancel && (
                        <button
                            type="button"
                            role="menuitem"
                            className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#8a4b3b] hover:bg-[#8a4b3b]/8"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    )}
                </ActionMenu>
            )}
        </>
    );
}

function ActionMenu({
    anchorRef,
    menuRef,
    children,
}: {
    anchorRef: RefObject<HTMLButtonElement | null>;
    menuRef: RefObject<HTMLDivElement | null>;
    children: ReactNode;
}) {
    const [position, setPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    useLayoutEffect(() => {
        const update = () => {
            const anchor = anchorRef.current;
            const menu = menuRef.current;

            if (!anchor || !menu) {
                return;
            }

            const rect = anchor.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            const gap = 4;
            let top = rect.bottom + gap;

            if (top + menuRect.height > window.innerHeight - 8) {
                top = Math.max(8, rect.top - gap - menuRect.height);
            }

            const left = Math.min(
                Math.max(8, rect.right - menuRect.width),
                window.innerWidth - menuRect.width - 8,
            );

            setPosition({ top, left });
        };

        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [anchorRef, menuRef]);

    return createPortal(
        <div
            ref={menuRef}
            role="menu"
            style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? 'visible' : 'hidden',
            }}
            className="fixed z-50 w-36 border border-[#dedbd3] bg-white p-1 shadow-lg"
        >
            {children}
        </div>,
        document.body,
    );
}
