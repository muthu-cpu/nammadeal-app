// Offer TIPS per platform — no hardcoded promo codes (they expire).
// These are evergreen tips based on each app's known programs.

export interface OfferTip {
  label: string;
  tip: string;
  icon: string;
  color: string;
}

export const OFFER_TIPS: Record<string, OfferTip[]> = {
  // ── Rides ──────────────────────────────────────────────────
  uber: [
    { icon: '🆕', tip: 'First ride discount for new users — check Offers tab in app', label: 'New User', color: '#1A1A1A' },
    { icon: '💳', tip: 'Pay via UPI first time for extra cashback from your UPI app', label: 'UPI Cashback', color: '#1A1A1A' },
  ],
  ola: [
    { icon: '🆕', tip: 'New users get flat discount on first 3 rides', label: 'New User', color: '#00C853' },
    { icon: '💳', tip: 'Ola Money wallet often has cashback on top-up', label: 'Wallet Offer', color: '#00C853' },
  ],
  rapido: [
    { icon: '🏷️', tip: 'Rapido is usually 30–50% cheaper than Uber/Ola for bikes', label: 'Already Cheap', color: '#FFD700' },
    { icon: '🆕', tip: 'New user? First ride often has a discount — check Home screen', label: 'New User', color: '#FFD700' },
  ],
  'namma yatri': [
    { icon: '🆓', tip: 'Zero commission app — drivers quote directly, no surge', label: 'Zero Surge', color: '#22C55E' },
    { icon: '🏅', tip: 'Check Home screen for daily promo rides', label: 'Daily Promo', color: '#22C55E' },
  ],

  // ── Grocery ────────────────────────────────────────────────
  blinkit: [
    { icon: '🆕', tip: 'New user? First 2 orders often have flat discount', label: 'New User', color: '#FFD700' },
    { icon: '💳', tip: 'Pay via specific bank cards for 5–10% instant discount', label: 'Bank Offer', color: '#FFD700' },
  ],
  zepto: [
    { icon: '🆕', tip: 'First order discount available — check banner on app home', label: 'First Order', color: '#7C3AED' },
    { icon: '💳', tip: 'UPI payments sometimes have extra cashback via NPCI', label: 'UPI Cashback', color: '#7C3AED' },
  ],
  bigbasket: [
    { icon: '📅', tip: 'Subscribe & Save up to 20% on weekly staples', label: 'Subscribe & Save', color: '#84C225' },
    { icon: '💳', tip: 'BigBasket Wallet top-up sometimes offers bonus credits', label: 'Wallet Bonus', color: '#84C225' },
  ],

  // ── Food ───────────────────────────────────────────────────
  swiggy: [
    { icon: '🆕', tip: 'New users typically get free delivery on first 3 orders', label: 'New User', color: '#FC8019' },
    { icon: '💳', tip: 'Swiggy One subscription saves delivery fees on every order', label: 'Swiggy One', color: '#FC8019' },
  ],
  zomato: [
    { icon: '🆕', tip: 'New users often get flat discount on first order', label: 'New User', color: '#E23744' },
    { icon: '💳', tip: 'Zomato Gold gives unlimited free delivery + member discounts', label: 'Zomato Gold', color: '#E23744' },
  ],

  // ── Pharma ─────────────────────────────────────────────────
  '1mg': [
    { icon: '💊', tip: '1mg usually gives 15–25% off on generic medicines', label: 'Generic Discount', color: '#E61B23' },
    { icon: '🆕', tip: 'New users get extra 15% off on first order', label: 'New User', color: '#E61B23' },
  ],
  pharmeasy: [
    { icon: '💊', tip: 'PharmEasy often beats 1mg on branded medicine prices', label: 'Best Price', color: '#E91E63' },
    { icon: '💳', tip: 'Subscribe to PharmEasy Plus for guaranteed savings', label: 'Plus Plan', color: '#E91E63' },
  ],
};

export function getTips(platform: string): OfferTip[] {
  const key = platform.toLowerCase().trim();
  return OFFER_TIPS[key] || [];
}
