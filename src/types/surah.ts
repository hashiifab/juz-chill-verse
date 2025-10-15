export interface Surah {
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  verses: number;
  revelation: "Makkah" | "Madinah";
}

export interface Verse {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}
