import { useEffect, useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, Users, FileDown } from 'lucide-react';
import { importExportApi } from './importExportApi';
import { commissionsApi } from '../commissions/commissionsApi';
import { useToast } from '../../context/ToastContext';

const COLONNES_DISPONIBLES = [
  { cle: 'nom_prenom', label: 'Nom & Prénom' },
  { cle: 'sexe_age', label: 'Sexe / Âge' },
  { cle: 'profession', label: 'Profession' },
  { cle: 'telephone', label: 'Téléphone' },
  { cle: 'email', label: 'Email' },
  { cle: 'adhesion', label: 'Adhésion' },
  { cle: 'niveau', label: 'Niveau' },
  { cle: 'groupe_sanguin', label: 'Groupe sanguin (sensible)' },
];

export default function ImportExportPage() {
  const { showToast } = useToast();
  const [commissions, setCommissions] = useState([]);
  const [historique, setHistorique] = useState([]);

  const [fichierMembres, setFichierMembres] = useState(null);
  const [importMembresEnCours, setImportMembresEnCours] = useState(false);
  const [resultatMembres, setResultatMembres] = useState(null);

  const [colonnes, setColonnes] = useState(['nom_prenom', 'sexe_age', 'profession', 'telephone', 'adhesion']);
  const [masquerSensibles, setMasquerSensibles] = useState(true);
  const [commissionIdExport, setCommissionIdExport] = useState('');
  const [exportEnCours, setExportEnCours] = useState(false);

  useEffect(() => {
    commissionsApi.lister().then((r) => setCommissions(r.data));
    chargerHistorique();
  }, []);

  const chargerHistorique = () => {
    importExportApi.historique().then((r) => setHistorique(r.data || []));
  };

  const toggleColonne = (cle) => {
    setColonnes((prev) => (prev.includes(cle) ? prev.filter((c) => c !== cle) : [...prev, cle]));
  };

  const importerMembres = async () => {
    if (!fichierMembres) return;
    setImportMembresEnCours(true);
    setResultatMembres(null);
    try {
      const r = await importExportApi.importerMembres(fichierMembres);
      setResultatMembres(r);
      showToast(`${r.nombre_importes} membre(s) importé(s) avec succès.`);
      chargerHistorique();
      setFichierMembres(null);
    } catch (err) {
      showToast(err.message || "Échec de l'import.", 'error');
    } finally {
      setImportMembresEnCours(false);
    }
  };

  const telechargerModele = async () => {
    try {
      const blob = await importExportApi.telechargerModele('membres');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modele_import_membres.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const exporter = async () => {
    setExportEnCours(true);
    try {
      const blob = await importExportApi.exporter(colonnes, masquerSensibles, commissionIdExport);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_membres_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Export généré avec succès.');
      chargerHistorique();
    } catch (err) {
      showToast(err.message || "Échec de l'export.", 'error');
    } finally {
      setExportEnCours(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs font-medium text-[#2c4f7c] uppercase tracking-wide">Données</p>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Import / Export</h1>
        <p className="text-slate-400 text-sm mt-1">Importez des données en masse ou exportez la base des membres.</p>
      </div>

      {/* ── Import Membres ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 max-w-xl">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4.5 h-4.5 text-[#2c4f7c]" />
          <h2 className="font-semibold text-slate-900">Importer des membres</h2>
        </div>
        <p className="text-sm text-slate-400 mb-1">
          Fichier Excel (.xlsx) avec une ligne par membre. Seuls <strong>nom</strong>, <strong>prénom</strong> et <strong>sexe</strong> sont obligatoires, le reste est facultatif.
        </p>
        <button
          onClick={telechargerModele}
          className="flex items-center gap-1.5 text-sm text-[#2c4f7c] font-medium hover:underline mb-4"
        >
          <FileDown className="w-3.5 h-3.5" /> Télécharger le modèle
        </button>

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-lg py-8 cursor-pointer hover:border-[#2c4f7c]/40 transition">
          <Upload className="w-6 h-6 text-slate-400" />
          <span className="text-sm text-slate-500">
            {fichierMembres ? fichierMembres.name : 'Cliquez pour choisir un fichier'}
          </span>
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => setFichierMembres(e.target.files[0])} />
        </label>

        <button
          onClick={importerMembres}
          disabled={!fichierMembres || importMembresEnCours}
          className="w-full mt-4 bg-[#2c4f7c] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40"
        >
          {importMembresEnCours ? 'Import en cours...' : 'Importer'}
        </button>

        {resultatMembres && (
          <div className="mt-4 text-sm space-y-2">
            <p className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-4 h-4" /> {resultatMembres.nombre_importes} membre(s) importé(s)
            </p>
            {resultatMembres.erreurs?.length > 0 && (
              <div className="text-amber-700 space-y-1 max-h-40 overflow-y-auto">
                {resultatMembres.erreurs.slice(0, 10).map((e, i) => (
                  <p key={i} className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {e}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Export ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4.5 h-4.5 text-[#2c4f7c]" />
          <h2 className="font-semibold text-slate-900">Exporter les membres</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Choisissez les colonnes à inclure dans le fichier Excel.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {COLONNES_DISPONIBLES.map((c) => (
            <label key={c.cle} className="flex items-center gap-2 text-sm text-slate-600 px-3 py-2 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-50">
              <input type="checkbox" checked={colonnes.includes(c.cle)} onChange={() => toggleColonne(c.cle)} className="rounded border-slate-300" />
              {c.label}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <select value={commissionIdExport} onChange={(e) => setCommissionIdExport(e.target.value)} className="champ w-auto">
            <option value="">Toutes les commissions</option>
            {commissions.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={masquerSensibles} onChange={(e) => setMasquerSensibles(e.target.checked)} className="rounded border-slate-300" />
            Masquer les données sensibles (NIN, n° électeur)
          </label>
        </div>

        <button
          onClick={exporter}
          disabled={exportEnCours || colonnes.length === 0}
          className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> {exportEnCours ? 'Génération...' : 'Exporter en Excel'}
        </button>
      </div>

      {/* ── Historique ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <FileSpreadsheet className="w-4.5 h-4.5 text-[#2c4f7c]" />
          <h2 className="font-semibold text-slate-900">Historique des opérations</h2>
        </div>
        {historique.length === 0 ? (
          <p className="text-sm text-slate-400 px-6 py-8 text-center">Aucune opération pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Fichier</th>
                <th className="px-6 py-3 font-medium">Détails</th>
                <th className="px-6 py-3 font-medium">Utilisateur</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {historique.map((h) => (
                <tr key={h.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-3 capitalize text-slate-700">{h.type}</td>
                  <td className="px-6 py-3 text-slate-600">{h.fichier}</td>
                  <td className="px-6 py-3 text-slate-500">{h.details}</td>
                  <td className="px-6 py-3 text-slate-500">{h.utilisateur?.nom || '—'}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      h.statut === 'succes' ? 'bg-green-50 text-green-700' : h.statut === 'avertissement' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {h.statut === 'succes' ? 'Succès' : h.statut === 'avertissement' ? 'Avertissement' : 'Échec'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{new Date(h.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}