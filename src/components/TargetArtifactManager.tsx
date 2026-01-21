import React, { useState } from 'react';
import type { SubstatType, TargetArtifact } from '../types';
import { SUBSTATS } from '../constants';

interface TargetArtifactManagerProps {
  selectedSubstats: SubstatType[];
  targetArtifacts: TargetArtifact[];
  onAddArtifacts: (artifacts: TargetArtifact[]) => void;
  onClearArtifacts: () => void;
}

export const TargetArtifactManager: React.FC<TargetArtifactManagerProps> = ({
  selectedSubstats,
  targetArtifacts,
  onAddArtifacts,
  onClearArtifacts,
}) => {
  const [inputText, setInputText] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handlePush = () => {
    const matches = inputText.match(/[0-9]+\.?[0-9]*/g);

    if (!matches || matches.length % selectedSubstats.length !== 0) {
      setAlertMessage('error!');
      return;
    }

    setAlertMessage('');
    const numbers = matches.map(s => Number(s));
    const newArtifacts: TargetArtifact[] = [];

    for (let i = 0; i < numbers.length; i += selectedSubstats.length) {
      const values: number[] = [];
      for (let j = 0; j < selectedSubstats.length; j++) {
        values.push(numbers[i + j]);
      }
      newArtifacts.push({
        val: values,
        validity: true,
      });
    }

    onAddArtifacts(newArtifacts);
    setInputText('');
  };

  const handleClear = () => {
    onClearArtifacts();
    setInputText('');
    setAlertMessage('');
  };

  return (
    <div>
      <div>Target Artifact</div>
      <div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handlePush}>push</button>
        <button onClick={handleClear}>clear</button>
        <span id="alert">{alertMessage}</span>
        <div id="list"></div>
        <table id="table">
          <thead>
            <tr>
              {(Object.keys(SUBSTATS) as SubstatType[]).map((substat) => {
                const isSelected = selectedSubstats.includes(substat);
                return (
                  <th key={substat} style={{ visibility: isSelected ? 'visible' : 'hidden' }}>{substat}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {targetArtifacts.map((artifact, index) => (
              <tr
                key={index}
                className={artifact.validity ? 'data' : 'data invalid'}
              >
                {(Object.keys(SUBSTATS) as SubstatType[]).map((substat, i) => {
                  const isSelected = selectedSubstats.includes(substat);
                  const selectedIndex = selectedSubstats.indexOf(substat);
                  const value = selectedIndex >= 0 ? artifact.val[selectedIndex] : 0;
                  return (
                    <td key={i} style={{ visibility: isSelected ? 'visible' : 'hidden' }}>{value.toFixed(1)}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};