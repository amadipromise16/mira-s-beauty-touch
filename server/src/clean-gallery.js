const db = require('./db');

function populateCleanGallery() {
  db.prepare('DELETE FROM gallery_items').run();

  const insert = db.prepare(`
    INSERT INTO gallery_items (title, category, media_type, media_url, description, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const items = [
    // 1. User's Uploaded Image: Nails
    {
      title: "Signature Sculpted Stiletto Nails & Art",
      category: "Nails & Art",
      media_type: "image",
      media_url: "/media/mira_nails_stiletto.jpg",
      description: "Stunning nail extensions, creative designs, and flawless finishes. Expert nail and foot care for a polished, refreshed look.",
      display_order: 1
    },

    // 2. User's Uploaded Video: Hair Braiding 1
    {
      title: "Master Hair Braiding Artistry & Styling",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "/media/mira_hair_braids_video_1.mp4",
      description: "Beautifully crafted, stylish, and protective hairstyles. Clean parting, gentle tension, and effortless movement.",
      display_order: 2
    },

    // 3. User's Uploaded Video: Hair Braiding 2
    {
      title: "Flawless Protective Braids & Finishing",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "/media/mira_hair_braids_video_2.mp4",
      description: "Professional hair braiding and care designed to enhance your natural beauty with elegance, style, and exceptional care.",
      display_order: 3
    },

    // 4. User's Uploaded Video: Lashes
    {
      title: "Stunning Eyelash Extensions & Volume Flutter",
      category: "Lash Extensions",
      media_type: "video",
      media_url: "/media/mira_lash_extensions_video.mp4",
      description: "Gorgeous lashes that enhance your natural beauty. Fluttery, lightweight, and tailored to brighten your eyes effortlessly.",
      display_order: 4
    },

    // 5. Generated Hair Braiding Photo: Knotless Braids
    {
      title: "Flawless Waist-Length Knotless Braids",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "/media/knotless_braids.jpg",
      description: "Painless, tension-free scalp parting with clean lines and lightweight premium braiding hair for effortless movement.",
      display_order: 10
    },

    // 6. Generated Hair Braiding Photo: Boho Braids
    {
      title: "Goddess Bohemian Braids with Soft Curls",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "/media/boho_braids.jpg",
      description: "Exquisite knotless braids adorned with luscious deep curls for an ethereal, romantic aesthetic.",
      display_order: 11
    },

    // 7. Generated Hair Braiding Photo: Fulani Cornrows
    {
      title: "Intricate Fulani & Stitch Cornrow Artistry",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "/media/fulani_cornrows.jpg",
      description: "Precision geometric stitch braids with custom cultural hair cuffs and bead accents.",
      display_order: 12
    },

    // 8. Generated Nails Photo: French Ombre
    {
      title: "French Ombré Sculpted Acrylics",
      category: "Nails & Art",
      media_type: "image",
      media_url: "/media/french_ombre_nails.jpg",
      description: "Delicate nude-to-white baby boomer gradient with high-gloss topcoat and crystal detailing.",
      display_order: 13
    },

    // 9. Generated Nails Photo: Gel-X Extensions
    {
      title: "Luxury Gel-X Extensions with Clean Cuticle Care",
      category: "Nails & Art",
      media_type: "image",
      media_url: "/media/gelx_nails.jpg",
      description: "Flawless Russian manicure preparation paired with seamless full-cover soft gel extensions.",
      display_order: 14
    },

    // 10. Generated Nails Photo: Deluxe Spa Pedicure
    {
      title: "Deluxe Spa Pedicure Herbal Soak & Scrub",
      category: "Nails & Art",
      media_type: "image",
      media_url: "/media/deluxe_pedicure.jpg",
      description: "Restorative eucalyptus and dead sea salt foot bath, exfoliation, hot towel wrap, and nourishing massage.",
      display_order: 15
    },

    // 11. Generated Makeup Photo: Royal Bridal Glam
    {
      title: "Royal Bridal Glam & Dewy Skin Glow",
      category: "Makeup Artistry",
      media_type: "image",
      media_url: "/media/bridal_makeup.jpg",
      description: "Photography-ready bridal perfection designed to last all day with waterproof base, sculpted eyes, and flutter mink lashes.",
      display_order: 16
    },

    // 12. Generated Makeup Photo: Soft Glam Evening
    {
      title: "Soft Glam Evening Radiance",
      category: "Makeup Artistry",
      media_type: "image",
      media_url: "/media/evening_soft_glam.jpg",
      description: "Velvety nude lips, bronze shimmer eyes, and seamless contour for dinner dates, galas, and celebrations.",
      display_order: 17
    },

    // 13. Generated Lashes Photo: Wispy Hybrid Volume
    {
      title: "Wispy Hybrid Volume Eyelash Set",
      category: "Lash Extensions",
      media_type: "image",
      media_url: "/media/wispy_lashes.jpg",
      description: "Textured, multidimensional lash fans tailored to enhance the client’s eye shape without heavy weight.",
      display_order: 18
    },

    // 14. Generated Perfume Photo: Presentation Bar
    {
      title: "Bespoke Perfume Presentation Bar & Flacons",
      category: "Perfume Curation",
      media_type: "image",
      media_url: "/media/perfume_presentation_bar.jpg",
      description: "Our private fragrance bar featuring artisanal bottles, pure perfume oils, and customized scent discovery.",
      display_order: 19
    },

    // 15. Generated Perfume Photo: Haute Flacon Spotlight
    {
      title: "Haute Parfumerie Flacon Spotlight",
      category: "Perfume Curation",
      media_type: "image",
      media_url: "/media/haute_perfume_flacon.jpg",
      description: "Velvet Oud & Royal Amber flacon captured in warm golden light, priced at ₦55,000.",
      display_order: 20
    },

    // 16. User's New Uploaded Video: LAST VIDEO IN THE GALLERY PAGE
    {
      title: "Mira’s Beauty Touch Salon & Scent Experience",
      category: "Salon Showcase",
      media_type: "video",
      media_url: "/media/mira_salon_scent_experience.mp4",
      description: "Step inside our salon sanctuary where beauty meets elegance. Experience hair styling, manicure pampering, and our private luxury perfume bar.",
      display_order: 99
    }
  ];

  items.forEach(i => {
    insert.run(i.title, i.category, i.media_type, i.media_url, i.description, i.display_order);
  });

  console.log(`Successfully populated ${items.length} custom-matched gallery items.`);
}

if (require.main === module) {
  populateCleanGallery();
}

module.exports = populateCleanGallery;
