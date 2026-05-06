import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Ticket {
  id: number;
  qrCodeData: string;
  ticketType: {
    name: string;
    price: number;
    event: {
      name: string;
      venue: string;
      dateTime: string;
    };
  };
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/my-tickets');
        setTickets(response.data);
      } catch (err) {
        console.error('Failed to fetch tickets');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">confirmation_number</span>
            My Tickets
          </h1>
          <p className="text-slate-500 mt-2">Manage and view your digital event passes.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">local_activity</span>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tickets found</h3>
             <p className="text-slate-500 mb-6">You haven't purchased any tickets yet.</p>
             <button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold">
               Explore Events
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const eventDate = new Date(ticket.ticketType.event.dateTime);
              return (
                <div key={ticket.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="bg-primary/10 p-6 flex flex-col items-center justify-center border-b border-primary/20">
                    <span className="material-symbols-outlined text-5xl text-primary mb-2">qr_code_2</span>
                    <span className="text-sm font-bold text-primary tracking-widest uppercase">Valid Pass</span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-4">
                      {ticket.ticketType.event.name}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-sm">
                        <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-slate-500">{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {ticket.ticketType.event.venue}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <span className="material-symbols-outlined text-slate-400 text-lg">sell</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {ticket.ticketType.name} - ${ticket.ticketType.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        View QR Code
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* QR Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">confirmation_number</span>
                Entry Ticket
              </h3>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                {selectedTicket.ticketType.event.name}
              </h2>
              <p className="text-slate-500 text-center text-sm mb-8">Show this QR code to the event staff</p>
              
              <div className="bg-white p-4 rounded-xl border-4 border-primary/20 shadow-lg mb-6">
                 {/* QR Image fallback or actual URL */}
                 {selectedTicket.qrCodeData ? (
                    <img src={`data:image/png;base64,${selectedTicket.qrCodeData}`} alt="QR Code" className="w-48 h-48" />
                 ) : (
                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 flex-col gap-2">
                      <span className="material-symbols-outlined text-4xl">qr_code_scanner</span>
                      <span className="text-xs">QR Data Missing</span>
                    </div>
                 )}
              </div>
              
              <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Type</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedTicket.ticketType.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase">Ticket ID</p>
                  <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">#{selectedTicket.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
