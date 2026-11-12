// Speech Synthesis and Speech Recognition helpers for Arabic learning

export function playArabicAudio(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis tidak didukung pada browser ini');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Remove harsh punctuation or symbols for cleaner speech synthesis
    const cleanedText = text.replace(/[\(\)\[\]\{\}]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'ar-SA';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopArabicAudio(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Check if Speech Recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

// Simple browser Speech Recognition wrapper for Arabic
export class ArabicSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor(
    private onResult: (transcript: string) => void,
    private onError: (error: string) => void,
    private onEnd: () => void
  ) {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'ar-SA';

        this.recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          this.onResult(transcript);
        };

        this.recognition.onerror = (event: any) => {
          this.onError(event.error);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.onEnd();
        };
      }
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.isListening = true;
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.isListening = false;
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }
  }
}
