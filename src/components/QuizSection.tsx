import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  Star,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EXAM_QUESTIONS } from '../data/riyadhohData.ts';

export const QuizSection: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentName, setStudentName] = useState('Ahmad Fauzan');
  const [schoolName, setSchoolName] = useState('MTs Negeri 1');
  const [showCertificate, setShowCertificate] = useState(false);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const total = EXAM_QUESTIONS.length;
    const score = Math.round((correct / total) * 100);
    let grade = 'Maqbul (Cukup)';
    if (score >= 90) grade = 'Mumtaz (Istimewa / Sangat Baik Sekali)';
    else if (score >= 80) grade = 'Jayyid Jiddan (Sangat Baik)';
    else if (score >= 70) grade = 'Jayyid (Baik)';

    return { correct, total, score, grade };
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    const { score } = calculateScore();
    if (score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetExam = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowCertificate(false);
  };

  const scoreData = calculateScore();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-800/60 text-rose-200 text-xs font-semibold mb-3 border border-rose-700/50">
          <Award className="w-3.5 h-3.5 text-rose-300" />
          Penilaian Harian Bab: Ar-Riyadhoh (الاِخْتِبَارُ الشَّامِلُ)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ujian Komprehensif 4 Maharah & Tarkib
        </h2>
        <p className="mt-2 text-rose-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Uji seluruh penguasaan materi dari Buku Bahasa Arab Kelas 8 Kemenag: Istima', Kalam, Qira'ah, Kitabah, serta Kaidah Tarkib (أنْ - لَنْ - لِـ). Dapatkan Sertifikat Prestasi Belajar Digital!
        </p>

        {isSubmitted && (
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-rose-950 hover:bg-rose-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-rose-600" />
              Lihat Sertifikat Nilai Prestasi
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Daftar Soal Penilaian Harian (10 Butir Soal)
            </h3>
            <p className="text-xs text-slate-500">
              Pilih satu jawaban yang paling tepat untuk masing-masing soal.
            </p>
          </div>

          {isSubmitted && (
            <div className="px-5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 block">Nilai Ujian</span>
                <strong className="text-xl font-black text-rose-700">
                  {scoreData.score} / 100
                </strong>
              </div>
              <div className="text-right border-l border-rose-200 pl-3 text-xs font-semibold">
                <span>{scoreData.correct} Benar</span>
                <span className="block text-slate-500">{scoreData.grade.split(' ')[0]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {EXAM_QUESTIONS.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-rose-200 transition-all bg-slate-50/40"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      {q.maharah}
                    </span>
                  </div>
                </div>

                {q.questionArabic && (
                  <p className="font-arabic text-xl font-bold text-slate-900 text-right leading-relaxed mb-2" dir="rtl">
                    {q.questionArabic}
                  </p>
                )}

                <p className="text-sm font-semibold text-slate-800 mb-3">
                  {q.questionIndo}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let style = 'bg-white border-slate-200 text-slate-700 hover:bg-rose-50';
                    if (selectedOpt === optIdx) {
                      style = 'bg-rose-50 border-rose-600 text-rose-900 font-bold ring-2 ring-rose-500/20';
                    }
                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                      } else if (selectedOpt === optIdx && !isCorrect) {
                        style = 'bg-rose-50 border-rose-500 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                      >
                        <span className="font-arabic text-base sm:text-lg leading-relaxed font-semibold">
                          {opt}
                        </span>
                        {isSubmitted && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {isSubmitted && selectedOpt === optIdx && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-100 text-xs text-slate-800 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Penjelasan:</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={handleResetExam}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-2 rounded-xl"
          >
            Ulangi Ujian
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitExam}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Kirim & Nilai Ujian</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Buka Sertifikat Hasil Belajar</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Digital Certificate */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative my-8">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2"
            >
              ✕
            </button>

            {/* Certificate Form customization */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Sesuaikan Identitas Sertifikat:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block">Nama Siswa:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Nama Madrasah / Sekolah:</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Printable Certificate Frame */}
            <div className="border-4 border-double border-amber-400 p-6 sm:p-8 rounded-2xl bg-amber-50/20 text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 opacity-10 font-arabic text-8xl pointer-events-none">
                شهادة
              </div>

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-700 mb-2 shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <p className="font-arabic text-2xl font-bold text-emerald-800" dir="rtl">
                شَهَادَةُ إِتْمَامِ دِرَاسَةِ اللُّغَةِ الْعَرَبِيَّةِ
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                SERTIFIKAT PRESTASI BELAJAR
              </h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                Buku Bahasa Arab Kelas 8 Kemenag RI • Bab Ar-Riyadhoh (الرِّيَاضَةُ)
              </p>

              <div className="my-6">
                <p className="text-xs text-slate-500">Diberikan dengan penuh apresiasi kepada:</p>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8 mt-1">
                  {studentName || 'Siswa MTs'}
                </h4>
                <p className="text-xs font-semibold text-emerald-800 mt-2">
                  {schoolName || 'Madrasah Tsanawiyah'}
                </p>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Telah menyelesaikan seluruh rangkaian evaluasi 4 Maharah (Istima', Kalam, Qira'ah, Kitabah) dan Qawa'id Tarkib (أنْ - لَنْ - لِـ) dengan hasil prestasi:
              </p>

              <div className="inline-block my-4 px-6 py-2.5 rounded-2xl bg-emerald-700 text-white shadow-md">
                <span className="text-xs uppercase font-medium tracking-wider block opacity-90">
                  Nilai Akhir
                </span>
                <span className="text-3xl font-black">{scoreData.score} / 100</span>
                <span className="text-xs block font-arabic font-semibold mt-0.5">
                  ({scoreData.grade})
                </span>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-amber-200/80 text-xs text-slate-500">
                <div className="text-left">
                  <p>Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                  <p className="text-[10px] text-slate-400">Verifikasi Sistem: Valid MTs Kelas 8</p>
                </div>
                <div className="text-right">
                  <p className="font-arabic font-bold text-sm text-slate-800">أُسْتَاذُ الْمَادَّةِ</p>
                  <p className="font-semibold text-slate-700">Tutor Ustadz AI</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak / Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
