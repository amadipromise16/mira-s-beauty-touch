const http = require('node:http');

// Helper to start the server in background if not already running
const app = require('./src/index');

const BASE_URL = 'http://localhost:5000/api';

async function fetchJSON(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Test assertion failed: ${message}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('  RUNNING MIRA’S BEAUTY TOUCH FULL-STACK TEST SUITE  ');
  console.log('======================================================\n');

  // Wait 1s for server to settle
  await new Promise(r => setTimeout(r, 1000));

  // 1. HEALTH CHECK
  console.log('1. Health & Server Check:');
  const health = await fetchJSON('/health');
  assert(health.status === 200, 'Health check returns 200 OK');
  assert(health.data.brand === "Mira's Beauty Touch", 'Brand matches Mira’s Beauty Touch');

  // 2. AUTHENTICATION TESTS
  console.log('\n2. User Authentication & Security:');
  const testEmail = `testuser_${Date.now()}@example.com`;
  
  // Register new client
  const regRes = await fetchJSON('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      full_name: 'Test Client',
      email: testEmail,
      phone: '+234 812 345 6789',
      password: 'SecurePassword123!'
    })
  });
  assert(regRes.status === 201, 'New client registered successfully (201)');
  assert(Boolean(regRes.data.token), 'JWT token returned on registration');
  const clientToken = regRes.data.token;
  const clientId = regRes.data.user.id;

  // Duplicate registration check
  const dupRes = await fetchJSON('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      full_name: 'Test Client Duplicate',
      email: testEmail,
      phone: '+234 812 345 6789',
      password: 'SecurePassword123!'
    })
  });
  assert(dupRes.status === 409, 'Duplicate account registration rejected with 409 Conflict');

  // Login
  const loginRes = await fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      password: 'SecurePassword123!'
    })
  });
  assert(loginRes.status === 200, 'Client login verified with 200 OK');

  // Invalid login
  const badLogin = await fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      password: 'WrongPassword!'
    })
  });
  assert(badLogin.status === 401, 'Invalid credentials rejected with 401');

  // Admin login
  const adminLogin = await fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@mirasbeautytouch.com',
      password: 'AdminMira2026!'
    })
  });
  assert(adminLogin.status === 200, 'Administrator login verified');
  const adminToken = adminLogin.data.token;

  // 3. SERVICES TESTS
  console.log('\n3. Salon Services Catalogue:');
  const servicesRes = await fetchJSON('/services');
  assert(servicesRes.status === 200, 'Services retrieved successfully');
  assert(servicesRes.data.services.length >= 6, 'Multiple salon services available');
  const knotless = servicesRes.data.services.find(s => s.name.includes('Knotless'));
  assert(Boolean(knotless), 'Knotless box braids service exists');
  assert(knotless.price_ngn === 28000, 'Braiding price in Nigerian Naira is accurate (₦28,000)');

  // 4. PERFUMES SHOP TESTS
  console.log('\n4. Perfume Boutique & Naira Pricing:');
  const perfumesRes = await fetchJSON('/perfumes');
  assert(perfumesRes.status === 200, 'Perfumes retrieved successfully');
  assert(perfumesRes.data.perfumes.length >= 6, 'Exquisite perfume catalogue seeded');
  const elixir = perfumesRes.data.perfumes.find(p => p.name.includes('Mira'));
  assert(Boolean(elixir), "House fragrance L'Élixir de Mira exists");
  assert(elixir.price_ngn === 48000, 'Perfume price in Naira formatted correctly (₦48,000)');

  // 5. MANDATORY GALLERY LIKE SYSTEM TESTS
  console.log('\n5. Authentic Database-Backed Gallery Like System:');
  const galleryRes = await fetchJSON('/gallery');
  assert(galleryRes.status === 200, 'Gallery retrieved');
  assert(galleryRes.data.gallery.length >= 1, 'Gallery items seeded');
  const targetItem = galleryRes.data.gallery[0];
  const initialLikes = targetItem.like_count;

  // Unauthenticated like attempt must fail
  const anonLike = await fetchJSON(`/gallery/${targetItem.id}/like`, { method: 'POST' });
  assert(anonLike.status === 401, 'Unauthenticated visitor cannot submit a like (401)');

  // Authenticated user likes
  const userLike1 = await fetchJSON(`/gallery/${targetItem.id}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  assert(userLike1.status === 200, 'Authenticated client liked gallery item (200)');
  assert(userLike1.data.liked === true, 'Liked state is true');
  assert(userLike1.data.like_count === initialLikes + 1, 'Authoritative like count incremented by 1');

  // Same user clicks like again -> UNLIKE (no duplicate likes!)
  const userLike2 = await fetchJSON(`/gallery/${targetItem.id}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  assert(userLike2.status === 200, 'Second click toggles unlike cleanly');
  assert(userLike2.data.liked === false, 'Liked state returned to false');
  assert(userLike2.data.like_count === initialLikes, 'Like count accurately decremented back to initial');

  // Relike so it has 1 like
  await fetchJSON(`/gallery/${targetItem.id}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });

  // 6. APPOINTMENT BOOKING & ADMIN APPROVAL WORKFLOW
  console.log('\n6. Complete Appointment Booking & Approval Workflow:');
  
  // Submit appointment as customer with unique date/time per run
  const testDay = Math.floor(Math.random() * 18 + 10);
  const testHour = Math.floor(Math.random() * 7 + 10);
  const dynamicDate = `2026-11-${String(testDay).padStart(2, '0')}`;
  const dynamicTime = `${String(testHour).padStart(2, '0')}:00 AM`;

  const bookingPayload = {
    service_id: knotless.id,
    service_name: knotless.name,
    stylist_name: 'Sarah K. (Senior Braider)',
    customer_name: 'Test Client',
    customer_email: testEmail,
    customer_phone: '+234 812 345 6789',
    requested_date: dynamicDate,
    requested_time: dynamicTime,
    customer_notes: 'Please prepare waist length extensions.'
  };

  const aptSubmit = await fetchJSON('/appointments', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${clientToken}` },
    body: JSON.stringify(bookingPayload)
  });
  assert(aptSubmit.status === 201, 'Customer appointment created (201 Created)');
  const createdApt = aptSubmit.data.appointment;
  assert(createdApt.status === 'pending', 'Initial appointment status is strictly "pending"');
  assert(createdApt.booking_ref.startsWith('MBT-'), 'Unique booking reference generated (MBT-...)');

  // Customer checks bookings
  const myBookings = await fetchJSON('/appointments/my-bookings', {
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  assert(myBookings.status === 200, 'Customer retrieved their bookings');
  const foundInMyBookings = myBookings.data.bookings.find(b => b.id === createdApt.id);
  assert(Boolean(foundInMyBookings), 'New appointment appears in customer dashboard');

  // Customer checks notifications (submission notification)
  const myNotifs1 = await fetchJSON('/notifications', {
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  assert(myNotifs1.status === 200, 'Customer retrieved notifications');
  const submitNotif = myNotifs1.data.notifications.find(n => n.appointment_id === createdApt.id);
  assert(Boolean(submitNotif), 'Submission confirmation notification created in customer account');

  // Admin reviews pending appointments
  const adminApts = await fetchJSON('/admin/appointments?status=pending', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(adminApts.status === 200, 'Admin fetched pending appointments');
  const foundByAdmin = adminApts.data.appointments.find(a => a.id === createdApt.id);
  assert(Boolean(foundByAdmin), 'Pending appointment appears in Admin Dashboard');

  // Admin approves appointment with confirmed date/time
  const approveRes = await fetchJSON(`/admin/appointments/${createdApt.id}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({
      confirmed_date: dynamicDate,
      confirmed_time: dynamicTime,
      admin_notes: 'Stylist Sarah K. confirmed for waist-length knotless braids.'
    })
  });
  assert(approveRes.status === 200, 'Admin successfully approved appointment');
  assert(approveRes.data.appointment.status === 'approved', 'Status updated to "approved" in database');

  // Verify customer receives the mandated notification:
  // "Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for [date] at [time]."
  const myNotifs2 = await fetchJSON('/notifications', {
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  const approvalNotif = myNotifs2.data.notifications.find(n => n.type === 'appointment_approved' && n.appointment_id === createdApt.id);
  assert(Boolean(approvalNotif), 'Approval notification delivered to customer');
  assert(
    approvalNotif.message.includes(`Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for ${dynamicDate} at ${dynamicTime}.`),
    'Notification matches the exact mandated message template from master prompt'
  );

  // 7. ROLE-BASED ACCESS CONTROL
  console.log('\n7. Role-Based Access Control (Security):');
  const unauthorizedAdminAccess = await fetchJSON('/admin/stats', {
    headers: { 'Authorization': `Bearer ${clientToken}` }
  });
  assert(unauthorizedAdminAccess.status === 403, 'Regular client denied access to /api/admin/stats (403 Forbidden)');

  const authorizedAdminAccess = await fetchJSON('/admin/stats', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(authorizedAdminAccess.status === 200, 'Admin authorized to /api/admin/stats (200 OK)');
  assert(authorizedAdminAccess.data.stats.approved_appointments >= 1, 'Stats reflect real database records');

  console.log('\n======================================================');
  console.log(`  ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!  `);
  console.log('======================================================\n');
  process.exit(0);
}

runTestSuite().catch(err => {
  console.error('\nTest suite failed with error:', err);
  process.exit(1);
});
