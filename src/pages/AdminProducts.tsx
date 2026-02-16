import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  category: string;
  subcategory: string;
  title_ka: string;
  title_ru: string;
  title_en: string;
  description_ka: string;
  description_ru: string;
  description_en: string;
  price: number;
  dimensions: string;
  material: string;
  image: string;
  featured: boolean;
  is_published: boolean;
}

const emptyProduct: Omit<Product, 'id'> = {
  category: 'granite',
  subcategory: 'kitchen',
  title_ka: '', title_ru: '', title_en: '',
  description_ka: '', description_ru: '', description_en: '',
  price: 0, dimensions: '', material: '', image: '',
  featured: false, is_published: true,
};

const subcategories: Record<string, string[]> = {
  granite: ['kitchen', 'bathroom', 'bar', 'fireplace'],
  furniture: ['living', 'bedroom', 'kitchen', 'dining', 'office', 'kids'],
};

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await supabase.from('products').update(form).eq('id', editing.id);
      toast({ title: 'პროდუქტი განახლდა!' });
    } else {
      await supabase.from('products').insert(form);
      toast({ title: 'პროდუქტი დაემატა!' });
    }
    setSaving(false);
    setModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ნამდვილად წაშლა?')) return;
    await supabase.from('products').delete().eq('id', id);
    toast({ title: 'პროდუქტი წაიშალა!' });
    fetchProducts();
  };

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">პროდუქტები</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-gradient text-accent-foreground font-medium shadow-gold hover:scale-[1.02] transition-transform">
          <Plus size={18} /> ახალი
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3">სურათი</th>
                  <th className="text-left p-3">სახელი</th>
                  <th className="text-left p-3">კატეგორია</th>
                  <th className="text-left p-3">ფასი</th>
                  <th className="text-left p-3">სტატუსი</th>
                  <th className="text-right p-3">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3">
                      <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="p-3 font-medium">{p.title_ka || p.title_en}</td>
                    <td className="p-3 text-muted-foreground">{p.category} / {p.subcategory}</td>
                    <td className="p-3">₾{p.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.is_published ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                        {p.is_published ? 'აქტიური' : 'დრაფტი'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted text-foreground/70"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive ml-1"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">პროდუქტები არ მოიძებნა</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? 'რედაქტირება' : 'ახალი პროდუქტი'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-muted"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">კატეგორია</label>
                  <select value={form.category} onChange={e => { updateForm('category', e.target.value); updateForm('subcategory', subcategories[e.target.value][0]); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background">
                    <option value="granite">გრანიტი</option>
                    <option value="furniture">ავეჯი</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ქვეკატეგორია</label>
                  <select value={form.subcategory} onChange={e => updateForm('subcategory', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background">
                    {subcategories[form.category]?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Title fields */}
              <div>
                <label className="block text-sm font-medium mb-1">სახელი (ქართ.)</label>
                <input value={form.title_ka} onChange={e => updateForm('title_ka', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">სახელი (რუს.)</label>
                  <input value={form.title_ru} onChange={e => updateForm('title_ru', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">სახელი (ინგ.)</label>
                  <input value={form.title_en} onChange={e => updateForm('title_en', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">აღწერა (ქართ.)</label>
                <textarea value={form.description_ka} onChange={e => updateForm('description_ka', e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ფასი (₾)</label>
                  <input type="number" value={form.price} onChange={e => updateForm('price', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ზომები</label>
                  <input value={form.dimensions} onChange={e => updateForm('dimensions', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">მასალა</label>
                  <input value={form.material} onChange={e => updateForm('material', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">სურათის URL</label>
                <input value={form.image} onChange={e => updateForm('image', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background" placeholder="https://..." />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={e => updateForm('featured', e.target.checked)} className="rounded border-input" />
                  რჩეული
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_published} onChange={e => updateForm('is_published', e.target.checked)} className="rounded border-input" />
                  გამოქვეყნებული
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">გაუქმება</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-gold-gradient text-accent-foreground font-medium shadow-gold disabled:opacity-60">
                  {saving ? '...' : 'შენახვა'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
