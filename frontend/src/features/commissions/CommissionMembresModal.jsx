import { useEffect, useState } from 'react';
import { X, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { commissionsApi } from './commissionsApi';

export default function CommissionMembresModal({ commission, onFermer }) {
  const [membres, setMembres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [membreEnEdition, setMembreEnEdition] = useState(null);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreurs, setErreurs] = useState({});

  // Champs ajout
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [sexe, setSexe] = useState('M');
  const [telephone, setTelephone] = useState('');

  const charger = () => {
    setChargement(true);
    commissionsApi.membres(commission.id).then((r) => setMembres(r.data)).finally(() => setChargement(false));
  };

  useEffect(() => { charger(); }, [commission.id]);

  /* ── Ajouter ── */
  const ajouter = async (e) => {
    e.preventDefault();
    setErreurs({});
    setEnregistrement(true);
    try {
      await commissionsApi.ajouterMembre(commission.id, { nom, prenom, sexe, telephone });
      setNom(''); setPrenom(''); setTelephone(''); setSexe('M');
      setFormOuvert(false);
      charger();
    } catch (err) {
      if (err.donnees?.errors) setErreurs(err.donnees.errors);
      else alert(err.message);
    } finally { setEnregistrement(false); }
  };

  /* ── Ouvrir édition ── */
  const ouvrirEdition = (e, m) => {
    e.stopPropagation();
    setMembreEnEdition({ id: m.id, _nom: m.nom, _prenom: m.prenom, _sexe: m.sexe || 'M', _telephone: m.telephone || '' });
    setFormOuvert(false);
  };

  /* ── Enregistrer édition ── */
  const enregistrerEdition = async (e) => {
    e.preventDefault();
    setEnregistrement(true);
    try {
      await commissionsApi.modifierMembre(membreEnEdition.id, {
        nom: membreEnEdition._nom,
        prenom: membreEnEdition._prenom,
        sexe: membreEnEdition._sexe,
        telephone: membreEnEdition._telephone,
      });
      setMembreEnEdition(null);
      charger();
    } catch (err) { alert(err.message); }
    finally { setEnregistrement(false); }
  };

  /* ── Retirer de la commission ── */
  const retirerMembre = async (e, m) => {
    e.stopPropagation();
    if (!confirm(`Retirer "${m.nom} ${m.prenom}" de la commission ?`)) return;
    try {
      await commissionsApi.supprimerMembre(commission.id, m.id);
      charger();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: commission.couleur }} />
            <h2 className="text-lg font-semibold text-slate-900">{commission.nom}</h2>
          </div>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Barre membres / ajouter */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">{membres.length} membre{membres.length > 1 ? 's' : ''}</p>
            <button
              onClick={() => { setFormOuvert((v) => !v); setMembreEnEdition(null); }}
              className="flex items-center gap-1.5 text-sm font-medium text-[#2c4f7c] hover:underline"
            >
              <UserPlus className="w-4 h-4" /> Ajouter un membre
            </button>
          </div>

          {/* Formulaire ajout */}
          {formOuvert && (
            <form onSubmit={ajouter} className="bg-slate-50 rounded-lg p-4 mb-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required className="champ" />
                  {erreurs.nom && <p className="text-xs text-red-600 mt-1">{erreurs.nom[0]}</p>}
                </div>
                <div>
                  <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" required className="champ" />
                  {erreurs.prenom && <p className="text-xs text-red-600 mt-1">{erreurs.prenom[0]}</p>}
                </div>
                <select value={sexe} onChange={(e) => setSexe(e.target.value)} className="champ">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone (optionnel)" className="champ" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setFormOuvert(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100">Annuler</button>
                <button type="submit" disabled={enregistrement} className="px-4 py-2 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
                  {enregistrement ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          )}

          {/* Formulaire édition */}
          {membreEnEdition && (
            <form onSubmit={enregistrerEdition} className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5 space-y-3">
              <p className="text-xs font-semibold text-[#2c4f7c] uppercase tracking-wide">Modifier le membre</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={membreEnEdition._nom}
                  onChange={(e) => setMembreEnEdition((p) => ({ ...p, _nom: e.target.value }))}
                  placeholder="Nom" required className="champ"
                />
                <input
                  value={membreEnEdition._prenom}
                  onChange={(e) => setMembreEnEdition((p) => ({ ...p, _prenom: e.target.value }))}
                  placeholder="Prénom" required className="champ"
                />
                <select
                  value={membreEnEdition._sexe}
                  onChange={(e) => setMembreEnEdition((p) => ({ ...p, _sexe: e.target.value }))}
                  className="champ"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                <input
                  value={membreEnEdition._telephone}
                  onChange={(e) => setMembreEnEdition((p) => ({ ...p, _telephone: e.target.value }))}
                  placeholder="Téléphone (optionnel)" className="champ"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setMembreEnEdition(null)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100">Annuler</button>
                <button type="submit" disabled={enregistrement} className="px-4 py-2 rounded-lg bg-[#2c4f7c] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60">
                  {enregistrement ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}

          {/* Liste membres */}
          {chargement ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : membres.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucun membre dans cette commission pour le moment.</p>
          ) : (
            <ul className="space-y-1">
              {membres.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 group">
                  <div className="w-9 h-9 rounded-full bg-[#2c4f7c]/10 flex items-center justify-center text-xs font-medium text-[#2c4f7c] overflow-hidden shrink-0">
                    {m.photo_url
                      ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" />
                      : `${m.nom?.[0] ?? ''}${m.prenom?.[0] ?? ''}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{m.nom} {m.prenom}</p>
                    <p className="text-xs text-slate-400">{m.identifiant}{m.telephone ? ` · ${m.telephone}` : ''}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    m.statut === 'actif' ? 'bg-green-50 text-green-700'
                    : m.statut === 'inactif' ? 'bg-slate-100 text-slate-600'
                    : 'bg-red-50 text-red-700'
                  }`}>
                    {m.statut === 'actif' ? 'Actif' : m.statut === 'inactif' ? 'Inactif' : 'Suspendu'}
                  </span>

                  {/* Boutons modifier / supprimer — visibles au hover */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => ouvrirEdition(e, m)}
                      className="p-1.5 text-slate-300 hover:text-[#2c4f7c] rounded-md hover:bg-slate-100 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => retirerMembre(e, m)}
                      className="p-1.5 text-slate-300 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
