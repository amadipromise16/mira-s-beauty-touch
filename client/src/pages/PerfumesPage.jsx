import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { initialPerfumesData } from '../data/perfumesData';
import { 
  Sparkles, MessageCircle, ShoppingBag, Plus, Minus, Trash2, 
  ArrowRight, Check, X, Search, SlidersHorizontal, Eye, ShieldCheck, Truck 
} from 'lucide-react';

export function PerfumesPage() {
  const [perfumes, setPerfumes] = useState(initialPerfumesData);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [selectedPerfumeForModal, setSelectedPerfumeForModal] = useState(null);
  const [addedItemNotification, setAddedItemNotification] = useState(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mbt_perfume_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mbt_perfume_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Try fetching dynamic perfumes from API if backend server is active
  useEffect(() => {
    api.perfumes.getAll({
      brand: selectedBrand,
      search: searchQuery,
      sort: sortOption
    }).then(res => {
      if (res && res.perfumes && res.perfumes.length > 0) {
        setPerfumes(res.perfumes);
      }
    }).catch(() => {
      // Fallback to initialPerfumesData
    });
  }, [selectedBrand, searchQuery, sortOption]);

  // Derived Brands
  const availableBrands = ['All', ...new Set(initialPerfumesData.map(p => p.brand))];

  // Filter & Sort
  const filteredPerfumes = perfumes.filter(p => {
    const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      (p.fragrance_notes && p.fragrance_notes.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query));
    return matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'price_asc') return a.price_ngn - b.price_ngn;
    if (sortOption === 'price_desc') return b.price_ngn - a.price_ngn;
    if (sortOption === 'name') return a.name.localeCompare(b.name);
    return (b.is_featured || 0) - (a.is_featured || 0);
  });

  // Cart calculations
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + (item.price_ngn * item.quantity), 0);

  // Cart Actions
  const addToCart = (perfume) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === perfume.id);
      if (existing) {
        return prev.map(item =>
          item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });

    // Provide immediate user feedback and open cart sidebar
    setAddedItemNotification(perfume.name);
    setIsCartOpen(true);
    setTimeout(() => {
      setAddedItemNotification(null);
    }, 2800);
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // WhatsApp Inquiry for a single perfume
  const handleSingleWhatsAppInquiry = (perfume) => {
    const phone = '2349037276804';
    const text = encodeURIComponent(
      `Hello Mira’s Beauty Touch, I am inquiring about "${perfume.name}" (${perfume.brand}, ${perfume.size}) priced at ₦${perfume.price_ngn?.toLocaleString()}.\n\nPlease let me know if it is currently available for dispatch in Nigeria.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // WhatsApp Order for full cart
  const handleCartWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const phone = '2349037276804';
    
    let itemsText = cart.map((item, idx) => 
      `${idx + 1}. ${item.name} (${item.brand}) - Qty: ${item.quantity} × ₦${item.price_ngn.toLocaleString()} = ₦${(item.price_ngn * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `✨ *MIRA’S BEAUTY TOUCH — PERFUME ORDER* ✨\n\nHello, I would like to place an order for the following perfumes in my cart:\n\n${itemsText}\n\n*Total Items:* ${totalCartCount}\n*Total Amount:* ₦${totalCartAmount.toLocaleString()}\n\nPlease confirm availability and delivery payment details. Thank you!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative min-h-screen pb-20">
      
      {/* Toast Notification for Item Added */}
      {addedItemNotification && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C2420] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#DFC7B9] flex items-center space-x-3 animate-fade-in">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Added to Cart!</p>
            <p className="text-[11px] text-[#DFC7B9]">{addedItemNotification}</p>
          </div>
        </div>
      )}

      {/* Floating Side-of-Page Cart Trigger Pill */}
      <div className="fixed right-4 sm:right-6 bottom-6 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center space-x-3 px-5 py-3.5 bg-[#944E2E] hover:bg-[#7D3F23] text-white rounded-full shadow-2xl border-2 border-[#FAF7F2] transition-all transform hover:scale-105 active:scale-95 group"
          title="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#944E2E]">
                {totalCartCount}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#F2E5DC]">
              {totalCartCount} {totalCartCount === 1 ? 'Perfume' : 'Perfumes'}
            </p>
            <p className="text-xs font-extrabold text-white">
              ₦{totalCartAmount.toLocaleString()}
            </p>
          </div>
          <span className="hidden sm:inline-block pl-1 text-xs text-[#F2E5DC] font-semibold group-hover:translate-x-0.5 transition-transform">
            View Cart →
          </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
            <span>Haute Parfumerie & Scent Wardrobe</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
            THE PERFUME BOUTIQUE
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
            A carefully selected collection of exquisite perfumes to complement your beauty and leave a lasting impression. Add directly to your cart or inquire instantly via WhatsApp in Nigerian Naira (₦).
          </p>
        </div>

        {/* Feature & WhatsApp Direct Notice */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F2E5DC]/80 via-[#FAF7F2] to-[#F2E5DC]/80 border border-[#DFC7B9] rounded-3xl flex flex-col md:flex-row items-center justify-between text-xs text-[#5A4D45] gap-4 shadow-warm-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#B87D65] text-white rounded-2xl shrink-0 shadow-warm-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#2C2420]">
                Authentic Flacons & Nationwide Nigeria Delivery
              </p>
              <p className="text-[11px] text-[#7A6B63] mt-0.5">
                Add perfumes to your side cart to view totals, or use <strong>Inquire via WhatsApp</strong> beside any bottle for custom dispatch and fragrance recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#944E2E] border border-[#DFC7B9] font-bold rounded-full text-xs transition-colors flex items-center space-x-1.5 shadow-warm-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#B87D65]" />
              <span>Cart ({totalCartCount}) • ₦{totalCartAmount.toLocaleString()}</span>
            </button>
            <a
              href="https://wa.me/2349037276804?text=Hello%20Mira%E2%80%99s%20Beauty%20Touch%2C%20I%20have%20an%20inquiry%20about%20your%20perfumes."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full text-xs transition-colors flex items-center space-x-1.5 shadow-warm-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-[#8E766B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by perfume name, brand, or notes..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] placeholder-[#9E8B81] focus:outline-none focus:border-[#B87D65] shadow-warm-xs"
            />
          </div>

          {/* Brand Filter & Sort Options */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65] shadow-warm-xs"
            >
              <option value="All">All Brands & Houses</option>
              {availableBrands.filter(b => b !== 'All').map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#DFC7B9] rounded-full text-xs text-[#2C2420] focus:outline-none focus:border-[#B87D65] shadow-warm-xs"
            >
              <option value="featured">Featured / House Signature</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Perfume Products Grid */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EBDCD4] p-8 shadow-warm-xs space-y-3">
            <Sparkles className="w-8 h-8 text-[#B87D65] mx-auto opacity-70" />
            <p className="text-sm font-semibold text-[#2C2420]">No fragrances match your filter criteria.</p>
            <p className="text-xs text-[#7A6B63]">Try resetting your search query or choosing All Brands.</p>
            <button
              onClick={() => { setSelectedBrand('All'); setSearchQuery(''); }}
              className="px-5 py-2 bg-[#B87D65] text-white text-xs font-semibold rounded-full shadow-warm-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPerfumes.map((perfume) => {
              const inCartItem = cart.find(c => c.id === perfume.id);

              return (
                <div
                  key={perfume.id}
                  className="bg-white rounded-3xl p-5 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Flacon Image (Enhanced Brightness & Presentation) */}
                    <div 
                      onClick={() => setSelectedPerfumeForModal(perfume)}
                      className="rounded-2xl overflow-hidden bg-[#FAF7F2] h-72 mb-4 relative cursor-pointer border border-[#F2E5DC] group-hover:border-[#DFC7B9] transition-colors"
                    >
                      <img
                        src={perfume.image_url}
                        alt={perfume.name}
                        style={{ filter: 'brightness(1.08) contrast(1.05) saturate(1.04)' }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold px-3 py-1 rounded-full text-[#944E2E] shadow-warm-xs border border-[#DFC7B9]">
                        {perfume.size}
                      </div>

                      {perfume.is_featured === 1 && (
                        <div className="absolute top-3 left-3 bg-[#B87D65] text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-warm-xs">
                          House Signature
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Quick View</span>
                      </div>
                    </div>

                    {/* Brand */}
                    <p className="text-[10px] uppercase tracking-widest text-[#B87D65] font-bold">
                      {perfume.brand}
                    </p>

                    {/* Perfume Name */}
                    <h3 
                      onClick={() => setSelectedPerfumeForModal(perfume)}
                      className="font-serif text-xl font-bold text-[#2C2420] mt-1 group-hover:text-[#B87D65] cursor-pointer transition-colors"
                    >
                      {perfume.name}
                    </h3>

                    {/* Perfume Write-Up / Description */}
                    <p className="text-xs text-[#6E5D53] mt-2 line-clamp-3 leading-relaxed">
                      {perfume.description}
                    </p>

                    {/* Fragrance Notes */}
                    {perfume.fragrance_notes && (
                      <div className="mt-3 p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F2E5DC] text-[11px] text-[#5A4D45]">
                        <span className="font-bold text-[#944E2E] block text-[10px] uppercase tracking-wider mb-0.5">
                          Olfactory Notes:
                        </span>
                        <span className="line-clamp-2 leading-relaxed">{perfume.fragrance_notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-[#F2E5DC] space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#8E766B] font-semibold block">
                          Price (NGN)
                        </span>
                        <span className="text-xl font-bold text-[#944E2E]">
                          ₦{perfume.price_ngn?.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        In Stock ({perfume.stock_quantity || 15})
                      </span>
                    </div>

                    {/* Add to Cart & WhatsApp Inquiry Buttons Side by Side */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      
                      {/* ADD TO CART BUTTON */}
                      <button
                        onClick={() => addToCart(perfume)}
                        className={`w-full py-2.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-warm-xs ${
                          inCartItem
                            ? 'bg-[#2C2420] text-white hover:bg-[#3D332D]'
                            : 'bg-[#B87D65] hover:bg-[#A36B53] text-white'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{inCartItem ? `In Cart (${inCartItem.quantity})` : 'Add to Cart'}</span>
                      </button>

                      {/* INQUIRE VIA WHATSAPP BUTTON */}
                      <button
                        onClick={() => handleSingleWhatsAppInquiry(perfume)}
                        className="w-full py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-warm-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Inquire via WhatsApp</span>
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* SIDE-OF-THE-PAGE SHOPPING CART DRAWER / SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl border-l border-[#DFC7B9] flex flex-col justify-between">
              
              {/* Cart Drawer Header */}
              <div className="p-6 border-b border-[#DFC7B9] bg-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F2E5DC] flex items-center justify-center text-[#944E2E]">
                    <ShoppingBag className="w-4 h-4 text-[#B87D65]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                      Your Perfume Wardrobe
                    </h3>
                    <p className="text-[11px] text-[#7A6B63]">
                      {totalCartCount} {totalCartCount === 1 ? 'bottle selected' : 'bottles selected'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#7A6B63] hover:text-[#2C2420] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#F2E5DC] text-[#944E2E] flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8 text-[#B87D65]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#2C2420]">
                        Your cart is empty
                      </h4>
                      <p className="text-xs text-[#7A6B63] mt-1 max-w-xs mx-auto">
                        Explore our luxury perfume flacons and click "Add to Cart" to build your bespoke fragrance order.
                      </p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 border border-[#EBDCD4] shadow-warm-xs flex items-center space-x-3.5"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#F2E5DC]">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ filter: 'brightness(1.08) contrast(1.05)' }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Quantity Controls */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#B87D65] font-bold block truncate">
                          {item.brand}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#2C2420] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-[#944E2E] mt-0.5">
                          ₦{item.price_ngn?.toLocaleString()}
                        </p>

                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#F2E5DC] text-[#2C2420] border border-[#DFC7B9] flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#2C2420] w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#F2E5DC] text-[#2C2420] border border-[#DFC7B9] flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button & Line Total */}
                      <div className="text-right flex flex-col justify-between h-20 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9E8B81] hover:text-rose-600 transition-colors self-end"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <p className="text-xs font-bold text-[#2C2420]">
                          ₦{(item.price_ngn * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-[#DFC7B9] space-y-4">
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#7A6B63]">
                      <span>Bottles in Cart:</span>
                      <span className="font-semibold text-[#2C2420]">{totalCartCount} item(s)</span>
                    </div>
                    <div className="flex justify-between text-[#7A6B63]">
                      <span>Nationwide Delivery:</span>
                      <span className="text-emerald-700 font-medium">Coordinated via WhatsApp</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#2C2420] pt-2 border-t border-[#F2E5DC]">
                      <span>Total Amount:</span>
                      <span className="text-[#944E2E]">₦{totalCartAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Main WhatsApp Checkout Button */}
                  <button
                    onClick={handleCartWhatsAppOrder}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire & Order Cart via WhatsApp</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-[#8E766B] pt-1">
                    <button
                      onClick={clearCart}
                      className="hover:text-rose-600 hover:underline"
                    >
                      Clear Cart
                    </button>
                    <span>Instant dispatch confirmation</span>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Detailed Perfume Modal / Quick View */}
      {selectedPerfumeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-xl shadow-2xl border border-[#EBDCD4] overflow-hidden relative animate-fade-in">
            <button
              onClick={() => setSelectedPerfumeForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white text-[#7A6B63] hover:text-[#2C2420] shadow-md z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-72 md:h-full bg-white relative">
                <img
                  src={selectedPerfumeForModal.image_url}
                  alt={selectedPerfumeForModal.name}
                  style={{ filter: 'brightness(1.08) contrast(1.05)' }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#B87D65] font-bold">
                    {selectedPerfumeForModal.brand}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-[#2C2420] mt-0.5">
                    {selectedPerfumeForModal.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <p className="text-xl font-bold text-[#944E2E]">
                      ₦{selectedPerfumeForModal.price_ngn?.toLocaleString()}
                    </p>
                    <span className="text-[10px] bg-[#F2E5DC] text-[#944E2E] px-2 py-0.5 rounded-full font-bold">
                      {selectedPerfumeForModal.size}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A4D45] mt-3 leading-relaxed">
                    {selectedPerfumeForModal.description}
                  </p>

                  {selectedPerfumeForModal.fragrance_notes && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-[#DFC7B9] text-xs space-y-1">
                      <p className="font-bold text-[#944E2E] text-[10px] uppercase tracking-wider">
                        Fragrance Notes:
                      </p>
                      <p className="text-[#5A4D45] text-[11px] leading-relaxed">
                        {selectedPerfumeForModal.fragrance_notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      addToCart(selectedPerfumeForModal);
                      setSelectedPerfumeForModal(null);
                    }}
                    className="w-full py-3 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-xl shadow-warm-sm flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSingleWhatsAppInquiry(selectedPerfumeForModal);
                      setSelectedPerfumeForModal(null);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-warm-sm flex items-center justify-center space-x-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
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
