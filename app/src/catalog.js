// The Alpine & Oak catalogue. Images live under /img, served by the store.
export const CATEGORIES = [
  { id: 'packs', name: 'Packs & bags' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'camp', name: 'Camp' }
];

export const PRODUCTS = [
  {
    blurb: 'A 38-litre top-loader with a floating lid, hip-belt pockets and a frame that carries a full weekend without complaint.',
    category: 'packs',
    id: 'summit-pack',
    image: 'summit-pack.jpg',
    name: 'Summit 38 Pack',
    price: 149
  },
  {
    blurb: 'Full-grain leather uppers, a waterproof membrane and a Vibram-style sole. Broken in by your second trip, good for ten more.',
    category: 'footwear',
    id: 'ridge-boots',
    image: 'ridge-boots.jpg',
    name: 'Ridge Leather Hiking Boots',
    price: 189
  },
  {
    blurb: 'A 2.5-layer waterproof shell with pit zips and a helmet-compatible hood, light enough to live in the bottom of your pack.',
    category: 'clothing',
    id: 'storm-shell',
    image: 'storm-shell.jpg',
    name: 'Storm Shell Rain Jacket',
    price: 129
  },
  {
    blurb: 'Double-wall steel keeps water cold for a day on the trail and coffee hot through a cold morning at camp. 24 oz.',
    category: 'camp',
    id: 'trail-bottle',
    image: 'trail-bottle.jpg',
    name: 'Trail Insulated Bottle',
    price: 32
  },
  {
    blurb: 'A freestanding two-person tent with two doors, two vestibules and a 4 lb 2 oz packed weight. Pitches in five minutes.',
    category: 'camp',
    id: 'basecamp-tent',
    image: 'basecamp-tent.jpg',
    name: 'Basecamp 2 Tent',
    price: 279
  },
  {
    blurb: '350 lumens, a red night mode and a rechargeable battery that lasts a long weekend. For early starts and late finishes.',
    category: 'camp',
    id: 'night-headlamp',
    image: 'night-headlamp.jpg',
    name: 'Night Trail Headlamp',
    price: 39
  },
  {
    blurb: 'Cushioned merino hiking socks in three colours. Warm when wet, and they don’t smell after three days.',
    category: 'clothing',
    id: 'merino-socks',
    image: 'merino-socks.jpg',
    name: 'Merino Trail Socks, 3-pack',
    price: 36
  },
  {
    blurb: 'Heavyweight fleece with a stand-up collar and hand-warmer pockets, cut long enough to wear over a base layer.',
    category: 'clothing',
    id: 'cabin-fleece',
    image: 'cabin-fleece.jpg',
    name: 'Cabin Fleece Jacket',
    price: 98
  }
];

export function product(id) {
  return PRODUCTS.find(entry => entry.id === id);
}
