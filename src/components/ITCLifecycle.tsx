import React, { useState } from 'react';
import { Clock, AlertTriangle, FileWarning, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function ITCLifecycle() {
  const [activeTab, setActiveTab] = useState<'180day' | 'reversals' | 'blocked'>('180day');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">ITC Lifecycle Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Track 180-day payment rules, Rule 37/37A reversals, and Section 17(5) blocked credits.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-200 shrink-0">
        <button 
          onClick={() => setActiveTab('180day')}
          className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === '180day' ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300")}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            180-Day Payment Rule
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('reversals')}
          className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'reversals' ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300")}
        >
          <div className="flex items-center gap-2">
            <FileWarning className="w-4 h-4" />
            Rule 37/37A Reversals
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('blocked')}
          className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'blocked' ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300")}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Sec 17(5) Blocked Credit
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        {activeTab === '180day' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <h3 className="text-sm font-medium text-rose-800 mb-1">Breached (&gt;180 Days)</h3>
                <p className="text-2xl font-semibold text-rose-600">₹ 4,50,000</p>
                <p className="text-xs text-rose-600/80 mt-1">Requires immediate reversal</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-sm font-medium text-amber-800 mb-1">Critical (150-180 Days)</h3>
                <p className="text-2xl font-semibold text-amber-600">₹ 12,30,000</p>
                <p className="text-xs text-amber-600/80 mt-1">Payment due soon</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h3 className="text-sm font-medium text-emerald-800 mb-1">Safe (&lt;150 Days)</h3>
                <p className="text-2xl font-semibold text-emerald-600">₹ 85,00,000</p>
                <p className="text-xs text-emerald-600/80 mt-1">Within payment terms</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-50 border-y border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Invoice Details</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Invoice Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ITC Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Aging</th>
                  <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50/80">
                  <td className="px-4 py-3 font-mono text-sm">INV-2023-001</td>
                  <td className="px-4 py-3 text-sm">Acme Corp</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">12-Apr-23</td>
                  <td className="px-4 py-3 text-sm font-mono">₹ 45,000</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-md">185 Days</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md">Reverse ITC</button>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80">
                  <td className="px-4 py-3 font-mono text-sm">TS/23-24/045</td>
                  <td className="px-4 py-3 text-sm">Tech Solutions</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">15-May-23</td>
                  <td className="px-4 py-3 text-sm font-mono">₹ 1,25,000</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">160 Days</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md">Alert AP Team</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reversals' && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-zinc-500">
            <FileWarning className="w-12 h-12 mb-4 text-zinc-300" />
            <h3 className="text-lg font-medium text-zinc-900">Rule 37/37A Reversal Ledger</h3>
            <p className="text-sm mt-2 max-w-md text-center">Track ITC reversed due to non-payment or supplier non-filing, and manage the ECRS (Electronic Credit Reversal and Reclaimed Statement).</p>
            <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
              View Reversal Ledger <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'blocked' && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-zinc-500">
            <ShieldAlert className="w-12 h-12 mb-4 text-zinc-300" />
            <h3 className="text-lg font-medium text-zinc-900">Section 17(5) Blocked Credit Auto-Detection</h3>
            <p className="text-sm mt-2 max-w-md text-center">AI-driven flagging of ineligible ITC based on HSN/SAC codes and vendor categories (e.g., Motor Vehicles, Food & Beverages, Club Memberships).</p>
            <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
              Configure Blocked Credit Rules <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
