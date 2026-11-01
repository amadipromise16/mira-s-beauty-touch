import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { initialGalleryData } from '../data/galleryData';
import { 
  Heart, Sparkles, Play, Pause, Volume2, VolumeX, Maximize2, 
  X, ChevronLeft, ChevronRight, Image as ImageIcon, Video, 
  Share2, Check, Eye, Calendar, Scissors, SunMedium 
} from 'lucide-react';

export function GalleryPage({ onNavigate, onBookService }) {
  const { user, openAuth } = useAuth();
  
  // Stored Likes in localStorage for instant offline & static GitHub Pages support
  const [localLikes, setLocalLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('mbt_gallery_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Gallery items state
  const [gallery, setGallery] = useState(() => {
    return initialGalleryData.map(item => ({
      ...item,
      user_has_liked: !!localLikes[item.id],
      like_count: item.like_count + (localLikes[item.id] ? 1 : 0)
    }));
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'video' | 'image'
  const [loading, setLoading] = useState(false);
  const [likingId, setLikingId] = useState(null);

  // Lightbox Modal State
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalVideoPlaying, setModalVideoPlaying] = useState(true);
  const [modalVideoMuted, setModalVideoMuted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const modalVideoRef = useRef(null);

  const categories = [
    'All',
    'Salon Showcase',
    'Hair Braiding',
    'Nails & Art',
    'Makeup Artistry',
    'Lash Extensions',
    'Perfume Curation'
  ];

  // Persist local likes
  useEffect(() => {
    try {
      localStorage.setItem('mbt_gallery_likes', JSON.stringify(localLikes));
    } catch (e) {
      console.error(e);
    }
  }, [localLikes]);

  // Try fetching dynamic gallery items if backend API is connected
  useEffect(() => {
    let isMounted = true;
    api.gallery.getAll({
      category: selectedCategory,
      type: selectedType
    }).then(res => {
      if (isMounted && res && res.gallery && res.gallery.length > 0) {
        // Merge API data with local like states
        const merged = res.gallery.map(item => {
          const matchingInit = initialGalleryData.find(i => i.id === item.id || i.title === item.title);
          const isLiked = !!localLikes[item.id] || item.user_has_liked;
          return {
            ...item,
            hair_style_name: item.hair_style_name || matchingInit?.hair_style_name,
            hair_summary: item.hair_summary || matchingInit?.hair_summary,
            booking_service: item.booking_service || matchingInit?.booking_service,
            user_has_liked: isLiked,
            like_count: item.like_count + (localLikes[item.id] && !item.user_has_liked ? 1 : 0)
          };
        });
        setGallery(merged);
      }
    }).catch(() => {
      // Retain initialGalleryData with local filters
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedType, user]);

  // Filter gallery items locally
  const filteredGallery = gallery.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.media_type === selectedType;
    return matchesCategory && matchesType;
  });

  // Handle Like Toggle with instant optimistic feedback
  const handleLikeToggle = async (itemId, e) => {
    if (e) e.stopPropagation();

    const currentlyLiked = !!localLikes[itemId];
    const newLiked = !currentlyLiked;

    // Update local state immediately
    setLocalLikes(prev => {
      const next = { ...prev };
      if (newLiked) {
        next[itemId] = true;
      } else {
        delete next[itemId];
      }
      return next;
    });

    setGallery(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              user_has_liked: newLiked,
              like_count: newLiked ? item.like_count + 1 : Math.max(0, item.like_count - 1)
            }
          : item
      )
    );

    if (activeModalItem && activeModalItem.id === itemId) {
      setActiveModalItem(prev => ({
        ...prev,
        user_has_liked: newLiked,
        like_count: newLiked ? prev.like_count + 1 : Math.max(0, prev.like_count - 1)
      }));
    }

    // If backend is active and user logged in, sync with server
    if (user) {
      try {
        await api.gallery.toggleLike(itemId);
      } catch (err) {
        console.warn('API like sync note:', err.message);
      }
    }
  };

  // Handle Booking Look Directly from Video or Photo Card
  const handleBookLook = (item, e) => {
    if (e) e.stopPropagation();

    const serviceToBook = item.booking_service || {
      id: item.id,
      name: item.hair_style_name || item.title,
      category: item.category,
      price_ngn: 25000,
      duration_mins: 180,
      description: item.hair_summary || item.description
    };

    if (activeModalItem) {
      closeModal();
    }

    if (onBookService) {
      onBookService(serviceToBook);
    } else if (onNavigate) {
      onNavigate('book');
    } else {
      window.location.hash = 'book';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lightbox Navigation
  const openModal = (item) => {
    setActiveModalItem(item);
    setModalVideoPlaying(true);
    setModalVideoMuted(false);
  };

  const closeModal = () => {
    setActiveModalItem(null);
    setCopiedLink(false);
  };

  const navigateModal = (direction) => {
    if (!activeModalItem) return;
    const currentIndex = filteredGallery.findIndex(i => i.id === activeModalItem.id);
    if (currentIndex === -1) return;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= filteredGallery.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = filteredGallery.length - 1;

    setActiveModalItem(filteredGallery[nextIndex]);
    setModalVideoPlaying(true);
    setCopiedLink(false);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModalItem) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') navigateModal('next');
      if (e.key === 'ArrowLeft') navigateModal('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem, filteredGallery]);

  const handleShare = (item, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const videoItemsCount = gallery.filter(i => i.media_type === 'video').length;
  const photoItemsCount = gallery.filter(i => i.media_type === 'image').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Title & Clean Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Mira’s Visual Portfolio • Hair & Salon Artistry</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          THE ARTISTRY GALLERY
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Watch our high-definition hair braiding videos, protective styling transformations, sculpted nails, and luxury scent experience. Click any video to view in brightened cinema clarity, show your appreciation with a like, or book an appointment for that exact hairstyle.
        </p>
      </div>

      {/* Clean Filter Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBDCD4] shadow-warm-sm space-y-4">
        
        {/* Top row: Media type switcher & Bright Mode Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#F4ECE6] pb-3.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedType('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedType === 'All'
                  ? 'bg-[#B87D65] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5A4D45] hover:bg-[#F2E5DC]'
              }`}
            >
              All Artistry ({gallery.length})
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                selectedType === 'video'
                  ? 'bg-[#B87D65] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5A4D45] hover:bg-[#F2E5DC]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Salon Videos ({videoItemsCount})</span>
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                selectedType === 'image'
                  ? 'bg-[#B87D65] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5A4D45] hover:bg-[#F2E5DC]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({photoItemsCount})</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#8E766B] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#DFC7B9]/60">
            <SunMedium className="w-3.5 h-3.5 text-[#B87D65]" />
            <span>Enhanced Bright Cinema Clarity</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#2C2420] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6E5D53] hover:bg-[#F2E5DC]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="text-center py-28 text-xs text-[#8E766B] space-y-2">
          <Sparkles className="w-6 h-6 text-[#B87D65] animate-spin-slow mx-auto" />
          <p>Loading curated gallery portfolio...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EBDCD4] p-8 space-y-2">
          <p className="text-sm font-semibold text-[#2C2420]">No media found for this selection.</p>
          <p className="text-xs text-[#7A6B63]">Try resetting your filter or choosing All Artistry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredGallery.map((item) => {
            const isVideo = item.media_type === 'video';
            const isHair = item.category === 'Hair Braiding';

            return (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Media Frame with Brightening Filter */}
                  <div className="relative aspect-[4/3] bg-[#1E1714] overflow-hidden">
                    {isVideo ? (
                      <video
                        src={item.media_url}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={{
                          filter: 'brightness(1.22) contrast(1.06) saturate(1.05)'
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onMouseEnter={(e) => {
                          try { e.target.play(); } catch (_) {}
                        }}
                        onMouseLeave={(e) => {
                          try { e.target.pause(); } catch (_) {}
                        }}
                      />
                    ) : (
                      <img
                        src={item.media_url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}

                    {/* Gentle gradient overlay (kept light so videos stay bright) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-40 group-hover:opacity-15 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="bg-white/95 backdrop-blur-md text-[#944E2E] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        {item.category}
                      </span>

                      {isVideo ? (
                        <span className="bg-[#B87D65] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <Play className="w-3 h-3 fill-white" />
                          <span>HD Video</span>
                        </span>
                      ) : (
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>Photo</span>
                        </span>
                      )}
                    </div>

                    {/* Center Play Icon for Video */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-13 h-13 rounded-full bg-white/95 backdrop-blur-md text-[#B87D65] flex items-center justify-center shadow-warm-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Quick view indicator on photo hover */}
                    {!isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md text-[#2C2420] flex items-center justify-center shadow-warm-md">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Hairstyle Details */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[#6E5D53] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Hairstyle Specific Highlight (Say about the hair just a little) */}
                    {isHair && (
                      <div className="bg-[#FAF4F0] rounded-2xl p-3 border border-[#F2E5DC] text-[11px] text-[#6E5D53] space-y-1.5">
                        <div className="flex items-center space-x-1.5 text-[#944E2E] font-bold uppercase tracking-wider text-[10px]">
                          <Scissors className="w-3 h-3 text-[#B87D65]" />
                          <span>Hairstyle Artistry</span>
                        </div>
                        <p className="leading-relaxed text-[#5A4D45]">
                          {item.hair_summary || "Painless scalp-friendly parting, lightweight bounce, and clean protective finish."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer: Like Button & Book This Look */}
                <div className="px-5 py-3.5 bg-[#FAF7F2]/90 border-t border-[#F2E5DC] space-y-2.5">
                  <div className="flex items-center justify-between">
                    
                    {/* Interactive Like System */}
                    <button
                      onClick={(e) => handleLikeToggle(item.id, e)}
                      disabled={likingId === item.id}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        item.user_has_liked
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                          : 'bg-white text-[#5A4D45] hover:bg-rose-50 hover:text-rose-500 border border-[#DFC7B9]'
                      }`}
                      title={item.user_has_liked ? 'Liked! Click to unlike' : 'Like this look'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                          item.user_has_liked ? 'fill-rose-500 text-rose-500' : 'text-[#8E766B]'
                        }`}
                      />
                      <span>
                        {item.like_count} {item.like_count === 1 ? 'like' : 'likes'}
                      </span>
                    </button>

                    {/* View Cinema indicator */}
                    <span className="text-[11px] font-medium text-[#8E766B] group-hover:text-[#B87D65] transition-colors flex items-center space-x-1">
                      <span>Cinema HD</span>
                      <span>→</span>
                    </span>
                  </div>

                  {/* Primary "Book This Hairstyle" Button under each card */}
                  <button
                    onClick={(e) => handleBookLook(item, e)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow-warm-sm transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-white/90" />
                    <span>{isHair ? 'Book This Hairstyle' : 'Book This Look'}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CINEMA LIGHTBOX MODAL WITH BRIGHTENED HD VIDEO */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          
          {/* Top Bar Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F2E5DC] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                {activeModalItem.category}
              </span>
              <span className="text-xs text-white/70 hidden sm:inline flex items-center space-x-1">
                <SunMedium className="w-3.5 h-3.5 text-amber-300" />
                <span>Enhanced HD Cinema Mode</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleShare(activeModalItem, e)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                title="Copy share link"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              </button>

              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Left Arrow Navigation */}
          <button
            onClick={() => navigateModal('prev')}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors z-20"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Navigation */}
          <button
            onClick={() => navigateModal('next')}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors z-20"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div className="w-full max-w-4xl bg-[#1C1613] rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col z-10 max-h-[92vh]">
            
            {/* Media Display Area */}
            <div className="relative bg-black flex items-center justify-center flex-1 min-h-[300px] sm:min-h-[460px] max-h-[64vh] overflow-hidden">
              {activeModalItem.media_type === 'video' ? (
                <video
                  ref={modalVideoRef}
                  src={activeModalItem.media_url}
                  autoPlay
                  controls
                  playsInline
                  style={{
                    filter: 'brightness(1.22) contrast(1.06) saturate(1.05)'
                  }}
                  className="w-full h-full max-h-[64vh] object-contain"
                />
              ) : (
                <img
                  src={activeModalItem.media_url}
                  alt={activeModalItem.title}
                  className="w-full h-full max-h-[64vh] object-contain"
                />
              )}
            </div>

            {/* Bottom Meta, Hairstyle Description & Booking Action Bar */}
            <div className="p-5 sm:p-6 bg-[#241D19] border-t border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {activeModalItem.title}
                  </h3>
                </div>
                {activeModalItem.hair_summary && (
                  <p className="text-xs text-[#E8D4C8] leading-relaxed">
                    ✨ {activeModalItem.hair_summary}
                  </p>
                )}
                {activeModalItem.description && !activeModalItem.hair_summary && (
                  <p className="text-xs text-[#DFC7B9] leading-relaxed">
                    {activeModalItem.description}
                  </p>
                )}
              </div>

              {/* Action Buttons: Like + Book This Look */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={(e) => handleLikeToggle(activeModalItem.id, e)}
                  disabled={likingId === activeModalItem.id}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-warm-sm transition-all ${
                    activeModalItem.user_has_liked
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      activeModalItem.user_has_liked ? 'fill-white text-white' : 'text-white'
                    }`}
                  />
                  <span>
                    {activeModalItem.like_count} {activeModalItem.like_count === 1 ? 'Like' : 'Likes'}
                  </span>
                </button>

                <button
                  onClick={(e) => handleBookLook(activeModalItem, e)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold uppercase tracking-wider shadow-warm-md transition-all"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>
                    {activeModalItem.category === 'Hair Braiding' ? 'Book This Hairstyle' : 'Book This Look'}
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Bottom Booking Invitation */}
      <div className="bg-[#FAF4F0] rounded-3xl p-8 border border-[#EBDCD4] shadow-warm-sm text-center space-y-3">
        <Sparkles className="w-8 h-8 text-[#B87D65] mx-auto" />
        <h3 className="font-serif text-2xl text-[#2C2420] font-normal">
          Love What You See?
        </h3>
        <p className="text-xs text-[#7A6B63] max-w-md mx-auto">
          Reserve your appointment with our master braiders and stylists today. Every service includes certified care, scalp nourishment, and pure elegance.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('book');
              } else {
                window.location.hash = 'book';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="inline-block px-7 py-3 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs uppercase tracking-wider shadow-warm-sm transition-all"
          >
            Book An Appointment Now
          </button>
        </div>
      </div>

    </div>
  );
}
