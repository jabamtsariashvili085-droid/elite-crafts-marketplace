import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Star, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Review {
    id: string;
    rating: number;
    author_name: string;
    comment: string;
    created_at: string;
}

interface ReviewsProps {
    productId: string;
}

const Reviews = ({ productId }: ReviewsProps) => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [newReview, setNewReview] = useState({ rating: 5, author_name: '', comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('is_approved', true) // Only show approved reviews
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Review[];
        },
    });

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('reviews').insert({
                product_id: productId,
                rating: newReview.rating,
                author_name: newReview.author_name,
                comment: newReview.comment,
            });

            if (error) throw error;

            toast.success(t('reviews.success'));
            setNewReview({ rating: 5, author_name: '', comment: '' });
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(t('reviews.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${star <= rating ? 'fill-current' : 'text-muted-foreground/30'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="text-gold" />
                {t('reviews.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reviews List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-muted-foreground">{t('reviews.loading')}</p>
                    ) : reviews && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{review.author_name}</p>
                                        <div className="flex text-gold text-xs mt-0.5">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(review.created_at).toLocaleDateString(i18n.language === 'ka' ? 'ka-GE' : i18n.language === 'ru' ? 'ru-RU' : 'en-US')}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
                            <p className="text-muted-foreground">{t('reviews.empty')}</p>
                            <p className="text-sm">{t('reviews.beFirst')}</p>
                        </div>
                    )}
                </div>

                {/* New Review Form */}
                <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                    <h3 className="font-semibold mb-4">{t('reviews.write')}</h3>
                    <form onSubmit={submitReview} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">{t('reviews.name')}</label>
                            <Input
                                required
                                value={newReview.author_name}
                                onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
                                placeholder={t('reviews.name')}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">{t('reviews.rating')}</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className={`transition-transform hover:scale-110 ${star <= newReview.rating ? 'text-gold fill-gold' : 'text-muted-foreground'
                                            }`}
                                    >
                                        <Star size={24} className={star <= newReview.rating ? 'fill-current' : ''} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">{t('reviews.comment')}</label>
                            <Textarea
                                required
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder={t('reviews.commentPlaceholder')}
                                rows={3}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gold hover:bg-gold/90 text-primary-foreground"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('reviews.submitting') : (
                                <>
                                    <Send size={16} className="mr-2" />
                                    {t('buttons.send')}
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
