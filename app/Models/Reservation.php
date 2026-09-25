<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $table_id
 * @property string $guest_name
 * @property string $email
 * @property string $phone
 * @property int $party_size
 * @property Carbon $reserved_on
 * @property string $starts_at
 * @property ReservationStatus $status
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Table $table
 */
#[Fillable([
    'table_id',
    'guest_name',
    'email',
    'phone',
    'party_size',
    'reserved_on',
    'starts_at',
    'status',
    'notes',
])]
class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reserved_on' => 'date',
            'party_size' => 'integer',
            'status' => ReservationStatus::class,
        ];
    }

    /**
     * @return BelongsTo<Table, $this>
     */
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }
}
