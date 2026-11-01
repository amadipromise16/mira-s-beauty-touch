// Initial Curated Gallery Portfolio for Mira's Beauty Touch
// Includes authentic salon videos, brightened hair braiding films, nail art, and luxury fragrance curation.

export const initialGalleryData = [
  // 1. User Hair Video 1: Knotless Bohemian Braids
  {
    id: 1,
    title: "Signature Knotless Bohemian Braids",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_1.mp4",
    hair_style_name: "Signature Knotless Bohemian Braids",
    hair_summary: "Featherlight, painless knotless scalp parting accented with soft cascading bohemian curls. Zero tension, natural movement, and radiant healthy shine.",
    description: "Featherlight, painless knotless braids accented with soft cascading bohemian curls. Gentle on the scalp with natural movement and radiant shine.",
    tags: ["Knotless", "Bohemian", "Protective Style", "Zero Tension"],
    booking_service: {
      id: 2,
      name: "Goddess Bohemian Braids",
      category: "Hair Braiding",
      price_ngn: 35000,
      duration_mins: 210,
      description: "Exquisite knotless braids adorned with luscious curls for a dreamy, ethereal aesthetic suited for everyday elegance."
    },
    like_count: 52,
    display_order: 1
  },

  // 2. User Hair Video 2: Waist-Length Knotless Plaits
  {
    id: 2,
    title: "Flawless Waist-Length Knotless Plaits",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_2.mp4",
    hair_style_name: "Waist-Length Knotless Plaits",
    hair_summary: "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length. Finished with scalp nutrition and a mousse shine seal.",
    description: "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length. Finished with nourishing scalp oil and mousse seal.",
    tags: ["Waist Length", "Clean Parting", "Scalp Care", "Long Lasting"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "Painless, tension-free natural scalp finish with sleek parting and lightweight premium braiding hair."
    },
    like_count: 67,
    display_order: 2
  },

  // 3. User Hair Video 3: Goddess Braiding & Edge Artistry
  {
    id: 3,
    title: "Goddess Braiding & Edge Artistry",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_3.mp4",
    hair_style_name: "Goddess Braiding with Curled Ends",
    hair_summary: "Sculpted goddess braid perfection styled with delicate baby-hair swoops, glossy texturizing mousse, and bouncy curl ends for pure luxury.",
    description: "Sculpted goddess braid perfection styled with delicate baby-hair swoops, glossy texturizing mousse, and bouncy curl ends.",
    tags: ["Goddess", "Edge Art", "Curled Ends", "Luxury Finish"],
    booking_service: {
      id: 2,
      name: "Goddess Bohemian Braids",
      category: "Hair Braiding",
      price_ngn: 35000,
      duration_mins: 210,
      description: "Sculpted goddess braids with bouncy curls and smooth baby-hair edge styling."
    },
    like_count: 58,
    display_order: 3
  },

  // 4. User Hair Video 4: Intricate Fulani & Stitch Cornrow Artistry
  {
    id: 4,
    title: "Intricate Fulani & Stitch Cornrow Artistry",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_4.mp4",
    hair_style_name: "Intricate Fulani Stitch Cornrows",
    hair_summary: "Crisp symmetrical feed-in stitch cornrows crafted with geometric precision, paired with protective knotless plaits in the back for royal poise.",
    description: "Crisp symmetrical feed-in stitch cornrows crafted with geometric precision, paired with protective knotless braids in the back.",
    tags: ["Fulani", "Stitch Braids", "Cornrows", "Cultural Elegance"],
    booking_service: {
      id: 3,
      name: "Fulani & Cornrow Artistry",
      category: "Hair Braiding",
      price_ngn: 20000,
      duration_mins: 120,
      description: "Crisp symmetrical feed-in stitch cornrows with clean geometric parting."
    },
    like_count: 49,
    display_order: 4
  },

  // 5. User Hair Video 5: Luxury Silk-Finish Braid Rejuvenation
  {
    id: 5,
    title: "Luxury Silk-Finish Braid Rejuvenation",
    category: "Hair Braiding",
    media_type: "video",
    media_url: "./media/mira_hair_braids_video_5.mp4",
    hair_style_name: "Silk-Finish Protective Braids",
    hair_summary: "Ultra-sleek protective braids styled for longevity. Sealed with botanical shine spray and hot water dip for fluid, silky sway.",
    description: "Ultra-sleek protective braids styled for longevity. Sealed with botanical shine spray and hot water dip for fluid, silky sway.",
    tags: ["Silk Finish", "Protective Styling", "Botanical Seal", "Sleek"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "High-shine protective braids sealed with nourishing herbal oils."
    },
    like_count: 61,
    display_order: 5
  },

  // 6. User Uploaded Video: Lash Extensions
  {
    id: 6,
    title: "Stunning Eyelash Extensions & Volume Flutter",
    category: "Lash Extensions",
    media_type: "video",
    media_url: "./media/mira_lash_extensions_video.mp4",
    hair_summary: "Lightweight, multidimensional lash fans tailored to enhance eye shape effortlessly.",
    description: "Gorgeous lashes that enhance your natural beauty. Fluttery, lightweight, and tailored to brighten your eyes effortlessly.",
    tags: ["Hybrid Volume", "Flutter Lashes", "Weightless"],
    booking_service: {
      id: 8,
      name: "Hybrid Volume Eyelash Extensions",
      category: "Eyelash Extensions",
      price_ngn: 26000,
      duration_mins: 80,
      description: "The ideal blend of classic individual lashes and volume fans, delivering a textured, fluttery lash look."
    },
    like_count: 44,
    display_order: 6
  },

  // 7. User Uploaded Image: Sculpted Stiletto Nails
  {
    id: 7,
    title: "Signature Sculpted Stiletto Nails & Art",
    category: "Nails & Art",
    media_type: "image",
    media_url: "./media/mira_nails_stiletto.jpg",
    description: "Stunning nail extensions, creative designs, and flawless finishes. Expert nail and foot care for a polished, refreshed look.",
    tags: ["Nail Art", "Sculpted Acrylics", "Stiletto", "Gloss"],
    booking_service: {
      id: 5,
      name: "Acrylic Full Set & Nail Art",
      category: "Nail Enhancements",
      price_ngn: 22000,
      duration_mins: 75,
      description: "Custom sculpted acrylic extensions tailored in length and shape with trendy art."
    },
    like_count: 73,
    display_order: 7
  },

  // 8. Hair Braiding Photo: Knotless Braids
  {
    id: 8,
    title: "Flawless Waist-Length Knotless Braids",
    category: "Hair Braiding",
    media_type: "image",
    media_url: "./media/knotless_braids.jpg",
    hair_summary: "Painless, tension-free scalp parting with clean lines and lightweight premium braiding hair.",
    description: "Painless, tension-free scalp parting with clean lines and lightweight premium braiding hair for effortless movement.",
    tags: ["Knotless Braids", "Clean Parting", "Protective"],
    booking_service: {
      id: 1,
      name: "Knotless Box Braids (Waist Length)",
      category: "Hair Braiding",
      price_ngn: 28000,
      duration_mins: 180,
      description: "Painless, tension-free natural scalp finish with sleek parting and lightweight premium braiding hair."
    },
    like_count: 51,
    display_order: 8
  },

  // 9. Hair Braiding Photo: Boho Braids
  {
    id: 9,
    title: "Goddess Bohemian Braids with Soft Curls",
    category: "Hair Braiding",
    media_type: "image",
    media_url: "./media/boho_braids.jpg",
    hair_summary: "Exquisite knotless braids adorned with luscious deep curls for an ethereal, romantic aesthetic.",
    description: "Exquisite knotless braids adorned with luscious deep curls for an ethereal, romantic aesthetic.",
    tags: ["Bohemian", "Goddess Curls", "Protective Style"],
    booking_service: {
      id: 2,
      name: "Goddess Bohemian Braids",
      category: "Hair Braiding",
      price_ngn: 35000,
      duration_mins: 210,
      description: "Exquisite knotless braids adorned with luscious curls for a dreamy, ethereal aesthetic."
    },
    like_count: 64,
    display_order: 9
  },

  // 10. Hair Braiding Photo: Fulani Cornrows
  {
    id: 10,
    title: "Intricate Fulani & Stitch Cornrow Artistry",
    category: "Hair Braiding",
    media_type: "image",
    media_url: "./media/fulani_cornrows.jpg",
    hair_summary: "Precision geometric stitch braids with custom cultural hair cuffs and bead accents.",
    description: "Precision geometric stitch braids with custom cultural hair cuffs and bead accents.",
    tags: ["Fulani", "Stitch Cornrows", "Cultural"],
    booking_service: {
      id: 3,
      name: "Fulani & Cornrow Artistry",
      category: "Hair Braiding",
      price_ngn: 20000,
      duration_mins: 120,
      description: "Traditional yet modern intricate stitch cornrows, custom tribal patterns, and bead or cuff accents."
    },
    like_count: 38,
    display_order: 10
  },

  // 11. Nails Photo: French Ombre
  {
    id: 11,
    title: "French Ombré Sculpted Acrylics",
    category: "Nails & Art",
    media_type: "image",
    media_url: "./media/french_ombre_nails.jpg",
    description: "Delicate nude-to-white baby boomer gradient with high-gloss topcoat and crystal detailing.",
    tags: ["French Ombre", "Baby Boomer", "Acrylics"],
    booking_service: {
      id: 5,
      name: "Acrylic Full Set & Nail Art",
      category: "Nail Enhancements",
      price_ngn: 22000,
      duration_mins: 75,
      description: "Custom sculpted acrylic extensions with French ombré gradient."
    },
    like_count: 42,
    display_order: 11
  },

  // 12. Nails Photo: Gel-X Extensions
  {
    id: 12,
    title: "Luxury Gel-X Extensions with Clean Cuticle Care",
    category: "Nails & Art",
    media_type: "image",
    media_url: "./media/gelx_nails.jpg",
    description: "Flawless Russian manicure preparation paired with seamless full-cover soft gel extensions.",
    tags: ["Gel-X", "Cuticle Care", "Soft Gel"],
    booking_service: {
      id: 6,
      name: "Gel-X Soft Gel Extension System",
      category: "Nail Enhancements",
      price_ngn: 25000,
      duration_mins: 75,
      description: "Odorless, zero-damage full cover tips crafted from soak-off soft gel."
    },
    like_count: 39,
    display_order: 12
  },

  // 13. Nails Photo: Deluxe Spa Pedicure
  {
    id: 13,
    title: "Deluxe Spa Pedicure Herbal Soak & Scrub",
    category: "Nails & Art",
    media_type: "image",
    media_url: "./media/deluxe_pedicure.jpg",
    description: "Restorative eucalyptus and dead sea salt foot bath, exfoliation, hot towel wrap, and nourishing massage.",
    tags: ["Spa Pedicure", "Herbal Scrub", "Foot Care"],
    booking_service: {
      id: 4,
      name: "Deluxe Spa Pedicure & Scrub",
      category: "Manicures & Pedicures",
      price_ngn: 18000,
      duration_mins: 60,
      description: "Warm herbal foot soak, exfoliating sea salt scrub, cuticle care, and soothing massage."
    },
    like_count: 47,
    display_order: 13
  },

  // 14. Makeup Photo: Royal Bridal Glam
  {
    id: 14,
    title: "Royal Bridal Glam & Dewy Skin Glow",
    category: "Makeup Artistry",
    media_type: "image",
    media_url: "./media/bridal_makeup.jpg",
    description: "Photography-ready bridal perfection designed to last all day with waterproof base, sculpted eyes, and flutter mink lashes.",
    tags: ["Bridal Glam", "Dewy Skin", "Waterproof Base"],
    booking_service: {
      id: 7,
      name: "Flawless Bridal Makeup Experience",
      category: "Professional Makeup",
      price_ngn: 65000,
      duration_mins: 90,
      description: "High-definition bridal look with skin prep, waterproof base, and mink lashes."
    },
    like_count: 89,
    display_order: 14
  },

  // 15. Makeup Photo: Soft Glam Evening
  {
    id: 15,
    title: "Soft Glam Evening Radiance",
    category: "Makeup Artistry",
    media_type: "image",
    media_url: "./media/evening_soft_glam.jpg",
    description: "Velvety nude lips, bronze shimmer eyes, and seamless contour for dinner dates, galas, and celebrations.",
    tags: ["Soft Glam", "Evening Glow", "Bronze Shimmer"],
    booking_service: {
      id: 8,
      name: "Soft Glam Occasion Makeup",
      category: "Professional Makeup",
      price_ngn: 30000,
      duration_mins: 60,
      description: "Radiant dewy skin, gentle earthy tones, crisp brows, and fluttery lashes."
    },
    like_count: 55,
    display_order: 15
  },

  // 16. Lashes Photo: Wispy Hybrid Volume
  {
    id: 16,
    title: "Wispy Hybrid Volume Eyelash Set",
    category: "Lash Extensions",
    media_type: "image",
    media_url: "./media/wispy_lashes.jpg",
    description: "Textured, multidimensional lash fans tailored to enhance the client’s eye shape without heavy weight.",
    tags: ["Wispy Lashes", "Hybrid Volume", "Custom Fans"],
    booking_service: {
      id: 9,
      name: "Hybrid Volume Eyelash Extensions",
      category: "Eyelash Extensions",
      price_ngn: 26000,
      duration_mins: 80,
      description: "The ideal blend of classic individual lashes and volume fans."
    },
    like_count: 46,
    display_order: 16
  },

  // 17. Perfume Photo: Presentation Bar
  {
    id: 17,
    title: "Bespoke Perfume Presentation Bar & Flacons",
    category: "Perfume Curation",
    media_type: "image",
    media_url: "./media/perfume_presentation_bar.jpg",
    description: "Our private fragrance bar featuring artisanal bottles, pure perfume oils, and customized scent discovery.",
    tags: ["Fragrance Bar", "Luxury Flacons", "Niche Scents"],
    booking_service: {
      id: 11,
      name: "Bespoke Scent Discovery Consultation",
      category: "Fragrance & Wellness",
      price_ngn: 15000,
      duration_mins: 45,
      description: "Private fragrance profiling session exploring olfactive families to uncover your signature perfume pairing."
    },
    like_count: 59,
    display_order: 17
  },

  // 18. Perfume Photo: Haute Flacon Spotlight
  {
    id: 18,
    title: "Haute Parfumerie Flacon Spotlight",
    category: "Perfume Curation",
    media_type: "image",
    media_url: "./media/haute_perfume_flacon.jpg",
    description: "Velvet Oud & Royal Amber flacon captured in warm golden light, priced under ₦20,000.",
    tags: ["Haute Parfumerie", "Golden Amber", "Royal Oud"],
    booking_service: {
      id: 11,
      name: "Bespoke Scent Discovery Consultation",
      category: "Fragrance & Wellness",
      price_ngn: 15000,
      duration_mins: 45,
      description: "Private fragrance profiling session exploring olfactive families."
    },
    like_count: 63,
    display_order: 18
  },

  // 19. User's Video: Salon Sanctuary & Scent Bar (LAST VIDEO ON GALLERY PAGE)
  {
    id: 19,
    title: "Mira’s Beauty Touch Salon & Scent Experience",
    category: "Salon Showcase",
    media_type: "video",
    media_url: "./media/mira_salon_scent_experience.mp4",
    hair_summary: "Full sanctuary tour: expert hair braiding, manicure pampering, and private luxury perfume bar.",
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
    like_count: 112,
    display_order: 99
  }
];
