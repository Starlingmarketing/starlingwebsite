const Gallery = () => {
  const images = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Selected Work ${i + 1}`,
    category: i % 2 === 0 ? 'Editorial' : 'Wedding',
    aspectRatio: i % 3 === 0 ? 'aspect-[4/3]' : i % 5 === 0 ? 'aspect-square' : 'aspect-[3/4]',
  }));

  return (
    <div className="animate-fade-in opacity-0 min-h-screen px-6 md:px-12 max-w-7xl mx-auto py-12 md:py-24">
      <header className="mb-20 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-6">Portfolio</h1>
        <p className="text-slate-500 font-light leading-relaxed">
          A curated selection of our finest moments, spanning intimate weddings to high-end editorial campaigns.
        </p>
      </header>

      {/* Masonry-like Grid Layout using columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {images.map((img) => (
          <div key={img.id} className="break-inside-avoid group cursor-pointer relative overflow-hidden">
            <div className={`w-full bg-slate-100 ${img.aspectRatio}`}>
              {/* Image Placeholder */}
              <div className="w-full h-full bg-slate-100 group-hover:scale-105 transition-transform duration-1000 ease-in-out flex items-center justify-center">
                <span className="text-slate-300 font-light tracking-widest text-xs uppercase">
                  Image {img.id}
                </span>
              </div>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-lg font-light text-slate-900 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {img.title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-600 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                {img.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
