import { Home, User } from 'lucide-react'

export default function Header({ onDashboard, kosongCount }) {
  return (
    <div className="bg-primary px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-secondary text-sm">Selamat Datang!</p>
          <h1 className="text-white text-xl font-bold">Rumah Sewa Malaysia</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDashboard} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1">
            <Home size={16} /> Admin
          </button>
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <User size={20} className="text-dark" />
          </div>
        </div>
      </div>
      <div className="bg-white/15 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs">Bilik Kosong</p>
          <p className="text-white text-2xl font-bold">{kosongCount}</p>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-xs">Jumlah Bilik</p>
          <p className="text-white text-2xl font-bold">6</p>
        </div>
      </div>
    </div>
  )
}
