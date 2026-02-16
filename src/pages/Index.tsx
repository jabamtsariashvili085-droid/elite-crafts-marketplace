import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Users, Clock, Award } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Index = () => {
  const { t } = useTranslation();

  const featuredGranite = products.filter(p => p.category === 'granite' && p.featured).slice(0, 6);
  const featuredFurniture = products.filter(p => p.category === 'furniture' && p.featured).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground leading-tight max-w-4xl mx-auto">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/granite"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gold-gradient text-accent-foreground font-semibold text-lg shadow-gold hover:scale-105 transition-transform"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-colors"
              >
                {t('buttons.contactUs')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            {[
              { num: '500+', label: t('stats.projects') },
              { num: '50+', label: t('stats.clients') },
              { num: '10+', label: t('stats.experience') },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.15 }}>
                <p className="text-3xl md:text-5xl font-extrabold text-gold">{s.num}</p>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Granite Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-4xl font-bold">{t('granite.title')}</h2>
            <Link to="/granite" className="text-gold font-medium hover:underline">
              {t('buttons.viewMore')} →
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGranite.map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Furniture Preview */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-4xl font-bold">{t('furniture.title')}</h2>
            <Link to="/furniture" className="text-gold font-medium hover:underline">
              {t('buttons.viewMore')} →
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFurniture.map((p, i) => (
              <motion.div key={p.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl md:text-4xl font-bold text-center mb-12">
            {t('whyUs.title')}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: t('whyUs.quality'), desc: t('whyUs.qualityDesc') },
              { icon: Users, title: t('whyUs.individual'), desc: t('whyUs.individualDesc') },
              { icon: Shield, title: t('whyUs.warranty'), desc: t('whyUs.warrantyDesc') },
              { icon: Clock, title: t('whyUs.delivery'), desc: t('whyUs.deliveryDesc') },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center hover-lift"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-gold" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
