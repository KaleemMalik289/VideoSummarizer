import React, { useState } from 'react';
import { Copy, Download, CheckCircle, Clock, Video, ChevronRight, Check } from 'lucide-react';

const ResultsCard = ({ result }) => {
    const [copied, setCopied] = useState(false);

    // Default/Dummy data if no result passed
    const data = result || {
        title: "Understanding Quantum Computing in 10 Minutes",
        duration: "10:24",
        summary: [
            "Quantum computers use qubits instead of bits, allowing for superposition states.",
            "Key applications include cryptography breaking and complex molecular styling.",
            "The 'observer effect' is a fundamental principle where measurement affects state.",
            "Current challenges involve maintaining quantum coherence at room temperatures.",
            "Major tech companies like Google and IBM are racing for quantum supremacy."
        ]
    };

    const handleCopy = () => {
        const text = `Title: ${data.title}\n\nSummary:\n${data.summary.map(s => `- ${s}`).join('\n')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const text = `Title: ${data.title}\n\nSummary:\n${data.summary.map(s => `- ${s}`).join('\n')}`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                                {data.title}
                            </h2>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {data.duration}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Video className="w-4 h-4" />
                                    Video Source
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <ul className="space-y-4">
                        {data.summary.map((point, index) => (
                            <li key={index} className="flex gap-4 text-gray-700 leading-relaxed">
                                <span className="flex-shrink-0 mt-1 text-indigo-600">
                                    <ChevronRight className="w-5 h-5" />
                                </span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-200">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy to Clipboard
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download .txt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsCard;
