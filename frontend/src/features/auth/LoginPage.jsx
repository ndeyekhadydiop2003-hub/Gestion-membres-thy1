import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Check, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { connecter } = useAuth();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [seSouvenir, setSeSouvenir] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const seConnecter = async (e) => {
      e.preventDefault();
      setErreur('');
      setChargement(true);

      try {
        const reponse = await fetch('http://localhost:8000/api/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, password: motDePasse }),
        });

        const donnees = await reponse.json();

        if (!reponse.ok) {
          setErreur(donnees.message || 'Identifiant ou mot de passe incorrect.');
          return;
        }

        connecter(donnees.user, donnees.token);
      } catch {
        setErreur('Impossible de se connecter au serveur.');
      } finally {
        setChargement(false);
      }
    };

  const atouts = [
    'Annuaire complet des membres',
    'Suivi des présences aux programmes',
    'Communication interne simplifiée',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#15293f] to-[#2c4f7c] px-10 py-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-white font-semibold text-xl">
          Application de gestion des membres — Section Thiaroye Yeumbeul 1
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-24 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-base font-medium text-[#2c4f7c] border border-[#2c4f7c]/30 rounded-full px-5 py-2 mb-8">
            <ShieldCheck className="w-5 h-5" /> Accès sécurisé
          </span>

          <h2 className="text-5xl font-bold text-slate-900 leading-tight">
            Bienvenue sur l'espace<br />
            <span className="text-[#2c4f7c]">des responsables</span>
          </h2>

          <p className="text-slate-600 mt-6 text-xl leading-relaxed">
            Connectez-vous pour gérer les membres, suivre les programmes
            et coordonner les activités de la section Thiaroye Yeumbeul 1.
          </p>

          <ul className="mt-10 space-y-5">
            {atouts.map((atout) => (
              <li key={atout} className="flex items-center gap-4 text-slate-700 text-lg">
                <span className="w-8 h-8 rounded-full bg-[#2c4f7c]/10 flex items-center justify-center shrink-0">
                  <Check className="w-4.5 h-4.5 text-[#2c4f7c]" />
                </span>
                {atout}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#15293f] to-[#2c4f7c] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-center text-slate-900">Connexion</h3>
          <p className="text-center text-slate-500 text-lg mt-2 mb-9">Entrez vos identifiants pour continuer</p>

          {erreur && (
            <div className="bg-red-50 text-red-700 text-base rounded-lg px-4 py-3 mb-6">
              {erreur}
            </div>
          )}

          <form onSubmit={seConnecter} className="space-y-6">
            <div>
              <label className="text-base font-medium text-slate-700 block mb-2">Identifiant</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.identifiant@exemple.com"
                  className="w-full border border-slate-200 rounded-lg pl-12 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/30 focus:border-[#2c4f7c]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-base font-medium text-slate-700">Mot de passe</label>
                <button type="button" className="text-base text-[#2c4f7c] font-medium hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={afficherMdp ? 'text' : 'password'}
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg pl-12 pr-12 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/30 focus:border-[#2c4f7c]"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMdp(!afficherMdp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {afficherMdp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-base text-slate-600">
              <input
                type="checkbox"
                checked={seSouvenir}
                onChange={(e) => setSeSouvenir(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300"
              />
              Se souvenir de moi
            </label>

            <button
              type="submit"
              disabled={chargement}
              className="w-full bg-gradient-to-r from-[#15293f] to-[#2c4f7c] text-white font-medium text-lg rounded-lg py-4 hover:opacity-90 transition disabled:opacity-60"
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}