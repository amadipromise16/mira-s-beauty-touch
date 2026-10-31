import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, User, Phone, Mail, CheckCircle2, 
  AlertCircle, XCircle, Bell, Sparkles, Edit2 
} from 'lucide-react';

export function UserDashboard({ onNavigate }) {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'notifications' | 'profile'

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || ''
  });
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [aptRes, notifRes] = await Promise.all([
        api.appointments.getMyBookings(),
        api.notifications.getAll()
      ]);
      setBookings(aptRes.bookings || []);
      setNotifications(notifRes.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment request?')) return;
    try {
      await api.appointments.cancel(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.auth.updateProfile(profileData);
      setProfileMessage('Profile updated successfully!');
      refreshUser();
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-[#EBDCD4] text-center space-y-4">
        <Sparkles className="w-10 h-10 text-[#B87D65] mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-[#2C2420]">Please Sign In</h3>
        <p className="text-xs text-[#7A6B63]">You need to be logged in to view your appointments and notifications.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-[#B87D65] text-white text-xs font-semibold rounded-full"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FAF4F0] via-white to-[#FAF4F0] rounded-3xl p-6 sm:p-8 border border-[#EBDCD4] shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B87D65]">
            Client Portal
          </span>
          <h1 className="font-serif text-3xl text-[#2C2420] font-normal mt-1">
            Hello, {user.full_name}
          </h1>
          <p className="text-xs text-[#7A6B63] mt-1">
            Manage your salon appointments, approvals, and personal profile details.
          </p>
        </div>

        <button
          onClick={() => onNavigate('book')}
          className="px-6 py-3 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-warm-sm transition-colors self-start sm:self-auto"
        >
          + Book New Appointment
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#EBDCD4] space-x-6 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 transition-colors flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'text-[#B87D65] border-b-2 border-[#B87D65]'
              : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 transition-colors flex items-center space-x-2 ${
            activeTab === 'notifications'
              ? 'text-[#B87D65] border-b-2 border-[#B87D65]'
              : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Updates & Notifications ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'text-[#B87D65] border-b-2 border-[#B87D65]'
              : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-xs text-[#8E766B]">Loading your appointments...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EBDCD4] space-y-4 shadow-warm-sm">
              <Calendar className="w-12 h-12 text-[#DFC7B9] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#2C2420]">No Appointments Yet</h3>
              <p className="text-xs text-[#7A6B63] max-w-sm mx-auto">
                You haven't requested any salon bookings yet. Select your hair braiding, nails, makeup, or perfume consultation today!
              </p>
              <button
                onClick={() => onNavigate('book')}
                className="px-6 py-2.5 bg-[#B87D65] text-white text-xs font-semibold rounded-full shadow-warm-sm"
              >
                Book Your First Visit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => {
                const isApproved = booking.status === 'approved';
                const isPending = booking.status === 'pending';
                const isRejected = booking.status === 'rejected';

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-6 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top bar with Ref & Status */}
                      <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-3">
                        <span className="font-mono text-xs font-bold text-[#8E766B]">
                          {booking.booking_ref}
                        </span>
                        
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider flex items-center space-x-1 ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPending
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : isRejected
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isPending && <Clock className="w-3.5 h-3.5" />}
                          {isRejected && <XCircle className="w-3.5 h-3.5" />}
                          <span>{booking.status}</span>
                        </span>
                      </div>

                      {/* Service & Details */}
                      <div className="mt-3 space-y-2">
                        <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                          {booking.service_name}
                        </h3>

                        <div className="grid grid-cols-2 gap-2 text-xs text-[#5A4D45] pt-1">
                          <div>
                            <span className="text-[10px] text-[#8E766B] block uppercase tracking-wider">Stylist</span>
                            <span className="font-semibold">{booking.stylist_name || 'Assigned Specialist'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8E766B] block uppercase tracking-wider">Requested Date & Time</span>
                            <span className="font-semibold">{booking.requested_date} at {booking.requested_time}</span>
                          </div>
                        </div>

                        {/* Confirmed schedule if approved */}
                        {isApproved && booking.confirmed_date_time && (
                          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                            <strong>Confirmed Time:</strong> {booking.confirmed_date_time}
                          </div>
                        )}

                        {booking.customer_notes && (
                          <div className="p-2 bg-[#FAF7F2] rounded-lg text-[11px] text-[#6E5D53]">
                            <strong>Notes:</strong> {booking.customer_notes}
                          </div>
                        )}

                        {booking.admin_notes && (
                          <div className="p-2 bg-[#F4ECE6] rounded-lg text-[11px] text-[#944E2E]">
                            <strong>Salon Manager Note:</strong> {booking.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#F2E5DC] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#8E766B]">
                        Submitted {new Date(booking.created_at).toLocaleDateString()}
                      </span>

                      {isPending && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Notifications Feed */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD4] shadow-warm-sm max-w-3xl space-y-4">
          <div className="border-b border-[#F2E5DC] pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
              In-App Notification Feed
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1">
              Every appointment status approval or update appears here in real time.
            </p>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-[#8E766B] py-8 text-center">No notifications recorded.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border ${
                    notif.type === 'appointment_approved'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-[#FAF7F2] border-[#EBDCD4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#2C2420]">{notif.title}</h4>
                    <span className="text-[10px] text-[#8E766B]">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A3C35] mt-1.5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD4] shadow-warm-sm max-w-xl space-y-6">
          <div className="border-b border-[#F2E5DC] pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
              Personal Information
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1">
              Keep your contact details up to date for appointment updates.
            </p>
          </div>

          {profileMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl">
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4A3C35] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3C35] mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A3C35] mb-1">Phone Number (Nigeria)</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+234 803 123 4567"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DFC7B9] rounded-xl text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-xl shadow-warm-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

