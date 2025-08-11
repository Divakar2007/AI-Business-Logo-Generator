
import React, { useState } from 'react';
import type { UserInput } from '../types';
import { SpinnerIcon } from './icons';

interface GeneratorFormProps {
  onGenerate: (userInput: UserInput) => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [industry, setIndustry] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (industry.trim() && !isLoading) {
      onGenerate({ industry, preferences });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-dark-card p-8 rounded-xl shadow-2xl border border-dark-border">
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-dark-text-secondary mb-2">
          What is your industry or business area?
        </label>
        <input
          type="text"
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g., Artisan coffee shop, AI tech startup"
          className="w-full bg-gray-900 border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
          required
        />
      </div>
      <div>
        <label htmlFor="preferences" className="block text-sm font-medium text-dark-text-secondary mb-2">
          Describe your desired style (optional)
        </label>
        <input
          type="text"
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="e.g., minimalist, eco-friendly, bold colors"
          className="w-full bg-gray-900 border border-dark-border rounded-lg px-4 py-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !industry.trim()}
        className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 shadow-lg"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5 mr-3" />
            Generating...
          </>
        ) : (
          'Generate Ideas'
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;
