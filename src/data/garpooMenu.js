// Data Menu Garpoo Cafe - Jl. Sutomo No.13, Perintis, Medan Timur
// Harga dan variasi disesuaikan dengan menu asli Garpoo Cafe Medan

export const CAFE_INFO = {
  name: "Garpoo Cafe",
  legalName: "Garpoo Cafe & Eatery Medan",
  tagline: "Kopi & Santapan Santai Khas Medan",
  address: "Jl. Sutomo No.13, Perintis, Kec. Medan Timur, Kota Medan, Sumatera Utara 20235",
  mapsUrl: "https://maps.app.goo.gl/QkYNScrxXdfSYZHt6",
  instagram: "@garpooindonesia",
  instagramUrl: "https://www.instagram.com/garpooindonesia/",
  wifiSsid: "Garpoo_Guest_Free",
  wifiPass: "ngopidigarpoo",
  operatingHours: "10:00 - 23:00 WIB (Setiap Hari)",
  taxRate: 0.10, // PB1 10%
  serviceRate: 0.00, // No service fee for customer convenience
};

export const CATEGORIES = [
  { id: "all", name: "Semua Menu", icon: "✨" },
  { id: "rekomendasi", name: "🌟 Rekomendasi", icon: "🔥" },
  { id: "makanan_berat", name: "Nasi & Makanan Berat", icon: "🍚" },
  { id: "mie_pasta", name: "Mie & Pasta", icon: "🍜" },
  { id: "camilan", name: "Jajanan & Camilan", icon: "🍢" },
  { id: "kopi_medan", name: "Kopi Khas Medan", icon: "☕" },
  { id: "minuman_segar", name: "Minuman Segar", icon: "🥤" },
  { id: "dessert", name: "Dessert & Manisan", icon: "🍰" },
  { id: "paket_hemat", name: "Paket Nongkrong", icon: "🎉" },
];

export const MENU_ITEMS = [
  // --- MAKANAN BERAT / NASI ---
  {
    id: "nb-01",
    name: "Nasi Goreng Rempah Garpoo",
    category: "makanan_berat",
    price: 44000,
    rating: 4.9,
    reviews: 142,
    isPopular: true,
    isChefPick: true,
    isSpicy: true,
    image: "./images/nasi-goreng.jpg",
    description: "Nasi goreng racikan bumbu rempah khas Sumatera andalan Garpoo Cafe, disajikan dengan telur mata sapi, suwiran ayam gurih, acar segar, dan kerupuk renyah.",
    customizable: {
      spiciness: ["Level 0 (Tidak Pedas)", "Level 1 (Sedang)", "Level 2 (Pedas Garpoo)", "Level 3 (Pedas Petir)"],
      eggOption: ["Telur Mata Sapi (Setengah Matang)", "Telur Mata Sapi (Matang)", "Telur Dadar"],
      toppings: [
        { name: "Ekstra Telur", price: 5000 },
        { name: "Ekstra Sambal Rempah", price: 4000 },
        { name: "Ekstra Sate Taichan (3 tusuk)", price: 12000 },
        { name: "Ekstra Kerupuk Udang", price: 3000 }
      ]
    }
  },
  {
    id: "nb-02",
    name: "Nasi Goreng Kampung Medan",
    category: "makanan_berat",
    price: 43000,
    rating: 4.8,
    reviews: 98,
    isPopular: true,
    isChefPick: false,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
    description: "Nasi goreng gurih tradisional dengan potongan ikan teri Medan krispi, telur orek, bawang goreng melimpah dan cabai rawit ulek segar.",
    customizable: {
      spiciness: ["Level 0 (Tidak Pedas)", "Level 1 (Sedang)", "Level 2 (Pedas Mantap)"],
      eggOption: ["Telur Mata Sapi", "Telur Dadar", "Telur Orek"],
      toppings: [
        { name: "Ekstra Teri Medan Krispi", price: 6000 },
        { name: "Ekstra Kerupuk", price: 3000 }
      ]
    }
  },
  {
    id: "nb-03",
    name: "Nasi Ayam Kremes Sambal Pecak",
    category: "makanan_berat",
    price: 60000,
    rating: 4.9,
    reviews: 180,
    isPopular: true,
    isChefPick: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    description: "Ayam goreng bumbu ungkep empuk dengan taburan kremesan super renyah disiram sambal pecak segar khas Garpoo dengan tomat hijau dan perasan jeruk limau.",
    customizable: {
      spiciness: ["Level Sedang", "Level Pedas Nampol", "Level Ekstra Pedas"],
      riceOption: ["Nasi Putih Pulen", "Nasi Uduk Gurih (+Rp 4.000)"],
      toppings: [
        { name: "Ekstra Kremesan Gurih", price: 5000 },
        { name: "Ekstra Sambal Pecak", price: 4000 },
        { name: "Tahu & Tempe Goreng", price: 6000 }
      ]
    }
  },
  {
    id: "nb-04",
    name: "Nasi Bakar Bebek Rempah Madura",
    category: "makanan_berat",
    price: 101000,
    rating: 4.9,
    reviews: 76,
    isPopular: false,
    isChefPick: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "Nasi bakar wangi daun pisang berisi suwiran bebek bumbu hitam rempah Madura gurih pekat, kemangi segar, dan sambal mangga muda.",
    customizable: {
      spiciness: ["Sedang", "Pedas"],
      toppings: [
        { name: "Ekstra Sambal Hitam Rempah", price: 6000 },
        { name: "Ekstra Telur Asin", price: 6000 }
      ]
    }
  },
  {
    id: "nb-05",
    name: "Chicken Rice Bowl Salted Egg",
    category: "makanan_berat",
    price: 59000,
    rating: 4.7,
    reviews: 110,
    isPopular: true,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    description: "Potongan ayam krispi juicy berbalut saus telur asin creamy gurih dengan irisan daun kari wangi dan potongan cabai rawit merah.",
    customizable: {
      eggOption: ["Telur Mata Sapi 1/2 Matang", "Telur Mata Sapi Matang"],
      toppings: [
        { name: "Ekstra Saus Salted Egg", price: 8000 },
        { name: "Ekstra Mozzarella Melt", price: 8000 }
      ]
    }
  },
  {
    id: "nb-06",
    name: "Rice Bowl Chicken Teriyaki Don",
    category: "makanan_berat",
    price: 62000,
    rating: 4.8,
    reviews: 85,
    isPopular: false,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
    description: "Daging ayam fillet panggang lembut berpadu dengan saus teriyaki manis gurih autentik, taburan wijen sangrai, nori, dan salad segar.",
    customizable: {
      eggOption: ["Onsen Egg (Telur Rebus Lembut)", "Telur Mata Sapi"],
      toppings: [
        { name: "Ekstra Saus Teriyaki", price: 5000 },
        { name: "Ekstra Nori Crunch", price: 4000 }
      ]
    }
  },

  // --- MIE & PASTA ---
  {
    id: "mp-01",
    name: "Mie Gerobak Spesial Ayam Crispy",
    category: "mie_pasta",
    price: 54000,
    rating: 4.9,
    reviews: 154,
    isPopular: true,
    isChefPick: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
    description: "Mie kenyal racikan spesial Garpoo berbalut minyak bawang aromatik, dilengkapi ayam crispy gurih, pangsit rebus lembut, kuah kaldu gurih, dan pakcoy segar.",
    customizable: {
      soupOption: ["Kuah Dipisah", "Kuah Dicampur"],
      spiciness: ["Original (Tidak Pedas)", "Pedas Sedang", "Pedas Jeletot"],
      toppings: [
        { name: "Ekstra Pangsit Goreng Renyah (2 pcs)", price: 6000 },
        { name: "Ekstra Bakso Sapi (2 pcs)", price: 8000 },
        { name: "Ekstra Ayam Crispy", price: 12000 }
      ]
    }
  },
  {
    id: "mp-02",
    name: "Mie Gerobak Rendang Sapi",
    category: "mie_pasta",
    price: 70000,
    rating: 4.8,
    reviews: 67,
    isPopular: false,
    isChefPick: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    description: "Perpaduan unik mie gurih kenyal dengan suwiran daging rendang sapi Minang empuk berempah pekat dan kuah kaldu hangat.",
    customizable: {
      spiciness: ["Pedas Normal", "Pedas Ekstra"],
      toppings: [
        { name: "Ekstra Bumbu Rendang", price: 8000 },
        { name: "Ekstra Telur Rebus Rempah", price: 5000 }
      ]
    }
  },

  // --- CAMILAN & JAJANAN ---
  {
    id: "sn-01",
    name: "Sate Taichan Garpoo (10 Tusuk)",
    category: "camilan",
    price: 43000,
    rating: 4.9,
    reviews: 210,
    isPopular: true,
    isChefPick: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1529563021893-cc83c914d73e?auto=format&fit=crop&w=600&q=80",
    description: "Sate daging ayam fillet empuk tanpa lemak dipanggang gurih dengan lumuran jeruk nipis, bubuk kaldu gurih dan sambal ulek taichan pedas segar.",
    customizable: {
      spiciness: ["Sambal Sedang", "Sambal Pedas Nampol", "Sambal Dipisah"],
      toppings: [
        { name: "Lontong Pulen", price: 6000 },
        { name: "Ekstra Sambal Taichan", price: 5000 },
        { name: "Ekstra Bumbu Kaldu & Jeruk", price: 3000 }
      ]
    }
  },
  {
    id: "sn-02",
    name: "Batagor Bandung Garpoo",
    category: "camilan",
    price: 48000,
    rating: 4.8,
    reviews: 119,
    isPopular: true,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80",
    description: "Bakso tahu goreng ikan tenggiri asli yang renyah di luar kenyal lembut di dalam, disiram bumbu kacang medok kental, kecap manis, dan perasan jeruk limau.",
    customizable: {
      sauceOption: ["Bumbu Kacang Disiram", "Bumbu Kacang Dipisah"],
      toppings: [
        { name: "Ekstra Bumbu Kacang Medok", price: 5000 },
        { name: "Ekstra Sambal Cabai Merah", price: 3000 }
      ]
    }
  },
  {
    id: "sn-03",
    name: "Tempe Mendoan Crispy Sambal Kecap",
    category: "camilan",
    price: 38000,
    rating: 4.7,
    reviews: 95,
    isPopular: false,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
    description: "Tempe mendoan lebar berbalut adonan tepung daun bawang renyah hangat, disajikan dengan cocolan sambal kecap cabai rawit pedas manis.",
    customizable: {
      toppings: [
        { name: "Ekstra Sambal Kecap Rawit", price: 3000 }
      ]
    }
  },
  {
    id: "sn-04",
    name: "Cireng Krispi Bumbu Rujak",
    category: "camilan",
    price: 38000,
    rating: 4.8,
    reviews: 130,
    isPopular: true,
    isChefPick: false,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
    description: "Cireng aci goreng renyah kenyal dengan cocolan saus rujak gula aren asam pedas manis yang bikin nagih.",
    customizable: {
      toppings: [
        { name: "Ekstra Saus Rujak Pedas", price: 4000 }
      ]
    }
  },
  {
    id: "sn-05",
    name: "Kentang Goreng Truffle Cheese",
    category: "camilan",
    price: 43000,
    rating: 4.7,
    reviews: 88,
    isPopular: false,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    description: "French fries renyah keemasan bertabur aroma truffle oil mewah, bubuk keju parmesan gurih, dan saus cocolan mayo garlic.",
    customizable: {
      toppings: [
        { name: "Ekstra Saus Keju Melt", price: 6000 },
        { name: "Ekstra Daging Bolognese", price: 8000 }
      ]
    }
  },

  // --- KOPI KHAS MEDAN & COFFEE ---
  {
    id: "kp-01",
    name: "Kopi Sanger Khas Medan",
    category: "kopi_medan",
    price: 47000,
    rating: 5.0,
    reviews: 320,
    isPopular: true,
    isChefPick: true,
    isSpicy: false,
    image: "./images/kopi-sanger.jpg",
    description: "Minuman kopi legendaris khas Medan/Aceh dengan racikan espresso 'sama-sama ngerti' berpadu susu kental manis dan buih creamy yang lembut di lidah.",
    customizable: {
      temperature: ["Dingin (Es Sanger)", "Hangat / Panas"],
      sweetness: ["Manis Normal (100%)", "Less Sweet (50%)", "Extra Bold"],
      toppings: [
        { name: "Ekstra Espresso Shot", price: 8000 },
        { name: "Jelly Kopi Aren", price: 5000 }
      ]
    }
  },
  {
    id: "kp-02",
    name: "Es Kopi Susu Gula Aren Garpoo",
    category: "kopi_medan",
    price: 54000,
    rating: 4.9,
    reviews: 280,
    isPopular: true,
    isChefPick: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    description: "Espresso house-blend Garpoo dipadukan susu segar creamy dan gula aren murni organik dengan aroma karamel alami.",
    customizable: {
      temperature: ["Dingin (Ice)", "Hangat (Hot)"],
      sweetness: ["Normal Sugar", "Less Sugar (50%)", "No Sugar (0%)"],
      milkOption: ["Fresh Milk", "Oat Milk (+Rp 8.000)", "Soy Milk (+Rp 6.000)"],
      toppings: [
        { name: "Boba Brown Sugar", price: 5000 },
        { name: "Cream Sea Salt", price: 6000 }
      ]
    }
  },
  {
    id: "kp-03",
    name: "Es Kopi Klepon Special",
    category: "kopi_medan",
    price: 63000,
    rating: 4.8,
    reviews: 112,
    isPopular: false,
    isChefPick: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    description: "Kreasi fusion unik kopi susu beraroma daun pandan wangi, sirup gula aren, santan kelapa gurih, dan taburan kelapa parut panggang di atasnya.",
    customizable: {
      sweetness: ["Normal", "Less Sweet"],
      toppings: [
        { name: "Ekstra Taburan Kelapa Sangrai", price: 4000 }
      ]
    }
  },
  {
    id: "kp-04",
    name: "Es Kopi Alpukat (Avocado Coffee)",
    category: "kopi_medan",
    price: 63000,
    rating: 4.9,
    reviews: 140,
    isPopular: true,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    description: "Jus alpukat mentega Medan yang lembut kental disiram single shot espresso pekat dan es krim cokelat lezat di atasnya.",
    customizable: {
      sweetness: ["Normal", "Less Sugar"],
      toppings: [
        { name: "Ekstra 1 Scoop Es Krim Cokelat", price: 6000 },
        { name: "Ekstra Shot Espresso", price: 8000 }
      ]
    }
  },

  // --- MINUMAN SEGAR ---
  {
    id: "dr-01",
    name: "Es Pokat Kocok Medan",
    category: "minuman_segar",
    price: 53000,
    rating: 5.0,
    reviews: 240,
    isPopular: true,
    isChefPick: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80",
    description: "Minuman legendaris kota Medan: daging alpukat mentega kasar dikocok bersama sirup gula aren kental, santan, susu cokelat, dan es serut segar.",
    customizable: {
      sweetness: ["Manis Pas (100%)", "Sedikit Manis (50%)"],
      toppings: [
        { name: "Ekstra Daging Durian Asli Medan", price: 15000 },
        { name: "Ekstra Parutan Keju", price: 5000 }
      ]
    }
  },
  {
    id: "dr-02",
    name: "Es Buah Segar Nusantara",
    category: "minuman_segar",
    price: 31000,
    rating: 4.7,
    reviews: 90,
    isPopular: false,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80",
    description: "Campuran potongan buah melon, semangka, pepaya, nata de coco, biji selasih, dan sirup cocopandan susu segar yang dingin menyegarkan.",
    customizable: {
      sweetness: ["Normal", "Less Sweet"],
      toppings: [
        { name: "Ekstra Nata de Coco", price: 4000 },
        { name: "Ekstra Selasih", price: 3000 }
      ]
    }
  },
  {
    id: "dr-03",
    name: "Teh Tarik Medan Dingin",
    category: "minuman_segar",
    price: 28000,
    rating: 4.8,
    reviews: 105,
    isPopular: false,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    description: "Teh hitam pekat ditarik berbusa dengan susu kental manis dan evaporasi khas Melayu Medan yang wangi.",
    customizable: {
      temperature: ["Dingin (Ice)", "Hangat (Hot)"],
      sweetness: ["Normal", "Less Sweet"]
    }
  },

  // --- DESSERT & MANISAN ---
  {
    id: "ds-01",
    name: "Pisang Goreng Keju Gula Aren",
    category: "dessert",
    price: 43000,
    rating: 4.9,
    reviews: 165,
    isPopular: true,
    isChefPick: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    description: "Pisang raja goreng krispi renyah bertabur keju cheddar melimpah, siraman gula aren organik, dan susu kental manis cokelat.",
    customizable: {
      toppings: [
        { name: "Ekstra Parutan Keju Melimpah", price: 6000 },
        { name: "1 Scoop Es Krim Vanilla", price: 6000 }
      ]
    }
  },
  {
    id: "ds-02",
    name: "Kue Klepon Lumer Tradisional (5 pcs)",
    category: "dessert",
    price: 15000,
    rating: 4.8,
    reviews: 82,
    isPopular: false,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    description: "Kue klepon kenyal hijau pandan berisi gula merah cair yang meletup lumer di mulut, dibalut kelapa parut gurih segar.",
    customizable: {}
  },

  // --- PAKET HEMAT NONGKRONG ---
  {
    id: "pk-01",
    name: "Paket Nongkrong Berdua",
    category: "paket_hemat",
    price: 99000,
    originalPrice: 125000,
    rating: 4.9,
    reviews: 190,
    isPopular: true,
    isChefPick: true,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80",
    description: "Hemat 20%! Paket komplit untuk berdua: 1 Nasi Goreng Rempah + 1 Mie Gerobak Ayam + 2 Kopi Sanger Medan + 1 Porsi Cireng Rujak.",
    customizable: {
      drink1: ["Es Kopi Sanger", "Kopi Sanger Panas", "Teh Tarik Dingin"],
      drink2: ["Es Kopi Sanger", "Es Teh Manis", "Es Kopi Gula Aren"]
    }
  },
  {
    id: "pk-02",
    name: "Paket Camilan & Kopi Sore",
    category: "paket_hemat",
    price: 65000,
    originalPrice: 85000,
    rating: 4.8,
    reviews: 130,
    isPopular: true,
    isChefPick: false,
    isSpicy: false,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    description: "Paket santai sore: 1 Pisang Goreng Keju Aren + 1 Es Kopi Susu Gula Aren Garpoo.",
    customizable: {
      drinkOption: ["Es Kopi Susu Gula Aren", "Kopi Sanger Dingin", "Es Pokat Kocok (+Rp 5.000)"]
    }
  }
];

export const VOUCHERS = [
  { code: "GARPOOPERDANA", discountPercent: 10, maxDiscount: 20000, minOrder: 50000, desc: "Diskon 10% Pelanggan Baru (Min. Rp 50rb)" },
  { code: "MEDANNONGKRONG", discountAmount: 10000, minOrder: 75000, desc: "Potongan Rp 10.000 (Min. Rp 75rb)" },
  { code: "SANGERASIK", discountAmount: 5000, minOrder: 35000, desc: "Potongan Rp 5.000 Khusus Kopi & Camilan" }
];
