import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Building2, Users, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  contact: string;
  phone?: string;
  email?: string;
}

export const LogisticsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');

  const [activeTab, setActiveTab] = useState<'suppliers' | 'venue'>('suppliers');
  const [eventName, setEventName] = useState<string>('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      const [suppliersData, venueData] = await Promise.all([
        api.getSuppliers(),
        eventId ? api.getVenue(eventId) : null
      ]);

      setSuppliers(suppliersData);
      if (venueData) setVenue(venueData);

      if (eventId) {
        const eventData = await api.getEvent(eventId);
        setEventName(eventData.name);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Logistics & Suppliers</h1>
            {eventName && (
              <p className="text-gray-600">Managing logistics for: {eventName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'suppliers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab('venue')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'venue'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Venue
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'suppliers' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </button>
          </div>

          {suppliers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Suppliers</h2>
              <p className="text-gray-500">Add your first supplier to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">{supplier.category}</p>
                  {supplier.phone && (
                    <p className="text-sm text-gray-600 mt-2 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {supplier.phone}
                    </p>
                  )}
                  {supplier.email && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {supplier.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'venue' && (
        <div>
          {venue ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{venue.name}</h2>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {venue.address}
                  </p>
                </div>
                <button className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50">
                  Edit
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Capacity</h3>
                  <p className="text-2xl font-bold text-indigo-600">{venue.capacity} guests</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-700">{venue.contact}</p>
                  {venue.phone && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {venue.phone}
                    </p>
                  )}
                  {venue.email && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {venue.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Venue Set</h2>
              <p className="text-gray-500 mb-6">Add a venue for your event</p>
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
