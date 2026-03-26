import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InvestmentForm from '../components/InvestmentForm';

describe('InvestmentForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  it('should render all form fields', () => {
    render(<InvestmentForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/asset name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asset type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('should show "Add Investment" button for new entry', () => {
    render(<InvestmentForm onSubmit={mockSubmit} />);
    expect(screen.getByText('Add Investment')).toBeInTheDocument();
  });

  it('should show "Update Investment" button when editing', () => {
    const initialData = {
      assetName: 'TCS',
      assetType: 'Equity',
      purchaseDate: '2024-01-15',
      purchasePrice: 3500,
      quantity: 10,
      notes: '',
    };
    render(<InvestmentForm onSubmit={mockSubmit} initialData={initialData} />);
    expect(screen.getByText('Update Investment')).toBeInTheDocument();
  });

  it('should show Cancel button when onCancel provided', () => {
    render(<InvestmentForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should not show Cancel button when onCancel not provided', () => {
    render(<InvestmentForm onSubmit={mockSubmit} />);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('should call onCancel when Cancel clicked', async () => {
    const user = userEvent.setup();
    render(<InvestmentForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    await user.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('should populate fields when initialData provided', () => {
    const initialData = {
      assetName: 'TCS',
      assetType: 'Equity',
      purchaseDate: '2024-01-15',
      purchasePrice: 3500,
      quantity: 10,
      notes: 'Test note',
    };
    render(<InvestmentForm onSubmit={mockSubmit} initialData={initialData} />);

    expect(screen.getByDisplayValue('TCS')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3500')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test note')).toBeInTheDocument();
  });

  it('should have all asset type options', () => {
    render(<InvestmentForm onSubmit={mockSubmit} />);

    const select = screen.getByLabelText(/asset type/i);
    const options = Array.from(select.querySelectorAll('option')).map((o) => o.value);

    expect(options).toContain('Equity');
    expect(options).toContain('Debt');
    expect(options).toContain('Mutual Fund');
    expect(options).toContain('Crypto');
    expect(options).toContain('ETF');
    expect(options).toContain('Bonds');
    expect(options).toContain('Other');
  });
});
