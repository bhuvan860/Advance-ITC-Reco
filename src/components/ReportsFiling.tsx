import React from 'react';
import { FileText, Download, CheckCircle2, AlertCircle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function ReportsFiling() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Reports & Return Filing</h1>
          <p className="text-sm text-zinc-500 mt-1">Generate compliance reports and auto-populate GSTR-3B Table 4.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-zinc-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                GSTR-3B Table 4 Pre-fill
              </h3>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready to File
              </span>
            </div>

            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-zinc-50 border-y border-zinc-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-zinc-500">Details</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-right">IGST (₹)</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-right">CGST (₹)</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-right">SGST (₹)</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-right">Cess (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="bg-zinc-50/50">
                  <td className="px-4 py-3 font-medium text-zinc-900" colSpan={5}>(A) ITC Available (whether in full or part)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 pl-8 text-zinc-600">(1) Import of goods</td>
                  <td className="px-4 py-3 text-right font-mono">1,25,000</td>
                  <td className="px-4 py-3 text-right font-mono">-</td>
                  <td className="px-4 py-3 text-right font-mono">-</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 pl-8 text-zinc-600">(2) Import of services</td>
                  <td className="px-4 py-3 text-right font-mono">45,000</td>
                  <td className="px-4 py-3 text-right font-mono">-</td>
                  <td className="px-4 py-3 text-right font-mono">-</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 pl-8 text-zinc-600">(3) Inward supplies liable to reverse charge</td>
                  <td className="px-4 py-3 text-right font-mono">12,000</td>
                  <td className="px-4 py-3 text-right font-mono">18,000</td>
                  <td className="px-4 py-3 text-right font-mono">18,000</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 pl-8 text-zinc-600">(4) Inward supplies from ISD</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                  <td className="px-4 py-3 text-right font-mono">0</td>
                </tr>
                <tr className="bg-blue-50/30">
                  <td className="px-4 py-3 pl-8 font-medium text-zinc-900">(5) All other ITC (Reconciled)</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-blue-700">14,50,000</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-blue-700">8,25,000</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-blue-700">8,25,000</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-blue-700">12,500</td>
                </tr>
                <tr className="bg-zinc-50/50">
                  <td className="px-4 py-3 font-medium text-zinc-900" colSpan={5}>(B) ITC Reversed</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 pl-8 text-zinc-600">(1) As per rules 38, 42 and 43 of CGST Rules and section 17(5)</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">45,000</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">12,000</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">12,000</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">0</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 pl-8 text-zinc-600">(2) Others (Rule 37/37A)</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">15,000</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">8,500</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">8,500</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">0</td>
                </tr>
                <tr className="bg-emerald-50/30 border-t-2 border-emerald-200">
                  <td className="px-4 py-3 font-semibold text-zinc-900">(C) Net ITC Available (A) - (B)</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">15,72,000</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">8,22,500</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">8,22,500</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">12,500</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
                Download JSON
              </button>
              <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
                Push to GSTN Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-900 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
              Compliance Reports
            </h3>
            <div className="space-y-2">
              <ReportButton title="ITC Reconciliation Summary" desc="High-level matched/mismatched totals" />
              <ReportButton title="Supplier-wise Reconciliation" desc="Drill down by vendor GSTIN" />
              <ReportButton title="Missing in GSTR-2B" desc="Invoices in books not on portal" />
              <ReportButton title="ITC Ageing Report" desc="Unresolved invoices by 30/60/90 days" />
              <ReportButton title="Blocked Credit Report" desc="Section 17(5) identified ineligible ITC" />
              <ReportButton title="Excess ITC Claimed" desc="Audit risk identification" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-500" />
              Annual Returns
            </h3>
            <div className="space-y-2">
              <ReportButton title="GSTR-9 ITC Reconciliation" desc="Annual comparison (3B vs 2B vs Books)" />
              <ReportButton title="GSTR-9C Workpapers" desc="Audit support documentation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportButton({ title, desc }: { title: string, desc: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left group">
      <div>
        <h4 className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
      <Download className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
    </button>
  );
}
