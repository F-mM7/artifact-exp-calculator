import React from 'react';
import type { MaterialUsage } from '../types';
import { MATERIALS, FACTOR } from '../constants';

interface MaterialCalculatorProps {
  expReq: number;
  expCap: number;
  materialUsage: MaterialUsage;
  givenExp: number;
  enabledMaterials: { [key: string]: boolean };
  onMaterialToggle: (material: string) => void;
  onExpGain: (multiplier: number) => void;
}

export const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({
  expReq,
  expCap,
  materialUsage,
  givenExp,
  enabledMaterials,
  onMaterialToggle,
  onExpGain,
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