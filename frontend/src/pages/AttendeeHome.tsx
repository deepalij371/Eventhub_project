import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Search, Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Event {
  id: number;
  name: string;
  description: string;
  venue: string;
  dateTime: string;
  imageUrl: string;
  ticketTypes: { id: number; name: string; price: number }[];
}

const AttendeeHome: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/public/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get(`/public/events/search?q=${search}`);
      setEvents(response.data);
    } catch (err) {
      console.error('Search failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">EventHub</Link>
          <div className="flex gap-4 items-center">
            <Link to="/my-tickets" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
              <TicketIcon size={20} /> My Tickets
            </Link>
            <button onClick={logout} className="text-gray-600 hover:text-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full p-4 pl-12 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
          </form>
        </div>

        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200">
                {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Calendar size={16} /> {new Date(event.dateTime).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin size={16} /> {event.venue}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">
                    From ${Math.min(...event.ticketTypes.map(t => t.price))}
                  </span>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeeHome;
