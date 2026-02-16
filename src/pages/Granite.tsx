import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import SEO from '@/components/SEO';

const Granite = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'kitchen', label: t('categories.kitchen') },
    { key: 'bathroom', label: t('categories.bathroom') },
    { key: 'bar', label: t('categories.bar') },
    { key: 'fireplace', label: t('categories.fireplace') },
  ];

  const filtered = products.filter(
    p => p.category === 'granite' && (activeCategory === 'all' || p.subcategory === activeCategory)
  );

  const handleChange = (key: string) => {
    if (key === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: key });
    }
  };

  return (
    <div>
      <SEO
        title={t('granite.title')}
        description={t('granite.subtitle')}
        canonical="/granite"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t('granite.title'),
          description: t('granite.subtitle'),
        }}
      />
      {/* Mini Hero */}
      <section className="relative py-20 bg-primary text-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=600&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">{t('granite.title')}</h1>
          <p className="mt-3 text-primary-foreground/70 text-lg">{t('granite.subtitle')}</p>
        </div>
      </section>

      <CategoryTabs categories={categories} active={activeCategory} onChange={handleChange} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-20">{t('categories.all')}: 0</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Granite;
