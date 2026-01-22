import React from 'react';
import type { MaterialUsage } from '../types';

import { TargetLevelSelector } from './TargetLevelSelector';
import { CapDivisorSelector } from './CapDivisorSelector';
import { MaterialUsageDisplay } from './MaterialUsageDisplay';

interface MaterialCalculatorProps {
  expReq: number;
  expCap: number;
  materialUsage: MaterialUsage;
  givenExp: number;
  futureMaterialUsages: MaterialUsage[];
  enabledMaterials: { [key: string]: boolean };
  capDivisor: number;
  targetLevel: number | 'auto';
  maxLevel: number;
  onMaterialToggle: (material: string) => void;
  onExpGain: (multiplier: number) => void;
  onCapDivisorChange: (divisor: number) => void;
  onTargetLevelChange: (level: number | 'auto') => void;
}

export const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({
  expReq,
  expCap,
  materialUsage,
  givenExp,
  futureMaterialUsages,
  enabledMaterials,
  capDivisor,
  targetLevel,
  maxLevel,
  onMaterialToggle,
  onExpGain,
  onCapDivisorChange,
  onTargetLevelChange,
}) => {
  return (
    <div>
      <table>
        <tbody>
          <TargetLevelSelector
            targetLevel={targetLevel}
            maxLevel={maxLevel}
            onTargetLevelChange={onTargetLevelChange}
          />
          <tr>
            <th>exp req</th>
            <td>{expReq}</td>
          </tr>
          <tr>
            <th>exp cap</th>
            <td>{expCap}</td>
          </tr>
          <CapDivisorSelector
            capDivisor={capDivisor}
            onCapDivisorChange={onCapDivisorChange}
          />
        </tbody>
      </table>
      <MaterialUsageDisplay
        materialUsage={materialUsage}
        givenExp={givenExp}
        futureMaterialUsages={futureMaterialUsages}
        enabledMaterials={enabledMaterials}
        onMaterialToggle={onMaterialToggle}
        onExpGain={onExpGain}
      />
    </div>
  );
};
