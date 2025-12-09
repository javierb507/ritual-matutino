import { useState, useEffect } from "react";

export interface DiaryEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  completed: boolean;
  commentary?: string;
  mood?: "great" | "good" | "neutral" | "bad";
  routineType: "morning" | "night";
}

const STORAGE_KEY = "ritual_diary_entries";

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: add routineType if missing
        const migrated = parsed.map((e: any) => ({
          ...e,
          routineType: e.routineType || "morning"
        }));
        setEntries(migrated);
      } catch (e) {
        console.error("Failed to parse diary entries", e);
      }
    }
  }, []);

  const addEntry = (entry: Omit<DiaryEntry, "id" | "timestamp" | "dateStr">) => {
    const now = new Date();
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: now.getTime(),
      dateStr: now.toISOString().split("T")[0],
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  };

  const getEntryByDate = (dateStr: string) => {
    return entries.find((e) => e.dateStr === dateStr);
  };

  const getStreak = (routineType: "morning" | "night") => {
    let streak = 0;
    const sorted = [...entries]
      .filter(e => e.routineType === routineType)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    const hasToday = sorted.some(e => e.dateStr === today);
    const hasYesterday = sorted.some(e => e.dateStr === yesterday);

    if (!hasToday && !hasYesterday && sorted.length > 0) return 0;

    let current = new Date();
    if (!hasToday) {
       current.setDate(current.getDate() - 1);
    }

    while (true) {
      const dateStr = current.toISOString().split("T")[0];
      const hasEntry = sorted.some(e => e.dateStr === dateStr);
      if (hasEntry) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getTodayMinutes = (routineType: "morning" | "night") => {
    const today = new Date().toISOString().split("T")[0];
    const todayEntries = entries.filter(e => e.dateStr === today && e.routineType === routineType);
    return todayEntries.length * (routineType === "morning" ? 7 : 4);
  };

  return { entries, addEntry, getEntryByDate, getStreak, getTodayMinutes };
}
