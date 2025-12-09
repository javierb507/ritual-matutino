import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, Check, RotateCcw, ArrowRight, Info, BookOpen, Sun, Moon, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { getRecommendedRoutine, getOtherRoutine, type Routine, type RoutineStep } from "@/lib/routine";
import { useDiary } from "@/lib/storage";
import { DiaryEntryForm } from "@/components/DiaryEntry";
import { DiaryHistory } from "@/components/DiaryHistory";
import { useTranslation, type TranslationKey } from "@/lib/i18n";
import bgMorning from "@assets/generated_images/abstract_soft_morning_sunlight_filtering_through_leaves.png";
import bgNight from "@assets/generated_images/peaceful_moonlit_bedroom_scene_for_night_ritual.png";
import breatheImage from "@assets/generated_images/serene_man_sitting_on_bed_doing_deep_breathing_exercises_with_morning_light.png";
import visualizeImage from "@assets/generated_images/close_up_of_person_visualizing_ideal_day_with_eyes_closed_and_peaceful_expression.png";
import intentionImage from "@assets/generated_images/person_standing_confidently_stating_intention_with_hands_on_chest.png";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ViewState = "welcome" | "active" | "summary";

const MORNING_STEP_IMAGES: Record<string, string> = {
  "m1": breatheImage,
  "m2": visualizeImage,
  "m3": intentionImage,
};

function useTranslatedRoutine(routine: Routine) {
  const { t } = useTranslation();
  
  const getTranslatedStep = (step: RoutineStep): RoutineStep => {
    const keyMap: Record<string, { title: TranslationKey; desc: TranslationKey; details: TranslationKey; phase: TranslationKey }> = {
      m1: { title: "m1Title", desc: "m1Desc", details: "m1Details", phase: "m1Phase" },
      m2: { title: "m2Title", desc: "m2Desc", details: "m2Details", phase: "m2Phase" },
      m3: { title: "m3Title", desc: "m3Desc", details: "m3Details", phase: "m3Phase" },
      n1: { title: "n1Title", desc: "n1Desc", details: "n1Details", phase: "n1Phase" },
      n2: { title: "n2Title", desc: "n2Desc", details: "n2Details", phase: "n2Phase" },
      n3: { title: "n3Title", desc: "n3Desc", details: "n3Details", phase: "n3Phase" },
      n4: { title: "n4Title", desc: "n4Desc", details: "n4Details", phase: "n4Phase" },
    };
    
    const keys = keyMap[step.id];
    if (!keys) return step;
    
    return {
      ...step,
      title: t(keys.title),
      description: t(keys.desc),
      details: t(keys.details),
      phase: t(keys.phase),
    };
  };
  
  return {
    ...routine,
    name: t(routine.id === "morning" ? "morningRoutineName" : "nightRoutineName"),
    subtitle: t(routine.id === "morning" ? "morningRoutineSubtitle" : "nightRoutineSubtitle"),
    steps: routine.steps.map(getTranslatedStep),
  };
}

export default function RoutineApp() {
  const [baseRoutine, setBaseRoutine] = useState<Routine>(getRecommendedRoutine);
  const [view, setView] = useState<ViewState>("welcome");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [diarySaved, setDiarySaved] = useState(false);
  const [showStepDetails, setShowStepDetails] = useState(false);
  
  const { t, language, toggleLanguage } = useTranslation();
  const routine = useTranslatedRoutine(baseRoutine);
  const [timeLeft, setTimeLeft] = useState(baseRoutine.steps[0].duration);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const { entries, addEntry, getStreak, getTodayMinutes } = useDiary();
  const streak = getStreak(baseRoutine.id);
  const todayMinutes = getTodayMinutes(baseRoutine.id);

  const currentStep = routine.steps[currentStepIndex];
  const isNight = baseRoutine.id === "night";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNextStep();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const playBell = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const switchRoutine = () => {
    const other = getOtherRoutine(baseRoutine);
    setBaseRoutine(other);
    setCurrentStepIndex(0);
    setTimeLeft(other.steps[0].duration);
  };

  const handleStart = () => {
    playBell();
    setView("active");
    setIsActive(true);
    setCurrentStepIndex(0);
    setTimeLeft(baseRoutine.steps[0].duration);
    setDiarySaved(false);
  };

  const handleNextStep = () => {
    playBell();
    if (currentStepIndex < baseRoutine.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(baseRoutine.steps[nextIndex].duration);
      setIsActive(true);
    } else {
      setView("summary");
      setIsActive(false);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const handleSaveDiary = (commentary: string, mood: "great" | "good" | "neutral" | "bad") => {
    addEntry({
      completed: true,
      commentary,
      mood,
      routineType: baseRoutine.id
    });
    setDiarySaved(true);
  };

  const handleSkipDiary = () => {
    addEntry({
      completed: true,
      routineType: baseRoutine.id
    });
    setDiarySaved(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const baseStep = baseRoutine.steps[currentStepIndex];
  const progress = ((baseStep.duration - timeLeft) / baseStep.duration) * 100;
  const bgImage = isNight ? bgNight : bgMorning;
  const stepImage = MORNING_STEP_IMAGES[currentStep.id] || bgImage;

  return (
    <div className={cn(
      "min-h-screen text-foreground font-sans relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-700",
      isNight ? "bg-slate-900" : "bg-background"
    )}>
      <audio ref={audioRef} src="/sounds/bell.mp3" preload="auto" />
      
      <DiaryHistory 
        entries={entries} 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
      />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={view === "active" ? currentStep.id : baseRoutine.id}
            src={view === "active" ? stepImage : bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            alt="Background"
            className={cn(
              "w-full h-full object-cover blur-sm scale-105 absolute inset-0",
              isNight ? "opacity-40" : "opacity-30"
            )}
          />
        </AnimatePresence>
        <div className={cn(
          "absolute inset-0 backdrop-blur-[2px]",
          isNight 
            ? "bg-gradient-to-b from-slate-900/60 to-slate-900/90" 
            : "bg-gradient-to-b from-white/40 to-white/80"
        )} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {view === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="absolute top-0 right-0 flex gap-2">
                <button 
                  onClick={toggleLanguage}
                  data-testid="button-toggle-language"
                  className={cn(
                    "p-2 transition-colors rounded-full flex items-center gap-1 text-xs font-medium",
                    isNight 
                      ? "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50" 
                      : "text-muted-foreground hover:text-primary bg-white/50 hover:bg-white/80"
                  )}
                  title={language === "es" ? "Switch to English" : "Cambiar a Español"}
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{language}</span>
                </button>
                <button 
                  onClick={switchRoutine}
                  data-testid="button-switch-routine"
                  className={cn(
                    "p-2 transition-colors rounded-full",
                    isNight 
                      ? "text-slate-400 hover:text-amber-300 bg-slate-800/50 hover:bg-slate-700/50" 
                      : "text-muted-foreground hover:text-primary bg-white/50 hover:bg-white/80"
                  )}
                  title={isNight ? t("switchToMorning") : t("switchToNight")}
                >
                  {isNight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setShowHistory(true)}
                  data-testid="button-show-history"
                  className={cn(
                    "p-2 transition-colors rounded-full",
                    isNight 
                      ? "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50" 
                      : "text-muted-foreground hover:text-primary bg-white/50 hover:bg-white/80"
                  )}
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 pt-8">
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-2",
                  isNight ? "bg-indigo-900/50 text-indigo-300" : "bg-primary/10 text-primary"
                )}>
                  {isNight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  {isNight ? t("night") : t("morning")}
                </div>
                <h1 className={cn(
                  "font-serif text-5xl md:text-6xl font-medium tracking-tight",
                  isNight ? "text-white" : "text-primary"
                )}>
                  {routine.name}
                </h1>
                <p className={cn(
                  "text-lg max-w-xs mx-auto",
                  isNight ? "text-slate-400" : "text-muted-foreground"
                )}>
                  {routine.subtitle}
                </p>
              </div>

              <div className={cn(
                "backdrop-blur-md rounded-2xl p-6 shadow-sm border",
                isNight 
                  ? "bg-slate-800/60 border-slate-700/50" 
                  : "bg-white/60 border-white/40"
              )}>
                <h3 className={cn(
                  "font-serif text-xl mb-4",
                  isNight ? "text-slate-200" : "text-primary/80"
                )}>
                  {isNight ? t("theFourSteps") : t("theProtocol")}
                </h3>
                <ul className="space-y-4 text-left">
                  {routine.steps.map((step, idx) => (
                    <li key={step.id} className={cn(
                      "flex items-start gap-3 text-sm",
                      isNight ? "text-slate-300" : "text-foreground/80"
                    )}>
                      <span className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium mt-0.5",
                        isNight ? "bg-indigo-900/50 text-indigo-300" : "bg-primary/10 text-primary"
                      )}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className={cn(
                          "font-medium block",
                          isNight ? "text-slate-100" : "text-primary"
                        )}>{step.title}</span>
                        <span className={cn(
                          "text-xs",
                          isNight ? "text-slate-500" : "text-muted-foreground"
                        )}>{step.description}</span>
                      </div>
                      <span className={cn(
                        "ml-auto text-xs opacity-60 whitespace-nowrap",
                        isNight ? "text-slate-500" : "text-muted-foreground"
                      )}>
                        {Math.floor(step.duration / 60)}m
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Step Details Preview */}
                <Collapsible open={showStepDetails} onOpenChange={setShowStepDetails} className="mt-4">
                  <CollapsibleTrigger asChild>
                    <button 
                      data-testid="button-toggle-step-details"
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors rounded-lg",
                        isNight 
                          ? "text-indigo-300 hover:bg-slate-700/50" 
                          : "text-primary hover:bg-primary/5"
                      )}
                    >
                      {showStepDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {showStepDetails ? t("hideSteps") : t("previewSteps")}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className={cn(
                      "mt-4 space-y-4 pt-4 border-t",
                      isNight ? "border-slate-700/50" : "border-white/40"
                    )}>
                      {routine.steps.map((step, idx) => (
                        <div key={step.id} className={cn(
                          "p-4 rounded-xl",
                          isNight ? "bg-slate-700/30" : "bg-white/50"
                        )}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                              isNight ? "bg-indigo-900/50 text-indigo-300" : "bg-primary/10 text-primary"
                            )}>
                              {idx + 1}
                            </span>
                            <h4 className={cn(
                              "font-medium text-sm",
                              isNight ? "text-slate-100" : "text-foreground"
                            )}>{step.title}</h4>
                          </div>
                          <p className={cn(
                            "text-xs leading-relaxed",
                            isNight ? "text-slate-400" : "text-muted-foreground"
                          )}>
                            {step.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <button
                onClick={handleStart}
                data-testid="button-start-ritual"
                className={cn(
                  "group relative inline-flex items-center justify-center px-8 py-4 font-medium transition-all duration-300 rounded-full active:scale-95",
                  isNight 
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20" 
                    : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                )}
              >
                <span>{t("startRitual")}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {view === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              <div className={cn(
                "backdrop-blur-xl rounded-3xl shadow-xl border p-6 md:p-8 text-center relative overflow-hidden min-h-[500px] flex flex-col justify-center",
                isNight 
                  ? "bg-slate-800/80 border-slate-700/50" 
                  : "bg-white/80 border-white/50"
              )}>
                {/* Progress Bar Top */}
                <div className={cn("absolute top-0 left-0 right-0 h-1.5", isNight ? "bg-slate-700" : "bg-muted")}>
                  <motion.div 
                    className={cn("h-full", isNight ? "bg-indigo-500" : "bg-accent")}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIndex) / routine.steps.length) * 100}%` }}
                  />
                </div>

                <div className="mb-6 mt-2">
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-3",
                    isNight ? "bg-indigo-900/50 text-indigo-300" : "bg-primary/10 text-primary"
                  )}>
                    {currentStep.phase}
                  </span>
                  <h2 className={cn(
                    "font-serif text-3xl md:text-4xl mb-3 leading-tight",
                    isNight ? "text-white" : "text-foreground"
                  )}>
                    {currentStep.title}
                  </h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        data-testid="button-view-details"
                        className={cn(
                          "inline-flex items-center gap-1 text-xs transition-colors mb-2",
                          isNight 
                            ? "text-slate-400 hover:text-indigo-300" 
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <Info className="w-3 h-3" /> {t("viewDetails")}
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{currentStep.title}</DialogTitle>
                        <DialogDescription className="pt-4 text-base leading-relaxed">
                          {currentStep.details}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Timer Circle */}
                <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className={isNight ? "text-slate-700" : "text-muted/50"}
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className={isNight ? "text-indigo-400" : "text-primary"}
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={cn(
                      "text-5xl font-variant-numeric tabular-nums font-medium tracking-tight",
                      isNight ? "text-white" : "text-foreground"
                    )}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Instruction Text */}
                <p className={cn(
                  "text-sm italic mb-8 max-w-[80%] mx-auto",
                  isNight ? "text-slate-300" : "text-foreground/80"
                )}>
                   "{currentStep.details?.split('.')[0]}..."
                </p>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={toggleTimer}
                    data-testid="button-toggle-timer"
                    className={cn(
                      "h-16 w-16 rounded-full text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95",
                      isNight 
                        ? "bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20" 
                        : "bg-primary hover:bg-primary/90 hover:shadow-primary/20"
                    )}
                  >
                    {isActive ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    data-testid="button-complete-step"
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center transition-all active:scale-95",
                      isNight 
                        ? "bg-slate-700 text-slate-200 hover:bg-slate-600" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleNextStep}
                  data-testid="button-skip-step"
                  className={cn(
                    "mt-6 text-xs transition-colors flex items-center justify-center gap-1 mx-auto",
                    isNight 
                      ? "text-slate-500 hover:text-indigo-300" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {t("skipStep")} <SkipForward className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {view === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              {!diarySaved ? (
                <>
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500",
                    isNight ? "bg-indigo-900/50 text-indigo-300" : "bg-primary/10 text-primary"
                  )}>
                    <Check className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h1 className={cn(
                      "font-serif text-3xl md:text-4xl",
                      isNight ? "text-white" : "text-foreground"
                    )}>
                      {t("ritualComplete")}
                    </h1>
                    <p className={cn(
                      "max-w-xs mx-auto text-sm",
                      isNight ? "text-slate-400" : "text-muted-foreground"
                    )}>
                      {t("takeAMoment")}
                    </p>
                  </div>

                  <DiaryEntryForm onSave={handleSaveDiary} onSkip={handleSkipDiary} isNight={isNight} />
                </>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                    isNight ? "bg-indigo-900/50 text-indigo-300" : "bg-green-100 text-green-600"
                  )}>
                    <BookOpen className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className={cn(
                      "font-serif text-4xl md:text-5xl",
                      isNight ? "text-white" : "text-foreground"
                    )}>
                      {t("saved")}
                    </h1>
                    <p className={cn(
                      "max-w-xs mx-auto text-lg",
                      isNight ? "text-slate-400" : "text-muted-foreground"
                    )}>
                      {t("progressSaved")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className={cn(
                      "p-4 rounded-xl border",
                      isNight ? "bg-slate-800/50 border-slate-700/50" : "bg-white/50 border-white/40"
                    )}>
                      <div className={cn(
                        "text-2xl font-serif mb-1",
                        isNight ? "text-indigo-300" : "text-primary"
                      )}>{streak} {t("days")}</div>
                      <div className={cn(
                        "text-xs",
                        isNight ? "text-slate-500" : "text-muted-foreground"
                      )}>{isNight ? t("nightStreak") : t("morningStreak")}</div>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border",
                      isNight ? "bg-slate-800/50 border-slate-700/50" : "bg-white/50 border-white/40"
                    )}>
                      <div className={cn(
                        "text-2xl font-serif mb-1",
                        isNight ? "text-indigo-300" : "text-primary"
                      )}>{todayMinutes}m</div>
                      <div className={cn(
                        "text-xs",
                        isNight ? "text-slate-500" : "text-muted-foreground"
                      )}>{t("investedToday")}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-w-xs mx-auto mt-8">
                    <button
                      onClick={() => {
                        setDiarySaved(false);
                        setView("welcome");
                      }}
                      data-testid="button-finish-return"
                      className={cn(
                        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full transition-colors shadow-lg",
                        isNight 
                          ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20" 
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                      )}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t("finishAndReturn")}
                    </button>
                    
                    <button
                      onClick={() => setShowHistory(true)}
                      data-testid="button-view-history-summary"
                      className={cn(
                        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full transition-colors",
                        isNight 
                          ? "text-slate-400 hover:text-white hover:bg-slate-700/50" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                      )}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {t("viewHistory")}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
