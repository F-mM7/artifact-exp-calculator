import React from 'react';
import type { SubstatType } from '../types';
import { SUBSTATS } from '../constants';
import { display } from '../utils/calculator';

interface ArtifactEnhancerProps {
  level: number;
  exp: number;
  selectedSubstats: SubstatType[];
  substatValues: { [key: string]: number };
  maxLevel: number;
  onLevelChange: (level: number) => void;
  onExpChange: (exp: number) => void;
  onSubstatValueChange: (substat: string, value: number) => void;
  onReset: () => void;
}

export const ArtifactEnhancer: React.FC<ArtifactEnhancerProps> = ({
  level,
  exp,
  selectedSubstats,
  substatValues,
  maxLevel,
  onLevelChange,
  onExpChange,
  onSubstatValueChange,
  onReset,
}) => {
  const handleSubstatAdjustment = (substat: string, delta: number) => {
    const currentValue = substatValues[substat] || 0;
    const newValue = Math.max(0, Math.min(
      (SUBSTATS[substat] / 8) * 6,
      currentValue + delta
    ));
    onSubstatValueChange(substat, parseFloat(display(newValue)));
  };

  return (
    <div>
      <div>Enhancing Artifact</div>
      <table>
        <tbody>
          <tr>
            <th>Lv</th>
            <td>
              <input
                type="number"
                value={level}
                min={0}
                max={maxLevel}
                onChange={(e) => onLevelChange(Math.min(Number(e.target.value), maxLevel))}
              />
            </td>
            <td rowSpan={2} style={{ verticalAlign: 'middle' }}>
              <button onClick={onReset}>Reset</button>
            </td>
          </tr>
          <tr>
            <th>Exp</th>
            <td>
              <input
                type="number"
                value={exp}
                min={0}
                onChange={(e) => onExpChange(Number(e.target.value))}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <table id="enhancing">
        <tbody>
          {(Object.keys(SUBSTATS) as SubstatType[]).map((substat) => {
            const isSelected = selectedSubstats.includes(substat);
            return (
              <tr key={substat} style={{ visibility: isSelected ? 'visible' : 'hidden' }}>
                <th>{substat}</th>
                <td>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={display((SUBSTATS[substat] / 8) * 6)}
                    value={substatValues[substat] !== undefined ? substatValues[substat] : display((SUBSTATS[substat] / 8) * 0.9)}
                    onChange={(e) => onSubstatValueChange(substat, Number(e.target.value))}
                  />
                </td>
                <button
                  className="pm"
                  tabIndex={-1}
                  onClick={() => handleSubstatAdjustment(substat, (SUBSTATS[substat] / 8) * 0.85)}
                >
                  +
                </button>
                <button
                  className="pm"
                  tabIndex={-1}
                  onClick={() => handleSubstatAdjustment(substat, -(SUBSTATS[substat] / 8) * 0.85)}
                >
                  -
                </button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};