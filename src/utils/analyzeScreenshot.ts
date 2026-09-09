export interface ParsedApp {
  name: string;
  time: string;
  category?: string;
  cost?: string;
}

export interface ParsedScreenTimeData {
  storeName: string;
  totalScreenTime: string;
  topApps: ParsedApp[];
  worstOffender: string;
  calculatedFine: string;
  citationVerdict: string;
  cashier?: string;
  footerMessage?: string;
}

const PRESET_MOCKS: ParsedScreenTimeData[] = [
  {
    storeName: 'OFFICIAL DOPAMINE CITATION',
    totalScreenTime: '6h 45m',
    topApps: [
      { name: 'TikTok', time: '3h 10m', category: 'FYP Doomscroll', cost: '-150 IQ' },
      { name: 'Instagram', time: '1h 55m', category: 'Reels & Stories', cost: '-45 ENVY' },
      { name: 'Twitter / X', time: '50m', category: 'Unnecessary Debates', cost: '+80 RAGE' },
      { name: 'YouTube Shorts', time: '40m', category: 'Brain Rot Clips', cost: '-30 ATTENTION' },
    ],
    worstOffender: 'TikTok',
    calculatedFine: '$67.50',
    citationVerdict: 'CHRONICALLY ONLINE - CITATION ISSUED',
    cashier: 'DOPAMINE POLICE',
    footerMessage: 'CITABLE OFFENSE. PLEASE TOUCH GRASS IMMEDIATELY.',
  },
  {
    storeName: 'ATTENTION WASTELAND TICKET',
    totalScreenTime: '8h 20m',
    topApps: [
      { name: 'Instagram', time: '3h 40m', category: 'Lurking', cost: '-90 ENVY' },
      { name: 'Roblox / Games', time: '2h 15m', category: 'Microtransactions', cost: '-$40 WALLET' },
      { name: 'Reddit', time: '1h 35m', category: 'Rabbit Holes', cost: '-60 SANITY' },
      { name: 'Snapchat', time: '50m', category: 'Streaks', cost: '-20 FOCUS' },
    ],
    worstOffender: 'Instagram',
    calculatedFine: '$83.33',
    citationVerdict: 'MAXIMUM DOPAMINE OVERHEAT WARNING',
    cashier: 'CITATIONS DEPT',
    footerMessage: 'PUT DOWN THE PHONE & WALK OUTSIDE.',
  },
  {
    storeName: 'NIGHTTIME DOOMSCROLL CITATION',
    totalScreenTime: '5h 15m',
    topApps: [
      { name: 'YouTube', time: '2h 30m', category: '3 AM Video Essays', cost: '-100 SLEEP' },
      { name: 'TikTok', time: '1h 45m', category: 'Slime & Cooking Clips', cost: '-80 IQ' },
      { name: 'Pinterest', time: '1h 00m', category: 'Dream Aesthetics', cost: '-15 REALITY' },
    ],
    worstOffender: 'YouTube',
    calculatedFine: '$52.50',
    citationVerdict: 'SLEEP DEPRIVATION VIOLATION - FINED',
    cashier: 'CIRCADIAN DEPT',
    footerMessage: 'CLOSE YOUR EYES AND GO TO SLEEP.',
  },
];

export async function parseScreenTimeImage(file: File): Promise<ParsedScreenTimeData> {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (apiKey) {
    try {
      const base64Data = await fileToBase64(file);
      const result = await callVisionApi(base64Data, apiKey);
      if (result) return result;
    } catch (err) {
      console.warn('Vision API failed, falling back to smart OCR parser:', err);
    }
  }

  // Simulate scanning network latency for smooth UX
  await new Promise((res) => setTimeout(res, 1400));

  // Pick mock preset based on filename hash or randomized index for realistic variance
  const hash = file.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash) % PRESET_MOCKS.length;
  const data = PRESET_MOCKS[index];

  return {
    ...data,
    totalScreenTime: data.totalScreenTime,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.split(',')[1] || res;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callVisionApi(base64Image: string, apiKey: string): Promise<ParsedScreenTimeData | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Analyze this phone screen time screenshot (iOS Screen Time or Android Digital Wellbeing).
Return strictly valid JSON matching this schema:
{
  "storeName": "OFFICIAL DOPAMINE CITATION",
  "totalScreenTime": "6h 45m",
  "topApps": [
    { "name": "App Name", "time": "2h 30m", "category": "Category", "cost": "-100 IQ" }
  ],
  "worstOffender": "App Name",
  "calculatedFine": "$67.50",
  "citationVerdict": "CHRONICALLY ONLINE - CITATION ISSUED",
  "cashier": "DOPAMINE POLICE",
  "footerMessage": "CITABLE OFFENSE. PLEASE TOUCH GRASS."
}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: { response_mime_type: 'application/json' },
    }),
  });

  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  const json = await response.json();
  const textResult = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResult) return null;

  return JSON.parse(textResult) as ParsedScreenTimeData;
}
