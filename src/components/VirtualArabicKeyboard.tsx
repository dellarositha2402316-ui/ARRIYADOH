import React from 'react';
import { Delete, Space } from 'lucide-react';

interface VirtualArabicKeyboardProps {
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
}

export const VirtualArabicKeyboard: React.FC<VirtualArabicKeyboardProps> = ({
  onInsertChar,
  onBackspace,
  onSpace,
  onClear,
}) => {
  // Letters arranged logically
  const lettersRow1 = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د', 'ذ'];
  const lettersRow2 = ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ظ'];
  const lettersRow3 = ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'إ', 'أ', 'آ'];

  // Harakat (Vowels) row: Fathah, Kasrah, Dhommah, Sukun, Shaddah, Tanwin
  const harakat = [
    { label: 'َ  (فَتْحَة)', char: '\u064E' },
    { label: 'ِ  (كَسْرَة)', char: '\u0650' },
    { label: 'ُ  (ضَمَّة)', char: '\u064F' },
    { label: 'ْ  (سُكُوْن)', char: '\u0652' },
    { label: 'ّ  (شَدَّة)', char: '\u0651' },
    { label: 'ً  (تَنْوِين فَتْح)', char: '\u064B' },
    { label: 'ٍ  (تَنْوِين كَسْر)', char: '\u064D' },
    { label: 'ٌ  (تَنْوِين ضَمّ)', char: '\u064C' },
    { label: 'ـ (تَطْوِيْل)', char: 'ـ' },
  ];

  return (
    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 max-w-3xl mx-auto select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          لوحة المفاتيح العربية (Papan Ketik Huruf & Harakat Arab)
        </span>
        <button
          onClick={onClear}
          className="text-xs hover:text-red-400 transition-colors px-2 py-0.5 rounded bg-slate-800"
        >
          Bersihkan Input
        </button>
      </div>

      {/* Harakat Row */}
      <div className="flex flex-wrap gap-1 mb-2 justify-center bg-slate-800/80 p-1.5 rounded-xl">
        {harakat.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsertChar(item.char)}
            title={item.label}
            className="px-2.5 py-1 text-sm bg-slate-700/80 hover:bg-emerald-600 rounded-lg font-arabic font-bold transition-all active:scale-95 text-emerald-200 hover:text-white"
          >
            {item.char} <span className="text-[10px] text-slate-300 ml-1 font-sans opacity-75">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Arabic Letters */}
      <div className="space-y-1.5" dir="rtl">
        {/* Row 1 */}
        <div className="flex justify-center gap-1">
          {lettersRow1.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="w-8 h-9 sm:w-10 sm:h-10 bg-slate-800 hover:bg-emerald-600 active:scale-95 rounded-lg text-lg sm:text-xl font-arabic transition-all flex items-center justify-center font-bold"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex justify-center gap-1">
          {lettersRow2.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="w-8 h-9 sm:w-10 sm:h-10 bg-slate-800 hover:bg-emerald-600 active:scale-95 rounded-lg text-lg sm:text-xl font-arabic transition-all flex items-center justify-center font-bold"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex justify-center gap-1">
          {lettersRow3.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="w-8 h-9 sm:w-10 sm:h-10 bg-slate-800 hover:bg-emerald-600 active:scale-95 rounded-lg text-lg sm:text-xl font-arabic transition-all flex items-center justify-center font-bold"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-1.5 pt-1" dir="ltr">
          <button
            type="button"
            onClick={onSpace}
            className="flex-1 max-w-[280px] h-9 sm:h-10 bg-slate-800 hover:bg-emerald-700 active:scale-95 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 text-slate-200"
          >
            <Space className="w-4 h-4" /> Spasi (مسافة)
          </button>
          <button
            type="button"
            onClick={onBackspace}
            className="w-20 h-9 sm:h-10 bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white active:scale-95 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
          >
            <Delete className="w-4 h-4" /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
