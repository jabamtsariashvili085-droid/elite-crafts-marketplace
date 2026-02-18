import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import graniteSinkImg from "@/assets/granite-sink.jpg";
import cncDeskImg from "@/assets/cnc-desk.jpg";
import kitchenExampleImg from "@/assets/kitchen-hero.jpg";

interface HeroData {
    image: string;
    title_ka: string;
    title_en: string;
    title_ru: string;
    subtitle_ka: string;
    subtitle_en: string;
    subtitle_ru: string;
    link: string;
    sort_order: number;
}

export default function HeroContent() {
    const { t, i18n } = useTranslation();
    const [slides, setSlides] = useState<HeroData[]>([]);

    useEffect(() => {
        const fetchHeroData = async () => {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('sort_order', { ascending: true });

            if (!error && data) {
                setSlides(data);
            }
        };
        fetchHeroData();
    }, []);

    const getLangText = (obj: HeroData | undefined, prefix: string, fallbackKey: string): string => {
        if (!obj) return t(fallbackKey);
        const lang = i18n.language.slice(0, 2) as 'ka' | 'en' | 'ru';
        const key = `${prefix}_${lang}` as keyof HeroData;
        const val = obj[key];
        if (typeof val === 'string') return val;

        const enKey = `${prefix}_en` as keyof HeroData;
        const enVal = obj[enKey];
        if (typeof enVal === 'string') return enVal;

        return t(fallbackKey);
    };

    // Mapping slots by explicit sort_order
    const mainHero = slides.find(s => s.sort_order === 1);
    const card1 = slides.find(s => s.sort_order === 2);
    const card2 = slides.find(s => s.sort_order === 3);
    const card3 = slides.find(s => s.sort_order === 4);
    const featureHero = slides.find(s => s.sort_order === 5);

    return (
        <div className="relative z-10">
            {/* Hero Section with kitchen background */}
            <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
                {/* Kitchen background image */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <img
                        src={mainHero?.image || kitchenExampleImg}
                        alt={getLangText(mainHero, 'title', 'hero.modernKitchen')}
                        className="h-full w-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
                </div>

                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative z-10 mb-4 rounded-full border border-gold-subtle bg-glass px-4 py-1"
                >
                    <span className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground">
                        {t('hero.badge')}
                    </span>
                </motion.div>

                {/* Main heading - Dynamic */}
                <motion.h1
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="relative z-10 mb-2 text-center font-display text-3xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl"
                >
                    <span className="text-foreground">{getLangText(mainHero, 'title', 'hero.title2').split(' ')[0]} </span>
                    <span className="text-gold-gradient">{getLangText(mainHero, 'title', 'hero.title2').split(' ').slice(1).join(' ')}</span>
                    <span className="block mt-1 text-xl font-medium text-muted-foreground md:text-2xl lg:text-3xl">
                        {getLangText(mainHero, 'subtitle', 'hero.title3')}
                    </span>
                </motion.h1>

                {/* Subtitle - Dynamic */}
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="relative z-10 mb-6 max-w-2xl text-center font-body text-sm text-muted-foreground md:text-base"
                >
                    {mainHero ? getLangText(mainHero, 'subtitle', 'hero.subtitle') : t('hero.subtitle')}
                </motion.p>

                {/* Product showcase cards - Dynamic */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    className="relative z-10 flex flex-col gap-6 md:flex-row"
                >
                    <ProductCard
                        image={card1?.image || kitchenExampleImg}
                        title={getLangText(card1, 'title', 'hero.card1Title')}
                        description={getLangText(card1, 'subtitle', 'hero.card1Desc')}
                        link={card1?.link || "/furniture"}
                    />
                    <ProductCard
                        image={card2?.image || graniteSinkImg}
                        title={getLangText(card2, 'title', 'hero.card2Title')}
                        description={getLangText(card2, 'subtitle', 'hero.card2Desc')}
                        link={card2?.link || "/granite"}
                    />
                    <ProductCard
                        image={card3?.image || cncDeskImg}
                        title={getLangText(card3, 'title', 'hero.card3Title')}
                        description={getLangText(card3, 'subtitle', 'hero.card3Desc')}
                        link={card3?.link || "/cnc"}
                    />
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.8 }}
                    className="relative z-10 mt-6 flex gap-4"
                >
                    <Link to="/furniture">
                        <button className="rounded-full bg-primary px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 glow-gold">
                            {t('hero.ctaCatalog')}
                        </button>
                    </Link>
                    <Link to="/contact">
                        <button className="rounded-full border border-gold-subtle bg-glass px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:scale-105">
                            {t('hero.ctaContact')}
                        </button>
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.2 }}
                    className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
                >
                    <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">{t('hero.scroll')}</span>
                    <div className="h-12 w-px animate-glow-pulse bg-primary" />
                </motion.div>
            </section>

            {/* Kitchen Feature Section */}
            <section className="relative px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-16 text-center"
                    >
                        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                            {t('hero.ourProducts').split(' ')[0]} <span className="text-gold-gradient">{t('hero.ourProducts').split(' ').slice(1).join(' ')}</span>
                        </h2>
                        <p className="mt-4 font-body text-base text-muted-foreground md:text-lg">
                            {t('hero.productsSubtitle')}
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Large kitchen image */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="group relative overflow-hidden rounded-xl border border-gold-subtle"
                        >
                            <img
                                src={featureHero?.image || kitchenExampleImg}
                                alt={getLangText(featureHero, 'title', 'hero.modernKitchen')}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                            <div className="absolute bottom-0 p-8">
                                <h3 className="font-display text-2xl font-semibold text-foreground">
                                    {getLangText(featureHero, 'title', 'hero.modernKitchen')}
                                </h3>
                                <p className="mt-2 font-body text-muted-foreground">
                                    {getLangText(featureHero, 'subtitle', 'hero.modernKitchenDesc')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Kitchen features list */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col justify-center gap-6"
                        >
                            <FeatureItem
                                number="01"
                                title={t('hero.feat1')}
                                description={t('hero.feat1Desc')}
                            />
                            <FeatureItem
                                number="02"
                                title={t('hero.feat2')}
                                description={t('hero.feat2Desc')}
                            />
                            <FeatureItem
                                number="03"
                                title={t('hero.feat3')}
                                description={t('hero.feat3Desc')}
                            />
                            <FeatureItem
                                number="04"
                                title={t('hero.feat4')}
                                description={t('hero.feat4Desc')}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ProductCard({ image, title, description, link }: { image: string; title: string; description: string; link: string }) {
    return (
        <Link to={link}>
            <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative w-64 overflow-hidden rounded-lg border border-gold-subtle bg-glass md:w-72 cursor-pointer"
            >
                <div className="aspect-[4/3] overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 p-5">
                    <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 font-body text-sm text-muted-foreground">{description}</p>
                </div>
            </motion.div>
        </Link>
    );
}

function FeatureItem({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="group flex gap-5 rounded-lg border border-gold-subtle bg-glass p-6 transition-all hover:glow-gold">
            <span className="font-display text-3xl font-bold text-gold-gradient text-primary opacity-50">
                {number}
            </span>
            <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{title}</h4>
                <p className="mt-1 font-body text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
