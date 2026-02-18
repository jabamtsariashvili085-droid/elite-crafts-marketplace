import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3">
              <span className="text-gold-gradient">Elite</span> Works
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">{t('nav.home')}</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/granite" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t('nav.granite')}</Link>
              <Link to="/furniture" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t('nav.furniture')}</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t('nav.about')}</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">{t('nav.contact')}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">{t('contact.title')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="tel:+995579909808" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone size={14} /> +995 579 909 808
              </a>
              <a href="mailto:j19mt85@gmail.com" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail size={14} /> j19mt85@gmail.com
              </a>
              <a href="https://wa.me/995579909808" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a href="https://t.me/+995579909808" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Send size={14} /> Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Elite Works. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
