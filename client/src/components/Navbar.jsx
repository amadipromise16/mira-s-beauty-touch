import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, Sparkles, User, Bell, LogOut, Calendar, 
  Shield, Heart, ChevronDown 
} from 'lucide-react';

export function Navbar({ currentPage, onNavigate, onOpenNotifications }) {
  const { user, isAdmin, logout, openAuth, unreadCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'perfumes', label: 'Fragrance & Shop' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'book', label: 'Book' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBDCD4] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer flex flex-col items-start select-none group"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-widest text-[#2C2420] font-semibold group-hover:text-[#B87D65] transition-colors">
              MIRA’S
            </span>
            <span className="text-[10px] tracking-[0.28em] text-[#8E766B] font-medium uppercase -mt-1">
              Beauty Touch • Salon & Perfume
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 text-xs lg:text-sm font-medium tracking-wide uppercase transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-[#B87D65] font-semibold bg-[#F2E5DC]'
                      : 'text-[#5A4D45] hover:text-[#B87D65] hover:bg-[#F8EFEA]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Notifications, Account, Book CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Notification Bell */}
            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-full text-[#5A4D45] hover:text-[#B87D65] hover:bg-[#F2E5DC] transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B87D65] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#2C2420] bg-[#F2E5DC] hover:bg-[#E8D3C6] transition-colors border border-[#DFC7B9]"
                >
                  <User className="w-4 h-4 text-[#B87D65]" />
                  <span className="max-w-[100px] truncate">{user.full_name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-warm-lg border border-[#EBDCD4] py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-[#F2E5DC]">
                      <p className="text-xs font-semibold text-[#2C2420] truncate">{user.full_name}</p>
                      <p className="text-[11px] text-[#8E766B] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded bg-[#F2E5DC] text-[#944E2E]">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => { handleNavClick('dashboard'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4A3C35] hover:bg-[#FAF4F0] hover:text-[#B87D65] flex items-center space-x-2"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>My Appointments</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => { handleNavClick('admin'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-[#944E2E] font-medium hover:bg-[#FAF4F0] flex items-center space-x-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#B87D65]" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-[#F2E5DC] my-1"></div>

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-[#5A4D45] hover:text-[#B87D65] hover:bg-[#F2E5DC] rounded-full transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Book Appointment CTA Button */}
            <button
              onClick={() => handleNavClick('book')}
              className="bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-warm-sm transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-[#5A4D45]"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#B87D65] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2C2420] hover:text-[#B87D65] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#EBDCD4] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase transition-colors ${
                currentPage === link.id
                  ? 'bg-[#F2E5DC] text-[#B87D65] font-semibold'
                  : 'text-[#4A3C35] hover:bg-[#F8EFEA]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#EBDCD4] space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#2C2420] font-medium"
                >
                  <Calendar className="w-4 h-4 text-[#B87D65]" />
                  <span>My Appointments & Profile</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#944E2E] font-medium"
                  >
                    <Shield className="w-4 h-4 text-[#B87D65]" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user.full_name})</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-sm font-semibold text-[#5A4D45] bg-[#F2E5DC] rounded-full"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={() => handleNavClick('book')}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-[#B87D65] rounded-full shadow-warm-sm"
            >
              Book Appointment Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

