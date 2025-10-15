import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onSearch: (value: string) => void;
  searchValue: string;
}

export function Hero({ onSearch, searchValue }: HeroProps) {
  return (
    <section className="gradient-hero py-16 md:py-24 px-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Juz 'Amma 🌿
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ruang refleksi digital untuk mendalami ayat-ayat suci dengan damai dan stylish
          </p>
        </div>

        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari surah..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 h-12 text-base shadow-soft hover-glow"
            />
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground italic">
            "Hari ini, ayo refleksi bareng ayat-ayat pilihan ✨"
          </p>
        </div>
      </div>
    </section>
  );
}
