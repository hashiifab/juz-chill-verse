import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { juzAmmaSurahs } from "@/data/juzAmma";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { useAudioPlayer } from "@/components/AudioPlayer";

interface Ayah {
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

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    direction: string;
  };
}

interface AlQuranCloudResponse {
  code: number;
  status: string;
  data: SurahData;
}

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [surahArabicContent, setSurahArabicContent] = useState<string | null>(null);
  const [surahIndonesianContent, setSurahIndonesianContent] = useState<string | null>(null);
  const [surahArabicAyahs, setSurahArabicAyahs] = useState<Ayah[] | null>(null);
  const [surahIndonesianAyahs, setSurahIndonesianAyahs] = useState<Ayah[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { playAyahExternal, setAyahs, setSurahNumber, currentPlayingAyah, isPlaying } = useAudioPlayer();

  const surah = juzAmmaSurahs.find(
    (s) => s.number === Number(surahNumber)
  );

  useEffect(() => {
    const fetchSurahContent = async () => {
      if (!surah) {
        setError("Surah tidak ditemukan.");
        return;
      }

      try {
        // Fetch Arabic content (text)
        const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`);
        if (!arabicResponse.ok) {
          throw new Error(`HTTP error! status: ${arabicResponse.status} for Arabic content`);
        }
        const arabicData: AlQuranCloudResponse = await arabicResponse.json();

        // Fetch Indonesian translation
        const indonesianResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/id.indonesian`);
        if (!indonesianResponse.ok) {
          throw new Error(`HTTP error! status: ${indonesianResponse.status} for Indonesian translation`);
        }
        const indonesianData: AlQuranCloudResponse = await indonesianResponse.json();
        setSurahIndonesianAyahs(indonesianData.data.ayahs);

        // Fetch audio content
        const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`);
        if (!audioResponse.ok) {
          throw new Error(`HTTP error! status: ${audioResponse.status} for audio content`);
        }
        const audioData: AlQuranCloudResponse = await audioResponse.json();

        const ayahsWithAudio = arabicData.data.ayahs.map((arabicAyah, index) => {
          const audioAyah = audioData.data.ayahs[index];
          return {
            ...arabicAyah,
            audio: audioAyah.audio,
            audioSecondary: audioAyah.audioSecondary || [],
          };
        });
        setSurahArabicAyahs(ayahsWithAudio);
        setAyahs(ayahsWithAudio);
        setSurahNumber(surah.number);

      } catch (e: unknown) {
        setError(`Gagal memuat konten surah: ${e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui'}`);
      }
    };

    fetchSurahContent();
  }, [surahNumber, surah, setAyahs, setSurahNumber]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Memuat...</h1>
          <p className="text-muted-foreground">Mencari surah...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {surah.name} ({surah.arabicName})
        </h1>
        <p className="text-muted-foreground mb-8">
          {surah.translation} &bull; {surah.verses} ayat &bull; {surah.revelation}
        </p>

        {surahArabicAyahs && surahIndonesianAyahs ? (
          <div className="space-y-8">
            {surahArabicAyahs.map((arabicAyah, index) => {
              const isFirstAyah = index === 0;
              const bismillahText = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
              let displayArabicText = arabicAyah.text;
              let displayIndonesianText = surahIndonesianAyahs[index]?.text;
              let showBismillah = false;

              if (isFirstAyah && arabicAyah.text.startsWith(bismillahText)) {
                showBismillah = true;
                displayArabicText = arabicAyah.text.substring(bismillahText.length).trim();
                // For Indonesian translation, we assume Bismillah is also at the beginning if it's there.
                // This might need refinement if the Indonesian translation doesn't exactly match the Arabic structure.
                if (displayIndonesianText && displayIndonesianText.startsWith("Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.")) {
                  displayIndonesianText = displayIndonesianText.substring("Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.".length).trim();
                }
              }

              return (
                <div key={arabicAyah.numberInSurah} className="border-b pb-4 mb-4 last:border-b-0">
                  {showBismillah && (
                    <p className="text-center text-3xl leading-relaxed font-arabic mb-4">
                      {bismillahText}
                    </p>
                  )}
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playAyahExternal(arabicAyah, surah.number, false)}
                      className="mr-2"
                    >
                      {isPlaying && currentPlayingAyah?.ayah.numberInSurah === arabicAyah.numberInSurah ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <p className="text-right text-3xl leading-relaxed font-arabic mb-2">
                      {displayArabicText} ({arabicAyah.numberInSurah})
                    </p>
                  </div>
                  <p className="text-left text-lg text-muted-foreground">
                    {displayIndonesianText}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Memuat konten surah...</p>
        )}
      </main>
    </div>
  );
};

export default SurahDetail;