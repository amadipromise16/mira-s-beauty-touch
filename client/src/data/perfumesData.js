// Authentic Perfumes Catalogue for Mira's Beauty Touch
// Featured products matching user inventory and photos
// All prices customized to affordable Nigerian Naira (₦) rates not exceeding ₦20,000

export const initialPerfumesData = [
  {
    id: 1,
    name: "Queen of Arabia (Luxury Gift Set)",
    brand: "Lattafa Pride",
    description: "An opulent royal Arabian gift set crafted with imperial distinction. Featuring rich notes of velvety Damask rose, warm golden amber, regal agarwood (oud), and sweet bourbon vanilla. Comes complete with a luxury 100ml flacon, travel miniature, pocket atomizer, and perfumed spray.",
    fragrance_notes: "Top: Sweet Bergamot, Royal Saffron | Heart: Taif Rose, Golden Amber, Incense | Base: Madagascar Vanilla, Royal Oud, Cashmere Musk",
    size: "4-Piece Luxury Gift Set",
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
