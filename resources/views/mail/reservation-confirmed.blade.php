<x-mail::message>
{{ $reservation->guest_name }}, your table is booked.

{{ $reservation->table?->name }} · {{ $reservation->reserved_on->format('l, j F Y') }} · {{ \Illuminate\Support\Str::of((string) $reservation->starts_at)->substr(0, 5) }} · party of {{ $reservation->party_size }}

We will hold it for two hours.

Halden
</x-mail::message>
