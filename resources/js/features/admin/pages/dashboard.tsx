import { Head, Link } from '@inertiajs/react';
import { Button } from '@/shared/components/ui/button';
import { logout } from '@/routes';
import { dashboard as staffDashboard } from '@/routes/staff';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#f8f7f3]">
            <Head title="Admin | Halden" />

            <header className="border-b border-[#dedbd3] bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 font-heading text-2xl text-[#1d1d1d]">
                            Halden control
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={staffDashboard.url()}
                            className="text-sm text-[#1d1d1d]/75 underline-offset-4 hover:underline"
                        >
                            Floor portal
                        </Link>
                        <Link
                            href={logout.url()}
                            method="post"
                            as="button"
                            className="inline-flex"
                        >
                            <Button
                                type="button"
                                className="h-10 rounded-full bg-[#1f1d1b] px-5 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase"
                            >
                                Sign out
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-5 py-12">
                <p className="max-w-xl text-base leading-relaxed text-[#1d1d1d]/80">
                    Admin access is active. Table seeding, hours, and staff
                    accounts will live here next.
                </p>
            </main>
        </div>
    );
}
