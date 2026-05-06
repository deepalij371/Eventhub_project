import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const MOCK_EVENTS: Event[] = [
    {
      id: 1,
      name: "Neon Nights Music Festival",
      description: "Experience the ultimate electronic music festival with top DJs from around the world.",
      venue: "Downtown Arena",
      dateTime: "2026-06-15T18:00:00Z",
      imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ticketTypes: [{ id: 1, name: "General Admission", price: 85 }]
    },
    {
      id: 2,
      name: "Global Tech Summit 2026",
      description: "Join industry leaders and innovators for three days of keynotes, workshops, and networking.",
      venue: "Convention Center",
      dateTime: "2026-07-22T09:00:00Z",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ticketTypes: [{ id: 2, name: "Early Bird", price: 299 }]
    },
    {
      id: 3,
      name: "Modern Art Exhibition",
      description: "Explore contemporary masterpieces and interactive installations at the city gallery.",
      venue: "City Gallery",
      dateTime: "2026-05-10T10:00:00Z",
      imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      ticketTypes: [{ id: 3, name: "Standard", price: 25 }]
    }
  ];

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/public/events');
      if (response.data && response.data.length > 0) {
        setEvents(response.data);
      } else {
        setEvents(MOCK_EVENTS);
      }
    } catch (err) {
      console.error('Failed to fetch events');
      setEvents(MOCK_EVENTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.get(`/public/events/search?q=${search}`);
      setEvents(response.data);
    } catch (err) {
      console.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <header className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
              Find Your Next <span className="text-primary">Unforgettable</span> Experience
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              Discover the best events, concerts, and professional workshops happening in your city. Join thousands of attendees today.
            </p>
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex-1 flex items-center px-4 py-2 gap-3">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none" 
                    placeholder="Search events, artists, or venues" 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block self-center"></div>
                <div className="flex-1 flex items-center px-4 py-2 gap-3">
                  <span className="material-symbols-outlined text-slate-400">location_on</span>
                  <input className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none" placeholder="Near you" type="text" />
                </div>
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md shadow-primary/20">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary rounded-full blur-[100px]"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Events</h2>
            <p className="text-slate-500 text-sm mt-1">Hand-picked experiences for you</p>
          </div>
          <a className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline" href="#">
            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">search_off</span>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">No events found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => {
              const eventDate = new Date(event.dateTime);
              const minPrice = event.ticketTypes.length > 0 ? Math.min(...event.ticketTypes.map(t => t.price)) : 0;
              
              return (
                <div key={event.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(60,131,246,0.15)] transition-all duration-500 flex flex-col hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"></div>
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={event.name} 
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'}
                    />
                    <div className="absolute top-5 left-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl text-center shadow-lg z-20 transform transition-transform duration-300 group-hover:-translate-y-1">
                      <span className="block text-[10px] font-black tracking-widest uppercase text-primary">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="block text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{eventDate.toLocaleDateString('en-US', { day: '2-digit' })}</span>
                    </div>
                    <button className="absolute top-5 right-5 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-20 hover:scale-110">
                      <span className="material-symbols-outlined text-xl">favorite</span>
                    </button>
                    
                    <div className="absolute bottom-5 left-5 right-5 z-20">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">Featured</span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{event.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-3 font-medium">
                        <span className="material-symbols-outlined text-primary/70">location_on</span>
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-3 font-medium">
                        <span className="material-symbols-outlined text-primary/70">schedule</span>
                        <span>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        {event.ticketTypes && event.ticketTypes.length > 0 ? (
                          <>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Starting from</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">${minPrice}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Tickets</span>
                            <span className="text-xl font-black text-slate-500 dark:text-slate-400">TBA</span>
                          </>
                        )}
                      </div>
                      <Link to={`/event/${event.id}`} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-md hover:shadow-primary/30 flex items-center gap-2 group/btn">
                        Get Tickets
                        <span className="material-symbols-outlined text-sm transform group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">calendar_today</span>
                <span className="text-xl font-bold tracking-tight">EventHub</span>
              </div>
              <p className="text-sm leading-relaxed">The ultimate platform for discovering and booking unique experiences around the globe.</p>
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">All Events</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Venues</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6">Newsletter</h4>
              <p className="text-sm mb-4">Stay updated with the best events.</p>
              <div className="flex gap-2">
                <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-full focus:ring-1 focus:ring-primary text-slate-900 dark:text-white outline-none px-3" placeholder="Email" type="email" />
                <button className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
            © {new Date().getFullYear()} EventHub Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default AttendeeHome;
