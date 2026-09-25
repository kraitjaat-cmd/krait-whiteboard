export interface ColorSwatch {
  name: string;
  value: string;
  darkValue?: string;
  category: 'basic' | 'study' | 'subject';
}

export const BASIC_COLORS: ColorSwatch[] = [
  { name: 'Ink Black', value: '#18181B', darkValue: '#F8FAFC', category: 'basic' },
  { name: 'Graphite', value: '#52525B', darkValue: '#94A3B8', category: 'basic' },
  { name: 'Classic Red', value: '#DC2626', darkValue: '#F87171', category: 'basic' },
  { name: 'Warm Orange', value: '#EA580C', darkValue: '#FB923C', category: 'basic' },
  { name: 'Sun Yellow', value: '#CA8A04', darkValue: '#FDE047', category: 'basic' },
  { name: 'Forest Green', value: '#16A34A', darkValue: '#4ADE80', category: 'basic' },
  { name: 'Royal Blue', value: '#2563EB', darkValue: '#60A5FA', category: 'basic' },
  { name: 'Purple Ink', value: '#9333EA', darkValue: '#C084FC', category: 'basic' },
  { name: 'Rose Pink', value: '#E11D48', darkValue: '#FB7185', category: 'basic' },
  { name: 'Warm Brown', value: '#78350F', darkValue: '#D97706', category: 'basic' },
];

export const STUDY_COLORS: ColorSwatch[] = [
  { name: 'Medical Blue (Deox)', value: '#0284C7', darkValue: '#38BDF8', category: 'study' },
  { name: 'Oxygen Red (Oxy)', value: '#E11D48', darkValue: '#FB7185', category: 'study' },
  { name: 'Sage Green', value: '#059669', darkValue: '#34D399', category: 'study' },
  { name: 'Lavender Accent', value: '#7C3AED', darkValue: '#A78BFA', category: 'study' },
  { name: 'Peach Highlight', value: '#F97316', darkValue: '#FDBA74', category: 'study' },
  { name: 'Amber Warning', value: '#D97706', darkValue: '#FBBF24', category: 'study' },
  { name: 'Deep Teal', value: '#0D9488', darkValue: '#2DD4BF', category: 'study' },
  { name: 'Graphite Lead', value: '#3F3F46', darkValue: '#E4E4E7', category: 'study' },
];

export const HIGHLIGHTER_COLORS = [
  { name: 'Neon Yellow', value: 'rgba(254, 240, 138, 0.45)', darkValue: 'rgba(250, 204, 21, 0.35)' },
  { name: 'Soft Peach', value: 'rgba(254, 215, 170, 0.45)', darkValue: 'rgba(251, 146, 60, 0.35)' },
  { name: 'Mint Green', value: 'rgba(187, 247, 208, 0.45)', darkValue: 'rgba(74, 222, 128, 0.35)' },
  { name: 'Sky Blue', value: 'rgba(186, 230, 253, 0.45)', darkValue: 'rgba(56, 189, 248, 0.35)' },
  { name: 'Lavender', value: 'rgba(233, 213, 255, 0.45)', darkValue: 'rgba(192, 132, 252, 0.35)' },
  { name: 'Rose', value: 'rgba(254, 205, 211, 0.45)', darkValue: 'rgba(251, 113, 133, 0.35)' },
];

export function getRecommendedSubjectPalette(subject: string, isDark: boolean = false) {
  const norm = subject.toLowerCase();
  if (norm.includes('bio') || norm.includes('heart') || norm.includes('cell') || norm.includes('nephron') || norm.includes('neuron')) {
    return {
      primary: isDark ? '#FB7185' : '#E11D48',     // Oxygen red
      secondary: isDark ? '#38BDF8' : '#0284C7',   // Deoxygenated blue
      accent: isDark ? '#4ADE80' : '#16A34A',      // Bio green
      neutral: isDark ? '#F8FAFC' : '#18181B',
      highlight: isDark ? '#D8B4FE' : '#9333EA',
    };
  }
  if (norm.includes('phys') || norm.includes('motion') || norm.includes('force') || norm.includes('gravity') || norm.includes('projectile')) {
    return {
      primary: isDark ? '#60A5FA' : '#2563EB',     // Vector blue
      secondary: isDark ? '#FB923C' : '#EA580C',   // Trajectory orange
      accent: isDark ? '#FDE047' : '#CA8A04',      // Angle / component yellow
      neutral: isDark ? '#F8FAFC' : '#18181B',
      highlight: isDark ? '#F43F5E' : '#E11D48',
    };
  }
  if (norm.includes('chem') || norm.includes('atom') || norm.includes('bond') || norm.includes('reaction')) {
    return {
      primary: isDark ? '#C084FC' : '#7C3AED',     // Organic purple
      secondary: isDark ? '#2DD4BF' : '#0D9488',   // Solution teal
      accent: isDark ? '#FB923C' : '#EA580C',      // Heat orange
      neutral: isDark ? '#F8FAFC' : '#18181B',
      highlight: isDark ? '#FDE047' : '#EAB308',
    };
  }
  // Math & General Default
  return {
    primary: isDark ? '#38BDF8' : '#0284C7',
    secondary: isDark ? '#4ADE80' : '#16A34A',
    accent: isDark ? '#C084FC' : '#9333EA',
    neutral: isDark ? '#F8FAFC' : '#18181B',
    highlight: isDark ? '#FBBF24' : '#D97706',
  };
}
