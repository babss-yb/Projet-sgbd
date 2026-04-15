import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X } from 'lucide-react';
import { CITIES } from './RouteMapData';

// Fix leaflet icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Import route data from DataViews
// Note: We're using simplified paths for the Dashboard to avoid token limits
// The full detailed routes are available in DataViews.js
const LIGNES_MAP_DATA = {
  'L01': { nom: 'Dakar - Pikine', color: '#4dabf7', path: [CITIES['Dakar'], CITIES['Pikine']] },
  'L02': { nom: 'Dakar - Rufisque', color: '#00d4aa', path: [CITIES['Dakar'], CITIES['Rufisque']] },
  'L03': { nom: 'Dakar - Thiès', color: '#7c5bff', path: [CITIES['Dakar'], CITIES['Thies']] },
  'L04': { nom: 'Pikine - Rufisque', color: '#ffb347', path: [CITIES['Pikine'], CITIES['Rufisque']] },
  'L05': { nom: 'Dakar - Mbour', color: '#ff6b9d', path: [CITIES['Dakar'], CITIES['Mbour']] },
};

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, 10);
    }
  }, [center, map]);
  return null;
}

function RouteMap({ compact = false, onClose }) {
  const [selectedLigne, setSelectedLigne] = useState(null);

  const mapHeight = compact ? '300px' : '400px';

  return (
    <div className="bg-bgSurface backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-[var(--border-color)] bg-bgTertiary flex justify-between items-center">
        <div>
          <h3 className="font-bold text-textPrimary">Carte des Lignes</h3>
          <p className="text-xs text-textSecondary">Cliquez sur un trajet pour le visualiser</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-textMuted hover:text-textPrimary">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="relative bg-[#e5e5e5] dark:bg-[#0f0f14]" style={{ height: mapHeight }}>
        <MapContainer center={[14.6928, -17.4333]} zoom={10} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.entries(LIGNES_MAP_DATA).map(([key, ligne]) => {
            const isSelected = selectedLigne === key;
            const shouldShow = !selectedLigne || isSelected;
            
            if (!shouldShow) return null;
            
            return (
              <React.Fragment key={key}>
                <Polyline 
                  positions={ligne.path} 
                  color={ligne.color} 
                  weight={isSelected ? 6 : 3} 
                  opacity={isSelected ? 1 : selectedLigne ? 0 : 0.5}
                />
                {isSelected && (
                  <>
                    <Marker position={ligne.path[0]}>
                      <Popup>{ligne.nom} - Départ</Popup>
                    </Marker>
                    <Marker position={ligne.path[ligne.path.length - 1]}>
                      <Popup>{ligne.nom} - Arrivée</Popup>
                    </Marker>
                  </>
                )}
              </React.Fragment>
            );
          })}
          {selectedLigne && LIGNES_MAP_DATA[selectedLigne] && (
            <RecenterMap center={LIGNES_MAP_DATA[selectedLigne].path[0]} />
          )}
        </MapContainer>
      </div>
      <div className="p-3 border-t border-[var(--border-color)] bg-bgTertiary">
        <div className="flex flex-wrap gap-2">
          {Object.entries(LIGNES_MAP_DATA).map(([key, ligne]) => (
            <button
              key={key}
              onClick={() => setSelectedLigne(selectedLigne === key ? null : key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedLigne === key 
                  ? 'text-white shadow-md' 
                  : 'text-textSecondary bg-white/5 hover:bg-white/10'
              }`}
              style={{ backgroundColor: selectedLigne === key ? ligne.color : '' }}
            >
              {ligne.nom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RouteMap;
