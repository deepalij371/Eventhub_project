import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

interface SalesStats {
  totalRevenue: number;
  totalTicketsSold: number;
  ticketTypeStats: {
    ticketTypeName: string;
    soldQuantity: number;
    revenue: number;
  }[];
  attendees?: {
    ticketNumber: string;
    name: string;
    email: string;
    ticketTypeName: string;
    validated: boolean;
  }[];
}

const SalesAnalytics: React.FC = () => {
  const { eventId } = useParams();
  const [stats, setStats] = useState<SalesStats | null>(null);
  
  // Ticket Type Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketType, setNewTicketType] = useState({
    name: '',
    price: 0,
    totalQuantity: 100,
  });

  const fetchStats = async () => {
    try {
      const response = await api.get(`/organizer/dashboard/${eventId}`);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch sales stats');
    }
  };

  useEffect(() => {
    fetchStats();
  }, [eventId]);

  const handleCreateTicketType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/events/${eventId}/ticket-types`, newTicketType);
      setIsModalOpen(false);
      setNewTicketType({ name: '', price: 0, totalQuantity: 100 });
      fetchStats(); // Refresh stats
    } catch (err) {
      alert('Failed to create ticket type');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get(`/organizer/export/${eventId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendees_${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors text-sm font-semibold">
               <span className="material-symbols-outlined text-[18px]">arrow_back</span>
               Back to Events
            </Link>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-4xl">monitoring</span>
              Event Analytics
            </h1>
            <p className="text-slate-500 mt-2">Detailed breakdown of sales and ticket performance.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportCSV}
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined">download</span>
              Export CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              New Ticket Tier
            </button>
          </div>
        </div>

        {/* Top Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">payments</span>
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white">${stats.totalRevenue}</h2>
              </div>
           </div>
           
           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">local_activity</span>
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Tickets Sold</p>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white">{stats.totalTicketsSold}</h2>
              </div>
           </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">pie_chart</span>
               Sales by Ticket Tier
             </h3>
           </div>
           
           {stats.ticketTypeStats.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">analytics</span>
                <p>No ticket tiers created for this event yet.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-200 dark:border-slate-800">
                     <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Ticket Tier</th>
                     <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Sold</th>
                     <th className="py-4 px-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Revenue</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                   {stats.ticketTypeStats.map((tier, index) => (
                     <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <td className="py-4 px-6">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                             <span className="material-symbols-outlined text-primary text-sm">confirmation_number</span>
                           </div>
                           <span className="font-semibold text-slate-900 dark:text-white">{tier.ticketTypeName}</span>
                         </div>
                       </td>
                       <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                         {tier.soldQuantity}
                       </td>
                       <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white">
                         ${tier.revenue}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>

        {/* Recent Purchasers Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-10">
           <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">groups</span>
               Recent Purchasers
             </h3>
           </div>
           
           {!stats.attendees || stats.attendees.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                <p>No tickets sold yet.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                     <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Ticket #</th>
                     <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Attendee</th>
                     <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Tier</th>
                     <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                   {stats.attendees.map((attendee, index) => (
                     <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <td className="py-4 px-6">
                         <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                           {attendee.ticketNumber}
                         </span>
                       </td>
                       <td className="py-4 px-6">
                         <div className="flex flex-col">
                           <span className="font-semibold text-slate-900 dark:text-white text-sm">{attendee.name}</span>
                           <span className="text-xs text-slate-500">{attendee.email}</span>
                         </div>
                       </td>
                       <td className="py-4 px-6">
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                           {attendee.ticketTypeName}
                         </span>
                       </td>
                       <td className="py-4 px-6 text-right">
                         {attendee.validated ? (
                           <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md">
                             <span className="material-symbols-outlined text-[14px]">check_circle</span> Checked In
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                             <span className="material-symbols-outlined text-[14px]">pending</span> Pending
                           </span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      </main>

      {/* Create Ticket Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sell</span>
                Add Ticket Tier
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <form id="create-ticket-form" onSubmit={handleCreateTicketType} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tier Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="e.g., VIP, General Admission"
                    value={newTicketType.name}
                    onChange={(e) => setNewTicketType({...newTicketType, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                     <input
                       type="number"
                       required
                       min="0"
                       className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                       value={newTicketType.price}
                       onChange={(e) => setNewTicketType({...newTicketType, price: Number(e.target.value)})}
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                     <input
                       type="number"
                       required
                       min="1"
                       className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                       value={newTicketType.totalQuantity}
                       onChange={(e) => setNewTicketType({...newTicketType, totalQuantity: Number(e.target.value)})}
                     />
                   </div>
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
                 form="create-ticket-form"
                 className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors"
               >
                 Save Tier
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAnalytics;
