import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Hammer, HardHat, Pickaxe } from 'lucide-react';

interface CraftsmanTextProps {
    text: string;
    className?: string;
    delay?: number;
    onComplete?: () => void;
    as?: 'h1' | 'p' | 'span';
}

const WorkerCharacter = ({ tool: ToolIcon }: { tool: any }) => (
    <motion.div
        className="flex flex-col items-center"
        animate={{
            rotate: [0, -20, 0],
            y: [0, -5, 0]
        }}
        transition={{ repeat: Infinity, duration: 0.4 }}
    >
        <div className="w-3 h-3 rounded-full bg-gold relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <HardHat size={8} className="text-primary-foreground fill-gold" />
            </div>
        </div>
        <div className="w-0.5 h-3 bg-gold relative">
            <motion.div
                className="absolute top-0 right-full pr-1 text-gold"
                animate={{ rotate: [0, -45, 0] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
            >
                <ToolIcon size={12} />
            </motion.div>
        </div>
    </motion.div>
);

const CraftsmanText = ({ text, className = "", delay = 0, onComplete, as: Component = 'span' }: CraftsmanTextProps) => {
    const [visibleChars, setVisibleChars] = useState<number>(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            let current = 0;
            const interval = setInterval(() => {
                current += 1;
                setVisibleChars(current);
                if (current >= text.length) {
                    clearInterval(interval);
                    setIsFinished(true);
                    onComplete?.();
                }
            }, 70); // Slightly slower for more "work" feel
            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(startTimeout);
    }, [text, delay, onComplete]);

    // Icons that "work" on the text
    const workers = [Hammer, Pickaxe];
    const ToolIcon = workers[Math.floor(Math.random() * workers.length)];

    return (
        <div className={`relative inline-block ${className}`}>
            <Component className="relative z-10">
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{
                            opacity: i < visibleChars ? 1 : 0,
                            scale: i < visibleChars ? 1 : 0.5,
                            y: i < visibleChars ? 0 : 10
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                        {char}
                    </motion.span>
                ))}
            </Component>

            {/* The Worker Character following the text build */}
            {!isFinished && visibleChars < text.length && (
                <motion.div
                    className="absolute z-20 pointer-events-none"
                    animate={{
                        x: `${(visibleChars / text.length) * 100}%`,
                    }}
                    transition={{
                        x: { duration: 0.05, ease: "linear" },
                    }}
                    style={{ top: '-1.2rem', left: '0' }}
                >
                    <WorkerCharacter tool={ToolIcon} />
                </motion.div>
            )}
        </div>
    );
};

export default CraftsmanText;
