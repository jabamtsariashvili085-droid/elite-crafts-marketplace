import { motion } from 'framer-motion';

const HeroBackground = () => {
    return (
        <div className="absolute inset-0 bg-primary overflow-hidden">
            {/* Blueprint Grid Lines */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Animated Blueprint Circles/Paths */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
                <motion.circle
                    cx="20%"
                    cy="30%"
                    r="100"
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.path
                    d="M 0 80 Q 250 10 500 80 T 1000 80"
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.path
                    d="M 100 0 L 100 1000"
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 1, repeat: Infinity }}
                />
            </svg>

            {/* Decorative Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-80 h-80 bg-gold rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-gold rounded-full blur-[120px]"
            />
        </div>
    );
};

export default HeroBackground;
