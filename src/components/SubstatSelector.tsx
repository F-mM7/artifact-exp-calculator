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
      <div className="substat-buttons">
        {Object.keys(SUBSTATS).map((substat) => (
          <button
            key={substat}
            className={`toggle-btn ${selectedSubstats.includes(substat as SubstatType) ? 'active' : ''}`}
            onClick={() => handleCheckboxChange(substat as SubstatType)}
          >
            {substat}
          </button>
        ))}
      </div>
    </div>
  );
};