import { useState, useRef } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'

export default function BookingForm({ room, onBack, onSubmit }) {
  const [form, setForm] = useState({ nama: '', ic: '', telefon: '', tarikhMasuk: '' })
  const [icImage, setIcImage] = useState(null)
  const [icPreview, setIcPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (file) {
      setIcImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setIcPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  function validate() {
    const errs = {}
    if (!form.nama.trim()) errs.nama = 'Sila masukkan nama penuh'
    if (!form.ic.trim()) errs.ic = 'Sila masukkan No. IC'
    if (!form.telefon.trim()) errs.telefon = 'Sila masukkan no. telefon'
    if (!form.tarikhMasuk) errs.tarikhMasuk = 'Sila pilih tarikh masuk'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ ...form, icImage: icPreview })
  }

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-lg font-bold">Borang Tempahan</h1>
            <p className="text-secondary text-sm">{room.name}</p>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl card-shadow p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Nama Penuh</label>
            <input name="nama" value={form.nama} onChange={handleChange} placeholder="Contoh: Ahmad bin Ali"
              className={`w-full border-2 ${errors.nama ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">No. Kad Pengenalan (IC)</label>
            <input name="ic" value={form.ic} onChange={handleChange} placeholder="Contoh: 900101-01-1234"
              className={`w-full border-2 ${errors.ic ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.ic && <p className="text-red-500 text-xs mt-1">{errors.ic}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">No. Telefon (WhatsApp)</label>
            <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Contoh: 012-345 6789"
              className={`w-full border-2 ${errors.telefon ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.telefon && <p className="text-red-500 text-xs mt-1">{errors.telefon}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Tarikh Masuk</label>
            <input type="date" name="tarikhMasuk" value={form.tarikhMasuk} onChange={handleChange}
              className={`w-full border-2 ${errors.tarikhMasuk ? 'border-red-400' : 'border-accent'} rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none`} />
            {errors.tarikhMasuk && <p className="text-red-500 text-xs mt-1">{errors.tarikhMasuk}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Gambar Kad Pengenalan (IC)</label>
            <div onClick={() => fileRef.current.click()} className="border-2 border-dashed border-accent rounded-2xl p-6 text-center cursor-pointer hover:border-primary">
              {icPreview ? (
                <img src={icPreview} alt="IC" className="max-h-48 mx-auto rounded-xl" />
              ) : (
                <div className="text-muted">
                  <Camera size={32} className="mx-auto mb-2 text-primary" />
                  <p className="text-sm">Klik untuk muat naik gambar IC</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} className="hidden" />
          </div>
          <button type="submit" className="btn-primary w-full text-center mt-2">✅ Hantar Permohonan</button>
        </form>
        <p className="text-center text-muted text-xs mt-4 mb-6">⚠️ Maklumat disimpan secara tempatan untuk demo sahaja.</p>
      </div>
    </div>
  )
}
