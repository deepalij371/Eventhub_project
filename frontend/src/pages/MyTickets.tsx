import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Ticket as TicketIcon, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Ticket {
  id: number;
  ticketNumber: string;
  qrCodeData: string;
  validated: boolean;
  purchaseDate: string;
  ticketType: {
    name: string;
    event: {
      name: string;
      venue: string;
      dateTime: string;
    }
  }
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/my-tickets');
        setTickets(response.data);
      } catch (err) {
        console.error('Failed to fetch tickets');
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <TicketIcon className="text-blue-600" size={32} /> My Tickets
        </h1>

        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <TicketIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">You don't have any tickets yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className={`w-2 ${ticket.validated ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div className="p-6 flex-grow">
                  <h3 className="font-bold text-lg mb-1">{ticket.ticketType.event.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{ticket.ticketType.name} Ticket</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> {new Date(ticket.ticketType.event.dateTime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> {ticket.ticketType.event.venue}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-400">{ticket.ticketNumber}</span>
                    {ticket.validated ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                        <CheckCircle size={14} /> Validated
                      </span>
                    ) : (
                      <span className="text-blue-600 text-xs font-bold uppercase">Ready to Scan</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <XCircle size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1">{selectedTicket.ticketType.event.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{selectedTicket.ticketType.name} Entry</p>

              <div className="bg-gray-100 p-4 rounded-xl mb-6">
                <img
                  src={`data:image/png;base64,${selectedTicket.qrCodeData}`}
                  alt="QR Code"
                  className="w-full aspect-square object-contain"
                />
              </div>

              <div className="text-left bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-bold mb-1">TICKET NUMBER</p>
                <p className="font-mono font-bold text-lg">{selectedTicket.ticketNumber}</p>
              </div>

              <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest font-bold">
                Scan this at the entrance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
