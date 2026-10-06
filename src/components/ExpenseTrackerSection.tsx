import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  TrendingDown, 
  Split, 
  PieChart, 
  Receipt,
  Sparkles
} from 'lucide-react';
import { Itinerary } from '../types/itinerary';
import { TripFormData } from '../types/travel';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: 'activity' | 'food' | 'transport' | 'hotel' | 'other';
  paidBy?: string;
  isPlanned?: boolean;
}

interface ExpenseTrackerSectionProps {
  itinerary: Itinerary;
  plannerData: TripFormData;
}

export const ExpenseTrackerSection: React.FC<ExpenseTrackerSectionProps> = ({
  itinerary,
  plannerData,
}) => {
  const currency = itinerary.currency || plannerData.currency || 'INR';
  const initialTravelers = Math.max(1, Number(plannerData.numberOfTravelers) || 2);
  const [numTravelers, setNumTravelers] = useState<number>(initialTravelers);

  const storageKey = `tripgenie_expenses_${itinerary.destination.toLowerCase().replace(/\s+/g, '_')}`;

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    // Default seed with a few planned items from day 1
    const defaults: ExpenseItem[] = [];
    if (itinerary.days?.[0]?.morning) {
      defaults.push({
        id: 'exp-1',
        name: itinerary.days[0].morning.activity,
        amount: itinerary.days[0].morning.estimatedCost || 0,
        category: 'activity',
        isPlanned: true
      });
    }
    if (itinerary.days?.[0]?.foodRecommendation) {
      defaults.push({
        id: 'exp-2',
        name: `Dining: ${itinerary.days[0].foodRecommendation.slice(0, 30)}...`,
        amount: Math.round((itinerary.totalEstimatedCost || 10000) * 0.1),
        category: 'food',
        isPlanned: true
      });
    }
    return defaults;
  });

  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<'activity' | 'food' | 'transport' | 'hotel' | 'other'>('food');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(expenses));
    } catch (e) {
      // ignore
    }
  }, [expenses, storageKey]);

  const totalSpent = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalBudget = Number(itinerary.totalEstimatedCost) || Number(plannerData.budget) || 15000;
  const remainingBudget = totalBudget - totalSpent;

  // Split Calculations
  const totalPerPerson = Math.round(totalBudget / numTravelers);
  const spentPerPerson = Math.round(totalSpent / numTravelers);
  const remainingPerPerson = Math.round(remainingBudget / numTravelers);
  const daysCount = itinerary.days?.length || Number(plannerData.numberOfDays) || 3;
  const dailyPerPerson = Math.round(totalPerPerson / daysCount);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmount) return;

    const parsedAmount = Math.max(0, parseFloat(newExpenseAmount));
    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: newExpenseName.trim(),
      amount: parsedAmount,
      category: newExpenseCategory,
      isPlanned: false,
    };

    setExpenses([newItem, ...expenses]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Group Expense Split & Live Tracker</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Per-traveler cost sharing and real-time expense monitoring
            </p>
          </div>
        </div>

        {/* Travelers Count Control */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-600 px-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Split Between:</span>
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                onClick={() => setNumTravelers(count)}
                className={`w-7 h-7 rounded-xl text-xs font-bold transition ${
                  numTravelers === count
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
            Budget Per Person
          </span>
          <span className="text-xl font-black text-emerald-950 block mt-1">
            {currency} {totalPerPerson.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 block mt-0.5">
            Total target for {numTravelers} traveler{numTravelers > 1 ? 's' : ''}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
            Daily Share Per Person
          </span>
          <span className="text-xl font-black text-sky-950 block mt-1">
            {currency} {dailyPerPerson.toLocaleString()} / day
          </span>
          <span className="text-[11px] text-sky-600 block mt-0.5">
            Across {daysCount} planned days
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Logged Spent
          </span>
          <span className="text-xl font-black text-slate-900 block mt-1">
            {currency} {totalSpent.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {currency} {spentPerPerson.toLocaleString()} / person so far
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          remainingBudget >= 0 ? 'bg-indigo-50/70 border-indigo-100' : 'bg-rose-50/70 border-rose-100'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${
            remainingBudget >= 0 ? 'text-indigo-700' : 'text-rose-700'
          }`}>
            Remaining Balance
          </span>
          <span className={`text-xl font-black block mt-1 ${
            remainingBudget >= 0 ? 'text-indigo-950' : 'text-rose-950'
          }`}>
            {currency} {remainingBudget.toLocaleString()}
          </span>
          <span className={`text-[11px] block mt-0.5 ${
            remainingBudget >= 0 ? 'text-indigo-600' : 'text-rose-600'
          }`}>
            {remainingBudget >= 0 ? 'Within budget limit' : 'Over estimated budget'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
          <span>Budget Utilized: {Math.min(100, Math.round((totalSpent / totalBudget) * 100))}%</span>
          <span>{currency} {totalSpent.toLocaleString()} of {currency} {totalBudget.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div 
            style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
            className={`h-full transition-all duration-300 ${
              totalSpent > totalBudget ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Interactive Expense Input & Table */}
      <div className="pt-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <form onSubmit={handleAddExpense} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            + Quick Log Expense
          </span>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Expense Description</label>
            <input
              type="text"
              placeholder="e.g. Airport taxi, Seafood dinner"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Amount ({currency})</label>
              <input
                type="number"
                placeholder="500"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category</label>
              <select
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                className="w-full px-2 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden"
              >
                <option value="food">Dining / Food</option>
                <option value="transport">Transport</option>
                <option value="activity">Activity</option>
                <option value="hotel">Hotel</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </form>

        {/* Expenses List */}
        <div className="lg:col-span-2 space-y-2 max-h-64 overflow-y-auto pr-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block pb-1">
            Logged Items ({expenses.length})
          </span>

          {expenses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
              No expenses logged yet. Add your first expenditure above.
            </div>
          ) : (
            expenses.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    item.category === 'food' ? 'bg-amber-100 text-amber-800' :
                    item.category === 'transport' ? 'bg-sky-100 text-sky-800' :
                    item.category === 'activity' ? 'bg-indigo-100 text-indigo-800' :
                    item.category === 'hotel' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">
                    {currency} {item.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
