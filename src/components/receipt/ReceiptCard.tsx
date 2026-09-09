import { useMemo } from 'react';
import type { ReceiptData } from '../../types/receipt';

interface Props {
  data: ReceiptData;
  isPulseAnimating?: boolean;
}

export function ReceiptCard({ data, isPulseAnimating }: Props) {
  const clipPathStyle = useMemo(() => {
    const points: string[] = [];
    const count = 30;
    for (let i = 0; i <= count; i++) {
      points.push(`${(i / count) * 100}% ${i % 2 === 0 ? 0 : 6}px`);
    }
    for (let i = count; i >= 0; i--) {
      points.push(`${(i / count) * 100}% ${i % 2 === 0 ? '100%' : 'calc(100% - 6px)'}`);
    }
    return { clipPath: `polygon(${points.join(', ')})` };
  }, []);

  const barcodeSvg = useMemo(() => {
    const bars = [2, 1, 3, 1, 1, 4, 1, 2, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2];
    let offset = 0;
    const total = bars.reduce((acc, b) => acc + b + 1, 0) - 1;

    return (
      <svg viewBox={`0 0 ${total} 20`} className="w-full h-10" preserveAspectRatio="none">
        {bars.map((w, i) => {
          const rect = <rect key={i} x={offset} y="0" width={w} height="20" fill="currentColor" />;
          offset += w + 1;
          return rect;
        })}
      </svg>
    );
  }, []);

  if (!data?.metadata || !data?.items) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        className={`w-full max-w-[310px] bg-[#fbfbf9] text-[#262626] font-receipt shadow-xl flex flex-col pt-7 pb-9 px-6 relative transition-all duration-500 ${
          isPulseAnimating ? 'scale-105 ring-4 ring-amber-400/80 shadow-2xl' : ''
        }`}
        style={clipPathStyle}
      >
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold uppercase tracking-tight">{data.metadata.storeName}</h2>
          <div className="text-[11px] mt-1 space-y-0.5 text-zinc-700">
            <div className="flex justify-between">
              <span>DATE: {data.metadata.date}</span>
              <span>TIME: {data.metadata.time}</span>
            </div>
            <div className="flex justify-between">
              <span>RCPT: {data.metadata.receiptNumber}</span>
              <span>CSHR: {data.metadata.cashier}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-zinc-400 w-full my-3" />

        <div className="flex flex-col space-y-2.5 my-1 text-xs">
          {data.items.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div className="flex justify-between items-end">
                <span className="font-bold uppercase">{item.name}</span>
                <span className="uppercase">{item.cost}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-0.5">
                <span>{item.quantity}</span>
                <div className="flex-1 border-b border-dotted border-zinc-300 mx-2 relative -top-1" />
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-zinc-400 w-full my-3" />

        <div className="flex flex-col space-y-1 text-xs uppercase">
          <div className="flex justify-between">
            <span>{data.summary.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>{data.summary.taxLabel}</span>
            <span>{data.summary.taxValue}</span>
          </div>

          <div className="border-t-2 border-double border-zinc-900 w-full mt-2 mb-1" />

          <div className="flex justify-between items-center text-base font-bold">
            <span>{data.summary.totalHeadline}</span>
            <span>{data.summary.totalValue}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          {barcodeSvg}
          <span className="text-[9px] tracking-widest mt-1 uppercase">{data.barcodeText}</span>
          <p className="mt-4 text-[11px] font-bold uppercase border-y border-zinc-900 py-1.5 px-2 leading-tight">
            {data.footerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
