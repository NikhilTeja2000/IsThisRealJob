import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { JobAnalysisResult } from '../types/jobAnalysis';
import JobAnalysisDetails from '../components/JobAnalysisDetails';
import '../styles/scrollbar.css';

interface HistoryItem {
  id: string;
  timestamp: string;
  formData: {
    jobTitle: string;
    companyName: string;
    jobLink?: string;
  };
  result: JobAnalysisResult;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    repostingHistory: true,
    communitySentiment: true,
    companyVerification: true,
    jobDetails: true,
    sources: true
  });

  useEffect(() => {
    const storedHistory = localStorage.getItem('jobAnalysisHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      } catch (err) {
        console.error('Error parsing history:', err);
      }
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('jobAnalysisHistory');
      setHistory([]);
      setSelectedItem(null);
    }
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('jobAnalysisHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <div className="flex justify-between items-center mt-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Analysis History</h1>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="glass-button text-white font-medium py-2 px-4 rounded-lg inline-flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <AlertCircle className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No History Found</h3>
              <p className="text-white/60">
                Your job analysis history will appear here. Start by checking a job's legitimacy.
              </p>
              <Link
                to="/check"
                className="glass-button text-white font-medium py-2 px-6 rounded-lg inline-flex items-center mt-4"
              >
                Check a Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* History List */}
              <div className="lg:col-span-1">
                <div className="glass-card p-4">
                  <h2 className="text-lg font-semibold text-white mb-4">Recent Analyses</h2>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className={`relative group w-full text-left p-3 rounded-lg transition-colors cursor-pointer border border-transparent ${
                          selectedItem?.id === item.id
                            ? 'bg-white/10 border-blue-400/40'
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => setSelectedItem(item)}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') setSelectedItem(item); }}
                        aria-selected={selectedItem?.id === item.id}
                      >
                        <div className="flex justify-between items-start">
                          <div className="pr-2 min-w-0">
                            <h3 className="font-medium text-white truncate">
                              {item.formData.jobTitle}
                            </h3>
                            <p className="text-white/60 text-sm truncate">
                              {item.formData.companyName}
                            </p>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              deleteHistoryItem(item.id);
                            }}
                            className="text-white/40 hover:text-red-400 p-1 ml-2 z-10 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                            tabIndex={0}
                            aria-label="Delete analysis"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-white/40 text-xs mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Analysis Details */}
              <div className="lg:col-span-2">
                {selectedItem ? (
                  <div className="glass-card">
                    <div className="p-4 sm:p-8 border-b border-white/10">
                      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                        {selectedItem.formData.jobTitle} at {selectedItem.formData.companyName}
                      </h2>
                      <p className="text-white/60 text-sm">
                        Analyzed on {new Date(selectedItem.timestamp).toLocaleString()}
                      </p>
                      {selectedItem.formData.jobLink && (
                        <a
                          href={selectedItem.formData.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                        >
                          View Original Job Posting
                        </a>
                      )}
                    </div>

                    <JobAnalysisDetails
                      result={selectedItem.result}
                      expandedSections={expandedSections}
                      toggleSection={toggleSection}
                    />
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select an Analysis</h3>
                    <p className="text-white/60">
                      Choose an analysis from the list to view its details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage; 