import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { membresApi } from './membresApi';
import { useToast } from '../../context/ToastContext';

const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MembreFormModal({ membre, commissions, onFermer, onEnregistre }) {
  const { showToast } = useToast();
  const estModification = !!membre;

  const [form, setForm] = useState({
    nom: membre?.nom || '',
    prenom: membre?.prenom || '',
    sexe: membre?.sexe || 'M',
    date_naissance: membre?.date_naissance || '',
    niveau: membre?.niveau || '',
    profession: membre?.profession || '',
    telephone: membre?.telephone || '',
    email: membre?.email || '',
    date_adhesion: membre?.date_adhesion || new Date().toISOString().slice(0, 10),
    commission_id: membre?.commission?.id || '',
    statut: membre?.statut || 'actif',
    nin: '',
    numero_electeur: '',
    groupe_sanguin: '',
  });
  const [photo, setPhoto] = useState(null);
  const [erreurs, setErreurs] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);

  const modifierChamp = (champ, valeur) => setForm((f) => ({ ...f, [champ]: valeur }));

  const soumettre = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnregistrement(true);

    const donnees = { ...form };
    if (photo) donnees.photo = photo;

    try {
      if (estModification) {
        await membresApi.modifier(membre.id, donnees);
      } else {
        await membresApi.creer(donnees);
      }
      showToast(estModification ? 'Membre modifié avec succès.' : 'Membre créé avec succès.');
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
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {estModification ? 'Modifier le membre' : 'Nouveau membre'}
          </h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={soumettre} className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {photo ? (
                <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
              ) : membre?.photo_url ? (
                <img src={membre.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <label className="text-sm text-[#2c4f7c] font-medium cursor-pointer hover:underline">
              Choisir une photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files[0])} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Champ label="Nom" erreur={erreurs.nom}>
              <input value={form.nom} onChange={(e) => modifierChamp('nom', e.target.value)} required className="champ" />
            </Champ>
            <Champ label="Prénom" erreur={erreurs.prenom}>
              <input value={form.prenom} onChange={(e) => modifierChamp('prenom', e.target.value)} required className="champ" />
            </Champ>
            <Champ label="Sexe" erreur={erreurs.sexe}>
              <select value={form.sexe} onChange={(e) => modifierChamp('sexe', e.target.value)} className="champ">
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </Champ>
            <Champ label="Date de naissance" erreur={erreurs.date_naissance}>
              <input type="date" value={form.date_naissance || ''} onChange={(e) => modifierChamp('date_naissance', e.target.value)} className="champ" />
            </Champ>
            <Champ label="Profession" erreur={erreurs.profession}>
              <input value={form.profession} onChange={(e) => modifierChamp('profession', e.target.value)} className="champ" />
            </Champ>
            <Champ label="Niveau" erreur={erreurs.niveau}>
              <input value={form.niveau} onChange={(e) => modifierChamp('niveau', e.target.value)} className="champ" />
            </Champ>
            <Champ label="Téléphone" erreur={erreurs.telephone}>
              <input value={form.telephone} onChange={(e) => modifierChamp('telephone', e.target.value)} className="champ" />
            </Champ>
            <Champ label="Email" erreur={erreurs.email}>
              <input type="email" value={form.email} onChange={(e) => modifierChamp('email', e.target.value)} className="champ" />
            </Champ>
            <Champ label="Date d'adhésion" erreur={erreurs.date_adhesion}>
              <input type="date" value={form.date_adhesion} onChange={(e) => modifierChamp('date_adhesion', e.target.value)} required className="champ" />
            </Champ>
            <Champ label="Commission" erreur={erreurs.commission_id}>
              <select value={form.commission_id} onChange={(e) => modifierChamp('commission_id', e.target.value)} className="champ">
                <option value="">Aucune commission</option>
                {commissions.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </Champ>
            <Champ label="Statut" erreur={erreurs.statut}>
              <select value={form.statut} onChange={(e) => modifierChamp('statut', e.target.value)} className="champ">
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </Champ>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-700 mb-1">Données sensibles</p>
            <p className="text-xs text-slate-400 mb-4">Ces informations seront chiffrées et accès restreint après enregistrement.</p>
            <div className="grid grid-cols-2 gap-4">
              <Champ label="NIN" erreur={erreurs.nin}>
                <input value={form.nin} onChange={(e) => modifierChamp('nin', e.target.value)} className="champ" />
              </Champ>
              <Champ label="Numéro électeur" erreur={erreurs.numero_electeur}>
                <input value={form.numero_electeur} onChange={(e) => modifierChamp('numero_electeur', e.target.value)} className="champ" />
              </Champ>
              <Champ label="Groupe sanguin" erreur={erreurs.groupe_sanguin}>
                <select value={form.groupe_sanguin} onChange={(e) => modifierChamp('groupe_sanguin', e.target.value)} className="champ">
                  <option value="">Non renseigné</option>
                  {GROUPES_SANGUINS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Champ>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onFermer} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={enregistrement} className="px-5 py-2.5 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {enregistrement ? 'Enregistrement...' : estModification ? 'Enregistrer' : 'Créer le membre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Champ({ label, erreur, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
      {children}
      {erreur && <p className="text-xs text-red-600 mt-1">{erreur[0]}</p>}
    </div>
  );
}