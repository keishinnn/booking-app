import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { logout } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as adminTables } from '@/routes/admin/tables';
import { dashboard as staffDashboard } from '@/routes/staff';

type AdminLayoutProps = {
    children: ReactNode;
    title?: string;
};

export default function AdminLayout({
    children,
    title = 'Admin',
}: AdminLayoutProps) {
    const { flash } = usePage<{
        flash?: { success?: string | null; error?: string | null };
    }>().props;

    return (
        <div className="min-h-screen bg-[#f8f7f3]">
            <Head title={`${title} | Halden`} />

            <header className="border-b border-[#dedbd3] bg-white">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 font-heading text-2xl text-[#1d1d1d]">
                            Halden control
                        </h1>
                    </div>
                    <nav className="flex flex-wrap items-center gap-4 text-sm text-[#1d1d1d]/75">
                        <Link
                            href={adminDashboard.url()}
                            className="underline-offset-4 hover:underline"
                        >
                            Overview
                        </Link>
                        <Link
                            href={adminTables.url()}
                            className="underline-offset-4 hover:underline"
                        >
                            Tables
                        </Link>
                        <Link
                            href={staffDashboard.url()}
                            className="underline-offset-4 hover:underline"
                        >
                            Floor portal
                        </Link>
                        <Link
                            href={logout.url()}
                            method="post"
                            as="button"
                            className="font-medium text-[#1d1d1d] underline-offset-4 hover:underline"
                        >
                            Sign out
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-5 py-10">
                {(flash?.success || flash?.error) && (
                    <div
                        className={`mb-6 border px-4 py-3 text-sm ${
                            flash.error
                                ? 'border-[#8a4b3b]/30 bg-[#8a4b3b]/10 text-[#8a4b3b]'
                                : 'border-[#2f4a3c]/30 bg-[#2f4a3c]/10 text-[#2f4a3c]'
                        }`}
                    >
                        {flash.error || flash.success}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
