export interface HandwritingProfile {
  id: string;
  name: string;
  font: 'Kalam' | 'Caveat' | 'Patrick Hand' | 'Architects Daughter';
  slant: number; // -10 to +10 degrees
  jitter: number; // 0.0 to 0.5
  baselineVariation: number; // 0 to 3px
  strokeThickness: number; // 0.8 to 2.0 multiplier
  letterSpacing: number; // -1 to +3px
  sampleCharactersRecorded: number;
}

export const DEFAULT_HANDWRITING_PROFILES: HandwritingProfile[] = [
  {
    id: 'profile-kalam',
    name: 'Natural Study Cursive (Kalam)',
    font: 'Kalam',
    slant: -2,
    jitter: 0.1,
    baselineVariation: 1.0,
    strokeThickness: 1.0,
    letterSpacing: 0.5,
    sampleCharactersRecorded: 26,
  },
  {
    id: 'profile-caveat',
    name: 'Expressive Quick Script (Caveat)',
    font: 'Caveat',
    slant: 4,
    jitter: 0.2,
    baselineVariation: 1.8,
    strokeThickness: 1.1,
    letterSpacing: 0,
    sampleCharactersRecorded: 52,
  },
  {
    id: 'profile-clean',
    name: 'Neat Print Hand (Patrick Hand)',
    font: 'Patrick Hand',
    slant: 0,
    jitter: 0.05,
    baselineVariation: 0.5,
    strokeThickness: 1.0,
    letterSpacing: 1.0,
    sampleCharactersRecorded: 26,
  },
  {
    id: 'profile-sketch',
    name: 'Architect / Engineering Sketch (Architects Daughter)',
    font: 'Architects Daughter',
    slant: -1,
    jitter: 0.15,
    baselineVariation: 1.2,
    strokeThickness: 1.2,
    letterSpacing: 1.2,
    sampleCharactersRecorded: 30,
  },
];
