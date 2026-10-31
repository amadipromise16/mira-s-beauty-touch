import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Star, Calendar, Heart, ArrowRight, Play, 
  CheckCircle, ShieldCheck, Gem, Flame, ChevronRight 
} from 'lucide-react';

export function HomePage({ onNavigate, onSelectServiceForBooking }) {
  const { user, openAuth } = useAuth();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredPerfumes, setFeaturedPerfumes] = useState([]);
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
      
      {/* 1. HERO SECTION (Matching Image 4 reference) */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#F7EFE9] via-[#FAF7F2] to-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
                <span>✨ LOOK BEAUTIFUL. FEEL CONFIDENT. SHINE EFFORTLESSLY. ✨</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2C2420] font-normal leading-[1.12]">
                Mira’s Beauty Touch <br />
                <span className="italic font-display font-medium text-[#B87D65]">Where Beauty Meets Elegance</span>
              </h1>

              <div className="space-y-3">
                <p className="text-base text-[#6E5D53] max-w-xl leading-relaxed">
                  Welcome to <strong>Mira’s Beauty Touch</strong>, where every detail is designed to bring out the beauty in you! From gorgeous braids and flawless nails to glamorous makeup, stunning lashes, relaxing pedicures, and irresistible fragrances, we’ve got your beauty needs covered.
                </p>
                <p className="text-xs sm:text-sm text-[#8E766B] max-w-xl leading-relaxed italic border-l-2 border-[#B87D65] pl-3 py-0.5">
                  “At Mira’s Beauty Touch, we believe every woman deserves to look beautiful, feel confident, and radiate elegance.”
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('book')}
                  className="px-7 py-3.5 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs tracking-wider uppercase shadow-warm-md hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>Book Your Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('perfumes')}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F2E5DC] text-[#2C2420] border border-[#DFC7B9] font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Explore Fragrances
                </button>
              </div>

              {/* Social Proof Pill */}
              <div className="pt-4 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Client" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Client" />
                  <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="Client" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B87D65] text-[#B87D65]" />
                    ))}
                    <span className="text-xs font-bold text-[#2C2420] ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-[11px] text-[#7A6B63]">Mira’s Beauty Touch | Beauty • Elegance • Confidence</p>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Arch (Matching Reference) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#DFC7B9]/40 to-[#F2E5DC]/80 rounded-full blur-2xl -z-10" />

                {/* Arched Hero Image */}
                <div className="arch-top shadow-warm-lg border-4 border-white overflow-hidden bg-[#EBDCD4] aspect-[4/5] relative group">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
                    alt="Mira's Beauty Touch Salon Styling"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Perfume Pill Overlay */}
                  <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-warm-md border border-[#F2E5DC] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4ECE6] flex items-center justify-center text-[#B87D65]">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8E766B] font-bold">Signature Fragrance</p>
                      <p className="text-xs font-serif font-bold text-[#2C2420]">L'Élixir de Mira</p>
                      <p className="text-[11px] font-semibold text-[#B87D65]">₦48,000</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Badge */}
                <div className="absolute -top-4 -left-4 bg-[#B87D65] text-white p-3.5 rounded-full shadow-warm-md hidden sm:block">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-[#EBDCD4] shadow-warm-sm">
          <div className="text-center p-3">
            <span className="text-2xl mb-1 block">✨</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">Hair Braiding</h4>
            <p className="text-[11px] text-[#7A6B63] mt-0.5">Beautifully crafted, stylish & protective</p>
          </div>
          <div className="text-center p-3">
            <span className="text-2xl mb-1 block">💅</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">Manicures & Pedicures</h4>
            <p className="text-[11px] text-[#7A6B63] mt-0.5">Polished, refreshed nail & foot care</p>
          </div>
          <div className="text-center p-3">
            <span className="text-2xl mb-1 block">💄</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">Makeup & Lashes</h4>
            <p className="text-[11px] text-[#7A6B63] mt-0.5">Flawless glam & gorgeous lash extensions</p>
          </div>
          <div className="text-center p-3">
            <span className="text-2xl mb-1 block">🌸</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2420]">Luxury Perfumes</h4>
            <p className="text-[11px] text-[#7A6B63] mt-0.5">Captivating scents priced in Naira (₦)</p>
          </div>
        </div>
      </section>

      {/* 3. KEY SERVICES (Arched Cards matching Image 4 Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">Our Services</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2420] mt-1 font-normal">
              A Luxurious Range of Beauty Services
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

        {/* 4 Arched Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Braids & Styling */}
          <div 
            onClick={() => onNavigate('services')}
            className="group cursor-pointer bg-white rounded-2xl p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300"
          >
            <div className="arch-top h-64 overflow-hidden bg-[#F4ECE6] mb-4">
              <img
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=700&q=80"
                alt="Hair Braiding"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors">
              Hair Braiding
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2">
              Beautifully crafted, stylish, and protective hairstyles for every occasion.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#B87D65]">From ₦15,000</span>
              <span className="text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

          {/* Card 2: Nails & Pedicure */}
          <div 
            onClick={() => onNavigate('services')}
            className="group cursor-pointer bg-white rounded-2xl p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300"
          >
            <div className="arch-top h-64 overflow-hidden bg-[#F4ECE6] mb-4">
              <img
                src="/media/mira_nails_stiletto.jpg"
                alt="Nail Care & Extensions"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors">
              Nails & Pedicures
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2">
              Expert nail and foot care for a polished, refreshed look, plus stunning nail extensions, creative designs, and flawless finishes.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#B87D65]">From ₦14,000</span>
              <span className="text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

          {/* Card 3: Makeup & Lashes */}
          <div 
            onClick={() => onNavigate('services')}
            className="group cursor-pointer bg-white rounded-2xl p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300"
          >
            <div className="arch-top h-64 overflow-hidden bg-[#F4ECE6] mb-4">
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80"
                alt="Makeup Artistry"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors">
              Makeup & Lashes
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2">
              Elegant makeup artistry for weddings, special occasions, and everyday glamour, with gorgeous lashes that enhance your natural beauty.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#B87D65]">From ₦20,000</span>
              <span className="text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

          {/* Card 4: Perfume Bar */}
          <div 
            onClick={() => onNavigate('perfumes')}
            className="group cursor-pointer bg-white rounded-2xl p-4 border border-[#EBDCD4] hover:shadow-warm-md transition-all duration-300"
          >
            <div className="arch-top h-64 overflow-hidden bg-[#F4ECE6] mb-4">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80"
                alt="Perfume Consultations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#2C2420] group-hover:text-[#B87D65] transition-colors">
              Luxury Perfumes
            </h3>
            <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2">
              A delightful selection of captivating fragrances for every personality and occasion to leave a lasting impression.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#B87D65]">From ₦15,000</span>
              <span className="text-[11px] font-semibold text-[#2C2420] group-hover:underline">Explore →</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. STORY & VIDEO SPOTLIGHT (Matching Reference Banner & Video from User) */}
      <section className="bg-gradient-to-r from-[#B87D65] to-[#A36B53] text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#F5DDD2] font-semibold">
                Where Beauty Meets Elegance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                Your Beauty, Our Passion. <br />
                <span className="italic font-display font-medium text-[#FAD5C5]">Your Elegance, Our Signature.</span>
              </h2>
              <p className="text-sm text-[#F5DDD2] leading-relaxed max-w-lg">
                At Mira’s Beauty Touch, beauty is more than an appearance — it’s an expression of confidence, elegance, and individuality. Our passion is to help every client look radiant, feel confident, and leave with a touch of elegance.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 rounded-full bg-white text-[#A36B53] hover:bg-[#FAF7F2] font-semibold text-xs tracking-wider uppercase transition-colors shadow-warm-sm"
                >
                  Our Story & Philosophy →
                </button>
              </div>
            </div>

            {/* Video Player Box / Modal Trigger */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/40 aspect-video group">
                <video
                  src="/media/mira_salon_scent_experience.mp4"
                  poster="/media/haute_perfume_flacon.jpg"
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-center text-[#F5DDD2] mt-2">
                ▶ Press play to watch our Mira’s Beauty Touch Salon & Perfume experience
              </p>
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

