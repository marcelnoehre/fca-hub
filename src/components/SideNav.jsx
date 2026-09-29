import { useState } from 'react'
import { categories } from '../data/contexts.js'
import { ChevronIcon, CrossIcon, PlusIcon, SearchIcon } from './Icons.jsx'

function NavGroup({ label, level, defaultOpen = false, forceOpen = false, children }) {
  const [expanded, setOpen] = useState(defaultOpen)
  const open = forceOpen || expanded

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

function NavSearch({ query, onChange }) {
  return (
    <div className="nav-search">
      <SearchIcon className="nav-search-icon" />
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onChange('')}
        placeholder="Search contexts"
        aria-label="Search contexts"
      />
      {query && (
        <button className="nav-search-clear" onClick={() => onChange('')} aria-label="Clear search">
          <CrossIcon />
        </button>
      )}
    </div>
  )
}

const MIN_WIDTH = 180
const MAX_WIDTH = 640
const KEY_STEP = 16

const clampWidth = (width) =>
  Math.round(Math.min(Math.max(width, MIN_WIDTH), Math.min(MAX_WIDTH, window.innerWidth - 200)))

function Resizer({ width, onResize }) {
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (dragging) onResize(clampWidth(e.clientX))
  }

  const stopDragging = () => setDragging(false)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') onResize(clampWidth(width - KEY_STEP))
    else if (e.key === 'ArrowRight') onResize(clampWidth(width + KEY_STEP))
    else return
    e.preventDefault()
  }

  return (
    <div
      className={`sidenav-resizer${dragging ? ' dragging' : ''}`}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize navigation"
      aria-valuenow={width}
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onDoubleClick={() => onResize(240)}
      onKeyDown={onKeyDown}
    />
  )
}

function SideNav({ open, selected, onSelect, width, onResize }) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const filtered = needle
    ? categories
        .map((category) => ({
          ...category,
          files: category.files.filter((file) => file.name.toLowerCase().includes(needle)),
        }))
        .filter((category) => category.files.length > 0)
    : categories

  return (
    <nav className={`sidenav${open ? ' open' : ''}`}>
      <div className="sidenav-scroll">
        <button
          className={`nav-item${selected === null ? ' active' : ''}`}
          onClick={() => onSelect(null)}
          aria-current={selected === null ? 'page' : undefined}
        >
          <PlusIcon className="nav-icon" />
          New Context
        </button>

        <NavGroup label="Formal Contexts" level={0}>
          <NavSearch query={query} onChange={setQuery} />
          {needle && filtered.length === 0 && <p className="nav-empty">No matching contexts</p>}
          {filtered.map((category) => (
            <NavGroup
              key={category.name}
              label={category.name}
              level={1}
              forceOpen={needle !== ''}
            >
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
                        <span className="nav-label" title={file.name}>
                          {file.name}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </NavGroup>
          ))}
        </NavGroup>
      </div>
      <Resizer width={width} onResize={onResize} />
    </nav>
  )
}

export default SideNav
