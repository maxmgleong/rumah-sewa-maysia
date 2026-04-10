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
import { savePropertiesToCloud, getPropertiesFromCloud, saveTenantsToCloud, getTenantsFromCloud } from './firebase'

const STORAGE_KEY = 'rental_properties_v2'
const TENANTS_KEY = 'rental_tenants_v2'

export default function App() {
  const [view, setView] = useState('rooms')
  const [filter, setFilter] = useState('semua')
  const [properties, setProperties] = useState([])
  const [selectedProp, setSelectedProp] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Try to get from cloud first
        const cloudProperties = await getPropertiesFromCloud()
        const cloudTenants = await getTenantsFromCloud()
        
        if (cloudProperties && cloudProperties.length > 0) {
          setProperties(cloudProperties)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProperties))
        } else {
          // Use local data if cloud is empty
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            setProperties(JSON.parse(saved))
          } else {
            setProperties(INITIAL_PROPERTIES)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES))
          }
        }
        
        if (cloudTenants && cloudTenants.length > 0) {
          setTenants(cloudTenants)
          localStorage.setItem(TENANTS_KEY, JSON.stringify(cloudTenants))
        } else {
          const savedTenants = localStorage.getItem(TENANTS_KEY)
          if (savedTenants) setTenants(JSON.parse(savedTenants))
        }
      } catch (error) {
        console.error("Error loading data:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          setProperties(JSON.parse(saved))
        } else {
          setProperties(INITIAL_PROPERTIES)
        }
        const savedTenants = localStorage.getItem(TENANTS_KEY)
        if (savedTenants) setTenants(JSON.parse(savedTenants))
      }
      setLoading(false)
    }
    loadData()
  }, [])

  function saveProperties(props) {
    setProperties(props)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props))
    // Save to cloud
    savePropertiesToCloud(props)
  }

  function saveTenants(newTenants) {
    setTenants(newTenants)
    localStorage.setItem(TENANTS_KEY, JSON.stringify(newTenants))
    // Save to cloud
    saveTenantsToCloud(newTenants)
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
    const newTenant = {
      ...tenantData,
      roomId: selectedRoom.id,
      propId: selectedProp.id,
      appliedAt: new Date().toISOString(),
      status: 'pending',
      rentAmount: selectedRoom.price,
      confirmedAt: null,
      nextPaymentDate: null
    }
    const updated = [...tenants, newTenant]
    saveTenants(updated)
    setView('success')
  }

  function handleConfirm(tenantData) {
    const tarikhMasuk = tenantData.tarikhMasuk
    const masukDate = new Date(tarikhMasuk)
    const nextPayment = new Date(masukDate)
    nextPayment.setMonth(nextPayment.getMonth() + 1)

    const updatedTenants = tenants.map(t => {
      if (t.appliedAt === tenantData.appliedAt && t.roomId === tenantData.roomId) {
        return {
          ...t,
          status: 'confirmed',
          confirmedAt: new Date().toISOString(),
          nextPaymentDate: nextPayment.toISOString(),
          rentAmount: tenantData.rentAmount || t.rentAmount
        }
      }
      return t
    })
    saveTenants(updatedTenants)

    const updatedProps = properties.map(p => {
      if (p.id !== tenantData.propId) return p
      return { ...p, rooms: p.rooms.map(r => r.id === tenantData.roomId ? { ...r, status: 'ditempah' } : r) }
    })
    saveProperties(updatedProps)
    if (selectedProp) {
      const updated = updatedProps.find(p => p.id === selectedProp.id)
      if (updated) setSelectedProp(updated)
    }
  }

  function handleUpdateTenant(updatedTenant) {
    const updated = tenants.map(t => t.appliedAt === updatedTenant.appliedAt && t.roomId === updatedTenant.roomId ? updatedTenant : t)
    saveTenants(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-primary font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  const totalBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.length, 0), 0)
  const kosongBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.filter(b => !b.occupied).length, 0), 0)

  return (
    <div className="min-h-screen bg-accent pb-8">
      {view === 'rooms' && (
        <>
          <Header onAdmin={() => setView('admin')} kosongBeds={kosongBeds} totalBeds={totalBeds} />
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
      {view === 'admin' && (
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
