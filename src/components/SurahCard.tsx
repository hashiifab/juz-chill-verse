import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Surah } from "@/types/surah";
import { Link } from "react-router-dom";

interface SurahCardProps {
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  verses: number;
  revelation: string;
}

export function SurahCard({
  number,
  name,
  arabicName,
  translation,
  verses,
  revelation,
}: SurahCardProps) {
  return (
    <Link to={`/surah/${number}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <span className="text-xs text-muted-foreground">{arabicName}</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{number}</div>
          <p className="text-xs text-muted-foreground">
            {translation} &bull; {verses} ayat &bull; {revelation}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
