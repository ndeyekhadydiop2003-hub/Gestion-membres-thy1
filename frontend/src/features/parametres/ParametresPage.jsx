import { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, Monitor, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { parametresApi } from './parametresApi';

function CarteSection({ icone: Icone, titre, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#2c4f7c]/10 flex items-center justify-center shrink-0">
          <Icone className="w-5 h-5 text-[#2c4f7c]" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{titre}</h2>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function ChampMotDePasse({ label, valeur, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type={visible ? 'text' : 'password'}
          required
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 rounded-lg pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/30 focus:border-[#2c4f7c]"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {visible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
        </button>
      </div>
    </div>
  );
}

export default function ParametresPage() {
  const { utilisateur, mettreAJourUtilisateur } = useAuth();
  const { showToast } = useToast();

  // --- Informations du profil ---
  const [prenom, setPrenom] = useState(utilisateur?.prenom || '');
  const [nom, setNom] = useState(utilisateur?.nom || '');
  const [email, setEmail] = useState(utilisateur?.email || '');
  const [enregistrementProfil, setEnregistrementProfil] = useState(false);

  const enregistrerProfil = async (e) => {
    e.preventDefault();
    setEnregistrementProfil(true);
    try {
      const utilisateurMisAJour = await parametresApi.mettreAJourProfil({ prenom, nom, email });
      mettreAJourUtilisateur(utilisateurMisAJour);
      showToast('Vos informations ont été mises à jour.');
    } catch (err) {
      showToast(err.donnees?.errors?.email?.[0] || err.message, 'error');
    } finally {
      setEnregistrementProfil(false);
    }
  };

  // --- Changement de mot de passe ---
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmationMdp, setConfirmationMdp] = useState('');
  const [enregistrementMdp, setEnregistrementMdp] = useState(false);

  const changerMotDePasse = async (e) => {
    e.preventDefault();

    if (nouveauMdp.length < 8) {
      showToast('Le nouveau mot de passe doit contenir au moins 8 caractères.', 'error');
      return;
    }
    if (nouveauMdp !== confirmationMdp) {
      showToast('La confirmation ne correspond pas au nouveau mot de passe.', 'error');
      return;
    }

    setEnregistrementMdp(true);
    try {
      await parametresApi.changerMotDePasse({
        mot_de_passe_actuel: ancienMdp,
        nouveau_mot_de_passe: nouveauMdp,
        nouveau_mot_de_passe_confirmation: confirmationMdp,
      });
      showToast('Mot de passe mis à jour avec succès.');
      setAncienMdp('');
      setNouveauMdp('');
      setConfirmationMdp('');
    } catch (err) {
      showToast(err.donnees?.errors?.mot_de_passe_actuel?.[0] || err.message, 'error');
    } finally {
      setEnregistrementMdp(false);
    }
  };

  // --- Sessions actives ---
  const [deconnexionEnCours, setDeconnexionEnCours] = useState(false);

  const deconnecterAutresAppareils = async () => {
    if (!confirm('Déconnecter tous les autres appareils connectés à votre compte ?')) return;
    setDeconnexionEnCours(true);
    try {
      await parametresApi.deconnecterAutresAppareils();
      showToast('Les autres appareils ont été déconnectés.');
    } catch (err) {
      showToast(err.donnees?.message || err.message, 'error');
    } finally {
      setDeconnexionEnCours(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <p className="text-xs font-medium text-[#2c4f7c] uppercase tracking-wide">Mon compte</p>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Paramètres</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gérez vos informations personnelles et la sécurité de votre compte.
        </p>
      </div>

      {/* Résumé du compte */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#15293f] to-[#2c4f7c] flex items-center justify-center text-white font-semibold text-lg shrink-0">
          {(utilisateur?.prenom?.[0] || '') + (utilisateur?.nom?.[0] || '')}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">
            {utilisateur?.prenom} {utilisateur?.nom}
          </p>
          <p className="text-sm text-slate-400">{utilisateur?.email}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium bg-[#2c4f7c]/10 text-[#2c4f7c] rounded-full px-3 py-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          {utilisateur?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </span>
      </div>

      {/* Informations personnelles */}
      <CarteSection icone={User} titre="Mes informations" description="Votre nom, prénom et adresse email.">
        <form onSubmit={enregistrerProfil} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/30 focus:border-[#2c4f7c]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nom</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/30 focus:border-[#2c4f7c]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Adresse email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/30 focus:border-[#2c4f7c]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enregistrementProfil}
              className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {enregistrementProfil ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </CarteSection>

      {/* Sécurité - mot de passe */}
      <CarteSection
        icone={Lock}
        titre="Mot de passe"
        description="Pour changer votre mot de passe, confirmez d'abord l'actuel."
      >
        <form onSubmit={changerMotDePasse} className="space-y-4">
          <ChampMotDePasse
            label="Mot de passe actuel"
            valeur={ancienMdp}
            onChange={setAncienMdp}
            placeholder="••••••••"
          />
          <div className="grid grid-cols-2 gap-4">
            <ChampMotDePasse
              label="Nouveau mot de passe"
              valeur={nouveauMdp}
              onChange={setNouveauMdp}
              placeholder="Min. 8 caractères"
            />
            <ChampMotDePasse
              label="Confirmer le nouveau mot de passe"
              valeur={confirmationMdp}
              onChange={setConfirmationMdp}
              placeholder="Répétez le mot de passe"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enregistrementMdp}
              className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {enregistrementMdp ? 'Mise à jour...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </CarteSection>

      {/* Sessions actives */}
      <CarteSection
        icone={Monitor}
        titre="Sessions actives"
        description="Déconnectez tous les autres appareils connectés à votre compte."
      >
        <p className="text-sm text-slate-500 mb-4">
          Si vous pensez que quelqu'un d'autre a accès à votre compte, ou si vous vous êtes connecté
          sur un appareil partagé, vous pouvez déconnecter toutes les autres sessions. Vous resterez
          connecté ici.
        </p>
        <button
          onClick={deconnecterAutresAppareils}
          disabled={deconnexionEnCours}
          className="text-sm font-medium text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 disabled:opacity-60"
        >
          {deconnexionEnCours ? 'Déconnexion...' : 'Déconnecter les autres appareils'}
        </button>
      </CarteSection>
    </div>
  );
}
