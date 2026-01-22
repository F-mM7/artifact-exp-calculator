import React from 'react';

interface CapDivisorSelectorProps {
  capDivisor: number;
  onCapDivisorChange: (divisor: number) => void;
}

const CAP_DIVISORS = [1, 2, 5] as const;

export const CapDivisorSelector: React.FC<CapDivisorSelectorProps> = ({
  capDivisor,
  onCapDivisorChange,
}) => {
  return (
    <tr>
      <th>cap divisor</th>
      <td>
        <div className="cap-divisor-buttons">
          {CAP_DIVISORS.map((divisor) => (
            <button
              key={divisor}
              className={capDivisor === divisor ? 'active' : ''}
              onClick={() => onCapDivisorChange(divisor)}
            >
              ÷{divisor}
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
};
