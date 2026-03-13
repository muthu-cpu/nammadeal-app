import { BusOption } from '../store/types';

export const BUSES: Record<string, BusOption[]> = {
  'Bengaluru-Chennai': [
    { op: 'RedBus',     name: 'VRL Travels',       type: 'AC Sleeper',      dep: '21:00', arr: '05:30', dur: '8h 30m', seats: 12, rating: 4.3, price: 750, logo: 'red', bg: 'rgba(220,38,38,.1)',  deepLink: 'redbus://search',    playStore: 'https://play.google.com/store/apps/details?id=in.redbus.android' },
    { op: 'AbhiBus',    name: 'SRS Travels',       type: 'AC Sleeper',      dep: '22:00', arr: '06:00', dur: '8h 00m', seats: 5,  rating: 4.1, price: 699, logo: 'org', bg: 'rgba(234,88,12,.1)',  deepLink: 'abhibus://search',   playStore: 'https://play.google.com/store/apps/details?id=com.abhibus' },
    { op: 'MakeMyTrip', name: 'Orange Travels',    type: 'Non-AC Sleeper',  dep: '20:30', arr: '05:00', dur: '8h 30m', seats: 22, rating: 3.9, price: 450, logo: 'blu', bg: 'rgba(37,99,235,.1)',  deepLink: 'makemytrip://bus',   playStore: 'https://play.google.com/store/apps/details?id=com.makemytrip' },
    { op: 'GoIbibo',    name: 'Chartered Speed',   type: 'AC Semi-Sleeper', dep: '23:00', arr: '07:30', dur: '8h 30m', seats: 8,  rating: 4.0, price: 620, logo: 'grn', bg: 'rgba(22,163,74,.1)',  deepLink: 'goibibo://bus',      playStore: 'https://play.google.com/store/apps/details?id=com.goibibo' },
    { op: 'KSRTC',      name: 'KSRTC Airavat',     type: 'AC Multi-Axle',  dep: '19:00', arr: '04:00', dur: '9h 00m', seats: 18, rating: 4.5, price: 850, logo: 'gov', bg: 'rgba(109,40,217,.1)', deepLink: 'ksrtc://book',       playStore: 'https://play.google.com/store/apps/details?id=in.ksrtconline.android' },
  ],
  'Bengaluru-Hyderabad': [
    { op: 'RedBus',     name: 'VRL Travels',       type: 'AC Sleeper',      dep: '20:00', arr: '07:00', dur: '11h',    seats: 7,  rating: 4.2, price: 950, logo: 'red', bg: 'rgba(220,38,38,.1)',  deepLink: 'redbus://search',    playStore: 'https://play.google.com/store/apps/details?id=in.redbus.android' },
    { op: 'AbhiBus',    name: 'Kallada Travels',   type: 'AC Sleeper',      dep: '19:30', arr: '06:00', dur: '10h 30m',seats: 3,  rating: 4.4, price: 899, logo: 'org', bg: 'rgba(234,88,12,.1)',  deepLink: 'abhibus://search',   playStore: 'https://play.google.com/store/apps/details?id=com.abhibus' },
    { op: 'MakeMyTrip', name: 'SRS Travels',       type: 'Non-AC Sleeper',  dep: '21:00', arr: '07:00', dur: '10h',    seats: 15, rating: 3.8, price: 550, logo: 'blu', bg: 'rgba(37,99,235,.1)',  deepLink: 'makemytrip://bus',   playStore: 'https://play.google.com/store/apps/details?id=com.makemytrip' },
    { op: 'TSRTC',      name: 'TSRTC Garuda Plus', type: 'AC Volvo',        dep: '22:00', arr: '08:00', dur: '10h',    seats: 20, rating: 4.3, price: 780, logo: 'gov', bg: 'rgba(109,40,217,.1)', deepLink: 'tsrtc://book',       playStore: 'https://play.google.com/store/apps/details?id=in.tsrtconline.android' },
  ],
  'Bengaluru-Mysuru': [
    { op: 'RedBus',     name: 'KSRTC Express',    type: 'AC Seater',        dep: '07:00', arr: '09:30', dur: '2h 30m', seats: 30, rating: 4.6, price: 180, logo: 'red', bg: 'rgba(220,38,38,.1)',  deepLink: 'redbus://search',    playStore: 'https://play.google.com/store/apps/details?id=in.redbus.android' },
    { op: 'AbhiBus',    name: 'SRM Travels',      type: 'Non-AC Seater',    dep: '08:00', arr: '10:30', dur: '2h 30m', seats: 25, rating: 4.0, price: 130, logo: 'org', bg: 'rgba(234,88,12,.1)',  deepLink: 'abhibus://search',   playStore: 'https://play.google.com/store/apps/details?id=com.abhibus' },
    { op: 'GoIbibo',    name: 'Kallada Mini',     type: 'AC Seater',        dep: '09:00', arr: '11:30', dur: '2h 30m', seats: 12, rating: 4.2, price: 160, logo: 'grn', bg: 'rgba(22,163,74,.1)',  deepLink: 'goibibo://bus',      playStore: 'https://play.google.com/store/apps/details?id=com.goibibo' },
    { op: 'KSRTC',      name: 'KSRTC Rajahamsa', type: 'AC Multi-Axle',    dep: '06:30', arr: '09:00', dur: '2h 30m', seats: 40, rating: 4.5, price: 200, logo: 'gov', bg: 'rgba(109,40,217,.1)', deepLink: 'ksrtc://book',       playStore: 'https://play.google.com/store/apps/details?id=in.ksrtconline.android' },
  ],
};

export const BUS_LOGOS: Record<string, string> = {
  red: '\u{1F534}', org: '\u{1F7E0}', blu: '\u{1F535}', grn: '\u{1F7E2}', gov: '\u{1F3DB}\uFE0F',
};

export const POPULAR_ROUTES = [
  { label: 'Chennai',    from: 'Bengaluru', to: 'Chennai' },
  { label: 'Hyderabad',  from: 'Bengaluru', to: 'Hyderabad' },
  { label: 'Mysuru',     from: 'Bengaluru', to: 'Mysuru' },
  { label: 'Goa',        from: 'Bengaluru', to: 'Goa' },
  { label: 'Coimbatore', from: 'Bengaluru', to: 'Coimbatore' },
  { label: 'Pune',       from: 'Bengaluru', to: 'Pune' },
  { label: 'Mumbai',     from: 'Bengaluru', to: 'Mumbai' },
  { label: 'Kochi',      from: 'Bengaluru', to: 'Kochi' },
];
