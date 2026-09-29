import { useState } from 'react'
import TopBar from './components/TopBar.jsx'
import SideNav from './components/SideNav.jsx'
import ContextTable from './components/ContextTable.jsx'

function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="layout">
      <TopBar onMenuClick={() => setNavOpen((open) => !open)} />
      <SideNav open={navOpen} onNavigate={() => setNavOpen(false)} />
      {navOpen && <div className="backdrop" onClick={() => setNavOpen(false)} />}
      <main className="content">
        <ContextTable />
      </main>
    </div>
  )
}

export default App
