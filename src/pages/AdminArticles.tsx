import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    author: string;
    created_at: string;
}

const emptyArticle: Omit<Article, 'id' | 'created_at'> = {
    title: '',
    slug: '',
    content: '',
    image: '',
    author: 'Admin',
};

const AdminArticles = () => {
    const { toast } = useToast();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Article | null>(null);
    const [form, setForm] = useState(emptyArticle);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchArticles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
        } else {
            setArticles(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `blog/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products') // Reusing products bucket for now if articles bucket doesn't exist
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            setForm(prev => ({ ...prev, image: data.publicUrl }));
            toast({ title: 'სურათი აიტვირთა' });
        } catch (error: any) {
            toast({ title: 'შეცდომა', description: error.message, variant: 'destructive' });
        } finally {
            setUploading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const openNew = () => {
        setEditing(null);
        setForm(emptyArticle);
        setModalOpen(true);
    };

    const openEdit = (a: Article) => {
        setEditing(a);
        setForm({
            title: a.title,
            slug: a.slug,
            content: a.content,
            image: a.image,
            author: a.author,
        });
        setModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                const { error } = await supabase.from('articles').update(form).eq('id', editing.id);
                if (error) throw error;
                toast({ title: 'სტატია განახლდა' });
            } else {
                const { error } = await supabase.from('articles').insert([form]);
                if (error) throw error;
                toast({ title: 'სტატია დაემატა' });
            }
            setModalOpen(false);
            fetchArticles();
        } catch (error: any) {
            toast({ title: 'შეცდომა', description: error.message, variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('ნამდვილად გინდათ წაშლა?')) return;
        try {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) throw error;
            toast({ title: 'სტატია წაიშალა' });
            fetchArticles();
        } catch (error: any) {
            toast({ title: 'შეცდომა', description: error.message, variant: 'destructive' });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">ბლოგი & სიახლეები</h1>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-gradient text-accent-foreground font-medium shadow-gold hover:scale-[1.02] transition-transform">
                    <Plus size={18} /> ახალი სტატია
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
                                    <th className="text-left p-4">სურათი</th>
                                    <th className="text-left p-4">სათაური</th>
                                    <th className="text-left p-4">ავტორი</th>
                                    <th className="text-left p-4">თარიღი</th>
                                    <th className="text-right p-4">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map(article => (
                                    <tr key={article.id} className="border-b border-border hover:bg-muted/30">
                                        <td className="p-4">
                                            <img src={article.image || 'https://placehold.co/100x100?text=No+Image'} alt="" className="w-12 h-12 rounded-lg object-cover bg-muted" />
                                        </td>
                                        <td className="p-4 font-medium max-w-xs md:max-w-md truncate">{article.title}</td>
                                        <td className="p-4 text-muted-foreground">{article.author}</td>
                                        <td className="p-4 text-muted-foreground">{new Date(article.created_at).toLocaleDateString('ka-GE')}</td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button onClick={() => openEdit(article)} className="p-2 rounded-lg hover:bg-muted text-foreground/70 transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(article.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive ml-1 transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {articles.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-20 text-muted-foreground">სტატიები ვერ მოიძებნა</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{editing ? 'სტატიის რედაქტირება' : 'ახალი სტატია'}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">სათაური</label>
                                        <input
                                            value={form.title}
                                            onChange={e => {
                                                setForm(prev => ({ ...prev, title: e.target.value }));
                                                if (!editing) setForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                                            placeholder="მაგ: როგორ მოვუაროთ გრანიტს"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Slug (ბმული)</label>
                                        <input
                                            value={form.slug}
                                            onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-gold/20 outline-none transition-all text-muted-foreground"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">ავტორი</label>
                                        <input
                                            value={form.author}
                                            onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium mb-1.5">მთავარი სურათი</label>
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-gold/50 transition-colors bg-muted/30">
                                        {form.image ? (
                                            <>
                                                <img src={form.image} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                                                <Upload className="text-muted-foreground mb-2" size={24} />
                                                <span className="text-xs font-medium text-muted-foreground">{uploading ? 'იტვირთება...' : 'ატვირთეთ სურათი'}</span>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                                            </label>
                                        )}
                                    </div>
                                    <input
                                        value={form.image}
                                        onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                                        className="w-full px-3 py-2 text-[11px] rounded-lg border border-input bg-background/50 text-muted-foreground"
                                        placeholder="ან ჩაწერეთ სურათის URL..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">კონტენტი (Markdown მხარდაჭერით)</label>
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                    rows={8}
                                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                                    placeholder="სტატიის ტექსტი..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-border">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors font-medium">გაუქმება</button>
                                <button type="submit" disabled={saving || uploading} className="px-8 py-2.5 rounded-xl bg-gold-gradient text-accent-foreground font-bold shadow-gold disabled:opacity-60 transition-transform active:scale-95">
                                    {saving ? 'ინახება...' : 'შენახვა'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminArticles;
