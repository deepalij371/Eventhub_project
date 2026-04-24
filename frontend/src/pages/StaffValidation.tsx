import React, { useState } from 'react';
import api from '../api/axios';
import { QrCode, Search, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ValidatedTicket {
  ticketNumber: string;
  validated: boolean;
  validationDate: string;
  attendee: {
    username: string;
  };
  ticketType: {
    name: string;
    event: {
      name: string;
    }
  }
}

const StaffValidation: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [result, setResult] = useState<ValidatedTicket | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.post(`/staff/validate/${ticketNumber}`);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid ticket or already validated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <QrCode className="text-blue-600" /> Staff Validator
          </h1>
          <button onClick={logout} className="text-gray-600 hover:text-red-600">Logout</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Validate Ticket</h2>

          <form onSubmit={handleValidate} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Ticket Number (e.g. TKT-XXXX)"
                className="flex-grow p-4 border-2 rounded-xl focus:border-blue-500 outline-none uppercase font-mono text-lg"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                {loading ? '...' : <Search size={24} />}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4 border-2 border-red-100 animate-in fade-in">
              <XCircle size={48} />
              <div>
                <p className="font-bold text-xl">Invalid Ticket</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-green-50 text-green-700 p-8 rounded-2xl border-2 border-green-100 animate-in zoom-in">
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle size={56} className="text-green-500" />
                <div>
                  <p className="font-bold text-2xl uppercase">Valid Ticket</p>
                  <p className="text-sm opacity-75">Successfully Validated</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-green-200">
                <div>
                  <p className="text-xs font-bold uppercase opacity-50">Event</p>
                  <p className="text-xl font-bold">{result.ticketType.event.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase opacity-50">Attendee</p>
                    <div className="flex items-center gap-1 font-bold">
                      <User size={16} /> {result.attendee.username}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase opacity-50">Ticket Type</p>
                    <p className="font-bold">{result.ticketType.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase opacity-50">Validated At</p>
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar size={16} /> {new Date(result.validationDate).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm mb-4">OR</p>
            <button className="bg-gray-100 text-gray-700 px-6 py-4 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-gray-200 transition font-bold">
              <QrCode size={24} /> Open Camera Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffValidation;
