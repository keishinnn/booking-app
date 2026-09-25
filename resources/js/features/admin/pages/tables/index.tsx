import { Form, Head } from '@inertiajs/react';
import { MoreVertical, Plus, Users, X } from 'lucide-react';
import {
    useEffect,
    useId,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import TableForm from '@/features/admin/components/table-form';
import type { DiningTable } from '@/features/staff/types';
import StaffLayout from '@/shared/layouts/staff-layout';
import { useLockBodyScroll } from '@/shared/lib/use-lock-body-scroll';
import { destroy, store, update } from '@/routes/admin/tables';

type ImageOption = {
    value: string;
    label: string;
};

type TablesIndexProps = {
    tables: DiningTable[];
    imageOptions: ImageOption[];
};

export default function AdminTablesIndex({
    tables,
    imageOptions,
}: TablesIndexProps) {
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<DiningTable | null>(null);
    const [deletingTable, setDeletingTable] = useState<DiningTable | null>(
        null,
    );
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpenId) {
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
            setEditingTable(null);
            setDeletingTable(null);
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <StaffLayout>
            <Head title="Tables | Halden Admin" />

            <div className="relative pb-24">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#2f4a3c] uppercase">
                        Catalog
                    </p>
                    <h2 className="mt-1 font-heading text-3xl text-[#1d1d1d]">
                        Dining tables
                    </h2>
                    <p className="mt-2 text-sm text-[#1d1d1d]/70">
                        Manage the tables used by the floor and booking flow.
                    </p>
                </div>

                {tables.length === 0 ? (
                    <div className="mt-8 border border-[#dedbd3] bg-white px-6 py-16 text-center">
                        <p className="text-sm text-[#1d1d1d]/70">
                            No tables yet. Tap + to add the first one.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {tables.map((table) => {
                            const menuOpen = menuOpenId === table.id;

                            return (
                                <article
                                    key={table.id}
                                    className="relative overflow-hidden border border-[#dedbd3] bg-white"
                                >
                                    <div className="absolute top-3 right-3 z-10">
                                        <button
                                            type="button"
                                            aria-label={`Actions for ${table.name}`}
                                            aria-haspopup="menu"
                                            aria-expanded={menuOpen}
                                            onClick={() =>
                                                setMenuOpenId(
                                                    menuOpen ? null : table.id,
                                                )
                                            }
                                            className="flex h-9 w-9 items-center justify-center border border-[#dedbd3]/80 bg-white/95 text-[#1d1d1d]/70 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#1d1d1d]"
                                        >
                                            <MoreVertical className="size-4" />
                                        </button>

                                        {menuOpen && (
                                            <div
                                                ref={menuRef}
                                                role="menu"
                                                className="absolute top-11 right-0 w-36 border border-[#dedbd3] bg-white p-1 shadow-lg"
                                            >
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    className="flex w-full px-3 py-2 text-left text-xs font-medium text-[#1d1d1d] transition-colors hover:bg-[#f8f7f3]"
                                                    onClick={() => {
                                                        setMenuOpenId(null);
                                                        setEditingTable(table);
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
                                                        setDeletingTable(table);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="aspect-[4/3] bg-[#f8f7f3]">
                                        {table.image_url ? (
                                            <img
                                                src={table.image_url}
                                                alt={table.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs tracking-widest text-[#1d1d1d]/40 uppercase">
                                                No photo
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-heading text-2xl text-[#1d1d1d]">
                                                {table.name}
                                            </h3>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1d1d1d]/70">
                                                <Users className="size-3.5" />
                                                Seats {table.capacity}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    aria-label="Add table"
                    className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1d1b] text-[#f8f7f3] shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#1f1d1b]/90 active:scale-95 sm:right-8 sm:bottom-8"
                >
                    <Plus className="size-6" strokeWidth={2.25} />
                </button>
            </div>

            {createOpen && (
                <Modal
                    title="Add table"
                    onClose={() => setCreateOpen(false)}
                >
                    <TableForm
                        formKey="create-table"
                        formProps={store.form()}
                        imageOptions={imageOptions}
                        submitLabel="Create table"
                        onCancel={() => setCreateOpen(false)}
                        onSuccess={() => setCreateOpen(false)}
                    />
                </Modal>
            )}

            {editingTable && (
                <Modal
                    title={`Edit ${editingTable.name}`}
                    onClose={() => setEditingTable(null)}
                >
                    <TableForm
                        formKey={`edit-table-${editingTable.id}`}
                        formProps={update.form(editingTable.id)}
                        imageOptions={imageOptions}
                        defaults={{
                            name: editingTable.name,
                            capacity: editingTable.capacity,
                            image_url: editingTable.image_url,
                        }}
                        submitLabel="Save changes"
                        onCancel={() => setEditingTable(null)}
                        onSuccess={() => setEditingTable(null)}
                    />
                </Modal>
            )}

            {deletingTable && (
                <Modal
                    title="Delete table"
                    tone="danger"
                    onClose={() => setDeletingTable(null)}
                >
                    <p className="text-sm leading-relaxed text-[#1d1d1d]/80">
                        Delete{' '}
                        <span className="font-semibold text-[#1d1d1d]">
                            {deletingTable.name}
                        </span>
                        ? This cannot be undone. Tables with reservations cannot
                        be removed.
                    </p>

                    <Form
                        {...destroy.form(deletingTable.id)}
                        className="mt-6 flex flex-wrap items-center justify-end gap-3"
                        options={{ preserveScroll: true }}
                        onSuccess={() => setDeletingTable(null)}
                    >
                        {({ processing }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setDeletingTable(null)}
                                    className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 rounded-full bg-[#8a4b3b] px-6 text-xs font-semibold tracking-wide text-white uppercase transition-opacity disabled:opacity-50"
                                >
                                    {processing ? 'Deleting…' : 'Delete table'}
                                </button>
                            </>
                        )}
                    </Form>
                </Modal>
            )}
        </StaffLayout>
    );
}

function Modal({
    title,
    children,
    onClose,
    tone = 'default',
}: {
    title: string;
    children: ReactNode;
    onClose: () => void;
    tone?: 'default' | 'danger';
}) {
    const titleId = useId();

    useLockBodyScroll();

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
                className="relative z-10 w-full max-w-lg border border-[#dedbd3] bg-white shadow-2xl sm:max-h-[90vh] sm:overflow-y-auto"
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
                            {tone === 'danger' ? 'Danger zone' : 'Catalog'}
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
