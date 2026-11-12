import React, { useState } from 'react';
import {
  Binary,
  Sparkles,
  BookMarked,
  Table,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { TARKIB_RULES, CONJUGATION_TABLE } from '../data/riyadhohData.ts';
import { explainTarkib, TarkibAnalysisResult } from '../services/apiService.ts';
import { playArabicAudio } from '../utils/audio.ts';

export const TarkibSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'table' | 'analyzer'>('rules');

  // Analyzer state
  const [inputSentence, setInputSentence] = useState('أُحِبُّ أَنْ أَلْعَبَ كُرَةَ الْقَدَمِ');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TarkibAnalysisResult | null>(null);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);

  // Quick practice quiz for Tarkib
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleRunAnalyzer = async (sentenceToAnalyze?: string) => {
    const text = sentenceToAnalyze || inputSentence;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setAnalyzerError(null);

    try {
      const res = await explainTarkib(text);
      setAnalysisResult(res);
    } catch (err: any) {
      setAnalyzerError(err.message || 'Gagal menganalisis kaidah tarkib');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 text-purple-200 text-xs font-semibold mb-3 border border-purple-700/50">
          <Binary className="w-3.5 h-3.5 text-purple-300" />
          Qawa'id & Tarkib (الْقَوَاعِدُ وَالتَّرَاكِيْبُ)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Tata Bahasa Arab: Adawatun Nashbi (أَنْ - لَنْ - لِـ)
        </h2>
        <p className="mt-2 text-purple-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Kaidah utama Bab Ar-Riyadhoh Kelas 8: Huruf-huruf penashab fi'il mudhari' (<strong>أَنْ</strong>, <strong>لَنْ</strong>, dan <strong>لِـ</strong>) yang mengubah harakat akhir kata kerja dari Dhommah (Marfu') menjadi Fathah (Manshub).
        </p>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'rules'
                ? 'bg-purple-600 text-white shadow-md font-bold'
                : 'bg-white/10 text-purple-100 hover:bg-white/20'
            }`}
          >
            1. Kaidah & Rumus (الْقَوَاعِدُ)
          </button>
          <button
            onClick={() => setActiveSubTab('table')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'table'
                ? 'bg-purple-600 text-white shadow-md font-bold'
                : 'bg-white/10 text-purple-100 hover:bg-white/20'
            }`}
          >
            2. Tabel Tasrif Dhomir (التَّصْرِيْفُ)
          </button>
          <button
            onClick={() => setActiveSubTab('analyzer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'analyzer'
                ? 'bg-purple-600 text-white shadow-md font-bold'
                : 'bg-white/10 text-purple-100 hover:bg-white/20'
            }`}
          >
            3. Analisis I'rab AI (إِعْرَابُ الْجُمْلَةِ)
          </button>
        </div>
      </div>

      {/* 1. Rules & Formula */}
      {activeSubTab === 'rules' && (
        <div className="space-y-6">
          {/* Formula Summary Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-purple-600" />
              Rumus Kaidah: Fi'il Mudhari' Manshub (الْفِعْلُ الْمُضَارِعُ الْمَنْصُوْبُ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Fi'il Mudhari' asalnya berharakat <strong>Dhommah (مَرْفُوْعٌ بِالضَّمَّةِ)</strong>. Namun, jika didahului oleh salah satu dari 3 huruf nashab di bawah ini, maka harakat akhirnya berubah menjadi <strong>Fathah (مَنْصُوْبٌ بِالْفَتْحَةِ)</strong>:
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center">
              <span className="font-arabic text-2xl sm:text-3xl text-purple-950 font-bold tracking-wide" dir="rtl">
                [ أَنْ / لَنْ / لِـ ] + فِعْلٌ مُضَارِعٌ (مَنْصُوْبٌ بِالْفَتْحَةِ َ )
              </span>
            </div>
          </div>

          {/* Cards for each tool */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TARKIB_RULES.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-arabic text-2xl font-bold text-purple-700" dir="rtl">
                      {rule.tool}
                    </span>
                    <span className="text-xs font-semibold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {rule.meaning}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {rule.functionDesc}
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-right" dir="rtl">
                    <p className="font-arabic text-lg font-bold text-slate-900">
                      {rule.exampleArabic}
                    </p>
                    <p className="text-[11px] font-sans text-slate-500 text-left mt-1 italic" dir="ltr">
                      "{rule.exampleIndonesian}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-purple-900 bg-purple-50/50 p-2.5 rounded-xl">
                  <strong>I'rab:</strong> {rule.irabDetail}
                </div>
              </div>
            ))}
          </div>

          {/* Mini Interactive Practice */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              Uji Cepat Pemahaman Harakat:
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mb-4">
              Manakah harakat yang tepat untuk melengkapi kalimat berikut:
              <br />
              <span className="font-arabic text-xl font-bold text-purple-900 block my-2 text-right" dir="rtl">
                يُرِيْدُ حَسَنٌ أَنْ ... كُرَةَ السَّلَّةِ
              </span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'يَلْعَبَ (Fathah)', correct: true },
                { label: 'يَلْعَبُ (Dhommah)', correct: false },
                { label: 'يَلْعَبِ (Kasrah)', correct: false },
                { label: 'يَلْعَبْ (Sukun)', correct: false },
              ].map((opt, idx) => {
                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50';
                if (quizAnswer === idx) {
                  btnStyle = 'bg-purple-50 border-purple-600 text-purple-900 font-bold ring-2 ring-purple-500/20';
                }
                if (isQuizSubmitted) {
                  if (opt.correct) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                  } else if (quizAnswer === idx) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!isQuizSubmitted) {
                        setQuizAnswer(idx);
                        setIsQuizSubmitted(true);
                      }
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${btnStyle}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {isQuizSubmitted && (
              <div className="mt-4 p-3 rounded-xl bg-purple-50 text-xs text-purple-950 flex items-center justify-between">
                <span>
                  {quizAnswer === 0
                    ? '✅ Mumtaz! Benar sekali, karena didahului أَنْ, maka berharakat Fathah.'
                    : '❌ Kurang tepat. Setelah huruf أَنْ, harakat fi\'il mudhari\' menjadi Fathah (يَلْعَبَ).'}
                </span>
                <button
                  onClick={() => {
                    setQuizAnswer(null);
                    setIsQuizSubmitted(false);
                  }}
                  className="text-xs font-bold text-purple-700 underline ml-2"
                >
                  Ulangi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Conjugation Table */}
      {activeSubTab === 'table' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              Tabel Komparasi
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
              Tasrif Fi'il Mudhari' Marfu' vs Manshub Berdasarkan Dhomir
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perhatikan perubahan harakat dan hilangnya huruf nun (حَذْفُ النُّوْنِ) pada dhomir أَنْتِ dan هُمْ!
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse" dir="rtl">
              <thead>
                <tr className="bg-purple-900 text-white text-xs sm:text-sm font-semibold">
                  <th className="p-3 text-right rounded-tr-2xl">الضَّمِيْرُ (Dhomir)</th>
                  <th className="p-3 text-right">أَصْلُ الْفِعْلِ (Marfu')</th>
                  <th className="p-3 text-right">مَعَ (أَنْ)</th>
                  <th className="p-3 text-right">مَعَ (لَنْ)</th>
                  <th className="p-3 text-right">مَعَ (لِـ)</th>
                  <th className="p-3 text-left rounded-tl-2xl font-sans" dir="ltr">Tanda I'rab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {CONJUGATION_TABLE.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-purple-50/50 transition-colors group cursor-pointer"
                    onClick={() => playArabicAudio(`${row.marfu} , ${row.manshubWithAn}`)}
                    title="Klik untuk mendengarkan lafal"
                  >
                    <td className="p-3.5 font-bold text-slate-900">
                      <span className="font-arabic text-xl">{row.pronounArabic}</span>
                      <span className="font-sans text-[11px] text-slate-500 block font-normal" dir="ltr">
                        {row.pronounIndo} ({row.pronounLatin})
                      </span>
                    </td>
                    <td className="p-3.5 font-arabic text-xl text-slate-700 font-bold">
                      {row.marfu}
                    </td>
                    <td className="p-3.5 font-arabic text-xl text-purple-700 font-extrabold bg-purple-50/30">
                      {row.manshubWithAn}
                    </td>
                    <td className="p-3.5 font-arabic text-xl text-indigo-700 font-bold">
                      {row.manshubWithLan}
                    </td>
                    <td className="p-3.5 font-arabic text-xl text-emerald-700 font-bold">
                      {row.manshubWithLi}
                    </td>
                    <td className="p-3.5 text-left font-sans text-xs text-slate-600 font-medium" dir="ltr">
                      {row.sign}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
            <span>💡 <em>Keterangan:</em> Klik baris mana saja pada tabel di atas untuk mendengarkan pelafalannya.</span>
            <Volume2 className="w-4 h-4 text-purple-600" />
          </div>
        </div>
      )}

      {/* 3. AI Tarkib Analyzer */}
      {activeSubTab === 'analyzer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              Bedah Kaidah Interaktif
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
              Laboratorium I'rab & Analisis Tarkib AI
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan kalimat bahasa Arab apa saja seputar bab olahraga, atau pilih contoh di bawah untuk dibedah susunan tata bahasanya secara detail.
            </p>
          </div>

          {/* Quick preset sentences */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-500 self-center">Contoh Kalimat:</span>
            {[
              'أُحِبُّ أَنْ أَلْعَبَ كُرَةَ الْقَدَمِ',
              'ذَهَبَ التَّلَامِيْذُ إِلَى الْمَلْعَبِ لِيَتَدَرَّبُوا',
              'لَنْ يَفُوْزَ الْفَرِيْقُ الْكَسْلَانُ',
              'تُرِيْدُ عَائِشَةُ أَنْ تُمَارِسَ السِّبَاحَةَ',
            ].map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputSentence(s);
                  handleRunAnalyzer(s);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-800 font-arabic text-sm transition-all"
                dir="rtl"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input & Action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="اُكْتُبْ هُنَا جُمْلَةً عَرَبِيَّةً... (Ketik kalimat Arab)"
              className="flex-1 p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-arabic text-xl text-right"
              dir="rtl"
            />
            <button
              onClick={() => handleRunAnalyzer()}
              disabled={isAnalyzing || !inputSentence.trim()}
              className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Bedah I'rab</span>
                </>
              )}
            </button>
          </div>

          {analyzerError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
              {analyzerError}
            </div>
          )}

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-purple-200">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Hasil Bedah Tarkib & I'rab
                </span>
                <button
                  onClick={() => playArabicAudio(analysisResult.sentenceWithHarakat)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Dengarkan Lafal
                </button>
              </div>

              <div className="text-right" dir="rtl">
                <p className="font-arabic text-2xl font-bold text-purple-950 leading-relaxed">
                  {analysisResult.sentenceWithHarakat}
                </p>
                <p className="text-xs font-sans text-slate-600 text-left mt-1 italic" dir="ltr">
                  "{analysisResult.translation}"
                </p>
              </div>

              {/* Word breakdown cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {analysisResult.breakdown.map((item, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="font-arabic text-xl font-bold text-slate-900" dir="rtl">
                        {item.word}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {analysisResult.ruleSummary && (
                <div className="p-3.5 bg-white rounded-xl border border-purple-200 text-xs text-purple-950">
                  <strong className="block mb-1">📖 Rangkuman Kaidah:</strong>
                  <p>{analysisResult.ruleSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
