import { useState } from 'react'
import './index.css'
import Header from './components/Header'
import FilterTabs from './components/FilterTabs'

export default function App() {
  const [view, setView] = useState('rooms')
  const [filter, setFilter] = useState('semua')
  
  return (
    <div className="min-h-screen bg-accent pb-8">
      <Header onAdmin={() => alert('Admin!')} kosongBeds={0} totalBeds={0} />
      <FilterTabs filter={filter} onFilterChange={setFilter} />
      <div className="p-4 text-center text-primary">
        <h1>App Loading...</h1>
        <p>If you see this, React is working!</p>
      </div>
    </div>
  )
}
