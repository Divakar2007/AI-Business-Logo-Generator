
import React, { useState, useCallback } from 'react';
import type { GeneratedResult, UserInput } from './types';
import { generateBusinessIdeas } from './services/geminiService';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import ResultsGrid from './components/ResultsGrid';
import { SpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const generatedData = await generateBusinessIdeas(userInput);
      setResults(generatedData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-dark-text-secondary mb-8 text-lg">
            Describe your business idea, and our AI will generate unique names and stunning logos in seconds.
          </p>
          <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="text-center mt-12 flex flex-col items-center justify-center">
             <SpinnerIcon className="w-16 h-16 text-brand-primary" />
            <p className="mt-4 text-xl text-dark-text-secondary animate-pulse">
              Generating creative ideas... this may take a moment.
            </p>
          </div>
        )}

        {error && (
          <div className="text-center mt-12 max-w-2xl mx-auto">
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Oops! Something went wrong.</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Your Creative Ideas</h2>
            <ResultsGrid results={results} />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-dark-text-secondary text-sm">
          <p>Powered by Google Gemini. Designed by a world-class senior frontend React engineer.</p>
      </footer>
    </div>
  );
};

export default App;
