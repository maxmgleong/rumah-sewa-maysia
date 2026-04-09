import { useState } from 'react'
import Header from './components/Header'
import FilterTabs from './components/FilterTabs'
import RoomCard from './components/RoomCard'
import RoomDetail from './components/RoomDetail'
import BookingForm from './components/BookingForm'
import SuccessPage from './components/SuccessPage'
import Dashboard from './components/Dashboard'

const ROOMS = [
  { id: 1, name: 'Bilik Master Katil Queen', price: 750, status: 'kosong', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80', facilities: ['wifi', 'ac', 'peti_sejuk'], description: 'Bilik master luas dengan katil queen size, almari besar, dan meja study.' },
  { id: 2, name: 'Bilik Single AC', price: 450, status: 'ditempah', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', facilities: ['wifi', 'ac'], description: 'Bilik single dengan AC dan katil single. Sesuai untuk pelajar.' },
  { id: 3, name: 'Bilik Double Shared', price: 550, status: 'kosong', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', facilities: ['wifi', 'ac', 'peti_sejuk'], description: 'Bilik double untuk 2 orang, ideal untuk pasangan.' },
  { id: 4, name: 'Studio Apartment', price: 1200, status: 'kosong', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', facilities: ['wifi', 'ac', 'peti_sejuk'], description: 'Studio lengkap dengan dapur kecil dan bilik air sendiri.' },
  { id: 5, name: 'Bilik AC Budget', price: 380, status: 'ditempah', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', facilities: ['wifi', 'ac'], description: 'Bilik AC budget dengan katil single. Lokasi strategik.' },
  { id: 6, name: 'Medium Room Near LRT', price: 600, status: 'kosong', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80', facilities: ['wifi', 'ac', 'peti_sejuk'], description: 'Bilik sederhana dengan katil queen. 5 minit ke LRT.' },
]

export default function App() {
  const [view, setView] = useState('rooms')
  const [filter, setFilter] = useState('semua')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState(ROOMS)

  const filteredRooms = filter === 'kosong' ? rooms.filter(r => r.status === 'kosong') : rooms
  const kosongCount = rooms.filter(r => r.status === 'kosong').length

  function handleBook(room) {
    setSelectedRoom(room)
    setView('form')
  }

  function handleSubmit(tenantData) {
    const newTenant = { ...tenantData, roomId: selectedRoom.id, appliedAt: new Date().toISOString() }
    const updated = [...tenants, newTenant]
    setTenants(updated)
    localStorage.setItem('rental_tenants', JSON.stringify(updated))
    setView('success')
  }

  function handleConfirm(roomId) {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status: 'ditempah' } : r))
  }

  return (
    <div className="min-h-screen bg-accent pb-8">
      {view === 'rooms' && (
        <>
          <Header onDashboard={() => setView('dashboard')} kosongCount={kosongCount} />
          <FilterTabs filter={filter} onFilterChange={setFilter} />
          <div className="px-4 space-y-4">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} onBook={() => handleBook(room)} />
            ))}
          </div>
        </>
      )}
      {view === 'detail' && selectedRoom && (
        <RoomDetail room={selectedRoom} onBack={() => setView('rooms')} onBook={() => handleBook(selectedRoom)} />
      )}
      {view === 'form' && selectedRoom && (
        <BookingForm room={selectedRoom} onBack={() => setView('rooms')} onSubmit={handleSubmit} />
      )}
      {view === 'success' && (
        <SuccessPage room={selectedRoom} onHome={() => { setView('rooms'); setSelectedRoom(null) }} />
      )}
      {view === 'dashboard' && (
        <Dashboard tenants={tenants} rooms={rooms} onBack={() => setView('rooms')} onConfirm={handleConfirm} />
      )}
    </div>
  )
}
