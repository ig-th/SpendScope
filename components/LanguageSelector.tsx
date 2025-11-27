import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  language: Language;
  onChange: (lang: Language) => void;
  label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors font-bold text-xs w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded"
        title={label}
      >
        {language}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1">
                {Object.values(Language).map((lang) => (
                    <button
                        key={lang as string}
                        onClick={() => { onChange(lang); setIsOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                            language === lang 
                            ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <span>{lang === Language.EN && "English"}{lang === Language.ZH && "中文"}{lang === Language.JA && "日本語"}</span>
                        {language === lang && <Check className="w-3 h-3" />}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;