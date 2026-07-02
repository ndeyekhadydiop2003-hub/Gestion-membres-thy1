<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $message_groupe_id
 * @property int $membre_id
 * @property string $statut
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Membre|null $membre
 * @property-read \App\Models\MessageGroupe $messageGroupe
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage whereMembreId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage whereMessageGroupeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DestinataireMessage whereUpdatedAt($value)
 */
	class DestinataireMessage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $membre_id
 * @property string $nin
 * @property string|null $numero_electeur
 * @property string|null $groupe_sanguin
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Membre|null $membre
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereGroupeSanguin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereMembreId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereNin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereNumeroElecteur($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DonneeSensibleMembre whereUpdatedAt($value)
 */
	class DonneeSensibleMembre extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $nom
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Membre> $membres
 * @property-read int|null $membres_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MessageGroupe> $messagesGroupes
 * @property-read int|null $messages_groupes_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Groupe whereUpdatedAt($value)
 */
	class Groupe extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\User|null $utilisateur
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistoriqueOperation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistoriqueOperation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|HistoriqueOperation query()
 */
	class HistoriqueOperation extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $sujet
 * @property-read \App\Models\User|null $utilisateur
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalActivite newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalActivite newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalActivite query()
 */
	class JournalActivite extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $nom
 * @property string $prenom
 * @property string $sexe
 * @property \Illuminate\Support\Carbon|null $date_naissance
 * @property string|null $niveau
 * @property string|null $profession
 * @property string|null $telephone
 * @property string|null $email
 * @property \Illuminate\Support\Carbon $date_adhesion
 * @property string|null $photo_chemin
 * @property int|null $groupe_id
 * @property int $cree_par
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $createur
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DestinataireMessage> $destinatairesMessages
 * @property-read int|null $destinataires_messages_count
 * @property-read \App\Models\DonneeSensibleMembre|null $donneesSensibles
 * @property-read int|null $age
 * @property-read \App\Models\Groupe|null $groupe
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Presence> $presences
 * @property-read int|null $presences_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereCreePar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereDateAdhesion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereDateNaissance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereGroupeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereNiveau($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre wherePhotoChemin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre wherePrenom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereProfession($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereSexe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Membre withoutTrashed()
 */
	class Membre extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $expediteur_id
 * @property string $sujet
 * @property string $contenu
 * @property string $type_cible
 * @property int|null $groupe_id
 * @property string $statut
 * @property \Illuminate\Support\Carbon|null $envoye_le
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DestinataireMessage> $destinataires
 * @property-read int|null $destinataires_count
 * @property-read \App\Models\User $expediteur
 * @property-read \App\Models\Groupe|null $groupe
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereContenu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereEnvoyeLe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereExpediteurId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereGroupeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereSujet($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereTypeCible($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageGroupe whereUpdatedAt($value)
 */
	class MessageGroupe extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\User|null $marqueur
 * @property-read \App\Models\Membre|null $membre
 * @property-read \App\Models\Seance|null $seance
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presence newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presence newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Presence query()
 */
	class Presence extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\User|null $createur
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Seance> $seances
 * @property-read int|null $seances_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Programme newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Programme newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Programme query()
 */
	class Programme extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read int $nombre_absents
 * @property-read int $nombre_presents
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Presence> $presences
 * @property-read int|null $presences_count
 * @property-read \App\Models\Programme|null $programme
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seance query()
 */
	class Seance extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $nom
 * @property string $email
 * @property string $password
 * @property string $role
 * @property string|null $secret_2fa
 * @property \Illuminate\Support\Carbon|null $confirmation_2fa_le
 * @property \Illuminate\Support\Carbon|null $derniere_connexion_le
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\JournalActivite> $journauxActivite
 * @property-read int|null $journaux_activite_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Membre> $membresCrees
 * @property-read int|null $membres_crees_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MessageGroupe> $messagesEnvoyes
 * @property-read int|null $messages_envoyes_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereConfirmation2faLe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDerniereConnexionLe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereSecret2fa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

