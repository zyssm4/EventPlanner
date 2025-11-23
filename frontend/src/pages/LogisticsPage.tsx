import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Building2, Users, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { SupplierList } from '../components/logistics/SupplierList';
import { SupplierForm } from '../components/logistics/SupplierForm';
import { VenueDetail } from '../components/logistics/VenueDetail';
import { VenueForm } from '../components/logistics/VenueForm';
import api from '../services/api';

interface Event {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
}

export const LogisticsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');

  const [activeTab, setActiveTab] = useState<'suppliers' | 'venue'>('suppliers');
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      loadEventData();
    } else {
      setLoading(false);
    }
  }, [eventId]);

  const loadEventData = async () => {
    try {
      const [eventResponse, venueResponse] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/venue`).catch(() => ({ data: null }))
      ]);
      setEvent(eventResponse.data);
      setVenue(venueResponse.data);
    } catch (error) {
      console.error('Failed to load event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueSaved = (savedVenue: Venue) => {
    setVenue(savedVenue);
    setShowVenueForm(false);
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
            {event && (
              <p className="text-gray-600">Managing logistics for: {event.name}</p>
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
              onClick={() => setShowSupplierForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </button>
          </div>

          <SupplierList />

          {showSupplierForm && (
            <SupplierForm
              onClose={() => setShowSupplierForm(false)}
              onSaved={() => {
                setShowSupplierForm(false);
                // Trigger refresh of supplier list
              }}
            />
          )}
        </div>
      )}

      {activeTab === 'venue' && eventId && (
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
                <button
                  onClick={() => setShowVenueForm(true)}
                  className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
                >
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
                  {venue.contactName && <p className="text-gray-700">{venue.contactName}</p>}
                  {venue.contactPhone && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {venue.contactPhone}
                    </p>
                  )}
                  {venue.contactEmail && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {venue.contactEmail}
                    </p>
                  )}
                </div>
              </div>

              {venue.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{venue.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Venue Set</h2>
              <p className="text-gray-500 mb-6">Add a venue for your event</p>
              <button
                onClick={() => setShowVenueForm(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </button>
            </div>
          )}

          {showVenueForm && (
            <VenueForm
              eventId={eventId}
              venue={venue}
              onClose={() => setShowVenueForm(false)}
              onSaved={handleVenueSaved}
            />
          )}
        </div>
      )}
    </div>
  );
};
