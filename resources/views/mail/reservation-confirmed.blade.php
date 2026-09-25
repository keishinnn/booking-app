<x-mail::message>
# You're booked

{{ $reservation->guest_name }}, your table is confirmed.

- **Table:** {{ $reservation->table?->name }}
- **Date:** {{ $reservation->reserved_on->format('l, j F Y') }}
- **Time:** {{ \Illuminate\Support\Str::of((string) $reservation->starts_at)->substr(0, 5) }}
- **Party:** {{ $reservation->party_size }}
- **Status:** {{ $reservation->status->value }}

This table is yours for two hours.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
