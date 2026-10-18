import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CareerAssistantChat } from './components/CareerAssistantChat';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { CareersPage } from './pages/CareersPage';
import { JobsPage } from './pages/JobsPage';
import { SkillsPage } from './pages/SkillsPage';
import { InterviewPage } from './pages/InterviewPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AuthPage } from './pages/AuthPage';
import { NotFoundPage } from './pages/NotFoundPage';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    // Protected routes check
    if (['/dashboard', '/profile'].includes(currentPath) && !loading && !user) {
      return <AuthPage initialMode="login" navigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return <LandingPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/careers':
        return <CareersPage navigate={navigate} />;
      case '/jobs':
        return <JobsPage navigate={navigate} />;
      case '/skills':
        return <SkillsPage navigate={navigate} />;
      case '/interview':
        return <InterviewPage navigate={navigate} />;
      case '/resume-builder':
        return <ResumeBuilderPage navigate={navigate} />;
      case '/dashboard':
        return <DashboardPage navigate={navigate} />;
      case '/profile':
        return <ProfilePage navigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/login':
        return <AuthPage initialMode="login" navigate={navigate} />;
      case '/register':
        return <AuthPage initialMode="register" navigate={navigate} />;
      case '/forgot-password':
        return <AuthPage initialMode="forgot" navigate={navigate} />;
      default:
        return <NotFoundPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        openChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer navigate={navigate} />

      {/* Floating Career Guidance Chatbot */}
      <CareerAssistantChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainRouter />
      </NotificationProvider>
    </AuthProvider>
  );
}
