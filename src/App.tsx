import { useState, useCallback } from 'react';
import type { SubstatType, TargetArtifact, ArtifactRarity, MaterialToggleState, MaterialType } from './types';
import { MAX_LEVEL_5STAR, MAX_LEVEL_4STAR } from './constants';
import { applyExpGain } from './utils/calculator';

import { useArtifactState } from './hooks/useArtifactState';
import { useSubstatManager } from './hooks/useSubstatManager';
import { useMaterialCalculation } from './hooks/useMaterialCalculation';

import { SubstatSelector } from './components/SubstatSelector';
import { ArtifactEnhancer } from './components/ArtifactEnhancer';
import { MaterialCalculator } from './components/MaterialCalculator';
import { TargetArtifactManager } from './components/TargetArtifactManager';

import './App.css';

function App() {
  const {
    rarity,
    level,
    exp,
    maxLevel,
    setRarity,
    setLevel,
    setExp,
    reset,
  } = useArtifactState();

  const {
    selectedSubstats,
    substatValues,
    setSelectedSubstats,
    setSubstatValues,
  } = useSubstatManager();

  const [enabledMaterials, setEnabledMaterials] = useState<MaterialToggleState>({
    lv1: true,
    lv2: true,
    lv3: true,
    lv4: true,
    unc: true,
    ess: false,
  });
  const [targetArtifacts, setTargetArtifacts] = useState<TargetArtifact[]>([]);
  const [capDivisor, setCapDivisor] = useState(2);
  const [targetLevel, setTargetLevel] = useState<number | 'auto'>('auto');

  const {
    materialUsage,
    expReq,
    expCap,
    givenExp,
    futureMaterialUsages,
  } = useMaterialCalculation({
    selectedSubstats,
    substatValues,
    level,
    exp,
    targetArtifacts,
    enabledMaterials,
    capDivisor,
    targetLevel,
    rarity,
  });

  const handleSubstatChange = useCallback((substats: SubstatType[]) => {
    setSelectedSubstats(substats);
    setTargetArtifacts([]);
  }, [setSelectedSubstats]);

  const handleMaterialToggle = useCallback((material: string) => {
    const key = material as MaterialType;
    setEnabledMaterials(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleExpGain = useCallback((multiplier: number) => {
    const totalGain = givenExp * multiplier;
    const result = applyExpGain(level, exp, totalGain, rarity);
    setLevel(result.level);
    setExp(result.exp);
  }, [givenExp, level, exp, rarity, setLevel, setExp]);

  const handleRarityChange = useCallback((newRarity: ArtifactRarity) => {
    setRarity(newRarity);
    const newMaxLevel = newRarity === 5 ? MAX_LEVEL_5STAR : MAX_LEVEL_4STAR;
    if (typeof targetLevel === 'number' && targetLevel > newMaxLevel) {
      setTargetLevel('auto');
    }
    if (newRarity === 4) {
      setTargetArtifacts([]);
    }
  }, [setRarity, targetLevel]);

  const handleAddArtifacts = useCallback((artifacts: TargetArtifact[]) => {
    setTargetArtifacts(prev => [...prev, ...artifacts]);
  }, []);

  const handleClearArtifacts = useCallback(() => {
    setTargetArtifacts([]);
  }, []);

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
        onLevelChange={setLevel}
        onExpChange={setExp}
        onSubstatValueChange={setSubstatValues}
        onReset={reset}
      />

      <div className="margin"></div>

      <MaterialCalculator
        expReq={expReq}
        expCap={expCap}
        materialUsage={materialUsage}
        givenExp={givenExp}
        futureMaterialUsages={futureMaterialUsages}
        enabledMaterials={enabledMaterials}
        capDivisor={capDivisor}
        targetLevel={targetLevel}
        maxLevel={maxLevel}
        onMaterialToggle={handleMaterialToggle}
        onExpGain={handleExpGain}
        onCapDivisorChange={setCapDivisor}
        onTargetLevelChange={setTargetLevel}
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
