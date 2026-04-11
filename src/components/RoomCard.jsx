import { Wifi, Snowflake, Refrigerator, Bed } from 'lucide-react'

const FAC = { wifi: Wifi, ac: Snowflake, peti_sejuk: Refrigerator }
const FAC_LABEL = { wifi: 'WiFi', ac: 'AC', peti_sejuk: 'Peti Sejuk' }

export default function RoomCard({ room, onBook }) {
  const availableBeds = room.beds.filter(b => !b.occupied)
  const allOccupied = availableBeds.length === 0

  // Get facility icon
  function getFacilityIcon(f) {
    const Icon = FAC[f]
    return Icon ? <Icon size={13} className="text-primary" /> : <span className="text-xs">✨</span>
  }

  // Format facility name
  function formatFacilityName(f) {
    if (FAC_LABEL[f]) return FAC_LABEL[f]
    return f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden card-shadow">
      <div className="relative">
        <img src={room.image} alt={room.name} className="w-full h-44 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x300/e8f5f1/4A9B8C?text=Bilik'} />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${allOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {allOccupied ? '🔴 Penuh' : `🟢 ${availableBeds.length} Katil Tersedia`}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-dark/80 text-white px-3 py-1 rounded-xl text-sm font-bold">
          RM {room.price}/<span className="text-xs font-normal">bulan</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-primary text-base mb-1">{room.name}</h3>
        <p className="text-xs text-gray-500 mb-3" style={{ whiteSpace: 'pre-wrap' }}>{room.description}</p>
        
        {/* Individual beds status - Katil availability */}
        <div className="mb-3">
          <p className="text-xs text-muted mb-2">Katil:</p>
          <div className="flex flex-wrap gap-1">
            {room.beds.map((bed) => (
              <div key={bed.id} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${bed.occupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                <Bed size={10} />
                {bed.name}: RM {bed.price || room.price} {bed.occupied ? '(Penuh)' : '(Tersedia)'}
              </div>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 mb-3">
          {room.facilities.map(f => (
            <div key={f} className="flex items-center gap-1 bg-accent px-2 py-1 rounded-lg">
              {getFacilityIcon(f)}
              <span className="text-xs text-primary font-medium">{formatFacilityName(f)}</span>
            </div>
          ))}
        </div>

        {allOccupied ? (
          <button disabled className="btn-secondary w-full text-center text-sm opacity-50">
            🔴 Tiada Katil Tersedia
          </button>
        ) : (
          <button onClick={onBook} className="btn-primary w-full text-center text-sm">
            📋 Tempah Sekarang
          </button>
        )}
      </div>
    </div>
  )
}
