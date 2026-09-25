import { useEffect } from 'react';

/**
 * Locks document scroll while mounted and compensates for the scrollbar
 * width so the layout does not shift sideways when the bar disappears.
 */
export function useLockBodyScroll(): void {
    useEffect(() => {
        const { body } = document;
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        const previousOverflow = body.style.overflow;
        const previousPaddingRight = body.style.paddingRight;

        body.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPaddingRight;
        };
    }, []);
}
