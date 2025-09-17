import React, { useState } from 'react';
import type { SubstatType, TargetArtifact } from '../types';

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
              {selectedSubstats.map((substat) => (
                <th key={substat}>{substat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {targetArtifacts.map((artifact, index) => (
              <tr
                key={index}
                className={artifact.validity ? 'data' : 'data invalid'}
              >
                {artifact.val.map((value, i) => (
                  <td key={i}>{value.toFixed(1)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};