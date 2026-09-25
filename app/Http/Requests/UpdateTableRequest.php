<?php

namespace App\Http\Requests;

use App\Models\Table;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('table')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('image_url') === '') {
            $this->merge(['image_url' => null]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Table $table */
        $table = $this->route('table');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tables', 'name')->ignore($table->id),
            ],
            'capacity' => ['required', 'integer', 'min:1', 'max:50'],
            'image_url' => ['nullable', 'string', 'max:2048'],
        ];
    }
}
