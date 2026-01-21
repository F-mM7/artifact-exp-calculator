import React from 'react';
import type { MaterialUsage } from '../types';
import { MATERIALS, FACTOR } from '../constants';

interface MaterialCalculatorProps {
  expReq: number;
  expCap: number;
  materialUsage: MaterialUsage;
  givenExp: number;
  enabledMaterials: { [key: string]: boolean };
  capDivisor: number;
  targetLevel: number | 'auto';
  maxLevel: number;
  onMaterialToggle: (material: string) => void;
  onExpGain: (multiplier: number) => void;
  onCapDivisorChange: (divisor: number) => void;
  onTargetLevelChange: (level: number | 'auto') => void;
}

const TARGET_LEVELS = ['auto', 4, 8, 12, 16, 20] as const;

export const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({
  expReq,
  expCap,
  materialUsage,
  givenExp,
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
          <tr>
            <th>exp req</th>
            <td>{expReq}</td>
          </tr>
          <tr>
            <th>exp cap</th>
            <td>{expCap}</td>
          </tr>
          <tr>
            <th>cap divisor</th>
            <td>
              <select
                value={capDivisor}
                onChange={(e) => onCapDivisorChange(Number(e.target.value))}
              >
                <option value={1}>÷1</option>
                <option value={2}>÷2</option>
                <option value={5}>÷5</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>target level</th>
            <td>
              <div className="target-level-buttons">
                {TARGET_LEVELS.map((level) => {
                  const isDisabled = typeof level === 'number' && level > maxLevel;
                  const isActive = targetLevel === level;
                  return (
                    <button
                      key={level}
                      className={isActive ? 'active' : ''}
                      disabled={isDisabled}
                      onClick={() => onTargetLevelChange(level)}
                    >
                      {level === 'auto' ? '自動' : level}
                    </button>
                  );
                })}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table id="mat">
        <tbody>
          {Object.entries(MATERIALS).map(([material, _]) => (
            <tr key={material}>
              <td>
                <input
                  type="checkbox"
                  checked={enabledMaterials[material] || false}
                  onChange={() => onMaterialToggle(material)}
                />
              </td>
              <td>{material}</td>
              <td>{materialUsage[material as keyof MaterialUsage]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <input id="given" value={givenExp} readOnly />
      {FACTOR.map((factor) => (
        <button
          key={factor}
          onClick={() => onExpGain(factor)}
        >
          x{factor}
        </button>
      ))}
    </div>
  );
};