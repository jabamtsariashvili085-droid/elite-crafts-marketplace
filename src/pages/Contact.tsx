import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Send, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        message: form.message,
      });
      if (error) throw error;
      toast({ title: t('contact.success') });
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSending(false);
  };

  return (
    <div>
      <section className="relative py-24 bg-primary text-center">
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 {...fadeUp} className="text-3xl md:text-5xl font-bold text-primary-foreground">
            {t('contact.title')}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="mt-3 text-primary-foreground/70 text-lg">
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.form {...fadeUp} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.phone')}</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl bg-gold-gradient text-accent-foreground font-semibold text-lg shadow-gold hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                {sending ? '...' : t('buttons.send')}
              </button>
            </motion.form>

            {/* Contact Info */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <a href="tel:+995500057527" className="flex items-center gap-3 text-foreground hover:text-gold transition-colors">
                  <Phone size={20} className="text-gold" /> +995 500 05 75 27
                </a>
                <a href="https://wa.me/995500057527" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-foreground hover:text-gold transition-colors">
                  <MessageCircle size={20} className="text-gold" /> WhatsApp
                </a>
                <a href="https://t.me/+995500057527" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-foreground hover:text-gold transition-colors">
                  <Send size={20} className="text-gold" /> Telegram
                </a>
                <a href="mailto:j19mt85@gmail.com" className="flex items-center gap-3 text-foreground hover:text-gold transition-colors">
                  <Mail size={20} className="text-gold" /> j19mt85@gmail.com
                </a>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={20} className="text-gold" />
                  <h3 className="font-semibold">{t('contact.workHours')}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t('contact.weekdays')}</p>
                <p className="text-muted-foreground text-sm">{t('contact.saturday')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
