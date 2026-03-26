import { useState } from 'react';
import { FiDownload, FiMail } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ExportActions() {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [exportType, setExportType] = useState('pdf');
  const [sending, setSending] = useState(false);

  const downloadPDF = async () => {
    try {
      const res = await api.get('/export/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'portfolio-summary.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to download PDF');
    }
  };

  const downloadCSV = async () => {
    try {
      const res = await api.get('/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'portfolio-summary.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded!');
    } catch {
      toast.error('Failed to download CSV');
    }
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const endpoint = exportType === 'pdf' ? '/export/email/pdf' : '/export/email/csv';
      await api.post(endpoint, { email });
      toast.success(`Portfolio summary sent to ${email}`);
      setEmailModalOpen(false);
      setEmail('');
    } catch {
      toast.error('Failed to send email. Check email configuration.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={downloadPDF} className="btn-primary flex items-center gap-2 text-sm">
          <FiDownload /> PDF
        </button>
        <button onClick={downloadCSV} className="btn-success flex items-center gap-2 text-sm">
          <FiDownload /> CSV
        </button>
        <button
          onClick={() => setEmailModalOpen(true)}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiMail /> Email
        </button>
      </div>

      {emailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Send Portfolio Summary via Email</h3>
            <form onSubmit={handleEmailSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="select-field"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Email'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEmailModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
