import { useState, useEffect, createContext, useContext } from "react";

export type Language = "es" | "en";

const translations = {
  es: {
    morning: "Matutino",
    night: "Nocturno",
    startRitual: "Comenzar Ritual",
    ritualComplete: "Ritual Completado",
    saved: "¡Guardado!",
    progressSaved: "Tu progreso ha sido registrado.",
    takeAMoment: "Toma un momento para registrar tu estado.",
    finishAndReturn: "Finalizar y Volver",
    viewHistory: "Ver Historial",
    skipStep: "Saltar paso",
    viewDetails: "Ver instrucciones detalladas",
    theProtocol: "El Protocolo",
    theFourSteps: "Los 4 Pasos",
    switchToMorning: "Cambiar a ritual matutino",
    switchToNight: "Cambiar a ritual nocturno",
    morningStreak: "Racha Matutina",
    nightStreak: "Racha Nocturna",
    days: "días",
    investedToday: "Invertidos Hoy",
    howDoYouFeel: "¿Cómo te sientes?",
    great: "Genial",
    good: "Bien",
    neutral: "Normal",
    bad: "Mal",
    optionalNotes: "Notas opcionales...",
    saveEntry: "Guardar",
    skipEntry: "Omitir",
    history: "Historial",
    noEntries: "Aún no hay entradas",
    previewSteps: "Ver Detalles de los Pasos",
    hideSteps: "Ocultar Detalles",
    morningRoutineName: "Ritual de 7 Minutos",
    morningRoutineSubtitle: "Reprogramación neuronal para transformar tu día.",
    nightRoutineName: "Ritual Nocturno",
    nightRoutineSubtitle: "Y-Pun-Nun-Kaisen: reprograma tu mente mientras duermes.",
    m1Title: "Respiración de Reinicio Neural",
    m1Desc: "Activa el nervio vago y reduce el cortisol.",
    m1Details: "Siéntate erguido al borde de la cama. Mano izquierda en el corazón, derecha en el vientre. Inhala por nariz (4s), sostén (7s), exhala por boca (8s). Repite 6 veces.",
    m1Phase: "Fase 1: Preparación",
    m2Title: "Anclaje por Visualización",
    m2Desc: "Implanta imágenes de tu día ideal.",
    m2Details: "Cierra los ojos. Visualiza tu día con detalle: sin dolor, con claridad y energía. Siente la emoción de lograr tus 3 prioridades. La intensidad emocional es clave.",
    m2Phase: "Fase 2: Programación",
    m3Title: "Impresión de la Intención",
    m3Desc: "Ancla nuevas vías neuronales verbalmente.",
    m3Details: "Abre los ojos. Di tu intención en voz alta y presente (ej: 'Mi mente es aguda'). Repite 3 veces con convicción. Termina de pie con una respiración profunda.",
    m3Phase: "Fase 3: Ejecución",
    n1Title: "Limpieza Mental",
    n1Desc: "Libera pensamientos del día.",
    n1Details: "Escribe a mano 3 pensamientos que te rondan la mente (preocupaciones, ideas, tareas). Esto libera espacio cognitivo y calma la amígdala, el centro del estrés.",
    n1Phase: "Paso 1: Vaciar la mente",
    n2Title: "Enfoque en Metas",
    n2Desc: "Programa tu objetivo de mañana.",
    n2Details: "Redacta una meta del día siguiente como si ya la hubieras cumplido. Ejemplo: 'He tenido una mañana productiva y llena de energía.' Activa centros de recompensa cerebral.",
    n2Phase: "Paso 2: Programar mañana",
    n3Title: "Respiración Relajante",
    n3Desc: "Calma cuerpo y mente.",
    n3Details: "Realiza 3 ciclos de respiración profunda: Inhala en 4 seg, retén en 7 seg, exhala en 8 seg. Estimula el nervio vago y activa el modo parasimpático (descanso, recuperación).",
    n3Phase: "Paso 3: Calmar el cuerpo",
    n4Title: "Gratitud Anticipada",
    n4Desc: "Visualiza el éxito de mañana.",
    n4Details: "Visualiza cómo te despiertas y cumples tu objetivo con gratitud. Esta técnica crea 'memorias prospectivas' que el subconsciente asimila como posibles.",
    n4Phase: "Paso 4: Sembrar el sueño",
  },
  en: {
    morning: "Morning",
    night: "Night",
    startRitual: "Start Ritual",
    ritualComplete: "Ritual Complete",
    saved: "Saved!",
    progressSaved: "Your progress has been recorded.",
    takeAMoment: "Take a moment to record how you feel.",
    finishAndReturn: "Finish and Return",
    viewHistory: "View History",
    skipStep: "Skip step",
    viewDetails: "View detailed instructions",
    theProtocol: "The Protocol",
    theFourSteps: "The 4 Steps",
    switchToMorning: "Switch to morning ritual",
    switchToNight: "Switch to night ritual",
    morningStreak: "Morning Streak",
    nightStreak: "Night Streak",
    days: "days",
    investedToday: "Invested Today",
    howDoYouFeel: "How do you feel?",
    great: "Great",
    good: "Good",
    neutral: "Okay",
    bad: "Bad",
    optionalNotes: "Optional notes...",
    saveEntry: "Save",
    skipEntry: "Skip",
    history: "History",
    noEntries: "No entries yet",
    previewSteps: "View Step Details",
    hideSteps: "Hide Details",
    morningRoutineName: "7-Minute Ritual",
    morningRoutineSubtitle: "Neural reprogramming to transform your day.",
    nightRoutineName: "Night Ritual",
    nightRoutineSubtitle: "Y-Pun-Nun-Kaisen: reprogram your mind while you sleep.",
    m1Title: "Neural Reset Breathing",
    m1Desc: "Activates the vagus nerve and reduces cortisol.",
    m1Details: "Sit upright at the edge of your bed. Left hand on heart, right hand on belly. Inhale through nose (4s), hold (7s), exhale through mouth (8s). Repeat 6 times.",
    m1Phase: "Phase 1: Preparation",
    m2Title: "Visualization Anchoring",
    m2Desc: "Plant images of your ideal day.",
    m2Details: "Close your eyes. Visualize your day in detail: pain-free, with clarity and energy. Feel the emotion of achieving your 3 priorities. Emotional intensity is key.",
    m2Phase: "Phase 2: Programming",
    m3Title: "Intention Imprint",
    m3Desc: "Anchor new neural pathways verbally.",
    m3Details: "Open your eyes. State your intention out loud and in present tense (e.g., 'My mind is sharp'). Repeat 3 times with conviction. Finish standing with a deep breath.",
    m3Phase: "Phase 3: Execution",
    n1Title: "Mental Cleanup",
    n1Desc: "Release thoughts from the day.",
    n1Details: "Write down 3 thoughts on your mind (worries, ideas, tasks). This frees cognitive space and calms the amygdala, the stress center.",
    n1Phase: "Step 1: Empty the mind",
    n2Title: "Goal Focus",
    n2Desc: "Program tomorrow's objective.",
    n2Details: "Write a goal for tomorrow as if you've already achieved it. Example: 'I had a productive and energetic morning.' Activates brain reward centers.",
    n2Phase: "Step 2: Program tomorrow",
    n3Title: "Relaxing Breath",
    n3Desc: "Calm body and mind.",
    n3Details: "Do 3 cycles of deep breathing: Inhale 4 sec, hold 7 sec, exhale 8 sec. Stimulates the vagus nerve and activates parasympathetic mode (rest, recovery).",
    n3Phase: "Step 3: Calm the body",
    n4Title: "Anticipated Gratitude",
    n4Desc: "Visualize tomorrow's success.",
    n4Details: "Visualize waking up and achieving your goal with gratitude. This technique creates 'prospective memories' that the subconscious assimilates as possible.",
    n4Phase: "Step 4: Plant the dream",
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

const STORAGE_KEY = "ritual-app-language";

function getStoredLanguage(): Language {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  }
  return "es";
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return { language, setLanguage, t, toggleLanguage };
}

export type UseLanguageReturn = ReturnType<typeof useLanguage>;

interface LanguageContextType extends UseLanguageReturn {}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}
