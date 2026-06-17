const STORAGE_KEY = 'trapstep_progress';

export interface LevelProgress {
  completed: boolean;
  bestTime: number;
  stars: number;
  deaths: number;
}

export interface GameProgress {
  [levelId: number]: LevelProgress;
}

export function getProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return {};
}

export function saveProgress(levelId: number, progress: LevelProgress): void {
  try {
    const current = getProgress();
    current[levelId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
}

export function getTotalLevels(): number {
  // This matches the number of levels in levels.ts
  return 20;
}
