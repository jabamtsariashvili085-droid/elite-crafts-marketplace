import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, MessageSquare, Eye, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, messages: 0, articles: 0, unread: 0 });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: prodCount }, { count: msgCount }, { count: unreadCount }, { count: artCount }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        products: prodCount || 0,
        messages: msgCount || 0,
        unread: unreadCount || 0,
        articles: artCount || 0,
      });

      const { data: rProducts } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5);
      const { data: rMessages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5);
      const { data: rArticles } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5);

      setRecentProducts(rProducts || []);
      setRecentMessages(rMessages || []);
      setRecentArticles(rArticles || []);
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Package, label: 'პროდუქტები', value: stats.products, color: 'text-blue-500', to: '/admin/products' },
    { icon: Newspaper, label: 'სტატიები', value: stats.articles, color: 'text-purple-500', to: '/admin/articles' },
    { icon: MessageSquare, label: 'შეტყობინებები', value: stats.messages, color: 'text-green-500', to: '/admin/messages' },
    { icon: Eye, label: 'წაუკითხავი', value: stats.unread, color: 'text-gold', to: '/admin/messages' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">დეშბორდი</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link key={i} to={card.to} className="bg-card border border-border rounded-xl p-5 hover:border-gold/50 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <card.icon size={22} className={`${card.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs md:text-sm text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
        {/* Recent Messages */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">ბოლო შეტყობინებები</h2>
            <Link to="/admin/messages" className="text-xs text-gold hover:underline">ყველა</Link>
          </div>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-sm">შეტყობინებები არ არის</p>
            ) : (
              recentMessages.map(msg => (
                <div key={msg.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{msg.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{msg.message}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${msg.is_read ? 'bg-muted text-muted-foreground' : 'bg-gold/20 text-gold'}`}>
                      {msg.is_read ? 'წაკითხული' : 'ახალი'}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(msg.created_at).toLocaleDateString('ka-GE', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">ბოლო სტატიები</h2>
            <Link to="/admin/articles" className="text-xs text-gold hover:underline">მართვა</Link>
          </div>
          <div className="space-y-4">
            {recentArticles.length === 0 ? (
              <p className="text-muted-foreground text-sm">სტატიები არ არის</p>
            ) : (
              recentArticles.map(art => (
                <div key={art.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <img src={art.image || 'https://placehold.co/100x100?text=Blog'} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{art.title}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(art.created_at).toLocaleDateString('ka-GE')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-card border border-border rounded-xl p-6 md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">ბოლო პროდუქტები</h2>
            <Link to="/admin/products" className="text-xs text-gold hover:underline">ყველა</Link>
          </div>
          <div className="space-y-4">
            {recentProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">პროდუქტები არ არის</p>
            ) : (
              recentProducts.map(prod => (
                <div key={prod.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <img src={prod.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{prod.title_ka}</p>
                    <p className="text-xs text-muted-foreground">{prod.category} • ₾{prod.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
