import { Form } from '@inertiajs/react';
import type { DiningTable } from '@/features/staff/types';
import { Button } from '@/shared/components/ui/button';

type ReservationFormFields = {
    table_id?: string;
    guest_name?: string;
    email?: string;
    phone?: string;
    party_size?: number;
    reserved_on?: string;
    starts_at?: string;
    notes?: string | null;
    status?: 'confirmed' | 'cancelled';
};

type ReservationFormProps = {
    formProps: {
        action: string;
        method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    };
    tables: DiningTable[];
    startTimes: string[];
    defaults?: ReservationFormFields;
    submitLabel: string;
    onCancel?: () => void;
    onSuccess?: () => void;
    formKey?: string;
    showStatus?: boolean;
};

export default function ReservationForm({
    formProps,
    tables,
    startTimes,
    defaults,
    submitLabel,
    onCancel,
    onSuccess,
    formKey,
    showStatus = false,
}: ReservationFormProps) {
    return (
        <Form
            key={formKey}
            {...formProps}
            className="space-y-4"
            options={{ preserveScroll: true }}
            onSuccess={() => onSuccess?.()}
        >
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="guest_name"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Guest name
                            </label>
                            <input
                                id="guest_name"
                                name="guest_name"
                                type="text"
                                required
                                defaultValue={defaults?.guest_name ?? ''}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.guest_name && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.guest_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                defaultValue={defaults?.email ?? ''}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Phone
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                required
                                defaultValue={defaults?.phone ?? ''}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.phone && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="reserved_on"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Date
                            </label>
                            <input
                                id="reserved_on"
                                name="reserved_on"
                                type="date"
                                required
                                defaultValue={defaults?.reserved_on ?? ''}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.reserved_on && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.reserved_on}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="starts_at"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Start time
                            </label>
                            <select
                                id="starts_at"
                                name="starts_at"
                                required
                                defaultValue={defaults?.starts_at ?? '19:00'}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            >
                                {startTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            {errors.starts_at && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.starts_at}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="party_size"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Party size
                            </label>
                            <input
                                id="party_size"
                                name="party_size"
                                type="number"
                                min={1}
                                max={50}
                                required
                                defaultValue={defaults?.party_size ?? 2}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.party_size && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.party_size}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="table_id"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Table
                            </label>
                            <select
                                id="table_id"
                                name="table_id"
                                required
                                defaultValue={defaults?.table_id ?? ''}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            >
                                <option value="" disabled>
                                    Select a table
                                </option>
                                {tables.map((table) => (
                                    <option key={table.id} value={table.id}>
                                        {table.name} · seats {table.capacity}
                                    </option>
                                ))}
                            </select>
                            {errors.table_id && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.table_id}
                                </p>
                            )}
                        </div>

                        {showStatus && (
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                                >
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={defaults?.status ?? 'confirmed'}
                                    className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="notes"
                                className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                            >
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                defaultValue={defaults?.notes ?? ''}
                                className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                            />
                            {errors.notes && (
                                <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                            >
                                Cancel
                            </button>
                        )}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-full bg-[#1f1d1b] px-6 text-xs font-semibold tracking-wide text-[#f8f7f3] uppercase disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : submitLabel}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
