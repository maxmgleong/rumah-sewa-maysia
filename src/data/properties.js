export const INITIAL_PROPERTIES = [
  {
    id: 1,
    name: 'Rumah Sewa Melati',
    location: 'Bangsar, Kuala Lumpur',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    description: 'Rumah kelas menengah dengan suasana aman dan selesa. Dekat dengan amenities dan pengangkutan awam.',
    rooms: [
      { id: 1, name: 'Bilik Master Katil Queen', price: 750, status: 'kosong', description: 'Bilik master luas dengan katil queen size, almari besar, dan meja study.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Queen - Penyewa 1', occupied: false }, { id: 2, name: 'Katil Queen - Penyewa 2', occupied: false }] },
      { id: 2, name: 'Bilik Single AC', price: 450, status: 'kosong', description: 'Bilik single dengan AC dan katil single. Sesuai untuk pelajar atau pekerja.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Single - Penyewa 1', occupied: false }] },
      { id: 3, name: 'Bilik Double Kongsi', price: 380, status: 'ditempah', description: 'Bilik double untuk 2 orang. Shared bilik mandi dengan bilik lain.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil 1', occupied: true }, { id: 2, name: 'Katil 2', occupied: true }] },
      { id: 4, name: 'Bilik AC Budget', price: 350, status: 'kosong', description: 'Bilik AC budget dengan katil single. Shared bathroom. Lokasi strategik near LRT.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] }
    ]
  },
  {
    id: 2,
    name: 'Apartment Seri Intan',
    location: 'TTDI, Kuala Lumpur',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    description: 'Apartment modern dengan security 24 jam. Facilities lengkap termasuk swimming pool dan gym.',
    rooms: [
      { id: 5, name: 'Master Room + Private Bath', price: 950, status: 'kosong', description: 'Bilik master dengan bilik air sendiri. View cantik dan ventilation baik.', facilities: ['wifi', 'ac', 'peti_sejuk', 'parking'], beds: [{ id: 1, name: 'Katil King - Penyewa 1', occupied: false }, { id: 2, name: 'Katil King - Penyewa 2', occupied: false }] },
      { id: 6, name: 'Medium Room Near LRT', price: 600, status: 'kosong', description: 'Bilik sederhana dengan katil queen dan kabinet lengkap. 5 minit ke LRT TTDI.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }] },
      { id: 7, name: 'Small Room Student', price: 400, status: 'kosong', description: 'Bilik kecil sesuai untuk pelajar. Shared bilik mandi. WiFi laju.', facilities: ['wifi'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] },
      { id: 8, name: 'Budget Room No AC', price: 280, status: 'ditempah', description: 'Bilik tanpa AC, kipas sahaja. Sesuai untuk yang tak sensitif kepada haba.', facilities: ['wifi'], beds: [{ id: 1, name: 'Katil Single', occupied: true }] },
      { id: 9, name: 'Family Room', price: 1100, status: 'kosong', description: 'Bilik besar untuk keluarga. Boleh memuatkan 3-4 orang dengan katil tambahan.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }, { id: 2, name: 'Katil Single 1', occupied: false }, { id: 3, name: 'Katil Single 2', occupied: false }] }
    ]
  },
  {
    id: 3,
    name: 'Kondominium Damai',
    location: 'Mont Kiara, Kuala Lumpur',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    description: 'Kondominium eksklusif dengan suasana mewah. Guarded community dengan akses kad.',
    rooms: [
      { id: 10, name: 'Studio Apartment', price: 1200, status: 'kosong', description: 'Studio lengkap dengan dapur kecil dan bilik air sendiri. Sesuai untuk profesional tunggal.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }] },
      { id: 11, name: 'Deluxe Room', price: 800, status: 'kosong', description: 'Bilik deluxe dengan ruang yang luas dan cupboard besar.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }] },
      { id: 12, name: 'Standard Room AC', price: 550, status: 'kosong', description: 'Bilik standard dengan AC. Sesuai untuk pekerja atau pelajar.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] }
    ]
  },
  {
    id: 4,
    name: 'Rumah Teres Seri Mutiara',
    location: 'Wangsa Maju, Kuala Lumpur',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    description: 'Rumah teres 3 tingkat dengan bilik kosong di tingkat 2. Dekat LRT dan supermarket.',
    rooms: [
      { id: 13, name: 'Room 1 - Master Bedroom', price: 650, status: 'kosong', description: 'Bilik master di lantai 2 dengan katil queen dan almari besar.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }] },
      { id: 14, name: 'Room 2 - Medium Room', price: 480, status: 'kosong', description: 'Bilik sederhana dengan katil single dan meja study.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] },
      { id: 15, name: 'Room 3 - Small Room', price: 380, status: 'ditempah', description: 'Bilik kecil dengan katil single. Share bilik mandi dengan Room 2.', facilities: ['wifi'], beds: [{ id: 1, name: 'Katil Single', occupied: true }] },
      { id: 16, name: 'Room 4 - AC Room', price: 450, status: 'kosong', description: 'Bilik dengan AC dan katil single. Bilik mandi luar.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] }
    ]
  },
  {
    id: 5,
    name: 'Flat Sri Perak',
    location: 'Setapak, Kuala Lumpur',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
    description: 'Flat kos rendah dengan komuniti mesra. Dekat dengan university dan hospital.',
    rooms: [
      { id: 17, name: 'Bilik AC Rumah Owner', price: 420, status: 'kosong', description: 'Bilik AC di rumah owner. Shared semua facilities.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] },
      { id: 18, name: 'Bilik Kipas', price: 320, status: 'kosong', description: 'Bilik kipas sahaja. Shared bilik mandi. Sesuai untuk yang tahan panas.', facilities: ['wifi'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] },
      { id: 19, name: 'Bilik Queen + AC', price: 500, status: 'kosong', description: 'Bilik dengan katil queen dan AC. Shared bilik mandi.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }] }
    ]
  },
  {
    id: 6,
    name: 'Residensi Srikl',
    location: 'Bangsar South, Kuala Lumpur',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    description: 'Residensi baru dengan design moden. Dekat dengan LRT Abdullah Hukum dan Mid Valley.',
    rooms: [
      { id: 20, name: 'Master Suite', price: 1400, status: 'kosong', description: 'Master suite dengan bilik air sendiri, bathtub, dan workspace.', facilities: ['wifi', 'ac', 'peti_sejuk', 'parking'], beds: [{ id: 1, name: 'Katil King', occupied: false }] },
      { id: 21, name: 'Premium Room', price: 900, status: 'kosong', description: 'Bilik premium dengan katil queen, AC, dan private bathroom.', facilities: ['wifi', 'ac', 'peti_sejuk'], beds: [{ id: 1, name: 'Katil Queen', occupied: false }] },
      { id: 22, name: 'Standard Room A', price: 650, status: 'ditempah', description: 'Bilik standard dengan katil queen. Shared bilik mandi di luar.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Queen', occupied: true }] },
      { id: 23, name: 'Standard Room B', price: 600, status: 'kosong', description: 'Bilik standard dengan katil single. Sesuai untuk pelajar.', facilities: ['wifi', 'ac'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] },
      { id: 24, name: 'Economy Room', price: 480, status: 'kosong', description: 'Bilik ekonomi dengan kipas. Shared bilik mandi. Harga paling rendah.', facilities: ['wifi'], beds: [{ id: 1, name: 'Katil Single', occupied: false }] }
    ]
  }
]

export const FACILITIES_LIST = ['wifi', 'ac', 'peti_sejuk', 'parking']
export const FACILITIES = {
  wifi: { label: 'WiFi', icon: 'Wifi' },
  ac: { label: 'AC', icon: 'Snowflake' },
  peti_sejuk: { label: 'Peti Sejuk', icon: 'Refrigerator' },
  parking: { label: 'Parking', icon: 'Car' }
}
