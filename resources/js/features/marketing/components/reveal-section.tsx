import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealSectionProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

export default function RevealSection({
    children,
    className = '',
    delay = 0,
}: RevealSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
            } ${className}`}
        >
            {children}
        </div>
    );
}
