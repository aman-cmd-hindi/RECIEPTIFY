import type { TemplateType } from '../../types/receipt';
import type { useReceiptState } from '../../hooks/useReceiptState';
import { ScreenshotUploader } from '../upload/ScreenshotUploader';

interface Props {
  receipt: ReturnType<typeof useReceiptState>;
}

export function ControlPanel({ receipt }: Props) {
  const { data, changeTemplate, resetToDefault, updateMetadata, updateLineItem, addLineItem, removeLineItem, updateSummary, updateGeneral, applyParsedScreenTime } = receipt;

  const templates: TemplateType[] = ['gym', 'screentime', 'study'];
  const inputClass = "w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 transition-all";
  const labelClass = "block text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider";

  return (
    <div className="flex flex-col h-full max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar space-y-6">
      {/* Auto-Scan Screenshot Uploader */}
      <ScreenshotUploader onParsed={applyParsedScreenTime} />

      <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl">
        {templates.map((t) => (
          <button
            key={t}
            onClick={() => changeTemplate(t)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              data.template === t ? 'bg-white shadow-xs text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-zinc-800">Metadata</h3>
          <button onClick={resetToDefault} className="text-xs text-red-500 hover:underline cursor-pointer">
            Reset Defaults
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Store Name</label>
            <input type="text" className={inputClass} value={data.metadata.storeName} onChange={(e) => updateMetadata('storeName', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Date</label>
              <input type="text" className={inputClass} value={data.metadata.date} onChange={(e) => updateMetadata('date', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input type="text" className={inputClass} value={data.metadata.time} onChange={(e) => updateMetadata('time', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Receipt #</label>
              <input type="text" className={inputClass} value={data.metadata.receiptNumber} onChange={(e) => updateMetadata('receiptNumber', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Cashier</label>
              <input type="text" className={inputClass} value={data.metadata.cashier} onChange={(e) => updateMetadata('cashier', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-zinc-800 mb-3">Line Items</h3>
        <div className="space-y-3 mb-3">
          {data.items.map((item) => (
            <div key={item.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 relative group">
              <button
                onClick={() => removeLineItem(item.id)}
                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                ✕
              </button>
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-8">
                  <input type="text" placeholder="Item" className={inputClass} value={item.name} onChange={(e) => updateLineItem(item.id, 'name', e.target.value)} />
                </div>
                <div className="col-span-4">
                  <input type="text" placeholder="Cost" className={inputClass} value={item.cost} onChange={(e) => updateLineItem(item.id, 'cost', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Quantity" className={inputClass} value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)} />
                <input type="text" placeholder="Detail" className={inputClass} value={item.detail} onChange={(e) => updateLineItem(item.id, 'detail', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addLineItem}
          className="w-full py-2 border border-dashed border-zinc-300 rounded-xl text-xs font-semibold text-zinc-600 hover:border-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-zinc-800 mb-3">Summary & Footer</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Subtotal</label>
              <input type="text" className={inputClass} value={data.summary.subtotal} onChange={(e) => updateSummary('subtotal', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tax Label</label>
              <input type="text" className={inputClass} value={data.summary.taxLabel} onChange={(e) => updateSummary('taxLabel', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Total Title</label>
              <input type="text" className={inputClass} value={data.summary.totalHeadline} onChange={(e) => updateSummary('totalHeadline', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Total Value</label>
              <input type="text" className={inputClass} value={data.summary.totalValue} onChange={(e) => updateSummary('totalValue', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Footer Text</label>
            <input type="text" className={inputClass} value={data.footerMessage} onChange={(e) => updateGeneral('footerMessage', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Barcode Text</label>
            <input type="text" className={inputClass} value={data.barcodeText} onChange={(e) => updateGeneral('barcodeText', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
