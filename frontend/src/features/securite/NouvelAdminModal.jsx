import { useState } from 'react';
import { X, Copy, Check, Info } from 'lucide-react';
import { securiteApi } from './securiteApi';
import { useToast } from '../../context/ToastContext';

export default function NouvelAdminModal({ onFermer, onEnregistre }) {
  const { showToast } = useToast();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [erreurs, setErreurs] = useState({});
  const [enregistrement, setEnregistrement] = useState(false);
  const [lienActivation, setLienActivation] = useState(null);
  const [copie, setCopie] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnregistrement(true);
    try {
      const r = await securiteApi.creerUtilisateur({ nom, prenom, email, role });
      setLienActivation(r.lien_activation);
      showToast('Compte créé avec succès.');
    } catch (err) {
      if (err.donnees?.errors) setErreurs(err.donnees.errors);
      else alert(err.message);
    } finally {
      setEnregistrement(false);
    }
  };

  const copierLien = () => {
    navigator.clipboard.writeText(lienActivation);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Nouveau compte</h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        {lienActivation ? (
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-2.5 bg-blue-50 text-blue-800 text-sm rounded-lg px-4 py-3">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                L'envoi automatique par email n'est pas encore configuré. Transmettez ce lien manuellement
                à l'utilisateur (WhatsApp, SMS...). Il est valable <strong>48 heures</strong>.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Lien d'activation</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-white border border-slate-200 rounded px-2 py-1.5 flex-1 truncate">{lienActivation}</code>
                <button onClick={copierLien} className="text-slate-500 hover:text-[#2c4f7c] p-1.5 shrink-0">
                  {copie ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={() => { onEnregistre(); onFermer(); }} className="w-full bg-[#2c4f7c] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90">
              Terminé
            </button>
          </div>
        ) : (
          <form onSubmit={soumettre} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Nom</label>
                <input value={nom} onChange={(e) => setNom(e.target.value)} required className="champ" />
                {erreurs.nom && <p className="text-xs text-red-600 mt-1">{erreurs.nom[0]}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Prénom</label>
                <input value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="champ" />
                {erreurs.prenom && <p className="text-xs text-red-600 mt-1">{erreurs.prenom[0]}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="champ" />
              {erreurs.email && <p className="text-xs text-red-600 mt-1">{erreurs.email[0]}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Rôle</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="champ">
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onFermer} className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">Annuler</button>
              <button type="submit" disabled={enregistrement} className="px-5 py-2.5 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
                {enregistrement ? 'Création...' : 'Créer le compte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}