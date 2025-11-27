import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface CustomTimePickerProps {
  isOpen: boolean;
  time: string; // "HH:MM"
  onSelect: (time: string) => void;
  onClose: () => void;
  lang?: Language;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  isOpen,
  time,
  onSelect,
  onClose,
  lang = Language.EN
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedHour, selectedMinute] = time.split(':').map(Number);

  const hourRef = useRef<HTMLButtonElement>(null);
  const minuteRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
       requestAnimationFrame(() => {
         if (hourListRef.current && hourRef.current) {
            const list = hourListRef.current;
            const item = hourRef.current;
            list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2;
         }

         if (minuteListRef.current && minuteRef.current) {
            const list = minuteListRef.current;
            const item = minuteRef.current;
            list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2;
         }
       });
    }
  }, [isOpen, time]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200 focus:outline-none grid grid-cols-2 gap-2 h-64"
    >
       <div
          ref={hourListRef}
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 relative"
       >
          <div className="text-center text-[10px] font-bold text-slate-400 mb-1 sticky top-0 bg-white/95 dark:bg-slate-800/95 py-1 uppercase tracking-wider backdrop-blur-sm z-10">{t.timePicker.hour}</div>
          {hours.map(h => {
             const isSelected = h === selectedHour;
             return (
               <button
                 key={h}
                 ref={isSelected ? hourRef : null}
                 type="button"
                 onClick={() => onSelect(`${h.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`)}
                 className={`w-full text-center py-2 rounded-lg text-sm transition-colors mb-1 ${
                   isSelected
                   ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/30'
                   : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                 }`}
               >
                 {h.toString().padStart(2, '0')}
               </button>
             )
          })}
          <div className="h-24"></div>
       </div>

       <div
          ref={minuteListRef}
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 relative"
       >
          <div className="text-center text-[10px] font-bold text-slate-400 mb-1 sticky top-0 bg-white/95 dark:bg-slate-800/95 py-1 uppercase tracking-wider backdrop-blur-sm z-10">{t.timePicker.minute}</div>
          {minutes.map(m => {
             const isSelected = m === selectedMinute;
             return (
               <button
                 key={m}
                 ref={isSelected ? minuteRef : null}
                 type="button"
                 onClick={() => {
                    onSelect(`${selectedHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
                 }}
                 className={`w-full text-center py-2 rounded-lg text-sm transition-colors mb-1 ${
                   isSelected
                   ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/30'
                   : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                 }`}
               >
                 {m.toString().padStart(2, '0')}
               </button>
             )
          })}
          <div className="h-24"></div>
       </div>
    </div>
  );
};

export default CustomTimePicker;