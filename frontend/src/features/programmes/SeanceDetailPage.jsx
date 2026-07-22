import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Search, Users, Pencil, UserPlus, X, PieChart } from 'lucide-react';
import { presencesApi } from '../presences/presencesApi';
import { programmesApi } from './programmesApi';
import SeanceFormModal from './SeanceFormModal';
import { useToast } from '../../context/ToastContext';

const OPTIONS = [
  { valeur: 'present', label: 'Présent' },
  { valeur: 'absent', label: 'Absent' },
];

const COULEURS = {
  present: 'bg-green-100 text-green-700',
  absent: 'bg-red-100 text-red-700',
};

const SECTIONS = [
  { valeur: '1', label: 'Section 1 (< 13 ans)' },
  { valeur: '2', label: 'Section 2 (13 - 17 ans)' },
  { valeur: '3', label: 'Section 3 (18 ans et +)' },
];

const LIGNES_REPARTITION = [
  { cle: '1', label: 'Section 1 — moins de 13 ans' },
  { cle: '2', label: 'Section 2 — 13 à 17 ans' },
  { cle: '3', label: 'Section 3 — 18 ans et plus' },
];

export default function SeanceDetailPage({ seance: seanceInitiale, programme, onRetour }) {
  const { showToast } = useToast();
  const [seance, setSeance] = useState(seanceInitiale);
  const [membres, setMembres] = useState([]);
  const [autres, setAutres] = useState([]);
  const [repartition, setRepartition] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [modalModifierOuvert, setModalModifierOuvert] = useState(false);
  const [enCoursDeMarquage, setEnCoursDeMarquage] = useState(null);

  // Formulaire d'ajout d'un participant "autre"
  const [nomAutre, setNomAutre] = useState('');
  const [sectionAutre, setSectionAutre] = useState('3');
  const [sexeAutre, setSexeAutre] = useState('M');
  const [ajoutEnCours, setAjoutEnCours] = useState(false);

  const charger = useCallback(() => {
    setChargement(true);
    presencesApi.membresAvecPresence(seance.id, recherche).then((r) => {
      setMembres(r.data);
      setAutres(r.autres || []);
      setRepartition(r.repartition || null);
    }).finally(() => setChargement(false));
  }, [seance.id, recherche]);

  useEffect(() => { charger(); }, [charger]);

  // Marquer (ou changer) le statut d'un membre — modifiable à tout moment
  const marquer = async (membreId, statut) => {
    const membre = membres.find((m) => m.id === membreId);

    setEnCoursDeMarquage(membreId);
    setMembres((prev) => prev.map((m) => (m.id === membreId ? { ...m, statut_presence: statut } : m)));
    try {
      await presencesApi.marquer(seance.id, membreId, statut);
      showToast(`Présence mise à jour pour ${membre.nom} ${membre.prenom}.`);
      charger(); // pour rafraîchir la répartition
    } catch (err) {
      showToast(err.donnees?.message || err.message, 'error');
      charger();
    } finally {
      setEnCoursDeMarquage(null);
    }
  };

  const ajouterAutre = async (e) => {
    e.preventDefault();
    if (!nomAutre.trim()) return;
    setAjoutEnCours(true);
    try {
      await presencesApi.ajouterAutre(seance.id, nomAutre.trim(), sectionAutre, sexeAutre);
      setNomAutre('');
      charger();
      showToast('Participant ajouté avec succès.');
    } catch (err) {
      showToast(err.donnees?.message || err.message, 'error');
    } finally {
      setAjoutEnCours(false);
    }
  };

  const retirerAutre = async (presenceId) => {
    if (!confirm('Retirer ce participant de la séance ?')) return;
    try {
      await presencesApi.supprimerAutre(seance.id, presenceId);
      charger();
    } catch (err) {
      showToast(err.donnees?.message || err.message, 'error');
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

  const presentsMembres = membres.filter((m) => m.statut_presence === 'present').length;
  const absents = membres.filter((m) => m.statut_presence === 'absent').length;
  const presents = presentsMembres + autres.length; // les "autres" comptent toujours comme présents

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

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">Présents</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{presents}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">Absents</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{absents}</p>
        </div>
      </div>

      {/* Répartition Section × Sexe des présents */}
      {repartition && (
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4.5 h-4.5 text-[#2c4f7c]" />
            <h2 className="font-semibold text-slate-900">Répartition des présents</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="py-2 font-medium">Section</th>
                <th className="py-2 font-medium text-center">Hommes</th>
                <th className="py-2 font-medium text-center">Femmes</th>
                <th className="py-2 font-medium text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {LIGNES_REPARTITION.map((ligne) => {
                const h = repartition[ligne.cle]?.M ?? 0;
                const f = repartition[ligne.cle]?.F ?? 0;
                return (
                  <tr key={ligne.cle} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 text-slate-700">{ligne.label}</td>
                    <td className="py-2.5 text-center text-slate-600">{h}</td>
                    <td className="py-2.5 text-center text-slate-600">{f}</td>
                    <td className="py-2.5 text-center font-medium text-slate-900">{h + f}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
              membres.map((m) => (
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
                      {OPTIONS.map((o) => (
                        <button
                          key={o.valeur}
                          disabled={enCoursDeMarquage === m.id}
                          onClick={() => marquer(m.id, o.valeur)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            m.statut_presence === o.valeur
                              ? COULEURS[o.valeur]
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Participants "autres" — présents à la séance mais absents de la base des membres */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-4.5 h-4.5 text-[#2c4f7c]" />
          <h2 className="font-semibold text-slate-900">Autres participants</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Personnes ayant assisté à la séance mais qui ne sont pas enregistrées comme membres.
          Elles sont automatiquement comptées comme présentes et incluses dans la répartition ci-dessus.
        </p>

        <form onSubmit={ajouterAutre} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 mb-4">
          <input
            value={nomAutre}
            onChange={(e) => setNomAutre(e.target.value)}
            placeholder="Nom du participant"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/20"
          />
          <select
            value={sectionAutre}
            onChange={(e) => setSectionAutre(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
          >
            {SECTIONS.map((s) => <option key={s.valeur} value={s.valeur}>{s.label}</option>)}
          </select>
          <select
            value={sexeAutre}
            onChange={(e) => setSexeAutre(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
          <button
            type="submit"
            disabled={ajoutEnCours || !nomAutre.trim()}
            className="flex items-center justify-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" /> Ajouter
          </button>
        </form>

        {autres.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun participant supplémentaire ajouté pour le moment.</p>
        ) : (
          <ul className="space-y-1">
            {autres.map((a) => (
              <li key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-slate-700">{a.nom_autre}</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    Section {a.section}
                  </span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {a.sexe === 'M' ? 'Homme' : 'Femme'}
                  </span>
                </div>
                <button onClick={() => retirerAutre(a.id)} className="text-slate-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
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
