import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';

const Home = () => {
  // Create a Cloudinary image instance
  // Replace 'samples/people/smiling-man' with the Public ID of your uploaded image
  const coverImage = cld.image('Molly_Fleming_Select_Edits_-016_qdjeyl');

  return (
    <div className="animate-fade-in opacity-0">
      {/* Hero Section - Full-screen image with text overlay */}
      <section className="relative h-screen w-full overflow-hidden -mt-24">
        <AdvancedImage 
          cldImg={coverImage} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Starling Photography Cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12">
          <div className="max-w-3xl text-center flex flex-col items-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] mb-8">
              Capturing the <br className="hidden md:block" />
              <span className="italic text-white/80 font-serif">essence</span> of your moments.
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light mb-12 max-w-xl leading-relaxed">
              Premium photography for weddings, editorials, and lifestyle. Based in London, traveling worldwide.
            </p>
            <Link
              to="/gallery"
              className="group inline-flex items-center space-x-4 text-xs uppercase tracking-[0.2em] text-white hover:text-white/70 transition-colors"
            >
              <span>View Selected Works</span>
              <ArrowRight size={16} strokeWidth={1} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Images / Recent Work */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-t border-slate-100">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-2xl font-light tracking-wide text-slate-900">Recent Stories</h2>
          <Link
            to="/gallery"
            className="hidden md:block text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            All Stories
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Featured Item 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] md:aspect-[4/5] bg-slate-100 mb-6 overflow-hidden">
              {/* Image placeholder */}
              <div className="w-full h-full bg-slate-100 group-hover:scale-105 transition-transform duration-1000 ease-in-out flex items-center justify-center text-slate-300 font-light tracking-widest text-sm uppercase">
                Image Placeholder
              </div>
            </div>
            <h3 className="text-lg font-light text-slate-900 mb-2">The Amalfi Wedding</h3>
            <p className="text-sm text-slate-400 font-light uppercase tracking-wider">Editorial / 2026</p>
          </div>

          {/* Featured Item 2 */}
          <div className="group cursor-pointer md:mt-24">
            <div className="aspect-[3/4] md:aspect-[4/5] bg-slate-100 mb-6 overflow-hidden">
              {/* Image placeholder */}
              <div className="w-full h-full bg-slate-100 group-hover:scale-105 transition-transform duration-1000 ease-in-out flex items-center justify-center text-slate-300 font-light tracking-widest text-sm uppercase">
                Image Placeholder
              </div>
            </div>
            <h3 className="text-lg font-light text-slate-900 mb-2">Studio Sessions</h3>
            <p className="text-sm text-slate-400 font-light uppercase tracking-wider">Portrait / 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
