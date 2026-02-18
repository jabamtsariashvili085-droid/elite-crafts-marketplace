import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ProductCardSkeleton } from '@/components/Skeletons';
import SEO from '@/components/SEO';

const CategoryProducts = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSubcategory = searchParams.get('category') || 'all';
    const productsRef = useRef<HTMLDivElement>(null);
    const [dbSubcategories, setDbSubcategories] = useState<{ key: string, label: string }[]>([]);
    const [categoryInfo, setCategoryInfo] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;

            // Fetch Category Info
            const { data: catData } = await supabase
                .from('product_categories')
                .select('*')
                .eq('name', slug)
                .single();

            if (catData) {
                setCategoryInfo(catData);
            }

            // Fetch Subcategories
            const { data: subData } = await supabase
                .from('product_subcategories')
                .select('*')
                .eq('category_name', slug)
                .order('sort_order');

            if (subData) {
                const lang = i18n.language || 'ka';
                const dynamicCats = subData.map(s => ({
                    key: s.name,
                    label: s[`label_${lang}`] || s.label_ka
                }));
                setDbSubcategories([{ key: 'all', label: t('categories.all') }, ...dynamicCats]);
            }
        };

        fetchData();

        // Scroll top on category change
        window.scrollTo(0, 0);
    }, [slug, i18n.language, t]);

    const { data: products, isLoading } = useProducts();

    const filtered = products?.filter(
        p => p.category === slug && (activeSubcategory === 'all' || p.subcategory === activeSubcategory)
    ) || [];

    const handleChange = (key: string) => {
        if (key === 'all') {
            setSearchParams({});
        } else {
            setSearchParams({ category: key });
        }
    };

    const lang = i18n.language || 'ka';
    const title = categoryInfo?.[`label_${lang}`] || categoryInfo?.label_ka || slug;
    const subtitle = categoryInfo?.[`description_${lang}`] || categoryInfo?.description_ka || '';

    // Default hero images for known categories
    const heroImages: Record<string, string> = {
        granite: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=600&fit=crop",
        furniture: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=600&fit=crop",
        cnc: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&h=600&fit=crop",
        icecream: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=1920&h=600&fit=crop"
    };

    const heroImg = categoryInfo?.image_url || heroImages[slug || ''] || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=600&fit=crop";

    return (
        <div>
            <SEO
                title={title}
                description={subtitle}
                canonical={`/${slug}`}
            />

            <section className="relative py-20 bg-primary text-center">
                <div className="absolute inset-0">
                    <img
                        src={heroImg}
                        alt=""
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">{title}</h1>
                    <p className="mt-3 text-primary-foreground/70 text-lg">{subtitle}</p>
                </div>
            </section>

            <div ref={productsRef} className="scroll-mt-24">
                <CategoryTabs categories={dbSubcategories} active={activeSubcategory} onChange={handleChange} />
            </div>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${slug}-${activeSubcategory}`}
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

export default CategoryProducts;
