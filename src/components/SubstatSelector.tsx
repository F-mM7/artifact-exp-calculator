import React from 'react';
import type { SubstatType } from '../types';
import { SUBSTATS } from '../constants';

interface SubstatSelectorProps {
  selectedSubstats: SubstatType[];
  onSubstatChange: (substats: SubstatType[]) => void;
}

export const SubstatSelector: React.FC<SubstatSelectorProps> = ({
  selectedSubstats,
  onSubstatChange,
}) => {
  const handleCheckboxChange = (substat: SubstatType) => {
    const isSelected = selectedSubstats.includes(substat);

    if (isSelected) {
      onSubstatChange(selectedSubstats.filter(s => s !== substat));
    } else {
      onSubstatChange([...selectedSubstats, substat]);
    }
  };

  return (
    <div>
      <div>Select Substats</div>
      <div id="select">
        {Object.keys(SUBSTATS).map((substat) => (
          <div key={substat}>
            <input
              type="checkbox"
              id={`${substat}_checkbox`}
              checked={selectedSubstats.includes(substat as SubstatType)}
              onChange={() => handleCheckboxChange(substat as SubstatType)}
            />
            <label htmlFor={`${substat}_checkbox`}>{substat}</label>
          </div>
        ))}
      </div>
    </div>
  );
};