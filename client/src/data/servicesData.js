// Curated Salon Services Catalogue for Mira's Beauty Touch
// Includes authentic salon videos, high-definition photography, and bespoke treatments.

export const initialServicesData = [
  // 1. User Uploaded First Video: Nail on the Service Page
  {
    id: 1,
    name: "Master Sculpted Gel & Acrylic Nail Artistry",
    category: "Nails & Foot Care",
    media_type: "video",
    image_url: "./media/mira_nails_video_service.mp4",
    description: "Precision Russian cuticle manicure, custom sculpted acrylic extensions, trendy chrome accents, and ultra-gloss UV LED gel finish. Designed for strong, chip-free elegance that lasts 4+ weeks.",
    detailed_notes: "Includes gentle cuticle care, shape customization (almond, stiletto, coffin), nail strengthening primer, and high-shine topcoat.",
    price_ngn: 22000,
    duration_mins: 75,
    is_featured: true
  },

  // 2. User Uploaded Second Video: Hair on the Service Page
  {
    id: 2,
    name: "Signature Knotless Bohemian Hair Braiding",
    category: "Hair Braiding",
    media_type: "video",
    image_url: "./media/mira_hair_video_service.mp4",
    description: "Painless, tension-free scalp parting with soft cascading bohemian curl tendrils. Featherlight weight with natural movement, sealed with herbal scalp oil for long-lasting comfort and radiant shine.",
    detailed_notes: "Gentle on sensitive scalps, zero tension at the hairline, includes botanical scalp treatment and mousse shine setting.",
    price_ngn: 28000,
    duration_mins: 180,
    is_featured: true
  },

  // 3. User Uploaded Third Item: Perfume on the Service Page (with name under and description)
  {
    id: 3,
    name: "Club de Nuit Intense Man & Affection Love (Luxury Duo)",
    category: "Perfume Curation",
    media_type: "image",
    image_url: "./media/club_de_nuit_affection_service.jpg",
    description: "An iconic luxury fragrance pairing combining legendary masculine smoky pineapple, birch, and blackcurrant from Club de Nuit Intense Man with the intoxicating sweet berries, spun marshmallow vanilla, and floral musk of Affection Love by Amazon Pride.",
    detailed_notes: "Club de Nuit: 105ml Eau de Parfum (Lemon, Birch, Ambergris) | Affection Love: 55ml Eau de Parfum (Sweet Berries, Jasmine, Marshmallow Vanilla). Available for purchase at our salon fragrance bar or WhatsApp order.",
    price_ngn: 18500,
    duration_mins: 30,
    is_perfume: true,
    perfume_details: {
      brand: "Armaf & Amazon Pride",
      volume: "105ml + 55ml Pair",
      scent_family: "Woody Aromatic & Gourmand Floral",
      top_notes: "Iced Lemon, Blackcurrant, Sweet Wild Berries",
      heart_notes: "Smoky Birch, Jasmine Sambac, Marshmallow Vanilla",
      base_notes: "Golden Amber, Patchouli, Sensual Cashmere Musk"
    },
    is_featured: true
  },

  // 4. User Uploaded Fourth Video: Lash and Hair (Combo)
  {
    id: 4,
    name: "Lash & Hair Sanctuary Glam Combo",
    category: "Lash & Hair Combos",
    media_type: "video",
    image_url: "./media/mira_lash_hair_combo_1.mp4",
    description: "Our bespoke dual transformation pairing precision protective braids with fluttery hybrid lash extensions. Enjoy a complete head-turning beauty makeover in a single pampering salon session.",
    detailed_notes: "Dual technicians working in sync for maximum relaxation and efficiency. Perfect for birthdays, weddings, celebrations, and festive makeovers.",
    price_ngn: 45000,
    duration_mins: 210,
    is_featured: true
  },

  // 5. User Uploaded Fifth Video: Hair and Lash too (Combo)
  {
    id: 5,
    name: "Goddess Braids & Volume Flutter Lash Package",
    category: "Lash & Hair Combos",
    media_type: "video",
    image_url: "./media/mira_lash_hair_combo_2.mp4",
    description: "Ethereal goddess braiding styled with loose curls and nourished scalp care, accompanied by weightless volume flutter eyelash extensions for undeniable beauty, elegance, and confidence.",
    detailed_notes: "Includes full goddess plait styling, curled accents, lash mapping, eye soothing pads, and nourishing scalp serum.",
    price_ngn: 48000,
    duration_mins: 240,
    is_featured: true
  },

  // 6. Generated Picture 1: Deluxe Spa Pedicure (Nails 1)
  {
    id: 6,
    name: "Deluxe Herbal Spa Pedicure & Scrub",
    category: "Nails & Foot Care",
    media_type: "image",
    image_url: "./media/pedicure_nails_luxury.jpg",
    description: "Warm marble foot basin soak with soothing eucalyptus, organic sea salt scrub, rose petal therapy, callused skin smoothing, cuticle refinement, hot towel wrap, and glossy nude gel finish.",
    detailed_notes: "Deeply restorative foot care treatment utilizing Dead Sea mineral salts, invigorating peppermint scrub, and intensely hydrating foot massage.",
    price_ngn: 18000,
    duration_mins: 60,
    is_featured: false
  },

  // 7. Generated Picture 2: Sculpted Gel Manicure (Nails 2)
  {
    id: 7,
    name: "Sculpted Gel Manicure & Modern French Art",
    category: "Nails & Foot Care",
    media_type: "image",
    image_url: "./media/manicure_nails_sculpted.jpg",
    description: "Flawless Russian cuticle preparation paired with sculpted almond gel nails featuring a modern baby boomer ombré gradient and delicate subtle gold metallic accents.",
    detailed_notes: "Zero-damage nail enhancement system ensuring lightweight strength, smooth finish, and elegant hand radiance.",
    price_ngn: 24000,
    duration_mins: 70,
    is_featured: false
  },

  // 8. Generated Picture 3: Wispy Hybrid Volume Lashes (Lash 1)
  {
    id: 8,
    name: "Wispy Hybrid Volume Eyelash Extensions",
    category: "Eyelash Extensions",
    media_type: "image",
    image_url: "./media/lash_extensions_wispy.jpg",
    description: "Textured, multidimensional lash fans tailored to client eye geometry. Alternating lengths with delicate spikes that deliver high-fashion flutter without heavy weight.",
    detailed_notes: "Custom eye mapping to accentuate natural eye lift. Medical-grade, hypoallergenic adhesive for sensitive eyes.",
    price_ngn: 26000,
    duration_mins: 80,
    is_featured: false
  },

  // 9. Generated Picture 4: Classic Natural Flutter Lashes (Lash 2)
  {
    id: 9,
    name: "Classic Natural Flutter Lashes & Brow Framing",
    category: "Eyelash Extensions",
    media_type: "image",
    image_url: "./media/lash_extensions_classic.jpg",
    description: "Individual one-by-one single lash extension application designed to accentuate your natural eye shape with timeless elegance, paired with gentle brow sculpting.",
    detailed_notes: "Soft silk lash fibers providing weightless curl, gentle separation, and natural everyday eye brightening.",
    price_ngn: 20000,
    duration_mins: 60,
    is_featured: false
  },

  // 10. Additional Core Salon Styling
  {
    id: 10,
    name: "Intricate Fulani & Stitch Cornrow Artistry",
    category: "Hair Braiding",
    media_type: "video",
    image_url: "./media/mira_hair_braids_video_7.mp4",
    description: "Precision geometric stitch cornrows crafted with symmetrical feed-in technique, paired with protective plaits in the back for royal poise.",
    detailed_notes: "Clean parting lines, scalp hydration, and protective longevity styling.",
    price_ngn: 20000,
    duration_mins: 120,
    is_featured: false
  }
];
