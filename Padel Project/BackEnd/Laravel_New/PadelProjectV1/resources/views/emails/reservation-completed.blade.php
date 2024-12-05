<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservas Confirmadas</title>
</head>
<body>
    <h1>Olá, {{ $user->username }}</h1>
    <p>Obrigado por realizar suas reservas connosco. Aqui estão os detalhes:</p>

    @foreach ($reservations as $reservation)
        <p><strong>Data de Início:</strong> {{ $reservation->start_date }}</p>
        <p><strong>Data de Término:</strong> {{ $reservation->end_date }}</p>
        <p><strong>Status:</strong> {{ $reservation->status }}</p>

        <h3>Campo Reservado:</h3>
        @foreach ($reservation->detailed_fields as $detailedField)
            <p><strong>Nome do Campo:</strong> {{ $detailedField['field']->name }}</p>
            <p><strong>Tipo de Piso:</strong> {{ $detailedField['field']->type_floor }}</p>
            <p><strong>Morada do campo:</strong> {{ $detailedField['field']->company->address }}</p>
            <p><strong>Data da Reserva:</strong> {{ $detailedField['pivot']['start_date'] }} até {{ $detailedField['pivot']['end_date'] }}</p>
        @endforeach
    @endforeach
</body>
</html>
