import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import GuestLayout from '@/shared/layouts/guest-layout';
import { home, reserve } from '@/routes';

export default function Privacy() {
    return (
        <GuestLayout>
            <Head title="Privacy" />

            <section className="bg-[#f8f7f3] py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-4xl px-5 sm:px-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <span className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Halden
                        </span>
                        <h1 className="animate-fade-slide-up animation-delay-100 mt-3 font-heading text-4xl font-normal tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                            Privacy.
                        </h1>
                    </div>

                    {/* Privacy Card */}
                    <div className="animate-fade-slide-up animation-delay-200 mt-10 border border-[#dedbd3] bg-white p-8 sm:mt-12 sm:p-12 lg:p-14">
                        <div className="max-w-2xl space-y-6 text-base leading-relaxed text-[#1d1d1d]/85 sm:text-lg sm:leading-relaxed">
                            <p>
                                The reservation stores the guest's name, email, phone, party size, date, time, and optional note so the table can be held and a confirmation can be sent.
                            </p>
                        </div>

                        <div className="mt-8 border-t border-[#dedbd3] pt-6 sm:mt-10 sm:pt-8">
                            <p className="text-xs text-[#1d1d1d]/60 sm:text-sm">
                                Note: This is trial copy, not a legal policy.
                            </p>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#dedbd3] pt-6 sm:mt-12 sm:pt-8">
                            <Button
                                nativeButton={false}
                                render={<Link href={reserve.url()} />}
                                className="group h-12 rounded-full bg-[#1f1d1b] px-8 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase transition-all duration-300 hover:bg-[#1f1d1b]/90 active:scale-98 sm:h-13 sm:px-9 sm:text-sm"
                            >
                                <span>Reserve a table</span>
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>

                            <Link
                                href={home.url()}
                                className="text-sm font-semibold tracking-wide text-[#1d1d1d] underline underline-offset-6 transition-colors hover:text-[#2f4a3c]"
                            >
                                Back to Halden
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
