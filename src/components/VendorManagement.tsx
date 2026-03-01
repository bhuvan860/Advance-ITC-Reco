import React, { useState } from 'react';
import { Search, MessageCircle, Mail, AlertTriangle, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';
import { Vendor } from '../types';
import { cn } from '../lib/utils';

const mockVendors: Vendor[] = [
  { id: '1', name: 'Acme Corp', gstin: '27AADCB2230M1Z2', complianceScore: 'High', filingRate: 98, itcAtRisk: 0, lastFollowUp: '12-Oct-23' },
  { id: '2', name: 'Tech Solutions', gstin: '07BBDCT1120L1Z5', complianceScore: 'Medium', filingRate: 85, itcAtRisk: 45000, lastFollowUp: '15-Oct-23' },
  { id: '3', name: 'Global Logistics', gstin: '29CCDCT3340N1Z8', complianceScore: 'High', filingRate: 100, itcAtRisk: 0 },
  { id: '4', name: 'Office Supplies Inc', gstin: '33DDDCT4450P1Z1', complianceScore: 'Low', filingRate: 60, itcAtRisk: 125000, lastFollowUp: '20-Oct-23' },
  { id: '5', name: 'Marketing Gurus', gstin: '09EEDCT5560Q1Z4', complianceScore: 'Non-Compliant', filingRate: 30, itcAtRisk: 350000, lastFollowUp: '22-Oct-23' },
];

export function VendorManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = mockVendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const ScoreBadge = ({ score }: { score: Vendor['complianceScore'] }) => {
    const styles = {
      'High': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
      'Low': 'bg-orange-50 text-orange-700 border-orange-200',
      'Non-Compliant': 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full border", styles[score])}>
        {score}
      </span>
    );
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Vendor Compliance</h1>
          <p className="text-sm text-zinc-500 mt-1">Monitor supplier filing behavior and automate communication for ITC recovery.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search Vendor Name or GSTIN..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
            <Mail className="w-4 h-4" />
            Bulk Email Blast
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Total Vendors</h3>
          <p className="text-2xl font-semibold text-zinc-900">1,245</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">High Compliance</h3>
          <p className="text-2xl font-semibold text-emerald-600">850</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">At-Risk ITC (Non-Filers)</h3>
          <p className="text-2xl font-semibold text-rose-600">₹ 14,50,000</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Pending Follow-ups</h3>
          <p className="text-2xl font-semibold text-amber-600">124</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 sticky top-0 z-10 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Vendor Details</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Compliance Score</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Filing Rate</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ITC at Risk</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Last Follow-up</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-zinc-900">{vendor.name}</div>
                    <div className="text-xs font-mono text-zinc-500 mt-0.5">{vendor.gstin}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={vendor.complianceScore} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", vendor.filingRate > 80 ? "bg-emerald-500" : vendor.filingRate > 50 ? "bg-amber-500" : "bg-rose-500")}
                          style={{ width: `${vendor.filingRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-zinc-600">{vendor.filingRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-zinc-900">
                    {vendor.itcAtRisk > 0 ? <span className="text-rose-600 font-medium">{formatCurrency(vendor.itcAtRisk)}</span> : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600">
                    {vendor.lastFollowUp || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Send WhatsApp Reminder">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Send Email Alert">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
