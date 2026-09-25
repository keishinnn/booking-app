import { X } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { useLockBodyScroll } from '@/shared/lib/use-lock-body-scroll';

type PortalDialogProps = {
    title: string;
    children: ReactNode;
    onClose: () => void;
    tone?: 'default' | 'danger';
    eyebrow?: string;
    size?: 'md' | 'lg';
};

export default function PortalDialog({
    title,
    children,
    onClose,
    tone = 'default',
    eyebrow,
    size = 'md',
}: PortalDialogProps) {
    const titleId = useId();
    useLockBodyScroll();

    const resolvedEyebrow =
        eyebrow ?? (tone === 'danger' ? 'Danger zone' : 'Halden');

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-[#1d1d1d]/45 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`relative z-10 w-full border border-[#dedbd3] bg-white shadow-2xl sm:max-h-[90vh] sm:overflow-y-auto ${
                    size === 'lg' ? 'max-w-2xl' : 'max-w-lg'
                }`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#dedbd3] px-5 py-4 sm:px-6">
                    <div>
                        <p
                            className={`text-[10px] font-semibold tracking-widest uppercase ${
                                tone === 'danger'
                                    ? 'text-[#8a4b3b]'
                                    : 'text-[#2f4a3c]'
                            }`}
                        >
                            {resolvedEyebrow}
                        </p>
                        <h3
                            id={titleId}
                            className="mt-1 font-heading text-2xl text-[#1d1d1d]"
                        >
                            {title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center text-[#1d1d1d]/55 transition-colors hover:bg-[#f8f7f3] hover:text-[#1d1d1d]"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
            </div>
        </div>
    );
}
