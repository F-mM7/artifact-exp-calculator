import { useState, useEffect, useCallback } from 'react';
import type { SubstatType, TargetArtifact, MaterialUsage, ArtifactRarity, MaterialToggleState, SubstatValuesStrict } from '../types';
import {
  calculateExpRequirement,
  calculateMaterialUsage,
  calculateRequiredEnhances,
  applyExpGain,
} from '../utils/calculator';

interface UseMaterialCalculationParams {
  selectedSubstats: SubstatType[];
  substatValues: SubstatValuesStrict;
  level: number;
  exp: number;
  targetArtifacts: TargetArtifact[];
  enabledMaterials: MaterialToggleState;
  capDivisor: number;
  targetLevel: number | 'auto';
  rarity: ArtifactRarity;
}

export function useMaterialCalculation(params: UseMaterialCalculationParams) {
  const {
    selectedSubstats,
    substatValues,
    level,
    exp,
    targetArtifacts,
    enabledMaterials,
    capDivisor,
    targetLevel,
    rarity,
  } = params;

  const [materialUsage, setMaterialUsage] = useState<MaterialUsage>({
    lv1: 0,
    lv2: 0,
    lv3: 0,
    lv4: 0,
    unc: 0,
    ess: 0,
  });
  const [expReq, setExpReq] = useState(0);
  const [expCap, setExpCap] = useState(0);
  const [givenExp, setGivenExp] = useState(0);
  const [futureMaterialUsages, setFutureMaterialUsages] = useState<MaterialUsage[]>([]);

  const calculate = useCallback(() => {
    const requiredEnhances = calculateRequiredEnhances(selectedSubstats, substatValues, targetArtifacts);
    const manualTargetLevel = targetLevel === 'auto' ? undefined : targetLevel;
    const { expReq: calcExpReq, expCap: calcExpCap } = calculateExpRequirement(
      level, exp, requiredEnhances, capDivisor, manualTargetLevel, rarity
    );

    setExpReq(calcExpReq);
    setExpCap(calcExpCap);

    const expGive = Math.min(calcExpReq, calcExpCap);
    const { usage, totalExp } = calculateMaterialUsage(expGive, enabledMaterials);

    setMaterialUsage(usage);
    setGivenExp(totalExp);

    // Calculate future material usages
    const futureUsages: MaterialUsage[] = [];
    let currentState = { level, exp };
    let currentTotalExp = totalExp;

    while (currentTotalExp > 0) {
      const nextState = applyExpGain(currentState.level, currentState.exp, currentTotalExp, rarity);
      const { expReq: nextExpReq, expCap: nextExpCap } = calculateExpRequirement(
        nextState.level, nextState.exp, requiredEnhances, capDivisor, manualTargetLevel, rarity
      );
      const nextExpGive = Math.min(nextExpReq, nextExpCap);

      if (nextExpGive <= 0) break;

      const { usage: nextUsage, totalExp: nextTotalExp } = calculateMaterialUsage(nextExpGive, enabledMaterials);
      futureUsages.push(nextUsage);

      currentState = nextState;
      currentTotalExp = nextTotalExp;
    }

    setFutureMaterialUsages(futureUsages);
  }, [selectedSubstats, substatValues, level, exp, targetArtifacts, enabledMaterials, capDivisor, targetLevel, rarity]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return {
    materialUsage,
    expReq,
    expCap,
    givenExp,
    futureMaterialUsages,
    recalculate: calculate,
  };
}
