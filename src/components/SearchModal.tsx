import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { getProductTitle, getProductDescription } from '@/data/products';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const { data: products } = useProducts();

  const lang = i18n.language;

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) return;
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filtered = query.trim().length > 0 && products
    ? products.filter(p => {
      const q = query.toLowerCase();
      return (
        getProductTitle(p, lang).toLowerCase().includes(q) ||
        getProductDescription(p, lang).toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    })
    : [];

  const handleSelect = (p: any) => {
    navigate(`/product/${p.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 sm:inset-auto sm:top-[10%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-[61] flex flex-col"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('buttons.search') || 'ძიება...'}
                  className="w-full py-4 bg-transparent text-foreground outline-none text-base placeholder:text-muted-foreground"
                />
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted shrink-0">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {query.trim().length > 0 && filtered.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    არაფერი მოიძებნა
                  </p>
                )}
                {filtered.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{getProductTitle(p, lang)}</p>
                      <p className="text-xs text-muted-foreground">
                        {t(`categories.${p.subcategory}`)} · ₾{p.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground text-center">
                ESC — {t('buttons.close') || 'დახურვა'}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
