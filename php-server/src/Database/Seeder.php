<?php

declare(strict_types=1);

namespace App\Database;

use App\Config\Database;
use PDO;

class Seeder
{
    public static function run(?PDO $pdo = null): void
    {
        $pdo = $pdo ?? Database::getConnection();
        echo "Seeding Mira’s Beauty Touch database (PHP)...\n";

        // 1. Users
        $adminHash = password_hash('miratouch', PASSWORD_BCRYPT, ['cost' => 10]);
        $clientHash = password_hash('ClientPass123!', PASSWORD_BCRYPT, ['cost' => 10]);

        // Clean up legacy admin email if present
        $pdo->exec("DELETE FROM users WHERE email = 'admin@mirasbeautytouch.com'");

        $checkAdmin = $pdo->query("SELECT id FROM users WHERE email = 'mirabeautytouch@gmail.com'")->fetch();
        if (!$checkAdmin) {
            $insertAdmin = $pdo->prepare("
                INSERT INTO users (full_name, email, phone, password_hash, role)
                VALUES ('Mira Ochu', 'mirabeautytouch@gmail.com', '+234 903 727 6804', ?, 'admin')
            ");
            $insertAdmin->execute([$adminHash]);
            $adminId = (int) $pdo->lastInsertId();
            echo "Created Admin user: mirabeautytouch@gmail.com\n";
        } else {
            $adminId = (int) $checkAdmin['id'];
            $pdo->prepare("UPDATE users SET full_name = 'Mira Ochu', password_hash = ? WHERE email = 'mirabeautytouch@gmail.com'")->execute([$adminHash]);
        }

        $checkClient = $pdo->query("SELECT id FROM users WHERE email = 'client@example.com'")->fetch();
        if (!$checkClient) {
            $insertClient = $pdo->prepare("
                INSERT INTO users (full_name, email, phone, password_hash, role)
                VALUES ('Amaka Nwosu', 'client@example.com', '+234 814 987 6543', ?, 'client')
            ");
            $insertClient->execute([$clientHash]);
            $clientId = (int) $pdo->lastInsertId();
            echo "Created Demo Client: client@example.com\n";
        } else {
            $clientId = (int) $checkClient['id'];
        }

        // 2. Services
        $servicesCount = (int) $pdo->query('SELECT COUNT(*) FROM services')->fetchColumn();
        if ($servicesCount === 0) {
            $insertService = $pdo->prepare("
                INSERT INTO services (name, category, description, price_ngn, duration_mins, image_url)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $services = [
                [
                    'name' => 'Master Sculpted Gel & Acrylic Nail Artistry',
                    'category' => 'Nails & Foot Care',
                    'description' => 'Precision Russian cuticle manicure, custom sculpted acrylic extensions, trendy chrome accents, and ultra-gloss UV LED gel finish. Designed for strong, chip-free elegance that lasts 4+ weeks.',
                    'price_ngn' => 22000,
                    'duration_mins' => 75,
                    'image_url' => './media/mira_nails_video_service.mp4',
                ],
                [
                    'name' => 'Signature Knotless Bohemian Hair Braiding',
                    'category' => 'Hair Braiding',
                    'description' => 'Painless, tension-free scalp parting with soft cascading bohemian curl tendrils. Featherlight weight with natural movement, sealed with herbal scalp oil for long-lasting comfort and radiant shine.',
                    'price_ngn' => 28000,
                    'duration_mins' => 180,
                    'image_url' => './media/mira_hair_video_service.mp4',
                ],
                [
                    'name' => 'Club de Nuit Intense Man & Affection Love (Luxury Duo)',
                    'category' => 'Perfume Curation',
                    'description' => 'An iconic luxury fragrance pairing combining legendary masculine smoky pineapple, birch, and blackcurrant from Club de Nuit Intense Man with the intoxicating sweet berries, spun marshmallow vanilla, and floral musk of Affection Love by Amazon Pride.',
                    'price_ngn' => 15000,
                    'duration_mins' => 30,
                    'image_url' => './media/club_de_nuit_affection_service.jpg',
                ],
                [
                    'name' => 'Lash & Hair Sanctuary Glam Combo',
                    'category' => 'Lash & Hair Combos',
                    'description' => 'Our bespoke dual transformation pairing precision protective braids with fluttery hybrid lash extensions. Enjoy a complete head-turning beauty makeover in a single pampering salon session.',
                    'price_ngn' => 45000,
                    'duration_mins' => 210,
                    'image_url' => './media/mira_lash_hair_combo_1.mp4',
                ],
                [
                    'name' => 'Goddess Braids & Volume Flutter Lash Package',
                    'category' => 'Lash & Hair Combos',
                    'description' => 'Ethereal goddess braiding styled with loose curls and nourished scalp care, accompanied by weightless volume flutter eyelash extensions for undeniable beauty, elegance, and confidence.',
                    'price_ngn' => 48000,
                    'duration_mins' => 240,
                    'image_url' => './media/mira_lash_hair_combo_2.mp4',
                ],
                [
                    'name' => 'Deluxe Herbal Spa Pedicure & Scrub',
                    'category' => 'Nails & Foot Care',
                    'description' => 'Warm marble foot basin soak with soothing eucalyptus, organic sea salt scrub, rose petal therapy, callused skin smoothing, cuticle refinement, hot towel wrap, and glossy nude gel finish.',
                    'price_ngn' => 12000,
                    'duration_mins' => 60,
                    'image_url' => './media/pedicure_nails_luxury.jpg',
                ],
                [
                    'name' => 'Sculpted Gel Manicure & Modern French Art',
                    'category' => 'Nails & Foot Care',
                    'description' => 'Flawless Russian cuticle preparation paired with sculpted almond gel nails featuring a modern baby boomer ombré gradient and delicate subtle gold metallic accents.',
                    'price_ngn' => 24000,
                    'duration_mins' => 70,
                    'image_url' => './media/manicure_nails_sculpted.jpg',
                ],
                [
                    'name' => 'Wispy Hybrid Volume Eyelash Extensions',
                    'category' => 'Eyelash Extensions',
                    'description' => 'Textured, multidimensional lash fans tailored to client eye geometry. Alternating lengths with delicate spikes that deliver high-fashion flutter without heavy weight.',
                    'price_ngn' => 7000,
                    'duration_mins' => 80,
                    'image_url' => './media/lash_extensions_wispy.jpg',
                ],
                [
                    'name' => 'Classic Natural Flutter Lashes & Brow Framing',
                    'category' => 'Eyelash Extensions',
                    'description' => 'Individual one-by-one single lash extension application designed to accentuate your natural eye shape with timeless elegance, paired with gentle brow sculpting.',
                    'price_ngn' => 6000,
                    'duration_mins' => 60,
                    'image_url' => './media/lash_extensions_classic.jpg',
                ],
                [
                    'name' => 'Intricate Fulani & Stitch Cornrow Artistry',
                    'category' => 'Hair Braiding',
                    'description' => 'Precision geometric stitch cornrows crafted with symmetrical feed-in technique, paired with protective plaits in the back for royal poise.',
                    'price_ngn' => 10000,
                    'duration_mins' => 120,
                    'image_url' => './media/mira_hair_braids_video_7.mp4',
                ],
            ];

            foreach ($services as $s) {
                $insertService->execute([$s['name'], $s['category'], $s['description'], $s['price_ngn'], $s['duration_mins'], $s['image_url']]);
            }
            echo "Seeded " . count($services) . " salon services.\n";
        }

        // 3. Perfumes
        $perfumesCount = (int) $pdo->query('SELECT COUNT(*) FROM perfumes')->fetchColumn();
        if ($perfumesCount === 0) {
            $insertPerfume = $pdo->prepare("
                INSERT INTO perfumes (id, name, brand, description, fragrance_notes, size, price_ngn, stock_quantity, image_url, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $perfumes = [
                [
                    'id' => 14,
                    'name' => "Al Faris (Arabiyat)",
                    'brand' => "Arabiyat by My Perfumes",
                    'description' => "An aristocratic, noble oriental fragrance celebrating chivalry and charisma. Opens with sparkling iced citrus and invigorating herbal zest, unfolding into a rich heart of spices, golden amber, patchouli, and noble agarwood (oud). Presented in a magnificent midnight flacon crowned with a silver equestrian emblem.",
                    'fragrance_notes' => "Top: Italian Bergamot, Crisp Apple, Fresh Citrus | Heart: Aromatic Spices, Lavender, Geranium | Base: Warm Golden Amber, Patchouli, Noble Oud, White Musk",
                    'size' => "100ml Eau de Parfum (3.4 Fl. Oz.)",
                    'price_ngn' => 18000,
                    'stock_quantity' => 20,
                    'image_url' => "./media/al_faris_arabiyat_perfume.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 1,
                    'name' => "Queen of Arabia (Luxury Gift Set)",
                    'brand' => "Lattafa Pride",
                    'description' => "An opulent royal Arabian gift set crafted with imperial distinction. Featuring rich notes of velvety Damask rose, warm golden amber, regal agarwood (oud), and sweet bourbon vanilla. Comes complete with a luxury 100ml flacon, travel miniature, pocket atomizer, and perfumed spray.",
                    'fragrance_notes' => "Top: Sweet Bergamot, Royal Saffron | Heart: Taif Rose, Golden Amber, Incense | Base: Madagascar Vanilla, Royal Oud, Cashmere Musk",
                    'size' => "4-Piece Luxury Gift Set",
                    'price_ngn' => 60000,
                    'stock_quantity' => 12,
                    'image_url' => "./media/lattafa_queen_of_arabia_gift_set.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 2,
                    'name' => "Liquid Brun",
                    'brand' => "French Avenue",
                    'description' => "A decadent, modern gourmand masterpiece. Liquid Brun delivers a rich, seductive aura of roasted cinnamon, caramelized praline, smooth bourbon vanilla, and spiced tonka bean over a creamy amberwood foundation.",
                    'fragrance_notes' => "Top: Cinnamon Bark, Spiced Orange, Nutmeg | Heart: Praline Caramel, Dates, Tonka Bean | Base: Bourbon Vanilla, Benzoin, Akigalawood, Amber",
                    'size' => "50ml Eau de Parfum",
                    'price_ngn' => 10000,
                    'stock_quantity' => 18,
                    'image_url' => "./media/liquid_brun_french_avenue.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 3,
                    'name' => "Lattafa Angham & Qaa'ed Intense (Date Night)",
                    'brand' => "Lattafa Parfums",
                    'description' => "The quintessential 'Date Night' luxury duo. Lattafa Angham brings sweet melodic notes of candied ginger, white floral petals, praline, and silky vanilla, while Qaa'ed Intense delivers smoldering roasted tobacco, rich cinnamon, honeyed amber, and smooth patchouli in a serpent-crowned flacon.",
                    'fragrance_notes' => "Angham: Candied Ginger, Mandarin, Jasmine, Vanilla, Amber | Qaa'ed Intense: Cinnamon, Nutmeg, Roasted Tobacco, Honey Amber, Vanilla",
                    'size' => "100ml Both (Set of 2 Flacons)",
                    'price_ngn' => 85000,
                    'stock_quantity' => 15,
                    'image_url' => "./media/lattafa_angham_qaaed_intense_date_night.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 4,
                    'name' => "Khamrah Waha & Musamam Black Intense",
                    'brand' => "Lattafa Parfums",
                    'description' => "A dramatic contrast of crystalline aquatic freshness and intoxicating dark leather intensity. Khamrah Waha opens with sparkling oceanic breezes, candied dates, and spiced praline, while Musamam Black Intense captivates with smoked leather, dark amber, black pepper, and sensual saffron enveloped by a sculpted 3D serpent flacon.",
                    'fragrance_notes' => "Khamrah: Aquatic Amber, Cardamom, Praline, Vanilla | Musamam: Saffron, Italian Bergamot, Smoked Leather, Akigalawood, Dark Olibanum",
                    'size' => "100ml Luxury Flacon",
                    'price_ngn' => 19000,
                    'stock_quantity' => 16,
                    'image_url' => "./media/lattafa_khamrah_musamam_black_intense.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 5,
                    'name' => "Club de Nuit Intense Man & Affection Love",
                    'brand' => "Armaf & Amazon Pride",
                    'description' => "An iconic duo of legendary masculine seduction and sweet romantic allure. Club de Nuit Intense Man brings world-famous smoky pineapple, birch, and blackcurrant, while Affection Love enchants with sweet spun sugar, delicate jasmine, and creamy vanilla.",
                    'fragrance_notes' => "Club de Nuit: Lemon, Blackcurrant, Apple, Birch, Ambergris | Affection Love: Sweet Berries, Jasmine Sambac, Marshmallow Vanilla, Tonka",
                    'size' => "105ml + 55ml Fragrance Pair",
                    'price_ngn' => 15000,
                    'stock_quantity' => 14,
                    'image_url' => "./media/club_de_nuit_intense_affection_love.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 6,
                    'name' => "Just Oud & Wood",
                    'brand' => "RRP / Fragrance World",
                    'description' => "An authentic, deep woody-oriental elixir celebrating noble woods and resinous agarwood. Just Oud & Wood delivers a rich, commanding scent trail of smokey sandalwood, dark vetiver, cardamom, and warm amberwood crafted for lovers of distinguished, long-lasting fragrances.",
                    'fragrance_notes' => "Top: Rosewood, Cardamom, Chinese Pepper | Heart: Rare Oud Wood, Sandalwood, Vetiver | Base: Tonka Bean, Vanilla, Golden Amber",
                    'size' => "100ml Eau de Parfum (3.4 Fl. Oz.)",
                    'price_ngn' => 26000,
                    'stock_quantity' => 20,
                    'image_url' => "./media/just_oud_and_wood.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 7,
                    'name' => "Rage by Rave",
                    'brand' => "Rave (Lattafa House)",
                    'description' => "An energetic, magnetic aromatic fragrance with undeniable confidence. Rage by Rave explodes with fresh iced citrus, crushed mint, aromatic sage, and crisp green apple, melting into a powerful base of cedarwood, tonka bean, and sensual ambroxan.",
                    'fragrance_notes' => "Top: Crisp Green Apple, Iced Bergamot, Mint | Heart: Lavender, Clary Sage, Geranium | Base: Virginia Cedar, Tonka Bean, Ambroxan, White Musk",
                    'size' => "100ml Eau de Parfum",
                    'price_ngn' => 36000,
                    'stock_quantity' => 22,
                    'image_url' => "./media/rave_rage_eau_de_parfum.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 8,
                    'name' => "X5 Men – Pure Black",
                    'brand' => "X5 Men Parfums",
                    'description' => "A bold, charismatic, and intensely masculine signature. X5 Men Pure Black captures immediate attention with opening notes of black pepper, iced bergamot, aromatic lavender, and dark cedarwood wrapped in smoky leather and amber.",
                    'fragrance_notes' => "Top: Crushed Black Pepper, Italian Bergamot | Heart: French Lavender, Cardamom, Clary Sage | Base: Smoked Cedar, Vetiver, Dark Leather, Warm Ambergris",
                    'size' => "100ml Eau de Parfum (80% Vol)",
                    'price_ngn' => 15000,
                    'stock_quantity' => 25,
                    'image_url' => "./media/x5_men_pure_black.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 9,
                    'name' => "Rayhaan Floriana & Bade'e Al Oud Sublime",
                    'brand' => "Rayhaan & Lattafa (Duo Set)",
                    'description' => "An intoxicating harmony of feminine floral radiance and oriental opulence. Rayhaan Floriana unfolds with sparkling nectarine, star jasmine, and soft white musk, while Bade'e Al Oud Sublime enchants with sweet crisp apple, juicy plum, velvet rose, and smoky sweet oud.",
                    'fragrance_notes' => "Floriana: Juicy Nectar, Jasmine Sambac, White Amber | Sublime: Crisp Apple, Wild Plum, Moss, Sweet Woods, Patchouli",
                    'size' => "2x 100ml (Both Flacons Set)",
                    'price_ngn' => 17000,
                    'stock_quantity' => 10,
                    'image_url' => "./media/rayhaan_floriana_badee_al_oud_sublime.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 10,
                    'name' => "Khamrah Waha & Freeze Crystal Duo",
                    'brand' => "Lattafa & Freeze",
                    'description' => "A refreshing crystalline and aquatic sensation. Khamrah Waha blends invigorating marine breezes with sparkling citrus, cool cardamom, and sweet amber, while Freeze delivers an ultra-crisp shock of frosty mint, iced bergamot, and pure crystalline musk.",
                    'fragrance_notes' => "Top: Iced Bergamot, Frosted Mint, Marine Notes | Heart: Aquatic Jasmine, Cool Cardamom, White Lily | Base: Crystal Amber, Tonka Bean, Driftwood, Transparent Musk",
                    'size' => "2x 100ml Crystal Aqua Duo",
                    'price_ngn' => 17000,
                    'stock_quantity' => 14,
                    'image_url' => "./media/khamrah_waha_freeze_collection.jpg",
                    'is_featured' => 1,
                ],
                [
                    'id' => 11,
                    'name' => "Rayhaan Floriana (Pour Femme)",
                    'brand' => "Rayhaan",
                    'description' => "A luminous, graceful fragrance created for the modern woman of elegance. Radiant with fresh citrus blossoms, blooming jasmine petals, sweet peach nectar, and a delicate amber drydown.",
                    'fragrance_notes' => "Top: Peach Blossom, Blood Orange | Heart: Jasmine Petals, Heliotrope | Base: Soft Ambergris, Madagascar Vanilla, Sandalwood",
                    'size' => "100ml Eau de Parfum",
                    'price_ngn' => 14500,
                    'stock_quantity' => 16,
                    'image_url' => "./media/rayhaan_floriana_badee_al_oud_sublime.jpg",
                    'is_featured' => 0,
                ],
                [
                    'id' => 12,
                    'name' => "Bade'e Al Oud – Sublime (Red Edition)",
                    'brand' => "Lattafa",
                    'description' => "A show-stopping, viral creation renowned for its juicy red fruits, sweet spun sugar, smooth moss, and tender oud heart. Regal flacon adorned with exquisite golden geometric latticework.",
                    'fragrance_notes' => "Top: Crisp Green Apple, Lychee, Rose | Heart: Red Plum, Jasmine, Osmanthus | Base: Sweet Vanilla, Patchouli, Moss, Velvet Oud",
                    'size' => "100ml Eau de Parfum",
                    'price_ngn' => 15500,
                    'stock_quantity' => 15,
                    'image_url' => "./media/rayhaan_floriana_badee_al_oud_sublime.jpg",
                    'is_featured' => 0,
                ],
                [
                    'id' => 13,
                    'name' => "Khamrah Waha (Aqua Edition)",
                    'brand' => "Lattafa",
                    'description' => "The coveted aquatic interpretation of the iconic Khamrah profile. Faceted crystal flacon holding a turquoise-blue elixir with spiced citrus, aromatic resins, and ocean mist.",
                    'fragrance_notes' => "Top: Cardamom, Bergamot, Sea Breeze | Heart: Praline, Dates, Tuberose | Base: Tonka Bean, Benzoin, Akigalawood, Amber",
                    'size' => "100ml Eau de Parfum",
                    'price_ngn' => 16000,
                    'stock_quantity' => 20,
                    'image_url' => "./media/khamrah_waha_freeze_collection.jpg",
                    'is_featured' => 0,
                ],
            ];

            foreach ($perfumes as $p) {
                $insertPerfume->execute([
                    $p['id'],
                    $p['name'],
                    $p['brand'],
                    $p['description'],
                    $p['fragrance_notes'],
                    $p['size'],
                    $p['price_ngn'],
                    $p['stock_quantity'],
                    $p['image_url'],
                    $p['is_featured'],
                ]);
            }
            echo "Seeded " . count($perfumes) . " perfume products.\n";
        }

        // 4. Gallery Items
        $galleryCount = (int) $pdo->query('SELECT COUNT(*) FROM gallery_items')->fetchColumn();
        if ($galleryCount === 0) {
            $insertGallery = $pdo->prepare("
                INSERT INTO gallery_items (title, category, media_type, media_url, description, display_order)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $galleryItems = [
                [
                    'title' => "Wispy Volume Lash Artistry & Flutter",
                    'category' => "Lash Extensions",
                    'media_type' => "video",
                    'media_url' => "./media/mira_lash_video_1.mp4",
                    'description' => "Lightweight, multidimensional lash fans tailored to enhance eye shape with fluttery elegance and natural volume.",
                    'display_order' => 1,
                ],
                [
                    'title' => "Deluxe Classic & Hybrid Eyelash Glow",
                    'category' => "Lash Extensions",
                    'media_type' => "video",
                    'media_url' => "./media/mira_lash_video_2.mp4",
                    'description' => "Custom-curled, long-lasting eyelash extensions designed to accentuate natural eye contours with effortless grace.",
                    'display_order' => 2,
                ],
                [
                    'title' => "Precision Scalp-Care Knotless Braids",
                    'category' => "Hair Braiding",
                    'media_type' => "video",
                    'media_url' => "./media/mira_hair_braids_video_6.mp4",
                    'description' => "Clean geometric square partings, lightweight braiding hair, and healthy scalp oil finish for all-day comfort.",
                    'display_order' => 3,
                ],
                [
                    'title' => "Protective Feed-In Cornrow & Braid Artistry",
                    'category' => "Hair Braiding",
                    'media_type' => "video",
                    'media_url' => "./media/mira_hair_braids_video_7.mp4",
                    'description' => "Masterful cornrow styling celebrating cultural grace, edge protection, and effortless everyday wear.",
                    'display_order' => 4,
                ],
                [
                    'title' => "Master Sculpted Gel & Acrylic Nail Artistry",
                    'category' => "Nails & Art",
                    'media_type' => "video",
                    'media_url' => "./media/mira_nails_video_1.mp4",
                    'description' => "Pristine nail shaping, high-gloss gel topcoat, and expert cuticle care for luxury hand rejuvenation.",
                    'display_order' => 5,
                ],
                [
                    'title' => "Signature Knotless Bohemian Braids",
                    'category' => "Hair Braiding",
                    'media_type' => "video",
                    'media_url' => "./media/mira_hair_braids_video_1.mp4",
                    'description' => "Featherlight, painless knotless braids accented with soft cascading bohemian curls. Gentle on the scalp with natural movement.",
                    'display_order' => 6,
                ],
                [
                    'title' => "Flawless Waist-Length Knotless Plaits",
                    'category' => "Hair Braiding",
                    'media_type' => "video",
                    'media_url' => "./media/mira_hair_braids_video_2.mp4",
                    'description' => "Precision square partings, ultra-clean edges, and zero-tension braiding down to waist length. Finished with nourishing scalp oil.",
                    'display_order' => 7,
                ],
                [
                    'title' => "Signature Bohemian Island Curl Braids",
                    'category' => "Hair Braiding",
                    'media_type' => "image",
                    'media_url' => "./media/mira_hair_boho_curls_portrait.jpg",
                    'description' => "Styled right inside Mira's Beauty Touch salon in Owerri, this hairstyle combines gentle, painless knotless scalp parting with bouncy, silky-soft bohemian island curls. Designed to keep your natural hairline protected while offering effortless glamour, hydration, and natural movement for every occasion.",
                    'display_order' => 8,
                ],
                [
                    'title' => "Sculpted Stitch Cornrows & Dual High Buns",
                    'category' => "Hair Braiding",
                    'media_type' => "image",
                    'media_url' => "./media/mira_hair_stitch_cornrows_buns.jpg",
                    'description' => "Crafted with immaculate precision, these stitch cornrows feature clean geometric lines that flow seamlessly into two sleek braided buns. Perfect for formal celebrations, weddings, and everyday elegance. Created with tension-free parting to maintain scalp wellness and healthy edges.",
                    'display_order' => 9,
                ],
                [
                    'title' => "S-Wave Curved Cornrows & Bouncy Spiral Curls",
                    'category' => "Hair Braiding",
                    'media_type' => "image",
                    'media_url' => "./media/mira_hair_wave_cornrows_curled_ends.jpg",
                    'description' => "A show-stopping blend of intricate artistry and luxury texture. Featuring elegant wave-parted cornrows that cascade into voluminous, bouncy spiral curl ends, finished with gentle edge control styling. Lightweight, long-lasting, and tailored to frame the face with timeless grace.",
                    'display_order' => 10,
                ],
                [
                    'title' => "Mira’s Salon Hair Braiding Motion Showcase I",
                    'category' => "Hair Braiding",
                    'media_type' => "video",
                    'media_url' => "./media/mira_hair_braids_video_8.mp4",
                    'description' => "Experience the fluidity and lightweight grace of our hair styling at Mira’s Beauty Touch. Watch our specialized tension-free braiding in motion—featuring ultra-neat parting, lustrous finish, and comfortable all-day wear.",
                    'display_order' => 11,
                ],
                [
                    'title' => "Mira’s Salon Hair Braiding Motion Showcase II",
                    'category' => "Hair Braiding",
                    'media_type' => "video",
                    'media_url' => "./media/mira_hair_braids_video_9.mp4",
                    'description' => "An up-close look at our master braiding craftsmanship. Every plait is woven with precise tension control to protect the hair follicle, stimulate healthy growth, and give our clients confidence and royalty.",
                    'display_order' => 12,
                ],
                [
                    'title' => "Signature Sculpted Stiletto Nails & Art",
                    'category' => "Nails & Art",
                    'media_type' => "image",
                    'media_url' => "./media/mira_nails_stiletto.jpg",
                    'description' => "Stunning nail extensions, creative designs, and flawless glossy finishes. Expert nail and foot care for a polished, refreshed look.",
                    'display_order' => 13,
                ],
                [
                    'title' => "Mira’s Beauty Touch Salon & Scent Experience",
                    'category' => "Salon Showcase",
                    'media_type' => "video",
                    'media_url' => "./media/mira_salon_scent_experience.mp4",
                    'description' => "Step inside our salon sanctuary where beauty meets elegance. Experience hair styling, manicure pampering, and our private luxury perfume bar.",
                    'display_order' => 99,
                ],
            ];

            foreach ($galleryItems as $g) {
                $insertGallery->execute([
                    $g['title'],
                    $g['category'],
                    $g['media_type'],
                    $g['media_url'],
                    $g['description'],
                    $g['display_order'],
                ]);
            }
            echo "Seeded " . count($galleryItems) . " authentic gallery items.\n";
        }

        // 5. Appointments & Notifications
        $aptCount = (int) $pdo->query('SELECT COUNT(*) FROM appointments')->fetchColumn();
        if ($aptCount === 0 && !empty($clientId)) {
            $insertApt = $pdo->prepare("
                INSERT INTO appointments (
                    booking_ref, user_id, service_id, service_name, stylist_name,
                    customer_name, customer_email, customer_phone, requested_date,
                    requested_time, confirmed_date_time, status, customer_notes, admin_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $insertApt->execute([
                'MBT-2026-A101',
                $clientId,
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
                'Approved! Looking forward to welcoming you.',
            ]);

            $insertApt->execute([
                'MBT-2026-P202',
                $clientId,
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
                null,
            ]);

            $insertNotif = $pdo->prepare("
                INSERT INTO notifications (user_id, type, title, message, appointment_id, is_read)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $insertNotif->execute([
                $clientId,
                'appointment_approved',
                'Appointment Approved 🎉',
                'Your Mira’s Beauty Touch appointment has been approved. Your confirmed appointment is scheduled for 2026-11-05 at 10:00 AM.',
                1,
                0,
            ]);

            $insertNotif->execute([
                $clientId,
                'system',
                'Appointment Request Submitted',
                'Your booking request for "Deluxe Spa Pedicure & Scrub" on 2026-11-12 at 02:00 PM has been submitted (Ref: MBT-2026-P202). It is currently pending salon administrator approval.',
                2,
                1,
            ]);

            echo "Seeded demo client appointments & notifications.\n";
        }

        // 6. Site Settings
        $settingsCount = (int) $pdo->query('SELECT COUNT(*) FROM site_settings')->fetchColumn();
        if ($settingsCount === 0) {
            $insertSetting = $pdo->prepare("INSERT INTO site_settings (key, value) VALUES (?, ?)");
            $defaultSettings = [
                ['brand_name', "Mira's Beauty Touch"],
                ['tagline', "Where Beauty Meets Elegance"],
                ['phone', "+234 903 727 6804"],
                ['whatsapp', "+2349037276804"],
                ['email', "mirabeautytouch@gmail.com"],
                ['address', "Imo Paradise, Amawire, Orji, Owerri, Imo State, Nigeria"],
                ['hours_weekdays', "Monday – Saturday: 9:00 AM – 7:30 PM"],
                ['hours_sunday', "Sunday: 1:00 PM – 6:00 PM (By Appointment)"],
            ];

            foreach ($defaultSettings as [$k, $v]) {
                $insertSetting->execute([$k, $v]);
            }
            echo "Seeded site settings.\n";
        }

        echo "PHP Database seeding complete!\n";
    }
}

