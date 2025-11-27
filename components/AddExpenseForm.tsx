import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Save, X, RefreshCw, Calendar, Clock, ChevronDown, ArrowRightLeft } from 'lucide-react';

import { Category, Currency, Expense, TimeFilter, Language } from '../types';
import { CURRENCY_DECIMALS } from '../constants';
import { TRANSLATIONS } from '../utils/translations';
import CustomDatePicker from './CustomDatePicker';
import CustomTimePicker from './CustomTimePicker';
import CustomSelect from './CustomSelect';

interface AddExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  initialData?: Expense | null;
  onCancel?: () => void;
  currentRates: Record<Currency, number>;
  onRateUpdate: (currency: Currency, rate: number) => void;
  lang: Language;
  history?: Expense[];
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const formatTime = (d: Date) => {
  return d.toTimeString().slice(0, 5);
};

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  currentRates,
  onRateUpdate,
  lang,
  history = []
}) => {
  const t = TRANSLATIONS[lang];
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.TWD);
  const [exchangeRate, setExchangeRate] = useState<string>('1');

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(formatTime(new Date()));
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.Food);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCurrency(initialData.currency);
      const initDate = new Date(initialData.date);
      setDate(initDate);
      setTime(formatTime(initDate));
      setDescription(initialData.description);
      setCategory(initialData.category);

      const usedRate = initialData.amountTWD / initialData.amount;
      setExchangeRate(usedRate.toFixed(4).replace(/\.?0+$/, ''));
    } else {
        setAmount('');
        setCurrency(Currency.TWD);
        setExchangeRate('1');
        const now = new Date();
        setDate(now);
        setTime(formatTime(now));
        setDescription('');
        setCategory(Category.Food);
    }
  }, [initialData]);

  useEffect(() => {
      if (!initialData) {
          setExchangeRate(currentRates[currency].toString());
      }
  }, [currency, currentRates, initialData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
      if (descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const relevantDescriptions = useMemo(() => {
    const unique = new Set<string>();
    history
      .filter(e => e.category === category)
      .forEach(e => {
        if (e.description) unique.add(e.description);
      });
    return Array.from(unique);
  }, [history, category]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);

    if (val.trim().length > 0) {
      const filtered = relevantDescriptions.filter(
        d => d.toLowerCase().includes(val.toLowerCase()) && d !== val
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (val: string) => {
    setDescription(val);
    setShowSuggestions(false);
  };

  const clearDescription = () => {
    setDescription('');
    setSuggestions([]);
    setShowSuggestions(false);
    descriptionInputRef.current?.focus();
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    if (amount) {
        const val = parseFloat(amount);
        if (!isNaN(val)) {
            const decimals = CURRENCY_DECIMALS[newCurrency];
            setAmount(val.toFixed(decimals));
        }
    }
  };

  const handleAmountBlur = () => {
      if (!amount) return;
      const val = parseFloat(amount);
      if (!isNaN(val)) {
          const decimals = CURRENCY_DECIMALS[currency];
          setAmount(val.toFixed(decimals));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentRateVal = parseFloat(exchangeRate);

    if (!isNaN(currentRateVal) && currentRateVal !== currentRates[currency]) {
        const isToday = new Date().toDateString() === date.toDateString();
        if (isToday) {
            const confirmMessage = t.messages.confirmRateUpdate
                .replace('{currency}', currency)
                .replace('{rate}', currentRateVal.toString());

            const confirmUpdate = window.confirm(confirmMessage);
            if (confirmUpdate) {
                onRateUpdate(currency, currentRateVal);
            }
        }
    }

    const [hours, mins] = time.split(':').map(Number);
    const finalDate = new Date(date);
    finalDate.setHours(hours);
    finalDate.setMinutes(mins);

    const expense: Expense = {
      id: initialData?.id || generateId(),
      amount: parseFloat(amount),
      currency,
      amountTWD: parseFloat(amount) * currentRateVal,
      description,
      category,
      date: finalDate.toISOString()
    };
    onSubmit(expense);

    if (!initialData) {
      setAmount('');
      setDescription('');
      const now = new Date();
      setDate(now);
      setTime(formatTime(now));
      setCategory(Category.Food);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const displayDate = date.toLocaleDateString(
    lang === Language.ZH ? 'zh-TW' : lang === Language.JA ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const currencyOptions = Object.values(Currency).map(c => ({ value: c, label: c }));
  const categoryOptions = Object.values(Category).map(c => ({ value: c, label: t.categories[c] }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="p-4 sm:p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {initialData ? <RefreshCw className="w-5 h-5 text-cyan-600" /> : <Plus className="w-5 h-5 text-cyan-600" />}
          {initialData ? t.actions.editExpense : t.actions.addExpense}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
            title={t.actions.close}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">

        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          <div className="col-span-3 space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.amount}</label>
            <div className="relative">
                <input
                    type="number"
                    step={CURRENCY_DECIMALS[currency] === 0 ? "1" : "0.01"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={handleAmountBlur}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-slate-800 dark:text-white text-base m-0 appearance-none leading-normal placeholder:font-normal placeholder:text-slate-400"
                    placeholder={CURRENCY_DECIMALS[currency] === 0 ? "0" : "0.00"}
                    required
                    title={t.form.tooltipAmount}
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.form.validationRequired)}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                />
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.currency}</label>
            <CustomSelect
                value={currency}
                options={currencyOptions}
                onChange={handleCurrencyChange}
            />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.rate}</label>
            <div className="relative">
                <ArrowRightLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                    type="number"
                    step="0.0001"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-slate-800 dark:text-white text-base m-0 appearance-none leading-normal"
                    placeholder="1.0"
                    required
                />
                {amount && exchangeRate && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-mono pointer-events-none hidden sm:block">
                        {t.form.ratePreview} {Math.round(parseFloat(amount) * parseFloat(exchangeRate)).toLocaleString()}
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2 relative" ref={datePickerRef}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.date}</label>
                <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-slate-800 dark:text-white text-left flex items-center gap-2 sm:gap-3 text-base font-medium group"
                >
                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
                    <span className="flex-1 truncate">{displayDate}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                </button>
                <CustomDatePicker
                    isOpen={isDatePickerOpen}
                    selectedDate={date}
                    onSelect={(d) => {
                        setDate(d);
                        setIsDatePickerOpen(false);
                    }}
                    filter={TimeFilter.Day}
                    onClose={() => setIsDatePickerOpen(false)}
                    lang={lang}
                />
            </div>
            <div className="space-y-2 relative" ref={timePickerRef}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.time}</label>
                <button
                    type="button"
                    onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-slate-800 dark:text-white text-left flex items-center gap-2 sm:gap-3 text-base font-medium group"
                >
                    <Clock className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
                    <span className="flex-1 truncate">{time}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isTimePickerOpen ? 'rotate-180' : ''}`} />
                </button>
                <CustomTimePicker
                    isOpen={isTimePickerOpen}
                    time={time}
                    onSelect={setTime}
                    onClose={() => setIsTimePickerOpen(false)}
                    lang={lang}
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.category}</label>
            <CustomSelect
                value={category}
                options={categoryOptions}
                onChange={(val) => setCategory(val)}
            />
        </div>

        <div className="space-y-2 relative" ref={descriptionRef}>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">{t.form.description}</label>
          <div className="relative">
            <input
                type="text"
                ref={descriptionInputRef}
                value={description}
                onChange={handleDescriptionChange}
                onFocus={() => {
                if (description.length > 0 && suggestions.length > 0) setShowSuggestions(true);
                }}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-slate-800 dark:text-white m-0 appearance-none leading-normal text-base placeholder:text-slate-400 ${description ? 'pr-10' : ''}`}
                placeholder={t.categoryPlaceholders[category]}
                required
                title={t.form.tooltipDesc}
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.form.validationRequired)}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
            />
            {description && (
                <button
                    type="button"
                    onClick={clearDescription}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title={t.actions.reset}
                    tabIndex={-1}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
          </div>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
               {suggestions.map((suggestion, idx) => (
                 <button
                   key={idx}
                   type="button"
                   onClick={() => selectSuggestion(suggestion)}
                   className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 group transition-colors text-sm"
                 >
                   <Clock className="w-3 h-3 text-slate-400 group-hover:text-cyan-500" />
                   <span>{suggestion}</span>
                 </button>
               ))}
            </div>
          )}
        </div>

        <div className="pt-2 flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              {t.actions.cancel}
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <Save className="w-5 h-5" />
            {initialData ? t.actions.save : t.actions.add}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;