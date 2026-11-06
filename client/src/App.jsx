import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PerfumesPage } from './pages/PerfumesPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { ContactPage } from './pages/ContactPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function MainLayout() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookWithService = (service) => {
    setPreselectedService(service);
    navigateTo('book');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2420]">
      
      {/* Sticky Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        onOpenNotifications={() => setIsNotificationsOpen(true)} 
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={navigateTo} 
            onSelectServiceForBooking={handleBookWithService} 
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage 
            onBookService={handleBookWithService} 
          />
        )}
        {currentPage === 'perfumes' && (
          <PerfumesPage />
        )}
        {currentPage === 'about' && (
          <AboutPage 
            onNavigate={navigateTo} 
          />
        )}
        {currentPage === 'gallery' && (
          <GalleryPage 
            onNavigate={navigateTo}
            onBookService={handleBookWithService}
          />
        )}
        {currentPage === 'book' && (
          <AppointmentPage 
            preselectedService={preselectedService} 
            onNavigate={navigateTo} 
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage />
        )}
        {currentPage === 'dashboard' && (
          <UserDashboard 
            onNavigate={navigateTo} 
          />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard 
            onNavigate={navigateTo} 
          />
        )}
      </main>

      {/* Global Floating Sticky CTA that follows user on scroll */}
      {currentPage !== 'book' && currentPage !== 'admin' && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 transform ${
            showStickyCta
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={() => navigateTo('book')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#B87D65] hover:bg-[#A36B53] active:scale-95 text-white text-xs font-bold rounded-full shadow-xl shadow-[#2C2420]/30 border border-white/20 transition-all uppercase tracking-wider whitespace-nowrap"
            aria-label="Book Appointment"
          >
            <Calendar className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span>Book Appointment</span>
          </button>
        </div>
      )}

      {/* Warm Luxury Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* In-App Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={navigateTo}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
