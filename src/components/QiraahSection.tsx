import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { QIRAAH_PASSAGE } from '../data/riyadhohData.ts';
import { playArabicAudio } from '../utils/audio.ts';

export const QiraahSection: React.FC = () => {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [shownVocabIndex, setShownVocabIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [playingParagraphId, setPlayingParagraphId] = useState<string | null>(null);

  const handlePlayParagraph = (arabicText: string, paraId: string) => {
    setPlayingParagraphId(paraId);
    playArabicAudio(arabicText).finally(() => {
      setPlayingParagraphId(null);
    });
  };

  const handleSelectAnswer = (qId: string, answer: string | boolean) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: answer,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    QIRAAH_PASSAGE.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: QIRAAH_PASSAGE.questions.length,
      percentage: Math.round((correct / QIRAAH_PASSAGE.questions.length) * 100),
    };
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 text-teal-200 text-xs font-semibold mb-3 border border-teal-700/50">
          <BookOpen className="w-3.5 h-3.5 text-teal-300" />
          Maharah 3: Al-Qira'ah (مَهَارَةُ الْقِرَاءَةِ)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Membaca & Memahami Teks Bahasa Arab
        </h2>
        <p className="mt-2 text-teal-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Bacalah teks qira'ah berharakat lengkap berikut dengan tartil dan pemahaman. Dilengkapi glosarium kosakata penting dan latihan pemahaman bacaan (فَهْمُ الْمَقْرُوْءِ).
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setShowAllTranslations(!showAllTranslations)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-semibold text-white border border-white/20 transition-all flex items-center gap-2"
          >
            {showAllTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAllTranslations ? 'Sembunyikan Semua Terjemahan' : 'Tampilkan Semua Terjemahan'}
          </button>
        </div>
      </div>

      {/* Reading Text Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="text-center pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
            النَّصُّ الْقِرَائِيُّ (Teks Bacaan)
          </span>
          <h3 className="font-arabic text-3xl sm:text-4xl font-bold text-slate-900 mt-3" dir="rtl">
            {QIRAAH_PASSAGE.titleArabic}
          </h3>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            "{QIRAAH_PASSAGE.title}"
          </p>
        </div>

        {/* Paragraphs */}
        <div className="space-y-6">
          {QIRAAH_PASSAGE.paragraphs.map((para, pIdx) => {
            const isPlaying = playingParagraphId === para.id;
            const isVocabOpen = shownVocabIndex === pIdx;

            return (
              <div
                key={para.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-teal-300 transition-all bg-slate-50/50 hover:bg-slate-50"
              >
                {/* Paragraph Toolbar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                  <span className="font-bold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                    Paragraf {pIdx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShownVocabIndex(isVocabOpen ? null : pIdx)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-white text-slate-600 font-medium flex items-center gap-1 transition-all"
                    >
                      <Info className="w-3.5 h-3.5 text-teal-600" />
                      <span>{isVocabOpen ? 'Tutup Kosakata' : 'Kosakata Sulit'}</span>
                    </button>
                    <button
                      onClick={() => handlePlayParagraph(para.arabic, para.id)}
                      className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                        isPlaying
                          ? 'bg-teal-600 text-white animate-pulse'
                          : 'bg-white hover:bg-teal-50 text-teal-700 border border-teal-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlaying ? 'Memutar...' : 'Dengarkan'}</span>
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="text-right my-3" dir="rtl">
                  <p className="font-arabic text-2xl sm:text-3xl text-slate-900 font-bold leading-loose tracking-wide">
                    {para.arabic}
                  </p>
                </div>

                {/* Vocabulary Tooltip Drawer */}
                {isVocabOpen && (
                  <div className="mt-3 p-3 bg-teal-50/90 rounded-xl border border-teal-200 text-xs">
                    <p className="font-bold text-teal-900 mb-2">Glosarium Kosakata Pilihan:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {para.vocabulary.map((vocab, vIdx) => (
                        <div
                          key={vIdx}
                          className="bg-white p-2 rounded-lg border border-teal-100 text-right cursor-pointer hover:border-teal-300 transition-colors"
                          onClick={() => playArabicAudio(vocab.word)}
                          title="Klik untuk mendengarkan lafal"
                        >
                          <p className="font-arabic text-base font-bold text-slate-900" dir="rtl">
                            {vocab.word}
                          </p>
                          <p className="text-[11px] text-slate-500 font-sans text-left mt-0.5" dir="ltr">
                            {vocab.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indonesian Translation */}
                {showAllTranslations && (
                  <div className="mt-4 pt-3 border-t border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed italic bg-white/70 p-3 rounded-xl border border-slate-100">
                    <strong className="text-teal-800 not-italic block mb-0.5">Arti Paragraf:</strong>
                    "{para.indonesian}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehension Quiz (Fahmul Maqru') */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              Latihan Pemahaman Bacaan (فَهْمُ الْمَقْرُوْءِ)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Jawab pertanyaan berikut berdasarkan pemahaman Anda terhadap teks di atas.
            </p>
          </div>

          {submitted && (
            <div className="px-4 py-2 rounded-xl bg-teal-50 text-teal-800 font-bold text-sm border border-teal-200">
              Skor: {calculateScore().correct} / {calculateScore().total} ({calculateScore().percentage}%)
            </div>
          )}
        </div>

        <div className="space-y-6">
          {QIRAAH_PASSAGE.questions.map((q, qIdx) => {
            const selectedVal = userAnswers[q.id];
            const isCorrect = selectedVal === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-teal-200 transition-all bg-slate-50/50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-arabic text-xl font-bold text-slate-900 text-right leading-relaxed mb-1" dir="rtl">
                      {q.questionArabic}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">
                      {q.questionIndonesian}
                    </p>
                  </div>
                </div>

                {/* Multiple Choice Options */}
                {q.type === 'choice' && q.options && (
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    {q.options.map((opt, optIdx) => {
                      let style = 'bg-white border-slate-200 text-slate-700 hover:bg-teal-50';
                      if (selectedVal === opt) {
                        style = 'bg-teal-50 border-teal-600 text-teal-900 font-bold ring-2 ring-teal-500/20';
                      }
                      if (submitted) {
                        if (opt === q.correctAnswer) {
                          style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                        } else if (selectedVal === opt && !isCorrect) {
                          style = 'bg-rose-50 border-rose-500 text-rose-900';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`p-3 rounded-xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                          dir="rtl"
                        >
                          <span className="font-arabic text-lg leading-relaxed font-semibold">
                            {opt}
                          </span>
                          {submitted && opt === q.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
                          )}
                          {submitted && selectedVal === opt && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mr-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* True / False Options */}
                {q.type === 'true_false' && (
                  <div className="flex gap-3 mt-3">
                    {[
                      { label: 'صَحِيْحٌ (Benar)', value: true },
                      { label: 'خَاطِئٌ (Salah)', value: false },
                    ].map((tf) => {
                      const isOptionSelected = selectedVal === tf.value;
                      let tfStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-teal-50';
                      if (isOptionSelected) {
                        tfStyle = 'bg-teal-50 border-teal-600 text-teal-900 font-bold ring-2 ring-teal-500/20';
                      }
                      if (submitted) {
                        if (tf.value === q.correctAnswer) {
                          tfStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                        } else if (isOptionSelected && !isCorrect) {
                          tfStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                        }
                      }

                      return (
                        <button
                          key={String(tf.value)}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, tf.value)}
                          className={`flex-1 py-3 px-4 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${tfStyle}`}
                        >
                          {tf.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {submitted && (
                  <div className="mt-3 p-3 rounded-xl bg-teal-50/70 text-xs text-teal-950 border border-teal-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Pembahasan:</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setUserAnswers({});
              setSubmitted(false);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-2 rounded-xl"
          >
            Ulangi Soal
          </button>
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
            >
              Periksa Jawaban
            </button>
          ) : (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Pemahaman Qira'ah telah dinilai!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
