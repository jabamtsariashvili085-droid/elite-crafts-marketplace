import { useState, useEffect } from 'react';
import { X, Download, Share, ArrowDown, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(isRunningStandalone);

        if (isRunningStandalone) return;

        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        // Show iOS prompt after a delay if not dismissed before
        if (isIOSDevice && !localStorage.getItem('iosInstallPromptDismissed')) {
            const timer = setTimeout(() => setShowPrompt(true), 10000); // Show after 10s
            return () => clearTimeout(timer);
        }

        // Android/Desktop event listener
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        if (isIOS) {
            localStorage.setItem('iosInstallPromptDismissed', 'true');
        }
    };

    if (isStandalone || !showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
            >
                <div className="bg-card/95 backdrop-blur-md border border-gold/20 shadow-gold/10 p-4 rounded-xl shadow-xl flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gold/10 p-2 rounded-lg">
                                <Smartphone className="text-gold" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">დააყენეთ აპლიკაცია</h3>
                                <p className="text-xs text-muted-foreground">უკეთესი გამოცდილებისთვის</p>
                            </div>
                        </div>
                        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
                            <X size={18} />
                        </button>
                    </div>

                    {deferredPrompt ? (
                        <button
                            onClick={handleInstall}
                            className="w-full py-2.5 rounded-lg bg-gold-gradient text-accent-foreground font-medium text-sm shadow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                            <Download size={16} /> დაყენება
                        </button>
                    ) : isIOS ? (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                                <Share size={12} />
                                <span>დააჭირეთ <strong>Share</strong> ღილაკს</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowDown size={12} />
                                <span>აირჩიეთ <strong>Add to Home Screen</strong></span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPrompt;
