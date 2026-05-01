import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import DiscussionPage from './pages/DiscussionPage';
import LivePage from './pages/LivePage';
import InsightsPage from './pages/InsightsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import ChatPage from './pages/ChatPage';
import EventPage from './pages/EventPage';
import SubmitPage from './pages/SubmitPage';
import SubmitClaimPage from './pages/SubmitClaimPage';
import AnalyticsPage from './pages/AnalyticsPage';

import './index.css';
import './i18n';

/**
 *  MODE PUBLIC / PRODUCTION LOCK
 * true = uniquement Home accessible
 * false = toutes les pages accessibles
 */
const PUBLIC_MODE = true;

// Layout principal
const MainLayout = ({ children }) => (
  <div
    className="min-h-screen flex flex-col"
    style={{ background: 'var(--hdr-bg)', color: 'var(--hdr-text)' }}
  >
    <Header />
    <main className="flex-grow container mx-auto">
      {children}
    </main>
    <Footer />
  </div>
);

// Layout auth
const AuthLayout = ({ children }) => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: 'var(--hdr-bg)' }}
  >
    {children}
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>

        {/*  MODE PUBLIC : HOME ONLY */}
        {PUBLIC_MODE ? (
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            } />

            {/* redirection de tout le reste vers Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          /*  MODE FULL APP (DEV / FUTUR PROD) */
          <Routes>

            {/* Auth */}
            <Route path="/connexion" element={
              <AuthLayout><LoginPage /></AuthLayout>
            } />

            <Route path="/inscription" element={
              <AuthLayout><SignupPage /></AuthLayout>
            } />

            {/* Chat */}
            <Route path="/chat/:claimId" element={<ChatPage />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* App principale */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/discussions" element={<DiscussionPage />} />
                  <Route path="/live" element={<LivePage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/event/:id" element={<EventPage />} />
                  <Route path="/ai-analysis/:id" element={<AIAnalysisPage />} />
                  <Route path="/submit/claim" element={<SubmitClaimPage />} />
                  <Route path="/submit" element={<SubmitPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
              </MainLayout>
            } />

          </Routes>
        )}

      </Router>
    </ThemeProvider>
  );
}

export default App;
