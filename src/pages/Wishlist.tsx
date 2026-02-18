import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/Skeletons';
import SEO from '@/components/SEO';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { t } = useTranslation();
    const { savedIds } = useWishlist();
    const { data: products, isLoading } = useProducts();

    const wishlistProducts = products?.filter(p => savedIds.includes(p.id)) || [];

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={t('nav.wishlist') || 'სურვილების სია'}
                description="თქვენი არჩეული პროდუქტები"
                canonical="/wishlist"
            />

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <h1 className="text-2xl md:text-3xl font-bold">სურვილების სია</h1>
                    <span className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                        {savedIds.length}
                    </span>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : wishlistProducts.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {wishlistProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                            <Heart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold">სურვილების სია ცარიელია</h2>
                        <p className="text-muted-foreground max-w-md">
                            თქვენ ჯერ არაფერი მოგიწონებიათ. გადადით კატეგორიებში და აირჩიეთ სასურველი პროდუქტი.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <Link to="/granite" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-accent-foreground font-medium shadow-gold hover:scale-105 transition-transform">
                                გრანიტი <ArrowRight size={18} />
                            </Link>
                            <Link to="/furniture" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-input bg-background hover:bg-accent font-medium transition-colors">
                                ავეჯი <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
