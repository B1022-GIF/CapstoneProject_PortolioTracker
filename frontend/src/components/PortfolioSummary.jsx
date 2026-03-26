import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { formatCurrency, formatPercent, gainLossClass } from '../utils/format';

export default function PortfolioSummary({ summary }) {
  if (!summary) return null;

  const { totalInvested, totalCurrentValue, totalGainLoss, totalGainLossPercent, totalAssets } = summary;
  const isGain = totalGainLoss >= 0;

  const cards = [
    {
      title: 'Total Invested',
      value: formatCurrency(totalInvested),
      icon: <FiDollarSign className="text-blue-500" size={24} />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Current Value',
      value: formatCurrency(totalCurrentValue),
      icon: <FiPieChart className="text-indigo-500" size={24} />,
      bg: 'bg-indigo-50',
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(totalGainLoss),
      subValue: formatPercent(totalGainLossPercent),
      icon: isGain
        ? <FiTrendingUp className="text-green-500" size={24} />
        : <FiTrendingDown className="text-red-500" size={24} />,
      bg: isGain ? 'bg-green-50' : 'bg-red-50',
      valueClass: gainLossClass(totalGainLoss),
    },
    {
      title: 'Total Assets',
      value: totalAssets,
      icon: <FiPieChart className="text-purple-500" size={24} />,
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="card flex items-start gap-4">
          <div className={`p-3 rounded-xl ${card.bg}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className={`text-xl font-bold ${card.valueClass || ''}`}>{card.value}</p>
            {card.subValue && (
              <p className={`text-sm font-medium ${card.valueClass || ''}`}>{card.subValue}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
