import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, HelpCircle, FileText } from 'lucide-react';
import { RecoRecord } from '../types';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Dashboard({ data }: { data: RecoRecord[] }) {
  const metrics = useMemo(() => {
    let totalPR = 0;
    let total2B = 0;
    let atRisk = 0;
    let unreconciled = 0;

    const statusCounts: Record<string, number> = {
      'Exact Match': 0,
      'Probable Match': 0,
      'Mismatch': 0,
      'Missing in 2B': 0,
      'Missing in PR': 0
    };

    const monthlyStats: Record<string, any> = {};

    data.forEach(row => {
      totalPR += row.prTax || 0;
      total2B += row.gstrTax || 0;

      if (row.status === 'Mismatch' || row.status === 'Missing in 2B') {
        atRisk += row.prTax || 0;
      }

      if (row.status !== 'Exact Match' && row.status !== 'Probable Match') {
        unreconciled++;
      }

      if (statusCounts[row.status] !== undefined) {
        statusCounts[row.status]++;
      }

      // Extract month-year for bar chart (e.g., "Oct-23")
      const dateStr = row.prDate !== '-' ? row.prDate : row.gstrDate;
      if (dateStr && dateStr !== '-') {
        const parts = dateStr.split('-');
        if (parts.length >= 2) {
          const monthYear = `${parts[1]}-${parts[2] || ''}`;
          if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = { name: monthYear, matched: 0, mismatched: 0, missing2B: 0, missingPR: 0 };
          }
          if (row.status === 'Exact Match' || row.status === 'Probable Match') monthlyStats[monthYear].matched++;
          else if (row.status === 'Mismatch') monthlyStats[monthYear].mismatched++;
          else if (row.status === 'Missing in 2B') monthlyStats[monthYear].missing2B++;
          else if (row.status === 'Missing in PR') monthlyStats[monthYear].missingPR++;
        }
      }
    });

    const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    const monthlyData = Object.values(monthlyStats);

    return { totalPR, total2B, atRisk, unreconciled, pieData, monthlyData };
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Reconciliation Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-zinc-500 font-mono">
          <span>FY 2023-24</span>
          <span className="px-2 py-1 bg-zinc-100 rounded-md">YTD</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total ITC Claimable (PR)" value={formatCurrency(metrics.totalPR)} trend="+12.5%" trendUp={true} icon={<FileText className="w-4 h-4" />} />
        <KpiCard title="Total ITC Available (2B)" value={formatCurrency(metrics.total2B)} trend="-2.4%" trendUp={false} icon={<CheckCircle className="w-4 h-4" />} />
        <KpiCard title="ITC at Risk (Mismatched)" value={formatCurrency(metrics.atRisk)} trend="+5.2%" trendUp={false} icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} />
        <KpiCard title="Unreconciled Invoices" value={metrics.unreconciled.toString()} trend="-15%" trendUp={true} icon={<HelpCircle className="w-4 h-4 text-rose-500" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-6 uppercase tracking-wider font-mono">Monthly Reconciliation Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="matched" name="Matched" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="mismatched" name="Mismatched" stackId="a" fill="#f59e0b" />
                <Bar dataKey="missing2B" name="Missing in 2B" stackId="a" fill="#ef4444" />
                <Bar dataKey="missingPR" name="Missing in PR" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-6 uppercase tracking-wider font-mono">Status Distribution</h3>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 space-y-2">
              {metrics.pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-zinc-600">{entry.name}</span>
                  </div>
                  <span className="font-medium text-zinc-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
        <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-zinc-900 tracking-tight">{value}</span>
      </div>
      <div className="mt-2 flex items-center text-xs font-mono">
        <span className={`flex items-center ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </span>
        <span className="text-zinc-400 ml-2">vs last month</span>
      </div>
    </div>
  );
}
