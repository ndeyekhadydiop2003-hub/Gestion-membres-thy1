import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Search, Users, Lock, Pencil } from 'lucide-react';
import { presencesApi } from '../presences/presencesApi';
import { programmesApi } from './programmesApi';
import SeanceFormModal from './SeanceFormModal';
import { useToast } from '../../context/ToastContext';

const OPTIONS = [
  { valeur: 'present', label: 'Présent' },
  { valeur: 'absent', label: 'Absent' },
  { valeur: 'excuse', label: 'Excusé' },
];

const COULEURS = {
  present: 'bg-green-100 text-green-700',
  absent: 'bg-red-100 text-red-700',
  excuse: 'bg-amber-100 text-amber-700',
};

export default function SeanceDetailPage({ seance: seanceInitiale, programme, onRetour }) {
  const { showToast } = useToast();
  const [seance, setSeance] = useState(seanceInitiale);
  const [membres, setMembres] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [modalModifierOuvert, setModalModifierOuvert] = useState(false);
  const [enCoursDeMarquage, setEnCoursDeMarquage] = useState(null);

  const charger = useCallback(() => {
    setChargement(true);
    presencesApi.membresAvecPresence(seance.id, recherche).then((r) => {
      setMembres(r.data);
    }).finally(() => setChargement(false));
  }, [seance.id, recherche]);

  useEffect(() => { charger(); }, [charger]);

  const marquer = async (membreId, statut) => {
    const membre = membres.find((m) => m.id === membreId);
    if (membre?.statut_presence) return;

    setEnCoursDeMarquage(membreId);
    setMembres((prev) => prev.map((m) => (m.id === membreId ? { ...m, statut_presence: statut } : m)));
    try {
      await presencesApi.marquer(seance.id, membreId, statut);
      showToast(`Présence enregistrée pour ${membre.nom} ${membre.prenom}.`);
    } catch (err) {
      alert(err.donnees?.message || err.message);
      charger();
    } finally {
      setEnCoursDeMarquage(null);
    }
  };

  // On reste sur cette page après modification de la séance : on rafraîchit juste ses infos.
  const apresModificationSeance = async () => {
    setModalModifierOuvert(false);
    try {
      const r = await programmesApi.obtenirSeance(seance.id);
      setSeance(r.data);
    } catch {
      // pas grave si le rafraîchissement échoue, la modification est déjà enregistrée
    }
    
  };

  const presents = membres.filter((m) => m.statut_presence === 'present').length;
  const absents = membres.filter((m) => m.statut_presence === 'absent').length;
  const excuses = membres.filter((m) => m.statut_presence === 'excuse').length;

  const dateFormatee = new Date(seance.date_seance).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const moisAnnee = new Date(seance.date_seance).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <span>{programme.nom}</span> <span>›</span> <span>Séance</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{programme.nom} — {moisAnnee}</h1>
            <button
              onClick={() => setModalModifierOuvert(true)}
              className="text-slate-400 hover:text-[#2c4f7c] p-1"
              title="Modifier la séance"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1 capitalize">
            {dateFormatee}
            {seance.heure_debut && ` · ${seance.heure_debut.slice(0, 5)}`}
            {seance.heure_fin && ` – ${seance.heure_fin.slice(0, 5)}`}
            {seance.lieu && ` · ${seance.lieu}`}
          </p>
        </div>
        <button onClick={onRetour} className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-2.5">
        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          Chaque présence, absence ou excusé marquée est <strong>définitive</strong> et ne peut plus être modifiée, pour garantir la traçabilité des données.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">Présents</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{presents}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">Absents</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{absents}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">Excusés</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{excuses}</p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un membre..."
            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/20"
          />
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Users className="w-4 h-4" /> {membres.length} membres
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 font-medium">Membre</th>
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Profession</th>
              <th className="px-5 py-3 font-medium text-right">Présence</th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Chargement...</td></tr>
            ) : membres.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Aucun membre trouvé.</td></tr>
            ) : (
              membres.map((m) => {
                const dejaMarque = !!m.statut_presence;
                return (
                  <tr key={m.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2c4f7c]/10 flex items-center justify-center text-xs font-medium text-[#2c4f7c] shrink-0">
                          {m.nom?.[0]}{m.prenom?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{m.nom} {m.prenom}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{m.identifiant}</td>
                    <td className="px-5 py-3 text-slate-600">{m.profession || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end items-center gap-1.5">
                        {dejaMarque && <Lock className="w-3.5 h-3.5 text-slate-300 mr-1" />}
                        {OPTIONS.map((o) => (
                          <button
                            key={o.valeur}
                            disabled={dejaMarque || enCoursDeMarquage === m.id}
                            onClick={() => marquer(m.id, o.valeur)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                              m.statut_presence === o.valeur
                                ? COULEURS[o.valeur]
                                : dejaMarque
                                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalModifierOuvert && (
        <SeanceFormModal
          seance={seance}
          onFermer={() => setModalModifierOuvert(false)}
          onEnregistre={apresModificationSeance}
        />
      )}
    </div>
  );
}