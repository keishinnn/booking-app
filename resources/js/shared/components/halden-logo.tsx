import type { SVGProps } from 'react';

export type HaldenMarkProps = SVGProps<SVGSVGElement>;

/**
 * Halden architectural monogram mark.
 * Represents two vertical architectural columns bridged by a cantilevered dining table slab.
 */
export function HaldenMark({
    className = 'size-6',
    ...props
}: HaldenMarkProps) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <g fill="currentColor">
                {/* Left Column with subtle architectural flare */}
                <path d="M 8.5 5 C 9.8 5 10.2 5.8 10.2 7.2 V 24.8 C 10.2 26.2 9.8 27 8.5 27 H 14.5 C 13.2 27 12.8 26.2 12.8 24.8 V 7.2 C 12.8 5.8 13.2 5 14.5 5 Z" />
                {/* Right Column with subtle architectural flare */}
                <path d="M 17.5 5 C 18.8 5 19.2 5.8 19.2 7.2 V 24.8 C 19.2 26.2 18.8 27 17.5 27 H 23.5 C 22.2 27 21.8 26.2 21.8 24.8 V 7.2 C 21.8 5.8 22.2 5 23.5 5 Z" />
                {/* Cantilevered Table Slab */}
                <path d="M 4 16 L 6.2 14.4 H 25.8 L 28 16 L 25.8 17.6 H 6.2 Z" />
            </g>
        </svg>
    );
}

export type HaldenLogoProps = {
    variant?: 'mark' | 'full';
    className?: string;
    markClassName?: string;
    textClassName?: string;
};

/**
 * Halden brand logo component.
 * Supports standalone architectural monogram mark or full wordmark lockup.
 */
export default function HaldenLogo({
    variant = 'full',
    className = 'inline-flex items-center gap-2.5',
    markClassName = 'size-6 shrink-0',
    textClassName = 'font-heading text-xl tracking-tight sm:text-2xl',
}: HaldenLogoProps) {
    if (variant === 'mark') {
        return <HaldenMark className={markClassName} />;
    }

    return (
        <span className={className}>
            <HaldenMark className={markClassName} />
            <span className={textClassName}>Halden</span>
        </span>
    );
}
