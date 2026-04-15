import { User, Users, Download, Home } from 'lucide-react'

export default function Header({ onAdmin, kosongBeds, totalBeds, onInstall, showInstall }) {
  return (
    <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-secondary text-sm">Selamat Datang!</p>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Home size={24} /> Angel Home Pro
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onAdmin} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1">
            <Users size={16} /> Admin
          </button>
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <User size={20} className="text-dark" />
          </div>
        </div>
      </div>
      <div className="bg-white/15 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs">Katil Kosong</p>
          <p className="text-white text-2xl font-bold">{kosongBeds}</p>
        </div>
        <div className="text-center">
          <p className="text-white/80 text-xs">Jumlah</p>
          <p className="text-white text-2xl font-bold">{totalBeds}</p>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-xs">Properties</p>
          <p className="text-white text-2xl font-bold">6</p>
        </div>
      </div>
      {showInstall && (
        <button onClick={onInstall} className="w-full mt-4 bg-white text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2">
          <Download size={18} /> Install App ni di Phone
        </button>
      )}
    </div>
  )
}
