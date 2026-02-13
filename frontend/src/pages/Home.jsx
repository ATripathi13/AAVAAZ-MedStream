export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center fade-in">
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-light text-white tracking-wider mb-6 heading-font">
                AAVAAZ
            </h1>

            {/* Subtitle */}
            <h2 className="text-4xl md:text-5xl font-light text-white/90 tracking-wider mb-8 heading-font">
                INTEGRATED WEALTHCARE
            </h2>

            {/* Description */}
            <p className="text-white/70 text-lg max-w-md mb-12">
                Collaborative Wealth Management for the Medical Community
            </p>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-12">
                <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
                    SCROLL DOWN
                </p>
                <div className="flex justify-center">
                    <svg
                        className="w-6 h-6 text-white/50 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
