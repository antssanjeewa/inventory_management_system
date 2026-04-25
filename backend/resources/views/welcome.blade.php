<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    <style>
        body {
            background: black;
            color: white;
            display: grid;
            place-items: center;
            height: 90vh;
            font-size: 40px;
            font-family: 'Instrument Sans', sans-serif;
        }
    </style>
</head>

<body>
    <div>Ceyntics ERP — Inventory Management System</div>
</body>

</html>