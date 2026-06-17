export type GameMode = 'single' | 'coop' | 'race';

export interface GameData {
  level: number;
  mode: GameMode;
}
