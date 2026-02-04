import React, { useState, useEffect } from 'react';
import { Loader2, XCircle } from 'lucide-react';

const ProcessingView = ({ onCancel }) => {
    const [statusText, setStatusText] = useState('Extracting Audio...');
    const steps = [
        'Extracting Audio...',
        'Transcribing Audio...',
        'Analyzing Context...',
        'Generating Summary...',
        'Finalizing Results...'
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep = (currentStep + 1) % steps.length;
            setStatusText(steps[currentStep]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 py-12">
                <div className="relative flex justify-center mb-6">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-sm border border-indigo-100">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Processing Video
                </h3>
                <p className="text-gray-500 mb-8 h-6 transition-all duration-300 ease-in-out">
                    {statusText}
                </p>

                <button
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ProcessingView;
