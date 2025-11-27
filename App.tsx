
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Pencil, Moon, Sun, Download, Upload } from 'lucide-react';

import { Expense, TimeFilter, Currency, Language } from './types';
import { MOCK_DATA, EXCHANGE_RATES } from './constants';
import { TRANSLATIONS } from './utils/translations';

import AddExpenseForm from './components/AddExpenseForm';
import StatsBoard from './components/StatsBoard';
import TransactionList from './components/TransactionList';
import CustomDatePicker from './components/CustomDatePicker';
import TurtleLogo from './components/TurtleLogo';
import LanguageSelector from './components/LanguageSelector';

const App: React.FC = () => {
  // --- State Initialization ---

  // Expenses: Load from LocalStorage or use Mock Data
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spendscope_expenses');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return MOCK_DATA as Expense[];
  });

  // Exchange Rates: Load from LocalStorage or use Defaults
  const [customRates, setCustomRates] = useState<Record<Currency, number>>(() => {
    if (typeof window !== 'undefined') {
      const savedRates = localStorage.getItem('spendscope_rates');
      if (savedRates) {
        try { return { ...EXCHANGE_RATES, ...JSON.parse(savedRates) }; } catch (e) { console.error(e); }
      }
    }
    return EXCHANGE_RATES;
  });
  
  // UI States
  const [currentFilter, setCurrentFilter] = useState<TimeFilter>(TimeFilter.Month);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(Currency.TWD);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('spendscope_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('spendscope_lang');
      if (savedLang && Object.values(Language).includes(savedLang as Language)) {
        return savedLang as Language;
      }
    }
    return Language.EN;
  });

  const t = TRANSLATIONS[language];

  // Modal & Menu States
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerContainerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerContainerRef.current && !pickerContainerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('spendscope_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('spendscope_rates', JSON.stringify(customRates)); }, [customRates]);
  useEffect(() => { localStorage.setItem('spendscope_lang', language); }, [language]);

  // Theme Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('spendscope_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('spendscope_theme', 'light');
    }
  }, [isDarkMode]);

  // Document Title Effect
  useEffect(() => { document.title = t.appName; }, [t.appName]);

  // --- Handlers ---

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [...prev, newExpense]);
    setIsAddModalOpen(false);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateRate = (currency: Currency, newRate: number) => {
    setCustomRates(prev => ({ ...prev, [currency]: newRate }));
  };

  const closeModals = () => {
    setEditingExpense(null);
    setIsAddModalOpen(false);
  };

  // Import/Export Logic
  const handleExportData = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendscope_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const importedData = JSON.parse(json);
        if (Array.isArray(importedData)) {
          setExpenses(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = importedData.filter((item: any) => 
              item.id && item.amount !== undefined && item.date && !existingIds.has(item.id)
            );
            if (newItems.length === 0) {
              alert(t.messages.importNoNew);
              return prev;
            }
            alert(t.messages.importSuccess.replace('{count}', newItems.length.toString()));
            return [...prev, ...newItems];
          });
        } else {
          alert(t.messages.importInvalid);
        }
      } catch (error) {
        console.error("Import error:", error);
        alert(t.messages.importError);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Date Navigation
  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (currentFilter === TimeFilter.Day) {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (currentFilter === TimeFilter.Month) {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  // Filter Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (currentFilter === TimeFilter.Day) {
        return expDate.toDateString() === selectedDate.toDateString();
      } else if (currentFilter === TimeFilter.Month) {
        return (expDate.getMonth() === selectedDate.getMonth() && expDate.getFullYear() === selectedDate.getFullYear());
      } else {
        return expDate.getFullYear() === selectedDate.getFullYear();
      }
    });
  }, [expenses, currentFilter, selectedDate]);

  const dateLabel = useMemo(() => {
    const locale = language === Language.ZH ? 'zh-TW' : language === Language.JA ? 'ja-JP' : 'en-US';
    if (currentFilter === TimeFilter.Day) {
      return selectedDate.toLocaleDateString(locale, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    } else if (currentFilter === TimeFilter.Month) {
      return selectedDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    } else {
      return selectedDate.getFullYear().toString();
    }
  }, [selectedDate, currentFilter, language]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 relative transition-colors duration-300">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 sm:py-0 sm:h-16 gap-3 sm:gap-0">
            {/* Logo + Mobile Actions */}
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center gap-2" title={t.appName}>
                <div className="bg-cyan-50 dark:bg-cyan-400/20 p-2 rounded-xl">
                  <TurtleLogo className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t.appName}</h1>
              </div>
              
              {/* Mobile Actions */}
              <div className="flex items-center sm:hidden">
                <div className="flex items-center border-r border-slate-200 dark:border-slate-800 pr-2 mr-2 gap-1">
                  <button onClick={handleExportData} className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors" title={t.actions.export}>
                    <Download className="w-5 h-5" />
                  </button>
                  <button onClick={handleImportClick} className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors" title={t.actions.import}>
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                <div className="mr-2">
                   <LanguageSelector language={language} onChange={setLanguage} label={t.actions.switchLanguage} />
                </div>
                <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors" title={t.actions.toggleTheme}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Desktop Actions & Filters */}
            <div className="flex items-center w-full sm:w-auto gap-3">
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center">
                 <div className="flex items-center border-r border-slate-200 dark:border-slate-800 pr-2 mr-2 gap-1">
                  <button onClick={handleExportData} className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors" title={t.actions.export}>
                    <Download className="w-5 h-5" />
                  </button>
                  <button onClick={handleImportClick} className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors" title={t.actions.import}>
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                <div className="mr-2">
                   <LanguageSelector language={language} onChange={setLanguage} label={t.actions.switchLanguage} />
                </div>
                <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors" title={t.actions.toggleTheme}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {/* Time Filters */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
                {Object.values(TimeFilter).map((f) => (
                  <button
                    key={f as string}
                    onClick={() => { setCurrentFilter(f); setIsPickerOpen(false); }}
                    className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all text-center ${
                      currentFilter === f 
                        ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.filters[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Date Navigator */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <button onClick={() => changeDate('prev')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-lg">
                  <Calendar className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  <span>{dateLabel}</span>
                </div>

                <div className="relative inline-flex items-center justify-center group" ref={pickerContainerRef}>
                  <button 
                    className="p-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-lg group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/40 transition-colors z-10 relative"
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <CustomDatePicker 
                    isOpen={isPickerOpen}
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    filter={currentFilter}
                    onClose={() => setIsPickerOpen(false)}
                    lang={language}
                  />
                </div>
              </div>

              <button onClick={() => changeDate('next')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
          </div>

          <StatsBoard 
            expenses={filteredExpenses} 
            filter={currentFilter} 
            isDarkMode={isDarkMode} 
            displayCurrency={displayCurrency}
            onCurrencyChange={setDisplayCurrency}
            rates={customRates}
            lang={language}
          />
          <TransactionList 
            expenses={filteredExpenses} 
            onDelete={handleDeleteExpense} 
            onEdit={setEditingExpense}
            displayCurrency={displayCurrency}
            rates={customRates}
            lang={language}
          />
        </div>
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 bg-cyan-600 text-white p-4 rounded-full shadow-lg shadow-cyan-900/20 hover:bg-cyan-700 transition-all hover:scale-110 active:scale-95 z-40 flex items-center justify-center"
        aria-label="Add Expense"
        title={t.actions.addExpense}
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add/Edit Modal */}
      {(editingExpense || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg relative animate-in zoom-in-95 duration-200 shadow-2xl rounded-2xl">
            <AddExpenseForm 
              initialData={editingExpense} 
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense} 
              onCancel={closeModals}
              currentRates={customRates}
              onRateUpdate={handleUpdateRate}
              lang={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
