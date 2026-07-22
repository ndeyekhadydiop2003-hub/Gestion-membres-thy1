import { useState } from 'react';
import { X } from 'lucide-react';
import { commissionsApi } from './commissionsApi';
import { useToast } from '../../context/ToastContext';

const COULEURS = ['#15293f', '#2c4f7c', '#5b9bd5', '#e8a548', '#e07a5f', '#81b29a', '#a68cc4', '#6b7280'];

export default function CommissionFormModal({ commission, onFermer, onEnregistre }) {
  const { showToast } = useToast();
  const estModification = !!commission;

  const [nom, setNom] = useState(commission?.nom || '');
  const [description, setDescription] = useState(commission?.description || '');
  const [couleur, setCouleur] = useState(commission?.couleur || COULEURS[0]);
  const [erreurs, setErreurs] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnregistrement(true);

    try {
      if (estModification) {
        await commissionsApi.modifier(commission.id, { nom, description, couleur });
      } else {
        await commissionsApi.creer({ nom, description, couleur });
      }
      showToast(estModification ? 'Commission modifiée avec succès.' : 'Commission créée avec succès.');
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
          <h2 className="text-lg font-semibold text-slate-900">
            {estModification ? 'Modifier la commission' : 'Nouvelle commission'}
          </h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={soumettre} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Nom de la commission</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} required className="champ" />
            {erreurs.nom && <p className="text-xs text-red-600 mt-1">{erreurs.nom[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="champ" />
            {erreurs.description && <p className="text-xs text-red-600 mt-1">{erreurs.description[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Couleur</label>
            <div className="flex gap-2 flex-wrap">
              {COULEURS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCouleur(c)}
                  className={`w-8 h-8 rounded-full transition ${couleur === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onFermer} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={enregistrement} className="px-5 py-2.5 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {enregistrement ? 'Enregistrement...' : estModification ? 'Enregistrer' : 'Créer la commission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
