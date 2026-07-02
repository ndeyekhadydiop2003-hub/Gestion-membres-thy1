<?php

namespace App\Jobs;

use App\Mail\MessageGroupeMail;
use App\Models\MessageGroupe;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class EnvoyerMessageGroupeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public MessageGroupe $message)
    {
    }

    public function handle(): void
    {
        $this->message->update(['statut' => 'envoye', 'envoye_le' => now()]);

        $this->message->destinataires()
            ->with('membre')
            ->where('statut', 'pending')
            ->chunk(50, function ($destinataires) {
                foreach ($destinataires as $destinataire) {
                    if (!$destinataire->membre || !$destinataire->membre->email) {
                        $destinataire->update(['statut' => 'echoue']);
                        continue;
                    }

                    try {
                        Mail::to($destinataire->membre->email)
                            ->send(new MessageGroupeMail($this->message, $destinataire->membre));

                        $destinataire->update(['statut' => 'envoye']);
                    } catch (\Throwable $e) {
                        $destinataire->update(['statut' => 'echoue']);
                    }
                }
            });
    }
}
