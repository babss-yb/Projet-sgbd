import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { AlertTriangle, RefreshCw, ShieldAlert, Activity, Clock } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === null || target === undefined) return;
    const start = () => {
      startTime.current = performance.now();
      const step = (now) => {
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };
    start();
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

/* ── Sparkline mini-chart ── */
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  return (
    <div className="absolute bottom-4 right-4 w-24 h-10 opacity-50 group-hover:opacity-80 transition-opacity duration-300">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
          <Tooltip contentStyle={{ display: 'none' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── KPI Card with animated counter ── */
function KPICard({ icon, title, value, stat1, stat2, colorClass, iconClass, sparkData, sparkColor }) {
  const animatedValue = useCountUp(value);

  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] group cursor-default ${colorClass}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-widest">{title}</h3>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] ${iconClass}`}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-extrabold text-textPrimary leading-none mb-4 relative z-10 tabular-nums">
        {animatedValue}
      </div>
      <div className="flex gap-4 relative z-10">
        {stat1 && (
          <div className="flex flex-col">
            <span className="text-[10px] text-textMuted mb-0.5 uppercase tracking-wide">{stat1.label}</span>
            <span className={`text-sm font-semibold ${stat1.color}`}>{stat1.val}</span>
          </div>
        )}
        {stat2 && (
          <div className="flex flex-col border-l border-white/10 pl-4">
            <span className="text-[10px] text-textMuted mb-0.5 uppercase tracking-wide">{stat2.label}</span>
            <span className={`text-sm font-semibold ${stat2.color}`}>{stat2.val}</span>
          </div>
        )}
      </div>
      <Sparkline data={sparkData} color={sparkColor} />
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, title, value, description, accent }) {
  const animatedValue = useCountUp(value);
  return (
    <div className="flex items-center gap-6 p-6 bg-bgSurface backdrop-blur-xl border border-white/5 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/10 group">
      <div className={`w-14 h-14 border text-textPrimary rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${accent || 'bg-bgTertiary border-white/5'}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm text-textSecondary font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold text-textPrimary mb-1 tabular-nums">{animatedValue}</div>
        <p className="text-xs text-textMuted">{description}</p>
      </div>
    </div>
  );
}

/* ── Last updated badge ── */
function LastUpdated({ time }) {
  if (!time) return null;
  return (
    <span className="text-xs text-textMuted">
      Actualisé à {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

/* ── Main Dashboard ── */
function Dashboard({ apiUrl }) {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchKPI = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const response = await axios.get(`${apiUrl}/dashboard`);
      setKpi(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Erreur de connexion. Vérifiez que l\'API est lancée.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiUrl]);

  useEffect(() => { fetchKPI(); }, [fetchKPI]);

  // Auto-refresh toutes les 60 secondes
  useEffect(() => {
    const interval = setInterval(() => fetchKPI(true), 60000);
    return () => clearInterval(interval);
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-[#ff6b9d]">
        <AlertTriangle size={48} />
        <p className="text-lg font-medium">{error}</p>
        <button onClick={() => fetchKPI()} className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/80 transition-colors border-none rounded-lg text-white cursor-pointer mt-2">
          Réessayer
        </button>
      </div>
    );
  }

  // Générer des mini données fictives pour les sparklines
  const mockVehiculeData = [1,3,2,5,4,6,5,7,kpi.vehicules.actifs].map(v => ({ v }));
  const mockTrajetData   = [10,14,12,20,18,22,19,25,kpi.trajets.cette_semaine].map(v => ({ v }));
  const mockIncidentData = [2,1,3,2,4,3,2,1,kpi.incidents.ce_mois].map(v => ({ v }));
  const mockChaufData    = [5,6,5,7,6,8,7,9,kpi.chauffeurs.actifs].map(v => ({ v }));

  return (
    <div className="animate-fade-slide-up opacity-0">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-textPrimary mb-1 tracking-tight">Vue d'ensemble</h2>
          <p className="text-base text-textSecondary">Métriques en temps réel du réseau de transport urbain</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => fetchKPI(true)}
            disabled={refreshing}
            title="Actualiser les données"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-textSecondary hover:text-textPrimary transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
          <LastUpdated time={lastUpdated} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KPICard
          icon={<Activity size={22} />}
          title="Flotte Active"
          value={kpi.vehicules.total}
          stat1={{ label: 'En service', val: kpi.vehicules.actifs, color: 'text-[#4dabf7]' }}
          stat2={{ label: 'Maintenance', val: kpi.vehicules.maintenance, color: 'text-[#ffb347]' }}
          colorClass="bg-gradient-card-blue border-[#4dabf7]/20 hover:shadow-[0_10px_30px_rgba(77,171,247,0.15)]"
          iconClass="bg-[#4dabf7]/15 text-[#4dabf7]"
          sparkData={mockVehiculeData}
          sparkColor="#4dabf7"
        />
        <KPICard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          title="Personnel"
          value={kpi.chauffeurs.total}
          stat1={{ label: 'En poste', val: kpi.chauffeurs.actifs, color: 'text-[#00d4aa]' }}
          colorClass="bg-gradient-card-green border-[#00d4aa]/20 hover:shadow-[0_10px_30px_rgba(0,212,170,0.15)]"
          iconClass="bg-[#00d4aa]/15 text-[#00d4aa]"
          sparkData={mockChaufData}
          sparkColor="#00d4aa"
        />
        <KPICard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
          title="Opérations"
          value={kpi.trajets.total}
          stat1={{ label: 'Terminés', val: kpi.trajets.termines, color: 'text-[#7c5bff]' }}
          stat2={{ label: 'En cours', val: kpi.trajets.en_cours, color: 'text-[#00d4aa]' }}
          colorClass="bg-gradient-card-purple border-[#7c5bff]/20 hover:shadow-[0_10px_30px_rgba(124,91,255,0.15)]"
          iconClass="bg-[#7c5bff]/15 text-[#7c5bff]"
          sparkData={mockTrajetData}
          sparkColor="#7c5bff"
        />
        <KPICard
          icon={<ShieldAlert size={22} />}
          title="Alertes Sécurité"
          value={kpi.incidents.total}
          stat1={{ label: 'Non résolus', val: kpi.incidents.non_resolus, color: 'text-[#ff6b9d]' }}
          stat2={{ label: 'Ce mois', val: kpi.incidents.ce_mois, color: 'text-[#ffb347]' }}
          colorClass="bg-gradient-card-red border-[#ff6b9d]/20 hover:shadow-[0_10px_30px_rgba(255,107,157,0.15)]"
          iconClass="bg-[#ff6b9d]/15 text-[#ff6b9d]"
          sparkData={mockIncidentData}
          sparkColor="#ff6b9d"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <StatCard
          icon={<Activity size={26} />}
          title="Volume Hebdomadaire"
          value={kpi.trajets.cette_semaine}
          description="Courses complétées au cours des 7 derniers jours"
          accent="bg-[#7c5bff]/10 border-[#7c5bff]/20 text-[#7c5bff]"
        />
        <StatCard
          icon={<Clock size={26} />}
          title="Incidents Mensuels"
          value={kpi.incidents.ce_mois}
          description="Anomalies recensées sur le réseau ce mois-ci"
          accent="bg-[#ff6b9d]/10 border-[#ff6b9d]/20 text-[#ff6b9d]"
        />
      </div>

      {/* Detailed Breakdown Section */}
      <div className="bg-bgSurface/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-textPrimary mb-6">Détail par catégorie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Véhicules breakdown */}
          <div className="bg-bgTertiary/50 rounded-xl p-4 border border-white/5">
            <h4 className="text-sm font-semibold text-textSecondary mb-3 flex items-center gap-2">
              <Activity size={16} className="text-[#4dabf7]" />
              Véhicules
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Total</span>
                <span className="font-semibold text-textPrimary">{kpi.vehicules.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Actifs</span>
                <span className="font-semibold text-[#4dabf7]">{kpi.vehicules.actifs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Maintenance</span>
                <span className="font-semibold text-[#ffb347]">{kpi.vehicules.maintenance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Autres</span>
                <span className="font-semibold text-textSecondary">{kpi.vehicules.total - kpi.vehicules.actifs - kpi.vehicules.maintenance}</span>
              </div>
            </div>
          </div>

          {/* Chauffeurs breakdown */}
          <div className="bg-bgTertiary/50 rounded-xl p-4 border border-white/5">
            <h4 className="text-sm font-semibold text-textSecondary mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00d4aa]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Chauffeurs
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Total</span>
                <span className="font-semibold text-textPrimary">{kpi.chauffeurs.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Actifs</span>
                <span className="font-semibold text-[#00d4aa]">{kpi.chauffeurs.actifs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Congé/Suspendu</span>
                <span className="font-semibold text-textSecondary">{kpi.chauffeurs.total - kpi.chauffeurs.actifs}</span>
              </div>
            </div>
          </div>

          {/* Trajets breakdown */}
          <div className="bg-bgTertiary/50 rounded-xl p-4 border border-white/5">
            <h4 className="text-sm font-semibold text-textSecondary mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c5bff]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Trajets
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Total</span>
                <span className="font-semibold text-textPrimary">{kpi.trajets.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Terminés</span>
                <span className="font-semibold text-[#7c5bff]">{kpi.trajets.termines}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">En cours</span>
                <span className="font-semibold text-[#00d4aa]">{kpi.trajets.en_cours}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Planifiés/Annulés</span>
                <span className="font-semibold text-textSecondary">{kpi.trajets.total - kpi.trajets.termines - kpi.trajets.en_cours}</span>
              </div>
            </div>
          </div>

          {/* Incidents breakdown */}
          <div className="bg-bgTertiary/50 rounded-xl p-4 border border-white/5">
            <h4 className="text-sm font-semibold text-textSecondary mb-3 flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#ff6b9d]" />
              Incidents
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Total</span>
                <span className="font-semibold text-textPrimary">{kpi.incidents.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Non résolus</span>
                <span className="font-semibold text-[#ff6b9d]">{kpi.incidents.non_resolus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Résolus</span>
                <span className="font-semibold text-[#00d4aa]">{kpi.incidents.total - kpi.incidents.non_resolus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Ce mois</span>
                <span className="font-semibold text-[#ffb347]">{kpi.incidents.ce_mois}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
