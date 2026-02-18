import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Phone, MessageCircle, Send, Ruler, Layers, Check, Heart, Shield, Truck } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { getProductTitle, getProductDescription } from '@/data/products';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Reviews from '@/components/Reviews';
import SEO from '@/components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: products, isLoading } = useProducts();
  const product = products?.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Use the actual uploaded images array, or fallback to the single main image
  const images = product?.images && product.images.length > 0
    ? product.images
    : (product ? [product.image] : []);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveImage(prev => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveImage(prev => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, images.length]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-muted border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">{t('product.notFound')}</p>
        <button onClick={() => navigate(-1)} className="text-gold hover:underline">← {t('buttons.back')}</button>
      </div>
    );
  }

  const title = getProductTitle(product, lang);
  const description = getProductDescription(product, lang);

  const similar = products
    ?.filter(p => p.category === product.category && p.subcategory === product.subcategory && p.id !== product.id)
    .slice(0, 4) || [];

  return (
    <div>
      <SEO
        title={title}
        description={description}
        canonical={`/product/${product.id}`}
        ogImage={product.image}
        ogType="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: title,
          description: description,
          image: product.image,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'GEL',
            availability: 'https://schema.org/InStock',
          },
          material: product.material,
        }}
      />
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> {t('buttons.back') || 'უკან'}
          </button>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {/* Main Image */}
              <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={images[activeImage]}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-gold-gradient text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                    ⭐ {t('product.featured')}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-gold shadow-gold' : 'border-border hover:border-foreground/30'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <span className="text-sm text-muted-foreground">
                {t(`categories.${product.subcategory}`)}
              </span>
              <h1 className="text-xl md:text-2xl font-bold mt-1">{title}</h1>
              <p className="text-2xl font-bold text-gold mt-2">₾{product.price.toLocaleString()}</p>

              <p className="mt-4 text-foreground/80 leading-relaxed text-sm">{description}</p>

              {/* Specs */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-xl p-4 flex items-center gap-3">
                  <Ruler size={20} className="text-gold shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('product.dimensions') || 'ზომები'}</p>
                    <p className="text-sm font-medium">{product.dimensions}</p>
                  </div>
                </div>
                <div className="bg-surface rounded-xl p-4 flex items-center gap-3">
                  <Layers size={20} className="text-gold shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('product.material') || 'მასალა'}</p>
                    <p className="text-sm font-medium">{product.material}</p>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <Reviews productId={product.id} />

              {/* Contact CTA */}
              <div className="mt-6 space-y-3">
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gold-gradient text-accent-foreground font-semibold text-lg shadow-gold hover:scale-[1.02] transition-transform"
                >
                  <Phone size={20} /> {t('buttons.contactUs')}
                </Link>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/995579909808"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                  <a
                    href="https://t.me/+995579909808"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    <Send size={18} /> Telegram
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">{t('product.similar') || 'მსგავსი პროდუქტები'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            onPanEnd={(_e, info) => {
              if (Math.abs(info.offset.x) > 50) {
                if (info.offset.x > 0) setActiveImage(prev => (prev - 1 + images.length) % images.length);
                else setActiveImage(prev => (prev + 1) % images.length);
              }
            }}
          >
            {/* Close */}
            <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-10">
              <X size={28} />
            </button>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); setActiveImage(prev => (prev - 1 + images.length) % images.length); }}
              className="absolute left-4 p-2 text-white/70 hover:text-white z-10"
            >
              <ChevronLeft size={36} />
            </button>

            {/* Image */}
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={images[activeImage]}
              alt={title}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); setActiveImage(prev => (prev + 1) % images.length); }}
              className="absolute right-4 p-2 text-white/70 hover:text-white z-10"
            >
              <ChevronRight size={36} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${activeImage === i ? 'bg-gold' : 'bg-white/40'
                    }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
