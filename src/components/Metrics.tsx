import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const metricsCategories = [
  {
    category: "Exact Match Rules",
    description: "Rules that require 100% exact matching between PR and 2B.",
    rules: [
      { id: "R01", name: "Exact Match: Invoice Number", desc: "Invoice number matches exactly (case-sensitive)." },
      { id: "R02", name: "Exact Match: Invoice Date", desc: "Invoice date matches exactly." },
      { id: "R03", name: "Exact Match: Supplier GSTIN", desc: "Supplier GSTIN matches exactly." },
      { id: "R04", name: "Exact Match: Taxable Value", desc: "Taxable value matches exactly." },
      { id: "R05", name: "Exact Match: IGST Amount", desc: "IGST amount matches exactly." },
      { id: "R06", name: "Exact Match: CGST Amount", desc: "CGST amount matches exactly." },
      { id: "R07", name: "Exact Match: SGST Amount", desc: "SGST amount matches exactly." },
      { id: "R08", name: "Exact Match: Cess Amount", desc: "Cess amount matches exactly." },
      { id: "R09", name: "Exact Match: Document Type", desc: "Document type (Invoice, Debit Note, Credit Note) matches exactly." },
      { id: "R10", name: "Exact Match: POS", desc: "Place of Supply matches exactly." },
    ]
  },
  {
    category: "Tolerance & Rounding Rules",
    description: "Rules that allow for minor discrepancies due to rounding or data entry errors.",
    rules: [
      { id: "R11", name: "Tolerance: Taxable Value (±₹1)", desc: "Taxable value matches within a ₹1 tolerance." },
      { id: "R12", name: "Tolerance: Tax Amounts (±₹1)", desc: "Total tax amount matches within a ₹1 tolerance." },
      { id: "R13", name: "Tolerance: Invoice Value (±₹10)", desc: "Total invoice value matches within a ₹10 tolerance." },
      { id: "R14", name: "Rounding: Decimal Truncation", desc: "Matches when decimals are truncated (e.g., 100.50 vs 100)." },
      { id: "R15", name: "Rounding: Nearest Rupee", desc: "Matches when values are rounded to the nearest rupee." },
    ]
  },
  {
    category: "Fuzzy & Partial Match Rules",
    description: "Rules that handle variations in string formatting, especially invoice numbers.",
    rules: [
      { id: "R16", name: "Fuzzy: Ignore Leading Zeros", desc: "Matches invoice numbers ignoring leading zeros (e.g., 00123 vs 123)." },
      { id: "R17", name: "Fuzzy: Ignore Special Characters", desc: "Matches invoice numbers ignoring hyphens, slashes, etc. (e.g., INV-123 vs INV123)." },
      { id: "R18", name: "Fuzzy: Case Insensitive", desc: "Matches invoice numbers ignoring case (e.g., inv-123 vs INV-123)." },
      { id: "R19", name: "Fuzzy: Substring Match", desc: "Matches if PR invoice number is a substring of 2B invoice number." },
      { id: "R20", name: "Fuzzy: Date Format Variation", desc: "Matches dates in different formats (DD/MM/YYYY vs MM/DD/YYYY)." },
      { id: "R21", name: "Fuzzy: Date within ±2 Days", desc: "Matches if invoice date is within 2 days (data entry error)." },
      { id: "R22", name: "Fuzzy: Financial Year Prefix", desc: "Matches ignoring FY prefixes (e.g., 23-24/123 vs 123)." },
    ]
  },
  {
    category: "Cross-Period Matching",
    description: "Rules for invoices accounted in different periods.",
    rules: [
      { id: "R23", name: "Period: PR Current vs 2B Previous", desc: "Invoice in current month PR, but was in previous month 2B." },
      { id: "R24", name: "Period: PR Previous vs 2B Current", desc: "Invoice in previous month PR, but appeared in current month 2B." },
      { id: "R25", name: "Period: PR Current vs 2B Future", desc: "Invoice in current month PR, expected in future 2B." },
      { id: "R26", name: "Period: Year-End Spillover", desc: "March PR invoice matching with April 2B." },
    ]
  },
  {
    category: "Tax Rate & POS Mismatches",
    description: "Rules identifying discrepancies in tax application.",
    rules: [
      { id: "R27", name: "Mismatch: Tax Rate", desc: "Taxable value matches, but applied GST rate differs." },
      { id: "R28", name: "Mismatch: IGST vs CGST/SGST", desc: "Inter-state vs Intra-state tax application mismatch." },
      { id: "R29", name: "Mismatch: POS vs Supplier State", desc: "Place of Supply does not align with Supplier's GSTIN state." },
      { id: "R30", name: "Mismatch: RCM Flag", desc: "Reverse Charge Mechanism flag differs between PR and 2B." },
      { id: "R31", name: "Mismatch: Ineligible ITC Flag", desc: "Ineligible ITC flag differs." },
    ]
  },
  {
    category: "Supplier & GSTIN Rules",
    description: "Rules handling supplier identity variations.",
    rules: [
      { id: "R32", name: "Supplier: Same PAN, Different State", desc: "GSTIN mismatch, but PAN is identical (multi-state vendor)." },
      { id: "R33", name: "Supplier: Cancelled GSTIN", desc: "Supplier GSTIN is cancelled as per GSTN portal." },
      { id: "R34", name: "Supplier: Suspended GSTIN", desc: "Supplier GSTIN is suspended." },
      { id: "R35", name: "Supplier: Non-Filer (GSTR-1)", desc: "Supplier has not filed GSTR-1 for the period." },
      { id: "R36", name: "Supplier: Non-Filer (GSTR-3B)", desc: "Supplier has not filed GSTR-3B for the period." },
      { id: "R37", name: "Supplier: QRMP Scheme", desc: "Supplier is under QRMP scheme (quarterly filing)." },
    ]
  },
  {
    category: "Document Specific Rules",
    description: "Rules specific to Credit/Debit Notes and Amendments.",
    rules: [
      { id: "R38", name: "Doc: Credit Note against Missing Invoice", desc: "Credit note exists, but original invoice is missing." },
      { id: "R39", name: "Doc: Debit Note against Missing Invoice", desc: "Debit note exists, but original invoice is missing." },
      { id: "R40", name: "Doc: Amended Invoice (B2BA)", desc: "Original invoice was amended in subsequent GSTR-1." },
      { id: "R41", name: "Doc: Amended Credit Note (CDNA)", desc: "Credit note was amended." },
      { id: "R42", name: "Doc: ISD Invoice", desc: "Invoice from Input Service Distributor." },
      { id: "R43", name: "Doc: Import of Goods (IMPG)", desc: "Bill of Entry matching with ICEGATE data." },
      { id: "R44", name: "Doc: Import of Services (IMPS)", desc: "Import of services under RCM." },
    ]
  },
  {
    category: "Missing Record Rules",
    description: "Categorization of records present in one dataset but missing in the other.",
    rules: [
      { id: "R45", name: "Missing: In 2B, Not in PR", desc: "Invoice available in 2B but not accounted in Purchase Register." },
      { id: "R46", name: "Missing: In PR, Not in 2B", desc: "Invoice accounted in PR but supplier hasn't uploaded in GSTR-1." },
      { id: "R47", name: "Missing: Duplicate in PR", desc: "Multiple entries for the same invoice in Purchase Register." },
      { id: "R48", name: "Missing: Duplicate in 2B", desc: "Supplier uploaded the same invoice multiple times." },
    ]
  },
  {
    category: "Advanced AI/ML Rules",
    description: "Probabilistic matching using advanced algorithms.",
    rules: [
      { id: "R49", name: "AI: Vendor Name Similarity", desc: "Matches based on Levenshtein distance of vendor names when GSTIN is missing." },
      { id: "R50", name: "AI: Amount Transposition", desc: "Detects transposed digits in amounts (e.g., 1234 vs 1324)." },
      { id: "R51", name: "AI: Date Transposition", desc: "Detects transposed digits in dates (e.g., 12/03 vs 21/03)." },
      { id: "R52", name: "AI: Composite Match Score > 80%", desc: "Weighted score across multiple fields exceeds 80% threshold." },
    ]
  }
];

export function Metrics() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(metricsCategories.map(c => c.category));
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredCategories = metricsCategories.map(cat => ({
    ...cat,
    rules: cat.rules.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.rules.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">50+ Reconciliation Metrics</h1>
          <p className="text-sm text-zinc-500 mt-1">Comprehensive rule engine for GSTR-2B vs Purchase Register matching.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search rules, IDs, or descriptions..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Filter className="w-4 h-4" />
            <span>Rule Categories</span>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Total Active Rules: 52
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {filteredCategories.map((category) => (
            <div key={category.category} className="group">
              <button 
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1 rounded-md transition-colors",
                    expandedCategories.includes(category.category) ? "bg-zinc-200 text-zinc-900" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                  )}>
                    {expandedCategories.includes(category.category) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{category.category}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{category.description}</p>
                  </div>
                </div>
                <div className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded-md text-zinc-600">
                  {category.rules.length} Rules
                </div>
              </button>

              {expandedCategories.includes(category.category) && (
                <div className="px-4 pb-4 pt-2 bg-zinc-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.rules.map((rule) => (
                      <div key={rule.id} className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-mono font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{rule.id}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <h4 className="text-sm font-medium text-zinc-900 mb-1 line-clamp-1" title={rule.name}>{rule.name}</h4>
                        <p className="text-xs text-zinc-500 line-clamp-2" title={rule.desc}>{rule.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center justify-center text-zinc-500">
              <AlertCircle className="w-8 h-8 mb-3 text-zinc-400" />
              <p className="text-sm font-medium text-zinc-900">No rules found</p>
              <p className="text-xs mt-1">Try adjusting your search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
