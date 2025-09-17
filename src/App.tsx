import { useState, useEffect, useCallback } from 'react';
import type { SubstatType, TargetArtifact, MaterialUsage } from './types';
import { SUBSTATS } from './constants';
import {
  calculateExpRequirement,
  calculateMaterialUsage,
  calculateRequiredEnhances,
  applyExpGain,
  display,
} from './utils/calculator';

import { SubstatSelector } from './components/SubstatSelector';
import { ArtifactEnhancer } from './components/ArtifactEnhancer';
import { MaterialCalculator } from './components/MaterialCalculator';
import { TargetArtifactManager } from './components/TargetArtifactManager';

import './App.css';

function App() {
  const [selectedSubstats, setSelectedSubstats] = useState<SubstatType[]>(['CRIT_Rate', 'CRIT_DMG']);
  const [substatValues, setSubstatValues] = useState<{ [key: string]: number }>({});
  const [level, setLevel] = useState(4);
  const [exp, setExp] = useState(0);
  const [materialUsage, setMaterialUsage] = useState<MaterialUsage>({
    lv1: 0,
    lv2: 0,
    lv3: 0,
    lv4: 0,
    unc: 0,
    ess: 0,
  });
  const [enabledMaterials, setEnabledMaterials] = useState<{ [key: string]: boolean }>({
    lv1: true,
    lv2: true,
    lv3: true,
    lv4: true,
    unc: true,
    ess: true,
  });
  const [targetArtifacts, setTargetArtifacts] = useState<TargetArtifact[]>([]);
  const [expReq, setExpReq] = useState(0);
  const [expCap, setExpCap] = useState(0);
  const [givenExp, setGivenExp] = useState(0);

  // Initialize substat values when selected substats change
  useEffect(() => {
    const newValues: { [key: string]: number } = {};
    selectedSubstats.forEach(substat => {
      if (!(substat in substatValues)) {
        newValues[substat] = parseFloat(display((SUBSTATS[substat] / 8) * 0.9));
      } else {
        newValues[substat] = substatValues[substat];
      }
    });
    setSubstatValues(newValues);
  }, [selectedSubstats]);

  const calculate = useCallback(() => {
    const requiredEnhances = calculateRequiredEnhances(selectedSubstats, substatValues, targetArtifacts);
    const { expReq: calcExpReq, expCap: calcExpCap } = calculateExpRequirement(level, exp, requiredEnhances);

    setExpReq(calcExpReq);
    setExpCap(calcExpCap);

    const expGive = Math.min(calcExpReq, calcExpCap);
    const { usage, totalExp } = calculateMaterialUsage(expGive, enabledMaterials);

    setMaterialUsage(usage);
    setGivenExp(totalExp);
  }, [selectedSubstats, substatValues, level, exp, targetArtifacts, enabledMaterials]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const handleSubstatChange = (substats: SubstatType[]) => {
    setSelectedSubstats(substats);
    setTargetArtifacts([]);
  };

  const handleSubstatValueChange = (substat: string, value: number) => {
    setSubstatValues(prev => ({
      ...prev,
      [substat]: value,
    }));
  };

  const handleMaterialToggle = (material: string) => {
    setEnabledMaterials(prev => ({
      ...prev,
      [material]: !prev[material],
    }));
  };

  const handleExpGain = (multiplier: number) => {
    const totalGain = givenExp * multiplier;
    const result = applyExpGain(level, exp, totalGain);
    setLevel(result.level);
    setExp(result.exp);
  };

  const handleAddArtifacts = (artifacts: TargetArtifact[]) => {
    setTargetArtifacts(prev => [...prev, ...artifacts]);
  };

  const handleClearArtifacts = () => {
    setTargetArtifacts([]);
  };

  return (
    <div className="App">
      <SubstatSelector
        selectedSubstats={selectedSubstats}
        onSubstatChange={handleSubstatChange}
      />

      <div className="margin"></div>

      <ArtifactEnhancer
        level={level}
        exp={exp}
        selectedSubstats={selectedSubstats}
        substatValues={substatValues}
        onLevelChange={setLevel}
        onExpChange={setExp}
        onSubstatValueChange={handleSubstatValueChange}
      />

      <div className="margin"></div>

      <MaterialCalculator
        expReq={expReq}
        expCap={expCap}
        materialUsage={materialUsage}
        givenExp={givenExp}
        enabledMaterials={enabledMaterials}
        onMaterialToggle={handleMaterialToggle}
        onExpGain={handleExpGain}
      />

      <div className="margin"></div>

      <TargetArtifactManager
        selectedSubstats={selectedSubstats}
        targetArtifacts={targetArtifacts}
        onAddArtifacts={handleAddArtifacts}
        onClearArtifacts={handleClearArtifacts}
      />
    </div>
  );
}

export default App;
