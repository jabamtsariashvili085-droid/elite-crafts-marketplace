import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const scrollToTop = () => {
            const lenis = (window as any).lenis;
            if (lenis) {
                // Maximum WOW effect: Slow, smooth scroll up
                lenis.scrollTo(0, {
                    immediate: false,
                    duration: 3,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        // Small delay to ensure the new page content is rendered
        const timer = setTimeout(scrollToTop, 50);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
