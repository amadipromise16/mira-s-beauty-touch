import React from 'react';
import { MapPin, Phone, Mail, Clock, Sparkles } from 'lucide-react';

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#A36B53] text-[#FAF7F2] pt-16 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#BE8973]">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <h3 className="font-serif text-2xl tracking-widest font-semibold uppercase text-white">
                MIRA’S
              </h3>
              <p className="text-[10px] tracking-[0.25em] text-[#F5DDD2] uppercase font-medium">
                Beauty Touch • Salon & Perfume
              </p>
            </div>
            <p className="text-xs text-[#F2D7CB] leading-relaxed">
              Mira’s Beauty Touch is a premier salon in Nigeria dedicated to enhancing your natural beauty with elegance, style, and exceptional care.
            </p>
            <p className="text-xs font-serif italic text-white flex items-center space-x-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD5C5]" />
              <span>Where Beauty Meets Elegance</span>
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#BE8973] hover:bg-white hover:text-[#A36B53] flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#BE8973] hover:bg-white hover:text-[#A36B53] flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#F2D7CB]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home Experience
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Salon Treatments & Braids
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('perfumes')} className="hover:text-white transition-colors">
                  Exquisite Perfume Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Our Story & Founder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors">
                  Client Transformations Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-white transition-colors">
                  Book Salon Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Salon Opening Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Salon Hours
            </h4>
            <div className="space-y-3 text-xs text-[#F2D7CB]">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#FAD5C5] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Monday – Saturday</p>
                  <p>9:00 AM – 7:30 PM (WAT)</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#FAD5C5] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Sunday</p>
                  <p>1:00 PM – 6:00 PM (By Appointment)</p>
                </div>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 text-[11px] rounded bg-[#BE8973] text-[#FAF7F2]">
                  🇳🇬 All Prices in Nigerian Naira (₦)
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Contact & Location
            </h4>
            <div className="space-y-3 text-xs text-[#F2D7CB]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#FAD5C5] mt-0.5 shrink-0" />
                <span>Plot 12, Commercial Avenue, Owerri, Imo State, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#FAD5C5] shrink-0" />
                <a href="tel:+2349037276804" className="hover:text-white transition-colors">
                  +234 903 727 6804
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FAD5C5] shrink-0" />
                <a href="mailto:info@mirasbeautytouch.com" className="hover:text-white transition-colors">
                  info@mirasbeautytouch.com
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('book')}
                  className="w-full bg-[#FAF7F2] hover:bg-white text-[#A36B53] font-semibold py-2 px-4 rounded-full text-xs transition-colors shadow"
                >
                  Book Your Visit
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EAD2C6]">
          <p>© {new Date().getFullYear()} Mira’s Beauty Touch. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 font-serif italic">
            Your Beauty, Our Passion. Your Elegance, Our Signature.
          </p>
        </div>
      </div>
    </footer>
  );
}
