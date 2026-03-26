import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PortfolioSummary from '../components/PortfolioSummary';
import InvestmentTable from '../components/InvestmentTable';

describe('PortfolioSummary', () => {
  const summary = {
    totalInvested: 100000,
    totalCurrentValue: 125000,
    totalGainLoss: 25000,
    totalGainLossPercent: 25,
    totalAssets: 5,
  };

  it('should render all summary cards', () => {
    render(<PortfolioSummary summary={summary} />);

    expect(screen.getByText('Total Invested')).toBeInTheDocument();
    expect(screen.getByText('Current Value')).toBeInTheDocument();
    expect(screen.getByText('Total Gain/Loss')).toBeInTheDocument();
    expect(screen.getByText('Total Assets')).toBeInTheDocument();
  });

  it('should display formatted currency values', () => {
    render(<PortfolioSummary summary={summary} />);

    expect(screen.getByText('$100,000.00')).toBeInTheDocument();
    expect(screen.getByText('$125,000.00')).toBeInTheDocument();
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
  });

  it('should display total assets count', () => {
    render(<PortfolioSummary summary={summary} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show gain percentage', () => {
    render(<PortfolioSummary summary={summary} />);
    expect(screen.getByText('+25.00%')).toBeInTheDocument();
  });

  it('should return null when no summary', () => {
    const { container } = render(<PortfolioSummary summary={null} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('InvestmentTable', () => {
  const investments = [
    {
      _id: '1',
      assetName: 'TCS',
      assetType: 'Equity',
      purchaseDate: '2024-01-15',
      purchasePrice: 3500,
      quantity: 10,
      currentPrice: 3820,
    },
    {
      _id: '2',
      assetName: 'Bitcoin',
      assetType: 'Crypto',
      purchaseDate: '2024-03-01',
      purchasePrice: 50000,
      quantity: 0.5,
      currentPrice: 67250,
    },
  ];

  const mockEdit = vi.fn();
  const mockDelete = vi.fn();

  it('should render all investment rows', () => {
    render(<InvestmentTable investments={investments} onEdit={mockEdit} onDelete={mockDelete} />);

    expect(screen.getByText('TCS')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Equity')).toBeInTheDocument();
    expect(screen.getByText('Crypto')).toBeInTheDocument();
  });

  it('should show empty state when no investments', () => {
    render(<InvestmentTable investments={[]} onEdit={mockEdit} onDelete={mockDelete} />);

    expect(screen.getByText('No investments found')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    render(<InvestmentTable investments={investments} onEdit={mockEdit} onDelete={mockDelete} />);

    const editButtons = screen.getAllByTitle('Edit');
    await user.click(editButtons[0]);

    expect(mockEdit).toHaveBeenCalledWith(investments[0]);
  });

  it('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    render(<InvestmentTable investments={investments} onEdit={mockEdit} onDelete={mockDelete} />);

    const deleteButtons = screen.getAllByTitle('Delete');
    await user.click(deleteButtons[0]);

    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('should display formatted quantities', () => {
    render(<InvestmentTable investments={investments} onEdit={mockEdit} onDelete={mockDelete} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('0.5')).toBeInTheDocument();
  });
});
