import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Bell, CheckCheck, CalendarCheck, Info, Sparkles } from 'lucide-react';

export function NotificationDrawer({ isOpen, onClose, onNavigate }) {
  const { user, setUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.notifications.getAll();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#EBDCD4] flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#EBDCD4] flex items-center justify-between bg-white/70">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#F2E5DC] text-[#B87D65] rounded-full">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2C2420]">Your Notifications</h3>
                <p className="text-[11px] text-[#7A6B63]">Stay updated on appointments & approvals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] text-[#B87D65] hover:text-[#944E2E] font-medium flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read all</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[#7A6B63] hover:text-[#2C2420] hover:bg-[#F2E5DC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="text-center py-12 text-xs text-[#8E766B]">Loading updates...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16 text-[#8E766B] space-y-2">
                <Sparkles className="w-8 h-8 text-[#DFC7B9] mx-auto" />
                <p className="text-xs font-medium">You have no notifications yet.</p>
                <p className="text-[11px]">Appointment booking updates will appear here.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isApproved = notif.type === 'appointment_approved';
                const isRejected = notif.type === 'appointment_rejected';
                return (
                  <div
                    key={notif.id}
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      notif.is_read
                        ? 'bg-white/60 border-[#F0E4DC] opacity-75'
                        : isApproved
                          ? 'bg-[#F9F4EE] border-[#B87D65] shadow-warm-sm'
                          : 'bg-white border-[#E8DACF] shadow-warm-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-1.5">
                        {isApproved ? (
                          <CalendarCheck className="w-4 h-4 text-[#B87D65]" />
                        ) : (
                          <Info className="w-4 h-4 text-[#8E766B]" />
                        )}
                        <h4 className={`text-xs font-semibold ${isApproved ? 'text-[#944E2E]' : 'text-[#2C2420]'}`}>
                          {notif.title}
                        </h4>
                      </div>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#B87D65]" />
                      )}
                    </div>

                    <p className="text-xs text-[#4A3C35] mt-1.5 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#8E766B]">
                      <span>{new Date(notif.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {notif.appointment_id && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('dashboard');
                          }}
                          className="text-[#B87D65] hover:underline font-medium"
                        >
                          View in Bookings →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#EBDCD4] bg-white/50 text-center">
            <button
              onClick={() => {
                onClose();
                onNavigate('dashboard');
              }}
              className="text-xs font-semibold text-[#B87D65] hover:underline"
            >
              Go to Customer Dashboard & Bookings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

