import type { SubstatValues, MaterialValues } from '../types';

export const SUBSTATS: SubstatValues = {
  DEF: 58.3,
  Energy_Recharge: 51.8,
  CRIT_Rate: 31.1,
  CRIT_DMG: 62.2,
};

export const CUM_EXP = [
  0, 3000, 6725, 11150, 16300, 22200, 28875, 36375, 44725, 53950, 64075, 75125,
  87150, 100175, 115325, 132925, 153300, 176800, 203850, 234900, 270475,
];

export const MATERIALS: MaterialValues = {
  lv1: 420,
  lv2: 840,
  lv3: 1260,
  lv4: 2520,
  unc: 2500,
  ess: 10000,
};

export const FACTOR = [1, 2, 5];

export const MAX_LEVEL = 20;
export const MAX_EXP = 35574;
export const MAX_MATERIALS = 15;