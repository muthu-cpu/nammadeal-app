export const Colors = {
  // Backgrounds
  bg:      '#08080A',
  card:    '#101014',
  card2:   '#141418',
  sidebar: '#0D0D10',

  // Brand
  primary:     '#F5A623',
  primary2:    '#FF8C00',
  primaryDim:  'rgba(245,166,35,0.12)',
  primaryDim2: 'rgba(245,166,35,0.06)',

  // Borders
  border:     '#1E1E26',
  borderGold: 'rgba(245,166,35,0.2)',

  // Text
  text:   '#F0F0F5',
  muted:  '#55556A',
  muted2: '#7A7A95',

  // Semantic
  green:    '#22C55E',
  red:      '#EF4444',
  blue:     '#3B82F6',

  // Alpha variants
  greenDim:  'rgba(34,197,94,0.10)',
  greenDim2: 'rgba(34,197,94,0.08)',
  redDim:    'rgba(239,68,68,0.10)',
  blueDim:   'rgba(59,130,246,0.07)',
};

// Platform brand colours (for grocery/ride labels)
export const PlatformColors: Record<string, { bg: string; text: string }> = {
  blinkit:   { bg: '#F0C12A', text: '#000' },
  zepto:     { bg: '#7C3AED', text: '#fff' },
  instamart: { bg: '#FC8019', text: '#fff' },
  bigbasket: { bg: '#84C225', text: '#000' },
  jiomart:   { bg: '#006DB7', text: '#fff' },
  dmart:     { bg: '#E31E24', text: '#fff' },
};
