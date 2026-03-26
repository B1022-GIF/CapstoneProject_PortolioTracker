import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function DiversificationChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No diversification data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item._id,
    value: parseFloat(item.totalValue.toFixed(2)),
    percentage: item.percentage.toFixed(1),
  }));

  const renderLabel = ({ name, percentage }) => `${name} (${percentage}%)`;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderLabel}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
