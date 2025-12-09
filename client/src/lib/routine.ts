export interface RoutineStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon?: string;
  details?: string;
  phase?: string;
}

export interface Routine {
  id: "morning" | "night";
  name: string;
  subtitle: string;
  totalMinutes: number;
  steps: RoutineStep[];
}

export const MORNING_ROUTINE: Routine = {
  id: "morning",
  name: "Ritual de 7 Minutos",
  subtitle: "Reprogramación neuronal para transformar tu día.",
  totalMinutes: 7,
  steps: [
    {
      id: "m1",
      title: "Respiración de Reinicio Neural",
      description: "Activa el nervio vago y reduce el cortisol.",
      details: "Siéntate erguido al borde de la cama. Mano izquierda en el corazón, derecha en el vientre. Inhala por nariz (4s), sostén (7s), exhala por boca (8s). Repite 6 veces.",
      duration: 180,
      icon: "wind",
      phase: "Fase 1: Preparación"
    },
    {
      id: "m2",
      title: "Anclaje por Visualización",
      description: "Implanta imágenes de tu día ideal.",
      details: "Cierra los ojos. Visualiza tu día con detalle: sin dolor, con claridad y energía. Siente la emoción de lograr tus 3 prioridades. La intensidad emocional es clave.",
      duration: 120,
      icon: "eye",
      phase: "Fase 2: Programación"
    },
    {
      id: "m3",
      title: "Impresión de la Intención",
      description: "Ancla nuevas vías neuronales verbalmente.",
      details: "Abre los ojos. Di tu intención en voz alta y presente (ej: 'Mi mente es aguda'). Repite 3 veces con convicción. Termina de pie con una respiración profunda.",
      duration: 120,
      icon: "mic",
      phase: "Fase 3: Ejecución"
    }
  ]
};

export const NIGHT_ROUTINE: Routine = {
  id: "night",
  name: "Ritual Nocturno",
  subtitle: "Y-Pun-Nun-Kaisen: reprograma tu mente mientras duermes.",
  totalMinutes: 4,
  steps: [
    {
      id: "n1",
      title: "Cocoro no Seiri",
      description: "Limpieza mental.",
      details: "Escribe a mano 3 pensamientos que te rondan la mente (preocupaciones, ideas, tareas). Esto libera espacio cognitivo y calma la amígdala, el centro del estrés.",
      duration: 60,
      icon: "pen-tool",
      phase: "Paso 1: Vaciar la mente"
    },
    {
      id: "n2",
      title: "Mokugyo no Shoten",
      description: "Foco en tu objetivo.",
      details: "Redacta una meta del día siguiente como si ya la hubieras cumplido. Ejemplo: 'He tenido una mañana productiva y llena de energía.' Activa centros de recompensa cerebral.",
      duration: 60,
      icon: "target",
      phase: "Paso 2: Programar mañana"
    },
    {
      id: "n3",
      title: "Shintai no Sei",
      description: "Respiración alineadora.",
      details: "Realiza 3 ciclos de respiración profunda: Inhala en 4 seg, retén en 7 seg, exhala en 8 seg. Estimula el nervio vago y activa el modo parasimpático (descanso, recuperación).",
      duration: 60,
      icon: "wind",
      phase: "Paso 3: Calmar el cuerpo"
    },
    {
      id: "n4",
      title: "Kanso Shukan",
      description: "Gratitud futura.",
      details: "Visualiza cómo te despiertas y cumples tu objetivo con gratitud. Esta técnica crea 'memorias prospectivas' que el subconsciente asimila como posibles.",
      duration: 60,
      icon: "sparkles",
      phase: "Paso 4: Sembrar el sueño"
    }
  ]
};

export function getRecommendedRoutine(): Routine {
  const hour = new Date().getHours();
  // Morning: 5am - 2pm (5-14), Night: 2pm - 5am (14-5)
  if (hour >= 5 && hour < 14) {
    return MORNING_ROUTINE;
  }
  return NIGHT_ROUTINE;
}

export function getOtherRoutine(current: Routine): Routine {
  return current.id === "morning" ? NIGHT_ROUTINE : MORNING_ROUTINE;
}
