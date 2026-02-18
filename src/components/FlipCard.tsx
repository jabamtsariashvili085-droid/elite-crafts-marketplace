import React from 'react';
import { cn } from '@/lib/utils';
import LazyImage from './LazyImage';

interface FlipCardProps {
  title: string;
  description: string;
  badge?: string;
  image?: string;
  footer?: string;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  title,
  description,
  badge,
  image,
  footer,
  className
}) => {
  return (
    <div className={cn("flip-card-container group inline-block", className)}>
      <div className="flip-card-inner relative w-[280px] h-[400px]">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="flip-card-image-wrapper">
            {image ? (
              <LazyImage src={image} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                <div className="floating-circle" id="circle-1"></div>
                <div className="floating-circle" id="circle-2"></div>
              </div>
            )}
          </div>

          <div className="flip-card-front-content">
            {badge && <span className="flip-card-badge">{badge}</span>}
            <div className="flip-card-footer-info">
              <h3 className="flip-card-title">{title}</h3>
              {footer && <p className="flip-card-meta">{footer}</p>}
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="flip-card-back-content">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#BD9F67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gold uppercase tracking-wider">{title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {description}
            </p>
            <div className="mt-4 px-6 py-2 bg-gold text-black font-bold rounded-full text-xs hover:bg-white transition-colors cursor-pointer text-center">
              დაწვრილებით
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
