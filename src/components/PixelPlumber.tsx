import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PixelPlumberProps {
    state: 'idle' | 'moving' | 'jumping' | 'exit';
    color: 'red' | 'blue';
    direction?: 'left' | 'right';
    className?: string;
}

const PixelPlumber = ({ state, color, direction = 'right', className = "" }: PixelPlumberProps) => {
    const isRed = color === 'red';
    const mainColor = isRed ? '#ef4444' : '#3b82f6'; // Red or Blue
    const secondaryColor = '#1f2937'; // Dark overalls
    const skinColor = '#ffdbac';

    return (
        <div className={`relative ${className}`} style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}>
            <motion.div
                animate={state === 'moving' ? {
                    y: [0, -4, 0],
                } : state === 'jumping' ? {
                    y: [0, -40, 0],
                    rotate: [0, -10, 0]
                } : state === 'exit' ? {
                    y: [0, 40],
                    opacity: [1, 0]
                } : {}}
                transition={{
                    y: {
                        repeat: state === 'moving' ? Infinity : 0,
                        duration: state === 'moving' ? 0.2 : 0.6,
                        ease: state === 'exit' ? "easeIn" : "easeInOut"
                    },
                    rotate: { duration: 0.6 }
                }}
                className="w-8 h-10 flex flex-col items-center"
            >
                {/* Cap */}
                <div className="w-6 h-2 rounded-t-sm" style={{ backgroundColor: mainColor }} />

                {/* Head */}
                <div className="w-5 h-3 flex items-end justify-center" style={{ backgroundColor: skinColor }}>
                    <div className="w-1 h-1 bg-black mb-1 mr-1" /> {/* Eye */}
                    <div className="w-2 h-1 bg-amber-900 mb-1" /> {/* Moustache (simulated) */}
                </div>

                {/* Body (Overalls) */}
                <div className="w-6 h-4 relative" style={{ backgroundColor: secondaryColor }}>
                    <div className="absolute top-0 left-1 w-1 h-3" style={{ backgroundColor: mainColor }} />
                    <div className="absolute top-0 right-1 w-1 h-3" style={{ backgroundColor: mainColor }} />
                    {/* Buttons */}
                    <div className="absolute top-2 left-1.5 w-0.5 h-0.5 bg-yellow-400" />
                    <div className="absolute top-2 right-1.5 w-0.5 h-0.5 bg-yellow-400" />
                </div>

                {/* Legs */}
                <div className="flex gap-1">
                    <motion.div
                        animate={state === 'moving' ? { height: [4, 2, 4] } : {}}
                        transition={{ repeat: Infinity, duration: 0.2 }}
                        className="w-2 h-1 bg-slate-900"
                    />
                    <motion.div
                        animate={state === 'moving' ? { height: [2, 4, 2] } : {}}
                        transition={{ repeat: Infinity, duration: 0.2 }}
                        className="w-2 h-1 bg-slate-900"
                    />
                </div>

                {/* Arm for Jumping */}
                {state === 'jumping' && (
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: -15 }}
                        className="absolute -top-2 right-0 w-1.5 h-4 bg-red-500 rounded-full"
                        style={{ backgroundColor: mainColor }}
                    />
                )}
            </motion.div>

            {/* Warp Pipe (only appears during exit) */}
            <AnimatePresence>
                {state === 'exit' && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        className="absolute top-8 left-1/2 -translate-x-1/2 w-10 origin-top z-[-1]"
                    >
                        <div className="h-2 w-12 -ml-1 bg-green-600 border-2 border-green-800 rounded-sm" />
                        <div className="h-10 w-10 bg-green-500 border-x-2 border-green-800" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PixelPlumber;
