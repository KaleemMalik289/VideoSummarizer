import React, { useState, useEffect } from 'react';
import { Copy, Download, CheckCircle, Clock, Video, ChevronRight, Check, FileText } from 'lucide-react';

const ResultsCard = ({ result }) => {
    const [copied, setCopied] = useState(false);
    const [parsedData, setParsedData] = useState({ overview: "", topics: [] });

    // Default/Dummy data if no result passed
    const data = result || {
        title: "Understanding Quantum Computing",
        duration: "10:24",
        summary: "**1. Executive Overview:**\nQuantum computing represents a paradigm shift... \n\n**2. Main Topics Discussed:**\n* **Qubits:** Explaining superposition.\n* **Entanglement:** Einstein's spooky action."
    };

    useEffect(() => {
        if (data.summary) {
            setParsedData(parseSummaryContent(data.summary));
        }
    }, [data.summary]);

    // Helper to separate sections based on specific headers
    const parseSummaryContent = (text) => {
        if (!text) return { overview: "", topics: [] };

        // Check for the "Video Content Analyst" structure
        if (text.includes("Executive Overview:") || text.includes("Main Topics Discussed:")) {
            // Regex to capture content between headers
            // 1. Overview
            const overviewPattern = /(?:\*\*1\. Executive Overview:\*\*|Executive Overview:)\s*([\s\S]*?)(?=(?:\*\*2\. Main Topics Discussed:\*\*|Main Topics Discussed:)|$)/i;
            const overviewMatch = text.match(overviewPattern);

            // 2. Topics
            const topicsPattern = /(?:\*\*2\. Main Topics Discussed:\*\*|Main Topics Discussed:)\s*([\s\S]*)/i;
            const topicsMatch = text.match(topicsPattern);

            const overview = overviewMatch ? overviewMatch[1].trim() : "";
            const topicsRaw = topicsMatch ? topicsMatch[1].trim() : "";

            // Parse bullet points
            const topics = topicsRaw.split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('*') || line.startsWith('-'))
                .map(line => line.replace(/^[\*\-]\s*/, '')); // Remove marker

            return { overview, topics };
        }

        // Fallback for simple list or plain text
        const isList = text.trim().startsWith('*') || text.trim().startsWith('-');
        if (isList) {
            const topics = text.split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('*') || line.startsWith('-'))
                .map(line => line.replace(/^[\*\-]\s*/, ''));
            return { overview: "", topics };
        }

        // Fallback: Treat as one big overview
        return {
            overview: text,
            topics: []
        };
    };

    const parseBoldText = (text) => {
        // Split by ** to find bold parts
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2); // Remove **
                return <strong key={index} className="font-bold text-gray-900">{content}</strong>;
            }
            return part;
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(data.summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const text = `Title: ${data.title}\nPrepared by Video Summarizer AI\n\n${data.summary}`;
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
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                <Video className="w-3 h-3 mr-1" />
                                Video Source
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                {data.duration}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                            {data.title}
                        </h2>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8 md:p-10 space-y-10">

                    {/* Executive Overview */}
                    {parsedData.overview && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Executive Overview
                            </h3>
                            <div className="text-gray-800 text-3xl leading-relaxed font-sans">
                                {parseBoldText(parsedData.overview)}
                            </div>
                        </section>
                    )}

                    {/* Divider if both exist */}
                    {parsedData.overview && parsedData.topics.length > 0 && (
                        <hr className="border-gray-100" />
                    )}

                    {/* Main Topics */}
                    {parsedData.topics.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Key Topics
                            </h3>
                            <ul className="space-y-6">
                                {parsedData.topics.map((point, index) => (
                                    <li key={index} className="group flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                                        </div>
                                        <div className="text-gray-700 text-2xl leading-relaxed">
                                            {parseBoldText(point)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Fallback if parsing failed but we have data */}
                    {!parsedData.overview && parsedData.topics.length === 0 && (
                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {parseBoldText(data.summary)}
                        </div>
                    )}
                </div>

                {/* Footer / Toolbar */}
                <div className="bg-gray-50 border-t border-gray-100 px-8 py-5 flex items-center justify-end gap-3">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 focus:outline-none transition-all shadow-sm"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Text
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Summary
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsCard;
