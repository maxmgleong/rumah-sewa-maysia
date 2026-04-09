import { useState } from 'react'
import { ArrowLeft, Phone, CheckCircle, Image, X } from 'lucide-react'

export default function Dashboard({ tenants, rooms, onBack, onConfirm }) {
  const [selectedTenant, setSelectedTenant] = useState(null)

  function getRoomName(roomId) {
    return rooms.find(r => r.id === roomId)?.name || 'Bilik'
  }

  function handleWhatsApp(telefon) {
    const clean = telefon.replace(/[-\s]/g, '')
    window.open(`https://wa.me/6${clean}`, '_blank')
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const kosongCount = rooms.filter(r => r.status === 'kosong').length
  const ditempahCount = rooms.filter(r => r.status === 'ditempah').length

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-white text-lg font-bold">Dashboard Tuan Rumah</h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-2xl p-4 text-center">
            <p className="text-white/80 text-xs mb-1">Bilik Kosong</p>
            <p className="text-white text-3xl font-bold">{kosongCount}</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-4 text-center">
            <p className="text-white/80 text-xs mb-1">Ditempah</p>
            <p className="text-white text-3xl font-bold">{ditempahCount}</p>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-4">
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3 mt-4">
          Senarai Permohonan ({tenants.length})
        </h2>
        {tenants.length === 0 ? (
          <div className="bg-white rounded-3xl card-shadow p-8 text-center">
            <p className="text-muted">Belum ada permohonan lagi.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {tenants.map((tenant, idx) => (
              <div key={idx} className="bg-white rounded-2xl card-shadow p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-primary">{tenant.nama}</h3>
                    <p className="text-xs text-muted">{getRoomName(tenant.roomId)}</p>
                    <p className="text-xs text-muted">📅 {tenant.tarikhMasuk}</p>
                    <p className="text-xs text-muted">⏱ {formatDate(tenant.appliedAt)}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setSelectedTenant(tenant)} className="flex items-center gap-1 text-xs text-primary border border-primary px-2 py-1 rounded-lg hover:bg-accent">
                        <Image size={12} /> Lihat IC
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-3">
                    <button onClick={() => handleWhatsApp(tenant.telefon)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Phone size={13} /> WhatsApp
                    </button>
                    <button onClick={() => onConfirm(tenant.roomId)} className="bg-primary hover:bg-dark text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={13} /> Sah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedTenant && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTenant(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary">Maklumat {selectedTenant.nama}</h3>
              <button onClick={() => setSelectedTenant(null)} className="text-muted"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted">No. IC:</span> <span className="font-mono font-bold">{selectedTenant.ic}</span></div>
              <div><span className="text-muted">Telefon:</span> <span className="font-bold">{selectedTenant.telefon}</span></div>
              <div><span className="text-muted">Tarikh Masuk:</span> {selectedTenant.tarikhMasuk}</div>
              {selectedTenant.icImage && (
                <div>
                  <span className="text-muted">Gambar IC:</span>
                  <img src={selectedTenant.icImage} alt="IC" className="mt-2 w-full rounded-xl border-2 border-accent" />
                </div>
              )}
            </div>
            <button onClick={() => setSelectedTenant(null)} className="btn-secondary w-full mt-4 text-center">Tutup</button>
          </div>
        </div>
      )}
    </div>
  )
}
