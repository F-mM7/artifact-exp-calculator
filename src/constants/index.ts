import type { SubstatValues, MaterialValues } from "../types";

export const SUBSTATS: SubstatValues = {
  Elemental_Mastery: 187,
  DEF: 58.3,
  Energy_Recharge: 51.8,
  CRIT_Rate: 31.1,
  CRIT_DMG: 62.2,
};

// 5-star artifact cumulative exp (level 0-20)
export const CUM_EXP_5STAR = [
  0, 3000, 6725, 11150, 16300, 22200, 28875, 36375, 44725, 53950, 64075, 75125,
  87150, 100175, 115325, 132925, 153300, 176800, 203850, 234900, 270475,
];

// 4-star artifact cumulative exp (level 0-16)
export const CUM_EXP_4STAR = [
  0, 2400, 5375, 8925, 13050, 17775, 23125, 29125, 35800, 43175, 51275, 60125,
  69750, 80175, 92300, 106375, 122675,
];

// Legacy alias for backward compatibility
export const CUM_EXP = CUM_EXP_5STAR;

export const MATERIALS: MaterialValues = {
  lv1: 420,
  lv2: 840,
  lv3: 1260,
  lv4: 2520,
  unc: 2500,
  ess: 10000,
};

export const FACTOR = [1, 2, 5];

export const MAX_LEVEL_5STAR = 20;
export const MAX_LEVEL_4STAR = 16;
export const MAX_LEVEL = 20; // Legacy alias
export const MAX_EXP = 35574;
export const MAX_MATERIALS = 15;

// Calculation constants (extracted magic numbers)
export const CALCULATION_CONSTANTS = {
  MAX_ENHANCEMENTS: 6, // Maximum number of substat enhancements
  SUBSTAT_DIVISOR: 8, // Divisor for substat value calculations
  HIGH_ROLL_MULTIPLIER: 0.9, // Multiplier for high roll estimation
  LOW_ROLL_MULTIPLIER: 0.85, // Multiplier for low roll estimation
  MAX_MATERIAL_COST: 280001, // Upper bound for material cost optimization
  AUTO_LEVEL_OFFSET: 4, // Multiplier for auto target level calculation
} as const;
