import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Volume2,
  RotateCcw,
  Bot,
  User,
  BookOpen,
} from 'lucide-react';
import { sendChatMessage } from '../services/apiService.ts';
import { playArabicAudio } from '../utils/audio.ts';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface UstadzChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UstadzChatModal: React.FC<UstadzChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `أَهْلًا وَسَهْلًا يَا بُنَيَّ! 
Selamat datang di ruang konsultasi Bahasa Arab Kelas 8 Bab Ar-Riyadhoh (الرِّيَاضَةُ). 

Saya Ustadz Al-Lughawi, siap membantu antum dalam:
1. Memahami kaidah Tarkib (أَنْ / لَنْ / لِـ + Fi'il Mudhari' Manshub)
2. Tanya jawab kosakata (Mufradat) olahraga
3. Contoh dialog (Hiwar) & latihan berbicara
4. Koreksi kalimat dan pengucapan

Apa yang ingin antum tanyakan hari ini?`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const reply = await sendChatMessage(textToSend, history);

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `Afwan, terjadi kendala: ${err.message || 'Tidak dapat terhubung ke server'}.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayArabicFromMessage = (text: string) => {
    // Extract Arabic characters or read text
    playArabicAudio(text);
  };

  const presetQuestions = [
    'Apa perbedaan huruf أَنْ dan لِـ dalam kaidah Tarkib?',
    'Tolong beri contoh kalimat olahraga memakai kata لَنْ',
    'Bagaimana bahasa Arabnya: "Saya suka bermain sepak bola di lapangan"?',
    'Sebutkan 5 olahraga yang disunnahkan dalam Islam!',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[620px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base">Ustadz Al-Lughawi (Guru AI)</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs text-emerald-200">
                Tutor Interaktif Bahasa Arab Kelas 8 Bab Ar-Riyadhoh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Question Chips */}
        <div className="bg-slate-50 border-b border-slate-100 p-2.5 overflow-x-auto flex gap-1.5 no-scrollbar">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 rounded-lg shrink-0 transition-all font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/70'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {!isUser && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                      <span>{m.timestamp}</span>
                      <button
                        onClick={() => handlePlayArabicFromMessage(m.text)}
                        className="hover:text-emerald-700 flex items-center gap-1 font-semibold"
                        title="Dengarkan pengucapan Arab"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Dengarkan</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Ustadz sedang mengetik jawaban berharakat...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan materi atau kalimat bahasa Arab..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
