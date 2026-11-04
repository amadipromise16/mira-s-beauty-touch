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

  // 10. User Uploaded Hair Photo 1: Signature Bohemian Island Curl Braids
  {
    id: 10,
    title: "Signature Bohemian Island Curl Braids",
    category: "Hair Braiding",
    media_type: "image",
    media_url: "./media/mira_hair_boho_curls_portrait.jpg",
    hair_style_name: "Bohemian Island Curl Knotless Braids",
    hair_summary: "Featherlight, tension-free knotless braids blended with glossy spiral island curls for an effortless, royal goddess look.",
    description: "Styled right inside Mira's Beauty Touch salon in Owerri, this hairstyle combines gentle, painless knotless scalp parting with bouncy, silky-soft bohemian island curls. Designed to keep your natural hairline protected while offering effortless glamour, hydration, and natural movement for every occasion.",
    tags: ["Boho Curls", "Island Braids", "Knotless", "Protective Styling", "Mira's Touch"],
    booking_service: {
      id: 2,
      name: "Goddess Bohemian Braids",
      category: "Hair Braiding",
      price_ngn: 35000,
      duration_mins: 210,
      description: "Exquisite knotless braids adorned with luscious curls for a dreamy, ethereal aesthetic."
    },
    like_count: 89,
    display_order: 8
  },

  // 11. User Uploaded Hair Photo 2: Sculpted Stitch Cornrows & Dual Buns
  {
    id: 11,
    title: "Sculpted Stitch Cornrows & Dual High Buns",
    category: "Hair Braiding",
    media_type: "image",
    media_url: "./media/mira_hair_stitch_cornrows_buns.jpg",
    hair_style_name: "Curved Stitch Cornrows & Double Buns",
    hair_summary: "Razor-clean geometric stitch lines transitioning into sleek, protective twin buns with clean scalp finish.",
    description: "Crafted with immaculate precision, these stitch cornrows feature clean geometric lines that flow seamlessly into two sleek braided buns. Perfect for formal celebrations, weddings, and everyday elegance. Created with tension-free parting to maintain scalp wellness and healthy edges.",
    tags: ["Stitch Cornrows", "Double Buns", "Ghana Weaving", "Scalp Care", "Precision Braids"],
    booking_service: {
      id: 3,
      name: "Fulani & Cornrow Artistry",
      category: "Hair Braiding",
      price_ngn: 20000,
      duration_mins: 120,
      description: "Traditional yet modern intricate stitch cornrows, custom tribal patterns, and bead or cuff accents."
    },
    like_count: 94,
    display_order: 9
  },

  // 12. User Uploaded Hair Photo 3: S-Wave Curved Cornrows & Bouncy Spiral Curls
  {
    id: 12,
    title: "S-Wave Curved Cornrows & Bouncy Spiral Curls",
    category: "Hair Braiding",
    media_type: "image",
    media_url: "./media/mira_hair_wave_cornrows_curled_ends.jpg",
    hair_style_name: "Designer Wave Cornrows & Spiral Ends",
    hair_summary: "Artistic S-curve scalp braiding paired with voluminous spiral curled ends and sleekly sculpted baby hair edges.",
    description: "A show-stopping blend of intricate artistry and luxury texture. Featuring elegant wave-parted cornrows that cascade into voluminous, bouncy spiral curl ends, finished with gentle edge control styling. Lightweight, long-lasting, and tailored to frame the face with timeless grace.",
    tags: ["Wave Cornrows", "Spiral Curls", "Laid Edges", "Protective Hair", "Salon Perfection"],
    booking_service: {
      id: 2,
      name: "Goddess Bohemian Braids",
      category: "Hair Braiding",
      price_ngn: 35000,
      duration_mins: 210,
      description: "Artistic wave cornrows with bouncy spiral ends and flawless edge styling."
    },
    like_count: 108,
    display_order: 10
  },

  // 13. User Uploaded Hair Video 3: Salon Hair Braiding Motion Showcase I
  {
    id: 13,
    title: "Mira’s Salon Hair Braiding Motion Showcase I",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_8.mp4",
    hair_style_name: "Salon Hair Braiding Showcase I",
    hair_summary: "Live video demonstration of silky braid motion, lightweight feel, and painless scalp technique.",
    description: "Experience the fluidity and lightweight grace of our hair styling at Mira’s Beauty Touch. Watch our specialized tension-free braiding in motion—featuring ultra-neat parting, lustrous finish, and comfortable all-day wear.",
    tags: ["Hair Motion", "Salon Showcase", "Knotless Plaits", "Silky Braids"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "Painless, tension-free natural scalp finish with sleek parting and lightweight premium braiding hair."
    },
    like_count: 76,
    display_order: 11
  },

  // 14. User Uploaded Hair Video 4: Salon Hair Braiding Motion Showcase II
  {
    id: 14,
    title: "Mira’s Salon Hair Braiding Motion Showcase II",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_9.mp4",
    hair_style_name: "Salon Hair Braiding Showcase II",
    hair_summary: "Detailed 360° close-up of precise stitch weaving, pristine hairline protection, and healthy hair glow.",
    description: "An up-close look at our master braiding craftsmanship. Every plait is woven with precise tension control to protect the hair follicle, stimulate healthy growth, and give our clients confidence and royalty.",
    tags: ["360 Hair", "Stitch Perfection", "Hair Care", "Owerri Stylist"],
    booking_service: {
      id: 3,
      name: "Fulani & Cornrow Artistry",
      category: "Hair Braiding",
      price_ngn: 20000,
      duration_mins: 120,
      description: "Traditional yet modern intricate stitch cornrows, custom tribal patterns, and bead or cuff accents."
    },
    like_count: 82,
    display_order: 12
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
    display_order: 13
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
