import { Product } from '../types/bundle.types'

export const mockProducts: Product[] = [
  // ========== CPUs ==========
  {
    id: 'cpu-1',
    name: 'Intel Core i5-12400F',
    price: 250,
    category: 'CPU',
    incompatibleWith: ['mobo-2', 'mobo-4']
  },
  {
    id: 'cpu-2',
    name: 'AMD Ryzen 5 5600X',
    price: 220,
    category: 'CPU',
    incompatibleWith: ['mobo-1', 'mobo-3']
  },
  {
    id: 'cpu-3',
    name: 'Intel Core i7-12700K',
    price: 380,
    category: 'CPU',
    incompatibleWith: ['mobo-2', 'mobo-4']
  },
  {
    id: 'cpu-4',
    name: 'AMD Ryzen 7 5800X',
    price: 350,
    category: 'CPU',
    incompatibleWith: ['mobo-1', 'mobo-3']
  },
  {
    id: 'cpu-5',
    name: 'Intel Core i9-12900K',
    price: 550,
    category: 'CPU',
    incompatibleWith: ['mobo-2', 'mobo-4']
  },
  {
    id: 'cpu-6',
    name: 'AMD Ryzen 9 5900X',
    price: 520,
    category: 'CPU',
    incompatibleWith: ['mobo-1', 'mobo-3']
  },

  // ========== Motherboards ==========
  {
    id: 'mobo-1',
    name: 'ASUS Prime B660M-A (WiFi)',
    price: 150,
    category: 'Motherboard',
    incompatibleWith: ['cpu-2', 'cpu-4', 'cpu-6']
  },
  {
    id: 'mobo-2',
    name: 'Gigabyte Z690 UD DDR4',
    price: 140,
    category: 'Motherboard',
    incompatibleWith: ['cpu-1', 'cpu-3', 'cpu-5']
  },
  {
    id: 'mobo-3',
    name: 'MSI B550 Tomahawk',
    price: 170,
    category: 'Motherboard',
    incompatibleWith: ['cpu-2', 'cpu-4', 'cpu-6']
  },
  {
    id: 'mobo-4',
    name: 'ASRock Z790 PG Lightning',
    price: 200,
    category: 'Motherboard',
    incompatibleWith: ['cpu-1', 'cpu-3', 'cpu-5']
  },
  {
    id: 'mobo-5',
    name: 'Gigabyte B450 AORUS Elite',
    price: 110,
    category: 'Motherboard',
    incompatibleWith: ['cpu-1', 'cpu-3', 'cpu-5']
  },
  {
    id: 'mobo-6',
    name: 'ASUS ROG Strix B550-F',
    price: 190,
    category: 'Motherboard',
    incompatibleWith: ['cpu-2', 'cpu-4', 'cpu-6']
  },

  // ========== RAM ==========
  {
    id: 'ram-1',
    name: '16GB DDR4 3200MHz',
    price: 80,
    category: 'RAM',
    incompatibleWith: []
  },
  {
    id: 'ram-2',
    name: '32GB DDR4 3200MHz',
    price: 140,
    category: 'RAM',
    incompatibleWith: []
  },
  {
    id: 'ram-3',
    name: '16GB DDR5 4800MHz',
    price: 120,
    category: 'RAM',
    incompatibleWith: ['mobo-5']
  },
  {
    id: 'ram-4',
    name: '32GB DDR5 5200MHz',
    price: 180,
    category: 'RAM',
    incompatibleWith: ['mobo-5']
  },
  {
    id: 'ram-5',
    name: '64GB DDR4 3200MHz',
    price: 250,
    category: 'RAM',
    incompatibleWith: []
  },
  {
    id: 'ram-6',
    name: '8GB DDR4 2666MHz',
    price: 45,
    category: 'RAM',
    incompatibleWith: []
  },

  // ========== GPU ==========
  {
    id: 'gpu-1',
    name: 'NVIDIA RTX 3060 12GB',
    price: 350,
    category: 'GPU',
    incompatibleWith: ['psu-1']
  },
  {
    id: 'gpu-2',
    name: 'NVIDIA RTX 3070 8GB',
    price: 500,
    category: 'GPU',
    incompatibleWith: ['psu-1']
  },
  {
    id: 'gpu-3',
    name: 'NVIDIA RTX 3080 10GB',
    price: 700,
    category: 'GPU',
    incompatibleWith: []
  },
  {
    id: 'gpu-4',
    name: 'AMD RX 6700 XT 12GB',
    price: 450,
    category: 'GPU',
    incompatibleWith: []
  },

  // ========== Power Supply ==========
  {
    id: 'psu-1',
    name: '500W Bronze PSU',
    price: 60,
    category: 'Power Supply',
    incompatibleWith: ['gpu-2', 'gpu-3']
  },
  {
    id: 'psu-2',
    name: '650W Gold PSU',
    price: 90,
    category: 'Power Supply',
    incompatibleWith: []
  },
  {
    id: 'psu-3',
    name: '850W Gold PSU',
    price: 130,
    category: 'Power Supply',
    incompatibleWith: []
  },

  // ========== Storage ==========
  {
    id: 'ssd-1',
    name: '500GB NVMe SSD',
    price: 60,
    category: 'Storage',
    incompatibleWith: []
  },
  {
    id: 'ssd-2',
    name: '1TB NVMe SSD',
    price: 100,
    category: 'Storage',
    incompatibleWith: []
  },
  {
    id: 'ssd-3',
    name: '2TB NVMe SSD',
    price: 180,
    category: 'Storage',
    incompatibleWith: []
  },
  {
    id: 'hdd-1',
    name: '1TB HDD 7200RPM',
    price: 45,
    category: 'Storage',
    incompatibleWith: []
  },
  {
    id: 'hdd-2',
    name: '2TB HDD 7200RPM',
    price: 65,
    category: 'Storage',
    incompatibleWith: []
  },

  // ========== Cooling ==========
  {
    id: 'cooler-1',
    name: 'Air Cooler Basic',
    price: 30,
    category: 'Cooling',
    incompatibleWith: []
  },
  {
    id: 'cooler-2',
    name: 'Air Cooler Premium',
    price: 60,
    category: 'Cooling',
    incompatibleWith: []
  },
  {
    id: 'cooler-3',
    name: 'Liquid Cooler 240mm',
    price: 100,
    category: 'Cooling',
    incompatibleWith: []
  },
  {
    id: 'cooler-4',
    name: 'Liquid Cooler 360mm',
    price: 150,
    category: 'Cooling',
    incompatibleWith: []
  }
]

// ✅ هذا هو المهم - تحديث مصفوفة categories لتشمل جميع الفئات
export const categories = [
  'CPU', 
  'Motherboard', 
  'RAM', 
  'GPU', 
  'Power Supply', 
  'Storage', 
  'Cooling'
] as const