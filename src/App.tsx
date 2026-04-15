import { useState, useRef, useEffect } from 'react';
import { Home, Navigation, Image as ImageIcon, User, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Custom Nail Shape Line Art Icons ---
const AlmondIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 C 16.5 9 14 3.5 12 3.5 C 10 3.5 7.5 9 7.5 16 Z" fill="none" />
  </svg>
);

const SquareIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 6 C 16.5 5.2 16 4.8 15.2 4.8 L 8.8 4.8 C 8 4.8 7.5 5.2 7.5 6 Z" fill="none" />
  </svg>
);

const OvalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 9.5 C 16.5 6 14.5 4.5 12 4.5 C 9.5 4.5 7.5 6 7.5 9.5 Z" fill="none" />
  </svg>
);

const SquovalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 7 C 16.5 5.5 15.5 4.5 14 4.5 L 10 4.5 C 8.5 4.5 7.5 5.5 7.5 7 Z" fill="none" />
  </svg>
);

const ShortIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 16.5 10 C 16.5 9.2 16 8.8 15.2 8.8 L 8.8 8.8 C 8 8.8 7.5 9.2 7.5 10 Z" fill="none" />
  </svg>
);

const SharpIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 C 16.5 10 13 3 12 3 C 11 3 7.5 10 7.5 16 Z" fill="none" />
  </svg>
);

const CoffinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M 7.5 16 C 7.5 20 16.5 20 16.5 16 L 15.5 8 L 14 4 L 10 4 L 8.5 8 Z" fill="none" />
  </svg>
);

// --- Data ---
const SHAPES = [
  { id: 'almond', name: 'ทรงอัลมอนด์', icon: AlmondIcon },
  { id: 'square', name: 'ทรงสี่เหลี่ยม', icon: SquareIcon },
  { id: 'squoval', name: 'ทรงเหลี่ยมรี', icon: SquovalIcon },
  { id: 'oval', name: 'ทรงกลม/ทรงรี', icon: OvalIcon },
  { id: 'short', name: 'ทรงสั้น', icon: ShortIcon },
  { id: 'sharp', name: 'ทรงแหลม', icon: SharpIcon },
  { id: 'coffin', name: 'ทรงคอฟฟิน', icon: CoffinIcon }
];

const MOCK_GALLERY = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400&h=400',
    shape: 'sharp',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=400&h=400',
    shape: 'coffin',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400&h=400',
    shape: 'oval',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1599643478524-41bec29d20fc?auto=format&fit=crop&q=80&w=400&h=400',
    shape: 'almond',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1632897530638-3482a0e28c04?auto=format&fit=crop&q=80&w=400&h=400',
    shape: 'short',
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1620324835619-7c15243306e6?auto=format&fit=crop&q=80&w=400&h=400',
    shape: 'square',
  }
];

export default function App() {
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Lightbox / Photo Gallery State ---
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Get current gallery list based on active filter
  const displayedGallery = activeShape ? MOCK_GALLERY.filter(item => item.shape === activeShape) : MOCK_GALLERY;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev === displayedGallery.length - 1 ? 0 : (prev ?? 0) + 1));
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? displayedGallery.length - 1 : (prev ?? 0) - 1));
  };

  // Keyboard support for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, displayedGallery.length]);

  // Touch Swipe Support for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) nextImage(); // Swiped left -> Next
    if (diff < -50) prevImage(); // Swiped right -> Prev
    touchStartX.current = null;
  };


  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-20 md:pb-0 relative">
      
      {/* Header Area */}
      <header className="sticky top-0 z-50 bg-white pt-6 pb-4 px-4 md:px-8 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto flex justify-center items-center">
          
          {/* Title */}
          <h1 className="text-base md:text-lg font-bold tracking-wide">
            THE ARTISAN NAIL GALLERY
          </h1>

        </div>
      </header>

      <main className="max-w-5xl mx-auto pt-6 px-4 md:px-8">
        
        {/* Shape Categories - Horizontal Scroll */}
        <div className="relative mb-8 group">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-6 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {SHAPES.map((shape) => {
              const Icon = shape.icon;
              const isActive = activeShape === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => setActiveShape(isActive ? null : shape.id)}
                  className="flex flex-col items-center flex-shrink-0 w-24 gap-3 outline-none focus:outline-none group/btn"
                >
                  <div className={`w-full aspect-[4/5] rounded-xl flex items-center justify-center border-2 transition-all duration-300 ease-out ${isActive ? 'bg-white border-black shadow-lg' : 'bg-[#F5F5F5] border-transparent group-hover/btn:border-gray-200 group-hover/btn:bg-gray-50'}`}>
                    <Icon className="w-14 h-14 text-black" />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-bold leading-tight transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-500 group-hover/btn:text-gray-800'}`}>{shape.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Picture Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {displayedGallery.map((item, index) => (
            <div 
              key={item.id} 
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              {/* Image Only */}
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 relative">
                <img 
                  src={item.imageUrl} 
                  alt="Nail Design"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {activeShape && displayedGallery.length === 0 && (
            <div className="col-span-2 md:col-span-3 text-center py-12 text-gray-400 text-sm">
               ไม่พบรูปภาพสำหรับทรงนี้
            </div>
          )}
        </div>

      </main>

      {/* Bottom Navigation (Mobile mostly) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <button className="p-2 text-black flex flex-col items-center outline-none focus:outline-none">
            <Home className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button className="p-2 text-gray-400 hover:text-black transition-colors flex flex-col items-center outline-none focus:outline-none">
            <Navigation className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button className="p-2 text-gray-400 hover:text-black transition-colors flex flex-col items-center outline-none focus:outline-none">
            <ImageIcon className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button className="p-2 text-gray-400 hover:text-black transition-colors flex flex-col items-center outline-none focus:outline-none">
            <User className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Fullscreen Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div className="flex items-center justify-center w-full h-full">
            {/* Header Bar */}
            <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10 text-white" onClick={(e) => e.stopPropagation()}>
              <div className="text-base md:text-lg font-medium tracking-wide bg-black/40 px-3 py-1.5 rounded-full">
                {lightboxIndex + 1} / {displayedGallery.length}
              </div>
              
              <button 
                onClick={closeLightbox}
                className="text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full p-2"
                title="ปิดหน้าต่าง"
              >
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </div>

            {/* Desktop Navigation Arrows */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevImage(e);
              }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full p-3"
              title="รูปก่อนหน้า"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextImage(e);
              }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full p-3"
              title="รูปถัดไป"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <div 
              className="max-w-[90vw] max-h-[90vh] p-4 md:p-8"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={displayedGallery[lightboxIndex].imageUrl} 
                alt="Nail Design"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}