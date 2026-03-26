import { formatCurrency, formatPercent, gainLossClass } from '../utils/format';

export default function GainLossTable({ investments }) {
  if (!investments || investments.length === 0) return null;

  const sorted = [...investments].sort((a, b) => b.gainLossPercent - a.gainLossPercent);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-600">
            <th className="pb-3 font-semibold">Asset</th>
            <th className="pb-3 font-semibold">Type</th>
            <th className="pb-3 font-semibold text-right">Invested</th>
            <th className="pb-3 font-semibold text-right">Current</th>
            <th className="pb-3 font-semibold text-right">Gain/Loss</th>
            <th className="pb-3 font-semibold text-right">Return %</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((inv) => (
            <tr key={inv._id} className="border-b border-gray-100">
              <td className="py-2.5 font-medium">{inv.assetName}</td>
              <td className="py-2.5">
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                  {inv.assetType}
                </span>
              </td>
              <td className="py-2.5 text-right">{formatCurrency(inv.investedAmount)}</td>
              <td className="py-2.5 text-right">{formatCurrency(inv.currentValue)}</td>
              <td className={`py-2.5 text-right font-semibold ${gainLossClass(inv.gainLoss)}`}>
                {formatCurrency(inv.gainLoss)}
              </td>
              <td className={`py-2.5 text-right font-semibold ${gainLossClass(inv.gainLossPercent)}`}>
                {formatPercent(inv.gainLossPercent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
