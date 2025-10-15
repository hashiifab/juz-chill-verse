import { SurahCard } from "./SurahCard";
import { Surah } from "@/types/surah";

interface SurahListProps {
  surahs: Surah[];
  onSurahClick: (surah: Surah) => void;
}

export function SurahList({ surahs, onSurahClick }: SurahListProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Daftar Surah
        </h2>
        <p className="text-muted-foreground">
          {surahs.length} surah dalam Juz 'Amma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {surahs.map((surah, index) => (
          <div
            key={surah.number}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <SurahCard
              number={surah.number}
              name={surah.name}
              arabicName={surah.arabicName}
              translation={surah.translation}
              verses={surah.verses}
              revelation={surah.revelation}
              onClick={() => onSurahClick(surah)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
