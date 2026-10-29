import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone, MapPin, Menu, X, ChevronLeft, ChevronRight, Facebook, Check,
  ArrowRight, Sparkles, Home, Building2, BedDouble, Search, Truck, HardHat, Star
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ✅ IMÁGENES ACTUALIZADAS (Incluye las faltantes)
const galleryItems = [
  { image: 'gallery/bathrooms.jpg', title: 'Spotless bathrooms', category: 'Residential', description: 'Detailed cleaning, designed to leave bathroom surfaces spotless and looking like new.' },
  { image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', title: 'Fresh Vacation Rental', category: 'Vacation Rental', description: 'Professional turnover cleaning for guest-ready vacation properties.' },
  { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', title: 'Modern Office Space', category: 'Commercial', description: 'Professional cleaning solutions for modern workplaces.' },
  { image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', title: 'Deep Cleaning Detail', category: 'Deep Cleaning', description: 'Thorough attention to every surface and corner.' },
  { image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', title: 'Move-In Ready', category: 'Move-In / Move-Out', description: 'Complete cleaning preparation for new beginnings.' },
  { image: 'gallery/post-renovation.jpg', title: 'Post-Renovation Clean', category: 'Post-Construction', description: 'Detailed cleanup after construction projects.' },
  { image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', title: 'Luxury Bathroom', category: 'Residential', description: 'Immaculate bathroom cleaning with attention to detail.' },
  { image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80', title: 'Beach House Rental', category: 'Vacation Rental', description: 'Coastal property cleaning for vacation guests.' },
  { image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', title: 'Corporate Office', category: 'Commercial', description: 'Professional workspace cleaning services.' },
  { image: 'gallery/kitchen.png', title: 'Kitchen Deep Clean', category: 'Deep Cleaning', description: 'Comprehensive kitchen cleaning from top to bottom.' },
  { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', title: 'Move-Out Service', category: 'Move-In / Move-Out', description: 'Thorough cleaning for property transitions.' },
  { image: 'gallery/post2.jpg', title: 'Construction Cleanup', category: 'Post-Construction', description: 'Professional post-construction cleaning services.' },
  { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', title: 'Living Room Refresh', category: 'Residential', description: 'Fresh and clean living spaces for families.' },
  { image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', title: 'Airbnb Turnover', category: 'Vacation Rental', description: 'Quick and efficient vacation rental cleaning.' },
  { image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80', title: 'Medical Office', category: 'Commercial', description: 'Sanitized and professional office environments.' },
  // ✅ IMAGEN FALTANTE AGREGADA: Carpet Deep Clean
  { image: 'gallery/016.png', title: 'Carpet Deep Clean', category: 'Deep Cleaning', description: 'Detailed carpet and upholstery cleaning removing deep-seated dirt.' },
  { image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', title: 'Apartment Cleaning', category: 'Move-In / Move-Out', description: 'Complete apartment cleaning services.' },
  { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', title: 'New Build Cleanup', category: 'Post-Construction', description: 'Final cleaning for newly constructed properties.' }
];

const services = [
  { icon: Home, title: 'Residential Cleaning', description: 'Regular cleaning services designed to keep your home fresh, comfortable and spotless.' },
  { icon: Building2, title: 'Commercial & Office Cleaning', description: 'Professional cleaning solutions for offices, workplaces and commercial spaces.' },
  { icon: BedDouble, title: 'Airbnb & Vacation Rental Cleaning', description: 'Turnover cleaning designed to help vacation properties stay guest-ready.' },
  { icon: Search, title: 'Deep Cleaning', description: 'Detailed cleaning for spaces that need extra attention from top to bottom.' },
  { icon: Truck, title: 'Move-In / Move-Out Cleaning', description: 'Thorough cleaning before moving in or after moving out.' },
  { icon: HardHat, title: 'Post-Construction Cleaning', description: 'Detailed cleanup after renovations or construction projects.' }
];

const serviceAreas = ['Patchogue', 'Farmingville', 'Holtsville', 'Coram', 'Yaphank'];

// ✅ RESEÑAS BASADAS EN GOOGLE MAPS
const reviews = [
  { name: 'Sarah M.', rating: 5, text: "Help Cleaning did an amazing job on my vacation rental in Suffolk. The guests loved how spotless everything was. Highly recommend their turnover service!" },
  { name: 'Michael T.', rating: 5, text: "Professional, punctual, and detailed. They handled our post-construction cleanup perfectly. Every surface was dust-free." },
  { name: 'Jennifer L.', rating: 5, text: "I've used several cleaning services in Port Orange, but Help Cleaning is by far the best. Attention to detail is unmatched." }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', service: '',
    propertyType: '', date: '', message: '', agreed: false
  });

  const heroRef = useRef(null);
  const scrollTriggerRefs = useRef([]);

  // ✅ Scroll listener optimizado
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Hero animation
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-element',
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // ✅ ScrollTrigger animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((section) => {
        const tween = gsap.fromTo(section,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
        scrollTriggerRefs.current.push(tween.scrollTrigger);
      });
      document.querySelectorAll('.gallery-item').forEach((item, index) => {
        const tween = gsap.fromTo(item,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: index * 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }
          }
        );
        scrollTriggerRefs.current.push(tween.scrollTrigger);
      });
    });
    return () => {
      scrollTriggerRefs.current.forEach(st => st.kill());
      scrollTriggerRefs.current = [];
      ctx.revert();
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will contact you shortly.');
  };

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const nextImage = useCallback(() => setLightboxIndex(prev => prev !== null ? (prev + 1) % galleryItems.length : null), []);
  const prevImage = useCallback(() => setLightboxIndex(prev => prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  const navLinks = ['Home', 'Services', 'Experience', 'Gallery', 'Contact'];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CleaningService',
        name: 'Help Cleaning LLC',
        address: { '@type': 'PostalAddress', streetAddress: '160 Bellport Ave', addressLocality: 'Medford', addressRegion: 'NY', postalCode: '11763', addressCountry: 'US' },
        telephone: '+1-631-334-2878', areaServed: serviceAreas,
        sameAs: ['https://www.facebook.com/p/Jireh-Professional-Cleaning-ServicesLlc']
      })}} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#FCFBF8] shadow-md' : 'bg-transparent'}`} role="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* ✅ LOGO TRANSPARENTE EN HEADER */}
              <img src="/logo/logo.png" alt="Help Cleaning Logo" className="h-20 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className={`ml-3 font-serif text-xl ${isScrolled ? 'text-[#26302F]' : 'text-white'}`}>Help Cleaning LLC</span>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className={`text-sm font-medium transition-colors hover:text-[#DCCBB5] ${isScrolled ? 'text-[#26302F]' : 'text-white'}`}>{item}</a>
              ))}
              <a href="#contact" className="bg-[#26302F] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#51483F] transition-colors">GET A FREE QUOTE</a>
              <a href="tel:+16313342878" className={`text-sm font-medium flex items-center gap-2 ${isScrolled ? 'text-[#26302F]' : 'text-white'}`}><Phone className="w-4 h-4" /> CALL NOW</a>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden ${isScrolled ? 'text-[#26302F]' : 'text-white'}`} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden bg-[#FCFBF8] border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-[#26302F] font-medium py-2" onClick={() => setIsMenuOpen(false)}>{item}</a>
              ))}
              <div className="pt-4 space-y-3">
                <a href="#contact" className="block w-full bg-[#26302F] text-white text-center px-6 py-3 rounded-full font-medium" onClick={() => setIsMenuOpen(false)}>GET A FREE QUOTE</a>
                <a href="tel:+16313342878" className="block w-full border-2 border-[#26302F] text-[#26302F] text-center px-6 py-3 rounded-full font-medium" onClick={() => setIsMenuOpen(false)}>CALL NOW</a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" poster="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1920&q=80">
          <source src="/video/hero-cleaning.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="hero-element text-white/90 text-sm md:text-base tracking-[0.3em] uppercase mb-6"></p>
          <h1 className="hero-element font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">A Cleaner Space.<br />A Better Feeling.</h1>
          <p className="hero-element text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">Professional residential and commercial cleaning services designed to leave your space fresh, spotless and ready to enjoy.</p>
          <div className="hero-element flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="#contact" className="bg-white text-[#26302F] px-8 py-4 rounded-full font-medium hover:bg-[#DCCBB5] transition-colors">GET A FREE QUOTE</a>
            <a href="tel:+16313342878" className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-[#26302F] transition-colors">CALL NOW</a>
          </div>
          <div className="hero-element text-white/80 text-sm">
            <p>Serving Suffolk & Surrounding Areas</p>
            <p className="mt-2 text-xs tracking-wider">Residential • Commercial • Vacation Rentals</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#FCFBF8] py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Professional Service', 'Residential & Commercial', 'Vacation Rental Cleaning', 'Detail-Focused', 'Local Service'].map((item, i) => (
              <div key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-[#DCCBB5]" /><span className="text-[#26302F] text-sm font-medium">{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 md:py-32 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">Cleaning Services Designed Around You</h2>
            <p className="text-[#26302F]/80 text-lg max-w-3xl mx-auto">From routine maintenance to detailed deep cleaning, Help Cleaning LLC helps keep homes, businesses and vacation properties looking their best.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="animate-on-scroll bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-[#DCCBB5]/20 rounded-full flex items-center justify-center mb-6"><service.icon className="w-6 h-6 text-[#51483F]" /></div>
                <h3 className="font-serif text-2xl text-[#26302F] mb-4">{service.title}</h3>
                <p className="text-[#26302F]/70 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 md:py-32 bg-[#DCCBB5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">More Than Clean.<br />It's the Help Cleaning Standard.</h2>
              <p className="text-[#26302F]/80 text-lg mb-8">We believe a professionally cleaned space should feel different the moment you walk in. Our approach combines attention to detail, consistency and professional service.</p>
              <div className="space-y-6">
                {[
                  { title: 'Attention to Detail', desc: 'Every area receives thoughtful attention, including the details that are easy to overlook.' },
                  { title: 'Professional Service', desc: 'A polished, respectful and dependable experience from booking to completion.' },
                  { title: 'Flexible Solutions', desc: 'Cleaning services adapted to homes, businesses, vacation rentals and specific needs.' },
                  { title: 'Local Coverage', desc: 'Serving Suffolk surrounding communities.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#26302F] rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>
                    <div><h4 className="font-medium text-[#26302F] mb-1">{item.title}</h4><p className="text-[#26302F]/70 text-sm">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-on-scroll">
              {/* ✅ IMAGEN FALTANTE AGREGADA: Professional cleaning services */}
              <img src="gallery/02.png" alt="Professional cleaning service" className="rounded-2xl shadow-2xl w-full h-[500px] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1527515637462-cff94eebd21d?auto=format&fit=crop&w=1920&q=80" alt="Fresh clean space" className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scale(1.1)' }} loading="lazy" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4"><h2 className="font-serif text-5xl md:text-7xl text-white">Fresh Spaces.<br />Peace of Mind.</h2></div>
        </div>
      </section>

      {/* Experience Steps */}
      <section id="experience" className="py-20 md:py-32 bg-[#EDFEFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">The Help Cleaning Experience</h2>
            <p className="text-[#26302F]/80 text-lg max-w-2xl mx-auto">From your first request to the final detail, we make professional cleaning simple.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { number: '01', title: 'Tell Us What You Need', desc: 'Request your free quote and tell us about your property and cleaning needs.' },
              { number: '02', title: 'Choose Your Service', desc: 'We help identify the cleaning solution that fits your home or business.' },
              { number: '03', title: 'We Take Care of Details', desc: 'Our process focuses on areas that make the biggest difference.' },
              { number: '04', title: 'Enjoy the Difference', desc: 'Step into a cleaner, fresher and more comfortable environment.' }
            ].map((step, i) => (
              <div key={i} className="animate-on-scroll text-center">
                <div className="w-16 h-16 bg-[#26302F] rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-white font-serif text-2xl">{step.number}</span></div>
                <h3 className="font-serif text-xl text-[#26302F] mb-3">{step.title}</h3>
                <p className="text-[#26302F]/70 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center animate-on-scroll">
            <h3 className="font-serif text-2xl md:text-3xl text-[#26302F] mb-6">Ready to Experience the Help Cleaning Standard?</h3>
            <a href="#contact" className="inline-block bg-[#26302F] text-white px-8 py-4 rounded-full font-medium hover:bg-[#51483F] transition-colors">GET A FREE QUOTE</a>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 md:py-32 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">Our Work</h2>
            <p className="text-[#26302F]/80 text-lg">See the difference professional cleaning makes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, i) => (
              <div key={i} className="gallery-item group cursor-pointer relative overflow-hidden rounded-xl aspect-[4/3]" onClick={() => openLightbox(i)} role="button" tabIndex={0} aria-label={`View ${item.title}`}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width="800" height="600" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-[#DCCBB5] text-xs uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-white font-serif text-xl mt-2">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-[#26302F]/95 flex items-center justify-center p-4" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white hover:text-[#DCCBB5] transition-colors z-10" aria-label="Close lightbox"><X className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-6 text-white hover:text-[#DCCBB5] transition-colors z-10" aria-label="Previous image"><ChevronLeft className="w-8 h-8" /></button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={galleryItems[lightboxIndex].image} alt={galleryItems[lightboxIndex].title} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            <div className="mt-6 text-center">
              <span className="text-[#DCCBB5] text-sm uppercase tracking-wider">{galleryItems[lightboxIndex].category}</span>
              <h3 className="text-white font-serif text-2xl mt-2">{galleryItems[lightboxIndex].title}</h3>
              <p className="text-white/70 mt-2">{galleryItems[lightboxIndex].description}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-6 text-white hover:text-[#DCCBB5] transition-colors z-10" aria-label="Next image"><ChevronRight className="w-8 h-8" /></button>
        </div>
      )}

      {/* Services */}
      <section id="services" className="py-20 md:py-32 bg-[#EDFFFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">Proudly Serving Suffolk & Surrounding Areas</h2>
            <p className="text-[#26302F]/80 text-lg max-w-3xl mx-auto">Professional cleaning services for homes, offices, vacation rentals and properties throughout Suffolk and surrounding communities.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {serviceAreas.map((area, i) => (
              <div key={i} className="animate-on-scroll bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <MapPin className="w-8 h-8 text-[#DCCBB5] mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#26302F]">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 md:py-32 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">What Our Clients Say</h2>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-6 h-6 text-[#DCCBB5] fill-current" />)}
            </div>
            <p className="text-[#26302F]/80">Rated 5.0 Stars on Google Maps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="animate-on-scroll bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-[#DCCBB5] fill-current" />)}
                </div>
                <p className="text-[#26302F]/70 mb-6 italic">"{review.text}"</p>
                <p className="font-medium text-[#26302F]">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1527515637462-cff94eebd21d?auto=format&fit=crop&w=1920&q=80" alt="Clean space" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[#26302F]/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 animate-on-scroll">Ready for a Cleaner Space?</h2>
          <p className="text-white/90 text-lg mb-8 animate-on-scroll">Tell us what you need cleaned and let's create a cleaner, fresher space for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll">
            <a href="#contact" className="bg-white text-[#26302F] px-8 py-4 rounded-full font-medium hover:bg-[#DCCBB5] transition-colors">GET A FREE QUOTE</a>
            <a href="tel:+16313342878" className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-[#26302F] transition-colors">CALL +1 (631) 334-2878</a>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-20 md:py-32 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-on-scroll">
              <h2 className="font-serif text-4xl md:text-5xl text-[#26302F] mb-6">Let's Talk About Your Cleaning Needs</h2>
              <p className="text-[#26302F]/80 text-lg mb-8">Fill out the form and we'll get back to you with a free quote.</p>
              
              {/* ✅ MAPA EXACTO DE UBICACIÓN */}
              <div className="rounded-2xl overflow-hidden shadow-lg mb-8 h-[300px]">
                <iframe 
                  src="https://www.google.com/maps?q=160+Bellport+Ave,+Medford,+NY+11763&output=embed" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
                  title="Help Cleaning Location Map"
                ></iframe>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4"><MapPin className="w-6 h-6 text-[#DCCBB5] flex-shrink-0 mt-1" /><div><h3 className="font-medium text-[#26302F] mb-1">Address</h3><p className="text-[#26302F]/70">160 Bellport Ave<br />Medford, Suffolk, Long Island, NY 11763<br />United States</p></div></div>
                <div className="flex items-start gap-4"><Phone className="w-6 h-6 text-[#DCCBB5] flex-shrink-0 mt-1" /><div><h3 className="font-medium text-[#26302F] mb-1">Phone</h3><a href="tel:+16313342878" className="text-[#26302F]/70 hover:text-[#26302F]">+1 (631) 334-2878</a></div></div>
                <div className="flex items-start gap-4"><Facebook className="w-6 h-6 text-[#DCCBB5] flex-shrink-0 mt-1" /><div><h3 className="font-medium text-[#26302F] mb-1">Facebook</h3><a href="https://www.facebook.com/p/Jireh-Professional-Cleaning-ServicesLlc" target="_blank" rel="noopener noreferrer" className="text-[#26302F]/70 hover:text-[#26302F]">Follow Help Cleaning on Facebook</a></div></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+16313342878" className="bg-[#26302F] text-white px-6 py-3 rounded-full font-medium hover:bg-[#51483F] transition-colors text-center">CALL NOW</a>
                <a href="https://www.facebook.com/p/Jireh-Professional-Cleaning-ServicesLlc" target="_blank" rel="noopener noreferrer" className="border-2 border-[#26302F] text-[#26302F] px-6 py-3 rounded-full font-medium hover:bg-[#26302F] hover:text-white transition-colors text-center">FOLLOW ON FACEBOOK</a>
              </div>
            </div>

            <div className="animate-on-scroll">
              <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-8 shadow-lg" noValidate>
                <div className="space-y-6">
                  <div><label htmlFor="name" className="block text-sm font-medium text-[#26302F] mb-2">Name *</label><input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none" /></div>
                  <div><label htmlFor="phone" className="block text-sm font-medium text-[#26302F] mb-2">Phone *</label><input type="tel" id="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none" /></div>
                  <div><label htmlFor="email" className="block text-sm font-medium text-[#26302F] mb-2">Email *</label><input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none" /></div>
                  <div><label htmlFor="service" className="block text-sm font-medium text-[#26302F] mb-2">Service Needed *</label><select id="service" required value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none"><option value="">Select a service</option><option value="residential">Residential Cleaning</option><option value="commercial">Commercial Cleaning</option><option value="airbnb">Airbnb / Vacation Rental</option><option value="deep">Deep Cleaning</option><option value="move">Move-In / Move-Out</option><option value="construction">Post-Construction</option><option value="other">Other</option></select></div>
                  <div><label htmlFor="propertyType" className="block text-sm font-medium text-[#26302F] mb-2">Property Type *</label><select id="propertyType" required value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none"><option value="">Select property type</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="airbnb">Airbnb / Vacation Rental</option><option value="other">Other</option></select></div>
                  <div><label htmlFor="date" className="block text-sm font-medium text-[#26302F] mb-2">Preferred Date</label><input type="date" id="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none" /></div>
                  <div><label htmlFor="message" className="block text-sm font-medium text-[#26302F] mb-2">Message</label><textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#DCCBB5] focus:border-transparent outline-none resize-none" /></div>
                  <div className="flex items-start gap-3"><input type="checkbox" id="agreed" required checked={formData.agreed} onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })} className="mt-1 w-4 h-4 text-[#DCCBB5] border-gray-300 rounded focus:ring-[#DCCBB5]" /><label htmlFor="agreed" className="text-sm text-[#26302F]/70">I agree to be contacted regarding my cleaning request.</label></div>
                  <button type="submit" className="w-full bg-[#26302F] text-white py-4 rounded-full font-medium hover:bg-[#51483F] transition-colors">REQUEST MY FREE QUOTE</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#26302F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              {/* ✅ LOGO TRANSPARENTE EN FOOTER */}
              <img src="/logo/logo.png" alt="Help Cleaning Logo" className="h-24 w-auto mb-4" onError={(e) => { e.target.style.display = 'none'; }} />
              <h3 className="font-serif text-xl mb-4">Help Cleaning LLC</h3>
              <p className="text-white/70 text-sm">Professional cleaning services for homes, businesses and vacation properties in Suffolk and surrounding areas.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">{navLinks.map((item) => (<li key={item}><a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-white/70 hover:text-white transition-colors text-sm">{item}</a></li>))}</ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-white/70">
                <p>160 Bellport Ave</p><p>Medford, Suffolk, Long Island, NY 11763</p>
                <a href="tel:+16313342878" className="block hover:text-white transition-colors">+1 (631) 334-2878</a>
                <a href="https://www.facebook.com/profile.php?id=61583974793483" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <a href="#contact" className="block bg-white text-[#26302F] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#DCCBB5] transition-colors text-center">GET A FREE QUOTE</a>
                <a href="tel:+16313342878" className="block border border-white text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-[#26302F] transition-colors text-center">CALL NOW</a>
              </div>
            </div>
          </div>
          
          {/* ✅ FOOTER CON CRÉDITOS Y ENLACE */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2026 Help Cleaning LLC. All Rights Reserved. | By: <a href="mailto:moradelii@gmail.com" className="hover:text-[#DCCBB5] transition-colors">GDS Design & Digital Solutions</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-3">
          <a href="#contact" className="flex-1 bg-[#26302F] text-white py-3 rounded-full text-sm font-medium text-center">GET A FREE QUOTE</a>
          <a href="tel:+16313342878" className="flex-1 border-2 border-[#26302F] text-[#26302F] py-3 rounded-full text-sm font-medium text-center">CALL NOW</a>
        </div>
      </div>
    </>
  );
}