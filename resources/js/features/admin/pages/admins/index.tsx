import { Form, Head, usePage } from '@inertiajs/react';
import { MoreVertical, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import StaffForm from '@/features/admin/components/staff-form';
import PortalDialog from '@/shared/components/portal-dialog';
import StaffLayout from '@/shared/layouts/staff-layout';
import type { Auth } from '@/shared/types/auth';
import { destroy, store, update } from '@/routes/admin/admins';

type AdminAccount = {
    id: number;
    name: string;
    email: string;
    is_only_admin: boolean;
};

type AdminsIndexProps = {
    admins: AdminAccount[];
};

export default function AdminAdminsIndex({ admins }: AdminsIndexProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
    const [deletingAdmin, setDeletingAdmin] = useState<AdminAccount | null>(
        null,
    );
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (menuOpenId === null) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpenId(null);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpenId(null);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menuOpenId]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') {
                return;
            }

            setCreateOpen(false);
            setEditingAdmin(null);
            setDeletingAdmin(null);
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <StaffLayout>
            <Head title="Admins | Halden Admin" />

            <div className="relative pb-24">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        Team
                    </p>
                    <h2 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                        Admins
                    </h2>
                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                        Manage the accounts that can edit the catalog and team.
                    </p>
                </div>

                {admins.length === 0 ? (
                    <div className="mt-8 border border-[#dedbd3] bg-white px-6 py-16 text-center">
                        <p className="text-sm text-[#1d1d1d]/70">
                            No admins yet. Tap + to add the first account.
                        </p>
                    </div>
                ) : (
                    <ul className="mt-8 divide-y divide-[#dedbd3] border border-[#dedbd3] bg-white">
                        {admins.map((admin) => {
                            const menuOpen = menuOpenId === admin.id;
                            const isYou = auth.user?.id === admin.id;

                            return (
                                <li
                                    key={admin.id}
                                    className="flex items-center justify-between gap-4 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate font-heading text-2xl text-[#1d1d1d]">
                                                {admin.name}
                                            </p>
                                            {isYou && (
                                                <span className="rounded-md border border-[#2f4a3c]/20 bg-[#2f4a3c]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#2f4a3c] uppercase">
                                                    You
                                                </span>
                                            )}
                                            {admin.is_only_admin && (
                                                <span className="rounded-md border border-[#8a4b3b]/20 bg-[#8a4b3b]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#8a4b3b] uppercase">
                                                    Last admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-sm text-[#1d1d1d]/70">
                                            {admin.email}
                                        </p>
                                    </div>

                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            aria-label={`Actions for ${admin.name}`}
                                            aria-haspopup="menu"
                                            aria-expanded={menuOpen}
                                            onClick={() =>
                                                setMenuOpenId(
                                                    menuOpen ? null : admin.id,
                                                )
                                            }
                                            className="flex h-9 w-9 items-center justify-center border border-[#dedbd3] bg-white text-[#1d1d1d]/70 transition-colors hover:text-[#1d1d1d]"
                                        >
                                            <MoreVertical className="size-4" />
                                        </button>

                                        {menuOpen && (
                                            <div
                                                ref={menuRef}
                                                role="menu"
                                                className="absolute top-11 right-0 z-10 w-36 border border-[#dedbd3] bg-white p-1 shadow-lg"
                                            >
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#1d1d1d] transition-colors hover:bg-[#f8f7f3]"
                                                    onClick={() => {
                                                        setMenuOpenId(null);
                                                        setEditingAdmin(admin);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                {!admin.is_only_admin && (
                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#8a4b3b] transition-colors hover:bg-[#8a4b3b]/8"
                                                        onClick={() => {
                                                            setMenuOpenId(null);
                                                            setDeletingAdmin(
                                                                admin,
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    aria-label="Add admin"
                    className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1d1b] text-[#f8f7f3] shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#1f1d1b]/90 active:scale-95 sm:right-8 sm:bottom-8"
                >
                    <Plus className="size-6" strokeWidth={2.25} />
                </button>
            </div>

            {createOpen && (
                <PortalDialog
                    title="Add admin"
                    eyebrow="Team"
                    onClose={() => setCreateOpen(false)}
                >
                    <StaffForm
                        formKey="create-admin"
                        formProps={store.form()}
                        passwordRequired
                        submitLabel="Create admin"
                        onCancel={() => setCreateOpen(false)}
                        onSuccess={() => setCreateOpen(false)}
                    />
                </PortalDialog>
            )}

            {editingAdmin && (
                <PortalDialog
                    title={`Edit ${editingAdmin.name}`}
                    eyebrow="Team"
                    onClose={() => setEditingAdmin(null)}
                >
                    <StaffForm
                        formKey={`edit-admin-${editingAdmin.id}`}
                        formProps={update.form(editingAdmin.id)}
                        defaults={{
                            name: editingAdmin.name,
                            email: editingAdmin.email,
                        }}
                        submitLabel="Save changes"
                        onCancel={() => setEditingAdmin(null)}
                        onSuccess={() => setEditingAdmin(null)}
                    />
                </PortalDialog>
            )}

            {deletingAdmin && (
                <PortalDialog
                    title="Delete admin"
                    tone="danger"
                    onClose={() => setDeletingAdmin(null)}
                >
                    <p className="text-sm leading-relaxed text-[#1d1d1d]/80">
                        Delete{' '}
                        <span className="font-semibold text-[#1d1d1d]">
                            {deletingAdmin.name}
                        </span>
                        ? They will no longer be able to sign in. This cannot be
                        undone.
                    </p>

                    <Form
                        {...destroy.form(deletingAdmin.id)}
                        className="mt-6 flex flex-wrap items-center justify-end gap-3"
                        options={{ preserveScroll: true }}
                        onSuccess={() => setDeletingAdmin(null)}
                    >
                        {({ processing }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setDeletingAdmin(null)}
                                    className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 rounded-full bg-[#8a4b3b] px-6 text-xs font-semibold tracking-wide text-white uppercase transition-opacity disabled:opacity-50"
                                >
                                    {processing ? 'Deleting…' : 'Delete admin'}
                                </button>
                            </>
                        )}
                    </Form>
                </PortalDialog>
            )}
        </StaffLayout>
    );
}
