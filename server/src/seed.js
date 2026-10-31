const bcrypt = require('bcryptjs');
const db = require('./db');

function seedDatabase() {
  console.log('Seeding Mira’s Beauty Touch database...');

  // 1. Seed Users (Admin + Demo Client)
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('AdminMira2026!', salt);
  const clientPasswordHash = bcrypt.hashSync('ClientPass123!', salt);

  const checkAdmin = db.prepare("SELECT id FROM users WHERE email = 'admin@mirasbeautytouch.com'").get();
  let adminId = checkAdmin ? checkAdmin.id : null;

  if (!checkAdmin) {
    const insertAdmin = db.prepare(`
      INSERT INTO users (full_name, email, phone, password_hash, role)
      VALUES ('Mira Johnson (Admin)', 'admin@mirasbeautytouch.com', '+234 803 123 4567', ?, 'admin')
    `);
    const res = insertAdmin.run(adminPasswordHash);
    adminId = res.lastInsertRowid;
    console.log('Created Admin user: admin@mirasbeautytouch.com');
  }

  const checkClient = db.prepare("SELECT id FROM users WHERE email = 'client@example.com'").get();
  let clientId = checkClient ? checkClient.id : null;

  if (!checkClient) {
    const insertClient = db.prepare(`
      INSERT INTO users (full_name, email, phone, password_hash, role)
      VALUES ('Amaka Nwosu', 'client@example.com', '+234 814 987 6543', ?, 'client')
    `);
    const res = insertClient.run(clientPasswordHash);
    clientId = res.lastInsertRowid;
    console.log('Created Demo Client: client@example.com');
  }

  // 2. Seed Services
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (servicesCount === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (name, category, description, price_ngn, duration_mins, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const services = [
      {
        name: 'Knotless Box Braids (Waist Length)',
        category: 'Hair Braiding',
        description: 'Painless, tension-free natural scalp finish with sleek parting and lightweight, premium braiding hair for versatile styling.',
        price_ngn: 28000,
        duration_mins: 180,
        image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Goddess Bohemian Braids',
        category: 'Hair Braiding',
        description: 'Exquisite knotless braids adorned with luscious curls for a dreamy, ethereal aesthetic suited for occasions and everyday elegance.',
        price_ngn: 35000,
        duration_mins: 210,
        image_url: 'https://images.unsplash.com/photo-1584297091622-af8e5bd81b21?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Fulani & Cornrow Artistry',
        category: 'Hair Braiding',
        description: 'Traditional yet modern intricate stitch cornrows, custom tribal patterns, and bead or cuff accents for cultural grace.',
        price_ngn: 20000,
        duration_mins: 120,
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Deluxe Spa Pedicure & Scrub',
        category: 'Manicures & Pedicures',
        description: 'Warm herbal foot soak, exfoliating sea salt scrub, cuticle care, callused skin smoothing, hot towel wrap, and soothing massage.',
        price_ngn: 18000,
        duration_mins: 60,
        image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Classic Gel Manicure',
        category: 'Manicures & Pedicures',
        description: 'Precision nail shaping, gentle cuticle clean-up, nourishing hand massage, and long-lasting glossy gel polish under UV LED.',
        price_ngn: 14000,
        duration_mins: 50,
        image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Acrylic Full Set & Nail Art',
        category: 'Nail Enhancements',
        description: 'Custom sculpted acrylic extensions tailored in length and shape (coffin, almond, stiletto) with trendy chrome or French art.',
        price_ngn: 22000,
        duration_mins: 75,
        image_url: '/media/mira_nails_stiletto.jpg'
      },
      {
        name: 'Gel-X Soft Gel Extension System',
        category: 'Nail Enhancements',
        description: 'Odorless, zero-damage full cover tips crafted from soak-off soft gel for strong, natural-feeling, seamless nail perfection.',
        price_ngn: 25000,
        duration_mins: 75,
        image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Flawless Bridal Makeup Experience',
        category: 'Professional Makeup',
        description: 'High-definition, photography-ready bridal look with skin prep, waterproof base, contouring, bespoke eye artistry, and mink lashes.',
        price_ngn: 65000,
        duration_mins: 90,
        image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Soft Glam Occasion Makeup',
        category: 'Professional Makeup',
        description: 'Radiant dewy skin, gentle earthy tones, crisp brows, velvety nude lips, and fluttery lashes for weddings, birthdays, and dinners.',
        price_ngn: 30000,
        duration_mins: 60,
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Hybrid Volume Eyelash Extensions',
        category: 'Eyelash Extensions',
        description: 'The ideal blend of classic individual lashes and volume fans, delivering a textured, fluffy, multidimensional lash look.',
        price_ngn: 26000,
        duration_mins: 80,
        image_url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Classic Natural Eyelash Set',
        category: 'Eyelash Extensions',
        description: 'One-by-one lash application matching your eye shape to add timeless length, curl, and natural eye-opening elegance.',
        price_ngn: 20000,
        duration_mins: 60,
        image_url: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Bespoke Scent Discovery Consultation',
        category: 'Fragrance & Wellness',
        description: 'Private 1-on-1 fragrance profiling session exploring olfactive families to uncover your signature perfume pairing.',
        price_ngn: 15000,
        duration_mins: 45,
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
      }
    ];

    services.forEach(s => {
      insertService.run(s.name, s.category, s.description, s.price_ngn, s.duration_mins, s.image_url);
    });
    console.log(`Seeded ${services.length} salon services.`);
  }

  // 3. Seed Perfumes (with prices in Nigerian Naira ₦)
  const perfumesCount = db.prepare('SELECT COUNT(*) as count FROM perfumes').get().count;
  if (perfumesCount === 0) {
    const insertPerfume = db.prepare(`
      INSERT INTO perfumes (name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const perfumes = [
      {
        name: "L'Élixir de Mira",
        brand: "Mira's Signature Reserve",
        description: "Our house flagship creation: an intoxicating blend of velvety Bulgarian rose, warm golden amber, and a creamy Madagascar vanilla dry-down.",
        fragrance_notes: "Top: Italian Bergamot, Pink Peppercorn | Heart: Damask Rose, Jasmine Sambac | Base: Bourbon Vanilla, Golden Ambergris, White Cedar",
        size: "100ml Eau de Parfum",
        price_ngn: 48000,
        stock_quantity: 15,
        image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
        is_featured: 1
      },
      {
        name: "Velvet Oud & Royal Amber",
        brand: "Mira's Haute Parfumerie",
        description: "Deep, mysterious, and unforgettable. Regal Cambodian agarwood intertwined with smoky frankincense and rich sun-warmed amber.",
        fragrance_notes: "Top: Persian Saffron, Cardamom | Heart: Royal Oud, Taif Rose, Tobacco Leaf | Base: Smoked Cedarwood, Warm Leather, Amber",
        size: "100ml Eau de Parfum",
        price_ngn: 55000,
        stock_quantity: 12,
        image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
        is_featured: 1
      },
      {
        name: "Golden Bloom & White Musk",
        brand: "Mira's Flora Elegance",
        description: "Fresh, crystalline, and effortlessly feminine. Sunlight caught in a bottle with crisp neroli blossoms on a bed of sheer white musk.",
        fragrance_notes: "Top: Italian Mandarin, Sweet Neroli | Heart: White Peony, French Ylang-Ylang | Base: Clean White Musk, Cashmeran, Soft Driftwood",
        size: "80ml Eau de Parfum",
        price_ngn: 42000,
        stock_quantity: 18,
        image_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
        is_featured: 1
      },
      {
        name: "Midnight Noir Seduction",
        brand: "Mira's Signature Reserve",
        description: "A decadent, dark gourmand fragrance. Succulent black cherries dripping in roasted almond liqueur, wrapped in bitter cocoa and dark patchouli.",
        fragrance_notes: "Top: Black Cherry, Roasted Bitter Almond | Heart: Turkish Rose, Plum Nectar, Tonka Bean | Base: Dark Patchouli, Espresso Bean, Sandalwood",
        size: "100ml Extrait de Parfum",
        price_ngn: 62000,
        stock_quantity: 8,
        image_url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
        is_featured: 1
      },
      {
        name: "Sweet Magnolia & Vanilla Glaze",
        brand: "Mira's Flora Elegance",
        description: "Playful sweetness wrapped in couture sophistication. Crisp pear and magnolia petals soaked in warm vanilla syrup and spun praline.",
        fragrance_notes: "Top: Anjou Pear, Pink Grapefruit | Heart: Southern Magnolia, Honeyed Gardenia | Base: Bourbon Vanilla, Salted Caramel, Praline",
        size: "100ml Eau de Parfum",
        price_ngn: 38000,
        stock_quantity: 20,
        image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
        is_featured: 0
      },
      {
        name: "Silk Jasmine & Cashmere Breeze",
        brand: "Mira's Atelier Privé",
        description: "Soft, intimate, and serene. Night-blooming star jasmine draped over comforting cashmere woods and soothing white iris.",
        fragrance_notes: "Top: Dewy Green Leaves, Bergamot | Heart: Star Jasmine, Florentine Iris | Base: Cashmere Musk, Tonka, Sheer Vetiver",
        size: "75ml Eau de Parfum",
        price_ngn: 36000,
        stock_quantity: 14,
        image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
        is_featured: 0
      }
    ];

    perfumes.forEach(p => {
      insertPerfume.run(p.name, p.brand, p.description, p.fragrance_notes, p.size, p.price_ngn, p.stock_quantity, p.image_url, p.is_featured);
    });
    console.log(`Seeded ${perfumes.length} perfume products.`);
  }

  // 4. Seed Gallery Items
  const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery_items').get().count;
  if (galleryCount === 0) {
    const populateCleanGallery = require('./clean-gallery');
    populateCleanGallery();
  }

  // 5. Seed Appointments & Notifications for Demo Client
  const aptCount = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;
  if (aptCount === 0 && clientId) {
    const insertApt = db.prepare(`
      INSERT INTO appointments (
        booking_ref, user_id, service_id, service_name, stylist_name,
        customer_name, customer_email, customer_phone, requested_date,
        requested_time, confirmed_date_time, status, customer_notes, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Approved booking
    insertApt.run(
      'MBT-2026-A101',
      clientId,
      1,
      'Knotless Box Braids (Waist Length)',
      'Sarah K. (Senior Braider)',
      'Amaka Nwosu',
      'client@example.com',
      '+234 814 987 6543',
      '2026-11-05',
      '10:00 AM',
      '2026-11-05 at 10:00 AM',
      'approved',
      'Please make sure hair is medium size parting.',
      'Approved! Looking forward to welcoming you.'
    );

    // Pending booking
    insertApt.run(
      'MBT-2026-P202',
      clientId,
      4,
      'Deluxe Spa Pedicure & Scrub',
      'Maria R. (Nail Specialist)',
      'Amaka Nwosu',
      'client@example.com',
      '+234 814 987 6543',
      '2026-11-12',
      '02:00 PM',
      null,
      'pending',
      'Celebrating birthday weekend pampering.',
      null
    );

    // Seed corresponding notifications
    const insertNotif = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, appointment_id, is_read)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertNotif.run(
      clientId,
      'appointment_approved',
      'Appointment Approved 🎉',
      'Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for 2026-11-05 at 10:00 AM.',
      1,
      0
    );

    insertNotif.run(
      clientId,
      'system',
      'Appointment Request Submitted',
      'Your booking request for "Deluxe Spa Pedicure & Scrub" on 2026-11-12 at 02:00 PM has been submitted (Ref: MBT-2026-P202). It is currently pending salon administrator approval.',
      2,
      1
    );

    console.log('Seeded demo appointments & notifications.');
  }

  // 6. Seed Site Settings
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get().count;
  if (settingsCount === 0) {
    const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
    const defaultSettings = [
      ['brand_name', "Mira's Beauty Touch"],
      ['tagline', "Where Beauty Meets Elegance"],
      ['phone', "+234 803 123 4567"],
      ['whatsapp', "+2348031234567"],
      ['email', "info@mirasbeautytouch.com"],
      ['address', "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria"],
      ['hours_weekdays', "Monday – Saturday: 9:00 AM – 7:30 PM"],
      ['hours_sunday', "Sunday: 1:00 PM – 6:00 PM (By Appointment)"]
    ];

    defaultSettings.forEach(([k, v]) => {
      insertSetting.run(k, v);
    });
    console.log('Seeded site settings.');
  }

  console.log('Database seeding complete!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

