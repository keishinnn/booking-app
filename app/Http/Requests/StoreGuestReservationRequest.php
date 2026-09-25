<?php

namespace App\Http\Requests;

use App\Services\EnsuresTableAvailability;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StoreGuestReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('notes') === '') {
            $this->merge(['notes' => null]);
        }

        if (is_string($this->input('starts_at'))) {
            $this->merge([
                'starts_at' => app(EnsuresTableAvailability::class)
                    ->normalizeTime($this->string('starts_at')->toString()),
            ]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'table_id' => ['required', 'uuid', Rule::exists('tables', 'id')],
            'guest_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'party_size' => ['required', 'integer', 'min:1', 'max:50'],
            'reserved_on' => ['required', 'date'],
            'starts_at' => ['required', 'string', Rule::in(EnsuresTableAvailability::START_TIMES)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            try {
                app(EnsuresTableAvailability::class)->ensure(
                    tableId: $this->string('table_id')->toString(),
                    reservedOn: $this->string('reserved_on')->toString(),
                    startsAt: $this->string('starts_at')->toString(),
                    partySize: $this->integer('party_size'),
                );
            } catch (ValidationException $exception) {
                foreach ($exception->errors() as $field => $messages) {
                    foreach ($messages as $message) {
                        $validator->errors()->add($field, $message);
                    }
                }
            }
        });
    }
}
