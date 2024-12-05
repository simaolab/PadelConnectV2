<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservas Confirmadas</title>
</head>
<body>
    <div style="text-align: left; padding: 20px 0px;">
           <img src="https://api.padelconnect.pt/img/LogoCoresPadel_Final.png" style="max-width: 120px;">
        <h1 style="color: #57cc99;">PadelConnect</h1>
    </div>

    <h2 style="color: #57cc99;">Olá, {{ $user->username }}</h2>
    <p>Obrigado por realizar as suas reservas connosco. Aqui estão os detalhes:</p>

    @foreach ($reservations as $reservation)
          <hr style="color: #57cc99; margin-top: 10px; margin-bottom: 10px">
          <div style="padding: 15px 0px">
            <p><strong style="color: #1e1e1f">Data de Início:</strong> {{ $reservation->start_date ?? 'Data não disponível' }}</p>
            <p><strong style="color: #1e1e1f">Data de Término:</strong> {{ $reservation->end_date ?? 'Data não disponível' }}</p>

            <h3>Campos Reservados:</h3>
            @foreach ($reservation->detailed_fields as $detailedField)
                <p><strong style="color: #1e1e1f">Nome do Campo:</strong> {{ $detailedField['field']->name }}</p>
                <p><strong style="color: #1e1e1f">Tipo de Piso:</strong> {{ $detailedField['field']->type_floor }}</p>
                <p><strong style="color: #1e1e1f">Morada do Campo:</strong> {{ $detailedField['field']->company->address }}</p>
            @endforeach
          </div>
    @endforeach

    <hr style="color: #57cc99; margin-top: 10px; margin-bottom: 10px">
    <p>Qualquer dúvida entre em contacto</p>
    <p>https://padelconnect.pt/</p>


    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
        <p>© 2024 PadelConnect</p>
    </div>
</body>
</html>
