
export const PRIZE_CONFIG = [
  { name: 'Billetes de Avión', count: 1 },
  { name: 'Maleta de Viaje', count: 1 },
  { name: 'Maletín Grande de Herramientas', count: 6 },
  { name: 'Maletín Pequeño de Herramientas', count: 4 },
  { name: 'Mochila', count: 9 }, // Total combined count from the list
  { name: 'Smartwatch Amazfit GTR 3 Pro', count: 1 },
  { name: 'Smartphone Xiaomi POCO X7', count: 1 },
  { name: 'Smartwatch Amazfit Bip 6 (Gris)', count: 1 },
  { name: 'Smartwatch Amazfit Bip 6 (Negro)', count: 1 },
  { name: 'Tablet Xiaomi Redmi Pad Pro 12.1"', count: 1 },
  { name: 'Tablet Xiaomi Redmi Pad 2 11"', count: 1 },
  { name: 'Smartphone Xiaomi Redmi 15', count: 1 },
];

// Flattens the config into an array of 28 strings
export const INITIAL_PRIZES = PRIZE_CONFIG.flatMap(item => Array(item.count).fill(item.name));

export const INITIAL_NUMBER_START = 901;
export const INITIAL_NUMBER_COUNT = 97;
