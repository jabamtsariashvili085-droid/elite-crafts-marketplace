import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User, Share2, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '@/components/SEO';
import LazyImage from '@/components/LazyImage';

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string; // We'll treat this as Markdown for now
    image: string;
    created_at: string;
    author: string;
}

const ArticleDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const { data: article, isLoading } = useQuery({
        queryKey: ['article', slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data as Article;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-muted border-t-gold rounded-full animate-spin" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground text-lg">სტატია ვერ მოიძებნა</p>
                <button onClick={() => navigate('/blog')} className="text-gold hover:underline">← უკან ბლოგზე</button>
            </div>
        );
    }

    return (
        <article className="min-h-screen pb-20 bg-background">
            <SEO
                title={article.title}
                description={article.content.substring(0, 160)}
                canonical={`/blog/${article.slug}`}
                ogImage={article.image}
                ogType="article"
            />

            {/* Header Image Section */}
            <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
                <LazyImage
                    src={article.image || 'https://placehold.co/1200x600/e2e8f0/64748b?text=Article'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    wrapperClassName="h-full w-full"
                />

                {/* Overlay with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />

                <div className="absolute inset-0 z-20 flex flex-col justify-end">
                    <div className="container mx-auto px-4 py-8 md:py-12">
                        <button
                            onClick={() => navigate('/blog')}
                            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 backdrop-blur-md bg-black/30 w-fit px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft size={18} /> უკან დაბრუნება
                        </button>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg max-w-4xl">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm">
                                <Calendar size={16} className="text-gold" />
                                {new Date(article.created_at).toLocaleDateString('ka-GE', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm">
                                <User size={16} className="text-gold" />
                                {article.author || 'Admin'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-30 -mt-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-background rounded-3xl p-6 md:p-12 shadow-2xl border border-border/50">
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground">
                            <ReactMarkdown>{article.content}</ReactMarkdown>
                        </div>

                        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg text-foreground">მოგეწონათ სტატია?</p>
                                <p className="text-sm text-muted-foreground mt-1">გაუზიარეთ მეგობრებს</p>
                            </div>
                            <button
                                onClick={async () => {
                                    const url = window.location.href;
                                    if (navigator.share) {
                                        await navigator.share({ title: article.title, url });
                                    } else {
                                        await navigator.clipboard.writeText(url);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-muted hover:bg-gold/10 hover:text-gold transition-all group"
                            >
                                {copied ? <Check size={20} className="text-green-500" /> : <Share2 size={20} className="group-hover:rotate-12 transition-transform" />}
                                <span className="font-medium">{copied ? 'დაკოპირდა!' : 'გაზიარება'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticleDetail;
