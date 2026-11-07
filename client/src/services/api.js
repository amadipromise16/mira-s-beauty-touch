// Client API Service for Mira's Beauty Touch (Owerri, Imo State)
// Complete hybrid client with instant static & offline fallback for 100% full functionality on GitHub Pages

import { initialServicesData } from '../data/servicesData';
import { initialPerfumesData } from '../data/perfumesData';
import { initialGalleryData } from '../data/galleryData';

const API_BASE = '/api';

// Storage Keys
const KEYS = {
  TOKEN: 'mbt_token',
  USER: 'mbt_user',
  APPOINTMENTS: 'mbt_appointments',
  CLIENT_ACCOUNTS: 'mbt_client_accounts',
  USERS: 'mbt_users',
  SERVICES: 'mbt_services',
  PERFUMES: 'mbt_perfumes',
  GALLERY: 'mbt_gallery',
  NOTIFICATIONS: 'mbt_notifications',
};

// Initial Seed Data (Owerri, Imo State salon clients and bookings)
const SEED_USERS = [
  {
    id: 1,
    full_name: "Mira Admin",
    email: "mirabeautytouch@gmail.com",
    phone: "+234 903 727 6804",
    role: "admin",
    total_appointments: 0,
    created_at: "2026-10-01T08:00:00.000Z"
  },
  {
    id: 2,
    full_name: "Chioma Eze",
    email: "chioma.eze@example.com",
    phone: "+234 803 234 5678",
    role: "client",
    total_appointments: 3,
    created_at: "2026-10-15T10:30:00.000Z"
  },
  {
    id: 3,
    full_name: "Amaka Nwachukwu",
    email: "amaka.nwa@example.com",
    phone: "+234 812 345 6789",
    role: "client",
    total_appointments: 2,
    created_at: "2026-10-20T14:15:00.000Z"
  },
  {
    id: 4,
    full_name: "Blessing Okoro",
    email: "blessing.okoro@example.com",
    phone: "+234 806 789 0123",
    role: "client",
    total_appointments: 1,
    created_at: "2026-10-25T09:45:00.000Z"
  },
  {
    id: 5,
    full_name: "Ngozi Obi",
    email: "ngozi.obi@example.com",
    phone: "+234 818 901 2345",
    role: "client",
    total_appointments: 1,
    created_at: "2026-10-28T16:00:00.000Z"
  }
];

const SEED_APPOINTMENTS = [
  {
    id: 'apt_101',
    booking_ref: 'MBT-784210',
    reference_code: 'MBT-784210',
    service_id: 1,
    service_name: 'Master Sculpted Gel & Acrylic Nail Artistry',
    stylist_name: "Mira’s Beauty Touch Specialist",
    customer_name: 'Chioma Eze',
    customer_email: 'chioma.eze@example.com',
    customer_phone: '+234 803 234 5678',
    requested_date: '2026-11-03',
    requested_time: '10:00 AM',
    confirmed_date: '2026-11-03',
    confirmed_time: '10:00 AM',
    price_ngn: 22000,
    status: 'confirmed',
    customer_notes: 'Square shape with chrome accents, ready for weekend event.',
    admin_notes: 'Station 2 prepped with rose gold chrome powder.',
    created_at: '2026-10-30T10:15:00.000Z'
  },
  {
    id: 'apt_102',
    booking_ref: 'MBT-891045',
    reference_code: 'MBT-891045',
    service_id: 2,
    service_name: 'Signature Knotless Bohemian Hair Braiding',
    stylist_name: "Mira’s Beauty Touch Specialist",
    customer_name: 'Amaka Nwachukwu',
    customer_email: 'amaka.nwa@example.com',
    customer_phone: '+234 812 345 6789',
    requested_date: '2026-11-04',
    requested_time: '12:30 PM',
    confirmed_date: null,
    confirmed_time: null,
    price_ngn: 28000,
    status: 'pending',
    customer_notes: 'Mid-back length with honey blonde highlights.',
    admin_notes: '',
    created_at: '2026-10-31T09:00:00.000Z'
  },
  {
    id: 'apt_103',
    booking_ref: 'MBT-945203',
    reference_code: 'MBT-945203',
    service_id: 6,
    service_name: 'Luxury Velvet Pedicure & Foot Scrub Sanctuary',
    stylist_name: "Mira’s Beauty Touch Specialist",
    customer_name: 'Blessing Okoro',
    customer_email: 'blessing.okoro@example.com',
    customer_phone: '+234 806 789 0123',
    requested_date: '2026-11-05',
    requested_time: '02:00 PM',
    confirmed_date: null,
    confirmed_time: null,
    price_ngn: 16000,
    status: 'pending',
    customer_notes: 'Deep moisturizing scrub and neutral nude gel finish.',
    admin_notes: '',
    created_at: '2026-10-31T15:20:00.000Z'
  },
  {
    id: 'apt_104',
    booking_ref: 'MBT-632190',
    reference_code: 'MBT-632190',
    service_id: 8,
    service_name: 'Wispy Hybrid Flutter Lash Extensions',
    stylist_name: "Mira’s Beauty Touch Specialist",
    customer_name: 'Ngozi Obi',
    customer_email: 'ngozi.obi@example.com',
    customer_phone: '+234 818 901 2345',
    requested_date: '2026-11-02',
    requested_time: '11:00 AM',
    confirmed_date: '2026-11-02',
    confirmed_time: '11:00 AM',
    price_ngn: 18000,
    status: 'completed',
    customer_notes: 'Cat-eye wispy flutter with gentle mapping.',
    admin_notes: 'Completed beautifully.',
    created_at: '2026-10-28T16:00:00.000Z'
  }
];

// Helper Functions for Local Storage Engine
function getLocal(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      if (defaultVal !== undefined) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
      }
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultVal;
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

function getLocalPerfumes() {
  const stored = getLocal(KEYS.PERFUMES, initialPerfumesData);
  const updated = stored.map(item => {
    const base = initialPerfumesData.find(p => p.id === item.id);
    if (base) {
      return { ...item, price_ngn: base.price_ngn, size: base.size };
    }
    return item;
  });
  initialPerfumesData.forEach(base => {
    if (!updated.some(p => p.id === base.id)) {
      updated.push(base);
    }
  });
  setLocal(KEYS.PERFUMES, updated);
  return updated;
}

function getLocalServices() {
  const stored = getLocal(KEYS.SERVICES, initialServicesData);
  const updated = stored.map(item => {
    const base = initialServicesData.find(s => s.id === item.id);
    if (base) {
      return { ...item, price_ngn: base.price_ngn };
    }
    return item;
  });
  initialServicesData.forEach(base => {
    if (!updated.some(s => s.id === base.id)) {
      updated.push(base);
    }
  });
  setLocal(KEYS.SERVICES, updated);
  return updated;
}

function getLocalGallery() {
  const stored = getLocal(KEYS.GALLERY, initialGalleryData);
  const updated = [...stored];
  initialGalleryData.forEach(base => {
    const existingIdx = updated.findIndex(g => g.id === base.id || g.media_url === base.media_url);
    if (existingIdx !== -1) {
      updated[existingIdx] = {
        ...base,
        ...updated[existingIdx],
        title: base.title,
        description: base.description,
        hair_summary: base.hair_summary,
        hair_style_name: base.hair_style_name,
        category: base.category,
        media_type: base.media_type,
        media_url: base.media_url,
        booking_service: base.booking_service,
        display_order: base.display_order,
        tags: base.tags,
        like_count: Math.max(updated[existingIdx].like_count || 0, base.like_count || 0)
      };
    } else {
      updated.push(base);
    }
  });
  setLocal(KEYS.GALLERY, updated);
  return updated;
}

function emitDataChange(type, detail) {
  try {
    window.dispatchEvent(new CustomEvent('mbt_data_change', { detail: { type, detail } }));
  } catch (_) {}
}

function getAuthHeader() {
  const token = localStorage.getItem(KEYS.TOKEN);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: async (credentials) => {
      try {
        return await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      } catch (err) {
        const cleanEmail = (credentials.email || '').trim().toLowerCase();
        const cleanPass = (credentials.password || '').trim();

        const customAdminPass = localStorage.getItem('mbt_admin_custom_pass');
        if (cleanEmail === 'mirabeautytouch@gmail.com' && (cleanPass === 'miratouch' || (customAdminPass && cleanPass === customAdminPass))) {
          const adminUser = {
            id: 1,
            full_name: 'Mira Admin',
            email: 'mirabeautytouch@gmail.com',
            phone: '+234 903 727 6804',
            role: 'admin'
          };
          const token = 'mbt_admin_token_' + Date.now();
          setLocal(KEYS.USER, adminUser);
          localStorage.setItem(KEYS.TOKEN, token);
          return { user: adminUser, token };
        }

        const accounts = getLocal(KEYS.CLIENT_ACCOUNTS, []);
        const found = accounts.find(a => (a.email || '').toLowerCase() === cleanEmail);
        if (found && found.password === cleanPass) {
          const clientUser = {
            id: found.id || Date.now(),
            full_name: found.full_name,
            email: found.email,
            phone: found.phone,
            role: 'client'
          };
          const token = 'mbt_client_token_' + Date.now();
          setLocal(KEYS.USER, clientUser);
          localStorage.setItem(KEYS.TOKEN, token);
          return { user: clientUser, token };
        }
        throw new Error('Invalid email or password. Please verify credentials or register.');
      }
    },

    register: async (userData) => {
      try {
        return await request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
      } catch (err) {
        const cleanEmail = (userData.email || '').trim().toLowerCase();
        const cleanName = (userData.full_name || 'Valued Client').trim();
        const cleanPhone = (userData.phone || '+234 800 000 0000').trim();

        const newClient = {
          id: Date.now(),
          full_name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'client',
          total_appointments: 0,
          created_at: new Date().toISOString()
        };

        // 1. Save into client accounts list (for login credentials)
        const accounts = getLocal(KEYS.CLIENT_ACCOUNTS, []);
        const accIdx = accounts.findIndex(a => (a.email || '').toLowerCase() === cleanEmail);
        const accRecord = { ...newClient, password: (userData.password || '').trim() };
        if (accIdx !== -1) {
          accounts[accIdx] = { ...accounts[accIdx], ...accRecord };
        } else {
          accounts.push(accRecord);
        }
        setLocal(KEYS.CLIENT_ACCOUNTS, accounts);

        // 2. Save into users directory (for admin dashboard table)
        const allUsers = getLocal(KEYS.USERS, SEED_USERS);
        const userIdx = allUsers.findIndex(u => (u.email || '').toLowerCase() === cleanEmail);
        if (userIdx !== -1) {
          allUsers[userIdx] = { ...allUsers[userIdx], ...newClient };
        } else {
          allUsers.push(newClient);
        }
        setLocal(KEYS.USERS, allUsers);

        const token = 'mbt_client_token_' + Date.now();
        setLocal(KEYS.USER, newClient);
        localStorage.setItem(KEYS.TOKEN, token);

        emitDataChange('user_registered', newClient);
        return { user: newClient, token };
      }
    },

    me: async () => {
      try {
        return await request('/auth/me');
      } catch (_) {
        const user = getLocal(KEYS.USER, null);
        return { user };
      }
    },

    forgotPassword: async (email) => {
      const cleanEmail = (email || '').trim().toLowerCase();
      try {
        const res = await request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: cleanEmail })
        });
        if (res && (res.code || res.otp_code)) {
          localStorage.setItem('mbt_last_code', res.code || res.otp_code);
        }
        return res;
      } catch (_) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('mbt_last_code', code);
        return {
          message: `A 6-digit verification code has been generated for ${cleanEmail}: ${code}`,
          code: code,
          otp_code: code,
          email: cleanEmail
        };
      }
    },

    resetPassword: async (payload) => {
      const cleanEmail = (payload.email || '').trim().toLowerCase();
      const code = (payload.code || payload.token || '').trim();
      const newPassword = payload.new_password || payload.password || '';

      try {
        const res = await request('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ email: cleanEmail, code, new_password: newPassword })
        });
        if (res && res.token && res.user) {
          localStorage.setItem(KEYS.TOKEN, res.token);
          localStorage.setItem(KEYS.USER, JSON.stringify(res.user));
        }
        return res;
      } catch (err) {
        // Fallback for static/offline client
        const accounts = getLocal('mbt_client_accounts', []);
        const idx = accounts.findIndex(a => (a.email || '').toLowerCase() === cleanEmail);
        let user;
        if (idx !== -1) {
          accounts[idx].password = newPassword;
          setLocal('mbt_client_accounts', accounts);
          user = {
            id: accounts[idx].id || Date.now(),
            full_name: accounts[idx].full_name || 'Client',
            email: cleanEmail,
            role: accounts[idx].role || 'client'
          };
        } else {
          user = {
            id: Date.now(),
            full_name: 'Client',
            email: cleanEmail,
            role: 'client'
          };
          accounts.push({ ...user, password: newPassword });
          setLocal('mbt_client_accounts', accounts);
        }

        if (cleanEmail === 'mirabeautytouch@gmail.com') {
          localStorage.setItem('mbt_admin_custom_pass', newPassword);
        }

        const simToken = 'mbt_client_token_' + Date.now();
        setLocal(KEYS.TOKEN, simToken);
        setLocal(KEYS.USER, user);

        return {
          message: 'Password updated successfully! You are now logged in.',
          token: simToken,
          user
        };
      }
    },

    updateProfile: async (profile) => {
      try {
        return await request('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) });
      } catch (_) {
        const current = getLocal(KEYS.USER, {});
        const updated = { ...current, ...profile };
        setLocal(KEYS.USER, updated);

        // Sync with users list
        const users = getLocal(KEYS.USERS, SEED_USERS);
        const idx = users.findIndex(u => u.email === updated.email);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updated };
          setLocal(KEYS.USERS, users);
        }
        emitDataChange('profile_updated', updated);
        return { message: 'Profile updated successfully', user: updated };
      }
    },
  },

  // Services
  services: {
    getAll: async (params = {}) => {
      try {
        const q = new URLSearchParams(params).toString();
        return await request(`/services${q ? `?${q}` : ''}`);
      } catch (_) {
        const services = getLocalServices();
        let list = [...services];
        if (params.category && params.category !== 'All') {
          list = list.filter(s => s.category === params.category);
        }
        return { services: list };
      }
    },

    getCategories: async () => {
      try {
        return await request('/services/categories');
      } catch (_) {
        const services = getLocalServices();
        const cats = Array.from(new Set(services.map(s => s.category)));
        return { categories: cats };
      }
    },

    getById: async (id) => {
      try {
        return await request(`/services/${id}`);
      } catch (_) {
        const services = getLocalServices();
        const item = services.find(s => s.id == id);
        return { service: item };
      }
    },

    create: async (serviceData) => {
      try {
        return await request('/services', { method: 'POST', body: JSON.stringify(serviceData) });
      } catch (_) {
        const services = getLocalServices();
        const newItem = {
          id: Date.now(),
          ...serviceData,
          price_ngn: Number(serviceData.price_ngn) || 15000,
          duration_mins: Number(serviceData.duration_mins) || 60,
          created_at: new Date().toISOString()
        };
        services.unshift(newItem);
        setLocal(KEYS.SERVICES, services);
        emitDataChange('service_created', newItem);
        return { message: 'Service added successfully', service: newItem };
      }
    },

    update: async (id, serviceData) => {
      try {
        return await request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(serviceData) });
      } catch (_) {
        const services = getLocalServices();
        const idx = services.findIndex(s => s.id == id);
        if (idx !== -1) {
          services[idx] = { ...services[idx], ...serviceData };
          setLocal(KEYS.SERVICES, services);
        }
        emitDataChange('service_updated', services[idx]);
        return { message: 'Service updated', service: services[idx] };
      }
    },

    delete: async (id) => {
      try {
        return await request(`/services/${id}`, { method: 'DELETE' });
      } catch (_) {
        let services = getLocalServices();
        services = services.filter(s => s.id != id);
        setLocal(KEYS.SERVICES, services);
        emitDataChange('service_deleted', id);
        return { message: 'Service removed' };
      }
    },
  },

  // Perfumes
  perfumes: {
    getAll: async (params = {}) => {
      try {
        const q = new URLSearchParams(params).toString();
        return await request(`/perfumes${q ? `?${q}` : ''}`);
      } catch (_) {
        const perfumes = getLocalPerfumes();
        let list = [...perfumes];
        if (params.featured === 'true') {
          list = list.filter(p => p.is_featured);
        }
        return { perfumes: list };
      }
    },

    getBrands: async () => {
      try {
        return await request('/perfumes/brands');
      } catch (_) {
        const perfumes = getLocalPerfumes();
        const brands = Array.from(new Set(perfumes.map(p => p.brand).filter(Boolean)));
        return { brands };
      }
    },

    getById: async (id) => {
      try {
        return await request(`/perfumes/${id}`);
      } catch (_) {
        const perfumes = getLocalPerfumes();
        const item = perfumes.find(p => p.id == id);
        return { perfume: item };
      }
    },

    create: async (data) => {
      try {
        return await request('/perfumes', { method: 'POST', body: JSON.stringify(data) });
      } catch (_) {
        const perfumes = getLocalPerfumes();
        const newItem = {
          id: Date.now(),
          ...data,
          price_ngn: Number(data.price_ngn) || 18000,
          stock_quantity: Number(data.stock_quantity) || 10,
          created_at: new Date().toISOString()
        };
        perfumes.unshift(newItem);
        setLocal(KEYS.PERFUMES, perfumes);
        emitDataChange('perfume_created', newItem);
        return { message: 'Perfume created successfully', perfume: newItem };
      }
    },

    update: async (id, data) => {
      try {
        return await request(`/perfumes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      } catch (_) {
        const perfumes = getLocalPerfumes();
        const idx = perfumes.findIndex(p => p.id == id);
        if (idx !== -1) {
          perfumes[idx] = { ...perfumes[idx], ...data };
          setLocal(KEYS.PERFUMES, perfumes);
        }
        emitDataChange('perfume_updated', perfumes[idx]);
        return { message: 'Perfume updated', perfume: perfumes[idx] };
      }
    },

    delete: async (id) => {
      try {
        return await request(`/perfumes/${id}`, { method: 'DELETE' });
      } catch (_) {
        let perfumes = getLocalPerfumes();
        perfumes = perfumes.filter(p => p.id != id);
        setLocal(KEYS.PERFUMES, perfumes);
        emitDataChange('perfume_deleted', id);
        return { message: 'Perfume removed' };
      }
    },
  },

  // Gallery
  gallery: {
    getAll: async (params = {}) => {
      try {
        const q = new URLSearchParams(params).toString();
        return await request(`/gallery${q ? `?${q}` : ''}`);
      } catch (_) {
        const gallery = getLocalGallery();
        let list = [...gallery];
        if (params.category && params.category !== 'All') {
          list = list.filter(g => g.category === params.category);
        }
        if (params.type && params.type !== 'All') {
          list = list.filter(g => g.media_type === params.type);
        }
        return { gallery: list };
      }
    },

    toggleLike: async (id) => {
      try {
        return await request(`/gallery/${id}/like`, { method: 'POST' });
      } catch (_) {
        const gallery = getLocalGallery();
        const item = gallery.find(g => g.id == id);
        if (item) {
          item.liked = !item.liked;
          item.user_has_liked = item.liked;
          item.like_count = (item.like_count || 0) + (item.liked ? 1 : -1);
          setLocal(KEYS.GALLERY, gallery);
          return { liked: item.liked, like_count: item.like_count };
        }
        return { liked: true, like_count: 1 };
      }
    },

    create: async (data) => {
      try {
        return await request('/gallery', { method: 'POST', body: JSON.stringify(data) });
      } catch (_) {
        const gallery = getLocalGallery();
        const newItem = {
          id: Date.now(),
          ...data,
          like_count: 0,
          liked: false,
          created_at: new Date().toISOString()
        };
        gallery.unshift(newItem);
        setLocal(KEYS.GALLERY, gallery);
        emitDataChange('gallery_created', newItem);
        return { message: 'Gallery item added', item: newItem };
      }
    },

    delete: async (id) => {
      try {
        return await request(`/gallery/${id}`, { method: 'DELETE' });
      } catch (_) {
        let gallery = getLocalGallery();
        gallery = gallery.filter(g => g.id != id);
        setLocal(KEYS.GALLERY, gallery);
        emitDataChange('gallery_deleted', id);
        return { message: 'Gallery item removed' };
      }
    },
  },

  // Appointments (100% reactive client storage for instant booking & admin display)
  appointments: {
    create: async (data) => {
      try {
        return await request('/appointments', { method: 'POST', body: JSON.stringify(data) });
      } catch (_) {
        const randomRef = 'MBT-' + Math.floor(100000 + Math.random() * 900000);
        const cleanEmail = (data.customer_email || '').trim().toLowerCase();
        const cleanName = (data.customer_name || 'Valued Client').trim();
        const cleanPhone = (data.customer_phone || '+234 903 727 6804').trim();

        const newAppointment = {
          id: 'apt_' + Date.now(),
          booking_ref: randomRef,
          reference_code: randomRef,
          service_id: data.service_id,
          service_name: data.service_name || 'Bespoke Salon Experience',
          stylist_name: data.stylist_name || "Mira's Beauty Touch Specialist",
          customer_name: cleanName,
          customer_email: cleanEmail,
          customer_phone: cleanPhone,
          requested_date: data.requested_date,
          requested_time: data.requested_time,
          confirmed_date: null,
          confirmed_time: null,
          customer_notes: data.customer_notes || '',
          admin_notes: '',
          price_ngn: Number(data.price_ngn) || 18000,
          status: 'pending',
          created_at: new Date().toISOString()
        };

        // 1. Add to appointments list (at the top)
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        appointments.unshift(newAppointment);
        setLocal(KEYS.APPOINTMENTS, appointments);

        // 2. Track or update customer in registered clients list
        const users = getLocal(KEYS.USERS, SEED_USERS);
        const userIdx = users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail);
        if (userIdx !== -1) {
          users[userIdx].total_appointments = (users[userIdx].total_appointments || 0) + 1;
          if (cleanName && (!users[userIdx].full_name || users[userIdx].full_name === 'Client')) {
            users[userIdx].full_name = cleanName;
          }
          if (cleanPhone && !users[userIdx].phone) {
            users[userIdx].phone = cleanPhone;
          }
        } else {
          users.push({
            id: Date.now(),
            full_name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            role: 'client',
            total_appointments: 1,
            created_at: new Date().toISOString()
          });
        }
        setLocal(KEYS.USERS, users);

        // 3. Add to notifications list for admin & client
        const notifs = getLocal(KEYS.NOTIFICATIONS, []);
        notifs.unshift({
          id: Date.now(),
          title: `New Booking: ${cleanName}`,
          message: `${cleanName} booked "${newAppointment.service_name}" for ${newAppointment.requested_date} at ${newAppointment.requested_time} (Ref: ${randomRef}).`,
          read: false,
          created_at: new Date().toISOString()
        });
        setLocal(KEYS.NOTIFICATIONS, notifs);

        // 4. Emit live notification event across windows/tabs
        emitDataChange('appointment_created', newAppointment);

        return {
          message: 'Appointment booked successfully! Our concierge will review and confirm shortly.',
          appointment: newAppointment
        };
      }
    },

    getMyBookings: async () => {
      try {
        return await request('/appointments/my-bookings');
      } catch (_) {
        const user = getLocal(KEYS.USER, null);
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        if (!user || !user.email) return { bookings: [], appointments: [] };

        const userApts = appointments.filter(a => 
          (a.customer_email || '').toLowerCase() === user.email.toLowerCase()
        );
        return { bookings: userApts, appointments: userApts };
      }
    },

    cancel: async (id) => {
      try {
        return await request(`/appointments/${id}/cancel`, { method: 'POST' });
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        const apt = appointments.find(a => a.id == id || a.booking_ref == id);
        if (apt) {
          apt.status = 'cancelled';
          setLocal(KEYS.APPOINTMENTS, appointments);
          emitDataChange('appointment_cancelled', apt);
        }
        return { message: 'Appointment cancelled successfully' };
      }
    },

    getAvailability: async (date) => {
      try {
        return await request(`/appointments/availability?date=${date}`);
      } catch (_) {
        return {
          available_times: [
            '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
            '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
            '05:00 PM', '06:00 PM'
          ]
        };
      }
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      try {
        return await request('/notifications');
      } catch (_) {
        const user = getLocal(KEYS.USER, null);
        const notifs = getLocal(KEYS.NOTIFICATIONS, [
          {
            id: 1,
            title: "Welcome to Mira's Beauty Touch",
            message: "Your beauty sanctuary where elegance meets confidence. Book appointments or explore our signature fragrances.",
            read: false,
            created_at: new Date().toISOString()
          }
        ]);
        const userNotifs = notifs.filter(n => {
          if (!n.user_id && !n.user_email) return true;
          if (user && user.id && n.user_id === user.id) return true;
          if (user && user.email && n.user_email && n.user_email.toLowerCase() === user.email.toLowerCase()) return true;
          if (user && user.role === 'admin') return true;
          return false;
        });
        const unreadCount = userNotifs.filter(n => !n.read && !n.is_read).length;
        return { notifications: userNotifs, unread_count: unreadCount };
      }
    },
    markAsRead: async (id) => {
      try {
        return await request(`/notifications/${id}/read`, { method: 'PUT' });
      } catch (_) {
        return { message: 'Marked read' };
      }
    },
    markAllAsRead: async () => {
      try {
        return await request('/notifications/read-all', { method: 'PUT' });
      } catch (_) {
        return { message: 'All marked read' };
      }
    },
  },

  // Admin (Powers the complete Admin Dashboard with real-time stats and controls)
  admin: {
    getStats: async () => {
      try {
        return await request('/admin/stats');
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        const usersRes = await api.admin.getUsers();
        const users = usersRes.users || [];
        const gallery = getLocal(KEYS.GALLERY, initialGalleryData);

        const totalApts = appointments.length;
        const pendingApts = appointments.filter(a => (a.status || '').toLowerCase() === 'pending').length;
        const confirmedApts = appointments.filter(a => {
          const s = (a.status || '').toLowerCase();
          return s === 'approved' || s === 'confirmed';
        }).length;
        const completedApts = appointments.filter(a => (a.status || '').toLowerCase() === 'completed').length;
        const revenue = appointments.reduce((sum, a) => sum + (Number(a.price_ngn) || 0), 0);
        const clientCount = users.filter(u => u.role !== 'admin').length;
        const totalLikes = gallery.reduce((sum, g) => sum + (Number(g.like_count) || 0), 0);

        return {
          stats: {
            total_appointments: totalApts,
            pending_appointments: pendingApts,
            confirmed_appointments: confirmedApts,
            approved_appointments: confirmedApts,
            completed_appointments: completedApts,
            total_revenue_ngn: revenue,
            total_clients: clientCount || users.length,
            total_customers: clientCount || users.length,
            total_gallery_likes: totalLikes
          }
        };
      }
    },

    getAppointments: async (params = {}) => {
      try {
        const q = new URLSearchParams(params).toString();
        return await request(`/admin/appointments${q ? `?${q}` : ''}`);
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        let list = [...appointments];

        if (params.status && params.status !== 'all') {
          const filterSt = params.status.toLowerCase();
          list = list.filter(a => {
            const st = (a.status || '').toLowerCase();
            if (filterSt === 'approved' || filterSt === 'confirmed') {
              return st === 'approved' || st === 'confirmed';
            }
            if (filterSt === 'rejected' || filterSt === 'cancelled') {
              return st === 'rejected' || st === 'cancelled';
            }
            return st === filterSt;
          });
        }

        if (params.search) {
          const s = params.search.toLowerCase();
          list = list.filter(a =>
            (a.customer_name || '').toLowerCase().includes(s) ||
            (a.customer_email || '').toLowerCase().includes(s) ||
            (a.customer_phone || '').toLowerCase().includes(s) ||
            (a.booking_ref || '').toLowerCase().includes(s) ||
            (a.service_name || '').toLowerCase().includes(s)
          );
        }

        return { appointments: list };
      }
    },

    approveAppointment: async (id, payload = {}) => {
      try {
        return await request(`/admin/appointments/${id}/approve`, { method: 'PUT', body: JSON.stringify(payload) });
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        const apt = appointments.find(a => a.id == id || a.booking_ref == id);
        if (apt) {
          apt.status = 'approved';
          apt.confirmed_date = payload.confirmed_date || apt.requested_date;
          apt.confirmed_time = payload.confirmed_time || apt.requested_time;
          if (payload.admin_notes) apt.admin_notes = payload.admin_notes;
          setLocal(KEYS.APPOINTMENTS, appointments);

          // Add notification for the customer
          const notifs = getLocal(KEYS.NOTIFICATIONS, []);
          notifs.unshift({
            id: Date.now(),
            user_id: apt.user_id,
            user_email: apt.customer_email,
            type: 'appointment_approved',
            title: 'Appointment Approved',
            message: `Your appointment for "${apt.service_name}" on ${apt.confirmed_date} at ${apt.confirmed_time} has been approved and confirmed.`,
            read: false,
            created_at: new Date().toISOString()
          });
          setLocal(KEYS.NOTIFICATIONS, notifs);

          emitDataChange('appointment_approved', apt);
        }
        return { message: 'Appointment approved and customer notified successfully.', appointment: apt };
      }
    },

    rejectAppointment: async (id, payload = {}) => {
      try {
        return await request(`/admin/appointments/${id}/reject`, { method: 'PUT', body: JSON.stringify(payload) });
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        const apt = appointments.find(a => a.id == id || a.booking_ref == id);
        if (apt) {
          apt.status = 'rejected';
          if (payload.admin_notes) apt.admin_notes = payload.admin_notes;
          setLocal(KEYS.APPOINTMENTS, appointments);

          const notifs = getLocal(KEYS.NOTIFICATIONS, []);
          notifs.unshift({
            id: Date.now(),
            user_id: apt.user_id,
            user_email: apt.customer_email,
            type: 'appointment_rejected',
            title: 'Appointment Update',
            message: `Your appointment request for "${apt.service_name}" on ${apt.requested_date} could not be confirmed. ${payload.admin_notes || ''}`,
            read: false,
            created_at: new Date().toISOString()
          });
          setLocal(KEYS.NOTIFICATIONS, notifs);

          emitDataChange('appointment_rejected', apt);
        }
        return { message: 'Appointment declined.', appointment: apt };
      }
    },

    rescheduleAppointment: async (id, payload = {}) => {
      try {
        return await request(`/admin/appointments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(payload) });
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        const apt = appointments.find(a => a.id == id || a.booking_ref == id);
        if (apt) {
          apt.status = 'approved';
          apt.requested_date = payload.new_date || apt.requested_date;
          apt.requested_time = payload.new_time || apt.requested_time;
          apt.confirmed_date = payload.new_date || apt.confirmed_date;
          apt.confirmed_time = payload.new_time || apt.confirmed_time;
          if (payload.admin_notes) apt.admin_notes = payload.admin_notes;
          setLocal(KEYS.APPOINTMENTS, appointments);

          const notifs = getLocal(KEYS.NOTIFICATIONS, []);
          notifs.unshift({
            id: Date.now(),
            user_id: apt.user_id,
            user_email: apt.customer_email,
            type: 'appointment_rescheduled',
            title: 'Appointment Rescheduled',
            message: `Your appointment for "${apt.service_name}" has been rescheduled to ${apt.confirmed_date} at ${apt.confirmed_time}.`,
            read: false,
            created_at: new Date().toISOString()
          });
          setLocal(KEYS.NOTIFICATIONS, notifs);

          emitDataChange('appointment_rescheduled', apt);
        }
        return { message: 'Appointment rescheduled successfully.', appointment: apt };
      }
    },

    completeAppointment: async (id) => {
      try {
        return await request(`/admin/appointments/${id}/complete`, { method: 'PUT' });
      } catch (_) {
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        const apt = appointments.find(a => a.id == id || a.booking_ref == id);
        if (apt) {
          apt.status = 'completed';
          setLocal(KEYS.APPOINTMENTS, appointments);
          emitDataChange('appointment_completed', apt);
        }
        return { message: 'Appointment marked as completed.', appointment: apt };
      }
    },

    deleteAppointment: async (id) => {
      try {
        return await request(`/admin/appointments/${id}`, { method: 'DELETE' });
      } catch (_) {
        let appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
        appointments = appointments.filter(a => a.id != id && a.booking_ref != id);
        setLocal(KEYS.APPOINTMENTS, appointments);
        emitDataChange('appointment_deleted', id);
        return { message: 'Appointment record removed.' };
      }
    },

    getUsers: async () => {
      try {
        return await request('/admin/users');
      } catch (_) {
        const users = getLocal(KEYS.USERS, SEED_USERS);
        const clientAccounts = getLocal(KEYS.CLIENT_ACCOUNTS, []);
        const appointments = getLocal(KEYS.APPOINTMENTS, SEED_APPOINTMENTS);

        const map = new Map();

        // 1. Seed users
        SEED_USERS.forEach(u => {
          if (u.email) map.set(u.email.toLowerCase(), { ...u });
        });

        // 2. Stored directory users
        users.forEach(u => {
          if (u.email) {
            const key = u.email.toLowerCase();
            const existing = map.get(key) || {};
            map.set(key, { ...existing, ...u });
          }
        });

        // 3. Registered client accounts (from client sign-up)
        clientAccounts.forEach(a => {
          if (a.email) {
            const key = a.email.toLowerCase();
            const existing = map.get(key) || {};
            map.set(key, {
              id: a.id || existing.id || Date.now(),
              full_name: a.full_name || existing.full_name || 'Valued Client',
              email: a.email,
              phone: a.phone || existing.phone || '+234 903 727 6804',
              role: a.role || existing.role || 'client',
              created_at: a.created_at || existing.created_at || new Date().toISOString(),
              ...existing
            });
          }
        });

        // 4. Any customer who ever booked an appointment
        appointments.forEach(apt => {
          if (apt.customer_email) {
            const key = apt.customer_email.toLowerCase();
            const existing = map.get(key);
            if (!existing) {
              map.set(key, {
                id: Date.now() + Math.random(),
                full_name: apt.customer_name || 'Valued Client',
                email: apt.customer_email,
                phone: apt.customer_phone || '+234 903 727 6804',
                role: 'client',
                total_appointments: 1,
                created_at: apt.created_at || new Date().toISOString()
              });
            } else {
              if (apt.customer_name && (!existing.full_name || existing.full_name === 'Client')) {
                existing.full_name = apt.customer_name;
              }
              if (apt.customer_phone && (!existing.phone || existing.phone === '+234 800 000 0000')) {
                existing.phone = apt.customer_phone;
              }
            }
          }
        });

        // Recalculate live total_appointments for each user
        const enriched = Array.from(map.values()).map(u => {
          const userCount = appointments.filter(a => 
            (a.customer_email || '').toLowerCase() === (u.email || '').toLowerCase()
          ).length;
          return {
            ...u,
            total_appointments: Math.max(u.total_appointments || 0, userCount)
          };
        });

        return { users: enriched };
      }
    },

    getSettings: async () => {
      try {
        return await request('/admin/settings');
      } catch (_) {
        return {
          settings: {
            salon_name: "Mira’s Beauty Touch",
            address: "Plot 12, Commercial Avenue, Owerri, Imo State, Nigeria",
            phone: "+234 903 727 6804",
            email: "mirabeautytouch@gmail.com",
            currency: "NGN (₦)"
          }
        };
      }
    },

    updateSettings: async (settings) => {
      try {
        return await request('/admin/settings', { method: 'PUT', body: JSON.stringify({ settings }) });
      } catch (_) {
        return { message: 'Settings saved' };
      }
    },
  }
};
