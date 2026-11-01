import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { initialServicesData } from '../data/servicesData';
import { 
  Sparkles, Clock, ArrowRight, Search, Play, CheckCircle2, 
  MessageCircle, Info, Calendar, ShieldCheck, SunMedium 
} from 'lucide-react';

export function ServicesPage({ onBookService }) {
  const [services, setServices] = useState(initialServicesData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'All',
    'Nails & Foot Care',
    'Hair Braiding',
    'Eyelash Extensions',
    'Lash & Hair Combos',
    'Perfume Curation'
  ];

  // Try fetching dynamic services if backend is active
  useEffect(() => {
    let isMounted = true;
    api.services.getAll({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      search: searchQuery
    }).then(res => {
      if (isMounted && res && res.services && res.services.length > 0) {
        // Merge API services with our rich local details
        const merged = res.services.map(s => {
          const match = initialServicesData.find(init => init.id === s.id || init.name === s.name);
          return {
            ...match,
            ...s,
            image_url: match?.image_url || s.image_url,
            media_type: match?.media_type || (s.image_url?.endsWith('.mp4') ? 'video' : 'image'),
            perfume_details: match?.perfume_details || s.perfume_details,
            detailed_notes: match?.detailed_notes || s.detailed_notes
          };
        });
        setServices(merged);
      }
    }).catch(() => {
      // Keep initialServicesData fallback
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  // Local filter
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      (service.category && service.category.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppInquiry = (service) => {
    const phone = '2348149876543';
    const text = encodeURIComponent(
      `Hello Mira’s Beauty Touch, I am inquiring about "${service.name}" (${service.category}) priced at ₦${service.price_ngn?.toLocaleString()}. Please provide more information on availability and booking!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Title & Clean Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Mira’s Beauty Touch • Beauty • Elegance • Confidence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          OUR SALON SERVICES
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Discover our curated treatments spanning master nail artistry, deluxe pedicures, tension-free hair braiding, fluttery eyelash extensions, and luxury perfume flacons. Experience certified salon craftsmanship with elevated visual quality.
        </p>
      </div>

      {/* Category Pills Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBDCD4] shadow-warm-sm space-y-4">
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#8E766B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nail art, pedicure, braids, lash extensions, perfumes..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] placeholder-[#9E8B81] focus:outline-none focus:border-[#B87D65] focus:bg-white shadow-xs transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-[#F4ECE6]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isSelected
                    ? 'bg-[#B87D65] text-white shadow-warm-sm'
                    : 'bg-[#FAF7F2] hover:bg-[#F2E5DC] text-[#5A4D45] border border-[#EBDCD4]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Services Grid with Enhanced Quality Video & Photography */}
      {loading ? (
        <div className="text-center py-24 text-xs text-[#8E766B] space-y-2">
          <Sparkles className="w-6 h-6 text-[#B87D65] animate-spin-slow mx-auto" />
          <p>Loading curated salon treatments...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBDCD4] p-8 space-y-2">
          <p className="text-sm font-semibold text-[#2C2420]">No services found matching your selection.</p>
          <p className="text-xs text-[#7A6B63]">Try resetting your filter or searching another service keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const isVideo = service.media_type === 'video' || service.image_url?.endsWith('.mp4');
            const isPerfume = service.is_perfume || service.category === 'Perfume Curation';

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-5 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Media Frame with Brightness & Quality Enhancement */}
                  <div className="rounded-2xl overflow-hidden bg-[#FAF5F0] h-60 mb-4 relative border border-[#F2E5DC] shadow-xs">
                    {isVideo ? (
                      <video
                        src={service.image_url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={{
                          filter: 'brightness(1.28) contrast(1.08) saturate(1.06)'
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}

                    {/* Gradient Overlay (soft so media stays bright) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full text-[#944E2E] shadow-xs">
                      {service.category}
                    </div>

                    {/* Media Type Indicator */}
                    <div className="absolute top-3 right-3">
                      {isVideo ? (
                        <span className="bg-[#B87D65] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <Play className="w-3 h-3 fill-white" />
                          <span>HD Video</span>
                        </span>
                      ) : (
                        <span className="bg-white/90 backdrop-blur-md text-[#2C2420] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <SunMedium className="w-3 h-3 text-amber-500" />
                          <span>Pro Photo</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Duration & Highlights */}
                  <div className="flex items-center space-x-2 text-[11px] text-[#8E766B] mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B87D65]" />
                    <span>Est. {service.duration_mins || 60} mins</span>
                    {service.is_featured && (
                      <>
                        <span>•</span>
                        <span className="text-[#944E2E] font-semibold">Featured Salon Service</span>
                      </>
                    )}
                  </div>

                  {/* Service Title */}
                  <h3 className="font-serif text-xl font-bold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-snug">
                    {service.name}
                  </h3>

                  {/* Primary Description */}
                  <p className="text-xs text-[#6E5D53] mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Special Perfume Notes Under (For Item 3) */}
                  {isPerfume && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF4F0] border border-[#F2E5DC] space-y-2">
                      <div className="flex items-center space-x-1.5 text-[#944E2E] text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
                        <span>Perfume Name & Scent Notes:</span>
                      </div>
                      <p className="text-xs font-semibold text-[#2C2420]">
                        Armaf Club de Nuit Intense Man (105ml) & Amazon Pride Affection Love (55ml)
                      </p>
                      <div className="text-[11px] text-[#5A4D45] space-y-1 pt-1 border-t border-[#EBDCD4]">
                        <p><strong className="text-[#2C2420]">Club de Nuit:</strong> Smoky pineapple, blackcurrant, lemon, birch wood, and patchouli ambergris.</p>
                        <p><strong className="text-[#2C2420]">Affection Love:</strong> Sweet berries, spun marshmallow vanilla, night-blooming jasmine, and white musk.</p>
                      </div>
                    </div>
                  )}

                  {/* Detailed Professional Care Notes (Say more on them) */}
                  {!isPerfume && service.detailed_notes && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#DFC7B9]/70 text-[11px] text-[#5A4D45] flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#B87D65] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{service.detailed_notes}</span>
                    </div>
                  )}

                </div>

                {/* Price & Booking Actions */}
                <div className="mt-6 pt-4 border-t border-[#F2E5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8E766B] block">Price</span>
                    <span className="text-xl font-bold text-[#B87D65]">
                      ₦{service.price_ngn?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    {isPerfume ? (
                      <>
                        <button
                          onClick={() => handleWhatsAppInquiry(service)}
                          className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wide transition-colors shadow-xs flex items-center justify-center space-x-1.5"
                          title="Inquire & Order via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Order via WhatsApp</span>
                        </button>
                        <button
                          onClick={() => onBookService(service)}
                          className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold tracking-wide transition-colors shadow-xs flex items-center justify-center space-x-1"
                        >
                          <span>Scent Visit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onBookService(service)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-warm-sm flex items-center justify-center space-x-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book This Treatment</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Assurance Banner */}
      <div className="p-7 bg-[#FAF4F0] rounded-3xl border border-[#DFC7B9] text-center max-w-2xl mx-auto space-y-2 shadow-warm-sm">
        <Sparkles className="w-6 h-6 text-[#B87D65] mx-auto" />
        <h4 className="font-serif text-lg font-bold text-[#2C2420]">
          Custom Bridal or VIP Group Styling Packages?
        </h4>
        <p className="text-xs text-[#7A6B63] leading-relaxed">
          We provide customized on-location bridal packages, private salon sanctuary bookings, and event glam across Nigeria. Contact our concierge team directly for bespoke quotes.
        </p>
      </div>

    </div>
  );
}
