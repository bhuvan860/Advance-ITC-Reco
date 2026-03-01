import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { RecoRecord, RecoStatus } from '../types';

const StatusIcon = ({ status }: { status: RecoStatus }) => {
  switch (status) {
    case 'Exact Match': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'Probable Match': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'Mismatch': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case 'Missing in 2B': return <XCircle className="w-4 h-4 text-rose-500" />;
    case 'Missing in PR': return <HelpCircle className="w-4 h-4 text-violet-500" />;
    default: return null;
  }
};

const StatusBadge = ({ status }: { status: RecoStatus }) => {
  const styles = {
    'Exact Match': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Probable Match': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Mismatch': 'bg-amber-50 text-amber-700 border-amber-200',
    'Missing in 2B': 'bg-rose-50 text-rose-700 border-rose-200',
    'Missing in PR': 'bg-violet-50 text-violet-700 border-violet-200',
  };

  return (
    <span className={cn("px-2 py-1 text-xs font-medium rounded-md border flex items-center gap-1.5 w-fit", styles[status])}>
      <StatusIcon status={status} />
      {status}
    </span>
  );
};

export function Reconciliation({ data, setData }: { data: RecoRecord[], setData: React.Dispatch<React.SetStateAction<RecoRecord[]>> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecoStatus | 'All'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gstrInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredData.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleMarkAsReviewed = () => {
    setData(prevData => prevData.map(item => 
      selectedIds.has(item.id) ? { ...item, isReviewed: true } : item
    ));
    setSelectedIds(new Set());
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
  };

  const handleExport = () => {
    if (filteredData.length === 0) return;

    const headers = [
      'ID',
      'Supplier Name',
      'GSTIN',
      'PR Invoice No',
      'PR Date',
      'PR Taxable Value',
      'PR Tax Amount',
      'GSTR-2B Invoice No',
      'GSTR-2B Date',
      'GSTR-2B Taxable Value',
      'GSTR-2B Tax Amount',
      'Status',
      'Rule Applied'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.id,
        `"${row.supplierName}"`,
        row.gstin,
        row.prInvoiceNo,
        row.prDate,
        row.prTaxable,
        row.prTax,
        row.gstrInvoiceNo,
        row.gstrDate,
        row.gstrTaxable,
        row.gstrTax,
        row.status,
        `"${row.ruleApplied}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reconciliation_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Reconciliation Results</h1>
          <p className="text-sm text-zinc-500 mt-1">Detailed invoice-level matching between Purchase Register and GSTR-2B.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search GSTIN, Invoice, Supplier..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-medium text-zinc-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RecoStatus | 'All')}
            >
              <option value="All">All Statuses</option>
              <option value="Exact Match">Exact Match</option>
              <option value="Probable Match">Probable Match</option>
              <option value="Mismatch">Mismatch</option>
              <option value="Missing in 2B">Missing in 2B</option>
              <option value="Missing in PR">Missing in PR</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 mr-2 border-r border-zinc-200 pr-4">
              <span className="text-sm font-medium text-zinc-600">{selectedIds.size} selected</span>
              <button 
                onClick={handleMarkAsReviewed}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Reviewed
              </button>
            </div>
          )}

          <button 
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 sticky top-0 z-10 border-b border-zinc-200">
              <tr>
                <th rowSpan={2} className="px-4 py-3 border-r border-zinc-200 bg-zinc-50 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                    checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th colSpan={3} className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-r border-zinc-200 bg-zinc-100/50">Supplier Details</th>
                <th colSpan={3} className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-r border-zinc-200 bg-blue-50/30 text-center">Purchase Register (Books)</th>
                <th colSpan={3} className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-r border-zinc-200 bg-emerald-50/30 text-center">GSTR-2B (Portal)</th>
                <th colSpan={2} className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-amber-50/30 text-center">Reconciliation Status</th>
              </tr>
              <tr className="border-b border-zinc-200">
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-zinc-50">GSTIN</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-zinc-50">Supplier Name</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-zinc-50 border-r border-zinc-200">ID</th>
                
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-blue-50/10">Invoice No & Date</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-blue-50/10 text-right">Taxable Val</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-blue-50/10 text-right border-r border-zinc-200">Tax Amt</th>
                
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-emerald-50/10">Invoice No & Date</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-emerald-50/10 text-right">Taxable Val</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-emerald-50/10 text-right border-r border-zinc-200">Tax Amt</th>
                
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-amber-50/10">Status</th>
                <th className="px-4 py-2 text-xs font-medium text-zinc-500 bg-amber-50/10">Rule Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredData.map((row) => (
                <tr key={row.id} className={cn("hover:bg-zinc-50/80 transition-colors group", row.isReviewed ? "bg-zinc-50/50" : "")}>
                  <td className="px-4 py-3 border-r border-zinc-100 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                      checked={selectedIds.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-zinc-600 whitespace-nowrap">{row.gstin}</td>
                  <td className="px-4 py-3 text-sm text-zinc-900 font-medium truncate max-w-[150px]" title={row.supplierName}>{row.supplierName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-zinc-400 border-r border-zinc-100">{row.id}</td>
                  
                  <td className="px-4 py-3 border-r border-zinc-100 bg-blue-50/5 group-hover:bg-blue-50/20 transition-colors">
                    <div className="text-sm font-mono text-zinc-900">{row.prInvoiceNo}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{row.prDate}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 text-right font-mono bg-blue-50/5 group-hover:bg-blue-50/20 transition-colors">{formatCurrency(row.prTaxable)}</td>
                  <td className="px-4 py-3 text-sm text-zinc-900 text-right font-mono border-r border-zinc-100 bg-blue-50/5 group-hover:bg-blue-50/20 transition-colors">{formatCurrency(row.prTax)}</td>
                  
                  <td className="px-4 py-3 border-r border-zinc-100 bg-emerald-50/5 group-hover:bg-emerald-50/20 transition-colors">
                    <div className="text-sm font-mono text-zinc-900">{row.gstrInvoiceNo}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{row.gstrDate}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 text-right font-mono bg-emerald-50/5 group-hover:bg-emerald-50/20 transition-colors">{formatCurrency(row.gstrTaxable)}</td>
                  <td className="px-4 py-3 text-sm text-zinc-900 text-right font-mono border-r border-zinc-100 bg-emerald-50/5 group-hover:bg-emerald-50/20 transition-colors">{formatCurrency(row.gstrTax)}</td>
                  
                  <td className="px-4 py-3 bg-amber-50/5 group-hover:bg-amber-50/20 transition-colors">
                    <div className="flex flex-col gap-1.5">
                      <StatusBadge status={row.status} />
                      {row.isReviewed && (
                        <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Reviewed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600 bg-amber-50/5 group-hover:bg-amber-50/20 transition-colors">
                    <div className="flex items-center gap-1.5 bg-white border border-zinc-200 px-2 py-1 rounded w-fit">
                      <Filter className="w-3 h-3 text-zinc-400" />
                      <span className="font-mono truncate max-w-[150px]" title={row.ruleApplied}>{row.ruleApplied}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 mb-3 text-zinc-300" />
                      <p className="text-sm font-medium text-zinc-900">No records found</p>
                      <p className="text-xs mt-1">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500 shrink-0">
          <span>Showing {filteredData.length} of {data.length} records</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-zinc-200 rounded bg-white hover:bg-zinc-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 border border-zinc-200 rounded bg-white hover:bg-zinc-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
