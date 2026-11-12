export type MaharahType = 'mufradat' | 'istima' | 'kalam' | 'qiraah' | 'kitabah' | 'tarkib' | 'ikhtibar' | 'ustadz';

export interface MufradatItem {
  id: string;
  arabic: string;
  harakat: string;
  latin: string;
  indonesian: string;
  category: 'sport_type' | 'facility' | 'verb' | 'expression';
  exampleArabic?: string;
  exampleIndonesian?: string;
  iconName?: string;
}

export interface IstimaExercise {
  id: string;
  title: string;
  description: string;
  arabicScript: string;
  indonesianTranslation: string;
  questions: {
    id: string;
    question: string;
    arabicQuestion?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface DialogLine {
  id: string;
  speaker: string;
  avatar: string;
  role: 'speaker1' | 'speaker2';
  arabic: string;
  latin: string;
  indonesian: string;
}

export interface KalamDialog {
  id: string;
  title: string;
  situation: string;
  speaker1: string;
  speaker2: string;
  lines: DialogLine[];
}

export interface QiraahPassage {
  id: string;
  title: string;
  titleArabic: string;
  paragraphs: {
    id: string;
    arabic: string;
    indonesian: string;
    vocabulary: { word: string; meaning: string }[];
  }[];
  questions: {
    id: string;
    type: 'choice' | 'true_false';
    questionArabic: string;
    questionIndonesian: string;
    options?: string[];
    correctAnswer: string | boolean;
    explanation: string;
  }[];
}

export interface ScrambledSentence {
  id: string;
  words: string[];
  correctOrder: string[];
  indonesianTranslation: string;
  tarkibNote: string;
}

export interface TarkibRule {
  id: string;
  tool: string; // e.g., أَنْ, لَنْ, لِـ
  meaning: string;
  functionDesc: string;
  exampleArabic: string;
  exampleIndonesian: string;
  irabDetail: string;
}

export interface ConjugationRow {
  pronounArabic: string;
  pronounLatin: string;
  pronounIndo: string;
  marfu: string;
  manshubWithAn: string;
  manshubWithLan: string;
  manshubWithLi: string;
  sign: string;
}

export interface ExamQuestion {
  id: string;
  maharah: 'Istima\'' | 'Kalam' | 'Qira\'ah' | 'Kitabah' | 'Tarkib';
  questionArabic?: string;
  questionIndo: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
