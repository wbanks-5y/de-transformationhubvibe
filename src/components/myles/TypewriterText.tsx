
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ChartParser from './ChartParser';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  renderAsMarkdown?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  renderAsMarkdown = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  // Check if the displayed text contains chart markers
  const hasChartMarkers = displayedText.includes('[CHART:');

  if (renderAsMarkdown) {
    if (hasChartMarkers) {
      return <ChartParser content={displayedText} />;
    }
    return <ReactMarkdown>{displayedText}</ReactMarkdown>;
  }

  if (hasChartMarkers) {
    return <ChartParser content={displayedText} />;
  }

  return <span>{displayedText}</span>;
};

export default TypewriterText;
