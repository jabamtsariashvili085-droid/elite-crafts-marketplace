import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Product, getProductTitle } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const title = getProductTitle(product, i18n.language);

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover-lift shadow-sm">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gold-gradient text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t(`categories.${product.subcategory}`)}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gold">₾{product.price.toLocaleString()}</span>
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-medium text-gold hover:underline"
          >
            {t('buttons.details')} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
