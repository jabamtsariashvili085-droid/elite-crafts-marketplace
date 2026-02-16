import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Elite Works';
const DEFAULT_OG_IMAGE = '/og-image.png';
const BASE_URL = 'https://eliteworks.ge';

const SEO = ({ title, description, canonical, ogImage, ogType = 'website', jsonLd }: SEOProps) => {
  useEffect(() => {
    // Title
    document.title = `${title} | ${SITE_NAME}`;

    // Meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', `${title} | ${SITE_NAME}`);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage || DEFAULT_OG_IMAGE);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:title', `${title} | ${SITE_NAME}`);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage || DEFAULT_OG_IMAGE);

    if (canonical) {
      setMeta('property', 'og:url', `${BASE_URL}${canonical}`);
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `${BASE_URL}${canonical}`);
    }

    // JSON-LD
    const scriptId = 'seo-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd]);

  return null;
};

export default SEO;
