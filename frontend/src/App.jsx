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

  const handleSummarize = (data) => {
    // In a real app, 'data' would be sent to a backend here.
    // data = { type: 'youtube' | 'file', payload: url | File }
    console.log('Summarizing:', data);

    setViewState('processing');

    // Simulate API delay
    setTimeout(() => {
      // Mock result
      setResultData({
        title: data.type === 'youtube'
          ? "Analysis of YouTube Video: " + data.payload
          : "Summary of Uploaded File: " + data.payload.name,
        duration: "12:34",
        summary: [
          "The video discusses the core principles of the subject matter efficiently.",
          "Key arguments are presented with supporting evidence from recent studies.",
          "The speaker emphasizes the importance of practical application over theory.",
          "Several case studies are analyzed to demonstrate the concepts in action.",
          "Conclusion suggests a shift in industry standards is inevitable."
        ]
      });
      setViewState('result');
    }, 4500); // 4.5s delay to show off the animation states
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
