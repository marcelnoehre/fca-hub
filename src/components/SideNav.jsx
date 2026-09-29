function SideNav({ open, onNavigate }) {
  return (
    <nav className={`sidenav${open ? ' open' : ''}`}>
      <h3 className="nav-section">Formal Contexts</h3>
      <button className="nav-item active" onClick={onNavigate} aria-current="page">
        New Context
      </button>
    </nav>
  )
}

export default SideNav
