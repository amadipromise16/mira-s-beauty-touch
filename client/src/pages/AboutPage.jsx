import React from 'react';
import { Sparkles, Heart, ShieldCheck, Award, Users, CheckCircle2 } from 'lucide-react';

export function AboutPage({ onNavigate }) {
  const teamMembers = [
    {
      name: "Mira Johnson",
      role: "Founder & Creative Director",
      bio: "Master hair stylist, aesthetic visionary, and certified scent curator dedicated to elevating beauty in Nigeria.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Sarah K.",
      role: "Senior Braiding Artisan",
      bio: "Master of tension-free knotless braiding, intricate Fulani cornrows, and protective styling.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Maria R.",
      role: "Master Nail Technician",
      bio: "Specialist in sculpted acrylics, Gel-X extensions, Russian cuticle care, and bespoke 3D nail art.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Chloe A.",
      role: "Senior Makeup & Lash Artist",
      bio: "Bridal glam specialist and certified lash technician crafting flawless complexion finishes.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "David W.",
      role: "Hair Care & Styling Specialist",
      bio: "Expert in scalp rejuvenation, hair treatments, precision trimming, and texture preservation.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Elena P.",
      role: "Wellness & Fragrance Consultant",
      bio: "Passionate perfumer and spa therapist providing 1-on-1 bespoke scent profile consultations.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title Header matching Image 3 Reference */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E5DC] text-[#944E2E] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B87D65]" />
          <span>Mira’s Beauty Touch | Beauty • Elegance • Confidence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2420] font-normal uppercase tracking-wide">
          MIRA’S BEAUTY TOUCH – WHERE BEAUTY MEETS ELEGANCE
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6B63] max-w-2xl mx-auto leading-relaxed">
          Mira’s Beauty Touch is a premier beauty salon dedicated to enhancing your natural beauty with elegance, style, and exceptional care.
        </p>
      </div>

      {/* 2-Column Hero: Interior + Founder (Matching Image 3 Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Salon Sanctuary Imagery */}
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
              At Mira’s Beauty Touch, beauty is more than an appearance — it’s an expression of confidence, elegance, and individuality. We believe every woman deserves to look beautiful, feel confident, and radiate elegance.
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

        {/* Right Column: Founder Profile Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD4] shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="rounded-2xl overflow-hidden bg-[#FAF7F2] h-64 mb-5 border border-[#F2E5DC]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Founder Mira"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#B87D65] font-bold">
              Founder & Creative Director
            </span>
            <h3 className="font-serif text-2xl text-[#2C2420] font-bold mt-1">
              Mira Johnson
            </h3>
            <p className="text-xs text-[#6E5D53] mt-3 leading-relaxed">
              “Welcome to Mira’s Beauty Touch, where every detail is designed to bring out the beauty in you! From gorgeous braids and flawless nails to glamorous makeup, stunning lashes, relaxing pedicures, and irresistible fragrances, we’ve got your beauty needs covered.”
            </p>
            <p className="text-xs text-[#B87D65] font-semibold mt-2.5">
              ✨ LOOK BEAUTIFUL. FEEL CONFIDENT. SHINE EFFORTLESSLY. ✨
            </p>
            <p className="text-xs text-[#6E5D53] mt-2 leading-relaxed">
              Our passion is to help every client look radiant, feel confident, and leave with a touch of elegance.
            </p>
          </div>

          <div className="pt-6 border-t border-[#F2E5DC] mt-4 flex items-center justify-between">
            <span className="font-serif italic text-xs text-[#8E766B]">
              Mira’s Beauty Touch — Your Beauty, Our Passion. Your Elegance, Our Signature.
            </span>
            <button
              onClick={() => onNavigate('book')}
              className="px-4 py-2 bg-[#B87D65] hover:bg-[#A36B53] text-white text-xs font-semibold rounded-full shadow-warm-sm transition-colors shrink-0 ml-2"
            >
              Book With Us
            </button>
          </div>
        </div>

      </div>

      {/* Certified & Passionate Experts Grid (Matching Image 3 Reference) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">The Team</span>
          <h2 className="font-serif text-3xl text-[#2C2420] font-normal uppercase tracking-wide mt-1">
            CERTIFIED & PASSIONATE EXPERTS
          </h2>
          <p className="text-xs text-[#7A6B63] mt-1">
            Our talented artisans bring years of mastery, tenderness, and modern technique to every appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-[#EBDCD4] shadow-warm-sm hover:shadow-warm-md transition-all text-center flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden bg-[#FAF7F2] mb-4 border-2 border-[#DFC7B9] p-0.5">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">{member.name}</h4>
              <p className="text-xs font-semibold text-[#B87D65] mt-0.5 uppercase tracking-wider">{member.role}</p>
              <p className="text-xs text-[#6E5D53] mt-2.5 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Mira Difference (3 Columns matching Image 3 Reference) */}
      <section className="bg-[#FAF4F0] rounded-3xl p-8 sm:p-12 border border-[#EBDCD4] shadow-warm-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B87D65]">Our Pillars</span>
          <h2 className="font-serif text-3xl text-[#2C2420] font-normal uppercase tracking-wide mt-1">
            THE MIRA’S DIFFERENCE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-warm-sm flex items-center justify-center text-[#B87D65] mx-auto border border-[#EBDCD4]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C2420]">Beauty • Elegance • Confidence</h4>
            <p className="text-xs text-[#6E5D53] leading-relaxed">
              Your destination for exceptional beauty and personal care. We specialize in professional hair braiding, manicures, pedicures, nail enhancements, makeup artistry, and eyelash extensions.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-warm-sm flex items-center justify-center text-[#B87D65] mx-auto border border-[#EBDCD4]">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C2420]">Where Beauty Meets Elegance</h4>
            <p className="text-xs text-[#6E5D53] leading-relaxed">
              At Mira’s Beauty Touch, beauty is more than an appearance — it’s an expression of confidence, elegance, and individuality. We also offer an exquisite collection of perfumes to complete your signature look.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-warm-sm flex items-center justify-center text-[#B87D65] mx-auto border border-[#EBDCD4]">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2C2420]">Because You Deserve to Be Beautiful!</h4>
            <p className="text-xs text-[#6E5D53] leading-relaxed">
              💖 Mira’s Beauty Touch — Because You Deserve to Be Beautiful! At Mira’s Beauty Touch, we believe every woman deserves to look beautiful, feel confident, and radiate elegance.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

