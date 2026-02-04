import React from 'react';
import './HowToSection.css';

const HowToSection = () => {
    const steps = [
        {
            id: 1,
            title: "Access the Web App",
            description: "Open your browser and navigate to the Video Summarizer web application.",
            stepNumber: 1
        },
        {
            id: 2,
            title: "Upload or Paste",
            description: "Upload a video file (MP4, MOV) or paste a YouTube link in the input area.",
            stepNumber: 2
        },
        {
            id: 3,
            title: "Start Processing",
            description: "Click the 'Summarize Video' button to begin analyzing your video content.",
            stepNumber: 3
        },
        {
            id: 4,
            title: "Wait & Monitor",
            description: "Our backend processes the video, transcribes audio, and generates a summary with status updates.",
            stepNumber: 4
        },
        {
            id: 5,
            title: "View Summary",
            description: "Receive a concise bullet-point summary of the key points from your video.",
            stepNumber: 5
        },
        {
            id: 6,
            title: "Export & Share",
            description: "Download the summary as a text file or copy it to your clipboard for easy sharing.",
            stepNumber: 6
        }
    ];

    return (
        <section className="how-to-use" id="documentation">
            <div className="how-to-container">
                <div className="section-header">
                    <h2 className="section-title">
                        How It Works
                    </h2>
                    <p className="section-subtitle">
                        Get your video summaries in 6 simple steps.
                    </p>
                </div>

                <div className="steps-grid">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="step-card animate"
                            style={{ animationDelay: `${step.id * 150}ms` }}
                        >
                            <div className="step-number-badge">
                                {step.stepNumber}
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">
                                    {step.title}
                                </h3>
                                <p className="step-description">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToSection;
