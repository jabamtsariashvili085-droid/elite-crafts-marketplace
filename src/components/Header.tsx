import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Search, Sun, Moon, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SearchModal from './SearchModal';
import { useWishlist } from '@/contexts/WishlistContext';

const languages = [
  { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { savedIds } = useWishlist();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close language dropdown on outside click
  const langRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setLangOpen(false);
  };

  const [dbLinks, setDbLinks] = useState<{ to: string, label: string }[]>([]);

  useEffect(() => {
    const fetchNav = async () => {
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order');

      if (data) {
        const lang = i18n.language || 'ka';
        const dynamicLinks = data.map(cat => ({
          to: `/${cat.name}`,
          label: cat[`label_${lang}`] || cat.label_ka
        }));

        setDbLinks([
          { to: '/', label: t('nav.home') },
          ...dynamicLinks,
          { to: '/visualizer', label: t('nav.visualizer') },
          { to: '/blog', label: t('nav.blog') },
          { to: '/about', label: t('nav.about') },
          { to: '/contact', label: t('nav.contact') },
        ]);
      }
    };

    fetchNav();
  }, [i18n.language, t]);

  const navLinks = dbLinks.length > 0 ? dbLinks : [
    { to: '/', label: t('nav.home') },
    { to: '/granite', label: t('nav.granite') },
    { to: '/furniture', label: t('nav.furniture') },
    { to: '/cnc', label: t('nav.cnc') },
    { to: '/visualizer', label: t('nav.visualizer') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md'
          : 'bg-background/80 backdrop-blur-sm'
          }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              <span className="text-gold-gradient">Elite</span>{' '}
              <span className="text-foreground">Works</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.to)
                  ? 'text-gold bg-gold/10'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              >
                <Globe size={20} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-12 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLang(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${i18n.language === lang.code
                          ? 'bg-gold/10 text-gold'
                          : 'hover:bg-muted text-foreground'
                          }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            >
              <Heart size={20} />
              {savedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-background animate-pulse" />
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header >

      {/* Mobile Sidebar - using CSS transitions for reliable mobile behavior */}
      <div
        className={`fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-card z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold text-gold-gradient">Elite Works</span>
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-muted">
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.to)
                ? 'text-gold bg-gold/10'
                : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
