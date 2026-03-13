export interface AppLink {
  scheme: string;
  store: string;
}

export const DeepLinks: Record<string, AppLink> = {
  rapido:     { scheme: 'in.rapido.app://', store: 'https://play.google.com/store/apps/details?id=com.rapido.passenger' },
  nammaYatri: { scheme: 'yatri://',         store: 'https://play.google.com/store/apps/details?id=net.openkochi.yatri' },
  ola:        { scheme: 'olacabs://',       store: 'https://play.google.com/store/apps/details?id=com.ani.ola' },
  uber:       { scheme: 'uber://',          store: 'https://play.google.com/store/apps/details?id=com.ubercab' },
  blinkit:    { scheme: 'blinkit://',       store: 'https://play.google.com/store/apps/details?id=com.blinkit.android' },
  zepto:      { scheme: 'zepto://',         store: 'https://play.google.com/store/apps/details?id=com.zepto.app' },
  swiggy:     { scheme: 'swiggy://',        store: 'https://play.google.com/store/apps/details?id=in.swiggy.android' },
  zomato:     { scheme: 'zomato://',        store: 'https://play.google.com/store/apps/details?id=com.application.zomato' },
  bigbasket:  { scheme: 'bigbasket://',     store: 'https://play.google.com/store/apps/details?id=com.bigbasket' },
  jiomart:    { scheme: 'jiomart://',       store: 'https://play.google.com/store/apps/details?id=com.jiomart' },
  dmart:      { scheme: 'dmart://',         store: 'https://play.google.com/store/apps/details?id=com.avenuee.superstores.dmart' },
  redbus:     { scheme: 'redbus://',        store: 'https://play.google.com/store/apps/details?id=in.redbus.android' },
  abhibus:    { scheme: 'abhibus://',       store: 'https://play.google.com/store/apps/details?id=com.abhibus' },
  makemytrip: { scheme: 'makemytrip://',   store: 'https://play.google.com/store/apps/details?id=com.makemytrip' },
  goibibo:    { scheme: 'goibibo://',       store: 'https://play.google.com/store/apps/details?id=com.goibibo' },
  ksrtc:      { scheme: 'ksrtc://',         store: 'https://play.google.com/store/apps/details?id=in.ksrtconline.android' },
  tsrtc:      { scheme: 'tsrtc://',         store: 'https://play.google.com/store/apps/details?id=in.tsrtconline.android' },
  onemg:      { scheme: 'tata1mg://',      store: 'https://play.google.com/store/apps/details?id=com.aranoah.healthkart.plus' },
  pharmeasy:  { scheme: 'pharmeasy://',    store: 'https://play.google.com/store/apps/details?id=in.pharmeasy.android' },
  apollo247:  { scheme: 'apollo247://',    store: 'https://play.google.com/store/apps/details?id=com.apolloPharmacy.prod' },
  netmeds:    { scheme: 'netmeds://',      store: 'https://play.google.com/store/apps/details?id=com.netmeds.android' },
  groww:      { scheme: 'groww://',         store: 'https://play.google.com/store/apps/details?id=com.nextbillion.groww' },
  kite:       { scheme: 'kite://',          store: 'https://play.google.com/store/apps/details?id=com.zerodha.kite3' },
};
