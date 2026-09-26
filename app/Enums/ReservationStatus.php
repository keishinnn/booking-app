<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Confirmed = 'confirmed';
    case Seated = 'seated';
    case Completed = 'completed';
    case NoShow = 'no_show';
    case Cancelled = 'cancelled';

    /**
     * @return list<self>
     */
    public static function blocking(): array
    {
        return [self::Confirmed, self::Seated];
    }
}
