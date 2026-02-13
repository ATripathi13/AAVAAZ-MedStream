import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, links }) {
    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4 }
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col items-center justify-center"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={32} strokeWidth={1} />
                    </button>

                    {/* Navigation Links */}
                    <nav className="flex flex-col items-center space-y-8">
                        {links.map((link, i) => (
                            <motion.div
                                key={link.to}
                                custom={i}
                                variants={itemVariants}
                            >
                                <Link
                                    to={link.to}
                                    onClick={onClose}
                                    className="text-3xl font-light text-white/80 hover:text-white tracking-[0.2em] transition-colors relative group heading-font"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Footer / Decorative */}
                    <motion.div
                        className="absolute bottom-12 text-white/30 text-xs tracking-widest uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    >
                        Integrated Wealthcare System
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
