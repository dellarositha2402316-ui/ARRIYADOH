import React, { useState } from 'react';
import {
  Volume2,
  Search,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { MUFRADAT_LIST } from '../data/riyadhohData.ts';
import { MufradatItem } from '../types/arabic.ts';
import { playArabicAudio } from '../utils/audio.ts';

export const MufradatSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Kosakata (الْكُلّ)' },
    { id: 'sport_type', label: 'Jenis Olahraga (أَنْوَاعُ الرِّيَاضَةِ)' },
    { id: 'facility', label: 'Fasilitas & Laga (الْمَرَافِقُ)' },
    { id: 'verb', label: 'Kata Kerja (الْأَفْعَالُ)' },
    { id: 'expression', label: 'Ungkapan & Mahfuzhat (الْمَحْفُوْظَاتُ)' },
  ];

  const filteredItems = MUFRADAT_LIST.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.arabic.includes(searchTerm) ||
      item.indonesian.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.latin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayAudio = (text: string, id: string) => {
    setSpeakingId(id);
    playArabicAudio(text).finally(() => {
      setSpeakingId(null);
    });
  };

  const currentCard: MufradatItem | undefined = filteredItems[currentFlashcardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 pointer-events-none font-arabic text-9xl">
          الرياضة
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Buku Bahasa Arab Kelas 8 Bab 4 (الرِّيَاضَةُ)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mufradat (المُفْرَدَاتُ) Olahraga
          </h2>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Kuasai kosakata penting seputar jenis olahraga, fasilitas lapangan, kata kerja fi'il mudhari', dan kata mutiara hikmah. Dilengkapi audio pengucapan alami dan mode kartu hafalan (flashcard).
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setIsFlashcardMode(!isFlashcardMode)}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4 text-emerald-700" />
              {isFlashcardMode ? 'Beralih ke Tampilan Daftar' : 'Mode Kartu Hafalan (Flashcard)'}
            </button>
            <button
              onClick={() => handlePlayAudio('الْعَقْلُ السَّلِيْمُ فِي الْجِسْمِ السَّلِيْمِ', 'banner')}
              className="px-4 py-2 rounded-xl bg-emerald-700/70 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold border border-emerald-500/50 transition-all flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              Dengarkan Mahfuzhat Utama
            </button>
          </div>
        </div>
      </div>

      {/* Flashcard Mode */}
      {isFlashcardMode ? (
        <div className="max-w-xl mx-auto py-6">
          <div className="text-center mb-4 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Kartu {currentFlashcardIndex + 1} dari {filteredItems.length}</span>
            <span className="text-emerald-700 font-semibold">Klik kartu untuk membalik</span>
          </div>

          {currentCard && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[300px] sm:min-h-[340px] bg-white rounded-3xl p-8 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between items-center text-center relative overflow-hidden group"
            >
              <div className="w-full flex justify-between items-center text-xs text-slate-400">
                <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100">
                  {currentCard.category.replace('_', ' ')}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(currentCard.harakat, currentCard.id);
                  }}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="my-auto py-6">
                {!isFlipped ? (
                  <div>
                    <h3 className="font-arabic text-4xl sm:text-5xl font-bold text-slate-900 leading-relaxed tracking-wide">
                      {currentCard.harakat}
                    </h3>
                    <p className="text-sm font-semibold text-emerald-600 mt-3">
                      {currentCard.latin}
                    </p>
                    <p className="text-xs text-slate-400 mt-4">
                      (Klik untuk melihat arti bahasa Indonesia)
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
                      Artinya:
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
                      {currentCard.indonesian}
                    </h3>
                    {currentCard.exampleArabic && (
                      <div className="mt-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-right" dir="rtl">
                        <p className="font-arabic text-lg text-emerald-950 font-bold">
                          {currentCard.exampleArabic}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 font-sans text-left" dir="ltr">
                          "{currentCard.exampleIndonesian}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  {isFlipped ? '🔄 Klik untuk melihat teks Arab' : '🔄 Klik untuk melihat terjemahan'}
                </span>
              </div>
            </div>
          )}

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevCard}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 text-sm shadow-xs transition-all"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => {
                if (currentCard) handlePlayAudio(currentCard.harakat, currentCard.id);
              }}
              className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextCard}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 font-semibold text-sm shadow-xs transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      ) : (
        /* List Mode */
        <div>
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kosakata Arab, latin, atau Indonesia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium w-full sm:w-auto text-right">
                Menampilkan <strong className="text-emerald-700">{filteredItems.length}</strong> kosakata
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isPlaying = speakingId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {item.category === 'sport_type'
                          ? 'Olahraga'
                          : item.category === 'facility'
                          ? 'Fasilitas'
                          : item.category === 'verb'
                          ? 'Kata Kerja'
                          : 'Mahfuzhat'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item.harakat, item.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isPlaying
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700'
                        }`}
                        title="Dengarkan Pengucapan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right my-2" dir="rtl">
                      <h3 className="font-arabic text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {item.harakat}
                      </h3>
                    </div>

                    {/* Latin & Indonesian */}
                    <div className="mt-1">
                      <p className="text-xs font-medium text-emerald-600">{item.latin}</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{item.indonesian}</p>
                    </div>
                  </div>

                  {/* Example Sentence */}
                  {item.exampleArabic && (
                    <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/60 p-2.5 rounded-xl">
                      <p className="font-arabic text-sm text-slate-900 font-bold text-right leading-relaxed" dir="rtl">
                        {item.exampleArabic}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        "{item.exampleIndonesian}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold">Tidak ditemukan kosakata yang sesuai</p>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain atau ubah kategori pilihan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
