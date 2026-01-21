import { useState, useEffect, useCallback } from 'react';
import type { SubstatType, TargetArtifact, MaterialUsage, ArtifactRarity } from './types';
import { SUBSTATS, MAX_LEVEL_5STAR, MAX_LEVEL_4STAR } from './constants';
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
  const [rarity, setRarity] = useState<ArtifactRarity>(5);
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
  const [capDivisor, setCapDivisor] = useState(2);
  const [useManualTargetLevel, setUseManualTargetLevel] = useState(false);
  const [manualTargetLevel, setManualTargetLevel] = useState(8);

  const maxLevel = rarity === 5 ? MAX_LEVEL_5STAR : MAX_LEVEL_4STAR;

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
    const targetLevel = useManualTargetLevel ? manualTargetLevel : undefined;
    const { expReq: calcExpReq, expCap: calcExpCap } = calculateExpRequirement(level, exp, requiredEnhances, capDivisor, targetLevel, rarity);

    setExpReq(calcExpReq);
    setExpCap(calcExpCap);

    const expGive = Math.min(calcExpReq, calcExpCap);
    const { usage, totalExp } = calculateMaterialUsage(expGive, enabledMaterials);

    setMaterialUsage(usage);
    setGivenExp(totalExp);
  }, [selectedSubstats, substatValues, level, exp, targetArtifacts, enabledMaterials, capDivisor, useManualTargetLevel, manualTargetLevel, rarity]);

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

  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    // レベルが変更されたら、手動目標レベルも更新
    if (!useManualTargetLevel) {
      const nextMultipleOf4 = Math.ceil((newLevel + 1) / 4) * 4;
      setManualTargetLevel(Math.min(20, nextMultipleOf4));
    }
  };

  const handleMaterialToggle = (material: string) => {
    setEnabledMaterials(prev => ({
      ...prev,
      [material]: !prev[material],
    }));
  };

  const handleExpGain = (multiplier: number) => {
    const totalGain = givenExp * multiplier;
    const result = applyExpGain(level, exp, totalGain, rarity);
    setLevel(result.level);
    setExp(result.exp);
  };

  const handleRarityChange = (newRarity: ArtifactRarity) => {
    setRarity(newRarity);
    const newMaxLevel = newRarity === 5 ? MAX_LEVEL_5STAR : MAX_LEVEL_4STAR;
    // Reset level if it exceeds new max
    if (level > newMaxLevel) {
      setLevel(newMaxLevel);
    }
    // Adjust manual target level if needed
    if (manualTargetLevel > newMaxLevel) {
      setManualTargetLevel(newMaxLevel);
    }
    // Clear target artifacts as they're not supported for 4-star
    if (newRarity === 4) {
      setTargetArtifacts([]);
    }
  };

  const handleAddArtifacts = (artifacts: TargetArtifact[]) => {
    setTargetArtifacts(prev => [...prev, ...artifacts]);
  };

  const handleClearArtifacts = () => {
    setTargetArtifacts([]);
  };

  return (
    <div className="App">
      <div className="rarity-buttons">
        <label>Rarity: </label>
        <button
          className={rarity === 5 ? 'active' : ''}
          onClick={() => handleRarityChange(5)}
        >
          ★5
        </button>
        <button
          className={rarity === 4 ? 'active' : ''}
          onClick={() => handleRarityChange(4)}
        >
          ★4
        </button>
      </div>

      <div className="margin"></div>

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
        maxLevel={maxLevel}
        onLevelChange={handleLevelChange}
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
        capDivisor={capDivisor}
        useManualTargetLevel={useManualTargetLevel}
        manualTargetLevel={manualTargetLevel}
        maxLevel={maxLevel}
        onMaterialToggle={handleMaterialToggle}
        onExpGain={handleExpGain}
        onCapDivisorChange={setCapDivisor}
        onManualTargetLevelToggle={setUseManualTargetLevel}
        onManualTargetLevelChange={setManualTargetLevel}
      />

      <div className="margin"></div>

      <div style={{ visibility: rarity === 5 ? 'visible' : 'hidden' }}>
        <TargetArtifactManager
          selectedSubstats={selectedSubstats}
          targetArtifacts={targetArtifacts}
          onAddArtifacts={handleAddArtifacts}
          onClearArtifacts={handleClearArtifacts}
        />
      </div>
    </div>
  );
}

export default App;
