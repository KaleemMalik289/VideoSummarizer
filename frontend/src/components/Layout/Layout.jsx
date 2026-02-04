import React from 'react';
import { Video } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <Video className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            VideoDiscovery
                        </span>
                    </div>
                    {/* Optional: Add user menu or utility links here */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-8">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} VideoDiscovery. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
