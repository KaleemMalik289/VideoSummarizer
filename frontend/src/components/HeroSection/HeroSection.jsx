import React, { useState, useEffect } from 'react';

const HeroSection = () => {
    const text = "AI POWERED VIDEO SUMMARIZER";
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer;
        const typeSpeed = isDeleting ? 50 : 100;
        const pauseTime = 2000;

        const handleTyping = () => {
            const currentLength = displayText.length;

            if (!isDeleting && currentLength < text.length) {
                setDisplayText(text.substring(0, currentLength + 1));
            } else if (isDeleting && currentLength > 0) {
                setDisplayText(text.substring(0, currentLength - 1));
            } else {
                if (!isDeleting) {
                    // Finished typing, pause then delete
                    timer = setTimeout(() => setIsDeleting(true), pauseTime);
                    return;
                } else {
                    // Finished deleting, slightly pause then type
                    setIsDeleting(false);
                    return;
                }
            }

            timer = setTimeout(handleTyping, typeSpeed);
        };

        timer = setTimeout(handleTyping, typeSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting]);

    return (
        <div className="mb-12 text-center">
            <div className="h-20 sm:h-24 lg:h-28 flex items-center justify-center mb-4">
                <h1 className="text-xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-main)] whitespace-nowrap">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                        {displayText}
                    </span>
                    <span className="animate-pulse text-indigo-600">|</span>
                </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">
                Stop watching hours of footage. Get the key insights instantly with AI.
                Paste a link or upload a file to get started.
            </p>
        </div>
    );
};

export default HeroSection;
