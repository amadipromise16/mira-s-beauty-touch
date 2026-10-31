import React, { useState, useEffect } from 'react';
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
          <GalleryPage />
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
