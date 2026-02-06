import React from 'react';
import Navbar from '../Navbar/Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border)] bg-[var(--bg-card)] py-8 transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-sm text-[var(--text-secondary)]">
                        &copy; {new Date().getFullYear()} VideoSummarizer. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
