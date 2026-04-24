<?php

namespace App\Enums;

enum ItemStatus: string
{
    case IN_STORE = 'In-Store';
    case BORROWED = 'Borrowed';
    case DAMAGED = 'Damaged';
    case MISSING  = 'Missing';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}