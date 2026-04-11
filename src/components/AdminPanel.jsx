import { useState, useRef } from 'react'
import { ArrowLeft, Edit2, Trash2, Plus, Save, X, Upload, Calendar, DollarSign, Users, CheckCircle, Phone, Image } from 'lucide-react'
import { FACILITIES_LIST } from '../data/properties'
import { uploadImage } from '../imgbb'

function ImageUpload({ value, onChange, label, folder }) {
  const [preview, setPreview] = useState(value || null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  async function handleFile(e) {
    const file = e.target.files[0]
    if (file) {
      setUploading(true)
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      
      // Upload to Cloudflare R2
      try {
        const url = await uploadImage(file, folder)
        if (url) {
          onChange(url)
        } else {
          // Fallback to base64
          const reader2 = new FileReader()
          reader2.onloadend = () => onChange(reader2.result)
          reader2.readAsDataURL(file)
        }
      } catch (error) {
        console.log('Upload failed, using base64')
        const reader2 = new FileReader()
        reader2.onloadend = () => onChange(reader2.result)
        reader2.readAsDataURL(file)
      }
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-primary mb-1">{label}</label>
      <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-accent rounded-xl p-3 text-center cursor-pointer hover:border-primary transition-colors">
        {uploading ? (
          <div className="text-muted text-sm">ΓÅ│ Uploading...</div>
        ) : preview ? (
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
          <ImageUpload value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} label="Gambar Property" folder="properties" />
        </div>
        <button onClick={() => onSave(form)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
      </div>
    </div>
  )
}

function EditRoomModal({ room, onSave, onClose }) {
  const [form, setForm] = useState({ ...room })
  const [customFacility, setCustomFacility] = useState('')
  const fileRef = useRef()

  function toggleFacility(f) {
    setForm(p => ({ ...p, facilities: p.facilities.includes(f) ? p.facilities.filter(x => x !== f) : [...p.facilities, f] }))
  }

  function addCustomFacility() {
    if (customFacility.trim()) {
      const newFacility = customFacility.trim().toLowerCase().replace(/\s+/g, '_')
      if (!form.facilities.includes(newFacility)) {
        setForm(p => ({ ...p, facilities: [...p.facilities, newFacility] }))
      }
      setCustomFacility('')
    }
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
    setForm(p => ({ ...p, beds: [...p.beds, { id: Date.now(), name: `Katil ${p.beds.length + 1}`, price: p.price || 0, occupied: false }] }))
  }

  function updateBed(id, field, value) {
    setForm(p => ({ ...p, beds: p.beds.map(b => b.id === id ? { ...b, [field]: value } : b) }))
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
              <option value="kosong">≡ƒƒó Kosong</option><option value="ditempah">≡ƒö┤ Telah Ditempah</option></select></div>
          <div><label className="block text-xs font-semibold text-primary mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" /></div>
          <ImageUpload value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} label="Gambar Bilik" folder="rooms" />
          <div><label className="block text-xs font-semibold text-primary mb-2">Fasiliti</label>
            <div className="flex flex-wrap gap-2">
              {FACILITIES_LIST.map(f => (
                <button key={f} onClick={() => toggleFacility(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.facilities.includes(f) ? 'bg-primary text-white border-primary' : 'border-accent text-muted'}`}>
                  {f === 'wifi' ? '≡ƒô╢' : f === 'ac' ? 'Γ¥ä∩╕Å' : f === 'peti_sejuk' ? '≡ƒºè' : '≡ƒÜù'} {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {/* Custom facilities */}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.facilities.filter(f => !FACILITIES_LIST.includes(f)).map(f => (
                <span key={f} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300 flex items-center gap-1">
                  Γ£¿ {f.replace(/_/g, ' ')}
                  <button onClick={() => toggleFacility(f)} className="ml-1 text-purple-500 hover:text-purple-700">├ù</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input type="text" value={customFacility} onChange={e => setCustomFacility(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomFacility())}
                placeholder="Tambah fasiliti lain..."
                className="flex-1 border-2 border-dashed border-accent rounded-xl px-3 py-2 text-xs focus:border-primary focus:outline-none" />
              <button onClick={addCustomFacility} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-xl text-xs font-bold">+</button>
            </div>
          </div>
          <div><label className="block text-xs font-semibold text-primary mb-2">Katil dalam Bilik (Harga Sebulan)</label>
            <div className="space-y-2">
              {form.beds.map((bed, i) => (
                <div key={bed.id} className="flex items-center gap-2">
                  <input value={bed.name} onChange={e => updateBed(bed.id, 'name', e.target.value)}
                    placeholder="Nama katil"
                    className="flex-1 border-2 border-accent rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  <input type="number" value={bed.price || 0} onChange={e => updateBed(bed.id, 'price', +e.target.value)}
                    placeholder="RM"
                    className="w-24 border-2 border-accent rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none" />
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

function EditTenantModal({ tenant, onSave, onClose }) {
  const [form, setForm] = useState({ ...tenant })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleDateChange(e) {
    const { name, value } = e.target
    const newDate = new Date(value)
    const nextPayment = new Date(newDate)
    nextPayment.setMonth(nextPayment.getMonth() + 1)
    setForm(prev => ({
      ...prev,
      [name]: value,
      nextPaymentDate: nextPayment.toISOString()
    }))
  }

  function handleSave() {
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">Edit Maklumat Sewa</h2>
          <button onClick={onClose} className="text-muted"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="bg-accent rounded-xl p-3">
            <p className="text-xs text-muted">Nama Penyewa</p>
            <p className="font-bold text-primary">{form.nama}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">≡ƒÆ░ Sewa (RM/sebulan)</label>
            <input type="number" name="rentAmount" value={form.rentAmount || 0} onChange={handleChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">≡ƒôà Tarikh Masuk</label>
            <input type="date" name="tarikhMasuk" value={form.tarikhMasuk?.split('T')[0] || ''} onChange={handleDateChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">≡ƒôà Tarikh Bayar Sewa Berikutnya</label>
            <input type="date" name="nextPaymentDate" value={form.nextPaymentDate?.split('T')[0] || ''} onChange={handleChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">≡ƒô¥ Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border-2 border-accent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
              <option value="pending">ΓÅ│ Menunggu</option>
              <option value="confirmed">Γ£à Disahkan</option>
              <option value="ended">≡ƒö┤ Tamat</option>
            </select>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"><Save size={18} /> Simpan</button>
      </div>
    </div>
  )
}

function ViewTenantModal({ tenant, onClose }) {
  function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-primary">Maklumat {tenant.nama}</h3>
          <button onClick={onClose} className="text-muted"><X size={20} /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div><span className="text-muted">Bed:</span> <span className="font-bold">{tenant.selectedBedName}</span></div>
          <div><span className="text-muted">No. IC:</span> <span className="font-mono font-bold">{tenant.ic}</span></div>
          <div><span className="text-muted">Telefon:</span> <span className="font-bold">{tenant.telefon}</span></div>
          <div><span className="text-muted">Tarikh Masuk:</span> {tenant.tarikhMasuk}</div>
          <div><span className="text-muted">Tarikh Mohon:</span> {formatDate(tenant.appliedAt)}</div>
          {tenant.icImage && (
            <div>
              <span className="text-muted">Gambar IC:</span>
              <img src={tenant.icImage} alt="IC" className="mt-2 w-full rounded-xl border-2 border-accent" />
            </div>
          )}
        </div>
        <button onClick={onClose} className="btn-secondary w-full mt-4 text-center">Tutup</button>
      </div>
    </div>
  )
}

export default function AdminPanel({ properties, onSave, onBack, tenants, onUpdateTenant, onConfirm }) {
  const [editProp, setEditProp] = useState(null)
  const [editRoom, setEditRoom] = useState(null)
  const [editTenant, setEditTenant] = useState(null)
  const [viewTenant, setViewTenant] = useState(null)
  const [tab, setTab] = useState('properties') // 'properties', 'applications', 'tenants'

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

  function getRoomInfo(roomId, propId) {
    const prop = properties.find(p => p.id === propId)
    if (!prop) return { propName: 'Property', roomName: 'Bilik' }
    const room = prop.rooms.find(r => r.id === roomId)
    return { propName: prop.name, roomName: room?.name || 'Bilik', roomPrice: room?.price || 0 }
  }

  function handleWhatsApp(telefon) {
    const clean = telefon.replace(/[-\s]/g, '')
    window.open(`https://wa.me/6${clean}`, '_blank')
  }

  function formatDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function formatShortDate(iso) {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })
  }

  const totalBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.length, 0), 0)
  const kosongBeds = properties.reduce((a, p) => a + p.rooms.reduce((b, r) => b + r.beds.filter(b => !b.occupied).length, 0), 0)
  const confirmedTenants = tenants.filter(t => t.status === 'confirmed')
  const pendingTenants = tenants.filter(t => t.status === 'pending')
  const totalMonthlyRent = confirmedTenants.reduce((sum, t) => sum + (t.rentAmount || 0), 0)

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" /></button>
          <h1 className="text-white text-lg font-bold">≡ƒÅá Admin Panel</h1>
        </div>
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button onClick={() => setTab('properties')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors ${tab === 'properties' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>
            ≡ƒÅá Properties
          </button>
          <button onClick={() => setTab('applications')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors ${tab === 'applications' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>
            ≡ƒôï Permohonan {pendingTenants.length > 0 && `(${pendingTenants.length})`}
          </button>
          <button onClick={() => setTab('tenants')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors ${tab === 'tenants' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>
            ≡ƒæÑ Penyewa
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-6">
        {/* PROPERTIES TAB */}
        {tab === 'properties' && (
          <>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-muted text-xs">Properties</p><p className="text-primary text-2xl font-bold">{properties.length}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-muted text-xs">Jumlah Bilik</p><p className="text-primary text-2xl font-bold">{properties.reduce((a, p) => a + p.rooms.length, 0)}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-muted text-xs">Katil Kosong</p><p className="text-primary text-2xl font-bold">{kosongBeds}/{totalBeds}</p></div>
            </div>
            {properties.map(prop => (
              <div key={prop.id} className="bg-white rounded-3xl card-shadow p-4 mt-4">
                <div className="flex items-start gap-3 mb-3">
                  <img src={prop.image} alt={prop.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    onError={e => e.target.src = 'https://placehold.co/100x100/e8f5f1/4A9B8C?text=Prop'} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary text-sm">{prop.name}</h3>
                    <p className="text-muted text-xs">≡ƒôì {prop.location}</p>
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
                        <p className="text-muted text-xs">RM {room.price}/bln ┬╖ {room.beds.length} katil ┬╖ {room.beds.filter(b => !b.occupied).length} kosong</p>
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
          </>
        )}

        {/* APPLICATIONS TAB (Dashboard functionality) */}
        {tab === 'applications' && (
          <>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-muted text-xs">Permohonan</p><p className="text-primary text-2xl font-bold">{pendingTenants.length}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-muted text-xs">Disahkan</p><p className="text-green-600 text-2xl font-bold">{confirmedTenants.length}</p></div>
              <div className="bg-white rounded-2xl p-3 text-center shadow"><p className="text-muted text-xs">Pendapatan</p><p className="text-green-600 text-2xl font-bold">RM{totalMonthlyRent}</p></div>
            </div>

            <h3 className="text-sm font-bold text-muted uppercase tracking-wide mt-4 mb-2">ΓÅ│ Menunggu Pengesahan ({pendingTenants.length})</h3>
            {pendingTenants.length === 0 ? (
              <div className="bg-white rounded-3xl card-shadow p-8 text-center">
                <p className="text-muted">Tiada permohonan baru.</p>
              </div>
            ) : (
              <div className="space-y-3 pb-6">
                {pendingTenants.map((tenant, idx) => {
                  const { propName, roomName } = getRoomInfo(tenant.roomId, tenant.propId)
                  return (
                    <div key={idx} className="bg-white rounded-2xl card-shadow p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-primary">{tenant.nama}</h3>
                          <p className="text-xs text-muted">{propName} - {roomName}</p>
                          <p className="text-xs text-muted mt-1">≡ƒ¢Å {tenant.selectedBedName}</p>
                          <p className="text-xs text-muted">≡ƒôà {tenant.tarikhMasuk || 'Tiada tarikh'}</p>
                          <p className="text-xs text-muted">ΓÅ▒ {formatDate(tenant.appliedAt)}</p>
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => setViewTenant(tenant)} className="flex items-center gap-1 text-xs text-primary border border-primary px-2 py-1 rounded-lg hover:bg-accent">
                              <Image size={12} /> Lihat IC
                            </button>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">Menunggu</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-3">
                          <button onClick={() => handleWhatsApp(tenant.telefon)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                            <Phone size={13} /> WhatsApp
                          </button>
                          <button onClick={() => onConfirm(tenant)} className="bg-primary hover:bg-dark text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                            <CheckCircle size={13} /> Sah
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* TENANTS TAB (Confirmed tenants) */}
        {tab === 'tenants' && (
          <>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white rounded-2xl p-3 text-center shadow">
                <p className="text-muted text-xs">Jumlah Penyewa</p>
                <p className="text-primary text-2xl font-bold">{confirmedTenants.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center shadow">
                <p className="text-muted text-xs">Pendapatan Bulanan</p>
                <p className="text-green-600 text-2xl font-bold">RM {totalMonthlyRent}</p>
              </div>
            </div>

            {confirmedTenants.length === 0 ? (
              <div className="bg-white rounded-3xl card-shadow p-8 text-center mt-4">
                <p className="text-muted">Belum ada penyewa yang disahkan.</p>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-bold text-muted uppercase tracking-wide mt-4 mb-2">≡ƒÆ╝ Penyewa Aktif</h3>
                <div className="space-y-3 pb-6">
                  {confirmedTenants.map((tenant, idx) => {
                    const { propName, roomName } = getRoomInfo(tenant.roomId, tenant.propId)
                    const nextPayment = tenant.nextPaymentDate ? new Date(tenant.nextPaymentDate) : null
                    const daysUntilPayment = nextPayment ? Math.ceil((nextPayment - new Date()) / (1000 * 60 * 60 * 24)) : null
                    return (
                      <div key={idx} className="bg-white rounded-2xl card-shadow p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-primary">{tenant.nama}</h3>
                            <p className="text-xs text-muted">{propName} - {roomName}</p>
                          </div>
                          <button onClick={() => setEditTenant(tenant)} className="p-2 text-primary hover:bg-accent rounded-lg">
                            <Edit2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-green-50 rounded-xl p-2 text-center">
                            <DollarSign size={14} className="text-green-600 mx-auto mb-1" />
                            <p className="text-xs text-muted">Sewa</p>
                            <p className="font-bold text-green-700">RM {tenant.rentAmount || 0}</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-2 text-center">
                            <Calendar size={14} className="text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-muted">Masuk</p>
                            <p className="font-bold text-blue-700">{formatShortDate(tenant.tarikhMasuk)}</p>
                          </div>
                          <div className={`rounded-xl p-2 text-center ${daysUntilPayment !== null && daysUntilPayment <= 7 ? 'bg-red-50' : 'bg-orange-50'}`}>
                            <Calendar size={14} className={`mx-auto mb-1 ${daysUntilPayment !== null && daysUntilPayment <= 7 ? 'text-red-600' : 'text-orange-600'}`} />
                            <p className="text-xs text-muted">Bayar</p>
                            <p className={`font-bold ${daysUntilPayment !== null && daysUntilPayment <= 7 ? 'text-red-700' : 'text-orange-700'}`}>
                              {daysUntilPayment !== null ? `${daysUntilPayment}h` : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted">
                          <p>≡ƒôà Tarikh masuk: {formatDate(tenant.tarikhMasuk)}</p>
                          <p>≡ƒÆ╡ Bayar berikutnya: {formatDate(tenant.nextPaymentDate)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {editProp && <EditPropertyModal prop={editProp} onSave={saveProperty} onClose={() => setEditProp(null)} />}
      {editRoom && <EditRoomModal room={editRoom} onSave={saveRoom} onClose={() => setEditRoom(null)} />}
      {editTenant && <EditTenantModal tenant={editTenant} onSave={onUpdateTenant} onClose={() => setEditTenant(null)} />}
      {viewTenant && <ViewTenantModal tenant={viewTenant} onClose={() => setViewTenant(null)} />}
    </div>
  )
}
