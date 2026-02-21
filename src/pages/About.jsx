import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';

const About = () => {
  const aboutImage = cld.image('AF1I5294_gu67ej');

  return (
    <div className="animate-fade-in opacity-0 min-h-[80vh] px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-16 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Image Section */}
        <div className="order-2 lg:order-1 flex justify-center">
          <div className="aspect-[4/5] bg-slate-100 w-[90%] md:w-[80%] lg:w-[85%] relative overflow-hidden">
            <AdvancedImage
              cldImg={aboutImage}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-slate-50 -z-10 hidden md:block"></div>
          </div>
        </div>

        {/* Text Section */}
        <div className="order-1 lg:order-2">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">About Starling</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 mb-6 leading-[1.1]">
            <span className="italic font-serif text-slate-500">Our</span> Approach.
          </h1>
          
          <div className="space-y-4 text-slate-600 font-light leading-relaxed">
            <p>
              There is a time and place for everything in art. Sometimes, the story calls for a clean, classic,
              and timeless capture. Other times, it demands that we completely break the mold to build a bold,
              entirely unique aesthetic.
            </p>
            <p>
              At Starling, versatility is our greatest strength. With over a decade of experience across photography,
              videography, advertising, and marketing, we understand exactly how to adapt our medium to fit your
              specific needs. We aren't bound by a single, rigid style or a specific location. Based in Philadelphia
              but available worldwide, we go wherever the story takes us.
            </p>
            <p>
              Our approach is highly collaborative. We obsess over our work so you don't have to, bringing relentless
              dedication and an elevated artistic eye to every wedding, portrait, and commercial project we take on.
              No matter the subject, our mission is simple: to help you capture your vision and share our love for
              art with you.
            </p>
          </div>

          <div className="flex justify-start mt-10">
            <Link
              to="/booking"
              className="group inline-flex items-center justify-center gap-1.5 w-[112px] h-[24px] bg-[#242424] text-white rounded-[17px] text-[12px] font-normal hover:bg-black transition-colors duration-300"
            >
              <span>Reach Out</span>
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
