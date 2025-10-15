import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SurahList } from "@/components/SurahList";
import { juzAmmaSurahs } from "@/data/juzAmma";
import { Surah } from "@/types/surah";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return juzAmmaSurahs;

    const query = searchQuery.toLowerCase();
    return juzAmmaSurahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(query) ||
        surah.translation.toLowerCase().includes(query) ||
        surah.arabicName.includes(query) ||
        surah.number.toString().includes(query)
    );
  }, [searchQuery]);

  const handleSurahClick = (surah: Surah) => {
    toast.info(`Detail untuk ${surah.name} akan segera hadir! 🌿`);
    // TODO: Navigate to surah detail page
    console.log("Selected surah:", surah);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero onSearch={setSearchQuery} searchValue={searchQuery} />
        <SurahList surahs={filteredSurahs} onSurahClick={handleSurahClick} />
      </main>
      
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Ruang refleksi digital untuk Gen Z Muslim 🌿
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Dibuat dengan ❤️ untuk mendekatkan diri dengan Al-Qur'an
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
