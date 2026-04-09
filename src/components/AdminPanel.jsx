import { useState, useRef } from 'react'
import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload } from 'lucide-react'
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
      <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-accent rounded-xl p-3 text-center cursor-pointer hover:border-primary transition-colors">
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
        ) : (
          <div className="text-muted text-sm"><Upload size={24} className="mx-auto mb-1" />Klik untuk upload</div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}

function EditPropertyModal({ prop, onSave, onClose }) {
  const [form, setForm] = useState(prop)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">Edit Property</h2>
          <button onClick={onClose} className="text-muted"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold text-primary mb-1">Nama Property</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-primary mb-1">Lokasi</label>
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-primary mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" /></div>
          <ImageUpload value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} label="Gambar Property" />
        </div>
        <button onClick={() => onSave(form)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
      </div>
    </div>
  )
}

function EditRoomModal({ room, onSave, onClose }) {
  const [form, setForm] = useState({ ...room })
  const fileRef = useRef()

  function toggleFacility(f) {
    setForm(p => ({ ...p, facilities: p.facilities.includes(f) ? p.facilities.filter(x => x !== f) : [...p.facilities, f] }))
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setForm(p => ({ ...p, image: reader.result }))
      reader.readAsDataURL(file)
    }
  }

  function addBed() {
    setForm(p => ({ ...p, beds: [...p.beds, { id: Date.now(), name: `Katil ${p.beds.length + 1}`, occupied: false }] }))
  }

  function updateBed(id, name) {
    setForm(p => ({ ...p, beds: p.beds.map(b => b.id === id ? { ...b, name } : b) }))
  }

  function removeBed(id) {
    setForm(p => ({ ...p, beds: p.beds.filter(b => b.id !== id) }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">Edit Bilik</h2>
          <button onClick={onClose} className="text-muted"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-semibold text-primary mb-1">Nama Bilik</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-primary mb-1">Harga (RM/sebulan)</label>
            <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: +e.target.value }))}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs font-semibold text-primary mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
              <option value="kosong">🟢 Kosong</option><option value="ditempah">🔴 Telah Ditempah</option></select></div>
          <div><label className="block text-xs font-semibold text-primary mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" /></div>
          <ImageUpload value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} label="Gambar Bilik" />
          <div><label className="block text-xs font-semibold text-primary mb-2">Fasiliti</label>
            <div className="flex flex-wrap gap-2">
              {FACILITIES_LIST.map(f => (
                <button key={f} onClick={() => toggleFacility(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.facilities.includes(f) ? 'bg-primary text-white border-primary' : 'border-accent text-muted'}`}>
                  {f === 'wifi' ? '📶' : f === 'ac' ? '❄️' : f === 'peti_sejuk' ? '🧊' : '🚗'} {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div><label className="block text-xs font-semibold text-primary mb-2">Katil dalam Bilik</label>
            <div className="space-y-2">
              {form.beds.map((bed, i) => (
                <div key={bed.id} className="flex items-center gap-2">
                  <input value={bed.name} onChange={e => updateBed(bed.id, e.target.value)}
                    className="flex-1 border-2 border-accent rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  <button onClick={() => removeBed(bed.id)} className="text-red-500 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={addBed} className="flex items-center gap-1 text-primary text-xs font-semibold border border-dashed border-primary rounded-xl px-3 py-2 hover:bg-accent">
                <Plus size={14} /> Tambah Katil
              </button>
            </div>
          </div>
        </div>
        <button onClick={() => onSave(form)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan Bilik</button>
      </div>
    </div>
  )
}

export default function AdminPanel({ properties, onSave, onBack }) {
  const [editProp, setEditProp] = useState(null)
  const [editRoom, setEditRoom] = useState(null)

  function saveProperty(updated) {
    onSave(properties.map(p => p.id === updated.id ? updated : p))
    setEditProp(null)
  }

  function saveRoom(updated) {
    const updatedProps = properties.map(p => ({ ...p, rooms: p.rooms.map(r => r.id === updated.id ? updated : r) }))
    onSave(updatedProps)
    setEditRoom(null)
  }

  function addRoom(propId) {
    const prop = properties.find(p => p.id === propId)
    const newRoom = {
      id: Date.now(), name: 'Bilik Baru', price: 500, status: 'kosong',
      description: 'Description bilik baru', image: '', facilities: ['wifi'],
      beds: [{ id: Date.now(), name: 'Katil 1', occupied: false }]
    }
    onSave(properties.map(p => p.id === propId ? { ...p, rooms: [...p.rooms, newRoom] } : p))
  }

  function deleteRoom(propId, roomId) {
    if (!confirm('Delete bilik ini?')) return
    onSave(properties.map(p => p.id === propId ? { ...p, rooms: p.rooms.filter(r => r.id !== roomId) } : p))
  }

  function deleteProperty(propId) {
    if (!confirm('Delete property ini dan semua bilik?')) return
    onSave(properties.filter(p => p.id !== propId))
  }

  const totalBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.length, 0), 0)
  const kosongBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.filter(b => !b.occupied).length, 0), 0)

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" /></button>
          <h1 className="text-white text-lg font-bold">🏠 Edit Properties</h1>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/15 rounded-2xl p-3 text-center"><p className="text-white/80 text-xs">Properties</p><p className="text-white text-2xl font-bold">{properties.length}</p></div>
          <div className="bg-white/15 rounded-2xl p-3 text-center"><p className="text-white/80 text-xs">Jumlah Bilik</p><p className="text-white text-2xl font-bold">{properties.reduce((a, p) => a + p.rooms.length, 0)}</p></div>
          <div className="bg-white/15 rounded-2xl p-3 text-center"><p className="text-white/80 text-xs">Katil Kosong</p><p className="text-white text-2xl font-bold">{kosongBeds}/{totalBeds}</p></div>
        </div>
      </div>
      <div className="px-4 -mt-4 pb-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white rounded-3xl card-shadow p-4 mt-4">
            <div className="flex items-start gap-3 mb-3">
              <img src={prop.image} alt={prop.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                onError={e => e.target.src = 'https://placehold.co/100x100/e8f5f1/4A9B8C?text=Prop'} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-primary text-sm">{prop.name}</h3>
                <p className="text-muted text-xs">📍 {prop.location}</p>
                <p className="text-muted text-xs mt-1">{prop.rooms.length} bilik</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditProp(prop)} className="p-2 text-primary hover:bg-accent rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => deleteProperty(prop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="border-t pt-3 space-y-2">
              {prop.rooms.map(room => (
                <div key={room.id} className="flex items-center gap-2 bg-accent rounded-xl p-2.5">
                  <img src={room.image || prop.image} alt={room.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    onError={e => e.target.src = 'https://placehold.co/80x80/e8f5f1/4A9B8C?text=Room'} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary text-xs truncate">{room.name}</p>
                    <p className="text-muted text-xs">RM {room.price}/bln · {room.beds.length} katil · {room.beds.filter(b => !b.occupied).length} kosong</p>
                  </div>
                  <button onClick={() => setEditRoom(room)} className="p-1.5 text-primary hover:bg-white rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => deleteRoom(prop.id, room.id)} className="p-1.5 text-red-500 hover:bg-white rounded-lg"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => addRoom(prop.id)} className="w-full flex items-center justify-center gap-1 border border-dashed border-primary rounded-xl py-2 text-primary text-xs font-semibold hover:bg-accent">
                <Plus size={14} /> Tambah Bilik
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => {
          const newProp = { id: Date.now(), name: 'Property Baru', location: 'Kuala Lumpur', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', description: 'Description property baru', rooms: [] }
          onSave([...properties, newProp])
        }} className="w-full bg-primary hover:bg-dark text-white font-bold py-4 rounded-3xl mt-6 flex items-center justify-center gap-2">
          <Plus size={20} /> Tambah Property Baru
        </button>
      </div>
      {editProp && <EditPropertyModal prop={editProp} onSave={saveProperty} onClose={() => setEditProp(null)} />}
      {editRoom && <EditRoomModal room={editRoom} onSave={saveRoom} onClose={() => setEditRoom(null)} />}
    </div>
  )
}
