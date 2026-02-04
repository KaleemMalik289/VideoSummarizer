import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import HeroSection from './components/HeroSection/HeroSection';
import InputSection from './components/InputSection/InputSection';
import ProcessingView from './components/ProcessingView/ProcessingView';
import ResultsCard from './components/ResultsCard/ResultsCard';
import HowToSection from './components/HowToSection/HowToSection';

function App() {
  const [viewState, setViewState] = useState('input'); // 'input', 'processing', 'result'
  const [resultData, setResultData] = useState(null);

  const [error, setError] = useState(null);

  const handleSummarize = async (data) => {
    setViewState('processing');
    setError(null);
    setResultData(null);

    const formData = new FormData();
    if (data.type === 'youtube') {
      formData.append('youtube_url', data.payload);
    } else {
      formData.append('file', data.payload);
    }

    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate summary');
      }

      const result = await response.json();

      // Parse markdown summary into array for ResultsCard
      // Backend returns string with ** ** for bolding. We can keep it or clean it.
      // ResultsCard expects array of strings.
      const summaryArray = result.summary
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().length > 0)
        .map(line => line.replace(/^[\*\-]\s*/, '').trim()); // Remove list markers

      setResultData({
        title: result.title,
        duration: "Analyzed", // Backend doesn't return duration yet
        summary: summaryArray.length > 0 ? summaryArray : [result.summary]
      });

      setViewState('result');
    } catch (err) {
      console.error("Summarization error:", err);
      setError(err.message);
      setViewState('input'); // Or stays in processing with error? Better to go back or show error.
      alert(`Error: ${err.message}`); // Simple alert for now
    }
  };

  const handleCancel = () => {
    setViewState('input');
    setResultData(null);
  };

  const handleReset = () => {
    setViewState('input');
    setResultData(null);
  };

  return (
    <Layout>
      {viewState === 'input' && (
        <div className="animate-in fade-in zoom-in-95 duration-500 space-y-20">
          <div>
            <HeroSection />
            <InputSection onSummarize={handleSummarize} />
          </div>
          <HowToSection />
        </div>
      )}

      {viewState === 'processing' && (
        <div className="flex justify-center py-12 animate-in fade-in zoom-in-95 duration-500">
          <ProcessingView onCancel={handleCancel} />
        </div>
      )}

      {viewState === 'result' && resultData && (
        <div className="space-y-8">
          <div className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <button
              onClick={handleReset}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-4 inline-flex items-center"
            >
              &larr; Analyze Another Video
            </button>
          </div>
          <ResultsCard result={resultData} />
        </div>
      )}
    </Layout>
  );
}

export default App;
