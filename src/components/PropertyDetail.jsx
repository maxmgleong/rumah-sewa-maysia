import { ArrowLeft, Wifi, Snowflake, Refrigerator, Car, Bed } from 'lucide-react'

const ICONS = { wifi: Wifi, ac: Snowflake, peti_sejuk: Refrigerator, car: Car }
const FAC_LABEL = { wifi: 'WiFi', ac: 'AC', peti_sejuk: 'Peti Sejuk', car: 'Parking' }

function formatFacilityName(f) {
  if (FAC_LABEL[f]) return FAC_LABEL[f]
  return f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function PropertyDetail({ property, onBack, onRoomClick }) {
  return (
    <div className="min-h-screen bg-accent">
      <div className="relative">
        <img src={property.image} alt={property.name} className="w-full h-56 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x400/e8f5f1/4A9B8C?text=Property'} />
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/90 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <ArrowLeft size={20} className="text-primary" />
        </button>
      </div>
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl card-shadow p-5 mb-4">
          <h2 className="text-lg font-bold text-primary mb-1">{property.name}</h2>
          <p className="text-muted text-sm mb-3">📍 {property.location}</p>
          <div className="bg-accent rounded-xl p-3">
            <p className="text-xs font-semibold text-primary mb-1">Deskripsi:</p>
            <p className="text-sm text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{property.description}</p>
          </div>
        </div>
        <h3 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">🏠 {property.rooms.length} Bilik Tersedia</h3>
        <div className="space-y-3 pb-6">
          {property.rooms.map(room => {
            const kosong = room.beds.filter(b => !b.occupied).length
            return (
              <div key={room.id} onClick={() => onRoomClick(room)} className="bg-white rounded-2xl card-shadow overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
                <div className="flex">
                  <img src={room.image || property.image} alt={room.name} className="w-28 h-28 object-cover flex-shrink-0"
                    onError={e => e.target.src = 'https://placehold.co/200x200/e8f5f1/4A9B8C?text=Room'} />
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-primary text-sm">{room.name}</h4>
                        <p className="text-xs text-green-600 font-semibold mt-1">RM {room.price}/bulan</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${kosong > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {kosong > 0 ? `🟢 ${kosong} katil` : '🔴 Penuh'}
                      </span>
                    </div>
                    
                    {/* Description */}
                    {room.description && (
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{room.description}</p>
                    )}

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.facilities.map(f => {
                        const Icon = ICONS[f]
                        return (
                          <span key={f} className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-xs text-blue-700">
                            {Icon ? <Icon size={10} /> : <span>✨</span>}
                            {formatFacilityName(f)}
                          </span>
                        )
                      })}
                    </div>

                    {/* Beds */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.beds.map(b => (
                        <span key={b.id} className={`px-2 py-1 rounded-lg text-xs font-medium ${b.occupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                          🛏️ {b.name}: RM {b.price || room.price}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
