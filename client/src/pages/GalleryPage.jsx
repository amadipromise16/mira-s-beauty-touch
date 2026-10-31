import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, Sparkles, Play, Pause, Volume2, VolumeX, Maximize2, 
  X, ChevronLeft, ChevronRight, Image as ImageIcon, Video, 
  Share2, Check, Eye 
} from 'lucide-react';

export function GalleryPage() {
  const { user, openAuth } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'video' | 'image'
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory, selectedType, user]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.gallery.getAll({
        category: selectedCategory,
        type: selectedType
      });
      setGallery(res.gallery || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (itemId, e) => {
    if (e) e.stopPropagation();

    if (!user) {
      openAuth('login');
      return;
    }

    if (likingId) return;
    setLikingId(itemId);

    try {
      const res = await api.gallery.toggleLike(itemId);
      setGallery(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, user_has_liked: res.liked, like_count: res.like_count }
            : item
        )
      );

      // If active in modal, update modal state too
      if (activeModalItem && activeModalItem.id === itemId) {
        setActiveModalItem(prev => ({
          ...prev,
          user_has_liked: res.liked,
          like_count: res.like_count
        }));
      }
    } catch (err) {
      console.error('Like toggle error', err);
    } finally {
      setLikingId(null);
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
    const currentIndex = gallery.findIndex(i => i.id === activeModalItem.id);
    if (currentIndex === -1) return;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= gallery.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = gallery.length - 1;

    setActiveModalItem(gallery[nextIndex]);
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
  }, [activeModalItem, gallery]);

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
          <span>Curated Visual Portfolio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          THE ARTISTRY GALLERY
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Immerse yourself in authentic salon videos, flawless protective braids, master nail transformations, and bridal glamour. Click any item to view in full cinema clarity or show your appreciation with a like.
        </p>
      </div>

      {/* Clean Filter Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EBDCD4] shadow-warm-sm space-y-4">
        
        {/* Top row: Media type switcher & stats */}
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

          <div className="text-[11px] text-[#8E766B] flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Click any item for full-screen cinema view</span>
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
      ) : gallery.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EBDCD4] p-8 space-y-2">
          <p className="text-sm font-semibold text-[#2C2420]">No media found for this selection.</p>
          <p className="text-xs text-[#7A6B63]">Try resetting your filter or choosing All Artistry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {gallery.map((item) => {
            const isVideo = item.media_type === 'video';
            return (
              <div
                key={item.id}
                onClick={() => openModal(item)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Media Frame */}
                  <div className="relative aspect-[4/3] bg-[#1E1714] overflow-hidden">
                    {isVideo ? (
                      <video
                        src={item.media_url}
                        muted
                        loop
                        playsInline
                        preload="metadata"
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="bg-white/90 backdrop-blur-md text-[#944E2E] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        {item.category}
                      </span>

                      {isVideo ? (
                        <span className="bg-[#B87D65] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <Play className="w-3 h-3 fill-white" />
                          <span>Video</span>
                        </span>
                      ) : (
                        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>Photo</span>
                        </span>
                      )}
                    </div>

                    {/* Center Play Icon for Video on Hover */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md text-[#B87D65] flex items-center justify-center shadow-warm-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Quick view indicator on photo hover */}
                    {!isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-[#2C2420] flex items-center justify-center shadow-warm-md">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-5 space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-[#2C2420] group-hover:text-[#B87D65] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-[#6E5D53] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer with Database-Backed Like System */}
                <div className="px-5 py-3.5 bg-[#FAF7F2]/80 border-t border-[#F2E5DC] flex items-center justify-between">
                  
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikeToggle(item.id, e)}
                    disabled={likingId === item.id}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      item.user_has_liked
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                        : 'bg-white text-[#5A4D45] hover:bg-rose-50 hover:text-rose-500 border border-[#DFC7B9]'
                    }`}
                    title={user ? (item.user_has_liked ? 'Unlike' : 'Like this style') : 'Sign in to like'}
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

                  <div className="flex items-center space-x-2 text-[11px] text-[#8E766B]">
                    <span className="hidden sm:inline font-medium group-hover:text-[#B87D65] transition-colors">
                      View Cinema →
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CINEMA LIGHTBOX MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          
          {/* Top Bar Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F2E5DC] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                {activeModalItem.category}
              </span>
              <span className="text-xs text-white/70 hidden sm:inline">
                {activeModalItem.media_type === 'video' ? 'Salon HD Video' : 'Artistry Photography'}
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
          <div className="w-full max-w-4xl bg-[#1C1613] rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col z-10 max-h-[90vh]">
            
            {/* Media Display Area */}
            <div className="relative bg-black flex items-center justify-center flex-1 min-h-[300px] sm:min-h-[460px] max-h-[65vh] overflow-hidden">
              {activeModalItem.media_type === 'video' ? (
                <video
                  ref={modalVideoRef}
                  src={activeModalItem.media_url}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full max-h-[65vh] object-contain"
                />
              ) : (
                <img
                  src={activeModalItem.media_url}
                  alt={activeModalItem.title}
                  className="w-full h-full max-h-[65vh] object-contain"
                />
              )}
            </div>

            {/* Bottom Meta & Like Bar */}
            <div className="p-5 sm:p-6 bg-[#241D19] border-t border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {activeModalItem.title}
                </h3>
                {activeModalItem.description && (
                  <p className="text-xs text-[#DFC7B9] leading-relaxed">
                    {activeModalItem.description}
                  </p>
                )}
              </div>

              {/* Interactive Like Action in Modal */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={(e) => handleLikeToggle(activeModalItem.id, e)}
                  disabled={likingId === activeModalItem.id}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-warm-sm transition-all ${
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

                {!user && (
                  <span className="text-[11px] text-[#DFC7B9]">
                    (Sign in to like)
                  </span>
                )}
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
          Reserve your appointment with our master stylists and nail technicians today.
        </p>
        <div className="pt-2">
          <a
            href="#book"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'book';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-block px-7 py-3 rounded-full bg-[#B87D65] hover:bg-[#A36B53] text-white font-semibold text-xs uppercase tracking-wider shadow-warm-sm transition-all"
          >
            Book This Style Now
          </a>
        </div>
      </div>

    </div>
  );
}
