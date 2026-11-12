import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SCRAMBLED_SENTENCES } from '../data/riyadhohData.ts';
import { VirtualArabicKeyboard } from './VirtualArabicKeyboard.tsx';
import { checkWriting, WritingCheckResult } from '../services/apiService.ts';
import { playArabicAudio } from '../utils/audio.ts';

export const KitabahSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'scramble' | 'composition'>('scramble');

  // Tartibul Kalimat state
  const [currentScrambleIdx, setCurrentScrambleIdx] = useState(0);
  const [currentSelectedWords, setCurrentSelectedWords] = useState<string[]>([]);
  const [scrambleStatus, setScrambleStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Insya' / Free Composition state
  const [essayText, setEssayText] = useState('');
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<WritingCheckResult | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const currentScramble = SCRAMBLED_SENTENCES[currentScrambleIdx];

  // Helper for Tartibul Kalimat
  const handleWordClick = (word: string) => {
    if (currentSelectedWords.includes(word)) {
      setCurrentSelectedWords(currentSelectedWords.filter((w) => w !== word));
    } else {
      setCurrentSelectedWords([...currentSelectedWords, word]);
    }
    setScrambleStatus('idle');
  };

  const handleCheckScramble = () => {
    const isCorrect =
      currentSelectedWords.length === currentScramble.correctOrder.length &&
      currentSelectedWords.every((w, i) => w === currentScramble.correctOrder[i]);

    if (isCorrect) {
      setScrambleStatus('correct');
      playArabicAudio(currentScramble.correctOrder.join(' '));
    } else {
      setScrambleStatus('wrong');
    }
  };

  const handleResetScramble = () => {
    setCurrentSelectedWords([]);
    setScrambleStatus('idle');
  };

  const handleNextScramble = () => {
    setCurrentSelectedWords([]);
    setScrambleStatus('idle');
    setCurrentScrambleIdx((prev) => (prev + 1) % SCRAMBLED_SENTENCES.length);
  };

  // Keyboard insertions
  const handleInsertChar = (char: string) => {
    setEssayText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setEssayText((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setEssayText((prev) => prev + ' ');
  };

  const handleClear = () => {
    setEssayText('');
  };

  // Check Writing with Gemini
  const handleCheckEssay = async () => {
    if (!essayText.trim()) {
      setCheckError('Silakan tulis setidaknya satu kalimat berbahasa Arab.');
      return;
    }

    setIsChecking(true);
    setCheckError(null);

    try {
      const result = await checkWriting(
        essayText,
        'Insya\' / Menulis Kalimat Olahraga',
        'الرياضة (Ar-Riyadhoh)'
      );
      setCheckResult(result);
    } catch (err: any) {
      setCheckError(err.message || 'Gagal memeriksa tulisan');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/60 text-amber-200 text-xs font-semibold mb-3 border border-amber-700/50">
          <PenTool className="w-3.5 h-3.5 text-amber-300" />
          Maharah 4: Al-Kitabah (مَهَارَةُ الْكِتَابَةِ)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Latihan Menulis Bahasa Arab & Imla'
        </h2>
        <p className="mt-2 text-amber-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Asah keterampilan menyusun kalimat sempurna (تَرْتِيْبُ الْكَلِمَاتِ) dan mengarang kalimat seputar olahraga (الإِنْشَاءُ). Dapatkan koreksi harakat dan tata bahasa langsung dari Ustadz AI!
        </p>

        {/* Sub-tabs */}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={() => setActiveSubTab('scramble')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'scramble'
                ? 'bg-amber-500 text-white shadow-md font-bold'
                : 'bg-white/10 text-amber-100 hover:bg-white/20'
            }`}
          >
            1. Susun Kalimat (تَرْتِيْبُ الْكَلِمَاتِ)
          </button>
          <button
            onClick={() => setActiveSubTab('composition')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'composition'
                ? 'bg-amber-500 text-white shadow-md font-bold'
                : 'bg-white/10 text-amber-100 hover:bg-white/20'
            }`}
          >
            2. Menulis / Insya' AI (الإِنْشَاءُ)
          </button>
        </div>
      </div>

      {/* Sub-activity 1: Scrambled Words */}
      {activeSubTab === 'scramble' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                Latihan {currentScrambleIdx + 1} dari {SCRAMBLED_SENTENCES.length}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                Susunlah kata-kata berikut agar menjadi kalimat yang benar:
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Arti yang diharapkan: <strong className="text-slate-800">"{currentScramble.indonesianTranslation}"</strong>
              </p>
            </div>

            <button
              onClick={handleNextScramble}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              Soal Selanjutnya <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User's Arranged Words Area */}
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Susunan Kalimat Anda (Klik kata untuk menghapusnya):
            </span>
            <div
              className={`min-h-[70px] p-4 rounded-2xl border-2 flex flex-wrap gap-2 items-center justify-end transition-all ${
                scrambleStatus === 'correct'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : scrambleStatus === 'wrong'
                  ? 'border-rose-400 bg-rose-50/50'
                  : 'border-dashed border-amber-300 bg-amber-50/30'
              }`}
              dir="rtl"
            >
              {currentSelectedWords.length === 0 ? (
                <span className="text-xs text-slate-400 font-sans w-full text-center" dir="ltr">
                  Klik kata-kata acak di bawah secara berurutan...
                </span>
              ) : (
                currentSelectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleWordClick(word)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-arabic text-xl font-bold shadow-xs hover:bg-amber-700 transition-all active:scale-95"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Scrambled Words */}
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Pilihan Kata Acak:
            </span>
            <div className="flex flex-wrap gap-2.5 justify-end" dir="rtl">
              {currentScramble.words.map((word, idx) => {
                const isUsed = currentSelectedWords.includes(word);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isUsed}
                    onClick={() => handleWordClick(word)}
                    className={`px-4 py-2 rounded-xl font-arabic text-xl font-bold border transition-all ${
                      isUsed
                        ? 'opacity-30 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-900 shadow-xs'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Tarkib Note */}
          {scrambleStatus === 'correct' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>مُمْتَازٌ! (Mumtaz! Jawaban Anda Benar!)</span>
              </div>
              <p className="font-arabic text-lg text-emerald-900 font-bold text-right" dir="rtl">
                {currentScramble.correctOrder.join(' ')}
              </p>
              <p className="text-xs text-slate-600">
                <strong>Catatan Kaidah (Tarkib):</strong> {currentScramble.tarkibNote}
              </p>
            </div>
          )}

          {scrambleStatus === 'wrong' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Susunan kata belum tepat. Perhatikan posisi fi'il, fa'il, dan huruf nashabnya!</span>
              </div>
              <button
                onClick={handleResetScramble}
                className="text-xs font-bold text-rose-700 underline shrink-0 ml-2"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleResetScramble}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Kosongkan Pilihan
            </button>

            <button
              onClick={handleCheckScramble}
              disabled={currentSelectedWords.length === 0}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
            >
              Periksa Susunan
            </button>
          </div>
        </div>
      )}

      {/* Sub-activity 2: AI Composition / Insya' */}
      {activeSubTab === 'composition' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                Insya' Muwajjah (الإِنْشَاءُ الْمُوَجَّهُ)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                Tulis Kalimat Bahasa Arab tentang Olahraga
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tuliskan minimal 1-2 kalimat Arab (gunakan pola: <strong>أُحِبُّ أَنْ أَلْعَبَ...</strong> atau <strong>أَذْهَبُ لِـ...</strong>). AI akan mengoreksi tata bahasa dan harakat Anda!
              </p>
            </div>

            {/* Toggle Virtual Keyboard */}
            <button
              type="button"
              onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Keyboard className="w-4 h-4 text-emerald-600" />
              <span>{showVirtualKeyboard ? 'Tutup Papan Ketik' : 'Buka Papan Ketik Arab'}</span>
            </button>
          </div>

          {/* Quick Sentence Template Prompts */}
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-1.5">
              💡 Contoh Kalimat yang Bisa Anda Coba atau Modifikasi (Klik untuk memasukkan):
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'أُحِبُّ أَنْ أَلْعَبَ كُرَةَ الْقَدَمِ فِي الْمَلْعَبِ',
                'تُرِيْدُ فَاطِمَةُ أَنْ تُمَارِسَ السِّبَاحَةَ',
                'ذَهَبَ حَسَنٌ إِلَى النَّادِي لِيَتَدَرَّبَ',
                'لَنْ يَفُوْزَ الْفَرِيْقُ الضَّعِيْفُ بِلَا جِدٍّ',
              ].map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEssayText(template)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-800 hover:bg-amber-100 font-arabic text-sm transition-all"
                  dir="rtl"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Writing Area */}
          <div>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="اُكْتُبْ هُنَا جُمَلًا عَنِ الرِّيَاضَةِ... (Ketik kalimat Anda di sini)"
              rows={4}
              className="w-full p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-arabic text-2xl text-right leading-loose"
              dir="rtl"
            />

            {checkError && (
              <div className="mt-2 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{checkError}</span>
              </div>
            )}
          </div>

          {/* Optional Virtual Keyboard */}
          {showVirtualKeyboard && (
            <div className="pt-2 animate-in fade-in">
              <VirtualArabicKeyboard
                onInsertChar={handleInsertChar}
                onBackspace={handleBackspace}
                onSpace={handleSpace}
                onClear={handleClear}
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCheckEssay}
              disabled={isChecking || !essayText.trim()}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              {isChecking ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Sedang Dikoreksi Ustadz AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Koreksi & Nilai dengan AI</span>
                </>
              )}
            </button>
          </div>

          {/* AI Check Evaluation Card */}
          {checkResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50 border border-amber-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Hasil Pemeriksaan Kitabah
                  </span>
                  <h4 className="text-base font-bold text-amber-950 mt-0.5">
                    Predikat: {checkResult.level}
                  </h4>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-amber-600 text-white font-extrabold text-sm shadow-xs">
                  Nilai: {checkResult.score} / 100
                </div>
              </div>

              {/* Corrected Text with Full Harakat */}
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Kalimat yang Telah Dikoreksi (Berharakat Lengkap):
                </span>
                <div className="p-4 rounded-xl bg-white border border-amber-200 text-right" dir="rtl">
                  <p className="font-arabic text-2xl font-bold text-emerald-900 leading-relaxed">
                    {checkResult.correctedText}
                  </p>
                  <p className="text-xs font-sans text-slate-600 text-left mt-2 italic" dir="ltr">
                    "{checkResult.translation}"
                  </p>
                </div>
              </div>

              {/* Strengths & Corrections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {checkResult.strengths && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                    <strong className="block mb-1">✨ Kelebihan Tulisan:</strong>
                    <p>{checkResult.strengths}</p>
                  </div>
                )}

                {checkResult.tarkibExplanation && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                    <strong className="block mb-1">📖 Catatan Tarkib:</strong>
                    <p>{checkResult.tarkibExplanation}</p>
                  </div>
                )}
              </div>

              {checkResult.correctionsList && checkResult.correctionsList.length > 0 && (
                <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <strong className="block mb-1">🔍 Poin Perbaikan:</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    {checkResult.correctionsList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {checkResult.encouragement && (
                <p className="text-xs text-amber-800 italic text-center font-medium">
                  "{checkResult.encouragement}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
