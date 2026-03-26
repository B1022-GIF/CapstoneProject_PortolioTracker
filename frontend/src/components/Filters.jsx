const ASSET_TYPES = ['All', 'Equity', 'Debt', 'Mutual Fund', 'Crypto', 'ETF', 'Bonds', 'Other'];
const TIME_RANGES = [
  { label: '1 Month', value: '1M' },
  { label: '3 Months', value: '3M' },
  { label: '6 Months', value: '6M' },
  { label: '1 Year', value: '1Y' },
  { label: 'All Time', value: 'ALL' },
];
const GAIN_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Gainers', value: 'gainers' },
  { label: 'Losers', value: 'losers' },
];

export default function Filters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Time Range</label>
        <select
          value={filters.timeRange || 'ALL'}
          onChange={(e) => handleChange('timeRange', e.target.value)}
          className="select-field text-sm"
        >
          {TIME_RANGES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Asset Class</label>
        <select
          value={filters.assetType || 'All'}
          onChange={(e) => handleChange('assetType', e.target.value)}
          className="select-field text-sm"
        >
          {ASSET_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Filter</label>
        <select
          value={filters.filter || 'all'}
          onChange={(e) => handleChange('filter', e.target.value)}
          className="select-field text-sm"
        >
          {GAIN_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
