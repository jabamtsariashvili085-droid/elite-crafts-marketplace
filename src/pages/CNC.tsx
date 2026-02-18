import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ProductCardSkeleton } from '@/components/Skeletons';
import SEO from '@/components/SEO';

const CNC = () => {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || 'all';
    const productsRef = useRef<HTMLDivElement>(null);
    const [dbCategories, setDbCategories] = useState<{ key: string, label: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('product_subcategories')
                .select('*')
                .eq('category_name', 'cnc')
                .order('sort_order');

            if (data) {
                const lang = i18n.language || 'ka';
                const dynamicCats = data.map(s => ({
                    key: s.name,
                    label: s[`label_${lang}`] || s.label_ka
                }));
                setDbCategories([{ key: 'all', label: t('categories.all') }, ...dynamicCats]);
            }
        };

        fetchCategories();

        const timer = setTimeout(() => {
            productsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 800);
        return () => clearTimeout(timer);
    }, [i18n.language, t]);

    const { data: products, isLoading } = useProducts();

    const filtered = products?.filter(
        p => p.category === 'cnc' && (activeCategory === 'all' || p.subcategory === activeCategory)
    ) || [];

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
                title={t('cnc.title')}
                description={t('cnc.subtitle')}
                canonical="/cnc"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: t('cnc.title'),
                    description: t('cnc.subtitle'),
                }}
            />
            <section className="relative py-20 bg-primary text-center">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&h=600&fit=crop"
                        alt=""
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">{t('cnc.title')}</h1>
                    <p className="mt-3 text-primary-foreground/70 text-lg">{t('cnc.subtitle')}</p>
                </div>
            </section>

            <div ref={productsRef} className="scroll-mt-24">
                <CategoryTabs categories={dbCategories} active={activeCategory} onChange={handleChange} />
            </div>

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
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                            ) : filtered.length > 0 ? (
                                filtered.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-muted-foreground py-20">{t('categories.all')}: 0</p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default CNC;
