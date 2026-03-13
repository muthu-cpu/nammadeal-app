import { RideOption } from '../store/types';

export function calcRidePrices(distanceKm: number): RideOption[] {
  const base = Math.max(40, Math.round(distanceKm * 14));
  return [
    {
      name: 'Rapido Bike', type: 'Bike', price: Math.round(base * 0.5),
      eta: Math.round(distanceKm * 3 + 3), emoji: 'R', bg: 'rgba(255,215,0,.1)',
      source: 'ONDC', deepLink: 'in.rapido.app://',
      playStore: 'https://play.google.com/store/apps/details?id=com.rapido.passenger',
    },
    {
      name: 'Namma Yatri', type: 'Auto', price: Math.round(base * 0.75),
      eta: Math.round(distanceKm * 3.5 + 4), emoji: 'NY', bg: 'rgba(34,197,94,.1)',
      source: 'ONDC', deepLink: 'yatri://',
      playStore: 'https://play.google.com/store/apps/details?id=net.openkochi.yatri',
    },
    {
      name: 'Ola Mini', type: 'Mini', price: Math.round(base * 1.1),
      eta: Math.round(distanceKm * 2.5 + 5), emoji: 'OL', bg: 'rgba(0,200,83,.1)',
      source: 'Partner', deepLink: 'olacabs://',
      playStore: 'https://play.google.com/store/apps/details?id=com.ani.ola',
    },
    {
      name: 'Uber Go', type: 'Go', price: Math.round(base * 1.2),
      eta: Math.round(distanceKm * 2.5 + 4), emoji: 'UB', bg: 'rgba(255,255,255,.06)',
      source: 'API', deepLink: 'uber://',
      playStore: 'https://play.google.com/store/apps/details?id=com.ubercab',
    },
  ];
}
