import { useState, useCallback } from 'react';
import type { ArtifactRarity } from '../types';
import { MAX_LEVEL_5STAR, MAX_LEVEL_4STAR } from '../constants';

export function useArtifactState() {
  const [rarity, setRarity] = useState<ArtifactRarity>(5);
  const [level, setLevel] = useState(0);
  const [exp, setExp] = useState(0);

  const maxLevel = rarity === 5 ? MAX_LEVEL_5STAR : MAX_LEVEL_4STAR;

  const reset = useCallback(() => {
    setLevel(0);
    setExp(0);
  }, []);

  const handleRarityChange = useCallback((newRarity: ArtifactRarity) => {
    setRarity(newRarity);
    const newMaxLevel = newRarity === 5 ? MAX_LEVEL_5STAR : MAX_LEVEL_4STAR;
    setLevel(prev => Math.min(prev, newMaxLevel));
  }, []);

  const handleLevelChange = useCallback((newLevel: number) => {
    setLevel(Math.min(newLevel, maxLevel));
  }, [maxLevel]);

  return {
    rarity,
    level,
    exp,
    maxLevel,
    setRarity: handleRarityChange,
    setLevel: handleLevelChange,
    setExp,
    reset,
  };
}
