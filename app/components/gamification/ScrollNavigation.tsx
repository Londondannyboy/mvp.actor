'use client';

import { useState, useEffect } from 'react';
import { CHARACTERS } from '@/lib/character-config';

interface ScrollNavigationProps {
  className?: string;
}

const SECTIONS = [
  { id: 'hero', name: 'Overview', icon: '🎮', color: '#ffffff' },
  ...CHARACTERS.map(c => ({ id: c.name.toLowerCase(), name: c.name, icon: c.icon, color: c.color })),
];

export function ScrollNavigation({ className = '' }: ScrollNavigationProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsVisible(window.scrollY > 300);

      // Determine active section
      const sections = SECTIONS.map(s => ({
        ...s,
        element: document.getElementById(`section-${s.id}`),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <nav
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-40 ${className}`}
    >
      <div className="flex flex-col gap-3 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`
              group relative w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-300 hover:scale-110
              ${activeSection === section.id
                ? 'bg-opacity-30 scale-110'
                : 'bg-gray-800 hover:bg-gray-700'
              }
            `}
            style={{
              backgroundColor: activeSection === section.id ? `${section.color}30` : undefined,
              boxShadow: activeSection === section.id ? `0 0 15px ${section.color}50` : undefined,
              border: activeSection === section.id ? `2px solid ${section.color}` : '2px solid transparent',
            }}
            title={section.name}
          >
            <span className="text-lg">{section.icon}</span>

            {/* Tooltip */}
            <span
              className="absolute right-14 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap
                         opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                backgroundColor: `${section.color}20`,
                border: `1px solid ${section.color}50`,
                color: section.color,
              }}
            >
              {section.name}
            </span>
          </button>
        ))}

        {/* Progress line */}
        <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-gray-700 -z-10 transform -translate-x-1/2">
          <div
            className="w-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300"
            style={{
              height: `${(SECTIONS.findIndex(s => s.id === activeSection) / (SECTIONS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
