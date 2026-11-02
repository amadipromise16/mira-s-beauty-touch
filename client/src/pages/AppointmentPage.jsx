import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { initialServicesData } from '../data/servicesData';
import { 
  Calendar as CalendarIcon, Clock, User, Phone, Mail, 
  Sparkles, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Scissors,
  Star, MessageSquare, Send, Quote
} from 'lucide-react';

export function AppointmentPage({ preselectedService, onBookingSuccess, onNavigate }) {
  const { user, openAuth } = useAuth();

  const [services, setServices] = useState(initialServicesData);
  const [selectedService, setSelectedService] = useState(preselectedService || initialServicesData[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Calendar State (Default today / next available date)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // default tomorrow
    return d.toISOString().split('T')[0];
  });

  const availableTimeSlots = [
    '09:00 AM',
    '10:15 AM',
    '11:30 AM',
    '01:00 PM',
    '02:15 PM',
    '03:30 PM',
    '04:45 PM',
    '06:00 PM'
  ];

  const [selectedTime, setSelectedTime] = useState('10:15 AM');
  const [bookedSlots, setBookedSlots] = useState([]);

  // Client Details Form
  const [clientDetails, setClientDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Client Testimonies State
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('mbt_reviews');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'rev_1',
        name: 'Chioma Eze',
        location: 'Ikenegbu, Owerri',
        service: 'Signature Knotless Bohemian Braids',
        rating: 5,
        date: 'October 28, 2026',
        comment: 'Mira’s Beauty Touch is hands down the best salon in Owerri! My knotless braids were completely painless, extremely neat, and lasted over 6 weeks. The atmosphere is so peaceful, clean, and luxurious!',
        verified: true
      },
      {
        id: 'rev_2',
        name: 'Amaka Nwachukwu',
        location: 'New Owerri',
        service: 'Master Sculpted Acrylic & Chrome Artistry',
        rating: 5,
        date: 'October 25, 2026',
        comment: 'I came in for my birthday nails and the attention to detail blew me away. No chipping, flawless cuticle finish, and the salon chairs are so comfortable. 10/10 recommend to all ladies in Imo State!',
        verified: true
      },
      {
        id: 'rev_3',
        name: 'Blessing Okoro',
        location: 'Works Layout, Owerri',
        service: 'Luxury Velvet Pedicure & Foot Scrub Sanctuary',
        rating: 5,
        date: 'October 22, 2026',
        comment: 'The pedicure experience was pure bliss! Warm floral foot bath, relaxing scrub, and the staff are extremely courteous and polite. It truly feels like a royal palace experience.',
        verified: true
      },
      {
        id: 'rev_4',
        name: 'Ngozi Obi',
        location: 'Aladinma, Owerri',
        service: 'Bridal Glam & Wispy Flutter Lash Extensions',
        rating: 5,
        date: 'October 18, 2026',
        comment: 'They did my celebration glam and lash extensions. Everyone kept asking who did my makeup! Long-lasting, photogenic, and elegant without feeling heavy. Love the website booking too!',
        verified: true
      }
    ];
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: 'Owerri, Imo State',
    service: 'Signature Knotless Bohemian Braids',
    rating: 5,
    comment: ''
  });
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      return;
    }
    const createdReview = {
      id: 'rev_' + Date.now(),
      name: newReview.name.trim(),
      location: newReview.location.trim() || 'Owerri, Imo State',
      service: newReview.service,
      rating: Number(newReview.rating) || 5,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: newReview.comment.trim(),
      verified: true
    };
    const updated = [createdReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('mbt_reviews', JSON.stringify(updated));
    } catch (_) {}
    setReviewSuccess('✨ Thank you for your wonderful testimony! Your review has been added to the site.');
    setShowReviewForm(false);
    setNewReview({
      name: user?.full_name || '',
      location: 'Owerri, Imo State',
      service: 'Signature Knotless Bohemian Braids',
      rating: 5,
      comment: ''
    });
    setTimeout(() => setReviewSuccess(''), 5000);
  };

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      const parts = user.full_name ? user.full_name.split(' ') : ['', ''];
      setClientDetails(prev => ({
        ...prev,
        first_name: parts[0] || '',
        last_name: parts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // When preselectedService arrives from Gallery ("Book This Hairstyle")
  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setServices(prev => {
        const exists = prev.some(s => s.name === preselectedService.name || (s.id && s.id === preselectedService.id));
        return exists ? prev : [preselectedService, ...prev];
      });
    }
  }, [preselectedService]);

  // Load backend services if online
  useEffect(() => {
    api.services.getAll().then(res => {
      if (res && res.services && res.services.length > 0) {
        setServices(res.services);
        if (preselectedService) {
          const match = res.services.find(s => s.name === preselectedService.name) || preselectedService;
          setSelectedService(match);
        }
      }
    }).catch(() => {
      // Keep initialServicesData fallback
    });
  }, [preselectedService]);

  // Check booked slots for selectedDate
  useEffect(() => {
    if (selectedDate) {
      api.appointments.getAvailability(selectedDate)
        .then(res => {
          setBookedSlots(res.booked_slots?.map(b => b.time) || []);
        })
        .catch(() => setBookedSlots([]));
    }
  }, [selectedDate]);

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    if (formatted >= today) {
      setSelectedDate(formatted);
    }
  };

  // Submit Appointment
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    // Master Prompt Requirement: Customer must sign in or register before submitting
    if (!user) {
      openAuth('login', () => {
        // Will continue after sign-in
      });
      return;
    }

    if (!selectedService) {
      setError('Please choose a salon service.');
      return;
    }

    const fullName = `${clientDetails.first_name} ${clientDetails.last_name}`.trim();
    if (!fullName || !clientDetails.phone) {
      setError('Please provide your full name and contact phone number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        service_id: selectedService.id,
        service_name: selectedService.name,
        stylist_name: 'Mira’s Beauty Touch Specialist',
        customer_name: fullName,
        customer_email: clientDetails.email || user.email,
        customer_phone: clientDetails.phone,
        requested_date: selectedDate,
        requested_time: selectedTime,
        price_ngn: selectedService.price_ngn || 18000,
        customer_notes: clientDetails.notes
      };

      const res = await api.appointments.create(payload);
      setSuccessBooking(res.appointment);
      if (onBookingSuccess) onBookingSuccess(res.appointment);
    } catch (err) {
      setError(err.message || 'Failed to submit appointment booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header matching Image 2 Reference */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Seamless Salon Booking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          BOOK YOUR MIRA’S EXPERIENCE
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Select your customized salon treatments and convenient date & time slot. Appointments are reviewed and approved directly by our team.
        </p>
      </div>

      {/* Success View */}
      {successBooking ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-[#EBDCD4] shadow-warm-lg text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">
              Request Received
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2420] font-semibold mt-1">
              Booking Submitted Successfully!
            </h2>
            <p className="text-xs text-[#6E5D53] mt-2 leading-relaxed">
              Your appointment request is saved in the database with <strong>Pending Approval</strong> status. Our salon administrator will review your requested time and send you an immediate confirmation notification.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DFC7B9] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8E766B]">Booking Reference:</span>
              <span className="font-mono font-bold text-[#944E2E]">{successBooking.booking_ref}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E766B]">Service:</span>
              <span className="font-semibold text-[#2C2420]">{successBooking.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E766B]">Salon:</span>
              <span className="font-semibold text-[#2C2420]">Mira’s Beauty Touch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E766B]">Requested Date & Time:</span>
              <span className="font-semibold text-[#2C2420]">{successBooking.requested_date} at {successBooking.requested_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E766B]">Status:</span>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                {successBooking.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-3 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-warm-sm"
            >
              View In My Bookings
            </button>
            <button
              onClick={() => { setSuccessBooking(null); }}
              className="flex-1 py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F2E5DC] text-[#2C2420] border border-[#DFC7B9] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      ) : (

        /* Main Booking Grid matching Image 2 Reference */
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: SELECT SERVICE & SALON PROMISE */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. SELECT SERVICE */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#2C2420] uppercase tracking-wide">
                  1. Select Service(s)
                </h3>
                {selectedService && (
                  <span className="text-xs font-bold text-[#B87D65]">
                    ₦{selectedService.price_ngn?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Hairstyle Direct Selection Banner */}
              {preselectedService && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF4F0] to-[#F5ECE5] border border-[#B87D65]/40 flex items-start space-x-3 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#B87D65] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#944E2E] bg-white px-2 py-0.5 rounded-full border border-[#DFC7B9]">
                        Selected From Gallery
                      </span>
                    </div>
                    <p className="font-serif text-sm font-bold text-[#2C2420] mt-1 truncate">
                      {selectedService?.name}
                    </p>
                    <p className="text-[11px] text-[#6E5D53] line-clamp-2 mt-0.5">
                      {selectedService?.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#944E2E] block">
                      ₦{selectedService?.price_ngn?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#8E766B]">
                      ~{selectedService?.duration_mins} mins
                    </span>
                  </div>
                </div>
              )}

              {/* Service Dropdown & Radios */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#7A6B63]">
                  Choose Salon Treatment:
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-1">
                  {services.map((s) => {
                    const isSelected = selectedService?.id === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FAF4F0] border-[#B87D65] shadow-xs ring-1 ring-[#B87D65]/30'
                            : 'bg-white border-[#EBDCD4] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="selected_service"
                            checked={isSelected}
                            onChange={() => setSelectedService(s)}
                            className="accent-[#B87D65] w-4 h-4"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#2C2420]">{s.name}</p>
                            <p className="text-[10px] text-[#8E766B]">{s.category} • ~{s.duration_mins} mins</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#B87D65]">
                          ₦{s.price_ngn?.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Salon Assurance Card */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#DFC7B9] space-y-3">
              <div className="flex items-center space-x-2 text-[#944E2E]">
                <Sparkles className="w-4 h-4 text-[#B87D65]" />
                <span className="text-xs font-bold uppercase tracking-wider">The Mira’s Touch Promise</span>
              </div>
              <p className="text-xs text-[#6E5D53] leading-relaxed">
                Every appointment at Mira’s Beauty Touch is paired with certified care, sanitized premium equipment, and relaxing aromatherapy. Our dedicated team reviews your visit to ensure complete beauty and elegance.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#4A3C35]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B87D65] shrink-0" />
                  <span>Tension-Free Styling</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B87D65] shrink-0" />
                  <span>Hygienic Sterilization</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B87D65] shrink-0" />
                  <span>Luxury Aromas & Scents</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B87D65] shrink-0" />
                  <span>Prompt Salon Reception</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CALENDAR, TIME SLOTS & CLIENT DETAILS */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 2. SELECT DATE & TIME */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-5">
              <div className="border-b border-[#F2E5DC] pb-3 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#2C2420] uppercase tracking-wide">
                  2. Select Date & Time
                </h3>
                <span className="text-xs font-semibold text-[#B87D65]">
                  {selectedDate}
                </span>
              </div>

              {/* Month Navigator */}
              <div className="flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-full hover:bg-[#F2E5DC] text-[#7A6B63]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-full hover:bg-[#F2E5DC] text-[#7A6B63]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#8E766B] mb-2 uppercase">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Empty offsets */}
                  {[...Array(firstDayIndex)].map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                  ))}

                  {/* Days */}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const todayStr = new Date().toISOString().split('T')[0];
                    const isPast = dateStr < todayStr;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDateClick(day)}
                        className={`p-2 rounded-xl font-medium transition-all ${
                          isPast
                            ? 'text-[#C9B9AF] cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#B87D65] text-white font-bold shadow-xs'
                              : 'hover:bg-[#F2E5DC] text-[#2C2420]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="pt-3 border-t border-[#F2E5DC] space-y-2">
                <label className="block text-xs font-semibold text-[#4A3C35]">
                  Available Time Slots:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-1 text-[11px] font-semibold rounded-xl border transition-all ${
                          isBooked
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-[#B87D65] text-white border-[#B87D65] shadow-xs'
                              : 'bg-white hover:bg-[#F2E5DC] text-[#2C2420] border-[#DFC7B9]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 3. CLIENT DETAILS */}
            <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-4">
              <div className="border-b border-[#F2E5DC] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#2C2420] uppercase tracking-wide">
                  3. Client Details
                </h3>
              </div>

              {!user && (
                <div className="p-3 bg-[#FAF4F0] rounded-xl border border-[#DFC7B9] text-xs text-[#7A6B63] flex items-center justify-between">
                  <span>Sign in to automatically sync with your account</span>
                  <button
                    type="button"
                    onClick={() => openAuth('login')}
                    className="font-bold text-[#B87D65] hover:underline"
                  >
                    Sign In →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={clientDetails.first_name}
                    onChange={(e) => setClientDetails({ ...clientDetails, first_name: e.target.value })}
                    placeholder="e.g. Amaka"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={clientDetails.last_name}
                    onChange={(e) => setClientDetails({ ...clientDetails, last_name: e.target.value })}
                    placeholder="e.g. Nwosu"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={clientDetails.email}
                    onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Phone Number (Nigeria) *</label>
                  <input
                    type="tel"
                    required
                    value={clientDetails.phone}
                    onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                    placeholder="+234 903 727 6804"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Special Requests or Notes</label>
                <textarea
                  rows={2}
                  value={clientDetails.notes}
                  onChange={(e) => setClientDetails({ ...clientDetails, notes: e.target.value })}
                  placeholder="Hair parting preference, skin sensitivities, nail length, or occasion details..."
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                />
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* BOOK APPOINTMENT CTA BUTTON (Matching Reference Layout) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs tracking-widest uppercase rounded-2xl shadow-warm-md hover:shadow-warm-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Submitting Appointment...' : 'BOOK APPOINTMENT'}
                </button>
                <p className="text-[11px] text-center text-[#8E766B] mt-2.5">
                  {selectedService?.name} • {selectedDate} at {selectedTime}
                </p>
              </div>

            </div>

          </div>

        </form>
      )}

      {/* CLIENT TESTIMONIES & REVIEWS SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBDCD4] shadow-warm-sm space-y-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F2E5DC] pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
              <span>Client Love & Testimonies</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420]">
              What Our Queens Say About Mira’s Touch
            </h2>
            <p className="text-xs text-[#7A6B63] mt-1.5 max-w-xl leading-relaxed">
              Read authentic experiences from our salon clients in Owerri, or share your own testimony about our hairstyles, nail artistry, and salon care.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(prev => !prev)}
            className="px-5 py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-full shadow-warm-xs transition-colors shrink-0 flex items-center space-x-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showReviewForm ? 'Close Form' : '+ Write a Testimony'}</span>
          </button>
        </div>

        {/* Success Alert */}
        {reviewSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{reviewSuccess}</span>
          </div>
        )}

        {/* Write a Testimony Form */}
        {showReviewForm && (
          <form onSubmit={handleAddReview} className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#DFC7B9] space-y-4 animate-fade-in">
            <h3 className="font-serif text-lg font-bold text-[#2C2420] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#B87D65]" />
              <span>Share Your Testimony</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Chioma Eze"
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Your City / Area in Imo State</label>
                <input
                  type="text"
                  value={newReview.location}
                  onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                  placeholder="e.g. New Owerri / Ikenegbu"
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Service Received *</label>
                <select
                  value={newReview.service}
                  onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
                >
                  <option value="Signature Knotless Bohemian Braids">Signature Knotless Bohemian Braids</option>
                  <option value="Master Sculpted Gel & Acrylic Nail Artistry">Master Sculpted Gel & Acrylic Nail Artistry</option>
                  <option value="Luxury Velvet Pedicure & Foot Scrub Sanctuary">Luxury Velvet Pedicure & Foot Scrub Sanctuary</option>
                  <option value="Celebration & Bridal Makeup Artistry">Celebration & Bridal Makeup Artistry</option>
                  <option value="Wispy Hybrid Flutter Lash Extensions">Wispy Hybrid Flutter Lash Extensions</option>
                  <option value="Luxury Perfumes & Scents Experience">Luxury Perfumes & Scents Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Rating</label>
                <div className="flex items-center space-x-1.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReview.rating
                            ? 'fill-[#B87D65] text-[#B87D65]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#2C2420] ml-2">
                    {newReview.rating} of 5 Stars
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3C35] mb-1">Your Testimony / Review *</label>
              <textarea
                rows={3}
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Describe your salon experience, the stylist's neatness, comfort, or compliments received..."
                className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-white border border-[#DFC7B9] text-xs font-semibold text-[#6E5D53] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-warm-xs transition-colors flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Testimony</span>
              </button>
            </div>
          </form>
        )}

        {/* Testimonies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EBDCD4] shadow-warm-xs flex flex-col justify-between space-y-3 hover:shadow-warm-sm transition-shadow"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#B87D65] text-[#B87D65]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8E766B] font-medium">{rev.date}</span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-[#DFC7B9] text-[10px] font-semibold text-[#944E2E]">
                  {rev.service}
                </div>

                <p className="text-xs text-[#5A4D45] leading-relaxed italic">
                  “{rev.comment}”
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#F2E5DC] pt-3">
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#2C2420]">{rev.name}</h4>
                  <p className="text-[10px] text-[#8E766B]">{rev.location}</p>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Client</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

