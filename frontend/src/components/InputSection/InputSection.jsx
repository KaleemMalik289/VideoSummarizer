import React, { useState } from 'react';
import { Youtube, Upload, FileVideo, ArrowRight, LinkIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const InputSection = ({ onSummarize }) => {
    const [activeTab, setActiveTab] = useState('youtube'); // 'youtube' | 'file'
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeTab === 'youtube' && url) {
            onSummarize({ type: 'youtube', payload: url });
        } else if (activeTab === 'file' && file) {
            onSummarize({ type: 'file', payload: file });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('video/')) {
                setFile(droppedFile);
            } else {
                alert('Please upload a video file.');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
                    <button
                        onClick={() => setActiveTab('youtube')}
                        className={twMerge(
                            "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                            activeTab === 'youtube'
                                ? "bg-[var(--primary)] text-white shadow-sm"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                        )}
                    >
                        <Youtube className="w-4 h-4 mr-2" />
                        YouTube URL
                    </button>
                    <button
                        onClick={() => setActiveTab('file')}
                        className={twMerge(
                            "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                            activeTab === 'file'
                                ? "bg-[var(--primary)] text-white shadow-sm"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                        )}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm p-6 transition-colors duration-300">
                {activeTab === 'youtube' ? (
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <input
                                type="url"
                                className="block w-full pl-11 pr-32 py-4 bg-[var(--bg-body)] border border-[var(--border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                placeholder="Paste YouTube Link (e.g. https://youtube.com/...)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={!url}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                            >
                                Summarize
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={twMerge(
                                "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:bg-[var(--bg-body)]",
                                isDragOver ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]",
                                file ? "bg-[var(--primary)]/5 border-[var(--primary)]/30" : ""
                            )}
                        >
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="space-y-2 pointer-events-none">
                                <div className="flex justify-center">
                                    {file ? (
                                        <div className="h-12 w-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)]">
                                            <FileVideo className="h-6 w-6" />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 bg-[var(--bg-body)] rounded-full flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border)]">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                {file ? (
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-main)]">{file.name}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-main)]">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)]">MP4, MOV, or WEBM (max 500MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!file}
                            className="w-full py-3.5 bg-[var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center"
                        >
                            <span>Summarize Video</span>
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputSection;
