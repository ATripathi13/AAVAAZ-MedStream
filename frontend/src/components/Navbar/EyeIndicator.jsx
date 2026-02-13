import { motion } from 'framer-motion';

export default function EyeIndicator({ isActive }) {
    return (
        <motion.div
            className="flex items-center space-x-1 ml-3"
            initial={{ opacity: 0, x: -10 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <EyeDot />
            <EyeDot delay={0.1} />
        </motion.div>
    );
}

function EyeDot({ delay = 0 }) {
    return (
        <div className="relative w-2 h-2 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <motion.div
                className="w-1 h-1 bg-black rounded-full"
                animate={{ x: [0, 1, 0, -1, 0], y: [0, -1, 0, 1, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: delay
                }}
            />
        </div>
    );
}
