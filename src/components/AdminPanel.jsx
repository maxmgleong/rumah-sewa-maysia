import { useState, useRef } from 'react'
import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, ChevronRight } from 'lucide-react'
import { FACILITIES_LIST } from '../data/properties'

function ImageUpload({ value, onChange, label }) {
  const [preview, setPreview] = useState(value || null)
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => { setPreview(reader.result); onChange(reader.result) }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-primary mb-1">{label}</label>
      <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-accent rounded-xl p-3 text-center cursor-pointer hover:border-primary">
        {preview ? <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg" /> : <div className="text-muted text-sm"><Upload size={24} className="mx-auto mb-1" />Klik upload</div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}

function EditPropertyModal({ prop, onSave, onClose }) {
  const [form, setForm] = useState(prop)
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">Edit Property</h2><button onClick={onClose}><X size={20} /></button></div>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold mb-1">Nama</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Lokasi</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm resize-none" /></div>
          <ImageUpload value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} label="Gambar" />
        </div>
        <button onClick={() => onSave(form)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
      </div>
    </div>
  )
}

function EditRoomModal({ room, onSave, onClose }) {
  const [form, setForm] = useState(room)
  
  function handleBedChange(index, field, value) {
    const newBeds = [...form.beds]
    newBeds[index] = { ...newBeds[index], [field]: value }
    setForm({ ...form, beds: newBeds })
  }
  
  function addBed() {
    setForm({ ...form, beds: [...form.beds, { id: Date.now(), name: `Katil ${form.beds.length + 1}`, occupied: false }] })
  }
  
  function removeBed(index) {
    setForm({ ...form, beds: form.beds.filter((_, i) => i !== index) })
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">Edit Bilik</h2><button onClick={onClose}><X size={20} /></button></div>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold mb-1">Nama Bilik</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Harga (RM/bulan)</label><input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm">
              <option value="kosong">🟢 Kosong</option>
              <option value="ditempah">🔴 Telah Ditempah</option>
            </select>
          </div>
          <div><label className="block text-xs font-semibold mb-1">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm resize-none" /></div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold">🛏️ Katil ({form.beds.length})</label>
              <button onClick={addBed} className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg flex items-center gap-1"><Plus size={12} /> Tambah</button>
            </div>
            {form.beds.map((bed, i) => (
              <div key={bed.id} className="flex items-center gap-2 mb-2">
                <input value={bed.name} onChange={e => handleBedChange(i, 'name', e.target.value)} className="flex-1 border-2 border-accent rounded-lg px-3 py-2 text-xs" placeholder="Nama katil" />
                <select value={bed.occupied ? 'occupied' : ' kosong'} onChange={e => handleBedChange(i, 'occupied', e.target.value === 'occupied')} className="border-2 border-accent rounded-lg px-2 py-2 text-xs">
                  <option value="kosong">🟢</option>
                  <option value="occupied">🔴</option>
                </select>
                <button onClick={() => removeBed(i)} className="text-red-500 p-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onSave(form)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
      </div>
    </div>
  )
}

export default function AdminPanel({ properties, onSave, onBack, tenants, onUpdateTenant, onConfirm }) {
  const [editProp, setEditProp] = useState(null)
  const [editRoom, setEditRoom] = useState(null)
  const [viewProp, setViewProp] = useState(null)
  const [tab, setTab] = useState('properties')
  const pendingTenants = tenants.filter(t => t.status === 'pending')
  const confirmedTenants = tenants.filter(t => t.status === 'confirmed')
  const totalMonthlyRent = confirmedTenants.reduce((sum, t) => sum + (t.rentAmount || 0), 0)

  function saveProperty(updated) {
    onSave(properties.map(p => p.id === updated.id ? updated : p))
    setEditProp(null)
  }

  function saveRoom(updated) {
    const newProps = properties.map(p => {
      if (p.id !== viewProp.id) return p
      return { ...p, rooms: p.rooms.map(r => r.id === updated.id ? updated : r) }
    })
    onSave(newProps)
    setEditRoom(null)
    setViewProp(newProps.find(p => p.id === viewProp.id))
  }

  function deleteProperty(propId) {
    if (confirm('Delete property ini?')) onSave(properties.filter(p => p.id !== propId))
  }

  function deleteRoom(propId, roomId) {
    if (confirm('Delete bilik ini?')) {
      const newProps = properties.map(p => {
        if (p.id !== propId) return p
        return { ...p, rooms: p.rooms.filter(r => r.id !== roomId) }
      })
      onSave(newProps)
      setViewProp(newProps.find(p => p.id === propId))
    }
  }

  function addRoom() {
    const newRoom = { id: Date.now(), name: 'Bilik Baru', price: 0, status: 'kosong', description: '', beds: [{ id: Date.now(), name: 'Katil 1', occupied: false }] }
    const newProps = properties.map(p => {
      if (p.id !== viewProp.id) return p
      return { ...p, rooms: [...p.rooms, newRoom] }
    })
    onSave(newProps)
    setViewProp(newProps.find(p => p.id === viewProp.id))
  }

  if (viewProp) {
    const prop = viewProp
    return (
      <div className="min-h-screen bg-accent">
        <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
          <button onClick={() => setViewProp(null)} className="flex items-center gap-2 text-white mb-4">
            <ArrowLeft size={20} /> Kembali
          </button>
          <h1 className="text-white text-lg font-bold">{prop.name}</h1>
          <p className="text-white/70 text-sm">{prop.rooms.length} bilik</p>
        </div>
        <div className="px-4 -mt-4 pb-6">
          {prop.rooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl card-shadow p-4 mt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-primary">{room.name}</h3>
                  <p className="text-green-600 font-bold text-sm">RM{room.price}/bulan</p>
                  <p className="text-muted text-xs mt-1">{room.beds.length} katil</p>
                  <div className="flex gap-1 mt-1">
                    {room.beds.map(b => (
                      <span key={b.id} className={`text-xs px-1.5 py-0.5 rounded ${b.occupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{b.name}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditRoom(room)} className="p-2 text-primary hover:bg-accent rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => deleteRoom(prop.id, room.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addRoom} className="w-full bg-primary hover:bg-dark text-white font-bold py-4 rounded-3xl mt-6 flex items-center justify-center gap-2">
            <Plus size={20} /> Tambah Bilik
          </button>
        </div>
        {editRoom && <EditRoomModal room={editRoom} onSave={saveRoom} onClose={() => setEditRoom(null)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><ArrowLeft size={20} className="text-white" /></button>
          <h1 className="text-white text-lg font-bold">🏠 Admin Panel</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('properties')} className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${tab === 'properties' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>🏠 Properties</button>
          <button onClick={() => setTab('applications')} className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${tab === 'applications' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>📋 ({pendingTenants.length})</button>
          <button onClick={() => setTab('tenants')} className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${tab === 'tenants' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>👥 ({confirmedTenants.length})</button>
        </div>
      </div>
      <div className="px-4 -mt-4 pb-6">
        {tab === 'properties' && (
          <>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white rounded-2xl p-3 text-center"><p className="text-muted text-xs">Properties</p><p className="text-primary text-2xl font-bold">{properties.length}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center"><p className="text-muted text-xs">Bilik</p><p className="text-primary text-2xl font-bold">{properties.reduce((a, p) => a + p.rooms.length, 0)}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center"><p className="text-muted text-xs">Pendapatan</p><p className="text-green-600 text-2xl font-bold">RM{totalMonthlyRent}</p></div>
            </div>
            {properties.map(prop => (
              <div key={prop.id} className="bg-white rounded-3xl card-shadow p-4 mt-4">
                <div className="flex items-start gap-3">
                  <img src={prop.image} alt={prop.name} className="w-16 h-16 rounded-xl object-cover"
                    onError={e => e.target.src = 'https://placehold.co/100x100/e8f5f1/4A9B8C?text=Prop'} />
                  <div className="flex-1">
                    <h3 className="font-bold text-primary text-sm">{prop.name}</h3>
                    <p className="text-muted text-xs">📍 {prop.location}</p>
                    <p className="text-muted text-xs mt-1">{prop.rooms.length} bilik</p>
                    <button onClick={() => setViewProp(prop)} className="text-primary text-xs mt-2 flex items-center gap-1">Lihat Bilik <ChevronRight size={14} /></button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditProp(prop)} className="p-2 text-primary hover:bg-accent rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => deleteProperty(prop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => {
              const newProp = { id: Date.now(), name: 'Property Baru', location: 'Kuala Lumpur', image: 'https://placehold.co/600x400/e8f5f1/4A9B8C?text=Property', description: '', rooms: [] }
              onSave([...properties, newProp])
            }} className="w-full bg-primary hover:bg-dark text-white font-bold py-4 rounded-3xl mt-6 flex items-center justify-center gap-2">
              <Plus size={20} /> Tambah Property
            </button>
          </>
        )}
        {tab === 'applications' && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-muted mb-2">⏳ Permohonan ({pendingTenants.length})</h3>
            {pendingTenants.length === 0 ? <div className="bg-white rounded-3xl p-8 text-center">Tiada permohonan baru.</div> : pendingTenants.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl card-shadow p-4 mb-3">
                <h4 className="font-bold text-primary">{t.nama}</h4>
                <p className="text-xs text-muted">📅 {new Date(t.appliedAt).toLocaleDateString('ms-MY')}</p>
                <button onClick={() => onConfirm(t)} className="btn-primary mt-2 w-full">Sah & Terima</button>
              </div>
            ))}
          </div>
        )}
        {tab === 'tenants' && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-2xl p-3 text-center"><p className="text-muted text-xs">Penyewa</p><p className="text-primary text-2xl font-bold">{confirmedTenants.length}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center"><p className="text-muted text-xs">Pendapatan</p><p className="text-green-600 text-2xl font-bold">RM{totalMonthlyRent}</p></div>
            </div>
            {confirmedTenants.length === 0 ? <div className="bg-white rounded-3xl p-8 text-center mt-4">Belum ada penyewa.</div> : confirmedTenants.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl card-shadow p-4 mt-3">
                <h4 className="font-bold text-primary">{t.nama}</h4>
                <p className="text-xs text-muted">💰 Sewa: RM{t.rentAmount || 0}/bulan</p>
                <p className="text-xs text-muted">📅 Masuk: {t.tarikhMasuk || '-'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {editProp && <EditPropertyModal prop={editProp} onSave={saveProperty} onClose={() => setEditProp(null)} />}
    </div>
  )
}
