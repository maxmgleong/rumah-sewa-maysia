import { useState, useEffect } from 'react'
import { INITIAL_PROPERTIES } from './data/properties'
import Header from './components/Header'
import FilterTabs from './components/FilterTabs'
import PropertyCard from './components/PropertyCard'
import PropertyDetail from './components/PropertyDetail'
import RoomDetail from './components/RoomDetail'
import BookingForm from './components/BookingForm'
import SuccessPage from './components/SuccessPage'
import AdminPanel from './components/AdminPanel'
import AdminLogin from './components/AdminLogin'

export default function App() {
  const [view, setView] = useState('rooms')
  const [filter, setFilter] = useState('semua')
  const [properties, setProperties] = useState(INITIAL_PROPERTIES)
  const [selectedProp, setSelectedProp] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)

  function saveProperties(props) {
    setProperties(props)
  }

  function saveTenants(newTenants) {
    setTenants(newTenants)
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
    setView('success')
  }

  function handleConfirm(tenantData) {
    // confirm logic
  }

  function handleUpdateTenant(updatedTenant) {
    // update logic
  }

  function handleAdminLogin() {
    setAdminLoggedIn(true)
    setView('admin')
  }

  const totalBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.length, 0), 0)
  const kosongBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.filter(b => !b.occupied).length, 0), 0)

  return (
    <div className="min-h-screen bg-accent pb-8">
      {view === 'rooms' && (
        <>
          <Header onAdmin={() => handleAdminLogin()} kosongBeds={kosongBeds} totalBeds={totalBeds} />
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
      {view === 'admin' && !adminLoggedIn && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
      {view === 'admin' && adminLoggedIn && (
        <AdminPanel
          properties={properties}
          onSave={saveProperties}
          onBack={() => setView('rooms')}
          tenants={tenants}
          onUpdateTenant={handleUpdateTenant}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
