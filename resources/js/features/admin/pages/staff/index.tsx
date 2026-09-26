import { Form, Head } from '@inertiajs/react';
import { MoreVertical, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import StaffForm from '@/features/admin/components/staff-form';
import PortalDialog from '@/shared/components/portal-dialog';
import StaffLayout from '@/shared/layouts/staff-layout';
import { destroy, store, update } from '@/routes/admin/staff';

type StaffMember = {
    id: number;
    name: string;
    email: string;
};

type StaffIndexProps = {
    staff: StaffMember[];
};

export default function AdminStaffIndex({ staff }: StaffIndexProps) {
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(
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
            setEditingStaff(null);
            setDeletingStaff(null);
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <StaffLayout>
            <Head title="Staff | Halden Admin" />

            <div className="relative pb-24">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        Team
                    </p>
                    <h2 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                        Floor staff
                    </h2>
                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                        Manage the accounts that sign in to the floor.
                    </p>
                </div>

                {staff.length === 0 ? (
                    <div className="mt-8 border border-[#dedbd3] bg-white px-6 py-16 text-center">
                        <p className="text-sm text-[#1d1d1d]/70">
                            No staff yet. Tap + to add the first account.
                        </p>
                    </div>
                ) : (
                    <ul className="mt-8 divide-y divide-[#dedbd3] border border-[#dedbd3] bg-white">
                        {staff.map((member) => {
                            const menuOpen = menuOpenId === member.id;

                            return (
                                <li
                                    key={member.id}
                                    className="flex items-center justify-between gap-4 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-heading text-2xl text-[#1d1d1d]">
                                            {member.name}
                                        </p>
                                        <p className="truncate text-sm text-[#1d1d1d]/70">
                                            {member.email}
                                        </p>
                                    </div>

                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            aria-label={`Actions for ${member.name}`}
                                            aria-haspopup="menu"
                                            aria-expanded={menuOpen}
                                            onClick={() =>
                                                setMenuOpenId(
                                                    menuOpen
                                                        ? null
                                                        : member.id,
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
                                                        setEditingStaff(member);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#8a4b3b] transition-colors hover:bg-[#8a4b3b]/8"
                                                    onClick={() => {
                                                        setMenuOpenId(null);
                                                        setDeletingStaff(
                                                            member,
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
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
                    aria-label="Add staff"
                    className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1d1b] text-[#f8f7f3] shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#1f1d1b]/90 active:scale-95 sm:right-8 sm:bottom-8"
                >
                    <Plus className="size-6" strokeWidth={2.25} />
                </button>
            </div>

            {createOpen && (
                <PortalDialog
                    title="Add staff"
                    eyebrow="Team"
                    onClose={() => setCreateOpen(false)}
                >
                    <StaffForm
                        formKey="create-staff"
                        formProps={store.form()}
                        passwordRequired
                        submitLabel="Create staff"
                        onCancel={() => setCreateOpen(false)}
                        onSuccess={() => setCreateOpen(false)}
                    />
                </PortalDialog>
            )}

            {editingStaff && (
                <PortalDialog
                    title={`Edit ${editingStaff.name}`}
                    eyebrow="Team"
                    onClose={() => setEditingStaff(null)}
                >
                    <StaffForm
                        formKey={`edit-staff-${editingStaff.id}`}
                        formProps={update.form(editingStaff.id)}
                        defaults={{
                            name: editingStaff.name,
                            email: editingStaff.email,
                        }}
                        submitLabel="Save changes"
                        onCancel={() => setEditingStaff(null)}
                        onSuccess={() => setEditingStaff(null)}
                    />
                </PortalDialog>
            )}

            {deletingStaff && (
                <PortalDialog
                    title="Delete staff"
                    tone="danger"
                    onClose={() => setDeletingStaff(null)}
                >
                    <p className="text-sm leading-relaxed text-[#1d1d1d]/80">
                        Delete{' '}
                        <span className="font-semibold text-[#1d1d1d]">
                            {deletingStaff.name}
                        </span>
                        ? They will no longer be able to sign in. This cannot
                        be undone.
                    </p>

                    <Form
                        {...destroy.form(deletingStaff.id)}
                        className="mt-6 flex flex-wrap items-center justify-end gap-3"
                        options={{ preserveScroll: true }}
                        onSuccess={() => setDeletingStaff(null)}
                    >
                        {({ processing }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setDeletingStaff(null)}
                                    className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 rounded-full bg-[#8a4b3b] px-6 text-xs font-semibold tracking-wide text-white uppercase transition-opacity disabled:opacity-50"
                                >
                                    {processing ? 'Deleting…' : 'Delete staff'}
                                </button>
                            </>
                        )}
                    </Form>
                </PortalDialog>
            )}
        </StaffLayout>
    );
}
