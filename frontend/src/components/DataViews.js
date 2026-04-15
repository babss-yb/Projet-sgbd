import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AlertTriangle, FileX, Download, Search, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/* ── MOCK DATA POUR LES COORDONNÉES DES LIGNES (Dakar & Alentours) ── */
const CITIES = {
  'Dakar': [14.6728, -17.4333],
  'Pikine': [14.7683, -17.3986],
  'Rufisque': [14.7167, -17.2833],
  'Thies': [14.7925, -16.9281],
  'Mbour': [14.4172, -16.9634]
};

const LIGNES_MAP_DATA = {
  'L01': { nom: 'Dakar - Pikine', color: '#4dabf7', path: [CITIES['Dakar'], [14.72, -17.42], CITIES['Pikine']] },
  'L02': { nom: 'Dakar - Rufisque', color: '#00d4aa', path: [CITIES['Dakar'], [14.73, -17.34], CITIES['Rufisque']] },
  'L03': { nom: 'Dakar - Thiès', color: '#7c5bff', path: [CITIES['Dakar'], CITIES['Rufisque'], [14.77, -17.15], CITIES['Thies']] },
  'L04': { nom: 'Pikine - Rufisque', color: '#ffb347', path: [CITIES['Pikine'], [14.75, -17.34], CITIES['Rufisque']] },
  'L05': { nom: 'Dakar - Mbour', color: '#ff6b9d', path: [CITIES['Dakar'], CITIES['Rufisque'], [14.58, -17.06], CITIES['Mbour']] }
};

// Component to recenter map when selected line changes
function RecenterMap({ path }) {
  const map = useMap();
  useEffect(() => {
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, map]);
  return null;
}

function DataViews({ apiUrl }) {
  const [activeView, setActiveView] = useState('vehicules');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  
  const [selectedLigne, setSelectedLigne] = useState(null);

  const views = useMemo(() => [
    { id: 'vehicules',  name: 'Véhicules',  endpoint: '/vehicules',  emoji: '🚌' },
    { id: 'chauffeurs', name: 'Chauffeurs', endpoint: '/chauffeurs', emoji: '👨‍✈️' },
    { id: 'trajets',    name: 'Trajets',    endpoint: '/trajets',    emoji: '🗺️' },
    { id: 'incidents',  name: 'Incidents',  endpoint: '/incidents',  emoji: '⚠️' },
    { id: 'lignes',     name: 'Lignes',     endpoint: '/lignes',     emoji: '🛤️' },
    { id: 'tarifs',     name: 'Tarifs',     endpoint: '/tarifs',     emoji: '💰' },
  ], []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setSearch('');
      setSelectedLigne(null);
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  }, [data, search]);

  const exportCSV = () => {
    if (data.length === 0) return;
    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    const rows = data.map(row =>
      columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeView}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatHeader = (key) =>
    key.replace(/_/g, ' ').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return <span className="opacity-30">—</span>;
    if (typeof value === 'number') {
      if (key.includes('prix') || key.includes('recette'))
        return <span className="text-accentSecondary font-semibold">{value.toLocaleString()} FCFA</span>;
      if (key.includes('date') || key.includes('heure'))
        return new Date(value).toLocaleString('fr-FR');
    }
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${value ? 'bg-[#00d4aa]/15 text-[#00d4aa]' : 'bg-[#ff6b9d]/15 text-[#ff6b9d]'}`}>
          {value ? '✓ Oui' : '✗ Non'}
        </span>
      );
    }
    return String(value);
  };

  const mapData = selectedLigne ? LIGNES_MAP_DATA[selectedLigne.code] : null;

  return (
    <div className="animate-fade-slide-up opacity-0 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-textPrimary mb-1 tracking-tight">Explorateur de Données</h2>
        <p className="text-textSecondary text-base">Consultez, filtrez et exportez les données en temps réel</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {views.map(view => (
          <button
            key={view.id}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeView === view.id
                ? 'bg-gradient-primary text-white shadow-[0_4px_15px_rgba(124,91,255,0.3)]'
                : 'bg-[var(--bg-surface)] text-textSecondary border border-[var(--border-color)] hover:text-textPrimary hover:bg-[var(--bg-elevated)]'}`}
            onClick={() => setActiveView(view.id)}
          >
            <span className="mr-1.5">{view.emoji}</span>{view.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      {!loading && !error && (
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-bgTertiary border border-[var(--border-color)] rounded-xl py-2.5 pl-9 pr-10 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-accentPrimary/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          
          <button
            onClick={exportCSV}
            disabled={data.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/20 rounded-xl text-sm text-[#00d4aa] font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={15} /> Export
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#7c5bff]/20 border-t-accentPrimary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#ff6b9d]">
          <AlertTriangle size={48} />
          <p className="text-lg font-medium">{error}</p>
          <button onClick={fetchData} className="px-5 py-2.5 bg-accentPrimary rounded-lg text-white">Réessayer</button>
        </div>
      ) : (
        <div className={`flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden transition-all duration-500`}>
          
          {/* Table Container */}
          <div className={`flex-1 bg-bgSurface backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-lg flex flex-col overflow-hidden transition-all duration-500`}>
            {activeView === 'lignes' && (
              <div className="bg-accentInfo/10 px-4 py-3 border-b border-accentInfo/20 flex items-center gap-2 text-sm text-accentInfo font-medium">
                <MapPin size={16} /> Cliquez sur une ligne de transport pour visualiser son itinéraire sur la carte !
              </div>
            )}
            
            <div className="flex-1 overflow-auto">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center gap-3 text-center py-16 text-textMuted">
                  <FileX size={40} className="opacity-40" />
                  <p className="text-sm">Aucune donnée disponible.</p>
                </div>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-bgTertiary z-[2] shadow-sm">
                    <tr>
                      {Object.keys(filteredData[0]).filter(k => !['created_at', 'updated_at'].includes(k)).map(col => (
                        <th key={col} className="px-5 py-4 text-left font-semibold text-textSecondary uppercase text-[10px] tracking-widest border-b border-[var(--border-color)] whitespace-nowrap">
                          {formatHeader(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, idx) => (
                      <tr key={idx} 
                          onClick={() => { if (activeView === 'lignes') setSelectedLigne(row); }}
                          className={`transition-colors duration-100 border-b border-[var(--border-color)] last:border-b-0
                            ${activeView === 'lignes' ? 'cursor-pointer hover:bg-accentPrimary/10' : 'hover:bg-bgElevated'}
                            ${selectedLigne && selectedLigne.id === row.id ? 'bg-accentPrimary/20' : ''}`}>
                        {Object.keys(filteredData[0]).filter(k => !['created_at', 'updated_at'].includes(k)).map(col => (
                          <td key={col} className="px-5 py-3.5 text-textPrimary whitespace-nowrap text-sm">
                            {formatValue(row[col], col)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Map Container (Only visible if activeView === 'lignes' and a ligne is selected) */}
          {activeView === 'lignes' && selectedLigne && (
            <div className="lg:w-[450px] w-full bg-bgSurface backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-lg flex flex-col overflow-hidden animate-scale-in">
              <div className="p-4 border-b border-[var(--border-color)] bg-bgTertiary flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-textPrimary">{selectedLigne.nom}</h3>
                  <p className="text-xs text-textSecondary">{selectedLigne.depart} <span className="mx-1">→</span> {selectedLigne.arrivee}</p>
                </div>
                <button onClick={() => setSelectedLigne(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-textMuted hover:text-textPrimary">
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 relative bg-[#e5e5e5] dark:bg-[#0f0f14]">
                {mapData ? (
                  <MapContainer center={mapData.path[1] || mapData.path[0]} zoom={11} scrollWheelZoom={true} className="w-full h-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={mapData.path} color={mapData.color} weight={5} opacity={0.8} />
                    <Marker position={mapData.path[0]}>
                      <Popup>Départ: {selectedLigne.depart}</Popup>
                    </Marker>
                    <Marker position={mapData.path[mapData.path.length - 1]}>
                      <Popup>Arrivée: {selectedLigne.arrivee}</Popup>
                    </Marker>
                    <RecenterMap path={mapData.path} />
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-textMuted text-sm">
                    Données GPS non disponibles pour cette ligne.
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-[var(--border-color)] bg-bgTertiary flex justify-between text-xs text-textSecondary">
                <span>Distance: <strong>{selectedLigne.distance_km} km</strong></span>
                <span>Durée estimée: <strong>{selectedLigne.duree_estimee} min</strong></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataViews;
