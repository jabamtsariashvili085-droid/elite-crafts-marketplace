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
            <style dangerouslySetInnerHTML={{
                __html: `
        .flip-card-inner {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
          border-radius: 12px;
        }

        .flip-card-container:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          background-color: #151515;
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(189, 159, 103, 0.2);
        }

        .flip-card-back {
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
        }

        .flip-card-back::before {
          position: absolute;
          content: " ";
          display: block;
          width: 160px;
          height: 160%;
          background: linear-gradient(
            90deg,
            transparent,
            #BD9F67,
            #D4AF37,
            #BD9F67,
            transparent
          );
          animation: rotation_481 5000ms infinite linear;
          z-index: -1;
          opacity: 0.3;
        }

        .flip-card-back-content {
          position: absolute;
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          background-color: #151515;
          border-radius: 10px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 1.5rem;
          z-index: 1;
        }

        @keyframes rotation_481 {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }

        .flip-card-front {
          color: white;
          display: flex;
          flex-direction: column;
        }

        .flip-card-image-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .flip-card-front-content {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 10;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
        }

        .flip-card-badge {
          background-color: rgba(189, 159, 103, 0.2);
          color: #BD9F67;
          border: 1px solid rgba(189, 159, 103, 0.4);
          padding: 4px 12px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          width: fit-content;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .flip-card-footer-info {
           box-shadow: 0px 4px 15px rgba(0,0,0,0.5);
           width: 100%;
           padding: 12px;
           background-color: rgba(0,0,0,0.7);
           backdrop-filter: blur(8px);
           border-radius: 8px;
           border: 1px solid rgba(189, 159, 103, 0.1);
        }

        .flip-card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }

        .flip-card-meta {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          margin-top: 4px;
        }

        .floating-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #BD9F67;
          position: absolute;
          filter: blur(20px);
          opacity: 0.4;
          animation: floating 3s infinite ease-in-out;
        }

        #circle-1 { left: -20px; top: -20px; background-color: #BD9F67; }
        #circle-2 { right: -30px; bottom: 20px; width: 100px; height: 100px; background-color: #D4AF37; animation-delay: -1s; }

        @keyframes floating {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 15px); }
        }
      `}} />

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
                        <div className="mt-4 px-6 py-2 bg-gold text-black font-bold rounded-full text-xs hover:bg-white transition-colors cursor-pointer">
                            დაწვრილებით
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
