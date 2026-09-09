import type { RefObject } from 'react';
import type { useReceiptExport } from '../../hooks/useReceiptExport';
import type { TemplateType } from '../../types/receipt';

interface Props {
  exportState: ReturnType<typeof useReceiptExport>;
  targetRef: RefObject<HTMLElement | null>;
  template: TemplateType;
}

export function ActionToolbar({ exportState, targetRef, template }: Props) {
  const { isExporting, isCopying, toast, downloadImage, copyImageToClipboard, printReceipt } = exportState;

  return (
    <div className="w-full flex flex-col items-center gap-3 mt-2 no-print">
      <div className="w-full max-w-[360px] flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => downloadImage(targetRef, template)}
          disabled={isExporting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {isExporting ? (
            <span>Generating...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PNG</span>
            </>
          )}
        </button>

        <button
          onClick={() => copyImageToClipboard(targetRef)}
          disabled={isCopying}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 font-medium rounded-xl text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {isCopying ? (
            <span>Copying...</span>
          ) : (
            <>
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={printReceipt}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 font-medium rounded-xl text-sm transition-all shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print</span>
        </button>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 py-2.5 px-4 rounded-xl shadow-xl text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
