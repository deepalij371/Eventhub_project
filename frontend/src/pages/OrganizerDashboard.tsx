import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, LayoutDashboard, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TicketType {
  id: number;
  name: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
}

interface Event {
  id: number;
  name: string;
  description: string;
  venue: string;
  dateTime: string;
  ticketTypes: TicketType[];
}

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    venue: '',
    dateTime: '',
    imageUrl: '',
    ticketTypes: [{ name: 'General', price: 0, totalQuantity: 100 }]
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/my-events');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', newEvent);
      setShowCreateForm(false);
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event', err);
    }
  };

  const handleExport = async (eventId: number) => {
    try {
      const response = await api.get(`/organizer/export/${eventId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendees.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Failed to export CSV', err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Organizer Dashboard</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Create Event
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
              <form onSubmit={handleCreateEvent}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Venue</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded"
                        value={newEvent.dateTime}
                        onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newEvent.imageUrl}
                      onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2">Ticket Types</h3>
                  {newEvent.ticketTypes.map((tt, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        placeholder="Name"
                        className="p-2 border rounded"
                        value={tt.name}
                        onChange={(e) => {
                          const updated = [...newEvent.ticketTypes];
                          updated[index].name = e.target.value;
                          setNewEvent({ ...newEvent, ticketTypes: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        className="p-2 border rounded"
                        value={tt.price}
                        onChange={(e) => {
                          const updated = [...newEvent.ticketTypes];
                          updated[index].price = parseFloat(e.target.value);
                          setNewEvent({ ...newEvent, ticketTypes: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="p-2 border rounded"
                        value={tt.totalQuantity}
                        onChange={(e) => {
                          const updated = [...newEvent.ticketTypes];
                          updated[index].totalQuantity = parseInt(e.target.value);
                          setNewEvent({ ...newEvent, ticketTypes: updated });
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewEvent({
                      ...newEvent,
                      ticketTypes: [...newEvent.ticketTypes, { name: '', price: 0, totalQuantity: 0 }]
                    })}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    + Add Ticket Type
                  </button>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              <div className="text-sm mb-4">
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Date:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <button
                  onClick={() => handleExport(event.id)}
                  className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                >
                  <FileText size={16} /> Export CSV
                </button>
                <Link to={`/organizer/dashboard/${event.id}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                  <LayoutDashboard size={16} /> Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
