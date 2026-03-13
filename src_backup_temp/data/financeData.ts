import { FinanceProduct } from '../store/types';

export const FIN_DATA: Record<string, FinanceProduct[]> = {
  loans: [
    { name: 'HDFC Bank',     rate: '11.8%', logo: 'HB', meta: 'Processing Rs 999 - 12-60 mo',       bg: 'rgba(0,100,200,.1)',   tags: ['EMI ~Rs 1,620/mo', 'Instant'],    deepLink: 'hdfcbank://loan',        playStore: 'https://play.google.com/store/apps/details?id=com.snapwork.hdfc' },
    { name: 'Axis Bank',     rate: '12.5%', logo: 'AX', meta: 'Processing Rs 1,499 - 12-60 mo',     bg: 'rgba(150,0,50,.1)',    tags: ['EMI ~Rs 1,680/mo', 'Online'],     deepLink: 'axisbank://loan',        playStore: 'https://play.google.com/store/apps/details?id=com.axis.mobile' },
    { name: 'Bajaj Finserv', rate: '13.0%', logo: 'BF', meta: 'Zero processing fee - 3-84 mo',      bg: 'rgba(0,150,80,.1)',    tags: ['EMI ~Rs 1,720/mo', 'Rs 0 fee'],   deepLink: 'bajajfinserv://loan',    playStore: 'https://play.google.com/store/apps/details?id=org.altruist.BajajExperia' },
  ],
  fd: [
    { name: 'Bajaj Finance',  rate: '8.1%', logo: 'BF', meta: 'Min Rs 15,000 - NBFC',              bg: 'rgba(0,150,80,.1)',    tags: ['Highest Rate', 'Senior +0.4%'],   deepLink: 'bajajfinserv://fd',      playStore: 'https://play.google.com/store/apps/details?id=org.altruist.BajajExperia' },
    { name: 'IDFC First',     rate: '7.5%', logo: 'IF', meta: 'Min Rs 10,000 - Bank',              bg: 'rgba(59,130,246,.1)',  tags: ['DICGC Insured', 'Safe'],          deepLink: 'idfcbank://fd',          playStore: 'https://play.google.com/store/apps/details?id=com.idfcbank' },
    { name: 'SBI',            rate: '6.8%', logo: 'SB', meta: 'Min Rs 1,000 - Govt Bank',          bg: 'rgba(30,100,30,.1)',   tags: ['Govt backed', 'Safest'],          deepLink: 'sbi://fd',               playStore: 'https://play.google.com/store/apps/details?id=com.sbi.SBIFreedomPlus' },
  ],
  insurance: [
    { name: 'Bajaj Allianz',  rate: 'Rs 7,800', logo: 'BA', meta: 'Car - Rs 5L cover - 96% claim', bg: 'rgba(0,150,80,.1)',    tags: ['Best Price', 'Fast claim'],       deepLink: 'bajajallianz://insurance',playStore: 'https://play.google.com/store/apps/details?id=com.bajajallianz' },
    { name: 'HDFC Ergo',      rate: 'Rs 8,200', logo: 'HE', meta: 'Car - Rs 5L cover - 98% claim', bg: 'rgba(0,100,200,.1)',   tags: ['Cashless', '24x7'],               deepLink: 'hdfcergo://insurance',   playStore: 'https://play.google.com/store/apps/details?id=com.hdfcergo' },
    { name: 'Tata AIG',       rate: 'Rs 8,500', logo: 'TA', meta: 'Car - Rs 5L cover - 97% claim', bg: 'rgba(200,0,0,.1)',     tags: ['Wide network', 'Trusted'],        deepLink: 'tataaig://insurance',    playStore: 'https://play.google.com/store/apps/details?id=com.tataaig' },
  ],
  cards: [
    { name: 'Amazon Pay ICICI',rate: '5% back',     logo: 'AP', meta: 'Amazon - No annual fee',       bg: 'rgba(255,153,0,.1)',   tags: ['Free card', 'Best cashback'],     deepLink: 'amazon://cards',         playStore: 'https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping' },
    { name: 'HDFC Millennia',  rate: '5% cashback', logo: 'HM', meta: 'Online spends - Rs 1,000/yr',  bg: 'rgba(0,100,200,.1)',   tags: ['Flipkart too', 'Lounge'],         deepLink: 'hdfcbank://cards',       playStore: 'https://play.google.com/store/apps/details?id=com.snapwork.hdfc' },
    { name: 'Axis Ace',        rate: '5% bills',    logo: 'AA', meta: 'Bill payments - Rs 499/yr',    bg: 'rgba(150,0,50,.1)',    tags: ['Google Pay', 'Low fee'],          deepLink: 'axisbank://cards',       playStore: 'https://play.google.com/store/apps/details?id=com.axis.mobile' },
  ],
  sip: [
    { name: 'Parag Parikh Flexi Cap', rate: '21.5%', logo: 'PP', meta: '5yr CAGR - Medium risk', bg: 'rgba(59,130,246,.1)',  tags: ['Top pick', 'Global stocks'],      deepLink: 'groww://fund',           playStore: 'https://play.google.com/store/apps/details?id=com.nextbillion.groww' },
    { name: 'Mirae Asset Large Cap',  rate: '18.2%', logo: 'MA', meta: '5yr CAGR - Low risk',    bg: 'rgba(34,197,94,.1)',   tags: ['Stable', 'Large cap'],            deepLink: 'groww://fund',           playStore: 'https://play.google.com/store/apps/details?id=com.nextbillion.groww' },
    { name: 'Axis Small Cap',         rate: '24.1%', logo: 'AS', meta: '5yr CAGR - High risk',   bg: 'rgba(245,166,35,.1)',  tags: ['High return', 'High risk'],       deepLink: 'kite://fund',            playStore: 'https://play.google.com/store/apps/details?id=com.zerodha.kite3' },
  ],
};

export const FIN_LABELS: Record<string, string> = {
  loans:     'Best Personal Loans',
  fd:        'Best FD Rates',
  insurance: 'Best Insurance',
  cards:     'Best Credit Cards',
  sip:       'Top Mutual Funds',
};

export const FIN_CATEGORIES = [
  { key: 'loans',     label: 'Loans' },
  { key: 'fd',        label: 'FD' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'cards',     label: 'Cards' },
  { key: 'sip',       label: 'Funds' },
];
