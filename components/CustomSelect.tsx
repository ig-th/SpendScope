import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  variant?: 'default' | 'small';
  placeholder?: string;
}

function CustomSelect<T extends string | number>({
  value,
  options,
  onChange,
  variant = 'default',
  placeholder
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

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

  useLayoutEffect(() => {
    if (isOpen && listRef.current && selectedRef.current) {
      const list = listRef.current;
      const selected = selectedRef.current;

      const listHeight = list.clientHeight;
      const selectedTop = selected.offsetTop;
      const selectedHeight = selected.offsetHeight;

      list.scrollTop = selectedTop - (listHeight / 2) + (selectedHeight / 2);
    }
  }, [isOpen]);

  const baseButtonStyles = "w-full outline-none transition-all flex items-center justify-between text-left";

  const styles = variant === 'default'
    ? {
        button: `${baseButtonStyles} px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800 dark:text-white`,
        dropdown: "w-full mt-2 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl",
        item: "px-4 py-3 text-base"
      }
    : {
        button: `${baseButtonStyles} h-8 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 focus:ring-1 focus:ring-cyan-500 min-w-[100px] leading-none`,
        dropdown: "w-40 right-0 mt-1 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg",
        item: "px-3 py-2 text-xs"
      };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.button}
      >
        <span className="truncate flex-1">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`ml-2 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${variant === 'small' ? 'w-3 h-3' : 'w-4 h-4'}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 bg-white dark:bg-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${styles.dropdown}`}>
          <div ref={listRef} className="max-h-60 overflow-y-auto scrollbar-thin p-1 relative">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={String(option.value)}
                  ref={isSelected ? selectedRef : null}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left transition-colors flex items-center justify-between rounded-md ${styles.item} ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className={`text-cyan-600 dark:text-cyan-400 ${variant === 'small' ? 'w-3 h-3' : 'w-4 h-4'}`} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;