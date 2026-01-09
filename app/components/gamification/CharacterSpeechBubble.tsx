'use client';

import { useState, useEffect } from 'react';

interface CharacterSpeechBubbleProps {
  message: string;
  color: string;
  position?: 'left' | 'right';
  className?: string;
}

export function CharacterSpeechBubble({
  message,
  color,
  position = 'right',
  className = '',
}: CharacterSpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [message]);

  return (
    <div
      className={`relative max-w-xs ${className}`}
      style={{
        marginLeft: position === 'right' ? 'auto' : undefined,
        marginRight: position === 'left' ? 'auto' : undefined,
      }}
    >
      {/* Speech bubble */}
      <div
        className="relative px-4 py-3 rounded-2xl backdrop-blur-sm animate-fadeIn"
        style={{
          backgroundColor: `${color}20`,
          border: `2px solid ${color}50`,
          boxShadow: `0 0 20px ${color}20`,
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
          }}
        />

        {/* Text */}
        <p className="relative text-sm text-white font-medium">
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-2 h-4 ml-1 animate-blink"
              style={{ backgroundColor: color }}
            />
          )}
        </p>

        {/* Tail */}
        <div
          className="absolute -bottom-2 w-4 h-4 rotate-45"
          style={{
            left: position === 'left' ? '20px' : undefined,
            right: position === 'right' ? '20px' : undefined,
            backgroundColor: `${color}20`,
            borderRight: `2px solid ${color}50`,
            borderBottom: `2px solid ${color}50`,
          }}
        />
      </div>
    </div>
  );
}
