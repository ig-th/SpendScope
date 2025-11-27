
import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip 
} from 'recharts';
import { Category, Expense, TimeFilter, CategoryStat, DailyStat, Currency, Language } from '../types';
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
  
  // State for Trend Chart Category Filter
  const [trendCategory, setTrendCategory] = useState<string>('ALL');

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

  const trendData = useMemo<DailyStat[]>(() => {
    const grouped: Record<string, number> = {};
    
    // Sort expenses by date first
    const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const locale = lang === Language.ZH ? 'zh-TW' : lang === Language.JA ? 'ja-JP' : 'en-US';

    sorted.forEach(exp => {
      // Filter by Category if specific category is selected
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

      grouped[key] = (grouped[key] || 0) + exp.amountTWD;
    });

    return Object.keys(grouped).map(key => ({
      label: key,
      amount: convertAmount(grouped[key], displayCurrency, rates)
    }));
  }, [expenses, filter, displayCurrency, rates, lang, trendCategory]);

  // Colors for charts
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  // Use background color for stroke to simulate uniform spacing
  // Light mode bg is white (#ffffff), Dark mode bg is slate-900 (#0f172a)
  const pieStrokeColor = isDarkMode ? '#0f172a' : '#ffffff';
  
  // Dynamic bar color based on selected category, or default Cyan if ALL
  const barColor = trendCategory !== 'ALL' 
    ? CATEGORY_COLORS[trendCategory as Category] 
    : '#06b6d4'; // Cyan-500

  const currencySymbol = getCurrencySymbol(displayCurrency);

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const categoryName = payload[0].name as Category;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-xl rounded-lg text-sm">
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

  // Options for Trend Filter
  const trendCategoryOptions = [
    { value: 'ALL', label: t.stats.allCategories },
    ...Object.values(Category).map(c => ({ value: c, label: getLocalizedCategory(c, lang) }))
  ];

  // Options for Currency Display
  const currencyOptions = supportedCurrencies.map(c => ({ value: c, label: `${t.stats.in} ${c}` }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Overview Card */}
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

      {/* Pie Chart Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col transition-colors duration-300">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{t.stats.spendingByCategory}</h3>
        <div className="flex-1 w-full min-h-0">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-400">{t.stats.noData}</div>
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {categoryData.slice(0, 5).map(c => (
                <div key={c.name} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}></span>
                    {getLocalizedCategory(c.name as Category, lang)}
                </div>
            ))}
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {t.stats.trendAnalysis} <span className="text-sm font-normal text-slate-500">({t.filters[filter]})</span>
            </h3>
            {/* Category Filter for Trend Chart */}
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
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    cursor={{fill: isDarkMode ? '#1e293b' : '#f8fafc'}}
                    contentStyle={{
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      color: isDarkMode ? '#fff' : '#000'
                    }}
                    formatter={(value: number) => [`${currencySymbol} ${Math.round(value).toLocaleString()}`, t.form.amount]}
                />
                <Bar dataKey="amount" fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={50} />
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
