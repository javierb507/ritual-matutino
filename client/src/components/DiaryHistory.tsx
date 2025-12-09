import { motion } from "framer-motion";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { BookOpen, Calendar as CalendarIcon, Smile, ThumbsUp, Meh, Frown, Sun, Moon } from "lucide-react";
import { DiaryEntry } from "@/lib/storage";
import { useTranslation } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DiaryHistoryProps {
  entries: DiaryEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const MoodIcon = ({ mood }: { mood?: string }) => {
  switch (mood) {
    case "great": return <ThumbsUp className="w-4 h-4 text-green-600" />;
    case "good": return <Smile className="w-4 h-4 text-blue-600" />;
    case "neutral": return <Meh className="w-4 h-4 text-yellow-600" />;
    case "bad": return <Frown className="w-4 h-4 text-red-600" />;
    default: return null;
  }
};

const RoutineIcon = ({ type }: { type: "morning" | "night" }) => {
  return type === "morning" 
    ? <Sun className="w-4 h-4 text-amber-500" />
    : <Moon className="w-4 h-4 text-indigo-400" />;
};

export function DiaryHistory({ entries, isOpen, onClose }: DiaryHistoryProps) {
  const { t, language } = useTranslation();
  const dateLocale = language === "es" ? es : enUS;

  const getMoodLabel = (mood?: string) => {
    switch (mood) {
      case "great": return t("great");
      case "good": return t("good");
      case "neutral": return t("neutral");
      case "bad": return t("bad");
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#faf9f6]">
        <DialogHeader className="p-6 pb-2 border-b bg-white/50 backdrop-blur-sm">
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {t("history")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>{t("noEntries")}</p>
            </div>
          ) : (
            entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative pl-6 border-l-2 border-primary/20 pb-6 last:pb-0"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#faf9f6] border-2 border-primary/40 group-hover:border-primary group-hover:scale-110 transition-all" />
                
                <div className="flex items-baseline justify-between mb-2">
                  <h4 className="font-medium text-foreground capitalize">
                    {format(new Date(entry.timestamp), language === "es" ? "EEEE, d 'de' MMMM" : "EEEE, MMMM d", { locale: dateLocale })}
                  </h4>
                  <span className="text-xs text-muted-foreground font-mono">
                    {format(new Date(entry.timestamp), "HH:mm")}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-border/50 shadow-sm space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground border-b border-border/40 pb-2">
                    <div className="flex items-center gap-1.5">
                      <RoutineIcon type={entry.routineType} />
                      <span className="text-xs uppercase tracking-wider font-medium">
                        {entry.routineType === "morning" ? t("morning") : t("night")}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <MoodIcon mood={entry.mood} />
                      <span className="capitalize text-foreground/80 text-xs">
                        {getMoodLabel(entry.mood)}
                      </span>
                    </div>
                  </div>
                  
                  {entry.commentary && (
                    <p className="text-sm text-foreground/90 leading-relaxed italic">
                      "{entry.commentary}"
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
