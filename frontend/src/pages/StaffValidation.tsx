import React, { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface ValidationResult {
  valid: boolean;
  message: string;
  ticketDetails?: {
    id: number;
    eventName: string;
    ticketType: string;
    attendeeName: string;
  };
}

const StaffValidation: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    try {
      // Assuming a dedicated validation endpoint or using get by ID
      const response = await api.post(`/staff/validate/${ticketId}`);
      // If we got the ticket, it's valid in this simple mock
      // Ideally backend sets a "used" flag
      setResult({
        valid: true,
        message: 'Ticket Validated Successfully',
        ticketDetails: {
          id: response.data.id,
          eventName: response.data.ticketType.event.name,
          ticketType: response.data.ticketType.name,
          attendeeName: response.data.attendee.username
        }
      });
    } catch (err: any) {
      setResult({
        valid: false,
        message: 'Invalid or missing Ticket ID',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-lg mx-auto px-4 sm:px-6 py-12 w-full flex flex-col items-center">
        <div className="w-full text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-4xl">qr_code_scanner</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Ticket Validation
          </h1>
          <p className="text-slate-500">Staff Portal: Scan or enter ticket ID manually.</p>
        </div>

        <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          {/* Top border decoration */}
          <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
          
          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Enter Ticket ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">tag</span>
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-10 pr-4 py-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-xl font-mono text-center tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-slate-400"
                  placeholder="e.g. 402"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !ticketId.trim()}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                 <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : 'Validate Ticket'}
            </button>
          </form>
        </div>

        {/* Validation Result */}
        {result && (
          <div className={`w-full rounded-xl border p-6 flex items-start gap-4 shadow-sm animate-fade-in
            ${result.valid 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
              ${result.valid ? 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400'}`}
            >
              <span className="material-symbols-outlined text-3xl">
                {result.valid ? 'check_circle' : 'cancel'}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className={`text-xl font-black mb-1
                ${result.valid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}
              >
                {result.message}
              </h3>
              
              {result.valid && result.ticketDetails && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between border-b border-green-200 dark:border-green-800/50 pb-2">
                    <span className="text-green-700 dark:text-green-400/80 text-sm font-semibold">Event</span>
                    <span className="text-green-900 dark:text-green-100 font-bold text-right">{result.ticketDetails.eventName}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-200 dark:border-green-800/50 pb-2">
                    <span className="text-green-700 dark:text-green-400/80 text-sm font-semibold">Attendee</span>
                    <span className="text-green-900 dark:text-green-100 font-bold">{result.ticketDetails.attendeeName}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-green-700 dark:text-green-400/80 text-sm font-semibold">Tier</span>
                    <span className="text-green-900 dark:text-green-100 font-bold bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded text-xs">{result.ticketDetails.ticketType}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffValidation;
