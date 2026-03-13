export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface PlatformPrice {
  label: string;
  cls: string;
  price: number;
  size: string;
  perUnit: string;
  deepLink: string;
  playStore: string;
}

export interface GroceryProduct {
  name: string;
  emoji: string;
  platforms: PlatformPrice[];
}

export interface RideOption {
  name: string;
  type: string;
  price: number;
  eta: number;
  emoji: string;
  bg: string;
  source: 'ONDC' | 'API' | 'Partner';
  deepLink: string;
  playStore: string;
}

export interface BusOption {
  op: string;
  name: string;
  type: string;
  dep: string;
  arr: string;
  dur: string;
  seats: number;
  rating: number;
  price: number;
  logo: string;
  bg: string;
  deepLink: string;
  playStore: string;
}

export interface FuelStation {
  name: string;
  logo: string;
  color: string;
  price: number;
  location: string;
}

export interface Offer {
  cat: 'rides' | 'grocery' | 'food' | 'pharma' | 'travels';
  platform: string;
  logo: string;
  bg: string;
  desc: string;
  disc: string;
  max: string;
  code: string;
  valid: string;
}

export interface FinanceProduct {
  name: string;
  rate: string;
  logo: string;
  meta: string;
  bg: string;
  tags: string[];
  deepLink: string;
  playStore: string;
}

export interface BasketItem {
  name: string;
  platforms: PlatformPrice[];
}

export interface FoodOption {
  name: string;
  price: number;
  delivery: number;
  eta: number;
  rating: number;
  emoji: string;
  bg: string;
  deepLink: string;
  playStore: string;
}

export interface PharmaOption {
  name: string;
  price: number;
  logo: string;
  bg: string;
  deepLink: string;
  playStore: string;
}
