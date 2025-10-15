import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface SurahCardProps {
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  verses: number;
  revelation: string;
  onClick: () => void;
}

export function SurahCard({
  number,
  name,
  arabicName,
  translation,
  verses,
  revelation,
  onClick,
}: SurahCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover-scale hover-glow shadow-soft transition-smooth group"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
              {number}
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-smooth">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground">{translation}</p>
              </div>
              <p className="text-2xl font-arabic text-primary">{arabicName}</p>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                {verses} ayat
              </Badge>
              <Badge variant="outline" className="text-xs">
                {revelation}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
