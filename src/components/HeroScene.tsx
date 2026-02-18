import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Image, Float, Sparkles, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Slide {
  id: string;
  image: string;
  title_ka: string;
  title_en: string;
  title_ru: string;
  subtitle_ka: string;
  subtitle_en: string;
  subtitle_ru: string;
  link: string;
  title?: string;
  subtitle?: string;
}

const defaultSlides: Slide[] = [
  {
    id: 'default-granite',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop&q=80',
    title_ka: 'გრანიტი და ქვა', title_en: 'Granite & Stone', title_ru: 'Гранит и камень',
    subtitle_ka: 'უმაღლესი ხარისხის ბუნებრივი ქვა', subtitle_en: 'Premium natural stone', subtitle_ru: 'Натуральный камень премиум-класса',
    link: '/granite',
  },
  {
    id: 'default-furniture',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop&q=80',
    title_ka: 'ავეჯი და დიზაინი', title_en: 'Furniture & Design', title_ru: 'Мебель и дизайн',
    subtitle_ka: 'თანამედროვე და კლასიკური ავეჯი', subtitle_en: 'Modern and classic furniture', subtitle_ru: 'Современная и классическая мебель',
    link: '/furniture',
  },
  {
    id: 'default-cnc',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&h=1080&fit=crop&q=80',
    title_ka: 'CNC სერვისი', title_en: 'CNC Services', title_ru: 'Услуги ЧПУ',
    subtitle_ka: 'ინოვაციური CNC ტექნოლოგია', subtitle_en: 'Innovative CNC technology', subtitle_ru: 'Инновационные технологии ЧПУ',
    link: '/cnc',
  },
];

const GoldMaterial = new THREE.MeshStandardMaterial({
  color: "#FFD700",
  metalness: 1,
  roughness: 0.1,
  emissive: "#B8860B",
  emissiveIntensity: 0.2
});

const FloatingShapes = () => {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-5, 2, -2]} rotation={[0.5, 0.5, 0]}>
          <torusGeometry args={[0.3, 0.08, 16, 32]} />
          <primitive object={GoldMaterial} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[5, -1, -3]} rotation={[0, 1, 0.5]}>
          <icosahedronGeometry args={[0.4, 0]} />
          <primitive object={GoldMaterial} />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[4, 3, -4]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <primitive object={GoldMaterial} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={0.8}>
        <mesh position={[-3, -2.5, -1]}>
          <octahedronGeometry args={[0.25]} />
          <primitive object={GoldMaterial} />
        </mesh>
      </Float>
    </group>
  )
}

const HeroScene = () => {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [usingDefaults, setUsingDefaults] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setSlides(data);
        setUsingDefaults(false);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    }
  };

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const slide = slides[current];

  // Language helper
  const getLangText = (obj: any, prefix: string) => {
    // If using defaults and old structure, fall back
    if (usingDefaults && !obj[prefix + '_en'] && !obj[prefix + '_ka']) {
      return t(obj[prefix + 'Key']) || t(obj[prefix]);
    }
    const lang = i18n.language.slice(0, 2) as 'ka' | 'en' | 'ru';
    return obj[`${prefix}_${lang}`] || obj[`${prefix}_en`] || '';
  };

  const titleText = getLangText(slide, 'title');
  const subtitleText = getLangText(slide, 'subtitle');

  return (
    <div className="absolute inset-0 z-0 bg-primary overflow-hidden">
      {/* 3D Scene */}
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
        <spotLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

        <FloatingShapes />

        <Sparkles count={50} scale={12} size={2} speed={0.4} opacity={0.5} color="#FFD700" />

        {/* The Main Image - Floating */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
          <group position={[0, 0, 0]}>
            <Image
              key={slide.image} // Force re-mount for transition or handled by Image? Image handles texture switch but key ensures fresh fade
              url={slide.image}
              scale={[9, 5]} // Large scale
              transparent
              opacity={0.9}
              radius={0.05}
            >
              {/* Bentonite? No, just Image */}
            </Image>
            {/* Shadow below */}
            <ContactShadows position={[0, -2.6, 0]} opacity={0.5} blur={2.5} scale={10} color="black" />
          </group>
        </Float>
      </Canvas>

      {/* Dark Gradient Overlay for text readability (Critical for 3D bg) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />

      {/* HTML Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="container mx-auto px-4 text-center pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="mt-20 md:mt-0"
            >
              {/* Gold Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-black/40 backdrop-blur-md mb-6 shadow-gold/10 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-gold text-sm font-medium tracking-wider uppercase">
                  Elite Collection
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight font-heading drop-shadow-2xl">
                {titleText}
              </h1>

              <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                {subtitleText}
              </p>

              <div className="mt-10">
                <Link
                  to={slide.link}
                  className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-gold-gradient text-accent-foreground font-bold text-lg shadow-gold hover:scale-110 hover:shadow-gold-lg transition-all duration-300"
                >
                  {t('hero.cta')}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-sm hover:bg-gold/20 hover:border-gold/50 transition-all group hidden md:block"
          >
            <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-sm hover:bg-gold/20 hover:border-gold/50 transition-all group hidden md:block"
          >
            <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === i ? 'bg-gold w-8 shadow-gold' : 'bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroScene;
