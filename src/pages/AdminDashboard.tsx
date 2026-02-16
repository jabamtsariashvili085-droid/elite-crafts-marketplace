import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, MessageSquare, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, messages: 0, unread: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: prodCount }, { count: msgCount }, { count: unreadCount }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ]);
      setStats({
        products: prodCount || 0,
        messages: msgCount || 0,
        unread: unreadCount || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Package, label: 'პროდუქტები', value: stats.products, color: 'text-blue-500' },
    { icon: MessageSquare, label: 'შეტყობინებები', value: stats.messages, color: 'text-green-500' },
    { icon: Eye, label: 'წაუკითხავი', value: stats.unread, color: 'text-gold' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">დეშბორდი</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <card.icon size={22} className={card.color} />
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
