import { useState, useEffect } from 'react'
import { INITIAL_PROPERTIES } from './data/properties'
import Header from './components/Header'
import FilterTabs from './components/FilterTabs'
import PropertyCard from './components/PropertyCard'
import PropertyDetail from './components/PropertyDetail'
import RoomDetail from './components/RoomDetail'
import BookingForm from './components/BookingForm'
import SuccessPage from './components/SuccessPage'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'

const STORAGE_KEY = 'rental_properties_v2'

export default function App() {
  const [view, setView] = useState('rooms')
  const [filter, setFilter] = useState('semua')
  const [properties, setProperties] = useState([])
  const [selectedProp, setSelectedProp] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tenants, setTenants] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setProperties(JSON.parse(saved))
    } else {
      setProperties(INITIAL_PROPERTIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES))
    }
    const savedTenants = localStorage.getItem('rental_tenants')
    if (savedTenants) setTenants(JSON.parse(savedTenants))
  }, [])

  function saveProperties(props) {
    setProperties(props)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props))
  }

  function getFilteredProperties() {
    if (filter === 'kosong') {
      return properties.filter(p => p.rooms.some(r => r.beds.some(b => !b.occupied)))
    }
    return properties
  }

  function handlePropertyClick(prop) {
    setSelectedProp(prop)
    setView('property')
  }

  function handleRoomClick(room, prop) {
    setSelectedRoom(room)
    setSelectedProp(prop)
    setView('room')
  }

  function handleBook(room) {
    setSelectedRoom(room)
    setView('form')
  }

  function handleSubmit(tenantData) {
    const newTenant = { ...tenantData, roomId: selectedRoom.id, propId: selectedProp.id, appliedAt: new Date().toISOString() }
    const updated = [...tenants, newTenant]
    setTenants(updated)
    localStorage.setItem('rental_tenants', JSON.stringify(updated))
    setView('success')
  }

  function handleConfirm(propId, roomId) {
    const updatedProps = properties.map(p => {
      if (p.id !== propId) return p
      return { ...p, rooms: p.rooms.map(r => r.id === roomId ? { ...r, status: 'ditempah' } : r) }
    })
    saveProperties(updatedProps)
    if (selectedProp) {
      const updated = updatedProps.find(p => p.id === selectedProp.id)
      if (updated) setSelectedProp(updated)
    }
  }

  const totalBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.length, 0), 0)
  const kosongBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.filter(b => !b.occupied).length, 0), 0)

  return (
    <div className="min-h-screen bg-accent pb-8">
      {view === 'rooms' && (
        <>
          <Header onDashboard={() => setView('dashboard')} onAdmin={() => setView('admin')} kosongBeds={kosongBeds} totalBeds={totalBeds} />
          <FilterTabs filter={filter} onFilterChange={setFilter} />
          <div className="px-4 space-y-4">
            {getFilteredProperties().map(prop => (
              <PropertyCard key={prop.id} property={prop} onClick={() => handlePropertyClick(prop)} />
            ))}
          </div>
        </>
      )}
      {view === 'property' && selectedProp && (
        <PropertyDetail property={selectedProp} onBack={() => setView('rooms')} onRoomClick={(room) => handleRoomClick(room, selectedProp)} />
      )}
      {view === 'room' && selectedRoom && selectedProp && (
        <RoomDetail room={selectedRoom} property={selectedProp} onBack={() => setView('property')} onBook={() => handleBook(selectedRoom)} />
      )}
      {view === 'form' && selectedRoom && (
        <BookingForm room={selectedRoom} property={selectedProp} onBack={() => setView('room')} onSubmit={handleSubmit} />
      )}
      {view === 'success' && (
        <SuccessPage room={selectedRoom} property={selectedProp} onHome={() => { setView('rooms'); setSelectedRoom(null); setSelectedProp(null) }} />
      )}
      {view === 'dashboard' && (
        <Dashboard tenants={tenants} properties={properties} onBack={() => setView('rooms')} onConfirm={handleConfirm} />
      )}
      {view === 'admin' && (
        <AdminPanel properties={properties} onSave={saveProperties} onBack={() => setView('rooms')} />
      )}
    </div>
  )
}
