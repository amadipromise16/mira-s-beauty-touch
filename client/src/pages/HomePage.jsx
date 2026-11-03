import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { initialPerfumesData } from '../data/perfumesData';
import { 
  Sparkles, Star, Calendar, Heart, ArrowRight, Play, 
  CheckCircle, ShieldCheck, Gem, Flame, ChevronRight 
} from 'lucide-react';

export function HomePage({ onNavigate, onSelectServiceForBooking }) {
  const { user, openAuth } = useAuth();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredPerfumes, setFeaturedPerfumes] = useState(initialPerfumesData.slice(0, 3));
  const [recentGallery, setRecentGallery] = useState([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    // Load services, perfumes, and gallery
    api.services.getAll().then(res => setFeaturedServices(res.services?.slice(0, 4) || [])).catch(() => {});
    api.perfumes.getAll({ featured: 'true' }).then(res => setFeaturedPerfumes(res.perfumes?.slice(0, 3) || [])).catch(() => {});
    api.gallery.getAll().then(res => setRecentGallery(res.gallery?.slice(0, 4) || [])).catch(() => {});
  }, []);

  const handleLike = async (itemId) => {
    if (!user) {
      openAuth('login');
      return;
    }
    try {
      const res = await api.gallery.toggleLike(itemId);
      setRecentGallery(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, liked: res.liked, user_has_liked: res.liked, like_count: res.like_count }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION (Matching Image 1 Royal Palace Reference) */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#1C1311] via-[#241715] to-[#1A1110] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Text & CTA (Matching Image 1 Reference) */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#32201C] border border-[#644237] text-[#E6C687] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
                <span>👑 WELCOME TO MIRA’S BEAUTY PALACE</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.12]">
                  Where Beauty <br />
                  <span className="italic font-display font-medium text-[#E6C687]">Meets Royalty</span>
                </h1>
                <p className="text-sm sm:text-base text-[#E5D5CB] font-medium leading-relaxed">
                  Your beauty. Your confidence. Your royal experience. Discover exceptional beauty care in the heart of Owerri.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#D1BEB4] max-w-xl leading-relaxed">
                  Welcome to <strong>Mira’s Beauty Touch</strong>, where every detail is designed to bring out the beauty in you! From gorgeous braids and flawless nails to glamorous makeup, stunning lashes, relaxing pedicures, and irresistible fragrances, we’ve got your beauty needs covered.
                </p>
                <p className="text-xs sm:text-sm text-[#E6C687] max-w-xl leading-relaxed italic border-l-2 border-[#B87D65] pl-3 py-0.5">
                  “At Mira’s Beauty Touch, we believe every woman deserves to look beautiful, feel confident, and radiate elegance.”
                </p>
              </div>

              {/* Action Buttons (Matching Image 1 Reference) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('book')}
                  className="px-7 py-3.5 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs tracking-wider uppercase shadow-warm-md hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3.5 rounded-full bg-[#2A1B17] hover:bg-[#38241F] text-[#FAF7F2] border border-[#7D5A4B] font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Explore Services
                </button>
              </div>

              {/* Social Proof Pill */}
              <div className="pt-2 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#32201C] flex items-center justify-center border border-[#644237] text-[#E6C687] shadow-warm-xs">
                  <Sparkles className="w-5 h-5 text-[#E6C687]" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E6C687] text-[#E6C687]" />
                    ))}
                    <span className="text-xs font-bold text-white ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-[11px] text-[#D1BEB4]">Mira’s Beauty Touch | Beauty • Elegance • Confidence</p>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Arch with Generated Royal Portrait (Matching Image 1) */}
            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <div className="relative mx-auto max-w-md">
                
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#B87D65]/40 to-[#E6C687]/20 rounded-full blur-2xl -z-10" />

                {/* Arched Hero Image with Generated Royal Portrait */}
                <div className="arch-top shadow-2xl border-4 border-[#3D2924] overflow-hidden bg-[#241715] aspect-[4/5] relative group">
                  <img
                    src="./media/mira_beauty_royalty_hero.jpg"
                    alt="Mira's Beauty Palace Royal Glamour & Braids"
                    style={{ filter: 'brightness(1.05) contrast(1.04)' }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Salon & Location Pill Overlay */}
                  <div className="absolute bottom-5 right-5 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-warm-md border border-white/15 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#32201C] flex items-center justify-center text-[#E6C687]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#E6C687] font-bold">📍 Owerri, Imo State</p>
                      <p className="text-xs font-serif font-bold text-white">Mira’s Beauty Palace</p>
                      <p className="text-[11px] font-semibold text-[#D8A48F]">Beauty • Elegance • Royalty</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Badge */}
                <div className="absolute -top-4 -left-4 bg-[#B87D65] text-white p-3.5 rounded-full shadow-warm-md hidden sm:block border-2 border-[#1C1311]">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. KEY SERVICES (The Palace Experience - 2x2 Grid on Mobile Matching Image 2 Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">The Palace Experience</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#2C2420] mt-1 font-normal">
              Beauty Services Fit for a Queen
            </h2>
            <p className="text-xs text-[#7A6B63] mt-2 max-w-xl">
              At Mira’s Beauty Touch, beauty is more than an appearance — it’s an expression of confidence, elegance, and individuality.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="mt-4 md:mt-0 text-xs font-semibold text-[#B87D65] hover:text-[#944E2E] flex items-center space-x-1 uppercase tracking-wider group"
          >
            <span>View All Services</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards (Visible as 2x2 on Mobile Phones Matching Image 2 Reference) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          
          {/* Card 1: Hair & Braiding (User Video) */}
          <div 
            onClick={() => onNavigate('services')}
            className="group cursor-pointer bg-white rounded-2xl p-2.5 sm:p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl sm:rounded-2xl h-40 sm:h-64 overflow-hidden bg-[#FAF5F0] mb-3 relative">
                <video
                  ref={(el) => {
                    if (el) {
                      el.defaultMuted = true;
                      el.muted = true;
                      el.setAttribute('playsinline', 'true');
                      el.setAttribute('webkit-playsinline', 'true');
                      el.play().catch(() => {});
                    }
                  }}
                  src="./media/mira_home_hair_braiding.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{ filter: 'brightness(1.28) contrast(1.08) saturate(1.06)' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[#944E2E] shadow-xs">
                  Hair & Braids
                </div>
              </div>
              <h3 className="font-serif text-sm sm:text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-tight">
                Hair & Braiding
              </h3>
              <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                Beautifully crafted, stylish, and protective hairstyles. Expert knotless braiding, bohemian plaits, and gentle scalp care.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#F2E5DC] pt-2">
              <span className="text-[11px] sm:text-xs font-bold text-[#B87D65]">From ₦10,000</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

          {/* Card 2: Nails & Pedicure */}
          <div 
            onClick={() => onNavigate('services')}
            className="group cursor-pointer bg-white rounded-2xl p-2.5 sm:p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl sm:rounded-2xl h-40 sm:h-64 overflow-hidden bg-[#FAF5F0] mb-3 relative">
                <img
                  src="./media/mira_nails_stiletto.jpg"
                  alt="Nail Care & Extensions"
                  loading="lazy"
                  style={{ filter: 'brightness(1.08) contrast(1.04)' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[#944E2E] shadow-xs">
                  Nails & Feet
                </div>
              </div>
              <h3 className="font-serif text-sm sm:text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-tight">
                Nails & Pedicure
              </h3>
              <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                Expert nail and foot care for a polished look, plus sculpted extensions, creative designs, and high-gloss finishes.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#F2E5DC] pt-2">
              <span className="text-[11px] sm:text-xs font-bold text-[#B87D65]">From ₦12,000</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

          {/* Card 3: Makeup & Lashes (User Video) */}
          <div 
            onClick={() => onNavigate('services')}
            className="group cursor-pointer bg-white rounded-2xl p-2.5 sm:p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl sm:rounded-2xl h-40 sm:h-64 overflow-hidden bg-[#FAF5F0] mb-3 relative">
                <video
                  ref={(el) => {
                    if (el) {
                      el.defaultMuted = true;
                      el.muted = true;
                      el.setAttribute('playsinline', 'true');
                      el.setAttribute('webkit-playsinline', 'true');
                      el.play().catch(() => {});
                    }
                  }}
                  src="./media/mira_home_makeup_lashes.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{ filter: 'brightness(1.28) contrast(1.08) saturate(1.06)' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[#944E2E] shadow-xs">
                  Glam & Lashes
                </div>
              </div>
              <h3 className="font-serif text-sm sm:text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-tight">
                Makeup & Lashes
              </h3>
              <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                Elegant makeup artistry for celebrations and everyday glamour, with gorgeous fluttery lash extensions.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#F2E5DC] pt-2">
              <span className="text-[11px] sm:text-xs font-bold text-[#B87D65]">From ₦6,000</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

          {/* Card 4: Perfumes & Beauty (Al Faris) */}
          <div 
            onClick={() => onNavigate('perfumes')}
            className="group cursor-pointer bg-white rounded-2xl p-2.5 sm:p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl sm:rounded-2xl h-40 sm:h-64 overflow-hidden bg-[#FAF5F0] mb-3 relative">
                <img
                  src="./media/al_faris_arabiyat_perfume.jpg"
                  alt="Al Faris by Arabiyat My Perfumes"
                  loading="lazy"
                  style={{ filter: 'brightness(1.12) contrast(1.05)' }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[#944E2E] shadow-xs">
                  Haute Fragrance
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="font-serif text-sm sm:text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-tight">
                  Perfumes & Beauty
                </h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#944E2E] truncate">
                  Al Faris (Arabiyat My Perfumes)
                </p>
              </div>
              <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                An aristocratic oriental fragrance blending fresh citrus, warm spices, golden amber, and noble oud.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#F2E5DC] pt-2">
              <span className="text-[11px] sm:text-xs font-bold text-[#B87D65]">From ₦18,000</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

        </div>

        {/* Palace Sanctuary Feature Banner (Matching Lower Card in Image 2 Reference) */}
        <div className="mt-8 sm:mt-12 rounded-3xl overflow-hidden bg-white border border-[#EBDCD4] shadow-warm-sm group">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src="./media/mira_palace_interior_hero.jpg"
              alt="Mira's Beauty Palace Sanctuary in Owerri"
              style={{ filter: 'brightness(1.05) contrast(1.03)' }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-white max-w-xl">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#FAD5C5] font-bold">
                Elegance in Every Detail
              </span>
              <h3 className="font-serif text-lg sm:text-3xl font-normal text-white mt-1">
                More Than a Salon, A Luxury Sanctuary
              </h3>
              <p className="text-xs text-[#F2D7CB] mt-1.5 hidden sm:block leading-relaxed">
                Step into our opulent salon sanctuary in the heart of Owerri, Imo State — crafted for your absolute comfort, privacy, and royal treatment.
              </p>
              <div className="mt-3 flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors shadow-warm-xs"
                >
                  Explore Sanctuary →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 5. PERFUME SHOP PREVIEW (Naira ₦ Pricing Spotlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">Haute Parfumerie</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] mt-1 font-normal">
            Exquisite Perfume Collection
          </h2>
          <p className="text-xs text-[#7A6B63] mt-2">
            A carefully selected collection of exquisite perfumes to complement your beauty and leave a lasting impression. All flacons priced in Nigerian Naira (₦).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="bg-white rounded-2xl p-5 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="rounded-xl overflow-hidden bg-[#FAF7F2] h-64 mb-4 relative">
                  <img
                    src={perfume.image_url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80'}
                    alt={perfume.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-[#B87D65] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {perfume.size}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#8E766B] font-semibold">{perfume.brand}</p>
                <h3 className="font-serif text-xl font-bold text-[#2C2420] mt-1">{perfume.name}</h3>
                <p className="text-xs text-[#7A6B63] mt-2 line-clamp-2">{perfume.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F2E5DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8E766B] block">Price</span>
                  <span className="text-base font-bold text-[#B87D65]">
                    ₦{perfume.price_ngn?.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('perfumes')}
                  className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#B87D65] text-[#2C2420] hover:text-white border border-[#DFC7B9] text-xs font-semibold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('perfumes')}
            className="px-8 py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F2E5DC] text-[#2C2420] border border-[#DFC7B9] text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            Explore Complete Fragrance Wardrobe →
          </button>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF4F0] rounded-3xl p-8 sm:p-12 border border-[#EBDCD4] shadow-warm-sm text-center space-y-4">
          <span className="inline-block p-2 rounded-full bg-[#F2E5DC] text-[#B87D65]">
            <Sparkles className="w-5 h-5" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] font-normal">
            💖 Mira’s Beauty Touch — Because You Deserve to Be Beautiful!
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
            Your destination for exceptional beauty and personal care. We specialize in professional hair braiding, manicures, pedicures, nail enhancements, makeup artistry, and eyelash extensions. We also offer an exquisite collection of perfumes to complete your signature look.
          </p>
          <p className="text-xs font-semibold text-[#944E2E] tracking-wider uppercase">
            Mira’s Beauty Touch — Enhancing Beauty, Inspiring Confidence.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('book')}
              className="px-8 py-3.5 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs tracking-wider uppercase shadow-warm-md transition-all transform hover:-translate-y-0.5"
            >
              Book Your Appointment Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

