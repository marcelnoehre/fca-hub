import { useState } from 'react'
import { categories } from '../data/contexts.js'
import { ChevronIcon, PlusIcon } from './Icons.jsx'

function NavGroup({ label, level, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`nav-group level-${level}`}>
      <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <ChevronIcon className={`chevron${open ? ' open' : ''}`} />
        <span>{label}</span>
      </button>
      {open && <div className="nav-children">{children}</div>}
    </div>
  )
}

function SideNav({ open, selected, onSelect }) {
  return (
    <nav className={`sidenav${open ? ' open' : ''}`}>
      <button
        className={`nav-item${selected === null ? ' active' : ''}`}
        onClick={() => onSelect(null)}
        aria-current={selected === null ? 'page' : undefined}
      >
        <PlusIcon className="nav-icon" />
        New Context
      </button>

      <NavGroup label="Formal Contexts" level={0}>
        {categories.map((category) => (
          <NavGroup key={category.name} label={category.name} level={1}>
            <ul className="nav-list">
              {category.files.map((file) => {
                const active = selected?.path === file.path
                return (
                  <li key={file.path}>
                    <button
                      className={`nav-item${active ? ' active' : ''}`}
                      onClick={() => onSelect(file)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {file.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </NavGroup>
        ))}
      </NavGroup>
    </nav>
  )
}

export default SideNav
