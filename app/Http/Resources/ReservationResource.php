<?php

namespace App\Http\Resources;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Reservation
 */
class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $startsAt = substr((string) $this->starts_at, 0, 5);

        return [
            'id' => $this->id,
            'table_id' => $this->table_id,
            'table' => $this->whenLoaded('table', fn () => [
                'id' => $this->table->id,
                'name' => $this->table->name,
                'capacity' => $this->table->capacity,
            ]),
            'guest_name' => $this->guest_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'party_size' => $this->party_size,
            'reserved_on' => $this->reserved_on?->format('Y-m-d'),
            'starts_at' => $startsAt,
            'status' => $this->status->value,
            'notes' => $this->notes,
            'service' => ((int) substr($startsAt, 0, 2)) < 15 ? 'Lunch' : 'Dinner',
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
