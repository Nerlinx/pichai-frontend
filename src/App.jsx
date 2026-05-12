// ═══════════════════════════════════════════════════════════════
// PICHAI — src/App.jsx
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './hooks/useUser';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import AdminDashboard                from './pages/admin/AdminDashboard';
import DashboardPage                 from './pages/DashboardPage';
import HomePage                      from './pages/HomePage';
import DiscussionPage                from './pages/DiscussionPage';
import LivePage                      from './pages/LivePage';
import InsightsPage                  from './pages/InsightsPage';
import HowItWorksPage                from './pages/HowItWorksPage';
import LoginPage                     from './pages/LoginPage';
import SignupPage                    from './pages/SignupPage';
import AIAnalysisPage                from './pages/AIAnalysisPage';
import ChatPage                      from './pages/ChatPage';
import EventPage                     from './pages/EventPage';
import SubmitPage                    from './pages/SubmitPage';
import SubmitClaimPage               from './pages/SubmitClaimPage';
import AnalyticsPage                 from './pages/AnalyticsPage';

import './index.css';
import './i18n';

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

const AuthLayout = ({ children }) => (
  <div
    className="min-h-screen flex items-center justify-center p-4"
    style={{ background: '#fff' }}
  >
    {children}
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>

            <Route path="/connexion" element={
              <AuthLayout><LoginPage /></AuthLayout>
            } />
            <Route path="/inscription" element={
              <AuthLayout><SignupPage /></AuthLayout>
            } />

            <Route path="/chat/:slug" element={<ChatPage />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/"                          element={<HomePage />} />
                  { /*<Route path="discussions/:slug"       element={<DiscussionPage />} /> */}
                  { /* <Route path="/live"                      element={<LivePage />} /> */}
                  { /*<Route path="/insights"                  element={<InsightsPage />} /> */}
                  { /*<Route path="/how-it-works"              element={<HowItWorksPage />} /> */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  { /*<Route path="/event/:slug"                 element={<EventPage />} />  */}
                  <Route path="/ai-analysis/:slug"           element={<AIAnalysisPage />} />
                  <Route path="/submit/claim"              element={<SubmitClaimPage />} />
                  <Route path="/submit"                    element={<SubmitPage />} />
                  <Route path="/analytics"                 element={<AnalyticsPage />} /> */}
                </Routes>
              </MainLayout>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
