import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EyeIndicator from './EyeIndicator';

export default function NavItem({ to, label, isActive, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={to}
            onClick={onClick}
            className="relative flex items-center group py-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Text and Underline Container */}
            <div className="relative flex flex-col justify-center">
                <motion.span
                    className={`text-sm tracking-[0.2em] font-medium transition-colors duration-300 ${isHovered || isActive ? 'text-white' : 'text-white/60'
                        }`}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {label}
                </motion.span>

                {/* Underline Animation */}
                <motion.div
                    className="absolute -bottom-1 left-0 h-[1px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered || isActive ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />

                {/* Subtle Glow Behind Text */}
                {isHovered && (
                    <motion.div
                        className="absolute inset-0 bg-white/5 blur-md -z-10 rounded-lg"
                        layoutId="nav-glow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </div>

            {/* Eye Indicator */}
            <EyeIndicator isActive={isHovered} />
        </Link>
    );
}
