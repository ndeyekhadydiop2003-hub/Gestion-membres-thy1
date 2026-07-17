import { useState } from 'react';
import { X } from 'lucide-react';
import { seancesApi } from './programmesApi';
import { useToast } from '../../context/ToastContext';

export default function SeanceFormModal({ programmeId, seance, onFermer, onEnregistre }) {
  const { showToast } = useToast();
  const estModification = !!seance;
  const [dateSeance, setDateSeance] = useState(seance?.date_seance?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [heureDebut, setHeureDebut] = useState(seance?.heure_debut?.slice(0, 5) || '');
  const [heureFin, setHeureFin] = useState(seance?.heure_fin?.slice(0, 5) || '');
  const [lieu, setLieu] = useState(seance?.lieu || '');
  const [statut, setStatut] = useState(seance?.statut || 'planifiee');
  const [erreurs, setErreurs] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnregistrement(true);
    try {
      const donnees = {
        date_seance: dateSeance,
        heure_debut: heureDebut || null,
        heure_fin: heureFin || null,
        lieu: lieu || null,
      };
      if (estModification) {
        await seancesApi.modifier(seance.id, { ...donnees, statut });
      } else {
        await seancesApi.creer({ ...donnees, programme_id: programmeId });
      }
      showToast(estModification ? 'Séance modifiée avec succès.' : 'Séance créée avec succès.');
      onEnregistre();
    } catch (err) {
      if (err.donnees?.errors) setErreurs(err.donnees.errors);
      else alert(err.message);
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">{estModification ? 'Modifier la séance' : 'Nouvelle séance'}</h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={soumettre} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Date</label>
            <input type="date" value={dateSeance} onChange={(e) => setDateSeance(e.target.value)} required className="champ" />
            {erreurs.date_seance && <p className="text-xs text-red-600 mt-1">{erreurs.date_seance[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Heure de début</label>
              <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} className="champ" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Heure de fin</label>
              <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} className="champ" />
              {erreurs.heure_fin && <p className="text-xs text-red-600 mt-1">{erreurs.heure_fin[0]}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Lieu (optionnel)</label>
            <input value={lieu} onChange={(e) => setLieu(e.target.value)} className="champ" />
          </div>
          {estModification && (
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Statut</label>
              <select value={statut} onChange={(e) => setStatut(e.target.value)} className="champ">
                <option value="planifiee">Planifiée</option>
                <option value="terminee">Terminée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onFermer} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={enregistrement} className="px-5 py-2.5 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {enregistrement ? 'Enregistrement...' : estModification ? 'Enregistrer' : 'Créer la séance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}