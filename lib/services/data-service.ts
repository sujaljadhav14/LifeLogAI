import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppState,
  Activity,
  DailyCheckIn,
  Goal,
  Habit,
  JournalEntry,
  Meal,
  Workout,
  DailySummary,
} from '@/types';

const STORAGE_KEY = 'ai_life_tracker_data';

// Initialize empty app state
const emptyAppState: AppState = {
  checkIns: [],
  activities: [],
  habits: [],
  goals: [],
  meals: [],
  workouts: [],
  journalEntries: [],
  dailySummaries: [],
};

class DataService {
  private appState: AppState = emptyAppState;
  private listeners: Set<() => void> = new Set();

  async initialize() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.appState = JSON.parse(stored);
      } else {
        this.appState = emptyAppState;
        await this.save();
      }
    } catch (error) {
      console.error('Failed to initialize data service:', error);
      this.appState = emptyAppState;
    }
  }

  private async save() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.appState));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Check-in operations
  async addCheckIn(checkIn: Omit<DailyCheckIn, 'id' | 'createdAt'>): Promise<DailyCheckIn> {
    const newCheckIn: DailyCheckIn = {
      ...checkIn,
      id: `checkin_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.appState.checkIns.push(newCheckIn);
    await this.save();
    return newCheckIn;
  }

  getCheckInsByDate(date: string): DailyCheckIn[] {
    return this.appState.checkIns.filter(c => c.date === date);
  }

  async updateCheckIn(id: string, updates: Partial<DailyCheckIn>): Promise<void> {
    const index = this.appState.checkIns.findIndex(c => c.id === id);
    if (index !== -1) {
      this.appState.checkIns[index] = { ...this.appState.checkIns[index], ...updates };
      await this.save();
    }
  }

  // Activity operations
  async addActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.appState.activities.push(newActivity);
    await this.save();
    return newActivity;
  }

  getActivitiesByDate(date: string): Activity[] {
    return this.appState.activities.filter(a => a.date === date).sort((a, b) => a.time.localeCompare(b.time));
  }

  async deleteActivity(id: string): Promise<void> {
    this.appState.activities = this.appState.activities.filter(a => a.id !== id);
    await this.save();
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<void> {
    const index = this.appState.activities.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appState.activities[index] = { ...this.appState.activities[index], ...updates };
      await this.save();
    }
  }

  // Habit operations
  async addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>): Promise<Habit> {
    const newHabit: Habit = {
      ...habit,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    this.appState.habits.push(newHabit);
    await this.save();
    return newHabit;
  }

  getAllHabits(): Habit[] {
    return this.appState.habits;
  }

  async deleteHabit(id: string): Promise<void> {
    this.appState.habits = this.appState.habits.filter(h => h.id !== id);
    await this.save();
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
    const index = this.appState.habits.findIndex(h => h.id === id);
    if (index !== -1) {
      this.appState.habits[index] = { ...this.appState.habits[index], ...updates };
      await this.save();
    }
  }

  async toggleHabitCompletion(habitId: string, date: string): Promise<void> {
    const habit = this.appState.habits.find(h => h.id === habitId);
    if (habit) {
      const index = habit.completedDates.indexOf(date);
      if (index !== -1) {
        habit.completedDates.splice(index, 1);
      } else {
        habit.completedDates.push(date);
      }
      await this.save();
    }
  }

  isHabitCompletedOnDate(habitId: string, date: string): boolean {
    const habit = this.appState.habits.find(h => h.id === habitId);
    return habit ? habit.completedDates.includes(date) : false;
  }

  getHabitStreak(habitId: string): number {
    const habit = this.appState.habits.find(h => h.id === habitId);
    if (!habit || habit.completedDates.length === 0) return 0;

    const sortedDates = habit.completedDates.sort().reverse();
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    for (const dateStr of sortedDates) {
      const completedDate = new Date(dateStr);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - streak);

      if (this.isSameDay(completedDate, expectedDate)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  getHabitWeekProgress(habitId: string): boolean[] {
    const habit = this.appState.habits.find(h => h.id === habitId);
    const progress: boolean[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      progress.push(habit?.completedDates.includes(dateStr) ?? false);
    }

    return progress;
  }

  // Goal operations
  async addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.appState.goals.push(newGoal);
    await this.save();
    return newGoal;
  }

  getAllGoals(): Goal[] {
    return this.appState.goals;
  }

  getGoalsByType(type: 'short-term' | 'long-term'): Goal[] {
    return this.appState.goals.filter(g => g.type === type);
  }

  async deleteGoal(id: string): Promise<void> {
    this.appState.goals = this.appState.goals.filter(g => g.id !== id);
    await this.save();
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    const index = this.appState.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      this.appState.goals[index] = { ...this.appState.goals[index], ...updates };
      await this.save();
    }
  }

  // Meal operations
  async addMeal(meal: Omit<Meal, 'id' | 'createdAt'>): Promise<Meal> {
    const newMeal: Meal = {
      ...meal,
      id: `meal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.appState.meals.push(newMeal);
    await this.save();
    return newMeal;
  }

  getMealsByDate(date: string): Meal[] {
    return this.appState.meals.filter(m => m.date === date).sort((a, b) => a.time.localeCompare(b.time));
  }

  async deleteMeal(id: string): Promise<void> {
    this.appState.meals = this.appState.meals.filter(m => m.id !== id);
    await this.save();
  }

  async updateMeal(id: string, updates: Partial<Meal>): Promise<void> {
    const index = this.appState.meals.findIndex(m => m.id === id);
    if (index !== -1) {
      this.appState.meals[index] = { ...this.appState.meals[index], ...updates };
      await this.save();
    }
  }

  // Workout operations
  async addWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    const newWorkout: Workout = {
      ...workout,
      id: `workout_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.appState.workouts.push(newWorkout);
    await this.save();
    return newWorkout;
  }

  getWorkoutsByDate(date: string): Workout[] {
    return this.appState.workouts.filter(w => w.date === date).sort((a, b) => a.time.localeCompare(b.time));
  }

  async deleteWorkout(id: string): Promise<void> {
    this.appState.workouts = this.appState.workouts.filter(w => w.id !== id);
    await this.save();
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<void> {
    const index = this.appState.workouts.findIndex(w => w.id === id);
    if (index !== -1) {
      this.appState.workouts[index] = { ...this.appState.workouts[index], ...updates };
      await this.save();
    }
  }

  // Journal operations
  async addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.appState.journalEntries.push(newEntry);
    await this.save();
    return newEntry;
  }

  getJournalEntryByDate(date: string): JournalEntry | undefined {
    return this.appState.journalEntries.find(e => e.date === date);
  }

  getAllJournalEntries(): JournalEntry[] {
    return this.appState.journalEntries.sort((a, b) => b.date.localeCompare(a.date));
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<void> {
    const index = this.appState.journalEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      this.appState.journalEntries[index] = {
        ...this.appState.journalEntries[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await this.save();
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    this.appState.journalEntries = this.appState.journalEntries.filter(e => e.id !== id);
    await this.save();
  }

  // Daily summary operations
  async addDailySummary(summary: Omit<DailySummary, 'id' | 'generatedAt'>): Promise<DailySummary> {
    const newSummary: DailySummary = {
      ...summary,
      id: `summary_${Date.now()}`,
      generatedAt: new Date().toISOString(),
    };
    this.appState.dailySummaries.push(newSummary);
    await this.save();
    return newSummary;
  }

  getDailySummaryByDate(date: string): DailySummary | undefined {
    return this.appState.dailySummaries.find(s => s.date === date);
  }

  // Utility
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async clearAllData(): Promise<void> {
    this.appState = emptyAppState;
    await this.save();
  }
}

export const dataService = new DataService();
