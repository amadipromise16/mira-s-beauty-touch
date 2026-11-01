const db = require('./db');

function populateCleanGallery() {
  db.prepare('DELETE FROM gallery_items').run();

  const insert = db.prepare(`
    INSERT INTO gallery_items (title, category, media_type, media_url, description, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const items = [
    // 1. User Hair Video 1: Knotless Bohemian Braids
    {
      title: "Signature Knotless Bohemian Braids",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_1.mp4",
      description: "Featherlight, painless knotless braids accented with soft cascading bohemian curls. Gentle on the scalp with natural movement and radiant shine.",
      display_order: 1
    },

    // 2. User Hair Video 2: Waist-Length Knotless Plaits
    {
      title: "Flawless Waist-Length Knotless Plaits",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_2.mp4",
      description: "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length. Finished with nourishing scalp oil and mousse seal.",
      display_order: 2
    },

    // 3. User Hair Video 3: Goddess Braiding & Edge Artistry
    {
      title: "Goddess Braiding & Edge Artistry",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_3.mp4",
      description: "Sculpted goddess braid perfection styled with delicate baby-hair swoops, glossy texturizing mousse, and bouncy curl ends.",
      display_order: 3
    },

    // 4. User Hair Video 4: Intricate Fulani & Stitch Cornrow Artistry
    {
      title: "Intricate Fulani & Stitch Cornrow Artistry",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_4.mp4",
      description: "Crisp symmetrical feed-in stitch cornrows crafted with geometric precision, paired with protective knotless braids in the back.",
      display_order: 4
    },

    // 5. User Hair Video 5: Luxury Silk-Finish Braid Rejuvenation
    {
      title: "Luxury Silk-Finish Braid Rejuvenation",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_5.mp4",
      description: "Ultra-sleek protective braids styled for longevity. Sealed with botanical shine spray and hot water dip for fluid, silky sway.",
      display_order: 5
    },

    // 6. User's Uploaded Video: Lashes
    {
      title: "Stunning Eyelash Extensions & Volume Flutter",
      category: "Lash Extensions",
      media_type: "video",
      media_url: "./media/mira_lash_extensions_video.mp4",
      description: "Gorgeous lashes that enhance your natural beauty. Fluttery, lightweight, and tailored to brighten your eyes effortlessly.",
      display_order: 6
    },

    // 7. User's Uploaded Image: Nails
    {
      title: "Signature Sculpted Stiletto Nails & Art",
      category: "Nails & Art",
      media_type: "image",
      media_url: "./media/mira_nails_stiletto.jpg",
      description: "Stunning nail extensions, creative designs, and flawless finishes. Expert nail and foot care for a polished, refreshed look.",
      display_order: 7
    },

    // 8. Hair Braiding Photo: Knotless Braids
    {
      title: "Flawless Waist-Length Knotless Braids",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "./media/knotless_braids.jpg",
      description: "Painless, tension-free scalp parting with clean lines and lightweight premium braiding hair for effortless movement.",
      display_order: 8
    },

    // 9. Hair Braiding Photo: Boho Braids
    {
      title: "Goddess Bohemian Braids with Soft Curls",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "./media/boho_braids.jpg",
      description: "Exquisite knotless braids adorned with luscious deep curls for an ethereal, romantic aesthetic.",
      display_order: 9
    },

    // 10. Hair Braiding Photo: Fulani Cornrows
    {
      title: "Intricate Fulani & Stitch Cornrow Artistry",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "./media/fulani_cornrows.jpg",
      description: "Precision geometric stitch braids with custom cultural hair cuffs and bead accents.",
      display_order: 10
    },

    // 11. Nails Photo: French Ombre
    {
      title: "French Ombré Sculpted Acrylics",
      category: "Nails & Art",
      media_type: "image",
      media_url: "./media/french_ombre_nails.jpg",
      description: "Delicate nude-to-white baby boomer gradient with high-gloss topcoat and crystal detailing.",
      display_order: 11
    },

    // 12. Nails Photo: Gel-X Extensions
    {
      title: "Luxury Gel-X Extensions with Clean Cuticle Care",
      category: "Nails & Art",
      media_type: "image",
      media_url: "./media/gelx_nails.jpg",
      description: "Flawless Russian manicure preparation paired with seamless full-cover soft gel extensions.",
      display_order: 12
    },

    // 13. Nails Photo: Deluxe Spa Pedicure
    {
      title: "Deluxe Spa Pedicure Herbal Soak & Scrub",
      category: "Nails & Art",
      media_type: "image",
      media_url: "./media/deluxe_pedicure.jpg",
      description: "Restorative eucalyptus and dead sea salt foot bath, exfoliation, hot towel wrap, and nourishing massage.",
      display_order: 13
    },

    // 14. Makeup Photo: Royal Bridal Glam
    {
      title: "Royal Bridal Glam & Dewy Skin Glow",
      category: "Makeup Artistry",
      media_type: "image",
      media_url: "./media/bridal_makeup.jpg",
      description: "Photography-ready bridal perfection designed to last all day with waterproof base, sculpted eyes, and flutter mink lashes.",
      display_order: 14
    },

    // 15. Makeup Photo: Soft Glam Evening
    {
      title: "Soft Glam Evening Radiance",
      category: "Makeup Artistry",
      media_type: "image",
      media_url: "./media/evening_soft_glam.jpg",
      description: "Velvety nude lips, bronze shimmer eyes, and seamless contour for dinner dates, galas, and celebrations.",
      display_order: 15
    },

    // 16. Lashes Photo: Wispy Hybrid Volume
    {
      title: "Wispy Hybrid Volume Eyelash Set",
      category: "Lash Extensions",
      media_type: "image",
      media_url: "./media/wispy_lashes.jpg",
      description: "Textured, multidimensional lash fans tailored to enhance the client’s eye shape without heavy weight.",
      display_order: 16
    },

    // 17. Perfume Photo: Presentation Bar
    {
      title: "Bespoke Perfume Presentation Bar & Flacons",
      category: "Perfume Curation",
      media_type: "image",
      media_url: "./media/perfume_presentation_bar.jpg",
      description: "Our private fragrance bar featuring artisanal bottles, pure perfume oils, and customized scent discovery.",
      display_order: 17
    },

    // 18. Perfume Photo: Haute Flacon Spotlight
    {
      title: "Haute Parfumerie Flacon Spotlight",
      category: "Perfume Curation",
      media_type: "image",
      media_url: "./media/haute_perfume_flacon.jpg",
      description: "Velvet Oud & Royal Amber flacon captured in warm golden light, priced under ₦20,000.",
      display_order: 18
    },

    // 19. User's Uploaded Video: LAST VIDEO IN THE GALLERY PAGE
    {
      title: "Mira’s Beauty Touch Salon & Scent Experience",
      category: "Salon Showcase",
      media_type: "video",
      media_url: "./media/mira_salon_scent_experience.mp4",
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
