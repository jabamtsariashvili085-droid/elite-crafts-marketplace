import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Smartphone, Check, Share, ArrowDown } from 'lucide-react';
import SEO from '@/components/SEO';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <SEO
        title="აპლიკაციის დაყენება"
        description="დააყენეთ Elite Works აპლიკაცია თქვენს ტელეფონზე"
        canonical="/install"
      />
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        {isInstalled ? (
          <motion.div {...fadeUp} className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Check className="text-green-500" size={40} />
            </div>
            <h1 className="text-2xl font-bold">აპლიკაცია უკვე დაყენებულია!</h1>
            <p className="text-muted-foreground">Elite Works აპლიკაცია თქვენს მოწყობილობაზეა.</p>
          </motion.div>
        ) : (
          <motion.div {...fadeUp} className="space-y-8">
            <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-lg">
              <img src="/pwa-192x192.png" alt="Elite Works" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">დააყენეთ Elite Works</h1>
              <p className="text-muted-foreground">
                აპლიკაცია მუშაობს ოფლაინ რეჟიმშიც და იტვირთება სწრაფად
              </p>
            </div>

            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="w-full py-4 rounded-xl bg-gold-gradient text-accent-foreground font-semibold text-lg shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
              >
                <Download size={22} /> დაყენება
              </button>
            ) : isIOS ? (
              <div className="bg-card border border-border rounded-xl p-6 space-y-4 text-left">
                <h3 className="font-semibold text-center">iPhone/iPad-ზე დასაყენებლად:</h3>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Share size={16} className="text-gold" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Safari-ში დააჭირეთ <strong>Share</strong> ღილაკს (ქვემოთ)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <ArrowDown size={16} className="text-gold" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    აირჩიეთ <strong>"Add to Home Screen"</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <Smartphone size={32} className="text-gold mx-auto" />
                <p className="text-sm text-muted-foreground">
                  ბრაუზერის მენიუდან აირჩიეთ <strong>"Install app"</strong> ან <strong>"Add to Home Screen"</strong>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Install;
