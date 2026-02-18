import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, X, Upload, Database, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { products as seedData } from '@/data/products';

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
  images?: string[] | null;
  featured: boolean;
  is_published: boolean;
}

const emptyProduct: Omit<Product, 'id'> = {
  category: 'granite',
  subcategory: 'kitchen',
  title_ka: '', title_ru: '', title_en: '',
  description_ka: '', description_ru: '', description_en: '',
  price: 0, dimensions: '', material: '', image: '', images: [],
  featured: false, is_published: true,
};

// Hardcoded fallback categories removed to use dynamic data from DB

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Dynamic category states
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbSubcategories, setDbSubcategories] = useState<any[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const files = Array.from(e.target.files);
      const newUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }

      // If we are uploading multiple, add them to the images array
      // Also set the first one as the main image if one isn't set
      const currentImages = form.images || [];
      const updatedImages = [...currentImages, ...newUrls];

      updateForm('images', updatedImages);
      if (!form.image && updatedImages.length > 0) {
        updateForm('image', updatedImages[0]);
      }
    } catch (error: any) {
      toast({ title: 'სურათის ატვირთვა ვერ მოხერხდა', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = (form.images || []).filter((_, i) => i !== index);
    updateForm('images', updatedImages);
    // If we removed the main image, update it to the first available or empty
    if (form.image === (form.images || [])[index]) {
      updateForm('image', updatedImages[0] || '');
    }
  };

  const handleSeed = async () => {
    if (!confirm('ნამდვილად გინდათ სატესტო მონაცემების ჩაწერა?')) return;
    setLoading(true);
    try {
      // Remove IDs to let Supabase generate them
      const dataToInsert = seedData.map(({ id, ...rest }) => rest);
      const { error } = await supabase.from('products').insert(dataToInsert);
      if (error) throw error;
      toast({ title: 'მონაცემები წარმატებით დაემატა!' });
      fetchProducts();
    } catch (error: any) {
      toast({ title: 'შეცდომა', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    setCatsLoading(true);
    const { data: catData } = await supabase.from('product_categories').select('*').order('sort_order');
    const { data: subData } = await supabase.from('product_subcategories').select('*').order('sort_order');
    setDbCategories(catData || []);
    setDbSubcategories(subData || []);
    setCatsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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

  const quickAddCategory = async () => {
    const name = prompt('შეიყვანეთ კატეგორიის სახელი (Slug - მაგ: cnc):');
    if (!name) return;
    const label = prompt('შეიყვანეთ კატეგორიის სახელი ქართულად:');
    if (!label) return;

    try {
      const { error } = await supabase.from('product_categories').insert({
        name,
        label_ka: label,
        label_en: label, // For now use same
        label_ru: label,
        sort_order: dbCategories.length + 1
      });

      if (error) throw error;
      toast({ title: 'კატეგორია დაემატა!' });
      await fetchCategories();
      updateForm('category', name);
    } catch (error: any) {
      toast({ title: 'შეცდომა', description: error.message, variant: 'destructive' });
    }
  }

  const quickAddSubcategory = async () => {
    const name = prompt('შეიყვანეთ ქვეკატეგორიის სახელი (Slug - მაგ: chair):');
    if (!name) return;
    const label = prompt('შეიყვანეთ ქვეკატეგორიის სახელი ქართულად:');
    if (!label) return;

    try {
      const { error } = await supabase.from('product_subcategories').insert({
        category_name: form.category,
        name,
        label_ka: label,
        label_en: label,
        label_ru: label,
        sort_order: dbSubcategories.filter(s => s.category_name === form.category).length + 1
      });

      if (error) throw error;
      toast({ title: 'ქვეკატეგორია დაემატა!' });
      await fetchCategories();
      updateForm('subcategory', name);
    } catch (error: any) {
      toast({ title: 'შეცდომა', description: error.message, variant: 'destructive' });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">პროდუქტები</h1>
        <div className="flex gap-3">
          <button onClick={handleSeed} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold text-gold font-medium hover:bg-gold/10 transition-colors">
            <Database size={18} /> Seed Data
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-gradient text-accent-foreground font-medium shadow-gold hover:scale-[1.02] transition-transform">
            <Plus size={18} /> ახალი
          </button>
        </div>
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
                  <div className="flex gap-2">
                    <select
                      value={form.category}
                      onChange={e => {
                        const catName = e.target.value;
                        updateForm('category', catName);
                        const firstSub = dbSubcategories.find(s => s.category_name === catName);
                        updateForm('subcategory', firstSub ? firstSub.name : '');
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-input bg-background"
                    >
                      {dbCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.label_ka}</option>
                      ))}
                      {dbCategories.length === 0 && <option value="">არ არის კატეგორიები</option>}
                    </select>
                    <button type="button" onClick={quickAddCategory} className="p-2 rounded-lg border border-gold text-gold hover:bg-gold/10 transition-colors" title="Add Category">
                      <Plus size={18} />
                    </button>
                    <Link to="/admin/categories" className="p-2 rounded-lg border border-border text-foreground/50 hover:text-foreground hover:bg-muted transition-colors" title="Manage Categories">
                      <Settings size={18} />
                    </Link>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ქვეკატეგორია</label>
                  <div className="flex gap-2">
                    <select value={form.subcategory} onChange={e => updateForm('subcategory', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-input bg-background">
                      {dbSubcategories
                        .filter(s => s.category_name === form.category)
                        .map(s => <option key={s.id} value={s.name}>{s.label_ka}</option>)}
                      {dbSubcategories.filter(s => s.category_name === form.category).length === 0 && <option value="">არ არის ქვეკატეგორიები</option>}
                    </select>
                    <button type="button" onClick={quickAddSubcategory} className="p-2 rounded-lg border border-gold text-gold hover:bg-gold/10 transition-colors" title="Add Subcategory">
                      <Plus size={18} />
                    </button>
                    <Link to="/admin/categories" className="p-2 rounded-lg border border-border text-foreground/50 hover:text-foreground hover:bg-muted transition-colors" title="Manage Categories">
                      <Settings size={18} />
                    </Link>
                  </div>
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
                <label className="block text-sm font-medium mb-1">სურათები</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {(form.images || []).map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        {form.image === img && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gold/90 text-[10px] text-accent-foreground text-center py-0.5 font-bold">მთავარი</div>
                        )}
                        {form.image !== img && (
                          <button
                            type="button"
                            onClick={() => updateForm('image', img)}
                            className="absolute inset-0 bg-black/40 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            Set Main
                          </button>
                        )}
                      </div>
                    ))}
                    <label className={`cursor-pointer flex flex-col items-center justify-center gap-1 aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-gold hover:text-gold transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload size={20} />
                      <span className="text-[10px] font-medium">{uploading ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-bold">Main Image URL (Manual)</label>
                    <input value={form.image} onChange={e => updateForm('image', e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background/50 text-muted-foreground" placeholder="მთავარი სურათის URL..." />
                  </div>
                </div>
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
