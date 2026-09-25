<?php

namespace App\Models;

use Database\Factories\TableFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $name
 * @property int $capacity
 * @property string|null $image_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'capacity', 'image_url'])]
class Table extends Model
{
    /** @use HasFactory<TableFactory> */
    use HasFactory, HasUuids;

    /**
     * @return HasMany<Reservation, $this>
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
