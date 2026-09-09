export type TemplateType = 'gym' | 'screentime' | 'study';

export interface LineItem {
  id: string;
  name: string;
  quantity: string;
  detail: string;
  cost: string;
}

export interface ReceiptMetadata {
  storeName: string;
  receiptNumber: string;
  date: string;
  time: string;
  cashier: string;
}

export interface ReceiptSummary {
  subtotal: string;
  taxLabel: string;
  taxValue: string;
  totalHeadline: string;
  totalValue: string;
}

export interface ReceiptData {
  template: TemplateType;
  metadata: ReceiptMetadata;
  items: LineItem[];
  summary: ReceiptSummary;
  footerMessage: string;
  barcodeText: string;
}
