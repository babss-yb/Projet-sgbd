import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bus, Users, MapPin, AlertTriangle, TrendingUp, Clock, Activity, ShieldAlert } from 'lucide-react';

function Dashboard({ apiUrl }) {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/dashboard`);
      setKpi(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur de connexion. Vérifiez que l\'API est lancée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchKPI();
  }, [fetchKPI]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-[#7c5bff]/20 border-t-accentPrimary rounded-full animate-spin"></div>
        <div className="text-textSecondary font-medium tracking-wide">Analyse des données en cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-accentTertiary">
        <AlertTriangle size={48} />
        <p className="text-lg font-medium">{error}</p>
        <button 
          onClick={fetchKPI} 
          className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/80 transition-colors border-none rounded-lg text-white cursor-pointer mt-2"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-slide-up opacity-0">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-textPrimary mb-2 tracking-tight">Vue d'ensemble</h2>
        <p className="text-base text-textSecondary">Métriques en temps réel du réseau de transport urbain</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <KPICard 
          icon={<Bus size={24} />}
          title="Flotte Active"
          value={kpi.vehicules.total}
          stat1={{ label: 'En service', val: kpi.vehicules.actifs, color: 'text-[#00d4aa]' }}
          stat2={{ label: 'Au garage/Maint.', val: kpi.vehicules.maintenance, color: 'text-[#ffb347]' }}
          colorClass="bg-gradient-card-blue border-[#4dabf7]/20 hover:shadow-[0_10px_30px_rgba(77,171,247,0.15)]"
          iconClass="bg-[#4dabf7]/15 text-[#4dabf7]"
        />
        
        <KPICard 
          icon={<Users size={24} />}
          title="Personnel"
          value={kpi.chauffeurs.total}
          stat1={{ label: 'En poste', val: kpi.chauffeurs.actifs, color: 'text-[#00d4aa]' }}
          colorClass="bg-gradient-card-green border-[#00d4aa]/20 hover:shadow-[0_10px_30px_rgba(0,212,170,0.15)]"
          iconClass="bg-[#00d4aa]/15 text-[#00d4aa]"
        />
        
        <KPICard 
          icon={<MapPin size={24} />}
          title="Opérations"
          value={kpi.trajets.total}
          stat1={{ label: 'Trajets terminés', val: kpi.trajets.termines, color: 'text-[#7c5bff]' }}
          stat2={{ label: 'En cours', val: kpi.trajets.en_cours, color: 'text-[#00d4aa]' }}
          colorClass="bg-gradient-card-purple border-[#7c5bff]/20 hover:shadow-[0_10px_30px_rgba(124,91,255,0.15)]"
          iconClass="bg-[#7c5bff]/15 text-[#7c5bff]"
        />
        
        <KPICard 
          icon={<ShieldAlert size={24} />}
          title="Alertes Sécurité"
          value={kpi.incidents.total}
          stat1={{ label: 'Non résolus', val: kpi.incidents.non_resolus, color: 'text-[#ff6b9d]' }}
          stat2={{ label: 'Signalés ce mois', val: kpi.incidents.ce_mois, color: 'text-[#ffb347]' }}
          colorClass="bg-gradient-card-red border-[#ff6b9d]/20 hover:shadow-[0_10px_30px_rgba(255,107,157,0.15)]"
          iconClass="bg-[#ff6b9d]/15 text-[#ff6b9d]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatCard 
          icon={<Activity size={28} />}
          title="Volume Hebdomadaire"
          value={kpi.trajets.cette_semaine}
          description="Courses complétées au cours des 7 derniers jours"
        />
        <StatCard 
          icon={<Clock size={28} />}
          title="Incidents Mensuels"
          value={kpi.incidents.ce_mois}
          description="Anomalies recensées sur le réseau ce mois-ci"
        />
      </div>
    </div>
  );
}

function KPICard({ icon, title, value, stat1, stat2, colorClass, iconClass }) {
  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border bg-bgSurface backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] group ${colorClass}`}>
      {/* Light sweep effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-widest">{title}</h3>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] ${iconClass}`}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-extrabold text-textPrimary leading-none mb-4 relative z-10">{value}</div>
      <div className="flex gap-4 mt-4 relative z-10">
        {stat1 && (
          <div className="flex flex-col">
            <span className="text-xs text-textMuted mb-0.5">{stat1.label}</span>
            <span className={`text-sm font-semibold ${stat1.color}`}>{stat1.val}</span>
          </div>
        )}
        {stat2 && (
          <div className="flex flex-col border-l border-white/10 pl-4">
            <span className="text-xs text-textMuted mb-0.5">{stat2.label}</span>
            <span className={`text-sm font-semibold ${stat2.color}`}>{stat2.val}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, description }) {
  return (
    <div className="flex items-center gap-6 p-6 bg-bgSurface backdrop-blur-xl border border-white/5 rounded-2xl transition-transform duration-300 hover:scale-[1.02] hover:border-white/10">
      <div className="w-14 h-14 bg-bgTertiary border border-white/5 text-textPrimary rounded-2xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm text-textSecondary font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold text-textPrimary mb-1">{value}</div>
        <p className="text-xs text-textMuted">{description}</p>
      </div>
    </div>
  );
}

export default Dashboard;
