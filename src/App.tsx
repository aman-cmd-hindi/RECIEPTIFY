import { useRef } from 'react';
import { useReceiptState } from './hooks/useReceiptState';
import { useReceiptExport } from './hooks/useReceiptExport';
import { ControlPanel } from './components/editor/ControlPanel';
import { ReceiptCard } from './components/receipt/ReceiptCard';
import { ActionToolbar } from './components/common/ActionToolbar';

export default function App() {
  const receiptState = useReceiptState();
  const exportState = useReceiptExport();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 gap-8 sm:gap-12 bg-zinc-200 print:bg-white print:p-0">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8 no-print">
        <header className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 3h6a2 2 0 012 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 012-2z" />
              <path d="M9 8h6M9 12h4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">Receiptify</h1>
            <p className="text-xs text-zinc-500">Create aesthetic habit receipts for your stories.</p>
          </div>
        </header>
        <ControlPanel receipt={receiptState} />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center text-xs font-semibold text-zinc-400 uppercase tracking-wider no-print px-1">
          <span>Preview</span>
          <span>9:16</span>
        </div>

        <div
          ref={cardRef}
          className="w-full max-w-[360px] aspect-[9/16] bg-zinc-300 shadow-2xl flex items-center justify-center overflow-hidden rounded-xl print:shadow-none print:bg-white print:rounded-none"
        >
          <ReceiptCard data={receiptState.data} />
        </div>

        <ActionToolbar
          exportState={exportState}
          targetRef={cardRef}
          template={receiptState.data.template}
        />
      </div>
    </main>
  );
}
