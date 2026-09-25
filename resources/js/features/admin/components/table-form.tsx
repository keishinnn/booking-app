import { Form } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';

type ImageOption = {
    value: string;
    label: string;
};

type TableFormFields = {
    name?: string;
    capacity?: number;
    image_url?: string | null;
};

type TableFormProps = {
    formProps: {
        action: string;
        method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    };
    imageOptions: ImageOption[];
    defaults?: TableFormFields;
    submitLabel: string;
    onCancel?: () => void;
    onSuccess?: () => void;
    cancelSlot?: ReactNode;
    formKey?: string;
};

export default function TableForm({
    formProps,
    imageOptions,
    defaults,
    submitLabel,
    onCancel,
    onSuccess,
    cancelSlot,
    formKey,
}: TableFormProps) {
    return (
        <Form
            key={formKey}
            {...formProps}
            className="space-y-5"
            options={{ preserveScroll: true }}
            onSuccess={() => onSuccess?.()}
        >
            {({ errors, processing }) => (
                <>
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                        >
                            Table name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            defaultValue={defaults?.name ?? ''}
                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="capacity"
                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                        >
                            Capacity
                        </label>
                        <input
                            id="capacity"
                            name="capacity"
                            type="number"
                            min={1}
                            max={50}
                            required
                            defaultValue={defaults?.capacity ?? 2}
                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                        />
                        {errors.capacity && (
                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                {errors.capacity}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="image_url"
                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                        >
                            Photo
                        </label>
                        <select
                            id="image_url"
                            name="image_url"
                            defaultValue={defaults?.image_url ?? ''}
                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                        >
                            <option value="">No photo</option>
                            {imageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.image_url && (
                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                {errors.image_url}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                        {onCancel ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-3 py-2 text-sm text-[#1d1d1d]/70 underline-offset-4 hover:underline"
                            >
                                Cancel
                            </button>
                        ) : (
                            cancelSlot
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
