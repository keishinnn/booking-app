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

export type HaldenBadgeProps = {
    className?: string;
    markClassName?: string;
    tone?: 'linen' | 'dark';
};

/**
 * Halden architectural monogram encased in a rounded tactile tile.
 * - 'linen': warm linen background (#f8f7f3) with dark soot 'H' mark (#1f1d1b).
 * - 'dark': dark soot background (#1f1d1b) with warm linen 'H' mark (#f8f7f3).
 */
export function HaldenBadge({
    className = 'size-8.5 sm:size-9.5 rounded-lg sm:rounded-xl',
    markClassName = 'size-5 sm:size-5.5',
    tone = 'linen',
}: HaldenBadgeProps) {
    const toneClasses =
        tone === 'dark'
            ? 'bg-[#1f1d1b] text-[#f8f7f3] border border-white/10'
            : 'bg-[#f8f7f3] text-[#1f1d1b] shadow-2xs';

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center transition-all ${toneClasses} ${className}`}
            aria-hidden="true"
        >
            <HaldenMark className={markClassName} />
        </span>
    );
}

export type HaldenLogoProps = {
    variant?: 'mark' | 'full' | 'badge' | 'badge-full';
    tone?: 'linen' | 'dark';
    className?: string;
    markClassName?: string;
    textClassName?: string;
    badgeClassName?: string;
};

/**
 * Halden brand logo component.
 * Supports:
 * - 'mark': standalone vector monogram icon
 * - 'full': bare monogram mark + wordmark
 * - 'badge': rounded-corner tile asset (H as primary on linen background)
 * - 'badge-full': rounded-corner badge asset + wordmark
 */
export default function HaldenLogo({
    variant = 'full',
    tone = 'linen',
    className = 'inline-flex items-center gap-3',
    markClassName,
    textClassName = 'font-heading text-xl tracking-tight sm:text-2xl',
    badgeClassName,
}: HaldenLogoProps) {
    if (variant === 'mark') {
        return <HaldenMark className={markClassName ?? 'size-6 shrink-0'} />;
    }

    if (variant === 'badge') {
        return (
            <HaldenBadge
                tone={tone}
                className={badgeClassName}
                markClassName={markClassName}
            />
        );
    }

    if (variant === 'badge-full') {
        return (
            <span className={className}>
                <HaldenBadge
                    tone={tone}
                    className={badgeClassName}
                    markClassName={markClassName}
                />
                <span className={textClassName}>Halden</span>
            </span>
        );
    }

    return (
        <span className={className}>
            <HaldenMark className={markClassName ?? 'size-6 shrink-0'} />
            <span className={textClassName}>Halden</span>
        </span>
    );
}
