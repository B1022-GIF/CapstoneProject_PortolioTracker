import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import InvestmentForm from '../components/InvestmentForm';
import InvestmentTable from '../components/InvestmentTable';
import { FiPlus, FiSearch } from 'react-icons/fi';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [search, setSearch] = useState('');
  const [assetType, setAssetType] = useState('All');

  const ASSET_TYPES = ['All', 'Equity', 'Debt', 'Mutual Fund', 'Crypto', 'ETF', 'Bonds', 'Other'];

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (assetType !== 'All') params.assetType = assetType;
      if (search) params.search = search;

      const res = await api.get('/investments', { params });
      setInvestments(res.data);
    } catch {
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [assetType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInvestments();
  };

  const handleAdd = async (data) => {
    try {
      await api.post('/investments', data);
      toast.success('Investment added!');
      setShowForm(false);
      fetchInvestments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add investment');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/investments/${editingInvestment._id}`, data);
      toast.success('Investment updated!');
      setEditingInvestment(null);
      setShowForm(false);
      fetchInvestments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update investment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) return;
    try {
      await api.delete(`/investments/${id}`);
      toast.success('Investment deleted');
      fetchInvestments();
    } catch {
      toast.error('Failed to delete investment');
    }
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInvestment(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Investments</h1>
        <button
          onClick={() => { setEditingInvestment(null); setShowForm(!showForm); }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Investment
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </h2>
          <InvestmentForm
            initialData={editingInvestment}
            onSubmit={editingInvestment ? handleUpdate : handleAdd}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Search & Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by asset name..."
                className="input-field"
              />
              <button type="submit" className="btn-primary px-3">
                <FiSearch />
              </button>
            </div>
          </form>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="select-field"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Investment Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <InvestmentTable
            investments={investments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
