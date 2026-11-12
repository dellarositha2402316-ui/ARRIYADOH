import React from 'react';
import { BookOpen, Sparkles, Volume2, Award } from 'lucide-react';
import { playArabicAudio } from '../utils/audio.ts';

interface HeaderProps {
  onOpenUstadzChat: () => void;
  onOpenExam: () => void;
  apiStatus: { status: string; hasApiKey: boolean };
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUstadzChat,
  onOpenExam,
  apiStatus,
}) => {
  const handleTestAudio = () => {
    playArabicAudio('أَهْلًا وَسَهْلًا بِكُمْ فِي مَادَّةِ اللُّغَةِ الْعَرَبِيَّةِ: الرِّيَاضَةُ!');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 transform hover:scale-105 transition-transform">
              <span className="font-arabic text-2xl font-bold">رياضة</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  AR-RIYADOH <span className="font-arabic text-emerald-700 text-xl font-normal">(الرِّيَاضَةُ)</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Kemenag RI Kelas 8
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                4 Maharah (Istima', Kalam, Qira'ah, Kitabah) & Kaidah Tarkib (أنْ - لَنْ - لِـ)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pronunciation audio preview */}
            <button
              onClick={handleTestAudio}
              title="Dengarkan Salam Pembuka Bahasa Arab"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden lg:inline">Tes Audio</span>
            </button>

            {/* Assessment Button */}
            <button
              onClick={onOpenExam}
              className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Ujian Bab</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenUstadzChat}
              className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Tanya Ustadz AI</span>
              {apiStatus.hasApiKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
