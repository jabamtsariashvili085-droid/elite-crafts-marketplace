import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, X, Tag, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
    id: string;
    name: string;
    label_ka: string;
    label_en: string;
    label_ru: string;
    sort_order: number;
}

interface Subcategory {
    id: string;
    category_name: string;
    name: string;
    label_ka: string;
    label_en: string;
    label_ru: string;
}

const AdminCategories = () => {
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState<string | null>(null);

    const [catForm, setCatForm] = useState({ name: '', label_ka: '', label_en: '', label_ru: '' });
    const [subForm, setSubForm] = useState({ name: '', label_ka: '', label_en: '', label_ru: '' });

    const fetchData = async () => {
        setLoading(true);
        const { data: catData } = await supabase.from('product_categories').select('*').order('sort_order');
        const { data: subData } = await supabase.from('product_subcategories').select('*').order('sort_order');
        setCategories(catData || []);
        setSubcategories(subData || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('product_categories').insert([catForm]);
        if (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Category added' });
            setModalOpen(false);
            setCatForm({ name: '', label_ka: '', label_en: '', label_ru: '' });
            fetchData();
        }
    };

    const handleAddSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCat) return;
        const { error } = await supabase.from('product_subcategories').insert([{ ...subForm, category_name: selectedCat }]);
        if (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Subcategory added' });
            setSubModalOpen(false);
            setSubForm({ name: '', label_ka: '', label_en: '', label_ru: '' });
            fetchData();
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('ნამდვილად გინდათ კატეგორიის წაშლა? ყველა ქვეკატეგორია აგრეთვე წაიშლება.')) return;
        const { error } = await supabase.from('product_categories').delete().eq('id', id);
        if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
        else fetchData();
    };

    const deleteSubcategory = async (id: string) => {
        if (!confirm('ნამდვილად გსურთ ქვეკატეგორიის წაშლა?')) return;
        const { error } = await supabase.from('product_subcategories').delete().eq('id', id);
        if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
        else fetchData();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Tag className="text-gold" /> კატეგორიების მართვა
                </h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-accent-foreground font-bold rounded-xl shadow-gold hover:scale-105 transition-all"
                >
                    <Plus size={20} /> ახალი კატეგორია
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center">იტვირთება...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">{cat.label_ka}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{cat.name}</p>
                                </div>
                                <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gold uppercase flex items-center gap-1">
                                        <Layers size={12} /> ქვეკატეგორიები
                                    </span>
                                    <button
                                        onClick={() => { setSelectedCat(cat.name); setSubModalOpen(true); }}
                                        className="text-[10px] bg-muted px-2 py-1 rounded hover:bg-gold hover:text-white transition-colors"
                                    >
                                        + დამატება
                                    </button>
                                </div>
                                {subcategories
                                    .filter(sub => sub.category_name === cat.name)
                                    .map(sub => (
                                        <div key={sub.id} className="flex justify-between items-center bg-muted/30 p-2 rounded-lg group">
                                            <span className="text-sm">{sub.label_ka}</span>
                                            <button onClick={() => deleteSubcategory(sub.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Category Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">ახალი კატეგორია</h2>
                            <button onClick={() => setModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">სახელი (URL Slug, მაგ: furniture)</label>
                                <input required value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">სახელი (ქართ.)</label>
                                <input required value={catForm.label_ka} onChange={e => setCatForm({ ...catForm, label_ka: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="ინგლისური" value={catForm.label_en} onChange={e => setCatForm({ ...catForm, label_en: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                                <input placeholder="რუსული" value={catForm.label_ru} onChange={e => setCatForm({ ...catForm, label_ru: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-gold text-white font-bold rounded-xl mt-4">შენახვა</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Subcategory Modal */}
            {subModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">ახალი ქვეკატეგორია ({selectedCat})</h2>
                            <button onClick={() => setSubModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddSubcategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">სახელი (URL Slug, მაგ: kitchen)</label>
                                <input required value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">სახელი (ქართ.)</label>
                                <input required value={subForm.label_ka} onChange={e => setSubForm({ ...subForm, label_ka: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="ინგლისური" value={subForm.label_en} onChange={e => setSubForm({ ...subForm, label_en: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                                <input placeholder="რუსული" value={subForm.label_ru} onChange={e => setSubForm({ ...subForm, label_ru: e.target.value })} className="w-full p-2 rounded-lg border bg-background" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-gold text-white font-bold rounded-xl mt-4">შენახვა</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
