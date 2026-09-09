import { useState, useEffect, useCallback } from 'react';
import type { ReceiptData, TemplateType, LineItem } from '../types/receipt';
import type { ParsedScreenTimeData } from '../utils/analyzeScreenshot';

const uid = () => Math.random().toString(36).substring(2, 9);

const PRESETS: Record<TemplateType, ReceiptData> = {
  gym: {
    template: 'gym',
    metadata: {
      storeName: 'IRON FORGE BARBELL',
      receiptNumber: '#0042-GYM',
      date: new Date().toLocaleDateString(),
      time: '06:00 AM',
      cashier: 'BRODIN',
    },
    items: [
      { id: uid(), name: 'Barbell Squat', quantity: '3x5', detail: '315 lbs', cost: 'HEAVY' },
      { id: uid(), name: 'Bench Press', quantity: '3x8', detail: '225 lbs', cost: 'CLEAN' },
      { id: uid(), name: 'Deadlift', quantity: '1x5', detail: '405 lbs', cost: 'PR!!' },
    ],
    summary: {
      subtotal: '3 EXERCISES',
      taxLabel: 'WEAKNESS TAX',
      taxValue: '0.00',
      totalHeadline: 'VERDICT',
      totalValue: 'APPROVED',
    },
    footerMessage: 'THANK YOU FOR NOT SKIPPING LEG DAY.',
    barcodeText: 'LIFT-HEAVY-VOICE-QUIET',
  },
  screentime: {
    template: 'screentime',
    metadata: {
      storeName: 'DOOMSCROLL CLINIC',
      receiptNumber: '#0991-SCR',
      date: new Date().toLocaleDateString(),
      time: '11:45 PM',
      cashier: 'ALGORITHM',
    },
    items: [
      { id: uid(), name: 'TikTok', quantity: '2h 15m', detail: 'FYP Scrolling', cost: '-90 IQ' },
      { id: uid(), name: 'Instagram', quantity: '45m', detail: 'Stories', cost: '-10 ENVY' },
      { id: uid(), name: 'Twitter / X', quantity: '30m', detail: 'Arguing', cost: '+100 RAGE' },
    ],
    summary: {
      subtotal: '3h 30m WASTED',
      taxLabel: 'ATTENTION TAX',
      taxValue: 'MAX',
      totalHeadline: 'DIAGNOSIS',
      totalValue: 'BRAIN ROT',
    },
    footerMessage: 'PLEASE TOUCH GRASS BEFORE RETURNING.',
    barcodeText: 'DELETE-THE-APPS',
  },
  study: {
    template: 'study',
    metadata: {
      storeName: 'MIDNIGHT CRAM CO.',
      receiptNumber: '#1024-STD',
      date: new Date().toLocaleDateString(),
      time: '02:00 AM',
      cashier: 'CAFFEINE',
    },
    items: [
      { id: uid(), name: 'LeetCode', quantity: '5 probs', detail: 'Dynamic Prog.', cost: 'TEARS' },
      { id: uid(), name: 'Documentation', quantity: '10 pgs', detail: 'React Docs', cost: 'FOCUS' },
      { id: uid(), name: 'Debugging', quantity: '2h', detail: 'Missing Comma', cost: 'PAIN' },
    ],
    summary: {
      subtotal: '4 HOURS TOTAL',
      taxLabel: 'SANITY TAX',
      taxValue: 'PAID',
      totalHeadline: 'RESULT',
      totalValue: 'HIRED',
    },
    footerMessage: 'TRUST THE PROCESS. KEEP BUILDING.',
    barcodeText: 'GIT-COMMIT-PUSH-SLEEP',
  },
};

const KEY = 'receiptify_data';

export function useReceiptState() {
  const [data, setData] = useState<ReceiptData>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : PRESETS.gym;
    } catch {
      return PRESETS.gym;
    }
  });

  const [isPulseAnimating, setIsPulseAnimating] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const updateMetadata = useCallback((field: keyof ReceiptData['metadata'], value: string) => {
    setData((prev) => ({ ...prev, metadata: { ...prev.metadata, [field]: value } }));
  }, []);

  const updateSummary = useCallback((field: keyof ReceiptData['summary'], value: string) => {
    setData((prev) => ({ ...prev, summary: { ...prev.summary, [field]: value } }));
  }, []);

  const updateGeneral = useCallback((field: 'footerMessage' | 'barcodeText', value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addLineItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: uid(), name: 'New Item', quantity: '1', detail: 'Info', cost: '0' }],
    }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }, []);

  const changeTemplate = useCallback((template: TemplateType) => {
    setData(PRESETS[template]);
  }, []);

  const resetToDefault = useCallback(() => {
    setData(PRESETS[data.template]);
  }, [data.template]);

  const applyParsedScreenTime = useCallback((parsedData: ParsedScreenTimeData) => {
    const items: LineItem[] = parsedData.topApps.map((app) => ({
      id: uid(),
      name: app.name,
      quantity: app.time,
      detail: app.category || 'Doomscroll',
      cost: app.cost || '-50 IQ',
    }));

    const nextData: ReceiptData = {
      template: 'screentime',
      metadata: {
        storeName: parsedData.storeName || 'OFFICIAL DOPAMINE CITATION',
        receiptNumber: `#CIT-${Math.floor(1000 + Math.random() * 9000)}-DOP`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cashier: parsedData.cashier || 'DOPAMINE POLICE',
      },
      items,
      summary: {
        subtotal: `${parsedData.totalScreenTime} WASTED (${parsedData.halfScreenTime} STUDY LOSS)`,
        taxLabel: 'FUTURE CAREER LOSS',
        taxValue: '-1 DOCTOR/ENG',
        totalHeadline: 'VERDICT',
        totalValue: parsedData.citationVerdict || 'CHRONICALLY ONLINE',
      },
      footerMessage: parsedData.footerMessage,
      barcodeText: parsedData.worstOffender
        ? `CIT-${parsedData.worstOffender.toUpperCase().replace(/\s+/g, '-')}-FINED`
        : 'DELETE-THE-APPS',
    };

    setData(nextData);
    setIsPulseAnimating(true);
    setTimeout(() => setIsPulseAnimating(false), 1000);
  }, []);

  return {
    data,
    isPulseAnimating,
    updateMetadata,
    updateSummary,
    updateGeneral,
    addLineItem,
    removeLineItem,
    updateLineItem,
    changeTemplate,
    resetToDefault,
    applyParsedScreenTime,
  };
}
