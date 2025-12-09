import { useState } from "react";
import { Save, Smile, Meh, Frown, ThumbsUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface DiaryEntryFormProps {
  onSave: (commentary: string, mood: "great" | "good" | "neutral" | "bad") => void;
  onSkip: () => void;
  isNight?: boolean;
}

export function DiaryEntryForm({ onSave, onSkip, isNight = false }: DiaryEntryFormProps) {
  const [commentary, setCommentary] = useState("");
  const [mood, setMood] = useState<"great" | "good" | "neutral" | "bad" | null>(null);
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (mood) {
      onSave(commentary, mood);
    }
  };

  const MoodButton = ({ value, icon: Icon, label }: { value: string, icon: any, label: string }) => (
    <button
      onClick={() => setMood(value as any)}
      data-testid={`button-mood-${value}`}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl transition-all border",
        mood === value
          ? isNight 
            ? "bg-indigo-600 text-white border-indigo-500 scale-105 shadow-md"
            : "bg-primary text-primary-foreground border-primary scale-105 shadow-md"
          : isNight
            ? "bg-slate-700/50 text-slate-300 border-transparent hover:bg-slate-600/50 hover:scale-105"
            : "bg-white/50 text-muted-foreground border-transparent hover:bg-white/80 hover:scale-105"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={cn(
        "backdrop-blur-md rounded-2xl p-6 border shadow-sm",
        isNight 
          ? "bg-slate-800/60 border-slate-700/50" 
          : "bg-white/40 border-white/40"
      )}>
        <h3 className={cn(
          "font-serif text-xl mb-4 text-center",
          isNight ? "text-slate-100" : "text-foreground"
        )}>
          {t("howDoYouFeel")}
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <MoodButton value="great" icon={ThumbsUp} label={t("great")} />
              <MoodButton value="good" icon={Smile} label={t("good")} />
              <MoodButton value="neutral" icon={Meh} label={t("neutral")} />
              <MoodButton value="bad" icon={Frown} label={t("bad")} />
            </div>
          </div>

          <div className="space-y-3">
             <label className={cn(
               "text-xs font-medium uppercase tracking-wider block",
               isNight ? "text-slate-400" : "text-muted-foreground"
             )}>
              {t("optionalNotes")}
            </label>
            <Textarea
              placeholder={t("optionalNotes")}
              value={commentary}
              onChange={(e) => setCommentary(e.target.value)}
              data-testid="input-diary-notes"
              className={cn(
                "resize-none min-h-[100px]",
                isNight 
                  ? "bg-slate-700/60 border-slate-600/50 text-slate-100 placeholder:text-slate-500" 
                  : "bg-white/60 border-white/40 focus:ring-primary/20"
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onSkip}
              data-testid="button-skip-diary"
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors",
                isNight 
                  ? "text-slate-400 hover:text-slate-200" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("skipEntry")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!mood}
              data-testid="button-save-diary"
              className={cn(
                "flex-[2] py-3 rounded-full font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2",
                isNight 
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
              )}
            >
              <Save className="w-4 h-4" />
              {t("saveEntry")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
