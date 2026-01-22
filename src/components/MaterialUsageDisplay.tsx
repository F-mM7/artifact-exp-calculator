import React from 'react';
import type { MaterialUsage } from '../types';
import { MATERIALS, FACTOR } from '../constants';

interface MaterialUsageDisplayProps {
  materialUsage: MaterialUsage;
  givenExp: number;
  futureMaterialUsages: MaterialUsage[];
  enabledMaterials: { [key: string]: boolean };
  onMaterialToggle: (material: string) => void;
  onExpGain: (multiplier: number) => void;
}

export const MaterialUsageDisplay: React.FC<MaterialUsageDisplayProps> = ({
  materialUsage,
  givenExp,
  futureMaterialUsages,
  enabledMaterials,
  onMaterialToggle,
  onExpGain,
}) => {
  return (
    <>
      <table id="mat">
        <tbody>
          {Object.entries(MATERIALS).map(([material, _]) => (
            <tr key={material}>
              <td>
                <button
                  className={`toggle-btn material ${enabledMaterials[material] ? 'active' : ''}`}
                  onClick={() => onMaterialToggle(material)}
                >
                  {material}
                </button>
              </td>
              <td className="mat-cell">{materialUsage[material as keyof MaterialUsage]}</td>
              {futureMaterialUsages.map((usage, i) => (
                <td key={i} className="mat-cell">
                  {usage[material as keyof MaterialUsage]}
                </td>
              ))}
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
    </>
  );
};
