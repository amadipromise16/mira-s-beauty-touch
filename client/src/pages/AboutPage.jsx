import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function AboutPage({ onNavigate }) {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <span>Mira’s Beauty Touch | Beauty • Elegance • Confidence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          MIRA’S BEAUTY TOUCH, WHERE BEAUTY MEETS ELEGANCE
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Mira’s Beauty Touch is a premier beauty salon dedicated to enhancing your natural beauty with elegance, style, and exceptional care.
        </p>
      </div>

      {/* 2-Column Hero: Salon Sanctuary + Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Salon Sanctuary & Services */}
        <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EBDCD4] shadow-warm-sm flex flex-col justify-between">
          <div className="h-72 sm:h-80 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
              alt="Mira's Beauty Touch Salon Sanctuary"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-2xl text-[#2C2420] font-semibold">
              Where Beauty Meets Elegance
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5D53] leading-relaxed">
              At Mira’s Beauty Touch, beauty is more than an appearance, it’s an expression of confidence, elegance, and individuality. We believe every woman deserves to look beautiful, feel confident, and radiate elegance.
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#944E2E]">
              We offer a luxurious range of beauty services, including:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#5A4D45]">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B87D65] mt-0.5 shrink-0" />
                <span><strong>Hair Braiding:</strong> Beautifully crafted, stylish, and protective hairstyles.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B87D65] mt-0.5 shrink-0" />
                <span><strong>Manicures & Pedicures:</strong> Expert nail and foot care for a polished, refreshed look.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B87D65] mt-0.5 shrink-0" />
                <span><strong>Nail Enhancements:</strong> Stunning nail extensions, creative designs, and flawless finishes.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B87D65] mt-0.5 shrink-0" />
                <span><strong>Professional Makeup:</strong> Elegant makeup artistry for weddings, special occasions, and everyday glamour.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B87D65] mt-0.5 shrink-0" />
                <span><strong>Eyelash Extensions:</strong> Gorgeous lashes that enhance your natural beauty.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#B87D65] mt-0.5 shrink-0" />
                <span><strong>Luxury Perfumes:</strong> A delightful selection of captivating fragrances for every personality and occasion.</span>
              </li>
            </ul>
            <p className="text-xs text-[#8E766B] italic pt-2 border-t border-[#F2E5DC]">
              We also offer a carefully selected collection of exquisite perfumes to complement your beauty and leave a lasting impression.
            </p>
          </div>
        </div>

        {/* Right Column: Brand Sanctuary & Perfume Lounge */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD4] shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="rounded-2xl overflow-hidden bg-[#FAF7F2] h-64 mb-5 border border-[#F2E5DC] shadow-xs group">
              <img
                src="./media/mira_beauty_touch_salon_sanctuary.jpg"
                alt="Mira's Beauty Touch Salon Sanctuary"
                loading="lazy"
                style={{ filter: 'brightness(1.06) contrast(1.04)' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#B87D65] font-bold">
              Our Philosophy & Signature
            </span>
            <h3 className="font-serif text-2xl text-[#2C2420] font-bold mt-1">
              Your Beauty, Our Passion
            </h3>
            <p className="text-xs text-[#6E5D53] mt-3 leading-relaxed">
              Welcome to Mira’s Beauty Touch, where every detail is designed to bring out the beauty in you! From gorgeous braids and flawless nails to glamorous makeup, stunning lashes, relaxing pedicures, and irresistible fragrances, we’ve got your beauty needs covered.
            </p>
            <p className="text-xs text-[#B87D65] font-semibold mt-2.5 tracking-wider uppercase">
              LOOK BEAUTIFUL. FEEL CONFIDENT. SHINE EFFORTLESSLY.
            </p>
            <p className="text-xs text-[#6E5D53] mt-2 leading-relaxed">
              Our passion is to help every client look radiant, feel confident, and leave with a touch of elegance.
            </p>
          </div>

          <div className="pt-6 border-t border-[#F2E5DC] mt-4 flex items-center justify-between">
            <span className="font-serif italic text-xs text-[#8E766B]">
              Mira’s Beauty Touch, Your Beauty, Our Passion. Your Elegance, Our Signature.
            </span>
            <button
              onClick={() => onNavigate('book')}
              className="px-5 py-2.5 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-full shadow-warm-sm transition-colors shrink-0 ml-2"
            >
              Book Appointment
            </button>
          </div>
        </div>

      </div>

      {/* The Mira Difference (3 Columns with authentic photos) */}
      <section className="bg-[#FAF4F0] rounded-3xl p-8 sm:p-12 border border-[#EBDCD4] shadow-warm-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">Our Pillars</span>
          <h2 className="font-serif text-3xl text-[#2C2420] font-normal uppercase tracking-wide mt-1">
            THE MIRA’S DIFFERENCE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl p-5 shadow-warm-sm border border-[#EBDCD4] text-center space-y-3 group hover:border-[#B87D65] transition-all duration-300">
            <div className="h-48 rounded-xl overflow-hidden mb-3 border border-[#F2E5DC]">
              <img
                src="./media/mira_hair_boho_curls_portrait.jpg"
                alt="Hair Braiding Artistry"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C2420]">Beauty • Elegance • Confidence</h4>
            <p className="text-xs text-[#6E5D53] leading-relaxed">
              Your destination for exceptional beauty and personal care. We specialize in professional hair braiding, manicures, pedicures, nail enhancements, makeup artistry, and eyelash extensions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-warm-sm border border-[#EBDCD4] text-center space-y-3 group hover:border-[#B87D65] transition-all duration-300">
            <div className="h-48 rounded-xl overflow-hidden mb-3 border border-[#F2E5DC]">
              <img
                src="./media/lattafa_queen_of_arabia_gift_set.jpg"
                alt="Luxury Perfumes & Salon Elegance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C2420]">Where Beauty Meets Elegance</h4>
            <p className="text-xs text-[#6E5D53] leading-relaxed">
              At Mira’s Beauty Touch, beauty is more than an appearance, it’s an expression of confidence, elegance, and individuality. We also offer an exquisite collection of perfumes to complete your signature look.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-warm-sm border border-[#EBDCD4] text-center space-y-3 group hover:border-[#B87D65] transition-all duration-300">
            <div className="h-48 rounded-xl overflow-hidden mb-3 border border-[#F2E5DC]">
              <img
                src="./media/mira_nails_stiletto.jpg"
                alt="Nail Care & Beauty Sanctuary"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C2420]">Because You Deserve to Be Beautiful!</h4>
            <p className="text-xs text-[#6E5D53] leading-relaxed">
              At Mira’s Beauty Touch, we believe every woman deserves to look beautiful, feel confident, and radiate elegance.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
