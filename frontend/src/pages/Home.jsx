export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center fade-in">
            {/* Main Title */}
            {/* Main Title */}
            <h1 className="text-7xl md:text-9xl font-thin text-white tracking-[0.2em] mb-4 heading-font drop-shadow-2xl">
                AAVAAZ
            </h1>

            {/* Subtitle */}
            <h2 className="text-4xl md:text-6xl font-thin text-white/90 tracking-[0.15em] mb-12 heading-font drop-shadow-xl">
                MEDSTREAM
            </h2>

            {/* Description */}
            <p className="text-white/70 text-lg uppercase tracking-widest max-w-2xl font-light border-t border-white/20 pt-8 mx-auto" style={{ letterSpacing: '0.2em' }}>
                Real-time Voice Intelligence for Healthcare
            </p>


        </div>
    );
}
