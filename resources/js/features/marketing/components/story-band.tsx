import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import RevealSection from '@/features/marketing/components/reveal-section';

export type StoryBandData = {
    tag: string;
    title: string;
    body: string;
    href: string;
    label: string;
    image: string;
    alt: string;
    badge: string;
};

type StoryBandProps = {
    band: StoryBandData;
    reverse?: boolean;
};

export default function StoryBand({ band, reverse = false }: StoryBandProps) {
    return (
        <section className="border-b border-[#dedbd3] bg-[#f8f7f3]">
            <div className="grid lg:grid-cols-2">
                <div
                    className={`flex flex-col justify-center px-5 py-14 sm:px-8 sm:py-18 lg:px-14 lg:py-24 xl:px-20 ${
                        reverse ? 'lg:order-2' : ''
                    }`}
                >
                    <RevealSection>
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            {band.tag}
                        </span>
                        <h2 className="mt-3 max-w-md font-heading text-3xl font-normal tracking-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
                            {band.title}
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg">
                            {band.body}
                        </p>
                        <div className="mt-7">
                            <Link
                                href={band.href}
                                className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-[#1d1d1d] underline underline-offset-6 transition-colors hover:text-[#2f4a3c]"
                            >
                                <span>{band.label}</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </RevealSection>
                </div>

                <div
                    className={`relative min-h-[20rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[32rem] ${
                        reverse ? 'lg:order-1' : ''
                    }`}
                >
                    <RevealSection className="h-full w-full">
                        <div className="group relative h-full w-full overflow-hidden">
                            <img
                                src={band.image}
                                alt={band.alt}
                                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                            <div className="absolute top-4 right-4 z-10 rounded-full border border-white/30 bg-[#1f1d1b]/70 px-3 py-1 text-xs font-medium text-[#f8f7f3] backdrop-blur-md">
                                {band.badge}
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </div>
        </section>
    );
}
