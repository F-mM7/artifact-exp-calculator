import { useState, useEffect, useCallback } from 'react';
import type { SubstatType, SubstatValuesStrict } from '../types';
import { CALCULATION_CONSTANTS } from '../constants';
import { display, calculateSubstatValue } from '../utils/calculator';

export function useSubstatManager() {
  const [selectedSubstats, setSelectedSubstats] = useState<SubstatType[]>(['CRIT_Rate', 'CRIT_DMG']);
  const [substatValues, setSubstatValues] = useState<SubstatValuesStrict>({});

  // Initialize substat values when selected substats change
  useEffect(() => {
    const newValues: SubstatValuesStrict = {};
    selectedSubstats.forEach(substat => {
      if (!(substat in substatValues)) {
        newValues[substat] = parseFloat(display(calculateSubstatValue(substat, CALCULATION_CONSTANTS.HIGH_ROLL_MULTIPLIER)));
      } else {
        newValues[substat] = substatValues[substat];
      }
    });
    setSubstatValues(newValues);
  }, [selectedSubstats]);

  const handleSubstatValueChange = useCallback((substat: string, value: number) => {
    setSubstatValues(prev => ({
      ...prev,
      [substat]: value,
    }));
  }, []);

  return {
    selectedSubstats,
    substatValues,
    setSelectedSubstats,
    setSubstatValues: handleSubstatValueChange,
  };
}
