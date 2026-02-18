import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import FlipCard from '@/components/FlipCard';
import { motion } from 'framer-motion';

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
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
        <div className="min-h-screen pb-20">
            <SEO
                title="ბლოგი - Elite Works"
                description="სიახლეები, რჩევები და სტატიები ქვისა და ავეჯის შესახებ"
                canonical="/blog"
            />

            {/* Premium Header Section */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-4 relative z-10 text-center"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gold drop-shadow-lg uppercase tracking-tighter">
                        ბლოგი <span className="text-white">&</span> სიახლეები
                    </h1>
                    <div className="w-24 h-1 bg-gold mx-auto mb-8 rounded-full" />
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4 font-light leading-relaxed">
                        აღმოაჩინეთ უახლესი ტენდენციები, ექსკლუზიური რჩევები და პროფესიონალური მიდგომები ქვისა და ავეჯის სამყაროში.
                    </p>
                </motion.div>
            </div>

            {/* Articles Grid */}
            <div className="container mx-auto px-4 py-20">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse border border-white/10" />
                        ))}
                    </div>
                ) : articles && articles.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center"
                    >
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                className="w-full max-w-[300px]"
                            >
                                <Link to={`/blog/${article.slug}`}>
                                    <FlipCard
                                        title={article.title}
                                        description={(article.content || "").replace(/<[^>]*>/g, '').substring(0, 140) + "..."}
                                        badge="პრემიუმ სტატია"
                                        image={article.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop'}
                                        footer={`${new Date(article.created_at).toLocaleDateString('ka-GE')} | Elite Works`}
                                        className="w-full"
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <p className="text-gray-400 text-xl font-light">სტატიები ჯერ არ დამატებულა.</p>
                        <Link to="/" className="mt-8 inline-block text-gold hover:text-white transition-colors underline decoration-gold/30">
                            დაბრუნდით მთავარზე
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
