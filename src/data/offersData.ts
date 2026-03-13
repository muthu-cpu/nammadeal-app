import { Offer } from '../store/types';

export const OFFERS: Offer[] = [
  { cat: 'rides',   platform: 'Rapido',      logo: 'R',  bg: 'rgba(255,215,0,.1)',   desc: 'Flat Rs 50 off on first bike ride',             disc: 'Rs 50 OFF',   max: 'Max Rs 50',   code: 'RAPIDO50',   valid: 'Till 31 Mar 2026' },
  { cat: 'rides',   platform: 'Ola',         logo: 'O',  bg: 'rgba(0,200,83,.1)',    desc: '25% off on first 3 rides via UPI',               disc: '25% OFF',     max: 'Max Rs 75',   code: 'OLAUPI25',   valid: 'Till 15 Apr 2026' },
  { cat: 'rides',   platform: 'Uber',        logo: 'U',  bg: 'rgba(255,255,255,.07)',desc: 'Rs 100 off on airport rides',                   disc: 'Rs 100 OFF',  max: 'Max Rs 100',  code: 'UBERBLR100', valid: 'Till 30 Mar 2026' },
  { cat: 'grocery', platform: 'Blinkit',     logo: 'BL', bg: 'rgba(240,193,42,.1)',  desc: '20% off on first order over Rs 299',            disc: '20% OFF',     max: 'Max Rs 80',   code: 'BLINK20',    valid: 'Till 20 Apr 2026' },
  { cat: 'grocery', platform: 'Zepto',       logo: 'Z',  bg: 'rgba(124,58,237,.1)',  desc: 'Rs 75 off on groceries over Rs 399',            disc: 'Rs 75 OFF',   max: 'Max Rs 75',   code: 'ZEPTO75',    valid: 'Till 25 Mar 2026' },
  { cat: 'grocery', platform: 'BigBasket',   logo: 'BB', bg: 'rgba(132,194,37,.1)',  desc: '15% off on fresh produce over Rs 499',          disc: '15% OFF',     max: 'Max Rs 60',   code: 'BBFRESH15',  valid: 'Till 10 Apr 2026' },
  { cat: 'food',    platform: 'Swiggy',      logo: 'SW', bg: 'rgba(252,128,25,.1)',  desc: '60% off up to Rs 120 on weekends',              disc: '60% OFF',     max: 'Max Rs 120',  code: 'SWIGGY60',   valid: 'Sat-Sun only' },
  { cat: 'food',    platform: 'Zomato',      logo: 'ZO', bg: 'rgba(239,68,68,.1)',   desc: 'Rs 150 off on orders above Rs 499',             disc: 'Rs 150 OFF',  max: 'Max Rs 150',  code: 'ZOMATO150',  valid: 'Till 31 Mar 2026' },
  { cat: 'pharma',  platform: '1mg',         logo: '1M', bg: 'rgba(230,27,35,.1)',   desc: '25% off on all medicines',                       disc: '25% OFF',     max: 'Max Rs 200',  code: '1MGBLR25',   valid: 'Till 5 Apr 2026' },
  { cat: 'pharma',  platform: 'PharmEasy',   logo: 'PE', bg: 'rgba(233,30,99,.1)',   desc: 'Flat Rs 100 off on Rs 599+',                    disc: 'Rs 100 OFF',  max: 'Max Rs 100',  code: 'PE100BLR',   valid: 'Till 28 Mar 2026' },
  { cat: 'travels', platform: 'RedBus',      logo: 'RB', bg: 'rgba(220,38,38,.1)',   desc: 'Rs 150 off on first bus booking',               disc: 'Rs 150 OFF',  max: 'Max Rs 150',  code: 'REDBLR150',  valid: 'Till 30 Apr 2026' },
  { cat: 'travels', platform: 'AbhiBus',     logo: 'AB', bg: 'rgba(234,88,12,.1)',   desc: '12% off on all AC sleepers',                     disc: '12% OFF',     max: 'Max Rs 120',  code: 'ABHI12BLR',  valid: 'Till 15 Apr 2026' },
  { cat: 'travels', platform: 'MakeMyTrip',  logo: 'MM', bg: 'rgba(37,99,235,.1)',   desc: 'Rs 200 off on train bookings',                  disc: 'Rs 200 OFF',  max: 'Max Rs 200',  code: 'MMTRAIN200', valid: 'New users' },
  { cat: 'travels', platform: 'GoIbibo',     logo: 'GI', bg: 'rgba(22,163,74,.1)',   desc: '10% off on weekend bus trips',                   disc: '10% OFF',     max: 'Max Rs 100',  code: 'GOBUS10',    valid: 'Sat-Sun only' },
];
