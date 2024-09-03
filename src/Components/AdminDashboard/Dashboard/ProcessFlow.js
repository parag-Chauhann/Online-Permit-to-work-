import React, { useEffect, useState } from 'react';
import './ProcessFlow.css';

function ProcessFlow({ currentStage }) {
  const stages = [
    'Permit Initiated',
    'Approved by First Approver',
    'Approved by Safety Department',
    'Rejected'
  ];

  const [stageColors, setStageColors] = useState({});

  useEffect(() => {
    const stageIndex = stages.indexOf(currentStage);
    const newStageColors = {};

    if (currentStage.includes('Rejected')) {
      // If the status is 'Rejected', make all stages red
      stages.forEach(stage => newStageColors[stage] = 'red');
    } else {
      // Otherwise, color stages up to the current stage
      stages.forEach((stage, index) => {
        if (index < stageIndex) {
          newStageColors[stage] = 'green'; // Completed stages
        } else if (index === stageIndex) {
          newStageColors[stage] = 'blue'; // Current stage
        } else {
          newStageColors[stage] = 'gray'; // Upcoming stages
        }
      });
    }

    setStageColors(newStageColors);
  }, [currentStage]);

  return (
    <div className="process-flow-main">
      <div className="line-container">
        <div className="progress-line" style={{ width: `${(100 / (stages.length - 1)) * stages.indexOf(currentStage)}%` }}></div>
      </div>
      <div className="stages-container">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`flow-stage ${stageColors[stage]} ${stageColors[stage] === 'blue' ? 'glow' : ''}`}
            style={{ color: stageColors[stage] }}
          >
            <div className={`circle ${stageColors[stage] === 'blue' ? 'glow' : ''}`}></div>
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessFlow;
