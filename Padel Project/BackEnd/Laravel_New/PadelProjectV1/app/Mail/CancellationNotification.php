<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancellationNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $user;

    /**
     * Create a new message instance.
     *
     * @param $reservation
     * @param $user
     */
    public function __construct($reservation, $user)
    {
        $this->reservation = $reservation;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.cancellation')
                    ->subject('Reservation Cancellation')
                    ->with([
                        'reservation' => $this->reservation,
                        'user' => $this->user,
                    ]);
    }
}
