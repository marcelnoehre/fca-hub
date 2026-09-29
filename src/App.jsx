import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import SideNav from './components/SideNav.jsx'
import ContextTable from './components/ContextTable.jsx'
import { loadContext } from './data/contexts.js'

const NAV_WIDTH_KEY = 'fca-hub.sidenav-width'
const NAV_WIDTH_DEFAULT = 240

function readNavWidth() {
  try {
    const stored = Number(localStorage.getItem(NAV_WIDTH_KEY))
    return stored > 0 ? stored : NAV_WIDTH_DEFAULT
  } catch {
    return NAV_WIDTH_DEFAULT
  }
}

function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [navWidth, setNavWidth] = useState(readNavWidth)
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState({ path: null, context: null, error: null })

  useEffect(() => {
    if (!selected) return
    let cancelled = false
    loadContext(selected)
      .then((context) => !cancelled && setLoaded({ path: selected.path, context, error: null }))
      .catch((error) => !cancelled && setLoaded({ path: selected.path, context: null, error }))
    return () => {
      cancelled = true
    }
  }, [selected])

  useEffect(() => {
    try {
      localStorage.setItem(NAV_WIDTH_KEY, String(navWidth))
    } catch {
      // storage unavailable; width just won't persist
    }
  }, [navWidth])

  const select = (file) => {
    setSelected(file)
    setNavOpen(false)
  }

  const renderContent = () => {
    if (!selected) return <ContextTable key="new" />
    if (loaded.path !== selected.path) return <p className="status">Loading {selected.name}…</p>
    if (loaded.error) {
      return (
        <p className="status error">
          Could not load {selected.name}: {loaded.error.message}
        </p>
      )
    }
    return <ContextTable key={selected.path} initialContext={loaded.context} />
  }

  return (
    <div className="layout" style={{ '--sidenav-w': `${navWidth}px` }}>
      <TopBar onMenuClick={() => setNavOpen((open) => !open)} />
      <SideNav
        open={navOpen}
        selected={selected}
        onSelect={select}
        width={navWidth}
        onResize={setNavWidth}
      />
      {navOpen && <div className="backdrop" onClick={() => setNavOpen(false)} />}
      <main className="content">{renderContent()}</main>
    </div>
  )
}

export default App
