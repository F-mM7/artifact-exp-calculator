import type { SubstatType, MaterialUsage, TargetArtifact } from '../types';
import { SUBSTATS, CUM_EXP, MATERIALS, MAX_MATERIALS } from '../constants';

export function display(x: number): string {
  return (Math.round(x * 10) / 10).toFixed(1);
}

export function enumerateArrays(n: number, m: number): number[][] {
  const result: number[][] = [];

  function generateArray(currentArray: number[]): void {
    if (currentArray.length === n) {
      result.push([...currentArray]);
      return;
    }

    for (let i = 0; i < m; i++) {
      currentArray.push(i);
      generateArray(currentArray);
      currentArray.pop();
    }
  }

  generateArray([]);
  return result;
}

export function calculateExpRequirement(
  currentLevel: number,
  currentExp: number,
  requiredEnhances: number
): { expReq: number; expCap: number } {
  const targetLevel = Math.min(20, (6 - requiredEnhances) * 4);
  const totalCurrentExp = currentExp + CUM_EXP[currentLevel];
  const targetExp = CUM_EXP[Math.max(targetLevel, currentLevel)];

  const expReq = targetExp - totalCurrentExp;
  const expCap = (CUM_EXP[20] - totalCurrentExp) / 2;

  return { expReq, expCap };
}

export function calculateMaterialUsage(
  expNeeded: number,
  enabledMaterials: { [key: string]: boolean }
): { usage: MaterialUsage; totalExp: number } {
  let minCost = 280001;
  let bestUsage: MaterialUsage = {
    lv1: 0,
    lv2: 0,
    lv3: 0,
    lv4: 0,
    unc: 0,
    ess: 0,
  };

  for (let n4 = MAX_MATERIALS; n4 >= 0; --n4) {
    for (let n3 = MAX_MATERIALS - n4; n3 >= 0; --n3) {
      for (let n2 = MAX_MATERIALS - n4 - n3; n2 >= 0; --n2) {
        for (let n1 = MAX_MATERIALS - n4 - n3 - n2; n1 >= 0; --n1) {
          for (let useEss = 1; useEss >= 0; --useEss) {
            for (let useUnc = 0; useUnc < 2; ++useUnc) {
              if (n4 && !enabledMaterials.lv4) continue;
              if (n3 && !enabledMaterials.lv3) continue;
              if (n2 && !enabledMaterials.lv2) continue;
              if (n1 && !enabledMaterials.lv1) continue;
              if (useEss && !enabledMaterials.ess) continue;
              if (useUnc && !enabledMaterials.unc) continue;
              if (n1 + n2 + n3 + n4 + useEss + useUnc > MAX_MATERIALS) continue;

              let totalExp = 0;
              totalExp += n4 * MATERIALS.lv4;
              totalExp += n3 * MATERIALS.lv3;
              totalExp += n2 * MATERIALS.lv2;
              totalExp += n1 * MATERIALS.lv1;

              const usage: MaterialUsage = {
                lv4: n4,
                lv3: n3,
                lv2: n2,
                lv1: n1,
                ess: 0,
                unc: 0,
              };

              if (useUnc) {
                usage.unc = Math.max(Math.ceil((expNeeded - totalExp) / MATERIALS.unc), 0);
                totalExp += usage.unc * MATERIALS.unc;
                if (useEss) {
                  usage.ess = Math.floor(usage.unc / 4);
                  usage.unc = usage.unc % 4;
                }
              } else if (useEss) {
                usage.ess = Math.max(Math.ceil((expNeeded - totalExp) / MATERIALS.ess), 0);
                totalExp += usage.ess * MATERIALS.ess;
              }

              if (totalExp < expNeeded) continue;
              if (totalExp < minCost) {
                minCost = totalExp;
                bestUsage = usage;
              }
            }
          }
        }
      }
    }
  }

  return { usage: bestUsage, totalExp: minCost };
}

export function calculateRequiredEnhances(
  selectedSubstats: SubstatType[],
  substatValues: { [key: string]: number },
  targetArtifacts: TargetArtifact[]
): number {
  let minEnhances = 100;
  const arrays = enumerateArrays(selectedSubstats.length, 6);

  for (const enhanceArray of arrays) {
    const newValues: number[] = [];

    for (let i = 0; i < selectedSubstats.length; i++) {
      const substat = selectedSubstats[i];
      newValues[i] = substatValues[substat] + (SUBSTATS[substat] / 8) * enhanceArray[i];
    }

    let isInferior = false;
    for (const target of targetArtifacts) {
      let isSuperior = false;
      for (let i = 0; i < selectedSubstats.length; i++) {
        if (newValues[i] > target.val[i]) {
          isSuperior = true;
          break;
        }
      }
      if (!isSuperior) {
        isInferior = true;
        break;
      }
    }

    const totalEnhances = enhanceArray.reduce((sum, x) => sum + x, 0);

    if (!isInferior && totalEnhances < minEnhances) {
      minEnhances = totalEnhances;
    }
  }

  return minEnhances;
}

export function applyExpGain(
  currentLevel: number,
  currentExp: number,
  expGain: number
): { level: number; exp: number } {
  let level = currentLevel;
  let exp = currentExp + CUM_EXP[level] + expGain;

  while (level < 20 && CUM_EXP[level + 1] <= exp) {
    level++;
  }

  return {
    level,
    exp: exp - CUM_EXP[level],
  };
}