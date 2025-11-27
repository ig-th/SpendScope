import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip
} from 'recharts';
import { Category, Expense, TimeFilter, CategoryStat, Currency, Language } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { getCurrencySymbol, convertAmount, getLocalizedCategory } from '../utils/currencyUtils';
import { TRANSLATIONS } from '../utils/translations';
import CustomSelect from './CustomSelect';

interface StatsBoardProps {
  expenses: Expense[];
  filter: TimeFilter;
  isDarkMode?: boolean;
  displayCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  rates: Record<Currency, number>;
  lang: Language;
}

const StatsBoard: React.FC<StatsBoardProps> = ({ expenses, filter, isDarkMode, displayCurrency, onCurrencyChange, rates, lang }) => {
  const t = TRANSLATIONS[lang];
  const supportedCurrencies = [Currency.TWD, Currency.USD, Currency.JPY];

  const [trendCategory, setTrendCategory] = useState<string>('ALL');

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTooltipInteraction = () => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
    setIsTooltipVisible(true);
    tooltipTimerRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 3000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isTooltipVisible) {
        setIsTooltipVisible(false);
        if (tooltipTimerRef.current) {
          clearTimeout(tooltipTimerRef.current);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [isTooltipVisible]);

  const totalSpent = useMemo(() => {
    const totalTWD = expenses.reduce((sum, item) => sum + item.amountTWD, 0);
    return convertAmount(totalTWD, displayCurrency, rates);
  }, [expenses, displayCurrency, rates]);

  const categoryData = useMemo<CategoryStat[]>(() => {
    const grouped: Record<string, number> = {};
    expenses.forEach(exp => {
      grouped[exp.category] = (grouped[exp.category] || 0) + exp.amountTWD;
    });

    return Object.entries(grouped)
      .map(([name, valueTWD]) => ({
        name,
        value: convertAmount(valueTWD, displayCurrency, rates),
        color: CATEGORY_COLORS[name as Category] || '#ccc'
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, displayCurrency, rates]);

  const trendData = useMemo(() => {
    const grouped: Record<string, any> = {};
    const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const locale = lang === Language.ZH ? 'zh-TW' : lang === Language.JA ? 'ja-JP' : 'en-US';

    sorted.forEach(exp => {
      if (trendCategory !== 'ALL' && exp.category !== trendCategory) {
        return;
      }

      const d = new Date(exp.date);
      let key = '';

      if (filter === TimeFilter.Day) {
        key = `${d.getHours()}:00`;
      } else if (filter === TimeFilter.Month) {
        key = `${d.getDate()}`;
      } else {
        key = d.toLocaleString(locale, { month: 'short' });
      }

      if (!grouped[key]) {
        grouped[key] = { label: key };
      }

      const convertedAmount = convertAmount(exp.amountTWD, displayCurrency, rates);

      if (!grouped[key][exp.category]) {
        grouped[key][exp.category] = 0;
      }
      grouped[key][exp.category] += convertedAmount;

      if (!grouped[key]['total']) {
        grouped[key]['total'] = 0;
      }
      grouped[key]['total'] += convertedAmount;
    });

    return Object.values(grouped);
  }, [expenses, filter, displayCurrency, rates, lang, trendCategory]);

  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const pieStrokeColor = isDarkMode ? '#0f172a' : '#ffffff';
  const currencySymbol = getCurrencySymbol(displayCurrency);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const categoryName = payload[0].name as Category;
      return (
        <div className="bg-white dark:bg-slate-900 p-3 border border-slate-100 dark:border-slate-800 shadow-xl rounded-lg text-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {getLocalizedCategory(categoryName, lang)}
          </p>
          <p className="text-cyan-600 dark:text-cyan-400 font-mono">
            {currencySymbol} {Math.round(payload[0].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a: any, b: any) => b.value - a.value);

      return (
        <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg text-sm min-w-[150px] z-50">
          <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
            {label}
          </p>
          <div className="space-y-1">
            {sortedPayload.map((entry: any, index: number) => {
              let categoryName = entry.name;

              if (trendCategory !== 'ALL' && entry.dataKey === 'total') {
                categoryName = trendCategory;
              }

              const displayName = Object.values(Category).includes(categoryName as Category)
                ? getLocalizedCategory(categoryName as Category, lang)
                : t.form.amount;

              return (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      {displayName}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {currencySymbol} {Math.round(entry.value).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const trendCategoryOptions = [
    { value: 'ALL', label: t.stats.allCategories },
    ...Object.values(Category).map(c => ({ value: c, label: getLocalizedCategory(c, lang) }))
  ];

  const currencyOptions = supportedCurrencies.map(c => ({ value: c, label: `${t.stats.in} ${c}` }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 col-span-1 md:col-span-2 transition-colors duration-300">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase mt-1">{t.stats.totalSpending}</h3>
          <div className="w-[120px]">
            <CustomSelect
                value={displayCurrency}
                options={currencyOptions}
                onChange={(val) => onCurrencyChange(val as Currency)}
                variant="small"
            />
          </div>
        </div>
        <p className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">
          <span className="text-xl text-slate-400 mr-1">{currencySymbol}</span>
          {Math.round(totalSpent).toLocaleString()}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col transition-colors duration-300">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{t.stats.spendingByCategory}</h3>
        <div className="flex-1 w-full min-h-0">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                onMouseMove={handleTooltipInteraction}
                onClick={handleTooltipInteraction}
              >
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  stroke={pieStrokeColor}
                  strokeWidth={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomPieTooltip />}
                  wrapperStyle={{
                    visibility: isTooltipVisible ? 'visible' : 'hidden',
                    opacity: isTooltipVisible ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-400">{t.stats.noData}</div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {categoryData.slice(0, 5).map(c => (
                <div key={c.name} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}></span>
                    {getLocalizedCategory(c.name as Category, lang)}
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {t.stats.trendAnalysis} <span className="text-sm font-normal text-slate-500">({t.filters[filter]})</span>
            </h3>
            <div className="w-[140px]">
                <CustomSelect
                    value={trendCategory}
                    options={trendCategoryOptions}
                    onChange={(val) => setTrendCategory(val)}
                    variant="small"
                />
            </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onMouseMove={handleTooltipInteraction}
                onClick={handleTooltipInteraction}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{fontSize: 12, fill: axisColor}}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fontSize: 11, fill: axisColor}}
                />
                <BarTooltip
                    cursor={{fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}}
                    content={<CustomBarTooltip />}
                    wrapperStyle={{
                      visibility: isTooltipVisible ? 'visible' : 'hidden',
                      opacity: isTooltipVisible ? 1 : 0,
                      transition: 'opacity 0.2s ease-in-out'
                    }}
                />

                {trendCategory === 'ALL' ? (
                  Object.values(Category).map((cat) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="a"
                      fill={CATEGORY_COLORS[cat]}
                      maxBarSize={50}
                    />
                  ))
                ) : (
                  <Bar
                    dataKey="total"
                    fill={CATEGORY_COLORS[trendCategory as Category] || '#06b6d4'}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">{t.stats.noData}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;