import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HardHat } from 'lucide-react';

interface CraftsmanDeliverProps {
    children: React.ReactNode;
    from: 'left' | 'right';
    delay?: number;
    duration?: number;
    className?: string;
}

const WorkerCharacter = ({ effort, from }: { effort: boolean; from: 'left' | 'right' }) => (
    <motion.div
        className="flex flex-col items-center"
        animate={effort ? {
            skewX: from === 'left' ? [0, -15, 0] : [0, 15, 0],
            x: from === 'left' ? [0, 5, 0] : [0, -5, 0]
        } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
    >
        {/* Head */}
        <div className="w-4 h-4 rounded-full bg-gold relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <HardHat size={12} className="text-primary-foreground fill-gold" />
            </div>
        </div>
        {/* Body & Arms in pushing/pulling pose */}
        <motion.svg
            width="30"
            height="40"
            viewBox="0 0 30 40"
            fill="none"
            className="text-gold"
        >
            <path
                d={from === 'left'
                    ? "M15 10 L15 25 M15 15 L5 20 M15 15 L5 12 M15 25 L8 35 M15 25 L22 35" // Pushing pose
                    : "M15 10 L15 25 M15 15 L25 20 M15 15 L25 12 M15 25 L8 35 M15 25 L22 35" // Pulling pose
                }
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </motion.svg>
    </motion.div>
);

const CraftsmanDeliver = ({ children, from, delay = 0, duration = 2, className = "" }: CraftsmanDeliverProps) => {
    const [isFinished, setIsFinished] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), delay * 1000);
        return () => clearTimeout(timer);
    }, [delay]);

    const initialX = from === 'left' ? -350 : 350;

    return (
        <div className={`relative ${className} ${!show ? 'opacity-0' : 'opacity-100'}`}>
            <motion.div
                initial={{ x: initialX, opacity: 0 }}
                animate={show ? { x: 0, opacity: 1 } : {}}
                transition={{ duration, ease: "linear" }}
                onAnimationComplete={() => setIsFinished(true)}
                className="relative flex items-center"
            >
                {from === 'right' && !isFinished && show && (
                    <div className="mr-2">
                        <WorkerCharacter effort={true} from="right" />
                    </div>
                )}

                {children}

                {from === 'left' && !isFinished && show && (
                    <div className="ml-2">
                        <WorkerCharacter effort={true} from="left" />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CraftsmanDeliver;
