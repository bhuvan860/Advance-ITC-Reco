export type RecoStatus = 
  | 'Exact Match' 
  | 'Probable Match' 
  | 'Mismatch' 
  | 'Missing in 2B' 
  | 'Missing in PR'
  | 'Pending/Deferred'
  | 'Ineligible ITC'
  | 'Partially Claimed'
  | 'RCM'
  | 'Amendment Required';

export interface RecoRecord {
  id: string;
  supplierName: string;
  gstin: string;
  prInvoiceNo: string;
  prDate: string;
  prTaxable: number;
  prTax: number;
  gstrInvoiceNo: string;
  gstrDate: string;
  gstrTaxable: number;
  gstrTax: number;
  status: RecoStatus;
  ruleApplied: string;
  isReviewed?: boolean;
  actionTaken?: 'Accepted' | 'Rejected' | 'Deferred' | 'Communicated';
}

export interface Vendor {
  id: string;
  name: string;
  gstin: string;
  complianceScore: 'High' | 'Medium' | 'Low' | 'Non-Compliant';
  filingRate: number;
  itcAtRisk: number;
  lastFollowUp?: string;
}

export interface Notice {
  id: string;
  type: 'DRC-01C' | 'ASMT-10' | 'SCN';
  dateReceived: string;
  dueDate: string;
  status: 'Open' | 'Drafted' | 'Replied' | 'Closed';
  amountInvolved: number;
}
