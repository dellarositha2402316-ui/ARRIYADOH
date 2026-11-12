export interface SpeechEvaluationResult {
  score: number;
  accuracy: string;
  feedback: string;
  pronunciationTips?: string;
  correctArabic?: string;
}

export interface WritingCheckResult {
  score: number;
  level: string;
  correctedText: string;
  translation: string;
  strengths: string;
  correctionsList: string[];
  tarkibExplanation: string;
  encouragement: string;
}

export interface TarkibAnalysisResult {
  sentenceWithHarakat: string;
  translation: string;
  breakdown: {
    word: string;
    role: string;
    explanation: string;
  }[];
  ruleSummary: string;
}

export async function checkApiHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'error', hasApiKey: false };
    return await res.json();
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function sendChatMessage(
  message: string,
  history: { sender: 'user' | 'bot'; text: string }[]
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  const data = await res.json();
  if (!res.ok) {
    if (data.fallback) return data.fallback;
    throw new Error(data.error || 'Gagal menghubungi Ustadz AI');
  }
  return data.reply;
}

export async function evaluateSpeech(
  targetArabic: string,
  studentSpokenText: string,
  context?: string
): Promise<SpeechEvaluationResult> {
  const res = await fetch('/api/evaluate-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetArabic, studentSpokenText, context }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal mengevaluasi pengucapan');
  }
  return data;
}

export async function checkWriting(
  studentText: string,
  promptType?: string,
  targetTopic?: string
): Promise<WritingCheckResult> {
  const res = await fetch('/api/check-writing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentText, promptType, targetTopic }),
  });

  const data = await res.json();
  if (!res.ok) {
    if (data.fallback) return data.fallback;
    throw new Error(data.error || 'Gagal memeriksa tulisan');
  }
  return data;
}

export async function explainTarkib(sentence: string): Promise<TarkibAnalysisResult> {
  const res = await fetch('/api/explain-tarkib', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal menganalisis kaidah tarkib');
  }
  return data;
}
