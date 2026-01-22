import React from 'react';

interface TargetLevelSelectorProps {
  targetLevel: number | 'auto';
  maxLevel: number;
  onTargetLevelChange: (level: number | 'auto') => void;
}

const TARGET_LEVELS = ['auto', 4, 8, 12, 16, 20] as const;

export const TargetLevelSelector: React.FC<TargetLevelSelectorProps> = ({
  targetLevel,
  maxLevel,
  onTargetLevelChange,
}) => {
  return (
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
  );
};
