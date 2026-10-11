export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  distance: string;
  stock: number;
  status: string;
  clickAndCollect: boolean;
  pickupEta: string;
}

export const STORES: StoreLocation[] = [
  {
    id: 'gi',
    name: 'Uniqlo Grand Indonesia (East Mall, Lt. 1-2)',
    city: 'Jakarta Pusat',
    distance: '3.2 km',
    stock: 14,
    status: 'Tersedia Banyak',
    clickAndCollect: true,
    pickupEta: 'Siap diambil dalam 2 jam',
  },
  {
    id: 'pim',
    name: 'Uniqlo Pondok Indah Mall 3 (Ground Floor)',
    city: 'Jakarta Selatan',
    distance: '6.5 km',
    stock: 5,
    status: 'Stok Terbatas',
    clickAndCollect: true,
    pickupEta: 'Siap diambil dalam 2 jam',
  },
  {
    id: 'mkg',
    name: 'Uniqlo Mall Kelapa Gading 3 (Lt. 1)',
    city: 'Jakarta Utara',
    distance: '11.8 km',
    stock: 22,
    status: 'Tersedia Banyak',
    clickAndCollect: true,
    pickupEta: 'Siap diambil dalam 2 jam',
  },
  {
    id: 'sc',
    name: 'Uniqlo Senayan City (Lt. 2)',
    city: 'Jakarta Pusat',
    distance: '5.1 km',
    stock: 0,
    status: 'Habis di Gerai',
    clickAndCollect: false,
    pickupEta: 'Restok 2-3 hari kerja',
  },
  {
    id: 'pvj',
    name: 'Uniqlo Paris Van Java (Resort Level)',
    city: 'Bandung',
    distance: '142 km',
    stock: 8,
    status: 'Tersedia',
    clickAndCollect: true,
    pickupEta: 'Siap diambil dalam 2 jam',
  },
  {
    id: 'tp',
    name: 'Uniqlo Tunjungan Plaza 6 (Lt. 2)',
    city: 'Surabaya',
    distance: '780 km',
    stock: 12,
    status: 'Tersedia',
    clickAndCollect: true,
    pickupEta: 'Siap diambil dalam 2 jam',
  },
];
