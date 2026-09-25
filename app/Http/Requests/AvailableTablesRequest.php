<?php

namespace App\Http\Requests;

use App\Services\EnsuresTableAvailability;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AvailableTablesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
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
            'date' => ['required', 'date'],
            'party_size' => ['required', 'integer', 'min:1', 'max:50'],
            'starts_at' => ['required', 'string', Rule::in(EnsuresTableAvailability::START_TIMES)],
        ];
    }
}
