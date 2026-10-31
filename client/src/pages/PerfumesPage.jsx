import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sparkles, MessageCircle, Phone, Search, SlidersHorizontal, Check } from 'lucide-react';

export function PerfumesPage() {
  const [perfumes, setPerfumes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [selectedPerfumeForModal, setSelectedPerfumeForModal] = useState(null);

  useEffect(() => {
    fetchPerfumes();
  }, [selectedBrand, searchQuery, sortOption]);

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await api.perfumes.getAll({
        brand: selectedBrand,
        search: searchQuery,
        sort: sortOption
      });
      setPerfumes(res.perfumes || []);

      if (brands.length === 0) {
        const brandRes = await api.perfumes.getBrands();
        setBrands(brandRes.brands || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = (perfume) => {
    const phone = '2348031234567';
    const text = encodeURIComponent(
      `Hello Mira’s Beauty Touch, I am interested in inquiring about or purchasing "${perfume.name}" (${perfume.brand}, ${perfume.size}) priced at ₦${perfume.price_ngn?.toLocaleString()}. Please let me know how to proceed with delivery/pickup in Nigeria.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Haute Parfumerie & Scent Wardrobe</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          THE PERFUME BOUTIQUE
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Complement your beauty with exquisite flacons and intoxicating blends. Browse our luxury fragrance house collections, all presented in Nigerian Naira (₦).
        </p>
      </div>

      {/* Notice / Business Policy Banner */}
      <div className="p-4 bg-[#F2E5DC]/60 border border-[#DFC7B9] rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A4D45] gap-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-[#B87D65] text-white rounded-full shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span>
            <strong>Boutique Ordering:</strong> Browse our scent catalogue below. Order arrangements, instant dispatch, and private scent consultations are coordinated directly via WhatsApp or Phone.
          </span>
        </div>
        <a
          href="https://wa.me/2348031234567?text=Hello%20Mira's%20Beauty%20Touch,%20I%20have%20an%20inquiry%20about%20your%20perfumes."
          target="_blank"
          rel="noreferrer"
          className="shrink-0 px-4 py-1.5 bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold rounded-full shadow-warm-sm flex items-center space-x-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Direct Concierge</span>
        </a>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#8E766B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by scent note, name, or brand..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] placeholder-[#9E8B81] focus:outline-none focus:border-[#B87D65]"
          />
        </div>

        {/* Brand Filter & Sort Options */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
          >
            <option value="All">All Fragrance Lines</option>
            {brands.filter(b => b !== 'All').map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65]"
          >
            <option value="featured">Featured / Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name (A–Z)</option>
          </select>

        </div>
      </div>

      {/* Perfume Product Grid */}
      {loading ? (
        <div className="text-center py-24 text-xs text-[#8E766B]">Loading boutique flacons...</div>
      ) : perfumes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBDCD4] p-8">
          <p className="text-sm font-semibold text-[#2C2420]">No fragrances match your filter criteria.</p>
          <p className="text-xs text-[#7A6B63] mt-1">Try resetting the search or exploring all lines.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {perfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="bg-white rounded-2xl p-5 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Flacon Image */}
                <div 
                  onClick={() => setSelectedPerfumeForModal(perfume)}
                  className="rounded-xl overflow-hidden bg-[#FAF7F2] h-64 mb-4 relative cursor-pointer"
                >
                  <img
                    src={perfume.image_url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
                    alt={perfume.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full text-[#944E2E] shadow-xs">
                    {perfume.size}
                  </div>
                  {perfume.is_featured === 1 && (
                    <div className="absolute top-3 left-3 bg-[#B87D65] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                      House Favorite
                    </div>
                  )}
                </div>

                <p className="text-[10px] uppercase tracking-widest text-[#8E766B] font-semibold">
                  {perfume.brand}
                </p>

                <h3 
                  onClick={() => setSelectedPerfumeForModal(perfume)}
                  className="font-serif text-xl font-bold text-[#2C2420] mt-1 group-hover:text-[#B87D65] cursor-pointer transition-colors"
                >
                  {perfume.name}
                </h3>

                <p className="text-xs text-[#6E5D53] mt-2 line-clamp-2 leading-relaxed">
                  {perfume.description}
                </p>

                {perfume.fragrance_notes && (
                  <div className="mt-3 p-2.5 bg-[#FAF7F2] rounded-lg border border-[#F2E5DC] text-[11px] text-[#5A4D45]">
                    <span className="font-semibold text-[#944E2E] block text-[10px] uppercase tracking-wider">
                      Olfactory Pyramid:
                    </span>
                    <span className="line-clamp-2">{perfume.fragrance_notes}</span>
                  </div>
                )}
              </div>

              {/* Price and Inquiry actions */}
              <div className="mt-6 pt-4 border-t border-[#F2E5DC] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8E766B] block">Price</span>
                    <span className="text-xl font-bold text-[#B87D65]">
                      ₦{perfume.price_ngn?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    In Stock ({perfume.stock_quantity || 10})
                  </span>
                </div>

                {/* WhatsApp Order Arrangement Button */}
                <button
                  onClick={() => handleWhatsAppInquiry(perfume)}
                  className="w-full py-2.5 px-4 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-xl shadow-warm-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire / Order via WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Detailed Perfume Modal */}
      {selectedPerfumeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-xl shadow-2xl border border-[#EBDCD4] overflow-hidden relative">
            <button
              onClick={() => setSelectedPerfumeForModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white text-[#7A6B63] hover:text-[#2C2420] shadow z-10"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-white relative">
                <img
                  src={selectedPerfumeForModal.image_url}
                  alt={selectedPerfumeForModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8E766B] font-bold">
                    {selectedPerfumeForModal.brand}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
                    {selectedPerfumeForModal.name}
                  </h3>
                  <p className="text-lg font-bold text-[#B87D65] mt-1">
                    ₦{selectedPerfumeForModal.price_ngn?.toLocaleString()}
                  </p>
                  <span className="inline-block mt-1 text-[11px] bg-[#F2E5DC] text-[#944E2E] px-2 py-0.5 rounded font-medium">
                    {selectedPerfumeForModal.size}
                  </span>

                  <p className="text-xs text-[#5A4D45] mt-3 leading-relaxed">
                    {selectedPerfumeForModal.description}
                  </p>

                  {selectedPerfumeForModal.fragrance_notes && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-[#DFC7B9] text-xs space-y-1">
                      <p className="font-semibold text-[#944E2E] text-[10px] uppercase tracking-wider">Fragrance Notes:</p>
                      <p className="text-[#5A4D45] text-[11px] leading-relaxed">
                        {selectedPerfumeForModal.fragrance_notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleWhatsAppInquiry(selectedPerfumeForModal);
                      setSelectedPerfumeForModal(null);
                    }}
                    className="w-full py-3 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-xl shadow-warm-sm flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire / Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

