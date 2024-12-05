<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationCompleted extends Mailable
{
    use Queueable, SerializesModels;

    public $reservations;
    public $user;

    /**
     * Create a new message instance.
     *
     * @param array $reservations
     * @param \App\Models\User $user
     */
    public function __construct($reservations, $user)
    {
        $this->reservations = $reservations;
        $this->user = $user; // Recebe o usuário autenticado
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.reservation-completed')
                    ->subject('Confirmação de Reserva')
                    ->with([
                        'reservations' => $this->reservations,
                        'user' => $this->user, // Passa o usuário para a view
                    ]);
    }
}
