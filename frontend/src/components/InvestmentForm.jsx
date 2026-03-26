import { useState, useEffect } from 'react';

const ASSET_TYPES = ['Equity', 'Debt', 'Mutual Fund', 'Crypto', 'ETF', 'Bonds', 'Other'];

export default function InvestmentForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState({
    assetName: '',
    assetType: 'Equity',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    quantity: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        assetName: initialData.assetName || '',
        assetType: initialData.assetType || 'Equity',
        purchaseDate: initialData.purchaseDate
          ? new Date(initialData.purchaseDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        purchasePrice: initialData.purchasePrice || '',
        quantity: initialData.quantity || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      purchasePrice: parseFloat(form.purchasePrice),
      quantity: parseFloat(form.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
          <input
            id="assetName"
            type="text"
            name="assetName"
            value={form.assetName}
            onChange={handleChange}
            required
            placeholder="e.g., Reliance Industries, Bitcoin"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
          <select
            id="assetType"
            name="assetType"
            value={form.assetType}
            onChange={handleChange}
            required
            className="select-field"
          >
            {ASSET_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input
            id="purchaseDate"
            type="date"
            name="purchaseDate"
            value={form.purchaseDate}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (per unit)</label>
          <input
            id="purchasePrice"
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity / Units</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0.0001"
            step="0.0001"
            placeholder="0"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <input
            id="notes"
            type="text"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any notes..."
            className="input-field"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {initialData ? 'Update Investment' : 'Add Investment'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
