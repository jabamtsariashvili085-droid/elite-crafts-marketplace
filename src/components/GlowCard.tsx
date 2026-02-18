import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface GlowCardProps {
    article: {
        id: string;
        title: string;
        slug: string;
        image: string;
        author: string;
        created_at: string;
        content: string;
    };
    className?: string;
}

const GlowCard = ({ article, className }: GlowCardProps) => {
    return (
        <Link to={`/blog/${article.slug}`} className={cn("block group relative", className)}>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 1rem rgba(189, 159, 103, 0.4); }
          70% { box-shadow: 0 0 2rem rgba(189, 159, 103, 0.7); }
          100% { box-shadow: 0 0 1rem rgba(189, 159, 103, 0.4); }
        }
        @keyframes glow-slide {
          0% { transform: translate3d(-20%, 0, 0); }
          100% { transform: translate3d(-85%, 0, 0); }
        }
        @keyframes glow-mist {
          0% { transform: translateX(-50%) translateY(0%) scaleY(0.7) rotate(0deg); opacity: 0.2; }
          50% { transform: translateX(0%) translateY(50%) scaleY(-2.3) rotate(20deg); opacity: 0.4; }
          100% { transform: translateX(-50%) translateY(0%) scaleY(0.7) rotate(-20deg); opacity: 0.2; }
        }
        @keyframes glow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />

            <div className="relative p-1 w-full min-h-[400px] box-border bg-transparent backdrop-blur-3xl rounded-[0_2rem] transition-all duration-500 hover:rotate-y-12 group-hover:scale-[1.02] overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(rgba(33, 33, 33, 0.6), rgba(33, 33, 33, 0.9)), linear-gradient(35deg, #1a1a1a 62%, #BD9F67 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    animation: 'glow-pulse 3s infinite'
                }}>

                {/* Background Visuals */}
                <div className="absolute inset-0 z-[-5] opacity-20 pointer-events-none">
                    <div className="flex w-fit animate-[glow-slide_60s_linear_infinite]">
                        <span className="text-[8rem] font-black uppercase text-transparent stroke-white/20 whitespace-nowrap leading-[0.9em]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                            ELITE WORKS BLOG • ELITE WORKS BLOG • ELITE WORKS BLOG •
                        </span>
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative w-full h-full min-h-[390px] overflow-hidden rounded-[0_0.8rem] bg-gradient-to-br from-[#1a1a1a] via-[#262626] to-transparent p-6 flex flex-col justify-end">

                    {/* Top Logo Effect */}
                    <div className="absolute top-4 left-4 w-14 h-14 flex items-center justify-center z-10">
                        <div className="absolute inset-0 animate-[glow-spin_5s_linear_infinite] rounded-full opacity-50"
                            style={{ background: 'conic-gradient(#BD9F67 0%, #fff 10%, #D4AF37 25%, #1a1a1a 50%, #BD9F67 70%, #d4af37 90%)', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
                        <div className="w-[85%] h-[85%] bg-[#1a1a1a] flex items-center justify-center rounded-full z-20" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                            <span className="text-gold font-bold text-xs">EW</span>
                        </div>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-gold/20 backdrop-blur-md border border-gold/30 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10 animate-pulse">
                        FEATURED POST
                    </div>

                    {/* Article Meta */}
                    <div className="space-y-4 relative z-20">
                        <div className="flex items-center gap-4 text-xs text-gold/80 bg-black/40 backdrop-blur-sm w-fit px-3 py-1.5 rounded-full border border-gold/10">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Calendar size={14} className="text-gold" />
                                {new Date(article.created_at).toLocaleDateString('ka-GE')}
                            </span>
                            <span className="w-1 h-1 bg-gold/30 rounded-full" />
                            <span className="flex items-center gap-1.5 font-medium">
                                <User size={14} className="text-gold" />
                                {article.author || 'Admin'}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-lg">
                            {article.title}
                        </h2>

                        <p className="text-gray-300 line-clamp-2 text-sm md:text-base leading-relaxed opacity-90">
                            {article.content.split('\n')[0].substring(0, 120)}...
                        </p>

                        <div className="flex items-center gap-3 text-gold font-bold text-sm group-hover:gap-5 transition-all">
                            კითხვის გაგრძელება
                            <div className="w-8 h-[2px] bg-gold/50 group-hover:w-12 transition-all" />
                            <ArrowRight size={18} />
                        </div>
                    </div>

                    {/* Mist Effect */}
                    <div className="absolute -bottom-10 left-0 w-full h-40 filter blur-[2rem] opacity-30 z-10 pointer-events-none">
                        <div className="w-full h-full animate-[glow-mist_10s_infinite_both]"
                            style={{ background: 'radial-gradient(circle, rgba(189, 159, 103, 0.4) 10%, transparent 60%)' }} />
                    </div>
                </div>

                {/* Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-30 pointer-events-none" />
            </div>
        </Link>
    );
};

export default GlowCard;
