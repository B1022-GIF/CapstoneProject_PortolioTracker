import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import PortfolioSummary from '../components/PortfolioSummary';
import DiversificationChart from '../components/DiversificationChart';
import PerformanceChart from '../components/PerformanceChart';
import GainLossTable from '../components/GainLossTable';
import Filters from '../components/Filters';
import ExportActions from '../components/ExportActions';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeRange: 'ALL',
    assetType: 'All',
    filter: 'all',
  });

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.timeRange !== 'ALL') params.timeRange = filters.timeRange;
      if (filters.assetType !== 'All') params.assetType = filters.assetType;
      if (filters.filter !== 'all') params.filter = filters.filter;

      const res = await api.get('/portfolio/dashboard', { params });
      setDashboardData(res.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <ExportActions />
      </div>

      {/* Filters */}
      <Filters filters={filters} onChange={setFilters} />

      {/* Summary Cards */}
      {dashboardData?.summary && (
        <PortfolioSummary summary={dashboardData.summary} />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Portfolio Performance (30 Days)</h2>
          <PerformanceChart data={dashboardData?.historicalPerformance} />
        </div>
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Diversification</h2>
          <DiversificationChart data={dashboardData?.diversification} />
        </div>
      </div>

      {/* Gain/Loss Table */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">Gain/Loss per Asset</h2>
        <GainLossTable investments={dashboardData?.investments} />
      </div>
    </div>
  );
}
