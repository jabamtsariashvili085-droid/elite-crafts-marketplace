const ProductCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
    <div className="aspect-[4/3] bg-muted animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-muted border-t-gold rounded-full animate-spin" />
  </div>
);

export default ProductCardSkeleton;
