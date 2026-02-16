import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Trash2, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages((data as Message[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: Message) => {
    await supabase.from('contact_messages').update({ is_read: !msg.is_read }).eq('id', msg.id);
    fetchMessages();
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('ნამდვილად წაშლა?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    toast({ title: 'წაიშალა!' });
    fetchMessages();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ka-GE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">შეტყობინებები</h1>
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`bg-card border rounded-xl p-4 ${msg.is_read ? 'border-border' : 'border-gold/50 bg-gold/5'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{msg.name}</span>
                  {!msg.is_read && <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-medium">ახალი</span>}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>
                  {msg.email && <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>}
                  <span>{formatDate(msg.created_at)}</span>
                </div>
                <p className="mt-2 text-sm text-foreground/80">{msg.message}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleRead(msg)} className="p-1.5 rounded-lg hover:bg-muted text-foreground/70" title={msg.is_read ? 'წაუკითხავად' : 'წაკითხულად'}>
                  {msg.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => deleteMsg(msg.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center py-20 text-muted-foreground">შეტყობინებები არ არის</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
