import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, X, Upload, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeroSlide {
    id: string;
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

const emptySlide: Omit<HeroSlide, 'id'> = {
    image: '',
    title_ka: '', title_en: '', title_ru: '',
    subtitle_ka: '', subtitle_en: '', subtitle_ru: '',
    link: '',
    sort_order: 1
};

const AdminHero = () => {
    const { toast } = useToast();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<HeroSlide | null>(null);
    const [form, setForm] = useState(emptySlide);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setSlides(data || []);
        } catch (error) {
            console.error('Error fetching slides:', error);
            toast({ title: 'Error', description: 'Failed to load slides', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('products') // Reusing products bucket for now
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            setForm({ ...form, image: data.publicUrl });
            toast({ title: 'Success', description: 'Image uploaded successfully' });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast({ title: 'Error', description: 'Image upload failed', variant: 'destructive' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                const { error } = await supabase
                    .from('hero_slides')
                    .update(form)
                    .eq('id', editing.id);

                if (error) throw error;
                toast({ title: 'Success', description: 'Slide updated successfully' });
            } else {
                const { error } = await supabase
                    .from('hero_slides')
                    .insert([form]);

                if (error) throw error;
                toast({ title: 'Success', description: 'Slide created successfully' });
            }
            setModalOpen(false);
            fetchSlides();
        } catch (error) {
            console.error('Error saving slide:', error);
            toast({ title: 'Error', description: 'Failed to save slide', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;
        try {
            const { error } = await supabase.from('hero_slides').delete().eq('id', id);
            if (error) throw error;
            toast({ title: 'Success', description: 'Slide deleted' });
            fetchSlides();
        } catch (error) {
            console.error('Error deleting slide:', error);
            toast({ title: 'Error', description: 'Failed to delete slide', variant: 'destructive' });
        }
    };

    const moveSlide = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === slides.length - 1) return;

        const newSlides = [...slides];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap locally
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
        setSlides(newSlides);

        // Update DB
        try {
            // In a real app run this as a transaction or batch update
            // Simple swap of order values
            const s1 = newSlides[index];
            const s2 = newSlides[targetIndex];

            await supabase.from('hero_slides').update({ sort_order: s1.sort_order }).eq('id', s2.id); // Intentional mismatch to swap effectively? No, wait.

            // Let's reassign order based on index
            // Better approach: update all based on new index
            const updates = newSlides.map((s, i) => ({ id: s.id, sort_order: i + 1 }));

            for (const u of updates) {
                await supabase.from('hero_slides').update({ sort_order: u.sort_order }).eq('id', u.id);
            }

            toast({ title: 'Reordered', description: 'Slide order updated' });
        } catch (error) {
            console.error('Error reordering:', error);
            toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' });
            fetchSlides(); // Revert
        }
    };

    const openModal = (slide?: HeroSlide) => {
        if (slide) {
            setEditing(slide);
            setForm({
                image: slide.image,
                title_ka: slide.title_ka, title_en: slide.title_en, title_ru: slide.title_ru,
                subtitle_ka: slide.subtitle_ka, subtitle_en: slide.subtitle_en, subtitle_ru: slide.subtitle_ru,
                link: slide.link,
                sort_order: slide.sort_order
            });
        } else {
            setEditing(null);
            setForm({ ...emptySlide, sort_order: slides.length + 1 });
        }
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Hero Slides</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} /> Add Slide
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading slides...</div>
            ) : slides.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                    <p className="text-muted-foreground">No slides found. Create your first hero slide!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="flex items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
                            <div className="flex flex-col gap-1">
                                <button
                                    disabled={index === 0}
                                    onClick={() => moveSlide(index, 'up')}
                                    className="p-1 hover:bg-muted rounded disabled:opacity-30"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    disabled={index === slides.length - 1}
                                    onClick={() => moveSlide(index, 'down')}
                                    className="p-1 hover:bg-muted rounded disabled:opacity-30"
                                >
                                    <ArrowDown size={16} />
                                </button>
                            </div>
                            <div className="relative">
                                <img
                                    src={slide.image}
                                    alt={slide.title_ka}
                                    className="w-24 h-16 object-cover rounded bg-muted border border-gold/20"
                                />
                                <div className="absolute -top-2 -left-2 bg-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    Slot {index + 1}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] uppercase tracking-tighter text-gold font-bold mb-1 opacity-70">
                                    {index === 0 ? 'Main Background' :
                                        index === 1 ? 'Card 1 (Left)' :
                                            index === 2 ? 'Card 2 (Middle)' :
                                                index === 3 ? 'Card 3 (Right)' :
                                                    index === 4 ? 'Bottom Feature Image' : `Slot ${index + 1}`}
                                </div>
                                <h3 className="font-semibold truncate">{slide.title_ka || slide.title_en || 'No Title'}</h3>
                                <p className="text-sm text-muted-foreground truncate">{slide.subtitle_ka || slide.subtitle_en}</p>
                                <div className="text-xs text-muted-foreground bg-muted inline-block px-1 rounded mt-1">{slide.link}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openModal(slide)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(slide.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <div>
                                <h2 className="text-xl font-semibold">{editing ? 'რედაქტირება' : 'ახლის დამატება'}</h2>
                                {(() => {
                                    const index = editing ? slides.indexOf(editing) : slides.length;
                                    const labels: { [key: number]: string } = {
                                        0: 'მთავარი ფონი (Main Background)',
                                        1: 'მარცხენა ბარათი (Card 1)',
                                        2: 'შუა ბარათი (Card 2)',
                                        3: 'მარჯვენა ბარათი (Card 3)',
                                        4: 'ქვედა დიდი ფოტო (Feature)'
                                    };
                                    const currentLabel = labels[index] || `სლოტი ${index + 1}`;
                                    return (
                                        <p className="text-sm text-gold font-bold uppercase tracking-wider mt-1">
                                            პოზიცია: {currentLabel}
                                        </p>
                                    );
                                })()}
                            </div>
                            <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slide Image</label>
                                <div className="flex items-center gap-4">
                                    {form.image && (
                                        <img src={form.image} alt="Preview" className="w-32 h-20 object-cover rounded border" />
                                    )}
                                    <label className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                                        <Upload size={18} />
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Multilingual Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-blue-600">Georgian (KA)</label>
                                    <input
                                        type="text"
                                        placeholder="Title (KA)"
                                        value={form.title_ka}
                                        onChange={e => setForm({ ...form, title_ka: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <textarea
                                        placeholder="Subtitle (KA)"
                                        value={form.subtitle_ka}
                                        onChange={e => setForm({ ...form, subtitle_ka: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md h-20 resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-indigo-600">English (EN)</label>
                                    <input
                                        type="text"
                                        placeholder="Title (EN)"
                                        value={form.title_en}
                                        onChange={e => setForm({ ...form, title_en: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <textarea
                                        placeholder="Subtitle (EN)"
                                        value={form.subtitle_en}
                                        onChange={e => setForm({ ...form, subtitle_en: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md h-20 resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-red-600">Russian (RU)</label>
                                    <input
                                        type="text"
                                        placeholder="Title (RU)"
                                        value={form.title_ru}
                                        onChange={e => setForm({ ...form, title_ru: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                    <textarea
                                        placeholder="Subtitle (RU)"
                                        value={form.subtitle_ru}
                                        onChange={e => setForm({ ...form, subtitle_ru: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md h-20 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Position Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სად გამოჩნდეს ეს ფოტო? (პოზიცია)</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={form.sort_order}
                                    onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) })}
                                >
                                    <option value={1}>მთავარი ფონი (Slot 1)</option>
                                    <option value={2}>მარცხენა ბარათი (Slot 2)</option>
                                    <option value={3}>შუა ბარათი (Slot 3)</option>
                                    <option value={4}>მარჯვენა ბარათი (Slot 4)</option>
                                    <option value={5}>ქვედა დიდი ფოტო (Slot 5)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link URL (e.g. /granite)</label>
                                <input
                                    type="text"
                                    value={form.link}
                                    onChange={e => setForm({ ...form, link: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="/granite"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || uploading}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center gap-2"
                                >
                                    {saving ? 'Saving...' : <><Save size={18} /> Save Slide</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHero;
