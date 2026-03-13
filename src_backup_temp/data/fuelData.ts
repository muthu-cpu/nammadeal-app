import { FuelStation } from '../store/types';

export type FuelType = 'petrol' | 'diesel' | 'cng';
export type CityFuel = Record<FuelType, FuelStation[]>;

export const CITIES: string[] = [
  'Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad',
];

export const FUEL_BY_CITY: Record<string, CityFuel> = {
  Bengaluru: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 102.86, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 103.14, location: '1200+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 103.20, location: '800+ outlets' },
      { name: 'Reliance',            logo: 'rel', color: 'rgba(200,0,0,.12)',     price: 103.80, location: 'Select NH areas' },
      { name: 'Shell',               logo: 'sh',  color: 'rgba(255,200,0,.12)',   price: 104.50, location: 'Limited locations' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 88.94, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 89.10, location: '1200+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 89.28, location: '800+ outlets' },
      { name: 'Reliance',            logo: 'rel', color: 'rgba(200,0,0,.12)',     price: 89.60, location: 'Select areas' },
      { name: 'Shell',               logo: 'sh',  color: 'rgba(255,200,0,.12)',   price: 90.50, location: 'Limited locations' },
    ],
    cng: [
      { name: 'GAIL/MGL',            logo: 'gail',color: 'rgba(59,130,246,.12)',  price: 76.50, location: '180+ stations' },
      { name: 'IGL Indraprastha',    logo: 'igl', color: 'rgba(34,197,94,.12)',   price: 78.00, location: 'ORR route' },
      { name: 'BGL Bengaluru Gas',   logo: 'bgl', color: 'rgba(100,100,255,.12)', price: 79.50, location: 'Outer ring road' },
    ],
  },
  Chennai: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 100.90, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 101.20, location: '900+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 101.45, location: '600+ outlets' },
      { name: 'Reliance',            logo: 'rel', color: 'rgba(200,0,0,.12)',     price: 101.90, location: 'Select areas' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 86.67, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 86.95, location: '900+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 87.10, location: '600+ outlets' },
      { name: 'Reliance',            logo: 'rel', color: 'rgba(200,0,0,.12)',     price: 87.40, location: 'Select areas' },
    ],
    cng: [
      { name: 'MNGL Chennai Gas',    logo: 'mngl',color: 'rgba(59,130,246,.12)',  price: 82.00, location: 'Select stations' },
    ],
  },
  Mumbai: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 103.44, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 103.74, location: '1000+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 103.90, location: '700+ outlets' },
      { name: 'Reliance',            logo: 'rel', color: 'rgba(200,0,0,.12)',     price: 104.40, location: 'Select areas' },
      { name: 'Shell',               logo: 'sh',  color: 'rgba(255,200,0,.12)',   price: 105.20, location: 'Limited locations' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 89.97, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 90.18, location: '1000+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 90.36, location: '700+ outlets' },
    ],
    cng: [
      { name: 'Mahanagar Gas',       logo: 'mgl', color: 'rgba(59,130,246,.12)',  price: 66.00, location: '400+ stations' },
      { name: 'Adani Gas',           logo: 'adani',color: 'rgba(34,197,94,.12)', price: 66.50, location: 'Select areas' },
    ],
  },
  Delhi: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 94.72, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 95.00, location: '800+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 95.15, location: '700+ outlets' },
      { name: 'Shell',               logo: 'sh',  color: 'rgba(255,200,0,.12)',   price: 96.50, location: 'Limited locations' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 87.62, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 87.90, location: '800+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 88.04, location: '700+ outlets' },
    ],
    cng: [
      { name: 'IGL Indraprastha',    logo: 'igl', color: 'rgba(59,130,246,.12)',  price: 75.09, location: '600+ stations' },
      { name: 'Adani Gas',           logo: 'adani',color: 'rgba(34,197,94,.12)', price: 75.50, location: 'NCR areas' },
    ],
  },
  Hyderabad: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 107.41, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 107.70, location: '700+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 107.88, location: '500+ outlets' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 95.65, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 95.90, location: '700+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 96.10, location: '500+ outlets' },
    ],
    cng: [
      { name: 'HPCL Green Gas',      logo: 'hgl', color: 'rgba(59,130,246,.12)',  price: 95.00, location: 'Limited stations' },
    ],
  },
  Pune: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 103.38, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 103.66, location: '600+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 103.82, location: '400+ outlets' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 89.98, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 90.20, location: '600+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 90.38, location: '400+ outlets' },
    ],
    cng: [
      { name: 'Maharashtra Nat Gas', logo: 'mngl',color: 'rgba(59,130,246,.12)',  price: 78.00, location: '200+ stations' },
      { name: 'Adani Gas',           logo: 'adani',color: 'rgba(34,197,94,.12)', price: 78.50, location: 'Select areas' },
    ],
  },
  Kolkata: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 104.67, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 104.96, location: '500+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 105.12, location: '400+ outlets' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',  color: 'rgba(255,120,0,.12)',   price: 91.27, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',  color: 'rgba(0,160,80,.12)',    price: 91.55, location: '500+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',  color: 'rgba(0,80,200,.12)',    price: 91.70, location: '400+ outlets' },
    ],
    cng: [
      { name: 'GAIL Bengal Gas',     logo: 'gail',color: 'rgba(59,130,246,.12)',  price: 70.00, location: 'Select stations' },
    ],
  },
  Ahmedabad: {
    petrol: [
      { name: 'Indian Oil',          logo: 'io',   color: 'rgba(255,120,0,.12)',  price: 96.63, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',   color: 'rgba(0,160,80,.12)',   price: 96.90, location: '500+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',   color: 'rgba(0,80,200,.12)',   price: 97.05, location: '400+ outlets' },
      { name: 'Adani Total Gas',     logo: 'adani',color: 'rgba(34,197,94,.12)',  price: 97.50, location: 'City stations' },
    ],
    diesel: [
      { name: 'Indian Oil',          logo: 'io',   color: 'rgba(255,120,0,.12)',  price: 89.33, location: 'All city stations' },
      { name: 'Bharat Petroleum',    logo: 'bp',   color: 'rgba(0,160,80,.12)',   price: 89.58, location: '500+ outlets' },
      { name: 'Hindustan Petroleum', logo: 'hp',   color: 'rgba(0,80,200,.12)',   price: 89.72, location: '400+ outlets' },
    ],
    cng: [
      { name: 'Adani Total Gas',     logo: 'adani',color: 'rgba(34,197,94,.12)',  price: 67.50, location: '300+ stations' },
      { name: 'Gujarat Gas',         logo: 'ggl',  color: 'rgba(59,130,246,.12)', price: 68.00, location: 'City wide' },
    ],
  },
};

export const FUEL = FUEL_BY_CITY['Bengaluru'];

export const FUEL_LOGOS: Record<string, string> = {
  io: 'IO', bp: 'BP', hp: 'HP', rel: 'RL', sh: 'SH', gail: 'MGL',
  igl: 'IGL', bgl: 'BGL', mgl: 'MGL', mngl: 'MNG', adani: 'AG', hgl: 'HPG', ggl: 'GGL',
};

export const FUEL_TIPS: Record<string, string> = {
  petrol: 'Fill up early morning - fuel is denser when cool, you get more volume per litre.',
  diesel: 'Speed Diesel gives better mileage - the extra cost pays off over long drives.',
  cng:    'CNG saves ~60% vs petrol. Cost per km is about Rs 1.9 vs Rs 5.5 for petrol.',
};
