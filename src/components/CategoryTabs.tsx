import { useTranslation } from 'react-i18next';

interface CategoryTabsProps {
  categories: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

const CategoryTabs = ({ categories, active, onChange }: CategoryTabsProps) => {
  return (
    <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                active === cat.key
                  ? 'bg-gold text-accent-foreground shadow-gold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
