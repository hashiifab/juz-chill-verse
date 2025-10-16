import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
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
  autoplay: boolean;
  playAyahExternal: (ayah: AyahAudio, surahNumber: number, shouldAutoplay?: boolean) => void;
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

  const [autoplay, setAutoplay] = useState(true);

  const playAyah = useCallback(
    (ayah: AyahAudio, surahNum: number, shouldAutoplay: boolean = true) => {
      setCurrentPlayingAyah({ ayah, surahNumber: surahNum });
      setAutoplay(shouldAutoplay);
      // setIsPlaying(true); // This will be handled by the useEffect below
    },
    []
  );

  const playPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        console.log("Pausing audio");
        audioRef.current.pause();
        setIsPlaying(false); // Update playing state
      } else {
        console.log("Playing audio");
        audioRef.current.play().catch(e => console.error("Error playing audio on playPause:", e));
        setIsPlaying(true); // Update playing state
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
        playAyah(nextAyah, currentPlayingAyah.surahNumber, autoplay); // Pass autoplay state
      } else {
        console.log("End of surah or no next ayah");
        // End of surah, stop playing
        playPause();
        setCurrentPlayingAyah(null);
      }
    } else {
      console.log("Cannot play next ayah: currentPlayingAyah or ayahs is empty.");
    }
  }, [currentPlayingAyah, ayahs, playAyah, autoplay, playPause]);

  const playPreviousAyah = useCallback(() => {
    if (currentPlayingAyah && ayahs.length > 0) {
      const currentIndex = ayahs.findIndex(
        (a) => a.numberInSurah === currentPlayingAyah.ayah.numberInSurah
      );
      if (currentIndex > 0) {
        const previousAyah = ayahs[currentIndex - 1];
        playAyah(previousAyah, currentPlayingAyah.surahNumber, autoplay); // Pass autoplay state
      } else {
        // Beginning of surah, stop playing or replay first ayah
        playPause();
        setCurrentPlayingAyah(null);
      }
    }
  }, [currentPlayingAyah, ayahs, playAyah, autoplay, playPause]);

  // Update onended handler whenever playNextAyah or autoplay changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        console.log("Audio ended.");
        if (autoplay) {
          console.log("Autoplay is enabled, calling playNextAyah");
          playNextAyah();
        } else {
          console.log("Autoplay is disabled, stopping playback.");
          setIsPlaying(false);
          setCurrentPlayingAyah(null);
        }
      };
    }
  }, [playNextAyah, autoplay]);

  useEffect(() => {
    if (currentPlayingAyah && audioRef.current) {
      console.log("Setting audio source to:", currentPlayingAyah.ayah.audio);
      audioRef.current.src = currentPlayingAyah.ayah.audio;
      audioRef.current.load(); // Load the new source
      audioRef.current.play().catch(e => {
        if (e.name === 'AbortError') {
          console.warn("Audio playback aborted, likely due to new load request:", e);
        } else {
          console.error("Error playing audio:", e);
        }
      });
      setIsPlaying(true); // Ensure isPlaying is true when a new ayah starts playing
    } else if (!currentPlayingAyah && audioRef.current) {
      // If currentPlayingAyah becomes null, stop and reset
      audioRef.current.pause();
      audioRef.current.src = ""; // Clear source
      setIsPlaying(false);
    }
  }, [currentPlayingAyah]); // Only depend on currentPlayingAyah

  // This playAyah is for external components to use
  const playAyahExternal = useCallback((ayah: AyahAudio, sNumber: number, shouldAutoplay: boolean = true) => {
    if (surahNumber !== sNumber) {
      setSurahNumber(sNumber);
    }
    console.log("Playing ayah:", ayah.numberInSurah, "from surah:", sNumber, "with autoplay:", shouldAutoplay);
    setCurrentPlayingAyah({ ayah, surahNumber: sNumber });
    setAutoplay(shouldAutoplay);
  }, [surahNumber]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentPlayingAyah,
        isPlaying,
        playAyahExternal: playAyahExternal, // Expose the external playAyah
        playPause,
        playNextAyah,
        playPreviousAyah,
        setAyahs,
        setSurahNumber,
        ayahs,
        surahNumber,
        autoplay, // Expose autoplay state
      }}
    >
      <audio ref={audioRef} />
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