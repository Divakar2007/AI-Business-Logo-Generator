
import React from 'react';
import type { GeneratedResult } from '../types';
import { DownloadIcon } from './icons';

interface LogoCardProps {
  result: GeneratedResult;
}

const LogoCard: React.FC<LogoCardProps> = ({ result }) => {
  const { name, description, pngBase64, svgCode } = result;

  const handleDownload = (format: 'png' | 'svg') => {
    const link = document.createElement('a');
    
    if (format === 'png') {
        if (!pngBase64) return;
        link.href = `data:image/png;base64,${pngBase64}`;
        link.download = `${name.replace(/\s+/g, '_')}_logo.png`;
    } else {
        if (!svgCode) return;
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        link.href = URL.createObjectURL(blob);
        link.download = `${name.replace(/\s+/g, '_')}_logo.svg`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (format === 'svg') {
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-brand-primary/50">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-dark-text-primary text-center">{name}</h3>
        <p className="text-sm text-dark-text-secondary text-center mt-1 h-10">{description}</p>
      </div>
      
      <div className="bg-gray-800 aspect-square flex items-center justify-center p-4">
        {pngBase64 ? (
          <img src={`data:image/png;base64,${pngBase64}`} alt={`${name} Logo`} className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="text-dark-text-secondary">Logo not available</div>
        )}
      </div>

      <div className="p-6 bg-gray-900/50">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleDownload('png')}
            disabled={!pngBase64}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download PNG
          </button>
          <button
            onClick={() => handleDownload('svg')}
            disabled={!svgCode}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-brand-secondary rounded-md hover:bg-brand-secondary/90 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
