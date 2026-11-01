// Initial Curated Gallery Portfolio for Mira's Beauty Touch
// Contains 100% authentic client media uploaded by the user:
// - First 2 as Lash Extensions (Videos)
// - Next 2 as Hair Braiding (Videos)
// - Last 1 as Nails & Art (Video)
// - First uploaded photo: Sculpted Stiletto Nails (Image)
// - First uploaded hair videos: Signature Knotless & Protective Plaits (Videos)
// - Salon & Scent Experience (Video - last video)
// All AI-generated pictures have been removed as instructed.

export const initialGalleryData = [
  // 1. User Uploaded Lash Video 1 (First two as Lash)
  {
    id: 1,
    title: "Wispy Volume Lash Artistry & Flutter",
    category: "Lash Extensions",
    media_type: "video",
    media_url: "./media/mira_lash_video_1.mp4",
    hair_summary: "Lightweight, multidimensional lash fans tailored to enhance eye shape with fluttery elegance.",
    description: "Lightweight, multidimensional lash fans tailored to enhance eye shape with fluttery elegance and natural volume.",
    tags: ["Lash Extensions", "Hybrid Volume", "Flutter", "Weightless"],
    booking_service: {
      id: 9,
      name: "Hybrid Volume Eyelash Extensions",
      category: "Eyelash Extensions",
      price_ngn: 26000,
      duration_mins: 80,
      description: "The ideal blend of classic individual lashes and volume fans, delivering a textured, fluttery lash look."
    },
    like_count: 64,
    display_order: 1
  },

  // 2. User Uploaded Lash Video 2 (First two as Lash)
  {
    id: 2,
    title: "Deluxe Classic & Hybrid Eyelash Glow",
    category: "Lash Extensions",
    media_type: "video",
    media_url: "./media/mira_lash_video_2.mp4",
    hair_summary: "Custom-curled, long-lasting eyelash extensions designed to accentuate natural eye contours.",
    description: "Custom-curled, long-lasting eyelash extensions designed to accentuate natural eye contours with effortless grace.",
    tags: ["Lash Extensions", "Classic Lash", "Eye Glow", "Luxury Care"],
    booking_service: {
      id: 10,
      name: "Classic Natural Eyelash Set",
      category: "Eyelash Extensions",
      price_ngn: 20000,
      duration_mins: 60,
      description: "One-by-one lash application matching your eye shape to add timeless length, curl, and natural eye-opening elegance."
    },
    like_count: 58,
    display_order: 2
  },

  // 3. User Uploaded Hair Video 1 (Next two as Hairs)
  {
    id: 3,
    title: "Precision Scalp-Care Knotless Braids",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_6.mp4",
    hair_style_name: "Scalp-Care Knotless Braids",
    hair_summary: "Gentle tension-free scalp parting with silky flowing plaits, featherlight feel, and radiant shine.",
    description: "Clean geometric square partings, lightweight braiding hair, and healthy scalp oil finish for all-day comfort.",
    tags: ["Knotless Braids", "Scalp Care", "Zero Tension", "Protective"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "Painless, tension-free natural scalp finish with sleek parting and lightweight premium braiding hair."
    },
    like_count: 72,
    display_order: 3
  },

  // 4. User Uploaded Hair Video 2 (Next two as Hairs)
  {
    id: 4,
    title: "Protective Feed-In Cornrow & Braid Artistry",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_7.mp4",
    hair_style_name: "Feed-In Cornrow & Braid Styling",
    hair_summary: "Intricate protective feed-in styling with crisp symmetrical lines and long-lasting scalp comfort.",
    description: "Masterful cornrow styling celebrating cultural grace, edge protection, and effortless everyday wear.",
    tags: ["Feed-In", "Cornrows", "Protective Style", "Edge Care"],
    booking_service: {
      id: 3,
      name: "Fulani & Cornrow Artistry",
      category: "Hair Braiding",
      price_ngn: 20000,
      duration_mins: 120,
      description: "Traditional yet modern intricate stitch cornrows, custom tribal patterns, and bead or cuff accents."
    },
    like_count: 67,
    display_order: 4
  },

  // 5. User Uploaded Nails Video (The last one as Nails)
  {
    id: 5,
    title: "Master Sculpted Gel & Acrylic Nail Artistry",
    category: "Nails & Art",
    media_type: "video",
    media_url: "./media/mira_nails_video_1.mp4",
    hair_summary: "Pristine nail shaping, high-gloss gel topcoat, and expert cuticle care for luxury hand rejuvenation.",
    description: "Pristine nail shaping, high-gloss gel topcoat, and expert cuticle care for luxury hand rejuvenation.",
    tags: ["Nails & Art", "Sculpted Acrylics", "Gel Polish", "Nail Art"],
    booking_service: {
      id: 5,
      name: "Acrylic Full Set & Nail Art",
      category: "Nail Enhancements",
      price_ngn: 22000,
      duration_mins: 75,
      description: "Custom sculpted acrylic extensions tailored in length and shape with trendy chrome or French art."
    },
    like_count: 81,
    display_order: 5
  },

  // 6. User's First Uploaded Hair Video 1: Knotless Bohemian Braids
  {
    id: 6,
    title: "Signature Knotless Bohemian Braids",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_1.mp4",
    hair_style_name: "Signature Knotless Bohemian Braids",
    hair_summary: "Featherlight, painless knotless scalp parting accented with soft cascading bohemian curls and radiant shine.",
    description: "Featherlight, painless knotless braids accented with soft cascading bohemian curls. Gentle on the scalp with natural movement.",
    tags: ["Knotless", "Bohemian", "Protective Style", "Zero Tension"],
    booking_service: {
      id: 2,
      name: "Goddess Bohemian Braids",
      category: "Hair Braiding",
      price_ngn: 35000,
      duration_mins: 210,
      description: "Exquisite knotless braids adorned with luscious curls for a dreamy, ethereal aesthetic."
    },
    like_count: 59,
    display_order: 6
  },

  // 7. User's First Uploaded Hair Video 2: Waist-Length Knotless Plaits
  {
    id: 7,
    title: "Flawless Waist-Length Knotless Plaits",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_2.mp4",
    hair_style_name: "Waist-Length Knotless Plaits",
    hair_summary: "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length.",
    description: "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length. Finished with nourishing scalp oil.",
    tags: ["Waist Length", "Clean Parting", "Scalp Care", "Long Lasting"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "Painless, tension-free natural scalp finish with sleek parting and lightweight premium braiding hair."
    },
    like_count: 63,
    display_order: 7
  },

  // 8. User's First Uploaded Photo: Signature Sculpted Stiletto Nails (Kept as instructed: "just only keep the first i sent to you to put")
  {
    id: 8,
    title: "Signature Sculpted Stiletto Nails & Art",
    category: "Nails & Art",
    media_type: "image",
    media_url: "./media/mira_nails_stiletto.jpg",
    description: "Stunning nail extensions, creative designs, and flawless glossy finishes. Expert nail and foot care for a polished, refreshed look.",
    tags: ["Nail Art", "Sculpted Acrylics", "Stiletto", "Gloss"],
    booking_service: {
      id: 5,
      name: "Acrylic Full Set & Nail Art",
      category: "Nail Enhancements",
      price_ngn: 22000,
      duration_mins: 75,
      description: "Custom sculpted acrylic extensions tailored in length and shape with trendy art."
    },
    like_count: 95,
    display_order: 8
  },

  // 9. User's Salon & Scent Experience Video (LAST VIDEO IN THE GALLERY PAGE)
  {
    id: 9,
    title: "Mira’s Beauty Touch Salon & Scent Experience",
    category: "Salon Showcase",
    media_type: "video",
    media_url: "./media/mira_salon_scent_experience.mp4",
    hair_summary: "Full sanctuary tour: expert hair braiding, manicure pampering, and our private luxury perfume bar.",
    description: "Step inside our salon sanctuary where beauty meets elegance. Experience hair styling, manicure pampering, and our private luxury perfume bar.",
    tags: ["Salon Sanctuary", "VIP Experience", "Full Tour", "Perfume Bar"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "Full salon service experience at Mira’s Beauty Touch."
    },
    like_count: 128,
    display_order: 99
  }
];
