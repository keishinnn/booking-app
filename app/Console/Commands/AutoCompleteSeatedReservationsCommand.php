<?php

namespace App\Console\Commands;

use App\Services\AutoCompletesSeatedReservations;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('reservations:auto-complete-seated')]
#[Description('Mark seated reservations as completed once their 2-hour window has ended')]
class AutoCompleteSeatedReservationsCommand extends Command
{
    public function handle(AutoCompletesSeatedReservations $autoCompletes): int
    {
        $completed = $autoCompletes->handle();

        $this->info("Completed {$completed} seated reservation(s).");

        return self::SUCCESS;
    }
}
