import { useState, useCallback, type RefObject } from 'react';
import { toPng, toBlob } from 'html-to-image';
import type { TemplateType } from '../types/receipt';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export function useReceiptExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const downloadImage = useCallback(async (
    targetRef: RefObject<HTMLElement | null>,
    template: TemplateType = 'gym'
  ) => {
    if (!targetRef.current || isExporting) return;

    try {
      setIsExporting(true);
      const node = targetRef.current;

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        quality: 1,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });

      const dateStr = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.download = `receipt-${template}-${dateStr}.png`;
      link.href = dataUrl;
      link.click();

      showToast('Downloaded story image');
    } catch (err) {
      console.error(err);
      showToast('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, showToast]);

  const copyImageToClipboard = useCallback(async (
    targetRef: RefObject<HTMLElement | null>
  ) => {
    if (!targetRef.current || isCopying) return;

    try {
      setIsCopying(true);
      const node = targetRef.current;

      const blob = await toBlob(node, {
        pixelRatio: 3,
        cacheBust: true,
        quality: 1,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });

      if (!blob) throw new Error('Blob generation failed');

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        showToast('Copied to clipboard');
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      console.error(err);
      showToast('Clipboard copy unsupported', 'error');
    } finally {
      setIsCopying(false);
    }
  }, [isCopying, showToast]);

  const printReceipt = useCallback(() => {
    window.print();
  }, []);

  return {
    isExporting,
    isCopying,
    toast,
    downloadImage,
    copyImageToClipboard,
    printReceipt,
  };
}
