import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="gradient-bg min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-6">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="w-16 h-16 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white opacity-90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0V3m0 18a9 9 0 0 1 9-9h-9a9 9 0 0 0-9 9h9zm0-18a9 9 0 0 0 9 9h-9a9 9 0 0 1-9-9h9z" />
                            <circle cx="12" cy="12" r="2" strokeWidth={1} fill="white" fillOpacity="0.2" />
                        </svg>
                    </div>
                </div>

                {/* Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white uppercase tracking-wider text-sm hover:text-white/80 transition-colors"
                >
                    MENU {menuOpen ? '✕' : '☰'}
                </button>
            </header>

            {/* Sidebar Menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    ></div>

                    {/* Sidebar */}
                    <div className="relative bg-gradient-to-b from-[#1a2b5a] to-[#2d4a8a] w-80 h-full shadow-2xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-6 right-6 text-white text-2xl hover:text-white/80"
                        >
                            ✕
                        </button>

                        {/* Menu Items */}
                        <nav className="flex flex-col items-end space-y-8 pt-24 pr-12">
                            <Link
                                to="/"
                                onClick={() => setMenuOpen(false)}
                                className="text-white text-3xl font-light tracking-wide transition-colors heading-font text-right hover-underline-animation"
                            >
                                HOME
                            </Link>
                            <Link
                                to="/patient-creation"
                                onClick={() => setMenuOpen(false)}
                                className="text-white text-3xl font-light tracking-wide transition-colors heading-font text-right hover-underline-animation"
                            >
                                PATIENT CREATION
                            </Link>
                            <Link
                                to="/speech-transcription"
                                onClick={() => setMenuOpen(false)}
                                className="text-white text-3xl font-light tracking-wide transition-colors heading-font text-right hover-underline-animation"
                            >
                                SPEECH TRANSCRIPTION
                            </Link>
                        </nav>

                        {/* Footer Text */}
                        <div className="absolute bottom-12 right-12 text-white/60 text-xs">
                            <p>© PERSONALIZED WEB PORTAL</p>
                            <p>• MEMBER AREA</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
