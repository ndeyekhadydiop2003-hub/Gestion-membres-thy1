import { useEffect, useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { presencesApi } from '../presences/presencesApi';

export default function SeancesArchiveModal({ programme, onFermer, onSelectionner }) {
  const [seances, setSeances] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    setChargement(true);
    presencesApi.seancesDuProgramme(programme.id, page).then((r) => {
      setSeances(r.data);
      setMeta(r.meta);
    }).finally(() => setChargement(false));
  }, [programme.id, page]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Archives — {programme.nom}</h2>
          <button onClick={onFermer} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4">
          {chargement ? (
            <p className="text-sm text-slate-400 p-4">Chargement...</p>
          ) : seances.length === 0 ? (
            <p className="text-sm text-slate-400 p-4 text-center">Aucune séance.</p>
          ) : (
            <div className="space-y-1">
              {seances.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectionner(s)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#2c4f7c]/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-[#2c4f7c]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 capitalize">
                      {new Date(s.date_seance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-1.5 text-xs font-medium shrink-0">
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{s.presents}</span>
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{s.absents}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-3 py-3 border-t border-slate-100 mt-2">
              <p className="text-xs text-slate-400">Page {meta.current_page} sur {meta.last_page}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}