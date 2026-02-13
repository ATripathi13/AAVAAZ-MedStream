import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NavItem from './NavItem';
import MobileMenu from './MobileMenu';

const LINKS = [
    { to: '/', label: 'HOME' },
    { to: '/patient-creation', label: 'PATIENTS' },
    { to: '/speech-transcription', label: 'TRANSCRIPTION' },
];

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const { scrollY } = useScroll();

    // Background blur/opacity based on scroll
    const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
    const backdropBlur = useTransform(scrollY, [0, 50], ["0px", "12px"]);

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex items-center justify-between border-b border-white/5 transition-colors"
                style={{
                    backgroundColor: `rgba(15, 23, 42, ${bgOpacity.get()})`,
                    backdropFilter: `blur(${backdropBlur.get()})`
                }}
            >
                {/* Logo */}
                <div className="flex items-center space-x-4 cursor-pointer group">
                    <div className="w-10 h-10 flex items-center justify-center relative">
                        <motion.svg
                            className="w-10 h-10 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0V3m0 18a9 9 0 0 1 9-9h-9a9 9 0 0 0-9 9h9zm0-18a9 9 0 0 0 9 9h-9a9 9 0 0 1-9-9h9z" />
                            <circle cx="12" cy="12" r="2" strokeWidth={1} fill="white" fillOpacity="0.2" />
                        </motion.svg>

                        {/* Subtle glow behind logo */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="hidden md:flex flex-col">
                        <span className="text-white tracking-[0.2em] font-light text-sm heading-font">AAVAAZ</span>
                        <span className="text-white/50 tracking-[0.1em] text-[10px] uppercase">MedStream</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-12">
                    {LINKS.map((link) => (
                        <NavItem
                            key={link.to}
                            to={link.to}
                            label={link.label}
                            isActive={location.pathname === link.to}
                        />
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-white/80 transition-colors"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <Menu size={28} strokeWidth={1} />
                </button>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <MobileMenu
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                links={LINKS}
            />
        </>
    );
}
