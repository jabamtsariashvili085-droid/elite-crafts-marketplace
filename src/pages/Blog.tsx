import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import SEO from '@/components/SEO';
import GlowCard from '@/components/GlowCard';
import FlipCard from '@/components/FlipCard';

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown or HTML
    image: string;
    created_at: string;
    author: string;
}

const Blog = () => {
    const { data: articles, isLoading } = useQuery({
        queryKey: ['articles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Article[];
        },
    });

    return (
        <div className="min-h-screen bg-surface pb-20">
            <SEO
                title="ბლოგი - Elite Works"
                description="სიახლეები, რჩევები და სტატიები ქვისა და ავეჯის შესახებ"
                canonical="/blog"
            />

            <div className="bg-gold-gradient py-16 text-accent-foreground text-center">
                <h1 className="text-4xl font-bold mb-4">ბლოგი & სიახლეები</h1>
                <p className="text-lg opacity-90 max-w-2xl mx-auto px-4">
                    გაიგეთ მეტი გრანიტის მოვლის, ინტერიერის დიზაინისა და თანამედროვე ტენდენციების შესახებ
                </p>
            </div>

            <div className="container mx-auto px-4 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : articles && articles.length > 0 ? (
                    <div className="space-y-12">
                        {/* Featured Latest Post */}
                        <div className="max-w-5xl mx-auto">
                            <GlowCard article={articles[0]} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                            {articles.slice(1).map((article) => (
                                <Link
                                    to={`/blog/${article.slug}`}
                                    key={article.id}
                                    className="flex justify-center"
                                >
                                    <FlipCard
                                        title={article.title}
                                        description={article.content.substring(0, 100) + "..."}
                                        badge="სტატია"
                                        image={article.image || 'https://placehold.co/600x400/e2e8f0/64748b?text=Article'}
                                        footer={`${new Date(article.created_at).toLocaleDateString('ka-GE')} | ${article.author || 'Admin'}`}
                                        className="w-full"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">სტატიები ჯერ არ დამატებულა.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
