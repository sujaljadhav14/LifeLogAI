// Core data types for AI Life Tracker

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = number; // 1-10

export interface DailyCheckIn {
  id: string;
  date: string; // ISO date string
  type: 'morning' | 'evening';
  mood: MoodLevel;
  energy: EnergyLevel;
  sleepDuration: number; // hours
  weight?: number; // kg/lbs
  mainFocus: string;
  notes?: string;
  createdAt: string;
}

export type ActivityCategory = 'workout' | 'meal' | 'study' | 'work' | 'reading' | 'walking' | 'meditation' | 'custom';

export interface Activity {
  id: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  category: ActivityCategory;
  customCategory?: string; // for 'custom' category
  notes?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings
}

export interface HabitCompletion {
  habitId: string;
  date: string; // ISO date string
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'short-term' | 'long-term';
  deadline: string; // ISO date string
  progress: number; // 0-100
  status: 'on-track' | 'at-risk' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface Meal {
  id: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  name: string;
  calories?: number;
  protein?: number; // grams
  notes?: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  exercise: string;
  duration: number; // minutes
  setsReps?: string; // e.g., "3x10"
  notes?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummary {
  id: string;
  date: string; // ISO date string
  activitiesCompleted: number;
  habitsCompleted: number;
  habitsMissed: number;
  workoutSummary: string;
  mealSummary: string;
  goalProgress: string;
  productivityOverview: string;
  encouragingObservation: string;
  suggestions: string[]; // 3 suggestions
  generatedAt: string;
}

export interface AppState {
  checkIns: DailyCheckIn[];
  activities: Activity[];
  habits: Habit[];
  goals: Goal[];
  meals: Meal[];
  workouts: Workout[];
  journalEntries: JournalEntry[];
  dailySummaries: DailySummary[];
}
