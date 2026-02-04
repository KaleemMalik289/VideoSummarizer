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
                <div className="inline-flex p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab('youtube')}
                        className={twMerge(
                            "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                            activeTab === 'youtube'
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900"
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
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900"
                        )}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                {activeTab === 'youtube' ? (
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <input
                                type="url"
                                className="block w-full pl-11 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                placeholder="Paste YouTube Link (e.g. https://youtube.com/...)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={!url}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center"
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
                                "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:bg-gray-50",
                                isDragOver ? "border-indigo-500 bg-indigo-50/50" : "border-gray-200",
                                file ? "bg-indigo-50/30 border-indigo-200" : ""
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
                                        <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <FileVideo className="h-6 w-6" />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                {file ? (
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">MP4, MOV, or WEBM (max 500MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!file}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center"
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
