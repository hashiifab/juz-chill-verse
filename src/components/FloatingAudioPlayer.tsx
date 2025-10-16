import { useAudioPlayer } from "./AudioPlayer";
import { Button } from "./ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { juzAmmaSurahs } from "@/data/juzAmma";
import React, { useState, useEffect, useRef } from "react";

export const FloatingAudioPlayer = () => {
  const { currentPlayingAyah, isPlaying, playPause, playNextAyah, playPreviousAyah, ayahs, surahNumber, playAyahExternal, autoplay } = useAudioPlayer();
  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayPause = () => {
    if (!currentPlayingAyah && !isPlaying && ayahs.length > 0 && surahNumber) {
      playAyahExternal(ayahs[0], surahNumber, true); // Ensure autoplay is true for floating player
    } else if (currentPlayingAyah && !isPlaying) {
      // If there's a current ayah but not playing, resume with autoplay true
      playAyahExternal(currentPlayingAyah.ayah, currentPlayingAyah.surahNumber, true);
    } else {
      playPause();
    }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (window.scrollY > lastScrollY && isVisible) {
        // Scrolling down, hide player
        setIsVisible(false);
      } else if (window.scrollY < lastScrollY && !isVisible) {
        // Scrolling up, show player
        setIsVisible(true);
      }

      lastScrollY = window.scrollY;

      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(true); // Show player after scroll stops
      }, 200); // Adjust debounce time as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isVisible]);

  const surah = currentPlayingAyah ? juzAmmaSurahs.find(
    (s) => s.number === currentPlayingAyah.surahNumber
  ) : null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t p-4 flex items-center justify-between shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          {currentPlayingAyah ? (
            <>
              <p className="font-semibold text-foreground">
                {surah?.name} - Ayah {currentPlayingAyah.ayah.numberInSurah}
              </p>
              <p className="text-muted-foreground text-xs">
                {currentPlayingAyah.ayah.text.substring(0, 50)}...
              </p>
            </>
          ) : (
            <p className="font-semibold text-muted-foreground">Tidak ada ayat yang diputar</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={playPreviousAyah} disabled={!currentPlayingAyah}>
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePlayPause} disabled={ayahs.length === 0}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={playNextAyah} disabled={!currentPlayingAyah}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};