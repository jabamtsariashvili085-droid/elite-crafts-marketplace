import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Product, getProductTitle } from '@/data/products';
import LazyImage from '@/components/LazyImage';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const title = getProductTitle(product, i18n.language);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover-lift shadow-sm relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <LazyImage
            src={product.image}
            alt={title}
            wrapperClassName="aspect-[4/3]"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-gold-gradient text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full z-10">
              ⭐ Featured
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm text-foreground/70 hover:text-red-500 transition-colors z-20"
      >
        <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
      </button>

      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block group/title">
          <h3 className="font-semibold text-foreground truncate group-hover/title:text-gold transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t(`categories.${product.subcategory}`)}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gold">₾{product.price.toLocaleString()}</span>
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-medium text-gold hover:underline flex items-center gap-1"
          >
            {t('buttons.details')} <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
