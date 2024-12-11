<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva Cancelada</title>
</head>
<body>
    <div style="text-align: left; padding: 20px 0px;">
        <img src="https://api.padelconnect.pt/img/LogoCoresPadel_Final.png" style="max-width: 120px;">
        <h1 style="color: #57cc99;">PadelConnect</h1>
    </div>

    <h2 style="color: #57cc99;">Olá, {{ $user->username }}</h2>
    <p>Informamos que a sua reserva foi cancelada.</p>
    <p><strong>Detalhes da Reserva:</strong></p>
    <ul>
        <li><strong>Data de Início:</strong> {{ $reservation->start_date }}</li>
        <li><strong>Motivo do Cancelamento:</strong> {{ $reservation->cancellation->reason }}</li>
        <li><strong>Reembolso:</strong> €{{ $reservation->cancellation->total_refunded }}</li>
    </ul>

    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
        <p>Qualquer dúvida, entre em contacto com nossa equipa.</p>
    </div>

    <hr style="color: #57cc99; margin-top: 10px; margin-bottom: 10px">
    <p>Qualquer dúvida entre em contacto</p>
    <p>https://padelconnect.pt/</p>

    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
        <p>© 2024 PadelConnect</p>
    </div>
</body>
</html>
