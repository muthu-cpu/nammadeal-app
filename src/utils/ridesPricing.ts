import { RideOption } from '../store/types';

// Realistic per-platform pricing: Base Fare + Distance × Per KM rate
const PLATFORMS = [
  {
    name: 'Rapido Bike', type: 'Bike',
    baseFare: 20, perKm: 8, etaBase: 3,
    emoji: 'R', bg: 'rgba(255,215,0,.1)',
    source: 'ONDC' as const,
    deepLink: 'in.rapido.app://',
    playStore: 'https://play.google.com/store/apps/details?id=com.rapido.passenger',
  },
  {
    name: 'Namma Yatri', type: 'Auto',
    baseFare: 25, perKm: 10, etaBase: 4,
    emoji: 'NY', bg: 'rgba(34,197,94,.1)',
    source: 'ONDC' as const,
    deepLink: 'yatri://',
    playStore: 'https://play.google.com/store/apps/details?id=net.openkochi.yatri',
  },
  {
    name: 'Ola Mini', type: 'Mini',
    baseFare: 40, perKm: 14, etaBase: 5,
    emoji: 'OL', bg: 'rgba(0,200,83,.1)',
    source: 'Partner' as const,
    deepLink: 'olacabs://',
    playStore: 'https://play.google.com/store/apps/details?id=com.ani.ola',
  },
  {
    name: 'Uber Go', type: 'Go',
    baseFare: 45, perKm: 15, etaBase: 4,
    emoji: 'UB', bg: 'rgba(255,255,255,.06)',
    source: 'API' as const,
    deepLink: 'uber://',
    playStore: 'https://play.google.com/store/apps/details?id=com.ubercab',
  },
];

export function calcRidePrices(distanceKm: number): RideOption[] {
  return PLATFORMS.map(p => ({
    name: p.name,
    type: p.type,
    // Total = Base Fare + (Distance × Per KM rate)
    price: Math.round(p.baseFare + distanceKm * p.perKm),
    eta: Math.round(p.etaBase + distanceKm * 2.5),
    emoji: p.emoji,
    bg: p.bg,
    source: p.source,
    deepLink: p.deepLink,
    playStore: p.playStore,
  }));
}
