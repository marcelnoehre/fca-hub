import { useState } from 'react'

const DEFAULT_NAME = /^([a-zA-Z]+)(\d+)$/

function formatName(name) {
  const match = name.match(DEFAULT_NAME)
  if (!match) return name
  return (
    <>
      {match[1]}
      <sub>{match[2]}</sub>
    </>
  )
}

function EditableLabel({ name, onRename, ariaLabel, className = '', format = formatName }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  const startEditing = () => {
    setDraft(name)
    setEditing(true)
  }

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== name) onRename(trimmed)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        className={`label-input ${className}`}
        value={draft}
        size={Math.max(draft.length, 2)}
        autoFocus
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        aria-label={ariaLabel}
      />
    )
  }

  return (
    <button className={`label-name ${className}`} onClick={startEditing} title={`${name} — click to rename`}>
      {format(name)}
    </button>
  )
}

export default EditableLabel
