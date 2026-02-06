import React, { useState, useEffect } from 'react';
import { Video, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm transition-colors duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="group flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-body)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                        aria-label="Toggle Dark Mode"
                    >
                        <div className="relative h-5 w-5">
                            <Sun
                                className={`absolute inset-0 h-full w-full transform transition-all duration-500 ${theme === 'dark' ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                                    }`}
                            />
                            <Moon
                                className={`absolute inset-0 h-full w-full transform transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                                    }`}
                            />
                        </div>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <Video className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
                            VideoSummarizer
                        </span>
                    </div>
                </div>

                {/* Right Side Actions (Placeholder) */}
                <div className="flex items-center gap-4">
                    {/* Add user menu or utility links here if needed */}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
