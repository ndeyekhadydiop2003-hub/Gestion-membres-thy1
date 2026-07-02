import { useEffect, useState } from 'react';
import { X, Phone, Mail, Calendar, Droplet, IdCard, ShieldCheck } from 'lucide-react';
import { membresApi } from './membresApi';

export default function MembreDetailModal({ membreId, onFermer }) {
  const [membre, setMembre] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [photoAgrandie, setPhotoAgrandie] = useState(false);

  useEffect(() => {
    membresApi.obtenir(membreId).then((r) => setMembre(r.data)).finally(() => setChargement(false));
  }, [membreId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Fiche membre</h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {chargement ? (
          <p className="p-6 text-slate-400 text-sm">Chargement...</p>
        ) : !membre ? (
          <p className="p-6 text-red-600 text-sm">Membre introuvable.</p>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => membre.photo_url && setPhotoAgrandie(true)}
                className={`w-16 h-16 rounded-full bg-[#2c4f7c]/10 flex items-center justify-center text-lg font-semibold text-[#2c4f7c] overflow-hidden shrink-0 ${
                  membre.photo_url ? 'cursor-pointer hover:opacity-80 transition' : ''
                }`}
                disabled={!membre.photo_url}
              >
                {membre.photo_url ? (
                  <img src={membre.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  `${membre.nom?.[0] ?? ''}${membre.prenom?.[0] ?? ''}`
                )}
              </button>
              <div>
                <p className="text-lg font-semibold text-slate-900">{membre.nom} {membre.prenom}</p>
                <p className="text-slate-400 text-sm">{membre.identifiant} · {membre.age ? `${membre.age} ans` : 'Âge non renseigné'}</p>
                <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  membre.statut === 'actif' ? 'bg-green-50 text-green-700' : membre.statut === 'inactif' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'
                }`}>
                  {membre.statut === 'actif' ? 'Actif' : membre.statut === 'inactif' ? 'Inactif' : 'Suspendu'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Info icone={Phone} label="Téléphone" valeur={membre.telephone} />
              <Info icone={Mail} label="Email" valeur={membre.email} />
              <Info icone={Calendar} label="Adhésion" valeur={membre.date_adhesion} />
              <Info label="Profession" valeur={membre.profession} />
              <Info label="Niveau" valeur={membre.niveau} />
              <Info label="Groupe" valeur={membre.groupe?.nom} />
            </div>

            {membre.donnees_sensibles ? (
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#2c4f7c]" />
                  <p className="text-sm font-semibold text-slate-700">Données sensibles</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Info icone={IdCard} label="NIN" valeur={membre.donnees_sensibles.nin} />
                  <Info icone={IdCard} label="N° électeur" valeur={membre.donnees_sensibles.numero_electeur} />
                  <Info icone={Droplet} label="Groupe sanguin" valeur={membre.donnees_sensibles.groupe_sanguin} />
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400 italic">
                  Données sensibles non visibles avec votre rôle actuel.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {photoAgrandie && membre?.photo_url && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-6"
          onClick={() => setPhotoAgrandie(false)}
        >
          <button
            onClick={() => setPhotoAgrandie(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white"
          >
            <X className="w-7 h-7" />
          </button>
          <img
            src={membre.photo_url}
            alt={`${membre.nom} ${membre.prenom}`}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function Info({ icone: Icone, label, valeur }) {
  return (
    <div>
      <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-0.5">
        {Icone && <Icone className="w-3.5 h-3.5" />} {label}
      </p>
      <p className="text-slate-800 font-medium">{valeur || '—'}</p>
    </div>
  );
}