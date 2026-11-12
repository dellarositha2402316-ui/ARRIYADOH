import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  HelpCircle,
} from 'lucide-react';
import { KALAM_DIALOGS } from '../data/riyadhohData.ts';
import { playArabicAudio } from '../utils/audio.ts';
import { evaluateSpeech, SpeechEvaluationResult } from '../services/apiService.ts';

export const KalamSection: React.FC = () => {
  const [selectedDialogIndex, setSelectedDialogIndex] = useState(0);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'all' | 'speaker1' | 'speaker2'>('all');

  // Speaking Practice State
  const [practiceLine, setPracticeLine] = useState<string>(KALAM_DIALOGS[0].lines[0].arabic);
  const [spokenInput, setSpokenInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const currentDialog = KALAM_DIALOGS[selectedDialogIndex];

  const handlePlayLine = (text: string, lineId: string) => {
    setActiveLineId(lineId);
    playArabicAudio(text).finally(() => {
      setActiveLineId(null);
    });
  };

  const handleSelectLineForPractice = (arabicText: string) => {
    setPracticeLine(arabicText);
    setSpokenInput('');
    setEvalResult(null);
    setEvalError(null);
  };

  // Web Speech Recognition for Kalam practice
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (
      typeof window === 'undefined' ||
      (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))
    ) {
      setEvalError('Fitur rekam suara otomatis tidak didukung oleh browser ini. Silakan ketik lafal ucapan Anda pada kotak di bawah.');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.lang = 'ar-SA';
      recognizer.continuous = false;
      recognizer.interimResults = false;

      setIsRecording(true);
      setEvalError(null);

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenInput(transcript);
        setIsRecording(false);
      };

      recognizer.onerror = (e: any) => {
        setIsRecording(false);
        console.warn('Speech recognition error:', e);
        setEvalError('Gagal mendeteksi audio mikrofon (' + e.error + '). Silakan ketik atau gunakan tombol mikrofon kembali.');
      };

      recognizer.onend = () => {
        setIsRecording(false);
      };

      recognizer.start();
    } catch (err: any) {
      setIsRecording(false);
      setEvalError('Tidak dapat mengakses mikrofon: ' + err.message);
    }
  };

  const handleEvaluateSpeaking = async () => {
    if (!spokenInput.trim()) {
      setEvalError('Silakan ucapkan kalimat melalui mic atau ketik lafal terlebih dahulu');
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const result = await evaluateSpeech(
        practiceLine,
        spokenInput,
        currentDialog.title
      );
      setEvalResult(result);
    } catch (err: any) {
      setEvalError(err.message || 'Gagal mengevaluasi ucapan');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-700/50">
          <Mic className="w-3.5 h-3.5 text-indigo-300" />
          Maharah 2: Al-Kalam (مَهَارَةُ الْكَلَامِ)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Praktik Berbicara & Percakapan (الْحِوَارُ)
        </h2>
        <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Praktikkan dialog interaktif seputar olahraga dengan intonasi fasih. Gunakan AI Kalam Evaluator untuk menguji makhraj dan kefasihan pelafalan bahasa Arab Anda!
        </p>

        {/* Dialog Switcher */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          {KALAM_DIALOGS.map((dlg, idx) => (
            <button
              key={dlg.id}
              onClick={() => {
                setSelectedDialogIndex(idx);
                setPracticeLine(dlg.lines[0].arabic);
                setEvalResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedDialogIndex === idx
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white/10 text-indigo-100 hover:bg-white/20'
              }`}
            >
              {dlg.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dialogue Stream (Left) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Teks Percakapan (الْحِوَارُ)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {currentDialog.title}
              </h3>
              <p className="text-xs text-slate-500">{currentDialog.situation}</p>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
              <button
                onClick={() => setUserRole('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === 'all' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setUserRole('speaker1')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === 'speaker1' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {currentDialog.speaker1.split(' ')[0]}
              </button>
              <button
                onClick={() => setUserRole('speaker2')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === 'speaker2' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {currentDialog.speaker2.split(' ')[0]}
              </button>
            </div>
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-4">
            {currentDialog.lines.map((line) => {
              const isSpeaker1 = line.role === 'speaker1';
              const isDimmed = userRole !== 'all' && userRole !== line.role;
              const isPlaying = activeLineId === line.id;
              const isSelected = practiceLine === line.arabic;

              return (
                <div
                  key={line.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSpeaker1
                      ? 'bg-indigo-50/40 border-indigo-100 ml-0 mr-4 sm:mr-8'
                      : 'bg-emerald-50/40 border-emerald-100 ml-4 sm:ml-8 mr-0'
                  } ${isDimmed ? 'opacity-40' : 'opacity-100'} ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{line.avatar}</span>
                      <span className="text-xs font-bold text-slate-800">
                        {line.speaker}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayLine(line.arabic, line.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          isPlaying
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-white text-slate-600 hover:text-indigo-600 border border-slate-200'
                        }`}
                        title="Dengarkan Suara"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSelectLineForPractice(line.arabic)}
                        className={`text-[11px] px-2 py-1 rounded-lg font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                        }`}
                      >
                        Latih Kalimat Ini
                      </button>
                    </div>
                  </div>

                  {/* Arabic Line */}
                  <div className="text-right my-2" dir="rtl">
                    <p className="font-arabic text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                      {line.arabic}
                    </p>
                  </div>

                  {/* Translation & Latin */}
                  <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                    <p className="text-indigo-700 font-medium italic">{line.latin}</p>
                    <p className="text-slate-700">"{line.indonesian}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kalam Practice & AI Evaluator (Right) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Evaluator Pelafalan AI
              </h4>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Gemini AI
              </span>
            </div>

            {/* Target Sentence */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] uppercase font-bold text-slate-400">
                Kalimat Target yang Dilafalkan:
              </span>
              <p className="font-arabic text-xl sm:text-2xl font-bold text-slate-900 text-right mt-2 leading-relaxed" dir="rtl">
                {practiceLine}
              </p>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => playArabicAudio(practiceLine)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Dengarkan Contoh Pelafalan
                </button>
              </div>
            </div>

            {/* Spoken Text Input or Mic Result */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Suara / Teks Ucapan Anda:
              </label>
              <div className="relative">
                <textarea
                  value={spokenInput}
                  onChange={(e) => setSpokenInput(e.target.value)}
                  placeholder="Klik tombol mikrofon di bawah untuk berbicara bahasa Arab, atau ketik hasil pengucapan di sini..."
                  rows={3}
                  className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-arabic text-right leading-relaxed"
                  dir="rtl"
                />
              </div>

              {evalError && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{evalError}</span>
                </div>
              )}
            </div>

            {/* Mic & Evaluation Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Mendengarkan... (Klik Selesai)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-indigo-600" />
                    <span>Rekam Suara (Mic)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleEvaluateSpeaking}
                disabled={isEvaluating || !spokenInput.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isEvaluating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Menilai...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Evaluasi AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Evaluation Result Card */}
            {evalResult && (
              <div className="mt-4 p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                    Hasil Analisis Kalam
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-xs">
                    <span>Skor: {evalResult.score} / 100</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-2">
                  <p>
                    <strong>Tingkat Ketepatan:</strong>{' '}
                    <span className="text-indigo-900 font-semibold">{evalResult.accuracy}</span>
                  </p>
                  <p className="leading-relaxed text-slate-800 bg-white/70 p-2.5 rounded-xl border border-indigo-100">
                    {evalResult.feedback}
                  </p>
                  {evalResult.pronunciationTips && (
                    <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 text-xs">
                      <strong>💡 Tips Makhraj:</strong> {evalResult.pronunciationTips}
                    </div>
                  )}
                  {evalResult.correctArabic && (
                    <p className="text-right font-arabic text-lg font-bold text-emerald-800 mt-2" dir="rtl">
                      {evalResult.correctArabic}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              💡 Latih kalimat berulang-ulang sampai makhraj huruf 'Ain (ع), Qaf (ق), Ha (ح), dan Thad (ط) terdengar jelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
