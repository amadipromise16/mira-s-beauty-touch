import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, 
  Send, Sparkles, CheckCircle2, ChevronDown, ChevronUp 
} from 'lucide-react';

export function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: "How does the appointment booking and approval process work?",
      a: "When you book a service, your request is submitted with a 'Pending' status and saved in our database. Our salon manager reviews our specialist availability and approves the request. You will immediately receive an in-app notification confirming your verified appointment date and time."
    },
    {
      q: "Do I need to pay online before booking?",
      a: "No! There is no online payment required or payment gateway needed to book. You book your preferred slot online, and pay at the salon upon completion of your service."
    },
    {
      q: "How do I purchase perfumes from the catalogue?",
      a: "Our perfume shop features our house blends and flacons priced in Nigerian Naira (₦). Simply click the 'Inquire / Order on WhatsApp' button on any product card, and our boutique concierge will coordinate delivery or store pickup in Nigeria."
    },
    {
      q: "What is your cancellation or rescheduling policy?",
      a: "You can view and cancel any pending appointments directly from your Customer Dashboard. If you need to reschedule an approved booking, please contact us at least 24 hours in advance."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Warm Hospitality & Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          CONNECT WITH MIRA’S
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          We would love to hear from you. Visit our salon sanctuary in Owerri, Imo State, call our concierge, or send us a message below.
        </p>
      </div>

      {/* Contact Cards & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Address */}
          <div className="bg-white rounded-2xl p-6 border border-[#EBDCD4] shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4F0] text-[#B87D65] flex items-center justify-center shrink-0 border border-[#DFC7B9]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2C2420]">Salon Location</h4>
              <p className="text-xs text-[#6E5D53] mt-1 leading-relaxed">
                Imo Paradise, Amawire, Orji, Owerri, Imo State, Nigeria
              </p>
              <p className="text-[11px] text-[#B87D65] font-semibold mt-2">
                Convenient on-site parking available • Imo Paradise, Amawire, Orji
              </p>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="bg-white rounded-2xl p-6 border border-[#EBDCD4] shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4F0] text-[#B87D65] flex items-center justify-center shrink-0 border border-[#DFC7B9]">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2C2420]">Phone & Direct Concierge</h4>
              <p className="text-xs text-[#6E5D53] mt-1">
                Call: <a href="tel:+2349037276804" className="font-semibold text-[#2C2420] hover:text-[#B87D65]">+234 903 727 6804</a>
              </p>
              <div className="mt-2.5">
                <a
                  href="https://wa.me/2349037276804?text=Hello%20Mira's%20Beauty%20Touch,%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#20ba59] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Hours */}
          <div className="bg-white rounded-2xl p-6 border border-[#EBDCD4] shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4F0] text-[#B87D65] flex items-center justify-center shrink-0 border border-[#DFC7B9]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2C2420]">Salon Hours (WAT)</h4>
              <div className="text-xs text-[#6E5D53] mt-1 space-y-0.5">
                <p><strong>Mon – Sat:</strong> 9:00 AM – 7:30 PM</p>
                <p><strong>Sunday:</strong> 1:00 PM – 6:00 PM (By Appointment)</p>
              </div>
            </div>
          </div>

          {/* Card 4: Email */}
          <div className="bg-white rounded-2xl p-6 border border-[#EBDCD4] shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4F0] text-[#B87D65] flex items-center justify-center shrink-0 border border-[#DFC7B9]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2C2420]">Email Inquiries</h4>
              <p className="text-xs text-[#6E5D53] mt-1">
                <a href="mailto:info@mirasbeautytouch.com" className="font-semibold text-[#2C2420] hover:text-[#B87D65]">
                  info@mirasbeautytouch.com
                </a>
              </p>
              <p className="text-[11px] text-[#8E766B] mt-1">We respond to emails within 2-4 hours.</p>
            </div>
          </div>

          {/* Card 5: Social Media Channels */}
          <div className="bg-white rounded-2xl p-6 border border-[#EBDCD4] shadow-warm-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF4F0] text-[#B87D65] flex items-center justify-center shrink-0 border border-[#DFC7B9]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2C2420]">Connect on Social Media</h4>
              <p className="text-xs text-[#6E5D53] mt-1">
                Follow our official social pages for salon transformations, hair styling videos, and reviews.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href="https://www.instagram.com/carmi_rah?exln=b2prYzVhZm41MXp5&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#E1306C] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#c9245c] transition-colors"
                  title="Instagram (@carmi_rah)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/share/1CBjspKvBm/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1877F2] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#166fe5] transition-colors"
                  title="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.tiktok.com/@mirachukwu1?_r=1&_t=ZS-9B5bMiq2VKH"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-full shadow-xs hover:bg-neutral-800 transition-colors"
                  title="TikTok (@mirachukwu1)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.31 0 .62.05.9.14V9.42a6.34 6.34 0 0 0-.9-.06A6.34 6.34 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.81 1.52V7.15c-.32 0-.62-.16-.9-.46z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Send Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#EBDCD4] shadow-warm-sm space-y-6">
          <div className="border-b border-[#F2E5DC] pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
              Send Us A Message
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1">
              Have questions regarding our braids, bridal packages, or perfume ordering? Leave a note.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#FAF4F0] rounded-2xl border border-[#DFC7B9] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-[#2C2420]">Message Sent!</h4>
              <p className="text-xs text-[#6E5D53]">
                Thank you for contacting Mira’s Beauty Touch. Our concierge will be in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Amaka Johnson"
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="amaka@example.com"
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Phone Number (Nigeria)</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Subject</label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="e.g. Bridal Glam Consultation"
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="How can we assist you with your beauty touch today?..."
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-warm-sm transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Interactive Google Map Section - Owerri, Imo State */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD4] shadow-warm-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2E5DC] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#B87D65] text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Visit Us In Owerri</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
              Interactive Salon Map, Imo Paradise, Amawire, Orji
            </h3>
            <p className="text-xs text-[#6E5D53] mt-1">
              Imo Paradise, Amawire, Orji, Owerri, Imo State, Nigeria. Pan and zoom around Owerri to easily find our salon palace.
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Amawire+Orji+Owerri+Imo+State+Nigeria"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-xl shadow-warm-sm transition-colors shrink-0"
          >
            <span>Open in Google Maps</span>
          </a>
        </div>

        <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-[#DFC7B9] shadow-inner">
          <iframe
            title="Mira's Beauty Touch - Imo Paradise Amawire Orji Owerri Google Map"
            src="https://maps.google.com/maps?q=Amawire,+Orji,+Owerri,+Imo+State,+Nigeria&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-[#FAF4F0] rounded-3xl p-8 sm:p-12 border border-[#EBDCD4] shadow-warm-sm space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">Help & Clarity</span>
          <h2 className="font-serif text-3xl text-[#2C2420] font-normal uppercase tracking-wide mt-1">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EBDCD4] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-[#2C2420] hover:text-[#B87D65] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-[#6E5D53] border-t border-[#F2E5DC] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

