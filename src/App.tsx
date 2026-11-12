import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { TabsNav } from './components/TabsNav.tsx';
import { MufradatSection } from './components/MufradatSection.tsx';
import { IstimaSection } from './components/IstimaSection.tsx';
import { KalamSection } from './components/KalamSection.tsx';
import { QiraahSection } from './components/QiraahSection.tsx';
import { KitabahSection } from './components/KitabahSection.tsx';
import { TarkibSection } from './components/TarkibSection.tsx';
import { QuizSection } from './components/QuizSection.tsx';
import { UstadzChatModal } from './components/UstadzChatModal.tsx';
import { MaharahType } from './types/arabic.ts';
import { checkApiHealth } from './services/apiService.ts';
import { Sparkles, BookOpen, ExternalLink, GraduationCap, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MaharahType>('mufradat');
  const [isUstadzOpen, setIsUstadzOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ status: string; hasApiKey: boolean }>({
    status: 'checking',
    hasApiKey: false,
  });

  useEffect(() => {
    checkApiHealth().then((status) => {
      setApiStatus(status);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenUstadzChat={() => setIsUstadzOpen(true)}
        onOpenExam={() => setActiveTab('ikhtibar')}
        apiStatus={apiStatus}
      />

      {/* Navigation Tabs for 4 Maharah & Tarkib */}
      <TabsNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'mufradat' && <MufradatSection />}
        {activeTab === 'istima' && <IstimaSection />}
        {activeTab === 'kalam' && <KalamSection />}
        {activeTab === 'qiraah' && <QiraahSection />}
        {activeTab === 'kitabah' && <KitabahSection />}
        {activeTab === 'tarkib' && <TarkibSection />}
        {activeTab === 'ikhtibar' && <QuizSection />}
      </main>

      {/* Floating AI Helper Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsUstadzOpen(true)}
          className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-2 group"
          title="Buka Tanya Ustadz AI"
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          </div>
          <span className="text-xs sm:text-sm">Tanya Ustadz AI</span>
          <span className="text-[10px] bg-emerald-800/60 px-1.5 py-0.5 rounded-md font-arabic font-bold">
            أستاذ
          </span>
        </button>
      </div>

      {/* Ustadz AI Assistant Modal */}
      <UstadzChatModal isOpen={isUstadzOpen} onClose={() => setIsUstadzOpen(false)} />

      {/* Footer with Curriculum Source */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-arabic font-bold text-lg">
              ض
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                AR-RIYADOH (الرِّيَاضَةُ) - BAHASA ARAB MTs KELAS 8
              </p>
              <p className="text-[11px] text-slate-500">
                Kementerian Agama Republik Indonesia (Kemenag RI) • 4 Maharah & Kaidah Tarkib
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://sikurma.kemenag.go.id/portal/Buku/view_book/cExQcUxIVHdoUkZNOWMyNDBqV0hldz09"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buku Digital SIKURMA Kemenag</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">•</span>
            <span>Vercel & Full-stack Express Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
