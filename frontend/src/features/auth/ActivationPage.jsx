import { useEffect, useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function ActivationPage({ token }) {
  const [chargement, setChargement] = useState(true);
  const [utilisateur, setUtilisateur] = useState(null);
  const [erreur, setErreur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [succes, setSucces] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/activation/${token}`)
      .then(async (r) => {
        const donnees = await r.json();
        if (!r.ok) throw new Error(donnees.message);
        return donnees;
      })
      .then(setUtilisateur)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, [token]);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      const r = await fetch(`http://localhost:8000/api/v1/activation/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: motDePasse, password_confirmation: confirmation }),
      });
      const donnees = await r.json();
      if (!r.ok) throw new Error(donnees.message || "Erreur lors de l'activation.");
      setSucces(true);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  if (chargement) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Vérification du lien...</div>;
  }

  if (erreur && !utilisateur) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-600 text-center">{erreur}</p>
      </div>
    );
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Compte activé !</h1>
          <p className="text-slate-500 mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <button
            onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
            }}
            className="inline-block bg-[#2c4f7c] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90"
            >
            Aller à la connexion
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-sm">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#15293f] to-[#2c4f7c] flex items-center justify-center mx-auto mb-5">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-center text-slate-900">Bienvenue {utilisateur?.prenom}</h1>
        <p className="text-center text-slate-500 text-sm mt-1 mb-6">Définissez votre mot de passe pour activer votre compte.</p>

        {erreur && <p className="text-sm text-red-600 mb-4">{erreur}</p>}

        <form onSubmit={soumettre} className="space-y-4">

        <input type="hidden" name="username" autoComplete="username" value={utilisateur?.email || ''} readOnly />
           <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Nouveau mot de passe</label>
                <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="champ"
                />
            </div>
            
          
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Confirmer le mot de passe</label>
            <input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required minLength={8} className="champ" />
          </div>
          <button type="submit" disabled={envoi} className="w-full bg-[#2c4f7c] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60">
            {envoi ? 'Activation...' : 'Activer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
}