import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/common/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { BudgetPage } from './pages/BudgetPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { TimelinePage } from './pages/TimelinePage';
import { LogisticsPage } from './pages/LogisticsPage';
import { ExportsPage } from './pages/ExportsPage';
import { SettingsPage } from './pages/SettingsPage';
import './i18n';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
              <Route path="/events/:id" element={<ProtectedRoute><Layout><EventDetailPage /></Layout></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><Layout><BudgetPage /></Layout></ProtectedRoute>} />
              <Route path="/checklist" element={<ProtectedRoute><Layout><ChecklistPage /></Layout></ProtectedRoute>} />
              <Route path="/timeline" element={<ProtectedRoute><Layout><TimelinePage /></Layout></ProtectedRoute>} />
              <Route path="/logistics" element={<ProtectedRoute><Layout><LogisticsPage /></Layout></ProtectedRoute>} />
              <Route path="/exports" element={<ProtectedRoute><Layout><ExportsPage /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
