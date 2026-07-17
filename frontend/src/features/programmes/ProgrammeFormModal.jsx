import { useState } from 'react';
import { X } from 'lucide-react';
import { programmesApi } from './programmesApi';
import { useToast } from '../../context/ToastContext';

const COULEURS = ['#2c4f7c', '#22a55e', '#e8a548', '#5b9bd5', '#e07a5f', '#a68cc4'];
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function ProgrammeFormModal({ programme, onFermer, onEnregistre }) {
  const { showToast } = useToast();
  const estModification = !!programme;
  const [nom, setNom] = useState(programme?.nom || '');
  const [description, setDescription] = useState(programme?.description || '');
  const [jourSemaine, setJourSemaine] = useState(programme?.jour_semaine || '');
  const [couleur, setCouleur] = useState(programme?.couleur || COULEURS[0]);
  const [erreurs, setErreurs] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnregistrement(true);
    try {
      const donnees = { nom, description, jour_semaine: jourSemaine || null, couleur };
      if (estModification) {
        await programmesApi.modifier(programme.id, donnees);
      } else {
        await programmesApi.creer(donnees);
      }
      showToast(estModification ? 'Programme modifié avec succès.' : 'Programme créé avec succès.');
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
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">{estModification ? 'Modifier le programme' : 'Nouveau programme'}</h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={soumettre} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Nom du programme</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} required className="champ" />
            {erreurs.nom && <p className="text-xs text-red-600 mt-1">{erreurs.nom[0]}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="champ" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Jour habituel (optionnel)</label>
            <select value={jourSemaine} onChange={(e) => setJourSemaine(e.target.value)} className="champ">
              <option value="">Non défini</option>
              {JOURS.map((j) => <option key={j} value={j}>{j.charAt(0).toUpperCase() + j.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Couleur</label>
            <div className="flex gap-2">
              {COULEURS.map((c) => (
                <button key={c} type="button" onClick={() => setCouleur(c)}
                  className={`w-8 h-8 rounded-full ${couleur === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onFermer} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">Annuler</button>
            <button type="submit" disabled={enregistrement} className="px-5 py-2.5 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {enregistrement ? 'Enregistrement...' : estModification ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}