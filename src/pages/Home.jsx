import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Home = () => {
  // Create a Cloudinary image instance
  // Replace 'samples/people/smiling-man' with the Public ID of your uploaded image
  const coverImage = cld.image('Molly_Fleming_Select_Edits_-016_qdjeyl');

  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial states
    gsap.set('.hero-text-line', { y: 40, opacity: 0 });
    gsap.set('.hero-desc', { y: 20, opacity: 0 });
    gsap.set('.hero-link', { opacity: 0 });
    gsap.set('.hero-img-wrapper', { opacity: 0, y: 40 });
    gsap.set('.hero-img', { scale: 1.05 });

    // Animation sequence
    tl.to('.hero-img-wrapper', {
      opacity: 1,
      y: 0,
      duration: 1.8,
      ease: 'power3.out'
    })
    .to('.hero-img', {
      scale: 1,
      duration: 2,
      ease: 'power2.out',
      clearProps: 'transform'
    }, '-=1.8')
    .to('.hero-text-line', {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=1.4')
    .to('.hero-desc', {
      y: 0,
      opacity: 1,
      duration: 1
    }, '-=0.8')
    .to('.hero-link', {
      opacity: 1,
      duration: 1
    }, '-=0.8');
  }, { scope: container });

  // Featured gallery mock layouts for a premium editorial look
  const wedding1Images = Array.from({ length: 16 }, (_, i) => ({
    id: `w1-${i + 1}`,
    aspectRatio: 'aspect-[4/3]',
    className: 'col-span-12 md:col-span-6 lg:col-span-3'
  }));

  const wedding2Images = Array.from({ length: 16 }, (_, i) => ({
    id: `w2-${i + 1}`,
    aspectRatio: 'aspect-[4/3]',
    className: 'col-span-12 md:col-span-6 lg:col-span-3'
  }));

  return (
    <div ref={container} className="w-full">
      {/* Hero Section - Framed Premium Layout */}
      <section id="home-hero" className="relative w-full pt-28 pb-20 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto min-h-[85vh] flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-5/12 order-2 lg:order-1 flex flex-col justify-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif uppercase text-slate-900 leading-[1.1] tracking-wide mb-8">
              <div className="overflow-hidden"><div className="hero-text-line">Intentional</div></div>
              <div className="overflow-hidden"><div className="hero-text-line">Elegant</div></div>
              <div className="overflow-hidden"><div className="hero-text-line">Honest</div></div>
            </h1>
            <p className="hero-desc text-base md:text-lg text-slate-600 font-light mb-12 max-w-md leading-relaxed">
              Premium photography for weddings, editorials, and lifestyle. Based in Philadelphia, traveling worldwide.
            </p>
            <Link
              to="/booking"
              className="hero-link group inline-flex items-center space-x-4 text-xs uppercase tracking-[0.2em] text-slate-900 hover:text-slate-500 transition-colors"
            >
              <span>REACH OUT</span>
              <ArrowRight size={16} strokeWidth={1} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Image Container */}
          <div className="w-full lg:w-7/12 order-1 lg:order-2">
            <div className="hero-img-wrapper relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-slate-50 shadow-2xl shadow-slate-200/50">
              <AdvancedImage 
                cldImg={coverImage} 
                className="hero-img absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out" 
                alt="Starling Photography Cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Featured Galleries / Recent Work */}
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
        
        <div className="space-y-32">
          {/* Gallery 1 */}
          <div>
            <div className="mb-10 flex flex-col items-center text-center">
              <h3 className="text-3xl font-light text-slate-900 mb-3">The Amalfi Wedding</h3>
              <p className="text-sm text-slate-400 font-light uppercase tracking-widest">Amalfi Coast, Italy • Summer 2026</p>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
              {wedding1Images.map((img, i) => (
                <div key={img.id} className={`group cursor-pointer overflow-hidden ${img.className}`}>
                  <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden shadow-xl shadow-slate-200/50`}>
                    <div className="absolute inset-0 bg-slate-100 group-hover:scale-105 transition-transform duration-[2000ms] ease-out flex items-center justify-center">
                      <span className="text-slate-300 font-light tracking-widest text-[10px] uppercase opacity-50">
                        Image {i + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link to="/gallery" className="inline-block border-b border-slate-300 pb-1 text-sm uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors">
                View Full Gallery
              </Link>
            </div>
          </div>

          {/* Gallery 2 */}
          <div>
            <div className="mb-10 flex flex-col items-center text-center">
              <h3 className="text-3xl font-light text-slate-900 mb-3">Château de Villette</h3>
              <p className="text-sm text-slate-400 font-light uppercase tracking-widest">Paris, France • Autumn 2026</p>
            </div>
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
              {wedding2Images.map((img, i) => (
                <div key={img.id} className={`group cursor-pointer overflow-hidden ${img.className}`}>
                  <div className={`w-full bg-slate-50 ${img.aspectRatio} relative overflow-hidden shadow-xl shadow-slate-200/50`}>
                    <div className="absolute inset-0 bg-slate-100 group-hover:scale-105 transition-transform duration-[2000ms] ease-out flex items-center justify-center">
                      <span className="text-slate-300 font-light tracking-widest text-[10px] uppercase opacity-50">
                        Image {i + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link to="/gallery" className="inline-block border-b border-slate-300 pb-1 text-sm uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors">
                View Full Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
