import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Language, TimeFilter } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface CustomDatePickerProps {
  isOpen: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  filter: TimeFilter;
  onClose: () => void;
  lang?: Language;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  isOpen,
  selectedDate,
  onSelect,
  filter,
  onClose,
  lang = Language.EN
}) => {
  const t = TRANSLATIONS[lang];
  const [viewDate, setViewDate] = useState<Date>(new Date(selectedDate));
  const containerRef = useRef<HTMLDivElement>(null);
  const activeYearRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setViewDate(new Date(selectedDate));
      setTimeout(() => {
        containerRef.current?.focus({ preventScroll: true });
      }, 50);
    }
  }, [isOpen, selectedDate]);

  useLayoutEffect(() => {
    if (isOpen && filter === TimeFilter.Year && activeYearRef.current && containerRef.current) {
        requestAnimationFrame(() => {
            if (containerRef.current && activeYearRef.current) {
                const container = containerRef.current;
                const element = activeYearRef.current;

                const containerHeight = container.clientHeight;
                const elementHeight = element.offsetHeight;
                const elementTop = element.offsetTop;

                container.scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
            }
        });
    }
  }, [isOpen, filter, viewDate]);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 2010; i <= 2050; i++) {
      years.push(i);
    }
    return years.reverse();
  }, []);

  const months = t.datePicker.months;
  const weekdays = t.datePicker.weekdays;

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleYearChange = (delta: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(newDate.getFullYear() + delta);
    setViewDate(newDate);
  };

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setViewDate(newDate);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    const newDate = new Date(viewDate);

    if (e.key === 'Enter') {
      e.preventDefault();
      if (filter === TimeFilter.Month) {
         newDate.setDate(1);
      }
      onSelect(newDate);
      onClose();
      return;
    }

    if (filter === TimeFilter.Year) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        newDate.setFullYear(newDate.getFullYear() + 1);
        if (newDate.getFullYear() <= 2050) setViewDate(newDate);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        newDate.setFullYear(newDate.getFullYear() - 1);
        if (newDate.getFullYear() >= 2010) setViewDate(newDate);
      }
    } else if (filter === TimeFilter.Month) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        newDate.setMonth(newDate.getMonth() - 3);
        setViewDate(newDate);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        newDate.setMonth(newDate.getMonth() + 3);
        setViewDate(newDate);
      }
    } else if (filter === TimeFilter.Day) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newDate.setDate(newDate.getDate() + 1);
        setViewDate(newDate);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newDate.setDate(newDate.getDate() - 1);
        setViewDate(newDate);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        newDate.setDate(newDate.getDate() - 7);
        setViewDate(newDate);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        newDate.setDate(newDate.getDate() + 7);
        setViewDate(newDate);
      }
    }
  };

  if (!isOpen) return null;

  if (filter === TimeFilter.Year) {
    return (
      <div
        ref={containerRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="absolute top-full right-0 mt-2 w-32 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 scrollbar-thin animate-in fade-in zoom-in-95 duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        role="dialog"
        aria-label="Select Year"
      >
        <div className="p-1" role="listbox">
          {yearOptions.map(y => {
            const isActive = y === viewDate.getFullYear();
            return (
              <button
                key={y}
                ref={isActive ? activeYearRef : null}
                onClick={(e) => {
                  e.stopPropagation();
                  const newDate = new Date(selectedDate);
                  newDate.setFullYear(y);
                  onSelect(newDate);
                  onClose();
                }}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                role="option"
                aria-selected={isActive}
                tabIndex={-1}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (filter === TimeFilter.Month) {
    return (
      <div
        ref={containerRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        role="dialog"
        aria-label="Select Month"
      >
        <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"
              aria-label="Previous Year"
              tabIndex={-1}
            >
            <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800 dark:text-white" aria-live="polite">{viewDate.getFullYear()}</span>
            <button
              onClick={() => handleYearChange(1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"
              aria-label="Next Year"
              tabIndex={-1}
            >
            <ChevronRight className="w-4 h-4" />
            </button>
        </div>
        <div className="grid grid-cols-3 gap-2" role="grid">
            {months.map((m, idx) => {
              const isSelected = viewDate.getFullYear() === selectedDate.getFullYear() && idx === selectedDate.getMonth();
              const isFocused = idx === viewDate.getMonth();

              return (
                <button
                    key={m}
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setFullYear(viewDate.getFullYear());
                      newDate.setMonth(idx);
                      newDate.setDate(1);
                      onSelect(newDate);
                      onClose();
                    }}
                    className={`py-2 text-sm rounded-lg transition-colors ${
                    isSelected
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : isFocused
                          ? 'bg-slate-100 dark:bg-slate-700 text-cyan-700 dark:text-cyan-400 font-semibold ring-1 ring-cyan-500'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    role="gridcell"
                    aria-selected={isSelected}
                    tabIndex={-1}
                >
                    {m}
                </button>
              );
            })}
        </div>
      </div>
    );
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      role="dialog"
      aria-label="Select Date"
    >
        <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"
              aria-label="Previous Month"
              tabIndex={-1}
            >
            <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800 dark:text-white" aria-live="polite">
            {months[month]} {year}
            </span>
            <button
              onClick={() => handleMonthChange(1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500"
              aria-label="Next Month"
              tabIndex={-1}
            >
            <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center" aria-hidden="true">
            {weekdays.map(d => (
            <span key={d} className="text-xs font-medium text-slate-400">{d}</span>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-1" role="grid">
            {emptySlots.map(s => <div key={`empty-${s}`} role="presentation" />)}
            {daysArray.map(d => {
            const isSelected =
                selectedDate.getDate() === d &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            const isToday =
                new Date().getDate() === d &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

            const isFocused = viewDate.getDate() === d;

            return (
                <button
                key={d}
                onClick={() => {
                    const newDate = new Date(year, month, d);
                    onSelect(newDate);
                    onClose();
                }}
                className={`h-8 w-8 text-sm rounded-full flex items-center justify-center transition-all ${
                    isSelected
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : isFocused
                      ? 'bg-slate-100 dark:bg-slate-700 text-cyan-700 dark:text-cyan-400 font-semibold ring-1 ring-cyan-500'
                      : isToday
                        ? 'bg-slate-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-100 dark:border-cyan-900'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                role="gridcell"
                aria-selected={isSelected}
                aria-current={isToday ? 'date' : undefined}
                tabIndex={-1}
                >
                {d}
                </button>
            );
            })}
        </div>
    </div>
  );
};

export default CustomDatePicker;