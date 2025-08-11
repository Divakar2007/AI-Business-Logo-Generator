
import React from 'react';
import type { GeneratedResult } from '../types';
import LogoCard from './LogoCard';

interface ResultsGridProps {
  results: GeneratedResult[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {results.map((result, index) => (
        <LogoCard key={`${result.name}-${index}`} result={result} />
      ))}
    </div>
  );
};

export default ResultsGrid;
