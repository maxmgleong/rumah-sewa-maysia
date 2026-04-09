export default function FilterTabs({ filter, onFilterChange }) {
  return (
    <div className="px-4 -mt-4 mb-4">
      <div className="bg-white rounded-2xl p-1.5 flex card-shadow">
        <button onClick={() => onFilterChange('semua')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === 'semua' ? 'bg-primary text-white shadow' : 'text-muted'}`}>
          Semua Bilik
        </button>
        <button onClick={() => onFilterChange('kosong')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === 'kosong' ? 'bg-primary text-white shadow' : 'text-muted'}`}>
          Bilik Kosong
        </button>
      </div>
    </div>
  )
}
