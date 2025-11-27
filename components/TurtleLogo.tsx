import React from 'react';

interface TurtleLogoProps {
  className?: string;
}

const TurtleLogo: React.FC<TurtleLogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} overflow-visible`}
      aria-label="SpendScope Money Turtle Logo"
    >
      <g transform="rotate(-45 12 12)">
        <g className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="4" strokeLinecap="round">
          <path d="M6 8L4 6" />
          <path d="M18 8L20 6" />
          <path d="M6 16L4 18" />
          <path d="M18 16L20 18" />
        </g>
        
        <path d="M11 19L12 29L13 19Z" className="fill-emerald-500 dark:fill-emerald-400" />

        <ellipse cx="12" cy="5.5" rx="3.6" ry="5.5" className="fill-emerald-500 dark:fill-emerald-400" />
        
        <circle cx="10.5" cy="3.2" r="1.2" className="fill-emerald-100" />
        <circle cx="13.5" cy="3.2" r="1.2" className="fill-emerald-100" />

        <circle cx="12" cy="13" r="7.5" className="fill-amber-300 dark:fill-amber-500 stroke-amber-500 dark:stroke-amber-400" strokeWidth="2"/>
        
        <path 
          d="M12 10 L14.6 11.5 L14.6 14.5 L12 16 L9.4 14.5 L9.4 11.5 Z" 
          className="stroke-amber-700 dark:stroke-amber-100" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default TurtleLogo;