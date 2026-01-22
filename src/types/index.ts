export type SubstatType = 'DEF' | 'Energy_Recharge' | 'CRIT_Rate' | 'CRIT_DMG';

export type MaterialType = 'lv1' | 'lv2' | 'lv3' | 'lv4' | 'unc' | 'ess';

export type ArtifactRarity = 4 | 5;

export interface SubstatValues {
  [key: string]: number;
}

// Stricter type aliases for better type safety
export type SubstatValuesStrict = Partial<Record<SubstatType, number>>;
export type MaterialToggleState = Record<MaterialType, boolean>;

export interface MaterialValues {
  lv1: number;
  lv2: number;
  lv3: number;
  lv4: number;
  unc: number;
  ess: number;
}

export interface MaterialUsage {
  lv1: number;
  lv2: number;
  lv3: number;
  lv4: number;
  unc: number;
  ess: number;
}

export interface TargetArtifact {
  val: number[];
  validity: boolean;
}

export interface ArtifactState {
  level: number;
  exp: number;
}

export interface AppState {
  selectedSubstats: SubstatType[];
  substatValues: SubstatValues;
  artifactState: ArtifactState;
  materialUsage: MaterialUsage;
  targetArtifacts: TargetArtifact[];
  expReq: number;
  expCap: number;
  givenExp: number;
}