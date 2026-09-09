import { useState, useEffect, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { parseScreenTimeImage, type ParsedScreenTimeData } from '../../utils/analyzeScreenshot';

interface Props {
  onParsed: (data: ParsedScreenTimeData) => void;
}

export function ScreenshotUploader({ onParsed }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    'Scanning screenshot text with OCR...',
    'Extracting apps & screen time hours...',
    'Calculating dopamine fine & citation...',
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsAnalyzing(true);
      setScanStatus(null);

      try {
        const parsedData = await parseScreenTimeImage(file);
        onParsed(parsedData);
        setScanStatus(`Extracted ${parsedData.totalScreenTime} total screen time`);
      } catch (err) {
        console.error('Scan failed:', err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [onParsed]
  );

  // Clipboard Paste Support (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    setImagePreview(null);
    setScanStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
          ⚡ Auto-Scan Screenshot (iOS / Android)
        </span>
        <span className="text-[10px] text-zinc-400 font-medium">Drop or Press Ctrl+V</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {imagePreview ? (
        <div className="relative rounded-xl border border-zinc-200 p-3 bg-zinc-50 flex items-center gap-3">
          <img src={imagePreview} alt="Screenshot preview" className="w-12 h-16 object-cover rounded-lg shadow-xs" />
          <div className="flex-1 min-w-0">
            {isAnalyzing ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-zinc-800">{loadingMessages[loadingStep]}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 animate-pulse w-3/4 rounded-full" />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-emerald-700">✓ Screenshot Analyzed</p>
                <p className="text-[11px] text-zinc-600 font-medium">
                  {scanStatus || 'Citation inputs populated!'}
                </p>
              </div>
            )}
          </div>
          {!isAnalyzing && (
            <button
              onClick={handleRemove}
              className="text-xs text-zinc-400 hover:text-zinc-700 px-2 py-1 rounded-md hover:bg-zinc-200 cursor-pointer"
            >
              Change
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-zinc-800 bg-zinc-100 scale-[0.99]'
              : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50'
          }`}
        >
          <div className="flex flex-col items-center gap-1.5">
            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-semibold text-zinc-700">
              Upload or Paste Screen Time Screenshot
            </p>
            <p className="text-[11px] text-zinc-400">
              Drag & drop, click to browse, or press <kbd className="px-1 py-0.5 bg-zinc-200 rounded text-[10px] text-zinc-700 font-mono">Ctrl+V</kbd>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
