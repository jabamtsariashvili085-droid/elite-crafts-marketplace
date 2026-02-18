import { motion } from 'framer-motion';

const MobileHeroBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0d0d0d]">
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                    top: '10%',
                    left: '-10%',
                }}
                animate={{
                    x: [0, 40, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-[250px] h-[250px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, #8B6914 0%, transparent 70%)',
                    bottom: '5%',
                    right: '-5%',
                }}
                animate={{
                    x: [0, -30, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-[200px] h-[200px] rounded-full opacity-10"
                style={{
                    background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                    top: '50%',
                    right: '20%',
                }}
                animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -20, 20, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating gold particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gold/30"
                    style={{
                        width: Math.random() * 4 + 2,
                        height: Math.random() * 4 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -(Math.random() * 80 + 40)],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Subtle grid lines */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Diamond shapes floating */}
            {[
                { size: 16, x: '15%', y: '20%', delay: 0 },
                { size: 12, x: '80%', y: '35%', delay: 2 },
                { size: 10, x: '60%', y: '75%', delay: 4 },
                { size: 14, x: '30%', y: '60%', delay: 1 },
            ].map((d, i) => (
                <motion.div
                    key={`diamond-${i}`}
                    className="absolute border border-gold/20"
                    style={{
                        width: d.size,
                        height: d.size,
                        left: d.x,
                        top: d.y,
                        transform: 'rotate(45deg)',
                    }}
                    animate={{
                        rotate: [45, 225, 405],
                        opacity: [0.15, 0.4, 0.15],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        delay: d.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

export default MobileHeroBackground;
