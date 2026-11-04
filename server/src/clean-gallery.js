const db = require('./db');

function populateCleanGallery() {
  db.prepare('DELETE FROM gallery_items').run();

  const insert = db.prepare(`
    INSERT INTO gallery_items (title, category, media_type, media_url, description, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const items = [
    // 1. User Uploaded Lash Video 1 (First two as Lash)
    {
      title: "Wispy Volume Lash Artistry & Flutter",
      category: "Lash Extensions",
      media_type: "video",
      media_url: "./media/mira_lash_video_1.mp4",
      description: "Lightweight, multidimensional lash fans tailored to enhance eye shape with fluttery elegance and natural volume.",
      display_order: 1
    },

    // 2. User Uploaded Lash Video 2 (First two as Lash)
    {
      title: "Deluxe Classic & Hybrid Eyelash Glow",
      category: "Lash Extensions",
      media_type: "video",
      media_url: "./media/mira_lash_video_2.mp4",
      description: "Custom-curled, long-lasting eyelash extensions designed to accentuate natural eye contours with effortless grace.",
      display_order: 2
    },

    // 3. User Uploaded Hair Video 1 (Next two as Hairs)
    {
      title: "Precision Scalp-Care Knotless Braids",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_6.mp4",
      description: "Clean geometric square partings, lightweight braiding hair, and healthy scalp oil finish for all-day comfort.",
      display_order: 3
    },

    // 4. User Uploaded Hair Video 2 (Next two as Hairs)
    {
      title: "Protective Feed-In Cornrow & Braid Artistry",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_7.mp4",
      description: "Masterful cornrow styling celebrating cultural grace, edge protection, and effortless everyday wear.",
      display_order: 4
    },

    // 5. User Uploaded Nails Video (The last one as Nails)
    {
      title: "Master Sculpted Gel & Acrylic Nail Artistry",
      category: "Nails & Art",
      media_type: "video",
      media_url: "./media/mira_nails_video_1.mp4",
      description: "Pristine nail shaping, high-gloss gel topcoat, and expert cuticle care for luxury hand rejuvenation.",
      display_order: 5
    },

    // 6. User's First Uploaded Hair Video 1
    {
      title: "Signature Knotless Bohemian Braids",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_1.mp4",
      description: "Featherlight, painless knotless braids accented with soft cascading bohemian curls. Gentle on the scalp with natural movement.",
      display_order: 6
    },

    // 7. User's First Uploaded Hair Video 2
    {
      title: "Flawless Waist-Length Knotless Plaits",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_2.mp4",
      description: "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length. Finished with nourishing scalp oil.",
      display_order: 7
    },

    // 10. User Uploaded Hair Photo 1: Signature Bohemian Island Curl Braids
    {
      title: "Signature Bohemian Island Curl Braids",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "./media/mira_hair_boho_curls_portrait.jpg",
      description: "Styled right inside Mira's Beauty Touch salon in Owerri, this hairstyle combines gentle, painless knotless scalp parting with bouncy, silky-soft bohemian island curls. Designed to keep your natural hairline protected while offering effortless glamour, hydration, and natural movement for every occasion.",
      display_order: 8
    },

    // 11. User Uploaded Hair Photo 2: Sculpted Stitch Cornrows & Dual Buns
    {
      title: "Sculpted Stitch Cornrows & Dual High Buns",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "./media/mira_hair_stitch_cornrows_buns.jpg",
      description: "Crafted with immaculate precision, these stitch cornrows feature clean geometric lines that flow seamlessly into two sleek braided buns. Perfect for formal celebrations, weddings, and everyday elegance. Created with tension-free parting to maintain scalp wellness and healthy edges.",
      display_order: 9
    },

    // 12. User Uploaded Hair Photo 3: S-Wave Curved Cornrows & Bouncy Spiral Curls
    {
      title: "S-Wave Curved Cornrows & Bouncy Spiral Curls",
      category: "Hair Braiding",
      media_type: "image",
      media_url: "./media/mira_hair_wave_cornrows_curled_ends.jpg",
      description: "A show-stopping blend of intricate artistry and luxury texture. Featuring elegant wave-parted cornrows that cascade into voluminous, bouncy spiral curl ends, finished with gentle edge control styling. Lightweight, long-lasting, and tailored to frame the face with timeless grace.",
      display_order: 10
    },

    // 13. User Uploaded Hair Video 3: Salon Hair Braiding Motion Showcase I
    {
      title: "Mira’s Salon Hair Braiding Motion Showcase I",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_8.mp4",
      description: "Experience the fluidity and lightweight grace of our hair styling at Mira’s Beauty Touch. Watch our specialized tension-free braiding in motion—featuring ultra-neat parting, lustrous finish, and comfortable all-day wear.",
      display_order: 11
    },

    // 14. User Uploaded Hair Video 4: Salon Hair Braiding Motion Showcase II
    {
      title: "Mira’s Salon Hair Braiding Motion Showcase II",
      category: "Hair Braiding",
      media_type: "video",
      media_url: "./media/mira_hair_braids_video_9.mp4",
      description: "An up-close look at our master braiding craftsmanship. Every plait is woven with precise tension control to protect the hair follicle, stimulate healthy growth, and give our clients confidence and royalty.",
      display_order: 12
    },

    // 8. User's First Uploaded Photo: Signature Sculpted Stiletto Nails (Kept as instructed: "just only keep the first i sent to you to put")
    {
      title: "Signature Sculpted Stiletto Nails & Art",
      category: "Nails & Art",
      media_type: "image",
      media_url: "./media/mira_nails_stiletto.jpg",
      description: "Stunning nail extensions, creative designs, and flawless glossy finishes. Expert nail and foot care for a polished, refreshed look.",
      display_order: 13
    },

    // 9. User's Salon & Scent Experience Video (LAST VIDEO IN THE GALLERY PAGE)
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

  console.log(`Successfully populated ${items.length} 100% authentic user gallery items.`);
}

if (require.main === module) {
  populateCleanGallery();
}

module.exports = populateCleanGallery;
