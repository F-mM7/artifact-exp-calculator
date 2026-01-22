import React from 'react';
import type { SubstatType } from '../types';
import { SUBSTATS, CALCULATION_CONSTANTS } from '../constants';
import { display, calculateSubstatValue } from '../utils/calculator';

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
      calculateSubstatValue(substat as SubstatType, CALCULATION_CONSTANTS.MAX_ENHANCEMENTS),
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
                    max={display(calculateSubstatValue(substat, CALCULATION_CONSTANTS.MAX_ENHANCEMENTS))}
                    value={substatValues[substat] !== undefined ? substatValues[substat] : display(calculateSubstatValue(substat, CALCULATION_CONSTANTS.HIGH_ROLL_MULTIPLIER))}
                    onChange={(e) => onSubstatValueChange(substat, Number(e.target.value))}
                  />
                </td>
                <button
                  className="pm"
                  tabIndex={-1}
                  onClick={() => handleSubstatAdjustment(substat, calculateSubstatValue(substat, CALCULATION_CONSTANTS.LOW_ROLL_MULTIPLIER))}
                >
                  +
                </button>
                <button
                  className="pm"
                  tabIndex={-1}
                  onClick={() => handleSubstatAdjustment(substat, -calculateSubstatValue(substat, CALCULATION_CONSTANTS.LOW_ROLL_MULTIPLIER))}
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