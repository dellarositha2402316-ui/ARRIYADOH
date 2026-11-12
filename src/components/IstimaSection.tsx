import React, { useState } from 'react';
import {
  Headphones,
  Play,
  Square,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Gauge,
} from 'lucide-react';
import { ISTIMA_EXERCISES } from '../data/riyadhohData.ts';
import { playArabicAudio, stopArabicAudio } from '../utils/audio.ts';

export const IstimaSection: React.FC = () => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [showScript, setShowScript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentExercise = ISTIMA_EXERCISES[selectedExerciseIndex];

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopArabicAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playArabicAudio(currentExercise.arabicScript, playbackSpeed).finally(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    currentExercise.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: currentExercise.questions.length,
      percentage: Math.round((correct / currentExercise.questions.length) * 100),
    };
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-semibold mb-3 border border-blue-700/50">
          <Headphones className="w-3.5 h-3.5 text-blue-300" />
          Maharah 1: Al-Istima' (مَهَارَةُ الاسْتِمَاعِ)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Latihan Menyimak Bahasa Arab
        </h2>
        <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Dengarkan rekaman audio penutur bahasa Arab dengan cermat. Latih kepekaan telinga terhadap makhraj huruf, waqaf, dan makna kalimat seputar dunia olahraga.
        </p>

        {/* Exercise Selector */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          {ISTIMA_EXERCISES.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => {
                stopArabicAudio();
                setIsPlaying(false);
                setSelectedExerciseIndex(idx);
                handleResetQuiz();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedExerciseIndex === idx
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              {ex.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Player Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Materi Audio Menyimak
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              {currentExercise.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              {currentExercise.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    playbackSpeed === spd
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Hentikan Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Putar Audio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Visual Waveform Animation when playing */}
        {isPlaying && (
          <div className="my-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center gap-1.5">
            {[40, 75, 50, 90, 60, 80, 45, 95, 70, 85, 30, 65, 90, 40, 75, 60].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-blue-600 rounded-full animate-pulse"
                style={{
                  height: `${h * 0.4}px`,
                  animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                }}
              />
            ))}
            <span className="text-xs font-semibold text-blue-800 ml-3 font-arabic">
              يَجْرِي التَّشْغِيْلُ الْآنَ... (Sedang diputar)
            </span>
          </div>
        )}

        {/* Toggleable Transcript Section */}
        <div className="mt-6 pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">Teks Menyimak (Naskah Audio):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowScript(!showScript)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
              >
                {showScript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showScript ? 'Sembunyikan Naskah' : 'Lihat Teks Arab'}
              </button>
              {showScript && (
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                >
                  {showTranslation ? 'Sembunyikan Arti' : 'Lihat Terjemahan'}
                </button>
              )}
            </div>
          </div>

          {showScript ? (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="text-right" dir="rtl">
                <p className="font-arabic text-xl sm:text-2xl text-slate-900 leading-loose font-bold">
                  {currentExercise.arabicScript}
                </p>
              </div>
              {showTranslation && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Terjemahan:</p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{currentExercise.indonesianTranslation}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-slate-50/70 border border-dashed border-slate-300 rounded-2xl text-center">
              <p className="text-xs text-slate-500">
                💡 <em>Tips Belajar:</em> Cobalah menjawab kuis di bawah hanya dengan mendengarkan audio terlebih dahulu sebelum membuka naskah teks Arab!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comprehension Quiz */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Soal Pemahaman Menyimak (فَهْمُ الْمَسْمُوْعِ)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih jawaban yang paling tepat berdasarkan rekaman audio di atas.
            </p>
          </div>

          {submitted && (
            <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-800 font-bold text-sm border border-blue-200">
              Skor: {calculateScore().correct} / {calculateScore().total} ({calculateScore().percentage}%)
            </div>
          )}
        </div>

        <div className="space-y-6">
          {currentExercise.questions.map((q, qIndex) => {
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all bg-slate-50/40"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <div className="flex-1">
                    {q.arabicQuestion && (
                      <p className="font-arabic text-lg font-bold text-slate-900 text-right leading-relaxed mb-1" dir="rtl">
                        {q.arabicQuestion}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-slate-800">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300';
                    if (selectedOpt === optIdx) {
                      btnStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20';
                    }
                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                      } else if (selectedOpt === optIdx && !isCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="font-arabic text-base sm:text-lg leading-relaxed text-right w-full font-semibold" dir="rtl">
                          {opt}
                        </span>
                        {submitted && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {submitted && selectedOpt === optIdx && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/70 text-xs text-blue-900 border border-blue-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Penjelasan:</strong> {q.explanation}
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
            onClick={handleResetQuiz}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-2 rounded-xl"
          >
            Ulangi Kuis
          </button>
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
            >
              Periksa Jawaban
            </button>
          ) : (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Kuis selesai dievaluasi!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
