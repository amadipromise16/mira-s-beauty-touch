import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Users, Calendar, Sparkles, Heart, Package, 
  CheckCircle2, XCircle, Clock, Trash2, Edit3, Plus, 
  RefreshCw, Check, AlertCircle 
} from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'appointments' | 'services' | 'perfumes' | 'gallery' | 'users'
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [perfumes, setPerfumes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state for appointments
  const [aptStatusFilter, setAptStatusFilter] = useState('pending');
  const [aptSearch, setAptSearch] = useState('');

  // Modals / Action states
  const [actionApt, setActionApt] = useState(null); // Selected apt for modal
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject' | 'reschedule'
  const [modalData, setModalData] = useState({ date: '', time: '', notes: '' });

  // Creation forms
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: 'Hair Braiding', description: '', price_ngn: '', duration_mins: 60, image_url: '' });

  const [showAddPerfume, setShowAddPerfume] = useState(false);
  const [newPerfume, setNewPerfume] = useState({ name: '', brand: "Mira's Signature Reserve", description: '', fragrance_notes: '', size: '100ml EDP', price_ngn: '', stock_quantity: 10, image_url: '', is_featured: 1 });

  const [showAddGallery, setShowAddGallery] = useState(false);
  const [newGallery, setNewGallery] = useState({ title: '', category: 'Hair Braiding', media_type: 'image', media_url: '', description: '' });

  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }

    const handleDataEvent = () => {
      if (isAdmin) {
        loadAllData();
      }
    };

    window.addEventListener('mbt_data_change', handleDataEvent);
    window.addEventListener('storage', handleDataEvent);
    return () => {
      window.removeEventListener('mbt_data_change', handleDataEvent);
      window.removeEventListener('storage', handleDataEvent);
    };
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, srvRes, pRes, gRes, uRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getAppointments({ status: aptStatusFilter, search: aptSearch }),
        api.services.getAll(),
        api.perfumes.getAll(),
        api.gallery.getAll(),
        api.admin.getUsers()
      ]);
      setStats(sRes.stats);
      setAppointments(aRes.appointments || []);
      setServices(srvRes.services || []);
      setPerfumes(pRes.perfumes || []);
      setGallery(gRes.gallery || []);
      setCustomers(uRes.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAppointments = async (status) => {
    setAptStatusFilter(status);
    try {
      const res = await api.admin.getAppointments({ status, search: aptSearch });
      setAppointments(res.appointments || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Appointment Actions
  const handleApprove = async () => {
    try {
      await api.admin.approveAppointment(actionApt.id, {
        confirmed_date: modalData.date || actionApt.requested_date,
        confirmed_time: modalData.time || actionApt.requested_time,
        admin_notes: modalData.notes
      });
      setFeedback('Appointment approved and customer notified successfully.');
      setActionApt(null);
      loadAllData();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      await api.admin.rejectAppointment(actionApt.id, {
        admin_notes: modalData.notes
      });
      setFeedback('Appointment rejected and customer notified.');
      setActionApt(null);
      loadAllData();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to reject');
    }
  };

  const handleReschedule = async () => {
    try {
      await api.admin.rescheduleAppointment(actionApt.id, {
        new_date: modalData.date,
        new_time: modalData.time,
        admin_notes: modalData.notes
      });
      setFeedback('Appointment rescheduled and customer notified.');
      setActionApt(null);
      loadAllData();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to reschedule');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.admin.completeAppointment(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Service
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.services.create(newService);
      setShowAddService(false);
      setNewService({ name: '', category: 'Hair Braiding', description: '', price_ngn: '', duration_mins: 60, image_url: '' });
      loadAllData();
      setFeedback('New salon service created.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Perfume
  const handleCreatePerfume = async (e) => {
    e.preventDefault();
    try {
      await api.perfumes.create(newPerfume);
      setShowAddPerfume(false);
      setNewPerfume({ name: '', brand: "Mira's Signature Reserve", description: '', fragrance_notes: '', size: '100ml EDP', price_ngn: '', stock_quantity: 10, image_url: '', is_featured: 1 });
      loadAllData();
      setFeedback('New perfume added to boutique catalogue.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Gallery Item
  const handleCreateGallery = async (e) => {
    e.preventDefault();
    try {
      await api.gallery.create(newGallery);
      setShowAddGallery(false);
      setNewGallery({ title: '', category: 'Hair Braiding', media_type: 'image', media_url: '', description: '' });
      loadAllData();
      setFeedback('New gallery item published.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this gallery item? This will also remove its like records.')) return;
    try {
      await api.gallery.delete(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-[#2C2420]">Access Restricted</h3>
        <p className="text-xs text-[#7A6B63]">
          You must be signed in as an administrator to access the salon management portal.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-[#B87D65] text-white text-xs font-semibold rounded-full"
        >
          Return to Website
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-[#2C2420] to-[#4A3C35] text-white rounded-3xl p-6 sm:p-8 shadow-warm-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs text-[#EBDCD4] font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-[#B87D65]" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-3xl font-normal">
            Mira’s Beauty Touch Management
          </h1>
          <p className="text-xs text-[#DFC7B9]">
            Logged in as {user.full_name} ({user.email})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Refresh All"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-full bg-white text-[#2C2420] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
          >
            View Live Site →
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#EBDCD4] space-x-6 text-xs font-semibold uppercase tracking-wider overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'overview' ? 'text-[#B87D65] border-b-2 border-[#B87D65]' : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'appointments' ? 'text-[#B87D65] border-b-2 border-[#B87D65]' : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments ({stats?.pending_appointments || 0} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'services' ? 'text-[#B87D65] border-b-2 border-[#B87D65]' : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Services ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('perfumes')}
          className={`pb-3 shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'perfumes' ? 'text-[#B87D65] border-b-2 border-[#B87D65]' : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Perfumes ({perfumes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'gallery' ? 'text-[#B87D65] border-b-2 border-[#B87D65]' : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Gallery & Likes ({stats?.total_gallery_likes || 0} Likes)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'users' ? 'text-[#B87D65] border-b-2 border-[#B87D65]' : 'text-[#8E766B] hover:text-[#2C2420]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customers ({customers.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-5 rounded-2xl border border-[#EBDCD4] shadow-warm-sm">
              <span className="text-[10px] uppercase font-bold text-[#8E766B] block">Pending Bookings</span>
              <p className="text-3xl font-bold text-amber-600 mt-1">{stats?.pending_appointments || 0}</p>
              <p className="text-[11px] text-[#7A6B63] mt-1">Awaiting your approval</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDCD4] shadow-warm-sm">
              <span className="text-[10px] uppercase font-bold text-[#8E766B] block">Approved Bookings</span>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{stats?.approved_appointments || 0}</p>
              <p className="text-[11px] text-[#7A6B63] mt-1">Confirmed appointments</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDCD4] shadow-warm-sm">
              <span className="text-[10px] uppercase font-bold text-[#8E766B] block">Total Clients</span>
              <p className="text-3xl font-bold text-[#2C2420] mt-1">{stats?.total_clients || 0}</p>
              <p className="text-[11px] text-[#7A6B63] mt-1">Registered customer accounts</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDCD4] shadow-warm-sm">
              <span className="text-[10px] uppercase font-bold text-[#8E766B] block">Gallery Likes</span>
              <p className="text-3xl font-bold text-rose-500 mt-1">{stats?.total_gallery_likes || 0}</p>
              <p className="text-[11px] text-[#7A6B63] mt-1">Authenticated user likes</p>
            </div>

          </div>

          {/* Quick Action: Pending Appointments Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                  Immediate Attention: Pending Bookings
                </h3>
                <p className="text-xs text-[#7A6B63]">Review, approve, or reschedule client appointments.</p>
              </div>
              <button
                onClick={() => { setActiveTab('appointments'); handleFilterAppointments('pending'); }}
                className="text-xs font-semibold text-[#B87D65] hover:underline"
              >
                View All Appointments →
              </button>
            </div>

            <div className="divide-y divide-[#F2E5DC]">
              {appointments.filter(a => a.status === 'pending').slice(0, 5).map(apt => (
                <div key={apt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-[#2C2420]">{apt.customer_name}</span>
                      <span className="font-mono text-[10px] text-[#8E766B]">{apt.booking_ref}</span>
                    </div>
                    <p className="text-xs text-[#944E2E] font-medium">{apt.service_name}</p>
                    <p className="text-[11px] text-[#7A6B63]">
                      📅 {apt.requested_date} at {apt.requested_time} • Specialist: {apt.stylist_name}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setActionApt(apt);
                        setActionType('approve');
                        setModalData({ date: apt.requested_date, time: apt.requested_time, notes: '' });
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                    >
                      Approve & Notify
                    </button>
                    <button
                      onClick={() => {
                        setActionApt(apt);
                        setActionType('reject');
                        setModalData({ date: '', time: '', notes: '' });
                      }}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold rounded-lg"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              {appointments.filter(a => a.status === 'pending').length === 0 && (
                <p className="text-xs text-[#8E766B] py-6 text-center">No pending appointments right now. All caught up!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS WORKFLOW */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2E5DC] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
                Appointment Workflow & Management
              </h3>
              <p className="text-xs text-[#7A6B63]">
                Approve, reschedule, or cancel bookings. Approving automatically dispatches in-app notifications to customers.
              </p>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['pending', 'approved', 'completed', 'rejected', 'all'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleFilterAppointments(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    aptStatusFilter === st
                      ? 'bg-[#B87D65] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5A4D45] hover:bg-[#F2E5DC]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#8E766B] uppercase tracking-wider text-[10px] border-b border-[#EBDCD4]">
                <tr>
                  <th className="py-3 px-4">Ref / Client</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Requested Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E5DC]">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-[#944E2E]">{apt.booking_ref}</p>
                      <p className="font-semibold text-[#2C2420] mt-0.5">{apt.customer_name}</p>
                      <p className="text-[11px] text-[#8E766B]">{apt.customer_phone}</p>
                    </td>

                    <td className="py-3 px-4 font-medium text-[#2C2420]">
                      {apt.service_name}
                      {apt.customer_notes && (
                        <p className="text-[10px] text-[#7A6B63] italic mt-0.5">"{apt.customer_notes}"</p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#5A4D45]">
                      {apt.stylist_name}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#2C2420]">{apt.requested_date}</p>
                      <p className="text-[#8E766B]">{apt.requested_time}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setActionApt(apt);
                              setActionType('approve');
                              setModalData({ date: apt.requested_date, time: apt.requested_time, notes: '' });
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setActionApt(apt);
                              setActionType('reject');
                              setModalData({ date: '', time: '', notes: '' });
                            }}
                            className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px]"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {apt.status === 'approved' && (
                        <>
                          <button
                            onClick={() => handleComplete(apt.id)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => {
                              setActionApt(apt);
                              setActionType('reschedule');
                              setModalData({ date: apt.requested_date, time: apt.requested_time, notes: '' });
                            }}
                            className="px-2 py-1 bg-[#F2E5DC] text-[#944E2E] rounded text-[11px]"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2420]">Salon Services</h3>
              <p className="text-xs text-[#7A6B63]">Manage beauty treatments, descriptions, and Nigerian Naira (₦) prices.</p>
            </div>
            <button
              onClick={() => setShowAddService(!showAddService)}
              className="px-4 py-2 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-full flex items-center space-x-1.5 shadow-warm-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {showAddService && (
            <form onSubmit={handleCreateService} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#DFC7B9] space-y-4 animate-fade-in">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Add Salon Service</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="e.g. Knotless Boho Braids"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Category *</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  >
                    <option value="Hair Braiding">Hair Braiding</option>
                    <option value="Manicures & Pedicures">Manicures & Pedicures</option>
                    <option value="Nail Enhancements">Nail Enhancements</option>
                    <option value="Professional Makeup">Professional Makeup</option>
                    <option value="Eyelash Extensions">Eyelash Extensions</option>
                    <option value="Fragrance & Wellness">Fragrance & Wellness</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Price in Naira (₦) *</label>
                  <input
                    type="number"
                    required
                    value={newService.price_ngn}
                    onChange={(e) => setNewService({ ...newService, price_ngn: e.target.value })}
                    placeholder="25000"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    value={newService.duration_mins}
                    onChange={(e) => setNewService({ ...newService, duration_mins: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newService.image_url}
                    onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-4 py-2 bg-gray-200 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87D65] text-white text-xs font-semibold rounded-lg"
                >
                  Save Service
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div key={service.id} className="p-4 rounded-xl border border-[#EBDCD4] bg-[#FAF7F2] space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-serif font-bold text-sm text-[#2C2420]">{service.name}</h4>
                  <span className="text-xs font-bold text-[#B87D65]">₦{service.price_ngn?.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#8E766B] uppercase font-semibold">{service.category} • {service.duration_mins} min</p>
                <p className="text-xs text-[#6E5D53] line-clamp-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERFUMES MANAGEMENT */}
      {activeTab === 'perfumes' && (
        <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2420]">Perfume Boutique Catalogue</h3>
              <p className="text-xs text-[#7A6B63]">Manage luxury flacons, scent notes, and Nigerian Naira (₦) prices.</p>
            </div>
            <button
              onClick={() => setShowAddPerfume(!showAddPerfume)}
              className="px-4 py-2 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-full flex items-center space-x-1.5 shadow-warm-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Perfume</span>
            </button>
          </div>

          {showAddPerfume && (
            <form onSubmit={handleCreatePerfume} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#DFC7B9] space-y-4 animate-fade-in">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Add Perfume Flacon</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={newPerfume.name}
                    onChange={(e) => setNewPerfume({ ...newPerfume, name: e.target.value })}
                    placeholder="e.g. Amber Imperial"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Brand / House *</label>
                  <input
                    type="text"
                    required
                    value={newPerfume.brand}
                    onChange={(e) => setNewPerfume({ ...newPerfume, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Price in Naira (₦) *</label>
                  <input
                    type="number"
                    required
                    value={newPerfume.price_ngn}
                    onChange={(e) => setNewPerfume({ ...newPerfume, price_ngn: e.target.value })}
                    placeholder="45000"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Bottle Size</label>
                  <input
                    type="text"
                    value={newPerfume.size}
                    onChange={(e) => setNewPerfume({ ...newPerfume, size: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newPerfume.stock_quantity}
                    onChange={(e) => setNewPerfume({ ...newPerfume, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Fragrance Notes Breakdown</label>
                <input
                  type="text"
                  value={newPerfume.fragrance_notes}
                  onChange={(e) => setNewPerfume({ ...newPerfume, fragrance_notes: e.target.value })}
                  placeholder="Top: Bergamot | Heart: Rose | Base: Vanilla, Oud"
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Image URL</label>
                <input
                  type="url"
                  value={newPerfume.image_url}
                  onChange={(e) => setNewPerfume({ ...newPerfume, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddPerfume(false)}
                  className="px-4 py-2 bg-gray-200 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87D65] text-white text-xs font-semibold rounded-lg"
                >
                  Save Perfume
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {perfumes.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-[#EBDCD4] bg-[#FAF7F2] space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-serif font-bold text-sm text-[#2C2420]">{p.name}</h4>
                  <span className="text-xs font-bold text-[#B87D65]">₦{p.price_ngn?.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#8E766B] uppercase font-semibold">{p.brand} • {p.size}</p>
                <p className="text-xs text-[#6E5D53] line-clamp-2">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GALLERY & REAL LIKE SYSTEM */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C2420]">Gallery & Authentic Likes</h3>
              <p className="text-xs text-[#7A6B63]">
                Manage salon photos and videos. Real authenticated like counts are synchronized with the database.
              </p>
            </div>
            <button
              onClick={() => setShowAddGallery(!showAddGallery)}
              className="px-4 py-2 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-full flex items-center space-x-1.5 shadow-warm-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Media Item</span>
            </button>
          </div>

          {showAddGallery && (
            <form onSubmit={handleCreateGallery} className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#DFC7B9] space-y-4 animate-fade-in">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Publish Gallery Media</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newGallery.title}
                    onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                    placeholder="e.g. Bohemian Goddess Braids"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Category *</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  >
                    <option value="Hair Braiding">Hair Braiding</option>
                    <option value="Nails & Art">Nails & Art</option>
                    <option value="Makeup Artistry">Makeup Artistry</option>
                    <option value="Lash Extensions">Lash Extensions</option>
                    <option value="Perfume Curation">Perfume Curation</option>
                    <option value="Salon Showcase">Salon Showcase</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Media Type *</label>
                  <select
                    value={newGallery.media_type}
                    onChange={(e) => setNewGallery({ ...newGallery, media_type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  >
                    <option value="image">Image URL</option>
                    <option value="video">Video URL / Local Video Path</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Media URL *</label>
                  <input
                    type="text"
                    required
                    value={newGallery.media_url}
                    onChange={(e) => setNewGallery({ ...newGallery, media_url: e.target.value })}
                    placeholder="/media/mira_story_video.mp4 or https://..."
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3C35] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddGallery(false)}
                  className="px-4 py-2 bg-gray-200 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B87D65] text-white text-xs font-semibold rounded-lg"
                >
                  Publish Item
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div key={item.id} className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EBDCD4] p-3 flex flex-col justify-between">
                <div>
                  <div className="h-40 rounded-xl overflow-hidden bg-black/10 mb-2 relative">
                    {item.media_type === 'video' ? (
                      <video src={item.media_url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      {item.media_type}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#2C2420]">{item.title}</h4>
                  <p className="text-[10px] text-[#8E766B]">{item.category}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#DFC7B9] flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-600 flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{item.like_count} authentic {item.like_count === 1 ? 'like' : 'likes'}</span>
                  </span>

                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-[#EBDCD4] shadow-warm-sm space-y-6">
          <div className="border-b border-[#F2E5DC] pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#2C2420]">Customer Directory</h3>
            <p className="text-xs text-[#7A6B63]">Registered clients and booking frequency. (Passwords are fully hashed and securely hidden).</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#8E766B] uppercase tracking-wider text-[10px] border-b border-[#EBDCD4]">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Total Bookings</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E5DC]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2]/50">
                    <td className="py-3 px-4 font-semibold text-[#2C2420]">{c.full_name}</td>
                    <td className="py-3 px-4 text-[#5A4D45]">{c.email}</td>
                    <td className="py-3 px-4 text-[#5A4D45]">{c.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.role === 'admin' ? 'bg-[#F2E5DC] text-[#944E2E]' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#B87D65]">{c.total_appointments}</td>
                    <td className="py-3 px-4 text-[#8E766B]">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPOINTMENT ACTION MODAL (Approve / Reject / Reschedule) */}
      {actionApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg shadow-2xl border border-[#EBDCD4] p-6 space-y-4">
            
            <div className="border-b border-[#DFC7B9] pb-3">
              <h4 className="font-serif text-xl font-bold text-[#2C2420]">
                {actionType === 'approve' && 'Approve Appointment'}
                {actionType === 'reject' && 'Decline Appointment'}
                {actionType === 'reschedule' && 'Reschedule Appointment'}
              </h4>
              <p className="text-xs text-[#7A6B63] mt-0.5">
                Client: {actionApt.customer_name} ({actionApt.booking_ref}) • Service: {actionApt.service_name}
              </p>
            </div>

            {(actionType === 'approve' || actionType === 'reschedule') && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Confirmed Date</label>
                  <input
                    type="date"
                    value={modalData.date}
                    onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A3C35] mb-1">Confirmed Time</label>
                  <input
                    type="text"
                    value={modalData.time}
                    onChange={(e) => setModalData({ ...modalData, time: e.target.value })}
                    placeholder="10:15 AM"
                    className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#4A3C35] mb-1">
                {actionType === 'reject' ? 'Reason / Notes for Client (Required)' : 'Optional Note for Client'}
              </label>
              <textarea
                rows={3}
                value={modalData.notes}
                onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                placeholder={actionType === 'reject' ? 'e.g. Stylist is fully booked for this time slot...' : 'e.g. Please arrive 10 minutes early...'}
                className="w-full px-3 py-2 bg-white border border-[#DFC7B9] rounded-lg text-xs"
              />
            </div>

            {actionType === 'approve' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <p className="font-bold">Automated Notification to Customer:</p>
                <p>
                  "Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for {modalData.date || actionApt.requested_date} at {modalData.time || actionApt.requested_time}."
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActionApt(null)}
                className="px-4 py-2 bg-gray-200 text-xs rounded-lg"
              >
                Cancel
              </button>

              {actionType === 'approve' && (
                <button
                  onClick={handleApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Confirm Approval & Dispatch
                </button>
              )}

              {actionType === 'reject' && (
                <button
                  onClick={handleReject}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Decline & Notify
                </button>
              )}

              {actionType === 'reschedule' && (
                <button
                  onClick={handleReschedule}
                  className="px-5 py-2 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save Reschedule & Notify
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

