// PermitData.js
export const permitFormData = [
        {
            label: "PTW Number",
            type: "number",
            name: "ptwNumber",
            placeholder: "Automatic Generated",
            readOnly: true,
        },
        {
            label: "Contractor Name",
            type: "text",
            name: "contractorName",
            placeholder: "Enter your Name",
        },
        {
            label: "Project Name",
            type: "text",
            name: "projectName",
            placeholder: "Enter Project Name",
        },
        {
            label: "No. of Employees involved",
            type: "number",
            name: "numberOfEmployees",
            placeholder: "No. of Employees",
        },
        {
            label: "Starting From",
            type: "datetime-local",
            name: "startDate",
        },
        {
            label: "Expected Completion From",
            type: "datetime-local",
            name: "completionDate",
        },
];

export const permitHeadings = {
    'permitformelectrical': 'Electrical',
    'permitformlifting': 'Lifting',
    'workAtHeight': 'Work at Height',
    'confinedSpace': 'Confined Space',
    'fire': 'Fire',
    'environmental': 'Environmental',
    'hotWork': 'Hot Work',
    'coldWork': 'Cold Work',
    'excavation': 'Excavation',
    'demolition': 'Demolition',
    'chemical': 'Chemical',
    'radiation': 'Radiation'
};

export const electricalRiskAssociated = [
  { value: 'electrocution', label: 'Electrocution' },
  { value: 'arcFlash', label: 'Arc Flash' },
  { value: 'flyingParticles', label: 'Flying Particles' },
  { value: 'noise', label: 'Noise' },
  { value: 'fallingObjects', label: 'Falling Objects' },
  { value: 'tripping/slipping', label: 'Tripping / Slipping' },
  { value: 'electricShock', label: 'Electric Shock' },
  { value: 'fire', label: 'Fire' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'electricBurn', label: 'Electric Burn' },
  { value: 'nearOverheadLines', label: 'Near Overhead Lines' },
  { value: 'other', label: 'Other' }
];

export const liftingRiskAssociated = [
  { value: 'lifting', label: 'Lifting' },
  { value: 'fallingObjects', label: 'Falling Objects' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'tripping/slipping', label: 'Tripping / Slipping' },
  { value: 'overloading', label: 'Overloading' },
  { value: 'equipmentFailure', label: 'Equipment Failure' },
  { value: 'crushing', label: 'Crushing' },
  { value: 'noise', label: 'Noise' },
  { value: 'arcFlash', label: 'Arc Flash' },
  { value: 'electricShock', label: 'Electric Shock' },
  { value: 'fire', label: 'Fire' },
  { value: 'other', label: 'Other' }
];

export const workAtHeightRiskAssociated = [
  { value: 'falls', label: 'Falls' },
  { value: 'fallingObjects', label: 'Falling Objects' },
  { value: 'slips', label: 'Slips' },
  { value: 'tripping', label: 'Tripping' },
  { value: 'collapse', label: 'Collapse' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'weatherConditions', label: 'Weather Conditions' },
  { value: 'other', label: 'Other' }
];

export const confinedSpaceRiskAssociated = [
  { value: 'asphyxiation', label: 'Asphyxiation' },
  { value: 'toxicGases', label: 'Toxic Gases' },
  { value: 'engulfment', label: 'Engulfment' },
  { value: 'fire', label: 'Fire' },
  { value: 'explosion', label: 'Explosion' },
  { value: 'lackOfOxygen', label: 'Lack of Oxygen' },
  { value: 'heat', label: 'Heat' },
  { value: 'other', label: 'Other' }
];

export const fireRiskAssociated = [
  { value: 'burns', label: 'Burns' },
  { value: 'smokeInhalation', label: 'Smoke Inhalation' },
  { value: 'explosions', label: 'Explosions' },
  { value: 'structuralCollapse', label: 'Structural Collapse' },
  { value: 'fallingObjects', label: 'Falling Objects' },
  { value: 'toxicSubstances', label: 'Toxic Substances' },
  { value: 'heat', label: 'Heat' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'other', label: 'Other' }
];

export const environmentalRiskAssociated = [
  { value: 'pollution', label: 'Pollution' },
  { value: 'wasteManagement', label: 'Waste Management' },
  { value: 'chemicalSpills', label: 'Chemical Spills' },
  { value: 'noise', label: 'Noise' },
  { value: 'emissions', label: 'Emissions' },
  { value: 'conservation', label: 'Conservation' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'other', label: 'Other' }
];

export const hotWorkRiskAssociated = [
  { value: 'fire', label: 'Fire' },
  { value: 'explosions', label: 'Explosions' },
  { value: 'burns', label: 'Burns' },
  { value: 'fumes', label: 'Fumes' },
  { value: 'radiantHeat', label: 'Radiant Heat' },
  { value: 'toxicSubstances', label: 'Toxic Substances' },
  { value: 'other', label: 'Other' }
];

export const coldWorkRiskAssociated = [
  { value: 'frostbite', label: 'Frostbite' },
  { value: 'hypothermia', label: 'Hypothermia' },
  { value: 'slips', label: 'Slips' },
  { value: 'tripping', label: 'Tripping' },
  { value: 'frozenEquipment', label: 'Frozen Equipment' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'other', label: 'Other' }
];

export const excavationRiskAssociated = [
  { value: 'collapse', label: 'Collapse' },
  { value: 'fallingObjects', label: 'Falling Objects' },
  { value: 'hazardousAtmospheres', label: 'Hazardous Atmospheres' },
  { value: 'undergroundServices', label: 'Underground Services' },
  { value: 'trenching', label: 'Trenching' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'other', label: 'Other' }
];

export const demolitionRiskAssociated = [
  { value: 'collapse', label: 'Collapse' },
  { value: 'flyingDebris', label: 'Flying Debris' },
  { value: 'dust', label: 'Dust' },
  { value: 'noise', label: 'Noise' },
  { value: 'hazardousMaterials', label: 'Hazardous Materials' },
  { value: 'manualHandling', label: 'Manual Handling' },
  { value: 'other', label: 'Other' }
];

export const chemicalRiskAssociated = [
  { value: 'toxicGases', label: 'Toxic Gases' },
  { value: 'chemicalSpills', label: 'Chemical Spills' },
  { value: 'skinContact', label: 'Skin Contact' },
  { value: 'eyeContact', label: 'Eye Contact' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'fire', label: 'Fire' },
  { value: 'explosion', label: 'Explosion' },
  { value: 'other', label: 'Other' }
];

export const radiationRiskAssociated = [
  { value: 'radiationBurns', label: 'Radiation Burns' },
  { value: 'radiationSickness', label: 'Radiation Sickness' },
  { value: 'contamination', label: 'Contamination' },
  { value: 'exposure', label: 'Exposure' },
  { value: 'fire', label: 'Fire' },
  { value: 'explosion', label: 'Explosion' },
  { value: 'other', label: 'Other' }
];

export const electricalPrecautions = [
    { point: 'isDistanceMaintained', label: 'Is the same distance maintained?' },
    { point: 'confinedSpaceAccess', label: 'Does the work require access to confined space?' },
    { point: 'electricalPowerIsolated', label: 'Have all possible sources of electrical power been isolated, locked, and properly tagged (LOTO)?' },
    { point: 'linesDeEnergized', label: 'Has it been confirmed by testing, that lines / equipment are de-energized?' },
    { point: 'toolsTested', label: 'Have Tools and devices to be used been tested/adjusted?' }
];

export const liftingPrecautions = [
    { point: 'isLoadSecure', label: 'Is the load secure?' },
    { point: 'operatorTrained', label: 'Is the operator trained?' },
    { point: 'equipmentInspected', label: 'Has the equipment been inspected?' },
    { point: 'weatherConditions', label: 'Are weather conditions suitable?' },
    { point: 'clearWorkArea', label: 'Is the work area clear?' }
];

export const workAtHeightPrecautions = [
    { point: 'harnessUsed', label: 'Is a harness used?' },
    { point: 'fallProtection', label: 'Is fall protection in place?' },
    { point: 'scaffoldInspected', label: 'Is the scaffold inspected?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' },
    { point: 'emergencyPlan', label: 'Is there an emergency plan in place?' }
];

export const confinedSpacePrecautions = [
    { point: 'airQualityTested', label: 'Has air quality been tested?' },
    { point: 'confinedSpacePermit', label: 'Is a confined space permit issued?' },
    { point: 'rescuePlan', label: 'Is a rescue plan in place?' },
    { point: 'communicationEstablished', label: 'Is communication established?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' }
];

export const firePrecautions = [
    { point: 'fireExtinguishersAvailable', label: 'Are fire extinguishers available?' },
    { point: 'fireAlarmTested', label: 'Is the fire alarm tested?' },
    { point: 'emergencyExitsClear', label: 'Are emergency exits clear?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' },
    { point: 'firePlanReviewed', label: 'Is the fire plan reviewed?' }
];

export const environmentalPrecautions = [
    { point: 'wasteDisposal', label: 'Is waste disposal managed?' },
    { point: 'spillContainment', label: 'Is spill containment in place?' },
    { point: 'noiseControl', label: 'Is noise control implemented?' },
    { point: 'airQualityMonitored', label: 'Is air quality monitored?' },
    { point: 'emergencyPlan', label: 'Is there an emergency plan in place?' }
];

export const hotWorkPrecautions = [
    { point: 'hotWorkPermit', label: 'Is a hot work permit issued?' },
    { point: 'fireWatch', label: 'Is a fire watch present?' },
    { point: 'flammableMaterialsRemoved', label: 'Are flammable materials removed?' },
    { point: 'fireExtinguishersAvailable', label: 'Are fire extinguishers available?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' }
];

export const coldWorkPrecautions = [
    { point: 'coldWorkPermit', label: 'Is a cold work permit issued?' },
    { point: 'equipmentInspection', label: 'Has equipment inspection been completed?' },
    { point: 'personalProtectiveEquipment', label: 'Is personal protective equipment used?' },
    { point: 'areaSecured', label: 'Is the work area secured?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' }
];

export const excavationPrecautions = [
    { point: 'excavationPermit', label: 'Is an excavation permit issued?' },
    { point: 'shoringInPlace', label: 'Is shoring in place?' },
    { point: 'utilitiesMarked', label: 'Are utilities marked?' },
    { point: 'trenchingSafety', label: 'Is trenching safety implemented?' },
    { point: 'emergencyPlan', label: 'Is an emergency plan in place?' }
];

export const demolitionPrecautions = [
    { point: 'demolitionPermit', label: 'Is a demolition permit issued?' },
    { point: 'hazardAssessment', label: 'Is hazard assessment completed?' },
    { point: 'debrisRemovalPlan', label: 'Is there a debris removal plan?' },
    { point: 'siteSecured', label: 'Is the site secured?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' }
];

export const chemicalPrecautions = [
    { point: 'chemicalPermit', label: 'Is a chemical permit issued?' },
    { point: 'MSDSAvailable', label: 'Are Material Safety Data Sheets (MSDS) available?' },
    { point: 'spillContainment', label: 'Is spill containment in place?' },
    { point: 'personalProtectiveEquipment', label: 'Is personal protective equipment used?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' }
];

export const radiationPrecautions = [
    { point: 'radiationPermit', label: 'Is a radiation permit issued?' },
    { point: 'radiationMonitoring', label: 'Is radiation monitoring in place?' },
    { point: 'protectiveClothing', label: 'Is protective clothing used?' },
    { point: 'areaControlled', label: 'Is the area controlled?' },
    { point: 'trainingCompleted', label: 'Has training been completed?' }
];

// Export the precautions for easy reference
export const permitPrecautions = {
    'permitformelectrical': electricalPrecautions,
    'permitformlifting': liftingPrecautions,
    'workAtHeight': workAtHeightPrecautions,
    'confinedSpace': confinedSpacePrecautions,
    'fire': firePrecautions,
    'environmental': environmentalPrecautions,
    'hotWork': hotWorkPrecautions,
    'coldWork': coldWorkPrecautions,
    'excavation': excavationPrecautions,
    'demolition': demolitionPrecautions,
    'chemical': chemicalPrecautions,
    'radiation': radiationPrecautions,
};

    export const inspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'safetyBarrier', label: 'Safety Barrier' },
    { value: 'stick', label: 'Stick' },
    { value: 'portable', label: 'Portable' },
    { value: 'other', label: 'Other (Specify)' }
];

export const electricalInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'safetyBarrier', label: 'Safety Barrier' },
    { value: 'electricalIsolation', label: 'Electrical Isolation' },
    { value: 'toolsInspected', label: 'Tools Inspected' },
    { value: 'other', label: 'Other (Specify)' }
];


export const liftingInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'liftingEquipmentInspected', label: 'Lifting Equipment Inspected' },
    { value: 'loadSecure', label: 'Load Secure' },
    { value: 'clearWorkArea', label: 'Clear Work Area' },
    { value: 'weatherConditions', label: 'Weather Conditions Suitable' },
    { value: 'other', label: 'Other (Specify)' }
];

export const workAtHeightInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'fallProtection', label: 'Fall Protection Equipment' },
    { value: 'scaffoldingInspected', label: 'Scaffolding Inspected' },
    { value: 'workAreaSecured', label: 'Work Area Secured' },
    { value: 'weatherConditions', label: 'Weather Conditions Suitable' },
    { value: 'other', label: 'Other (Specify)' }
];

export const confinedSpaceInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'ventilation', label: 'Ventilation Adequate' },
    { value: 'gasDetection', label: 'Gas Detection Equipment' },
    { value: 'emergencyRescue', label: 'Emergency Rescue Plan' },
    { value: 'communication', label: 'Communication Established' },
    { value: 'other', label: 'Other (Specify)' }
];

export const fireInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'fireExtinguishers', label: 'Fire Extinguishers Available' },
    { value: 'flammableMaterials', label: 'Flammable Materials Removed' },
    { value: 'fireWatch', label: 'Fire Watch Established' },
    { value: 'sparksContained', label: 'Sparks Contained' },
    { value: 'other', label: 'Other (Specify)' }
];

export const hotWorkInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'fireExtinguishers', label: 'Fire Extinguishers Available' },
    { value: 'flammableMaterials', label: 'Flammable Materials Removed' },
    { value: 'fireWatch', label: 'Fire Watch Established' },
    { value: 'weldingEquipment', label: 'Welding Equipment Inspected' },
    { value: 'other', label: 'Other (Specify)' }
];

export const chemicalInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'chemicalStorage', label: 'Chemical Storage Checked' },
    { value: 'spillContainment', label: 'Spill Containment Equipment' },
    { value: 'ventilation', label: 'Ventilation Adequate' },
    { value: 'PPE', label: 'Personal Protective Equipment' },
    { value: 'other', label: 'Other (Specify)' }
];

export const radiationInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'radiationMonitors', label: 'Radiation Monitors Installed' },
    { value: 'shielding', label: 'Proper Shielding Installed' },
    { value: 'controlledArea', label: 'Controlled Area Established' },
    { value: 'PPE', label: 'Personal Protective Equipment' },
    { value: 'other', label: 'Other (Specify)' }
];

export const demolitionInspectionItems = [
    { value: 'accessEscapeRoute', label: 'Access / Escape Route' },
    { value: 'dangerWarningSign', label: 'Danger / Warning Sign' },
    { value: 'structureStability', label: 'Structure Stability Checked' },
    { value: 'debrisContainment', label: 'Debris Containment Equipment' },
    { value: 'fallProtection', label: 'Fall Protection Equipment' },
    { value: 'PPE', label: 'Personal Protective Equipment' },
    { value: 'other', label: 'Other (Specify)' }
];

export const environmentalInspectionItems = [
    { value: 'pollutionControl', label: 'Pollution Control Measures' },
    { value: 'wasteDisposal', label: 'Waste Disposal System' },
    { value: 'spillContainment', label: 'Spill Containment Kits' },
    { value: 'monitoringDevices', label: 'Environmental Monitoring Devices' },
    { value: 'emergencyPreparedness', label: 'Emergency Preparedness' },
    { value: 'other', label: 'Other (Specify)' }
];

export const coldWorkInspectionItems = [
    { value: 'areaClear', label: 'Work Area Clear of Flammables' },
    { value: 'properVentilation', label: 'Proper Ventilation' },
    { value: 'toolsFunctional', label: 'Tools are Functional' },
    { value: 'fireSafety', label: 'Fire Safety Measures in Place' },
    { value: 'protectiveGear', label: 'Protective Gear Available' },
    { value: 'other', label: 'Other (Specify)' }
];

export const excavationInspectionItems = [
    { value: 'shoringInspection', label: 'Shoring Inspection' },
    { value: 'groundCondition', label: 'Ground Condition Assessed' },
    { value: 'utilityMarkers', label: 'Utility Markers in Place' },
    { value: 'barriersInPlace', label: 'Safety Barriers in Place' },
    { value: 'emergencyPlan', label: 'Emergency Plan Reviewed' },
    { value: 'other', label: 'Other (Specify)' }
];


export const inspectionItemsData = {
    'permitformelectrical': electricalInspectionItems,
    'permitformlifting': liftingInspectionItems,
    'workAtHeight': workAtHeightInspectionItems,
    'confinedSpace': confinedSpaceInspectionItems,
    'fire': fireInspectionItems,
    'environmental': environmentalInspectionItems,
    'hotWork': hotWorkInspectionItems,
    'coldWork': coldWorkInspectionItems,
    'excavation': excavationInspectionItems,
    'demolition': demolitionInspectionItems,
    'chemical': chemicalInspectionItems,
    'radiation': radiationInspectionItems,
};


    export const ppeItems = [
    { value: 'helmet', label: 'Helmet' },
    { value: 'safetyShoes', label: 'Safety Shoes' },
    { value: 'electricalGloves', label: 'Electrical Gloves' },
    { value: 'halfMask', label: 'Half Mask' },
    { value: 'safetyGoggles', label: 'Safety Goggles' },
    { value: 'reflectiveVest', label: 'Reflective Vest' },
    { value: 'dustMask', label: 'Dust Mask' },
    { value: 'safetyClothes', label: 'Safety Clothes' },
    { value: 'faceShield', label: 'Face Shield' },
    { value: 'arcFlashPPE', label: 'Arc Flash PPE' },
    { value: 'safetyEarPlugs', label: 'Safety Ear Plugs / Muff' },
    { value: 'other', label: 'Other (Specify)' }
];