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
                href="https://www.instagram.com/carmi_rah?exln=b2prYzVhZm41MXp5&utm_source=qr" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#BE8973] hover:bg-white hover:text-[#A36B53] flex items-center justify-center transition-colors"
                title="Instagram (@carmi_rah)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/share/1CBjspKvBm/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#BE8973] hover:bg-white hover:text-[#A36B53] flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@mirachukwu1?_r=1&_t=ZS-9B5bMiq2VKH" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#BE8973] hover:bg-white hover:text-[#A36B53] flex items-center justify-center transition-colors"
                title="TikTok (@mirachukwu1)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.31 0 .62.05.9.14V9.42a6.34 6.34 0 0 0-.9-.06A6.34 6.34 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.81 1.52V7.15c-.32 0-.62-.16-.9-.46z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/2349037276804?text=Hello%20Mira's%20Beauty%20Touch,%20I%20have%20an%20inquiry." 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#BE8973] hover:bg-white hover:text-[#A36B53] flex items-center justify-center transition-colors"
                title="WhatsApp (+234 903 727 6804)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
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
                <span>Imo Paradise, Amawire, Orji, Owerri, Imo State, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#FAD5C5] shrink-0" />
                <a href="tel:+2349037276804" className="hover:text-white transition-colors">
                  +234 903 727 6804
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FAD5C5] shrink-0" />
                <a href="mailto:mirabeautytouch@gmail.com" className="hover:text-white transition-colors">
                  mirabeautytouch@gmail.com
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
