import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Users, Shield, Clock } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => {
  const { t } = useTranslation();

  const steps = [
    { num: '01', label: t('about.step1') },
    { num: '02', label: t('about.step2') },
    { num: '03', label: t('about.step3') },
    { num: '04', label: t('about.step4') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 bg-primary text-center">
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 {...fadeUp} className="text-3xl md:text-5xl font-bold text-primary-foreground">
            {t('about.title')}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="mt-3 text-primary-foreground/70 text-lg">
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('about.story')}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{t('about.storyText')}</p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('about.mission')}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{t('about.missionText')}</p>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t('about.process')}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.15 }}
                className="bg-card border border-border rounded-xl p-6 text-center hover-lift"
              >
                <span className="text-3xl font-extrabold text-gold">{step.num}</span>
                <p className="mt-3 font-semibold">{step.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
