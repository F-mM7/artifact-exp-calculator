import type { SubstatValues, MaterialValues } from '../types';

export const SUBSTATS: SubstatValues = {
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
  0, 2400, 5375, 8925, 13050, 17750, 23100, 29100, 35775, 43125, 51150, 59875,
  69300, 79425, 90275, 102875, 122675,
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