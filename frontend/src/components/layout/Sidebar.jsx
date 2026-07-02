import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  CalendarCheck,
  Mail,
  FileSpreadsheet,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react';

const ONGLETS = [
  { cle: 'dashboard', label: 'Tableau de bord', icone: LayoutDashboard, reserveSuperAdmin: false },
  { cle: 'membres', label: 'Membres', icone: Users, reserveSuperAdmin: false },
  { cle: 'groupes', label: 'Groupes', icone: UsersRound, reserveSuperAdmin: false },
  { cle: 'programmes', label: 'Programmes', icone: CalendarCheck, reserveSuperAdmin: false },
  { cle: 'messagerie', label: 'Messagerie', icone: Mail, reserveSuperAdmin: false },
  { cle: 'import-export', label: 'Import/Export', icone: FileSpreadsheet, reserveSuperAdmin: false },
  { cle: 'securite', label: 'Sécurité & rôles', icone: ShieldCheck, reserveSuperAdmin: true },
  { cle: 'parametres', label: 'Paramètres', icone: Settings, reserveSuperAdmin: true },
];

export default function Sidebar({ pageActive, onNaviguer }) {
  const { utilisateur, deconnecter, estSuperAdmin } = useAuth();

  const onglets = ONGLETS.filter((onglet) => !onglet.reserveSuperAdmin || estSuperAdmin);

  const initiales = utilisateur?.nom
    ?.split(' ')
    .map((mot) => mot[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-gradient-to-b from-[#15293f] to-[#1c3453] text-white flex flex-col h-screen shrink-0">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center font-bold text-sm">
          TY1
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-sm">Thiaroye Yeumbeul 1</p>
          <p className="text-white/50 text-xs">Gestion des membres</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {onglets.map(({ cle, label, icone: Icone }) => (
          <button
            key={cle}
            onClick={() => onNaviguer(cle)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              pageActive === cle
                ? 'bg-white/15 text-white font-medium'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icone className="w-4.5 h-4.5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-sm font-medium shrink-0">
            {initiales}
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-medium truncate">{utilisateur?.nom}</p>
            <p className="text-white/50 text-xs">
              {utilisateur?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>

        <button
          onClick={deconnecter}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut className="w-4.5 h-4.5" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}