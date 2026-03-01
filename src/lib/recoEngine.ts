import Papa from 'papaparse';
import { RecoRecord, RecoStatus } from '../types';

export async function processReconciliation(prFile: File, gstrFile: File): Promise<RecoRecord[]> {
  const prData = await parseCsv(prFile);
  const gstrData = await parseCsv(gstrFile);

  const results: RecoRecord[] = [];
  let idCounter = 1;

  // Create lookup maps for faster processing
  const gstrMap = new Map<string, any[]>();
  gstrData.forEach(row => {
    if (!row['Invoice No']) return;
    const invNo = String(row['Invoice No']).trim().toLowerCase();
    if (!gstrMap.has(invNo)) gstrMap.set(invNo, []);
    gstrMap.get(invNo)!.push(row);
  });

  const matchedGstrIds = new Set<number>();

  // Process PR Data
  for (const prRow of prData) {
    if (!prRow['Invoice No']) continue;
    
    const prInvNo = String(prRow['Invoice No']).trim();
    const prInvNoLower = prInvNo.toLowerCase();
    const prDate = prRow['Invoice Date'] || '-';
    const prTaxable = parseFloat(prRow['Taxable Value']) || 0;
    const prTax = parseFloat(prRow['Tax Amount']) || 0;
    const supplierName = prRow['Supplier Name'] || 'Unknown Supplier';
    const gstin = prRow['GSTIN'] || '-';

    let status: RecoStatus = 'Missing in 2B';
    let ruleApplied = 'R46 (Not filed by supplier)';
    let gstrMatch: any = null;

    // Try exact match first
    if (gstrMap.has(prInvNoLower)) {
      const potentials = gstrMap.get(prInvNoLower)!;
      // Find best match based on taxable value
      gstrMatch = potentials.find(p => Math.abs((parseFloat(p['Taxable Value']) || 0) - prTaxable) < 1);
      
      if (!gstrMatch && potentials.length > 0) {
        gstrMatch = potentials[0]; // Take first if no exact value match
      }
    }

    // If no exact match, try fuzzy (leading zeros, special chars)
    if (!gstrMatch) {
      const cleanPrInv = prInvNoLower.replace(/[^a-z0-9]/g, '').replace(/^0+/, '');
      for (const [gstrInv, rows] of gstrMap.entries()) {
        const cleanGstrInv = gstrInv.replace(/[^a-z0-9]/g, '').replace(/^0+/, '');
        if (cleanPrInv === cleanGstrInv) {
          gstrMatch = rows[0];
          break;
        }
      }
    }

    let gstrTaxable = 0;
    let gstrTax = 0;
    let gstrDate = '-';
    let gstrInvoiceNo = '-';

    if (gstrMatch) {
      matchedGstrIds.add(gstrData.indexOf(gstrMatch));
      gstrTaxable = parseFloat(gstrMatch['Taxable Value']) || 0;
      gstrTax = parseFloat(gstrMatch['Tax Amount']) || 0;
      gstrDate = gstrMatch['Invoice Date'] || '-';
      gstrInvoiceNo = gstrMatch['Invoice No'] || '-';

      const taxableDiff = Math.abs(prTaxable - gstrTaxable);
      const taxDiff = Math.abs(prTax - gstrTax);

      if (taxableDiff < 1 && taxDiff < 1 && prInvNoLower === String(gstrInvoiceNo).toLowerCase()) {
        status = 'Exact Match';
        ruleApplied = 'R01, R02, R04';
      } else if (taxableDiff < 10 && taxDiff < 10) {
        status = 'Probable Match';
        ruleApplied = 'R11, R12 (Rounding/Tolerance)';
      } else if (prInvNoLower !== String(gstrInvoiceNo).toLowerCase()) {
        status = 'Probable Match';
        ruleApplied = 'R16/R17 (Fuzzy Invoice Match)';
      } else {
        status = 'Mismatch';
        ruleApplied = 'R27 (Value/Tax Mismatch)';
      }
    }

    results.push({
      id: String(idCounter++),
      supplierName,
      gstin,
      prInvoiceNo: prInvNo,
      prDate,
      prTaxable,
      prTax,
      gstrInvoiceNo,
      gstrDate,
      gstrTaxable,
      gstrTax,
      status,
      ruleApplied
    });
  }

  // Process remaining GSTR-2B data (Missing in PR)
  for (let i = 0; i < gstrData.length; i++) {
    if (matchedGstrIds.has(i)) continue;
    
    const gstrRow = gstrData[i];
    if (!gstrRow['Invoice No']) continue;

    results.push({
      id: String(idCounter++),
      supplierName: gstrRow['Supplier Name'] || 'Unknown Supplier',
      gstin: gstrRow['GSTIN'] || '-',
      prInvoiceNo: '-',
      prDate: '-',
      prTaxable: 0,
      prTax: 0,
      gstrInvoiceNo: gstrRow['Invoice No'],
      gstrDate: gstrRow['Invoice Date'] || '-',
      gstrTaxable: parseFloat(gstrRow['Taxable Value']) || 0,
      gstrTax: parseFloat(gstrRow['Tax Amount']) || 0,
      status: 'Missing in PR',
      ruleApplied: 'R45 (Not accounted in PR)'
    });
  }

  return results;
}

function parseCsv(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}
