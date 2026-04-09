import { Wifi, Snowflake, Refrigerator, MapPin } from 'lucide-react'

const FAC = { wifi: Wifi, ac: Snowflake, peti_sejuk: Refrigerator }
const FAC_LABEL = { wifi: 'WiFi', ac: 'AC', peti_sejuk: 'Peti Sejuk' }

export default function RoomCard({ room, onBook }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden card-shadow">
      <div className="relative">
        <img src={room.image} alt={room.name} className="w-full h-44 object-cover"
          onError={e => e.target.src = 'https://placehold.co/600x300/e8f5f1/4A9B8C?text=Bilik'} />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.status === 'kosong' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {room.status === 'kosong' ? '🟢 Kosong' : '🔴 Ditempah'}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-dark/80 text-white px-3 py-1 rounded-xl text-sm font-bold">
          RM {room.price}/<span className="text-xs font-normal">bulan</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-primary text-base mb-1">{room.name}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{room.description}</p>
        <div className="flex items-center gap-3 mb-3">
          {room.facilities.map(f => {
            const Icon = FAC[f]
            return Icon ? (
              <div key={f} className="flex items-center gap-1 bg-accent px-2 py-1 rounded-lg">
                <Icon size={13} className="text-primary" />
                <span className="text-xs text-primary font-medium">{FAC_LABEL[f]}</span>
              </div>
            ) : null
          })}
        </div>
        <button onClick={onBook} className="btn-primary w-full text-center text-sm">
          📋 Tempah Sekarang
        </button>
      </div>
    </div>
  )
}
