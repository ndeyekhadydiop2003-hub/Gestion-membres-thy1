<?php

namespace App\Mail;

use App\Models\Membre;
use App\Models\MessageGroupe;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MessageGroupeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public MessageGroupe $messageGroupe,
        public Membre $membre
    ) {
    }

    public function build()
    {
        return $this->subject($this->messageGroupe->sujet)
            ->view('emails.message-groupe')
            ->with([
                'contenu' => $this->messageGroupe->contenu,
                'prenom' => $this->membre->prenom,
            ]);
    }
}
