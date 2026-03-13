import { GroceryProduct } from '../store/types';

// ── Helper to build platform entry ─────────────────────────────
const p = (label: string, cls: string, price: number, size: string, perUnit: string, q: string) => ({
  label, cls, price, size, perUnit,
  deepLink:  `${cls === 'instamart' ? 'swiggy' : cls === 'jiomart' ? 'jiomart' : cls}://search?q=${encodeURIComponent(q)}`,
  playStore: {
    blinkit:   'https://play.google.com/store/apps/details?id=com.blinkit.android',
    zepto:     'https://play.google.com/store/apps/details?id=com.zepto.app',
    instamart: 'https://play.google.com/store/apps/details?id=in.swiggy.android',
    bigbasket: 'https://play.google.com/store/apps/details?id=com.bigbasket',
    jiomart:   'https://play.google.com/store/apps/details?id=com.jiomart',
    dmart:     'https://play.google.com/store/apps/details?id=com.avenuee.superstores.dmart',
  }[cls] || 'https://play.google.com/store',
});

export const GDB: Record<string, GroceryProduct[]> = {

  // ─── MILK ────────────────────────────────────────────────────
  milk: [
    { name: 'Amul Gold Full Cream Milk', emoji: 'milk', platforms: [
      p('Blinkit', 'blinkit', 33, '500ml', '₹66/L', 'Amul Gold Milk 500ml'),
      p('Zepto',   'zepto',   33, '500ml', '₹66/L', 'Amul Gold Milk 500ml'),
      p('Instamart','instamart',34,'500ml', '₹68/L', 'Amul Gold Milk 500ml'),
      p('BigBasket','bigbasket',35,'500ml', '₹70/L', 'Amul Gold Milk 500ml'),
    ]},
    { name: 'Amul Gold Full Cream Milk', emoji: 'milk', platforms: [
      p('Blinkit', 'blinkit', 62, '1L',    '₹62/L', 'Amul Gold Milk 1L'),
      p('Zepto',   'zepto',   62, '1L',    '₹62/L', 'Amul Gold Milk 1L'),
      p('Instamart','instamart',64,'1L',   '₹64/L', 'Amul Gold Milk 1L'),
      p('BigBasket','bigbasket',65,'1L',   '₹65/L', 'Amul Gold Milk 1L'),
    ]},
    { name: 'Amul Gold Full Cream Milk 2L', emoji: 'milk', platforms: [
      p('Blinkit', 'blinkit', 120,'2L',   '₹60/L', 'Amul Gold Milk 2L'),
      p('Instamart','instamart',122,'2L',  '₹61/L', 'Amul Gold Milk 2L'),
      p('BigBasket','bigbasket',125,'2L',  '₹62/L', 'Amul Gold Milk 2L'),
    ]},
    { name: 'Mother Dairy Full Cream Milk', emoji: 'milk', platforms: [
      p('Blinkit', 'blinkit', 31, '500ml', '₹62/L', 'Mother Dairy Milk 500ml'),
      p('BigBasket','bigbasket',32,'500ml', '₹64/L', 'Mother Dairy Milk 500ml'),
      p('Zepto',   'zepto',   32, '500ml', '₹64/L', 'Mother Dairy Milk 500ml'),
    ]},
    { name: 'Nandini Milk', emoji: 'milk', platforms: [
      p('BigBasket','bigbasket',26,'500ml', '₹52/L', 'Nandini Milk 500ml'),
      p('Blinkit', 'blinkit', 28, '500ml', '₹56/L', 'Nandini Milk 500ml'),
    ]},
    { name: 'Jersey Smart Milk (Toned)', emoji: 'milk', platforms: [
      p('BigBasket','bigbasket',24,'500ml', '₹48/L', 'Jersey Toned Milk'),
      p('Zepto',   'zepto',   25, '500ml', '₹50/L', 'Jersey Toned Milk'),
    ]},
  ],

  // ─── EGGS ────────────────────────────────────────────────────
  eggs: [
    { name: 'Farm Fresh White Eggs', emoji: 'eggs', platforms: [
      p('BigBasket','bigbasket',66,'6pcs','₹11/egg','Fresh White Eggs 6pcs'),
      p('Zepto',   'zepto',   69, '6pcs','₹11.5/egg','White Eggs 6pcs'),
      p('Blinkit', 'blinkit', 72, '6pcs','₹12/egg','Eggs 6pcs'),
      p('Instamart','instamart',75,'6pcs','₹12.5/egg','Eggs 6pcs'),
    ]},
    { name: 'Farm Fresh White Eggs 12pcs', emoji: 'eggs', platforms: [
      p('BigBasket','bigbasket',128,'12pcs','₹10.6/egg','Fresh Eggs 12pcs'),
      p('Zepto',   'zepto',   132, '12pcs','₹11/egg','Eggs 12pcs'),
      p('Blinkit', 'blinkit', 138, '12pcs','₹11.5/egg','Eggs 12pcs'),
    ]},
    { name: 'Brown Eggs (Free Range)', emoji: 'eggs', platforms: [
      p('BigBasket','bigbasket',80,'6pcs','₹13.3/egg','Brown Eggs 6pcs'),
      p('Zepto',   'zepto',   85, '6pcs','₹14.2/egg','Brown Eggs 6pcs'),
      p('Blinkit', 'blinkit', 89, '6pcs','₹14.8/egg','Brown Eggs 6pcs'),
    ]},
  ],

  // ─── PANEER ──────────────────────────────────────────────────
  paneer: [
    { name: 'Milky Mist Paneer', emoji: 'paneer', platforms: [
      p('BigBasket','bigbasket',95, '200g','₹0.47/g','Milky Mist Paneer 200g'),
      p('JioMart', 'jiomart',  99, '200g','₹0.49/g','Milky Mist Paneer 200g'),
      p('Zepto',   'zepto',   102, '200g','₹0.51/g','Paneer 200g'),
      p('Blinkit', 'blinkit', 105, '200g','₹0.52/g','Paneer 200g'),
    ]},
    { name: 'Amul Fresh Paneer', emoji: 'paneer', platforms: [
      p('BigBasket','bigbasket',99, '200g','₹0.49/g','Amul Paneer 200g'),
      p('Blinkit', 'blinkit', 102, '200g','₹0.51/g','Amul Paneer 200g'),
      p('Zepto',   'zepto',   104, '200g','₹0.52/g','Amul Paneer 200g'),
    ]},
    { name: 'Milky Mist Paneer 500g', emoji: 'paneer', platforms: [
      p('BigBasket','bigbasket',219,'500g','₹0.44/g','Milky Mist Paneer 500g'),
      p('Zepto',   'zepto',   225, '500g','₹0.45/g','Paneer 500g'),
      p('Blinkit', 'blinkit', 235, '500g','₹0.47/g','Paneer 500g'),
    ]},
  ],

  // ─── CURD ────────────────────────────────────────────────────
  curd: [
    { name: 'Amul Masti Dahi', emoji: 'curd', platforms: [
      p('BigBasket','bigbasket',38,'400g','₹0.09/g','Amul Masti Dahi 400g'),
      p('Zepto',   'zepto',   40, '400g','₹0.10/g','Amul Dahi 400g'),
      p('Blinkit', 'blinkit', 42, '400g','₹0.10/g','Amul Dahi 400g'),
    ]},
    { name: 'Amul Masti Dahi 1kg', emoji: 'curd', platforms: [
      p('BigBasket','bigbasket',89,'1kg','₹89/kg','Amul Masti Dahi 1kg'),
      p('Zepto',   'zepto',   92, '1kg','₹92/kg','Dahi 1kg'),
      p('Blinkit', 'blinkit', 95, '1kg','₹95/kg','Dahi 1kg'),
    ]},
    { name: 'Nandini Curd', emoji: 'curd', platforms: [
      p('BigBasket','bigbasket',34,'500g','₹68/kg','Nandini Curd 500g'),
      p('Blinkit', 'blinkit', 36, '500g','₹72/kg','Nandini Curd 500g'),
    ]},
  ],

  // ─── RICE ────────────────────────────────────────────────────
  rice: [
    { name: 'India Gate Basmati Rice', emoji: 'rice', platforms: [
      p('DMart',   'dmart',   159,'1kg','₹159/kg','India Gate Basmati 1kg'),
      p('BigBasket','bigbasket',165,'1kg','₹165/kg','India Gate Basmati 1kg'),
      p('Blinkit', 'blinkit', 170,'1kg','₹170/kg','India Gate Basmati 1kg'),
      p('Zepto',   'zepto',   178,'1kg','₹178/kg','India Gate Basmati 1kg'),
    ]},
    { name: 'India Gate Basmati Rice 5kg', emoji: 'rice', platforms: [
      p('DMart',   'dmart',   695,'5kg','₹139/kg','India Gate Basmati 5kg'),
      p('BigBasket','bigbasket',720,'5kg','₹144/kg','India Gate Basmati 5kg'),
      p('JioMart', 'jiomart', 699,'5kg','₹139.8/kg','India Gate Basmati 5kg'),
    ]},
    { name: 'Sona Masoori Rice', emoji: 'rice', platforms: [
      p('BigBasket','bigbasket',65,'1kg','₹65/kg','Sona Masoori Rice 1kg'),
      p('DMart',   'dmart',   62, '1kg','₹62/kg','Sona Masoori Rice 1kg'),
      p('Blinkit', 'blinkit', 68, '1kg','₹68/kg','Sona Masoori Rice 1kg'),
    ]},
    { name: 'Brown Rice', emoji: 'rice', platforms: [
      p('BigBasket','bigbasket',110,'1kg','₹110/kg','Brown Rice 1kg'),
      p('Zepto',   'zepto',   115,'1kg','₹115/kg','Brown Rice 1kg'),
      p('Blinkit', 'blinkit', 119,'1kg','₹119/kg','Brown Rice 1kg'),
    ]},
  ],

  // ─── BREAD ───────────────────────────────────────────────────
  bread: [
    { name: 'Britannia Atta Bread', emoji: 'bread', platforms: [
      p('BigBasket','bigbasket',36,'400g','₹0.09/g','Britannia Atta Bread'),
      p('Zepto',   'zepto',   38, '400g','₹0.095/g','Britannia Atta Bread'),
      p('Blinkit', 'blinkit', 40, '400g','₹0.10/g','Britannia Atta Bread'),
    ]},
    { name: 'Britannia Brown Bread', emoji: 'bread', platforms: [
      p('BigBasket','bigbasket',38,'400g','₹0.095/g','Britannia Brown Bread'),
      p('Zepto',   'zepto',   40, '400g','₹0.10/g','Britannia Brown Bread'),
      p('Blinkit', 'blinkit', 42, '400g','₹0.105/g','Britannia Brown Bread'),
    ]},
    { name: 'Modern White Sandwich Bread', emoji: 'bread', platforms: [
      p('BigBasket','bigbasket',32,'400g','₹0.08/g','Modern Bread 400g'),
      p('Zepto',   'zepto',   34, '400g','₹0.085/g','Modern Bread 400g'),
      p('Blinkit', 'blinkit', 35, '400g','₹0.087/g','Modern Bread 400g'),
    ]},
  ],

  // ─── TOMATO ──────────────────────────────────────────────────
  tomato: [
    { name: 'Fresh Tomatoes', emoji: 'tomato', platforms: [
      p('BigBasket','bigbasket',27,'500g','₹54/kg','Tomato 500g'),
      p('Zepto',   'zepto',   29, '500g','₹58/kg','Tomato 500g'),
      p('Blinkit', 'blinkit', 32, '500g','₹64/kg','Tomato 500g'),
    ]},
    { name: 'Fresh Tomatoes 1kg', emoji: 'tomato', platforms: [
      p('BigBasket','bigbasket',52,'1kg','₹52/kg','Tomato 1kg'),
      p('Zepto',   'zepto',   55, '1kg','₹55/kg','Tomato 1kg'),
      p('Blinkit', 'blinkit', 60, '1kg','₹60/kg','Tomato 1kg'),
    ]},
    { name: 'Cherry Tomatoes', emoji: 'tomato', platforms: [
      p('BigBasket','bigbasket',79,'250g','₹316/kg','Cherry Tomato 250g'),
      p('Zepto',   'zepto',   85, '250g','₹340/kg','Cherry Tomato 250g'),
    ]},
  ],

  // ─── ONION ───────────────────────────────────────────────────
  onion: [
    { name: 'Fresh Onions', emoji: 'onion', platforms: [
      p('BigBasket','bigbasket',35,'1kg','₹35/kg','Onion 1kg'),
      p('Zepto',   'zepto',   37, '1kg','₹37/kg','Onion 1kg'),
      p('Blinkit', 'blinkit', 39, '1kg','₹39/kg','Onion 1kg'),
    ]},
    { name: 'Fresh Onions 2kg', emoji: 'onion', platforms: [
      p('BigBasket','bigbasket',68,'2kg','₹34/kg','Onion 2kg'),
      p('Zepto',   'zepto',   72, '2kg','₹36/kg','Onion 2kg'),
      p('Blinkit', 'blinkit', 75, '2kg','₹37.5/kg','Onion 2kg'),
    ]},
    { name: 'Premium Nashik Onion', emoji: 'onion', platforms: [
      p('BigBasket','bigbasket',45,'1kg','₹45/kg','Nashik Onion 1kg'),
      p('JioMart', 'jiomart', 42, '1kg','₹42/kg','Nashik Onion 1kg'),
    ]},
  ],

  // ─── BUTTER ──────────────────────────────────────────────────
  butter: [
    { name: 'Amul Butter', emoji: 'butter', platforms: [
      p('JioMart', 'jiomart',  52,'100g','₹0.52/g','Amul Butter 100g'),
      p('BigBasket','bigbasket',54,'100g','₹0.54/g','Amul Butter 100g'),
      p('Blinkit', 'blinkit',  56,'100g','₹0.56/g','Amul Butter 100g'),
      p('Zepto',   'zepto',    57,'100g','₹0.57/g','Amul Butter 100g'),
    ]},
    { name: 'Amul Butter 500g', emoji: 'butter', platforms: [
      p('JioMart', 'jiomart',  245,'500g','₹0.49/g','Amul Butter 500g'),
      p('BigBasket','bigbasket',255,'500g','₹0.51/g','Amul Butter 500g'),
      p('Blinkit', 'blinkit',  259,'500g','₹0.52/g','Amul Butter 500g'),
    ]},
    { name: 'Britannia Butter', emoji: 'butter', platforms: [
      p('BigBasket','bigbasket',50,'100g','₹0.50/g','Britannia Butter 100g'),
      p('Zepto',   'zepto',   52, '100g','₹0.52/g','Britannia Butter 100g'),
      p('Blinkit', 'blinkit', 54, '100g','₹0.54/g','Britannia Butter 100g'),
    ]},
  ],

  // ─── CHICKEN ─────────────────────────────────────────────────
  chicken: [
    { name: 'Fresho Chicken Curry Cut', emoji: 'chicken', platforms: [
      p('BigBasket','bigbasket',199,'500g','₹398/kg','Fresho Chicken Curry Cut 500g'),
      p('Zepto',   'zepto',   209, '500g','₹418/kg','Chicken Curry Cut 500g'),
      p('Blinkit', 'blinkit', 215, '500g','₹430/kg','Chicken Curry Cut 500g'),
    ]},
    { name: 'Fresh Chicken Breast', emoji: 'chicken', platforms: [
      p('BigBasket','bigbasket',229,'500g','₹458/kg','Chicken Breast 500g'),
      p('Zepto',   'zepto',   245, '500g','₹490/kg','Chicken Breast 500g'),
      p('Blinkit', 'blinkit', 249, '500g','₹498/kg','Chicken Breast 500g'),
    ]},
    { name: 'Fresho Chicken Whole', emoji: 'chicken', platforms: [
      p('BigBasket','bigbasket',349,'1kg','₹349/kg','Whole Chicken 1kg'),
      p('Zepto',   'zepto',   369, '1kg','₹369/kg','Whole Chicken 1kg'),
    ]},
  ],

  // ─── ATTA / FLOUR ────────────────────────────────────────────
  atta: [
    { name: 'Aashirvaad Atta', emoji: 'atta', platforms: [
      p('DMart',   'dmart',   189,'5kg','₹37.8/kg','Aashirvaad Atta 5kg'),
      p('BigBasket','bigbasket',199,'5kg','₹39.8/kg','Aashirvaad Atta 5kg'),
      p('JioMart', 'jiomart', 192,'5kg','₹38.4/kg','Aashirvaad Atta 5kg'),
      p('Blinkit', 'blinkit', 205,'5kg','₹41/kg','Aashirvaad Atta 5kg'),
    ]},
    { name: 'Fortune Chakki Fresh Atta', emoji: 'atta', platforms: [
      p('DMart',   'dmart',   175,'5kg','₹35/kg','Fortune Atta 5kg'),
      p('BigBasket','bigbasket',185,'5kg','₹37/kg','Fortune Atta 5kg'),
      p('Blinkit', 'blinkit', 195,'5kg','₹39/kg','Fortune Atta 5kg'),
    ]},
    { name: 'Pillsbury Whole Wheat Atta', emoji: 'atta', platforms: [
      p('BigBasket','bigbasket',195,'5kg','₹39/kg','Pillsbury Atta 5kg'),
      p('Zepto',   'zepto',   199,'5kg','₹39.8/kg','Pillsbury Atta 5kg'),
    ]},
  ],

  // ─── OIL ─────────────────────────────────────────────────────
  oil: [
    { name: 'Fortune Sunflower Oil', emoji: 'oil', platforms: [
      p('DMart',   'dmart',   139,'1L','₹139/L','Fortune Sunflower Oil 1L'),
      p('BigBasket','bigbasket',145,'1L','₹145/L','Fortune Sunflower Oil 1L'),
      p('JioMart', 'jiomart', 142,'1L','₹142/L','Fortune Sunflower Oil 1L'),
      p('Blinkit', 'blinkit', 148,'1L','₹148/L','Sunflower Oil 1L'),
    ]},
    { name: 'Saffola Gold Oil', emoji: 'oil', platforms: [
      p('BigBasket','bigbasket',175,'1L','₹175/L','Saffola Gold Oil 1L'),
      p('Zepto',   'zepto',   179,'1L','₹179/L','Saffola Gold 1L'),
      p('Blinkit', 'blinkit', 182,'1L','₹182/L','Saffola Oil 1L'),
    ]},
    { name: 'KS Cold Pressed Coconut Oil', emoji: 'oil', platforms: [
      p('BigBasket','bigbasket',299,'500ml','₹598/L','Coconut Oil 500ml'),
      p('Zepto',   'zepto',   315,'500ml','₹630/L','Coconut Oil 500ml'),
    ]},
  ],

  // ─── BANANA ──────────────────────────────────────────────────
  banana: [
    { name: 'Fresh Bananas', emoji: 'banana', platforms: [
      p('BigBasket','bigbasket',29,'6pcs','₹4.8/pc','Banana 6pcs'),
      p('Zepto',   'zepto',   32, '6pcs','₹5.3/pc','Banana 6pcs'),
      p('Blinkit', 'blinkit', 35, '6pcs','₹5.8/pc','Banana 6pcs'),
    ]},
    { name: 'Nendra Banana (Yelakki)', emoji: 'banana', platforms: [
      p('BigBasket','bigbasket',45,'6pcs','₹7.5/pc','Yelakki Banana 6pcs'),
      p('Zepto',   'zepto',   49, '6pcs','₹8.2/pc','Yelakki Banana 6pcs'),
    ]},
  ],

  // ─── APPLE ───────────────────────────────────────────────────
  apple: [
    { name: 'Himachal Apple', emoji: 'apple', platforms: [
      p('BigBasket','bigbasket',99,'4pcs','₹24.7/pc','Apple 4pcs'),
      p('Zepto',   'zepto',   105,'4pcs','₹26.2/pc','Apple 4pcs'),
      p('Blinkit', 'blinkit', 109,'4pcs','₹27.2/pc','Apple 4pcs'),
    ]},
    { name: 'Fuji Apple 1kg', emoji: 'apple', platforms: [
      p('BigBasket','bigbasket',179,'1kg','₹179/kg','Fuji Apple 1kg'),
      p('Zepto',   'zepto',   189,'1kg','₹189/kg','Fuji Apple 1kg'),
    ]},
  ],

  // ─── SUGAR ───────────────────────────────────────────────────
  sugar: [
    { name: 'Uttam Sugar', emoji: 'sugar', platforms: [
      p('DMart',   'dmart',   44, '1kg','₹44/kg','Sugar 1kg'),
      p('BigBasket','bigbasket',46,'1kg','₹46/kg','Sugar 1kg'),
      p('JioMart', 'jiomart', 45, '1kg','₹45/kg','Sugar 1kg'),
      p('Blinkit', 'blinkit', 48, '1kg','₹48/kg','Sugar 1kg'),
    ]},
    { name: 'Uttam Sugar 5kg', emoji: 'sugar', platforms: [
      p('DMart',   'dmart',   210,'5kg','₹42/kg','Sugar 5kg'),
      p('BigBasket','bigbasket',225,'5kg','₹45/kg','Sugar 5kg'),
      p('JioMart', 'jiomart', 215,'5kg','₹43/kg','Sugar 5kg'),
    ]},
  ],

  // ─── DAL ─────────────────────────────────────────────────────
  dal: [
    { name: 'Tata Sampann Arhar Dal', emoji: 'dal', platforms: [
      p('BigBasket','bigbasket',145,'1kg','₹145/kg','Arhar Dal 1kg'),
      p('JioMart', 'jiomart', 139,'1kg','₹139/kg','Arhar Dal 1kg'),
      p('Blinkit', 'blinkit', 149,'1kg','₹149/kg','Arhar Dal 1kg'),
      p('Zepto',   'zepto',   148,'1kg','₹148/kg','Arhar Dal 1kg'),
    ]},
    { name: 'Moong Dal', emoji: 'dal', platforms: [
      p('BigBasket','bigbasket',129,'1kg','₹129/kg','Moong Dal 1kg'),
      p('JioMart', 'jiomart', 125,'1kg','₹125/kg','Moong Dal 1kg'),
      p('Blinkit', 'blinkit', 132,'1kg','₹132/kg','Moong Dal 1kg'),
    ]},
    { name: 'Chana Dal', emoji: 'dal', platforms: [
      p('BigBasket','bigbasket',99,'1kg','₹99/kg','Chana Dal 1kg'),
      p('DMart',   'dmart',   95, '1kg','₹95/kg','Chana Dal 1kg'),
      p('Blinkit', 'blinkit', 102,'1kg','₹102/kg','Chana Dal 1kg'),
    ]},
  ],
};

// ── Emoji map ─────────────────────────────────────────────────
export const GROCERY_EMOJIS: Record<string, string> = {
  milk: '🥛', eggs: '🥚', paneer: '🧀', curd: '🥣', rice: '🍚',
  bread: '🍞', tomato: '🍅', onion: '🧅', butter: '🧈', chicken: '🍗',
  atta: '🌾', oil: '🫙', banana: '🍌', apple: '🍎', sugar: '🍬', dal: '🫘',
  default: '🛒',
};

// ── Search function — fuzzy match across all keys ──────────────
export function searchGDB(query: string): GroceryProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Collect all matching products
  const matches: GroceryProduct[] = [];
  for (const [key, products] of Object.entries(GDB)) {
    if (q.includes(key) || key.includes(q) ||
        products.some(p => p.name.toLowerCase().includes(q))) {
      matches.push(...products);
    }
  }

  // If no match found, return generic fallback
  if (matches.length === 0) {
    return [{
      name: query,
      emoji: 'default',
      platforms: [
        { label: 'Zepto',     cls: 'zepto',     price: 49, size: '1pc', perUnit: '-', deepLink: 'zepto://search?q='     + encodeURIComponent(query), playStore: 'https://play.google.com/store/apps/details?id=com.zepto.app' },
        { label: 'Blinkit',   cls: 'blinkit',   price: 52, size: '1pc', perUnit: '-', deepLink: 'blinkit://search?q='   + encodeURIComponent(query), playStore: 'https://play.google.com/store/apps/details?id=com.blinkit.android' },
        { label: 'BigBasket', cls: 'bigbasket',  price: 46, size: '1pc', perUnit: '-', deepLink: 'bigbasket://search?q=' + encodeURIComponent(query), playStore: 'https://play.google.com/store/apps/details?id=com.bigbasket' },
        { label: 'Instamart', cls: 'instamart',  price: 55, size: '1pc', perUnit: '-', deepLink: 'swiggy://search?q='   + encodeURIComponent(query), playStore: 'https://play.google.com/store/apps/details?id=in.swiggy.android' },
      ],
    }];
  }

  return matches;
}

// ── Quick-access chips ─────────────────────────────────────────
export const GROCERY_CHIPS = [
  { key: 'milk',    label: 'Milk' },   { key: 'eggs',    label: 'Eggs' },
  { key: 'paneer',  label: 'Paneer' }, { key: 'curd',    label: 'Curd' },
  { key: 'rice',    label: 'Rice' },   { key: 'atta',    label: 'Atta' },
  { key: 'bread',   label: 'Bread' },  { key: 'dal',     label: 'Dal' },
  { key: 'oil',     label: 'Oil' },    { key: 'tomato',  label: 'Tomato' },
  { key: 'onion',   label: 'Onion' },  { key: 'chicken', label: 'Chicken' },
  { key: 'butter',  label: 'Butter' }, { key: 'banana',  label: 'Banana' },
  { key: 'sugar',   label: 'Sugar' },  { key: 'apple',   label: 'Apple' },
];
