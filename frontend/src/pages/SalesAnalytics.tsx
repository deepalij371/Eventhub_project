import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Users, DollarSign } from 'lucide-react';

interface Stats {
  totalTicketsSold: number;
  totalRevenue: number;
}

const SalesAnalytics: React.FC = () => {
  const { eventId } = useParams();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/organizer/dashboard/${eventId}`);
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, [eventId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-8">Event Sales Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-lg shadow flex items-center gap-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <Users size={32} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Tickets Sold</p>
              <p className="text-4xl font-bold">{stats?.totalTicketsSold || 0}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow flex items-center gap-6">
            <div className="bg-green-100 p-4 rounded-full text-green-600">
              <DollarSign size={32} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-4xl font-bold">${stats?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
