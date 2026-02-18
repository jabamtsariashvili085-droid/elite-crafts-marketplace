import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PremiumServiceCardProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    to: string;
    className?: string;
}

const PremiumServiceCard = ({ title, subtitle, icon: Icon, to, className }: PremiumServiceCardProps) => {
    return (
        <Link to={to} className={cn("block group", className)}>
            <motion.div
                className="relative w-full aspect-[3/2] bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-card hover:shadow-2xl hover:shadow-gold/10 group active:scale-95"
            >
                {/* Animated Border */}
                <div className="absolute inset-4 border-2 border-gold/50 opacity-0 -rotate-6 transition-all duration-700 group-hover:opacity-100 group-hover:rotate-0 group-hover:inset-5 rounded-xl z-20 pointer-events-none" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {/* Logo/Icon Container */}
                    <div className="relative h-12 w-full flex items-center justify-center mb-4 transition-all duration-700 group-hover:w-[180px]">
                        <div className="flex items-center gap-3 transition-all duration-700 overflow-hidden px-4">
                            <div className="shrink-0">
                                <Icon size={32} className="text-gold transition-transform duration-500 group-hover:scale-110" />
                            </div>

                            <div className="flex flex-col items-start opacity-0 -translate-x-10 transition-all duration-700 delay-100 group-hover:opacity-100 group-hover:translate-x-0">
                                <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                                    <span className="text-gold">Elite</span> <span className="text-foreground">Works</span>
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
                                    {subtitle}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Text - Appears on Hover */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 delay-200 group-hover:opacity-100 group-hover:bottom-8">
                        <span className="text-xs uppercase tracking-[0.5em] text-gold font-medium">
                            გაიგე მეტი
                        </span>
                    </div>

                    {/* Initial Title - Moves or fades on hover */}
                    <div className="transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-4">
                        <h3 className="text-xl font-bold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                    </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
        </Link>
    );
};

export default PremiumServiceCard;
