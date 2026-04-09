import { MapPin, Home, Bed } from 'lucide-react'

export default function PropertyCard({ property, onClick }) {
  const totalBeds = property.rooms.reduce((a, r) => a + r.beds.length, 0)
  const kosongBeds = property.rooms.reduce((a, r) => a + r.beds.filter(b => !b.occupied).length, 0)
  const minPrice = Math.min(...property.rooms.map(r => r.price))
  const maxPrice = Math.max(...property.rooms.map(r => r.price))

  return (
    <div onClick={onClick} className="bg-white rounded-3xl overflow-hidden card-shadow cursor-pointer active:scale-[0.98] transition-transform">
      <div className="relative">
        <img src={property.image} alt={property.name} className="w-full h-44 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x300/e8f5f1/4A9B8C?text=Property'} />
        <div className="absolute top-3 right-3 bg-dark/80 text-white px-3 py-1 rounded-xl text-sm font-bold">
          {kosongBeds > 0 ? '🟢 Kosong' : '🔴 Penuh'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-primary text-base mb-1">{property.name}</h3>
        <div className="flex items-center gap-1 text-muted text-xs mb-2">
          <MapPin size={12} /> {property.location}
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{property.description}</p>
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted text-xs">
              <Home size={12} /> {property.rooms.length} bilik
            </div>
            <div className="flex items-center gap-1 text-muted text-xs">
              <Bed size={12} /> {kosongBeds}/{totalBeds} kosong
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary font-bold text-sm">RM {minPrice}{maxPrice !== minPrice ? '-' + maxPrice : ''}</p>
            <p className="text-muted text-xs">sebulan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
