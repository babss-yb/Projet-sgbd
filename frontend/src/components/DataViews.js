import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AlertTriangle, FileX } from 'lucide-react';

function DataViews({ apiUrl }) {
  const [activeView, setActiveView] = useState('vehicules');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const views = useMemo(() => [
    { id: 'vehicules', name: 'Véhicules', endpoint: '/vehicules' },
    { id: 'chauffeurs', name: 'Chauffeurs', endpoint: '/chauffeurs' },
    { id: 'trajets', name: 'Trajets', endpoint: '/trajets' },
    { id: 'incidents', name: 'Incidents', endpoint: '/incidents' },
    { id: 'lignes', name: 'Lignes', endpoint: '/lignes' },
    { id: 'tarifs', name: 'Tarifs', endpoint: '/tarifs' }
  ], []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const view = views.find(v => v.id === activeView);
      const response = await axios.get(`${apiUrl}${view.endpoint}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur de connexion. Vérifiez que l\'API est lancée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeView, apiUrl, views]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderTable = () => {
    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 text-center p-16 text-textMuted text-base">
          <FileX size={48} className="opacity-50" />
          <p>Aucune donnée disponible pour cette catégorie.</p>
        </div>
      );
    }

    const columns = Object.keys(data[0]).filter(key => key !== 'created_at' && key !== 'updated_at');

    return (
      <div className="overflow-auto max-h-[calc(100vh-350px)]">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-[#161b22]/95 backdrop-blur-[10px] z-[2]">
            <tr>
              {columns.map(col => (
                <th key={col} className="p-5 text-left font-semibold text-textSecondary uppercase text-xs tracking-widest border-b border-white/5 whitespace-nowrap">
                  {formatHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="transition-colors duration-150 hover:bg-white/5">
                {columns.map(col => (
                  <td key={col} className="p-4 border-b border-white/5 text-textPrimary whitespace-nowrap last:border-b-0">
                    {formatValue(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const formatHeader = (key) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return <span className="opacity-50">-</span>;
    if (typeof value === 'number') {
      if (key.includes('prix') || key.includes('recette')) {
        return <span className="text-accentSecondary font-semibold">{value.toLocaleString()} FCFA</span>;
      }
      if (key.includes('date') || key.includes('heure')) {
        return new Date(value).toLocaleString('fr-FR');
      }
    }
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${value ? 'bg-[#00d4aa]/15 text-[#00d4aa]' : 'bg-[#ff6b9d]/15 text-[#ff6b9d]'}`}>
          {value ? 'Oui' : 'Non'}
        </span>
      );
    }
    return value;
  };

  return (
    <div className="animate-fade-slide-up opacity-0 h-full flex flex-col">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Explorateur de Données</h2>
        <p className="text-base text-textSecondary">Consultez et analysez les tables de la base de données</p>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-8 bg-bgSurface p-2 rounded-2xl border border-white/5 backdrop-blur-xl w-fit">
        {views.map(view => (
          <button
            key={view.id}
            className={`relative px-6 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-300 ${activeView === view.id ? 'bg-gradient-primary text-white shadow-[0_4px_15px_rgba(124,91,255,0.3)]' : 'bg-transparent text-textSecondary hover:text-textPrimary hover:bg-white/5'}`}
            onClick={() => setActiveView(view.id)}
          >
            {view.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-10 h-10 border-4 border-[#7c5bff]/20 border-t-accentPrimary rounded-full animate-spin"></div>
          <div className="text-textSecondary font-medium tracking-wide">Chargement des enregistrements...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-accentTertiary">
          <AlertTriangle size={48} />
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={fetchData} 
            className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/80 transition-colors border-none rounded-lg text-white cursor-pointer mt-2"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-bgSurface backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
          {renderTable()}
        </div>
      )}
    </div>
  );
}

export default DataViews;
