import Navbar from './Navbar/Navbar';

export default function Layout({ children }) {
    return (
        <div className="gradient-bg min-h-screen text-white font-body selection:bg-white/20">
            {/* New Navigation Bar */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    );
}
