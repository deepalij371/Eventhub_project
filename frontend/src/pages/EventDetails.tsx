import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  description: string;
  venue: string;
  dateTime: string;
  imageUrl: string;
  ticketTypes: { id: number; name: string; price: number; totalQuantity: number; soldQuantity: number }[];
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/public/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Failed to fetch event');
      }
    };
    fetchEvent();
  }, [id]);

  const handlePurchase = async (ticketTypeId: number) => {
    setPurchasing(true);
    try {
      await api.post('/tickets/purchase', { ticketTypeId });
      setSuccess(true);
      setTimeout(() => navigate('/my-tickets'), 2000);
    } catch (err) {
      alert('Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (!event) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="h-96 w-full bg-gray-200">
        {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />}
      </div>

      <div className="max-w-4xl mx-auto p-8 -mt-20 relative bg-white rounded-t-3xl shadow-xl">
        <h1 className="text-4xl font-bold mb-4">{event.name}</h1>

        <div className="flex flex-wrap gap-6 text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            <span>{new Date(event.dateTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About the Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-4">Tickets</h2>
            {event.ticketTypes.map((tt) => (
              <div key={tt.id} className="mb-4 p-4 bg-white rounded-xl border flex justify-between items-center">
                <div>
                  <p className="font-bold">{tt.name}</p>
                  <p className="text-blue-600 font-bold">${tt.price}</p>
                  <p className="text-xs text-gray-500">{tt.totalQuantity - tt.soldQuantity} remaining</p>
                </div>
                <button
                  disabled={purchasing || tt.soldQuantity >= tt.totalQuantity}
                  onClick={() => handlePurchase(tt.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {purchasing ? '...' : tt.soldQuantity >= tt.totalQuantity ? 'Sold Out' : 'Buy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-95 flex flex-col items-center justify-center text-white z-50 animate-in fade-in">
          <CheckCircle size={80} className="mb-4" />
          <h2 className="text-3xl font-bold">Purchase Successful!</h2>
          <p className="mt-2">Redirecting to your tickets...</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
