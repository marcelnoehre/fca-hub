function TopBar({ onMenuClick }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenuClick} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>
      <h1 className="brand">FCA-HUB</h1>
    </header>
  )
}

export default TopBar
