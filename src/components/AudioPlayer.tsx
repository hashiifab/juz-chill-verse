import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

interface AyahAudio {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio: string;
  audioSecondary: string[];
}

interface AudioPlayerContextType {
  currentPlayingAyah: { ayah: AyahAudio; surahNumber: number } | null;
  isPlaying: boolean;
  playAyah: (ayah: AyahAudio, surahNumber: number) => void;
  playPause: () => void;
  playNextAyah: () => void;
  playPreviousAyah: () => void;
  setAyahs: (ayahs: AyahAudio[]) => void;
  setSurahNumber: (surahNumber: number) => void;
  ayahs: AyahAudio[];
  surahNumber: number | null;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<{ ayah: AyahAudio; surahNumber: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [ayahs, setAyahsState] = useState<AyahAudio[]>([]);
  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setAyahs = useCallback((newAyahs: AyahAudio[]) => {
    console.log("Setting ayahs:", newAyahs);
    setAyahsState(newAyahs);
  }, []);

  useEffect(() => {
    console.log("Ayahs state updated:", ayahs);
  }, [ayahs]);

  const playPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        console.log("Pausing audio");
        audioRef.current.pause();
      } else {
        console.log("Playing audio");
        audioRef.current.play().catch(e => console.error("Error playing audio on playPause:", e));
      }
    }
  }, [isPlaying]);

  const playNextAyah = useCallback(() => {
    console.log("Attempting to play next ayah");
    if (currentPlayingAyah && ayahs.length > 0) {
      const currentIndex = ayahs.findIndex(
        (a) => a.numberInSurah === currentPlayingAyah.ayah.numberInSurah
      );
      console.log("Current index:", currentIndex, "Ayahs length:", ayahs.length);
      if (currentIndex !== -1 && currentIndex < ayahs.length - 1) {
        const nextAyah = ayahs[currentIndex + 1];
        console.log("Next ayah:", nextAyah.numberInSurah);
        setCurrentPlayingAyah({ ayah: nextAyah, surahNumber: currentPlayingAyah.surahNumber });
      } else {
        console.log("End of surah or no next ayah");
        // End of surah, stop playing
        playPause();
        setCurrentPlayingAyah(null);
      }
    } else {
      console.log("Cannot play next ayah: currentPlayingAyah or ayahs is empty.");
    }
  }, [currentPlayingAyah, ayahs, playPause]);

  const playPreviousAyah = useCallback(() => {
    if (currentPlayingAyah && ayahs.length > 0) {
      const currentIndex = ayahs.findIndex(
        (a) => a.numberInSurah === currentPlayingAyah.ayah.numberInSurah
      );
      if (currentIndex > 0) {
        const previousAyah = ayahs[currentIndex - 1];
        setCurrentPlayingAyah({ ayah: previousAyah, surahNumber: currentPlayingAyah.surahNumber });
      } else {
        // Beginning of surah, stop playing or replay first ayah
        playPause();
        setCurrentPlayingAyah(null);
      }
    }
  }, [currentPlayingAyah, ayahs, playPause]);

  // Initialize audioRef.current once and set static event listeners
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onerror = (e) => {
      console.error("Audio error:", e);
    };
    audioRef.current.onplay = () => setIsPlaying(true);
    audioRef.current.onpause = () => setIsPlaying(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update onended handler whenever playNextAyah changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        console.log("Audio ended, calling playNextAyah");
        playNextAyah();
      };
    }
  }, [playNextAyah]);

  useEffect(() => {
    if (currentPlayingAyah) {
      console.log("Setting audio source to:", currentPlayingAyah.ayah.audio);
      audioRef.current!.src = currentPlayingAyah.ayah.audio;
      audioRef.current!.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [currentPlayingAyah]);

  const playAyah = useCallback((ayah: AyahAudio, sNumber: number) => {
    if (surahNumber !== sNumber) {
      setSurahNumber(sNumber);
    }
    console.log("Playing ayah:", ayah.numberInSurah, "from surah:", sNumber);
    setCurrentPlayingAyah({ ayah, surahNumber: sNumber });
  }, [surahNumber]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentPlayingAyah,
        isPlaying,
        playAyah,
        playPause,
        playNextAyah,
        playPreviousAyah,
        setAyahs,
        setSurahNumber,
        ayahs,
        surahNumber,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};