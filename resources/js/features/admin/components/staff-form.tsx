import { Form } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';

type StaffFormFields = {
    name?: string;
    email?: string;
};

type StaffFormProps = {
    formProps: {
        action: string;
        method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    };
    defaults?: StaffFormFields;
    passwordRequired?: boolean;
    submitLabel: string;
    onCancel?: () => void;
    onSuccess?: () => void;
    cancelSlot?: ReactNode;
    formKey?: string;
};

export default function StaffForm({
    formProps,
    defaults,
    passwordRequired = false,
    submitLabel,
    onCancel,
    onSuccess,
    cancelSlot,
    formKey,
}: StaffFormProps) {
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
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
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
                            autoComplete="email"
                            defaultValue={defaults?.email ?? ''}
                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                        >
                            {passwordRequired ? 'Password' : 'New password'}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required={passwordRequired}
                            autoComplete="new-password"
                            minLength={passwordRequired ? 8 : undefined}
                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                        />
                        {!passwordRequired && (
                            <p className="mt-1.5 text-xs text-[#1d1d1d]/55">
                                Leave blank to keep the current password.
                            </p>
                        )}
                        {errors.password && (
                            <p className="mt-1.5 text-xs font-medium text-[#8a4b3b]">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="mb-2 block text-xs font-semibold tracking-wider text-[#1d1d1d]/80 uppercase"
                        >
                            Confirm password
                        </label>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required={passwordRequired}
                            autoComplete="new-password"
                            className="w-full border border-[#dedbd3] bg-[#f8f7f3]/50 px-4 py-3 text-sm text-[#1d1d1d] focus:border-[#1d1d1d] focus:bg-white focus:outline-none"
                        />
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
