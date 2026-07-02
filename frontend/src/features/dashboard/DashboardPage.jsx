import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { Users, UserPlus, Mail, CalendarCheck, Search, Download } from 'lucide-react';
import { dashboardApi } from './dashboardApi';
import { useAuth } from '../../context/AuthContext';

const BLEU = '#2c4f7c';
const COULEURS_SEXE = ['#2c4f7c', '#93b6dd'];
const COULEURS_SANG = ['#15293f', '#2c4f7c', '#5b9bd5', '#a8c8e8', '#e8a548', '#81b29a', '#e07a5f', '#a68cc4'];

export default function DashboardPage() {
  const { utilisateur } = useAuth();
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [misAJour, setMisAJour] = useState(null);

  useEffect(() => {
    dashboardApi
      .statistiques()
      .then((d) => {
        setDonnees(d);
        setMisAJour(new Date());
      })
      .catch(() => setErreur('Impossible de charger les statistiques.'))
      .finally(() => setChargement(false));
  }, []);

  if (chargement) return <div className="p-8 text-slate-500">Chargement du tableau de bord...</div>;
  if (erreur) return <div className="p-8 text-red-600">{erreur}</div>;

  const totalSexe = donnees.repartition_sexe.reduce((s, e) => s + e.total, 0);

  const cartes = [
    { label: 'Membres total', valeur: donnees.total_membres.toLocaleString('fr-FR'), icone: Users, badge: 'Membres actifs' },
    { label: 'Nouvelles adhésions', valeur: donnees.nouvelles_adhesions, icone: UserPlus, badge: 'Ce mois' },
    { label: 'Messages envoyés', valeur: donnees.messages_envoyes, icone: Mail, badge: 'Total' },
    { label: 'Séances tenues', valeur: donnees.seances_tenues, icone: CalendarCheck, badge: 'Ce trimestre' },
  ];

  return (
    <div>
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un membre, NIN, téléphone..."
            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/20"
          />
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-medium text-[#2c4f7c] uppercase tracking-wide">Section Thiaroye Yeumbeul 1</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Tableau de bord</h1>
            <p className="text-slate-400 text-sm mt-1">
              Analyse temps réel de la base des membres
              {misAJour && ` — mise à jour à ${misAJour.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="w-4 h-4" /> Exporter rapport
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cartes.map(({ label, valeur, icone: Icone, badge }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#2c4f7c]/10 flex items-center justify-center">
                  <Icone className="w-4.5 h-4.5 text-[#2c4f7c]" />
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">{badge}</span>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-2xl font-bold text-slate-900">{valeur}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900">Évolution des adhésions</h2>
            <p className="text-xs text-slate-400 mb-4">Adhésions sur 12 mois</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={donnees.adhesions_par_mois}>
                <defs>
                  <linearGradient id="couleurAdh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLEU} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={BLEU} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke={BLEU} strokeWidth={2} fill="url(#couleurAdh)" name="Adhésions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900">Répartition par sexe</h2>
            <p className="text-xs text-slate-400 mb-4">{donnees.total_membres} membres</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={donnees.repartition_sexe} dataKey="total" nameKey="sexe" innerRadius={50} outerRadius={75}>
                  {donnees.repartition_sexe.map((e, i) => (
                    <Cell key={e.sexe} fill={COULEURS_SEXE[i % COULEURS_SEXE.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-2">
              {donnees.repartition_sexe.map((e, i) => (
                <div key={e.sexe} className="text-center">
                  <p className="text-lg font-bold" style={{ color: COULEURS_SEXE[i % COULEURS_SEXE.length] }}>
                    {totalSexe ? Math.round((e.total / totalSexe) * 100) : 0}%
                  </p>
                  <p className="text-xs text-slate-400">{e.sexe === 'M' ? `Hommes (${e.total})` : `Femmes (${e.total})`}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900">Tranches d'âge</h2>
            <p className="text-xs text-slate-400 mb-4">Distribution démographique (0 à 65+ ans)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={donnees.tranches_age}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tranche" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="total" fill="#15293f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {donnees.repartition_groupe_sanguin && (
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900">Groupes sanguins</h2>
              <p className="text-xs text-slate-400 mb-4">Données médicales sensibles</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={donnees.repartition_groupe_sanguin} dataKey="total" nameKey="groupe_sanguin" outerRadius={80} label={({ groupe_sanguin }) => groupe_sanguin}>
                    {donnees.repartition_groupe_sanguin.map((e, i) => (
                      <Cell key={e.groupe_sanguin} fill={COULEURS_SANG[i % COULEURS_SANG.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900">Présence par programme</h2>
            <p className="text-xs text-slate-400 mb-4">Taux de participation moyen</p>
            {donnees.presence_par_programme.length === 0 ? (
              <p className="text-sm text-slate-400 mt-6">Aucune séance enregistrée pour le moment.</p>
            ) : (
              <div className="space-y-4 mt-2">
                {donnees.presence_par_programme.map((p) => (
                  <div key={p.programme}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 truncate">{p.programme}</span>
                      <span className="font-semibold text-[#2c4f7c]">{p.taux_presence}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#2c4f7c]" style={{ width: `${p.taux_presence}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-900">Derniers membres ajoutés</h2>
                <p className="text-xs text-slate-400">{donnees.derniers_membres.length} inscriptions récentes</p>
              </div>
              <button className="text-sm text-[#2c4f7c] font-medium hover:underline">Voir tout →</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100 text-xs uppercase">
                  <th className="pb-2 font-medium">Membre</th>
                  <th className="pb-2 font-medium">Profession</th>
                  <th className="pb-2 font-medium">Adhésion</th>
                  <th className="pb-2 font-medium">Statut</th>
                  <th className="pb-2 font-medium text-right">ID</th>
                </tr>
              </thead>
              <tbody>
                {donnees.derniers_membres.map((m) => (
                  <tr key={m.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2c4f7c]/10 flex items-center justify-center text-xs font-medium text-[#2c4f7c] overflow-hidden shrink-0">
                          {m.photo_url ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" /> : `${m.nom?.[0] ?? ''}${m.prenom?.[0] ?? ''}`}
                        </div>
                        <p className="font-medium text-slate-900">{m.nom} {m.prenom}</p>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">{m.profession || '—'}</td>
                    <td className="py-3 text-slate-600">{m.date_adhesion}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        m.statut === 'actif' ? 'bg-green-50 text-green-700' : m.statut === 'en_attente' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {m.statut === 'actif' ? 'Actif' : m.statut === 'inactif' ? 'Inactif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-400 text-xs">{m.identifiant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Activité récente</h2>
            <ul className="space-y-4">
              {donnees.activite_recente.map((log) => (
                <li key={log.id} className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2c4f7c] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700"><span className="font-medium">{log.utilisateur}</span> {log.action}</p>
                    <p className="text-xs text-slate-400">{log.cree_le}</p>
                  </div>
                </li>
              ))}
              {donnees.activite_recente.length === 0 && <p className="text-sm text-slate-400">Aucune activité récente.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}