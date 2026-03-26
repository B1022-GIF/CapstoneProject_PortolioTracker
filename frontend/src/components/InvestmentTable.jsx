import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatCurrency, formatPercent, formatDate, gainLossClass } from '../utils/format';

export default function InvestmentTable({ investments, onEdit, onDelete }) {
  if (!investments || investments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No investments found</p>
        <p className="text-sm mt-1">Add your first investment to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-600">
            <th className="pb-3 font-semibold">Asset</th>
            <th className="pb-3 font-semibold">Type</th>
            <th className="pb-3 font-semibold">Date</th>
            <th className="pb-3 font-semibold text-right">Qty</th>
            <th className="pb-3 font-semibold text-right">Buy Price</th>
            <th className="pb-3 font-semibold text-right">Current</th>
            <th className="pb-3 font-semibold text-right">Invested</th>
            <th className="pb-3 font-semibold text-right">Value</th>
            <th className="pb-3 font-semibold text-right">Gain/Loss</th>
            <th className="pb-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => {
            const invested = inv.purchasePrice * inv.quantity;
            const current = inv.currentPrice * inv.quantity;
            const gl = current - invested;
            const glPct = invested > 0 ? ((gl / invested) * 100) : 0;

            return (
              <tr key={inv._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 font-medium">{inv.assetName}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    {inv.assetType}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{formatDate(inv.purchaseDate)}</td>
                <td className="py-3 text-right">{inv.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(inv.purchasePrice)}</td>
                <td className="py-3 text-right">{formatCurrency(inv.currentPrice)}</td>
                <td className="py-3 text-right">{formatCurrency(invested)}</td>
                <td className="py-3 text-right">{formatCurrency(current)}</td>
                <td className={`py-3 text-right font-semibold ${gainLossClass(gl)}`}>
                  {formatCurrency(gl)}
                  <br />
                  <span className="text-xs">{formatPercent(glPct)}</span>
                </td>
                <td className="py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(inv)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(inv._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
