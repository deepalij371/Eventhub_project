import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface Event {
  id: number;
  name: string;
  venue: string;
  dateTime: string;
  ticketTypes: { id: number; name: string; price: number; totalQuantity: number; soldQuantity: number }[];
}

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Create Event State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    venue: '',
    dateTime: '',
    ticketTypes: [],
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/events/my-events');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/events', newEvent);
      setIsModalOpen(false);
      setNewEvent({ name: '', description: '', venue: '', dateTime: '', ticketTypes: [] });
      // Redirect to analytics/dashboard for this specific event to add tickets
      navigate(`/organizer/dashboard/${response.data.id}`);
    } catch (err) {
      alert('Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">dashboard</span>
              Dashboard
            </h1>
            <p className="text-slate-500 mt-2">Manage your events, view sales, and add ticket types.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Create Event
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">event_note</span>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events created yet</h3>
             <p className="text-slate-500 mb-6">Start by creating your first event to sell tickets.</p>
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold"
             >
               Create First Event
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.dateTime);
              
              // Calculate basic stats
              let totalRevenue = 0;
              let totalSold = 0;
              let totalCapacity = 0;
              
              event.ticketTypes.forEach(tt => {
                 totalSold += tt.soldQuantity;
                 totalCapacity += tt.totalQuantity;
                 totalRevenue += (tt.soldQuantity * tt.price);
              });
              
              const progressPercentage = totalCapacity === 0 ? 0 : Math.round((totalSold / totalCapacity) * 100);

              return (
                <div key={event.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{event.name}</h3>
                      <Link to={`/organizer/dashboard/${event.id}`} className="text-primary hover:text-primary/80">
                         <span className="material-symbols-outlined">settings</span>
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                       <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          <span>{eventDate.toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          <span className="truncate max-w-[120px]">{event.venue}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col bg-slate-50 dark:bg-slate-800/50">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Performance</h4>
                     
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                           <p className="text-xs text-slate-500 font-bold uppercase mb-1">Revenue</p>
                           <p className="text-xl font-black text-slate-900 dark:text-white">${totalRevenue}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                           <p className="text-xs text-slate-500 font-bold uppercase mb-1">Tickets Sold</p>
                           <p className="text-xl font-black text-slate-900 dark:text-white">{totalSold} <span className="text-sm font-normal text-slate-500">/ {totalCapacity}</span></p>
                        </div>
                     </div>
                     
                     <div className="mt-auto">
                        <div className="flex justify-between text-xs mb-2">
                           <span className="font-semibold text-slate-700 dark:text-slate-300">Sales Progress</span>
                           <span className="font-bold text-primary">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                           <div className="bg-primary h-full rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Create New Event
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto">
              <form id="create-event-form" onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="e.g., Summer Music Festival"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="e.g., Grand Arena, Downtown"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    value={newEvent.dateTime}
                    onChange={(e) => setNewEvent({...newEvent, dateTime: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                    placeholder="Tell attendees about this event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  />
                </div>
              </form>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
               <button 
                 type="button"
                 onClick={() => setIsModalOpen(false)}
                 className="px-5 py-2.5 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 form="create-event-form"
                 className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
               >
                 Create Event
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
