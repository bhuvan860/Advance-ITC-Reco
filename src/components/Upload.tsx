import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { processReconciliation } from '../lib/recoEngine';
import { RecoRecord } from '../types';

export function Upload({ onDataProcessed }: { onDataProcessed: (data: RecoRecord[]) => void }) {
  const [prFile, setPrFile] = useState<File | null>(null);
  const [gstrFile, setGstrFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    if (!prFile || !gstrFile) return;
    setIsUploading(true);
    
    try {
      const results = await processReconciliation(prFile, gstrFile);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        onDataProcessed(results);
      }, 1500);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Failed to process files. Please ensure they are valid CSVs with the correct headers.");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSample = (type: 'PR' | '2B') => {
    const headers = "GSTIN,Supplier Name,Invoice No,Invoice Date,Taxable Value,Tax Amount\n";
    let data = "";
    if (type === 'PR') {
      data = "27AADCB2230M1Z2,Acme Corp,INV-2023-001,12-Aug-23,50000,9000\n07BBDCT1120L1Z5,Tech Solutions,TS/23-24/045,15-Sep-23,125000,22500\n";
    } else {
      data = "27AADCB2230M1Z2,Acme Corp,INV-2023-001,12-Aug-23,50000,9000\n07BBDCT1120L1Z5,Tech Solutions,TS/23-24/045,15-Sep-23,125000,22500\n";
    }
    const blob = new Blob([headers + data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Sample_${type}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Data Ingestion</h1>
          <p className="text-sm text-zinc-500 mt-1">Upload your Purchase Register and GSTR-2B files to begin reconciliation.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadSample('PR')} className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Sample PR
          </button>
          <button onClick={() => downloadSample('2B')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Sample 2B
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploadCard 
          title="Purchase Register (Books)" 
          description="Upload your ERP export (CSV). Ensure it contains Invoice No, Invoice Date, GSTIN, Taxable Value, and Tax Amount."
          file={prFile}
          setFile={setPrFile}
          accept=".csv"
          color="blue"
        />
        <FileUploadCard 
          title="GSTR-2B (Portal)" 
          description="Upload the CSV file downloaded directly from the GST portal."
          file={gstrFile}
          setFile={setGstrFile}
          accept=".csv"
          color="emerald"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-sm text-zinc-600">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-zinc-900">Important Note</p>
            <p className="mt-1">Ensure both files cover the same financial period. The system will automatically apply the 50+ reconciliation metrics once data is ingested.</p>
          </div>
        </div>
        <button 
          onClick={handleUpload}
          disabled={!prFile || !gstrFile || isUploading}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0",
            (!prFile || !gstrFile) ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" :
            isUploading ? "bg-zinc-900 text-white opacity-80 cursor-wait" :
            uploadSuccess ? "bg-emerald-500 text-white hover:bg-emerald-600" :
            "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md hover:shadow-lg"
          )}
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
          ) : uploadSuccess ? (
            <><CheckCircle2 className="w-4 h-4" /> Uploaded Successfully</>
          ) : (
            <><UploadCloud className="w-4 h-4" /> Start Reconciliation</>
          )}
        </button>
      </div>
    </div>
  );
}

function FileUploadCard({ 
  title, 
  description, 
  file, 
  setFile, 
  accept,
  color
}: { 
  title: string, 
  description: string, 
  file: File | null, 
  setFile: (f: File | null) => void,
  accept: string,
  color: 'blue' | 'emerald'
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const colorStyles = {
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-500',
      hover: 'hover:border-blue-400 hover:bg-blue-50/50'
    },
    emerald: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      icon: 'text-emerald-500',
      hover: 'hover:border-emerald-400 hover:bg-emerald-50/50'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
          <FileSpreadsheet className={cn("w-5 h-5", styles.icon)} />
          {title}
        </h3>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{description}</p>
      </div>

      <div 
        className={cn(
          "mt-auto border-2 border-dashed rounded-lg p-8 text-center transition-all relative flex-1 flex flex-col items-center justify-center min-h-[200px]",
          isDragging ? cn(styles.border, styles.bg) : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50",
          file ? cn(styles.border, styles.bg) : styles.hover
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          accept={accept}
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border", styles.border)}>
              <CheckCircle2 className={cn("w-6 h-6", styles.icon)} />
            </div>
            <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-zinc-500 mt-1 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              onClick={(e) => { e.preventDefault(); setFile(null); }}
              className="mt-4 text-xs font-medium text-rose-500 hover:text-rose-600 relative z-10"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900">Click or drag file to upload</p>
            <p className="text-xs text-zinc-500 mt-1 font-mono">Accepts {accept}</p>
          </div>
        )}
      </div>
    </div>
  );
}
