import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, FileText, FileSpreadsheet, FileJson, ArrowLeft, Loader2 } from 'lucide-react';
import { ExportOptions } from '../components/exports/ExportOptions';
import api from '../services/api';

interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
}

export const ExportsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    } else {
      setLoading(false);
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'json') => {
    if (!eventId) return;

    setExporting(format);
    try {
      const response = await api.get(`/events/${eventId}/export/${format}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const extensions = { pdf: 'pdf', excel: 'xlsx', json: 'json' };
      link.download = `${event?.name || 'event'}-export.${extensions[format]}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
      alert(`Failed to export ${format}. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Event Selected</h2>
          <p className="text-gray-500 mb-6">Please select an event to export its data</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Export Event Data</h1>
          {event && (
            <p className="text-gray-600 mt-1">
              Exporting data for: <span className="font-medium">{event.name}</span>
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'pdf' ? (
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-3" />
            ) : (
              <FileText className="w-12 h-12 text-red-500 mb-3" />
            )}
            <span className="font-semibold text-gray-900">PDF</span>
            <span className="text-sm text-gray-500 mt-1">Complete event plan</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={exporting !== null}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'excel' ? (
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-3" />
            ) : (
              <FileSpreadsheet className="w-12 h-12 text-green-500 mb-3" />
            )}
            <span className="font-semibold text-gray-900">Excel</span>
            <span className="text-sm text-gray-500 mt-1">Budget spreadsheet</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            disabled={exporting !== null}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'json' ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-3" />
            ) : (
              <FileJson className="w-12 h-12 text-blue-500 mb-3" />
            )}
            <span className="font-semibold text-gray-900">JSON</span>
            <span className="text-sm text-gray-500 mt-1">Raw data backup</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">What's included:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Event details and information</li>
            <li>• Complete budget breakdown</li>
            <li>• Checklist items and status</li>
            <li>• Timeline and schedule</li>
            <li>• Supplier and venue information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
