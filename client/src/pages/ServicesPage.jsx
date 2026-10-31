import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sparkles, Clock, ArrowRight, Search } from 'lucide-react';

export function ServicesPage({ onBookService }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.services.getAll({
        category: selectedCategory,
        search: searchQuery
      });
      setServices(res.services || []);

      if (categories.length === 0) {
        const catRes = await api.services.getCategories();
        setCategories(catRes.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Title matching Image 1 Reference */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Mira’s Beauty Touch | Beauty • Elegance • Confidence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          EXPERIENCE MIRA’S: OUR SERVICES
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Your destination for exceptional beauty and personal care. We specialize in professional hair braiding, manicures, pedicures, nail enhancements, makeup artistry, and eyelash extensions. We also offer an exquisite collection of perfumes to complete your signature look.
        </p>
        <p className="text-xs font-semibold text-[#B87D65] uppercase tracking-wider">
          Mira’s Beauty Touch — Enhancing Beauty, Inspiring Confidence.
        </p>
      </div>

      {/* Category Pills Filter & Search Bar */}
      <div className="space-y-4">
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#8E766B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hair braiding, manicure, lashes, bridal..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] placeholder-[#9E8B81] focus:outline-none focus:border-[#B87D65] shadow-xs"
          />
        </div>

        {/* Category Filter Pills (matching reference image) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isSelected
                    ? 'bg-[#B87D65] text-white shadow-warm-sm'
                    : 'bg-white hover:bg-[#F2E5DC] text-[#5A4D45] border border-[#EBDCD4]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Services Grid (Matching Image 1 Reference) */}
      {loading ? (
        <div className="text-center py-24 text-xs text-[#8E766B]">Loading services catalogue...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBDCD4] p-8">
          <p className="text-sm font-semibold text-[#2C2420]">No services found matching your selection.</p>
          <p className="text-xs text-[#7A6B63] mt-1">Try another category or clear your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-5 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Service Image with rounded corners matching reference */}
                <div className="rounded-xl overflow-hidden bg-[#F4ECE6] h-56 mb-4 relative">
                  <img
                    src={service.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-[#944E2E] shadow-xs">
                    {service.category}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-[#8E766B] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#B87D65]" />
                  <span>Est. {service.duration_mins || 60} mins</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2C2420] group-hover:text-[#B87D65] transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs text-[#6E5D53] mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & CTA Button (Matching Reference: e.g. $85+ Learn More & Book) */}
              <div className="mt-6 pt-4 border-t border-[#F2E5DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E766B] block">Starting from</span>
                  <span className="text-lg font-bold text-[#B87D65]">
                    ₦{service.price_ngn?.toLocaleString()}+
                  </span>
                </div>

                <button
                  onClick={() => onBookService(service)}
                  className="px-4 py-2.5 rounded-xl bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold tracking-wider transition-colors shadow-warm-sm flex items-center space-x-1"
                >
                  <span>Learn More & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Booking Notice */}
      <div className="p-6 bg-[#F4ECE6] rounded-2xl border border-[#DFC7B9] text-center max-w-2xl mx-auto space-y-1">
        <p className="text-xs font-semibold text-[#2C2420]">
          Custom Bridal or Group Styling Packages?
        </p>
        <p className="text-[11px] text-[#7A6B63]">
          We also provide customized on-location bridal packages and event glam anywhere in Nigeria. Contact our team directly for a bespoke quote.
        </p>
      </div>

    </div>
  );
}

