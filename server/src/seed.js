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

  // 3. Seed Perfumes (with prices in Nigerian Naira ₦ - all low rates not exceeding ₦20,000)
  const perfumesCount = db.prepare('SELECT COUNT(*) as count FROM perfumes').get().count;
  if (perfumesCount >= 0) {
    db.prepare('DELETE FROM perfumes').run();

    const insertPerfume = db.prepare(`
      INSERT INTO perfumes (id, name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const perfumes = [
      {
        id: 1,
        name: "Queen of Arabia (Luxury Gift Set)",
        brand: "Lattafa Pride",
        description: "An opulent royal Arabian gift set crafted with imperial distinction. Featuring rich notes of velvety Damask rose, warm golden amber, regal agarwood (oud), and sweet bourbon vanilla. Comes complete with a luxury 100ml flacon, travel miniature, pocket atomizer, and perfumed spray.",
        fragrance_notes: "Top: Sweet Bergamot, Royal Saffron | Heart: Taif Rose, Golden Amber, Incense | Base: Madagascar Vanilla, Royal Oud, Cashmere Musk",
        size: "4-in-1 Luxury Gift Set",
        price_ngn: 20000,
        stock_quantity: 12,
        image_url: "./media/lattafa_queen_of_arabia_gift_set.jpg",
        is_featured: 1
      },
      {
        id: 2,
        name: "Liquid Brun",
        brand: "French Avenue",
        description: "A decadent, modern gourmand masterpiece. Liquid Brun delivers a rich, seductive aura of roasted cinnamon, caramelized praline, smooth bourbon vanilla, and spiced tonka bean over a creamy amberwood foundation.",
        fragrance_notes: "Top: Cinnamon Bark, Spiced Orange, Nutmeg | Heart: Praline Caramel, Dates, Tonka Bean | Base: Bourbon Vanilla, Benzoin, Akigalawood, Amber",
        size: "100ml Eau de Parfum",
        price_ngn: 18000,
        stock_quantity: 18,
        image_url: "./media/liquid_brun_french_avenue.jpg",
        is_featured: 1
      },
      {
        id: 3,
        name: "Lattafa Angham & Qaa'ed Intense (Date Night)",
        brand: "Lattafa Parfums",
        description: "The quintessential 'Date Night' luxury duo. Lattafa Angham brings sweet melodic notes of candied ginger, white floral petals, praline, and silky vanilla, while Qaa'ed Intense delivers smoldering roasted tobacco, rich cinnamon, honeyed amber, and smooth patchouli in a serpent-crowned flacon.",
        fragrance_notes: "Angham: Candied Ginger, Mandarin, Jasmine, Vanilla, Amber | Qaa'ed Intense: Cinnamon, Nutmeg, Roasted Tobacco, Honey Amber, Vanilla",
        size: "100ml Date Night Flacon",
        price_ngn: 19500,
        stock_quantity: 15,
        image_url: "./media/lattafa_angham_qaaed_intense_date_night.jpg",
        is_featured: 1
      },
      {
        id: 4,
        name: "Khamrah Waha & Musamam Black Intense",
        brand: "Lattafa Parfums",
        description: "A dramatic contrast of crystalline aquatic freshness and intoxicating dark leather intensity. Khamrah Waha opens with sparkling oceanic breezes, candied dates, and spiced praline, while Musamam Black Intense captivates with smoked leather, dark amber, black pepper, and sensual saffron enveloped by a sculpted 3D serpent flacon.",
        fragrance_notes: "Khamrah: Aquatic Amber, Cardamom, Praline, Vanilla | Musamam: Saffron, Italian Bergamot, Smoked Leather, Akigalawood, Dark Olibanum",
        size: "100ml Luxury Flacon",
        price_ngn: 19000,
        stock_quantity: 16,
        image_url: "./media/lattafa_khamrah_musamam_black_intense.jpg",
        is_featured: 1
      },
      {
        id: 5,
        name: "Club de Nuit Intense Man & Affection Love",
        brand: "Armaf & Amazon Pride",
        description: "An iconic duo of legendary masculine seduction and sweet romantic allure. Club de Nuit Intense Man brings world-famous smoky pineapple, birch, and blackcurrant, while Affection Love enchants with sweet spun sugar, delicate jasmine, and creamy vanilla.",
        fragrance_notes: "Club de Nuit: Lemon, Blackcurrant, Apple, Birch, Ambergris | Affection Love: Sweet Berries, Jasmine Sambac, Marshmallow Vanilla, Tonka",
        size: "105ml + 55ml Fragrance Pair",
        price_ngn: 18500,
        stock_quantity: 14,
        image_url: "./media/club_de_nuit_intense_affection_love.jpg",
        is_featured: 1
      },
      {
        id: 6,
        name: "Just Oud & Wood",
        brand: "RRP / Fragrance World",
        description: "An authentic, deep woody-oriental elixir celebrating noble woods and resinous agarwood. Just Oud & Wood delivers a rich, commanding scent trail of smokey sandalwood, dark vetiver, cardamom, and warm amberwood crafted for lovers of distinguished, long-lasting fragrances.",
        fragrance_notes: "Top: Rosewood, Cardamom, Chinese Pepper | Heart: Rare Oud Wood, Sandalwood, Vetiver | Base: Tonka Bean, Vanilla, Golden Amber",
        size: "100ml Eau de Parfum (3.4 Fl. Oz.)",
        price_ngn: 17500,
        stock_quantity: 20,
        image_url: "./media/just_oud_and_wood.jpg",
        is_featured: 1
      },
      {
        id: 7,
        name: "Rage by Rave",
        brand: "Rave (Lattafa House)",
        description: "An energetic, magnetic aromatic fragrance with undeniable confidence. Rage by Rave explodes with fresh iced citrus, crushed mint, aromatic sage, and crisp green apple, melting into a powerful base of cedarwood, tonka bean, and sensual ambroxan.",
        fragrance_notes: "Top: Crisp Green Apple, Iced Bergamot, Mint | Heart: Lavender, Clary Sage, Geranium | Base: Virginia Cedar, Tonka Bean, Ambroxan, White Musk",
        size: "100ml Eau de Parfum",
        price_ngn: 16500,
        stock_quantity: 22,
        image_url: "./media/rave_rage_eau_de_parfum.jpg",
        is_featured: 1
      },
      {
        id: 8,
        name: "X5 Men – Pure Black",
        brand: "X5 Men Parfums",
        description: "A bold, charismatic, and intensely masculine signature. X5 Men Pure Black captures immediate attention with opening notes of black pepper, iced bergamot, aromatic lavender, and dark cedarwood wrapped in smoky leather and amber.",
        fragrance_notes: "Top: Crushed Black Pepper, Italian Bergamot | Heart: French Lavender, Cardamom, Clary Sage | Base: Smoked Cedar, Vetiver, Dark Leather, Warm Ambergris",
        size: "100ml Eau de Parfum (80% Vol)",
        price_ngn: 15000,
        stock_quantity: 25,
        image_url: "./media/x5_men_pure_black.jpg",
        is_featured: 1
      },
      {
        id: 9,
        name: "Rayhaan Floriana & Bade'e Al Oud Sublime",
        brand: "Rayhaan & Lattafa (Duo Set)",
        description: "An intoxicating harmony of feminine floral radiance and oriental opulence. Rayhaan Floriana unfolds with sparkling nectarine, star jasmine, and soft white musk, while Bade'e Al Oud Sublime enchants with sweet crisp apple, juicy plum, velvet rose, and smoky sweet oud.",
        fragrance_notes: "Floriana: Juicy Nectar, Jasmine Sambac, White Amber | Sublime: Crisp Apple, Wild Plum, Moss, Sweet Woods, Patchouli",
        size: "2x 100ml Luxury Duo",
        price_ngn: 18000,
        stock_quantity: 10,
        image_url: "./media/rayhaan_floriana_badee_al_oud_sublime.jpg",
        is_featured: 1
      },
      {
        id: 10,
        name: "Khamrah Waha & Freeze Crystal Duo",
        brand: "Lattafa & Freeze",
        description: "A refreshing crystalline and aquatic sensation. Khamrah Waha blends invigorating marine breezes with sparkling citrus, cool cardamom, and sweet amber, while Freeze delivers an ultra-crisp shock of frosty mint, iced bergamot, and pure crystalline musk.",
        fragrance_notes: "Top: Iced Bergamot, Frosted Mint, Marine Notes | Heart: Aquatic Jasmine, Cool Cardamom, White Lily | Base: Crystal Amber, Tonka Bean, Driftwood, Transparent Musk",
        size: "2x 100ml Crystal Aqua Duo",
        price_ngn: 17000,
        stock_quantity: 14,
        image_url: "./media/khamrah_waha_freeze_collection.jpg",
        is_featured: 1
      },
      {
        id: 11,
        name: "Rayhaan Floriana (Pour Femme)",
        brand: "Rayhaan",
        description: "A luminous, graceful fragrance created for the modern woman of elegance. Radiant with fresh citrus blossoms, blooming jasmine petals, sweet peach nectar, and a delicate amber drydown.",
        fragrance_notes: "Top: Peach Blossom, Blood Orange | Heart: Jasmine Petals, Heliotrope | Base: Soft Ambergris, Madagascar Vanilla, Sandalwood",
        size: "100ml Eau de Parfum",
        price_ngn: 14500,
        stock_quantity: 16,
        image_url: "./media/rayhaan_floriana_badee_al_oud_sublime.jpg",
        is_featured: 0
      },
      {
        id: 12,
        name: "Bade'e Al Oud – Sublime (Red Edition)",
        brand: "Lattafa",
        description: "A show-stopping, viral creation renowned for its juicy red fruits, sweet spun sugar, smooth moss, and tender oud heart. Regal flacon adorned with exquisite golden geometric latticework.",
        fragrance_notes: "Top: Crisp Green Apple, Lychee, Rose | Heart: Red Plum, Jasmine, Osmanthus | Base: Sweet Vanilla, Patchouli, Moss, Velvet Oud",
        size: "100ml Eau de Parfum",
        price_ngn: 15500,
        stock_quantity: 15,
        image_url: "./media/rayhaan_floriana_badee_al_oud_sublime.jpg",
        is_featured: 0
      },
      {
        id: 13,
        name: "Khamrah Waha (Aqua Edition)",
        brand: "Lattafa",
        description: "The coveted aquatic interpretation of the iconic Khamrah profile. Faceted crystal flacon holding a turquoise-blue elixir with spiced citrus, aromatic resins, and ocean mist.",
        fragrance_notes: "Top: Cardamom, Bergamot, Sea Breeze | Heart: Praline, Dates, Tuberose | Base: Tonka Bean, Benzoin, Akigalawood, Amber",
        size: "100ml Eau de Parfum",
        price_ngn: 16000,
        stock_quantity: 20,
        image_url: "./media/khamrah_waha_freeze_collection.jpg",
        is_featured: 0
      }
    ];

    perfumes.forEach(p => {
      insertPerfume.run(p.id, p.name, p.brand, p.description, p.fragrance_notes, p.size, p.price_ngn, p.stock_quantity, p.image_url, p.is_featured);
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

