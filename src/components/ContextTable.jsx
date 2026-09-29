import { useState } from 'react'
import EditableLabel from './EditableLabel.jsx'
import { CrossIcon, PlusIcon } from './Icons.jsx'
import { toCxt, toCsv, downloadFile } from '../utils/exportContext.js'

const INITIAL_SIZE = 5
const DEFAULT_TITLE = 'Formal Context'
const DEFAULT_FILENAME = 'context'

const toFilename = (title) =>
  title
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\.(cxt|csv)$/i, '')
    .trim() || DEFAULT_FILENAME

const createItems = (prefix, n) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `${prefix}${i + 1}` }))

const formatTitle = (name) => (
  <>
    <span className="title-text">{name}</span>
    <svg className="edit-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
    </svg>
  </>
)

function ContextTable() {
  const [objects, setObjects] = useState(() => createItems('g', INITIAL_SIZE))
  const [attributes, setAttributes] = useState(() => createItems('m', INITIAL_SIZE))
  const [incidence, setIncidence] = useState(() => new Set())
  const [title, setTitle] = useState(null)

  const key = (g, m) => `${g}:${m}`

  const toggle = (g, m) => {
    setIncidence((prev) => {
      const next = new Set(prev)
      const k = key(g, m)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  const nextId = (list) => (list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1)

  const addItem = (setList, prefix) =>
    setList((prev) => {
      const id = nextId(prev)
      return [...prev, { id, name: `${prefix}${id}` }]
    })

  const addObject = () => addItem(setObjects, 'g')
  const addAttribute = () => addItem(setAttributes, 'm')

  const renameItem = (setList, id, name) =>
    setList((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)))

  const removeObject = (g) => {
    setObjects((prev) => prev.filter((o) => o.id !== g))
    setIncidence((prev) => new Set([...prev].filter((k) => !k.startsWith(`${g}:`))))
  }

  const removeAttribute = (m) => {
    setAttributes((prev) => prev.filter((a) => a.id !== m))
    setIncidence((prev) => new Set([...prev].filter((k) => !k.endsWith(`:${m}`))))
  }

  const has = (g, m) => incidence.has(key(g.id, m.id))

  const filename = title ? toFilename(title) : DEFAULT_FILENAME

  const exportCxt = () =>
    downloadFile(toCxt(objects, attributes, has), `${filename}.cxt`, 'text/plain')
  const exportCsv = () =>
    downloadFile(toCsv(objects, attributes, has), `${filename}.csv`, 'text/csv')

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>
            <EditableLabel
              name={title ?? DEFAULT_TITLE}
              onRename={setTitle}
              ariaLabel="Context name"
              className="title-name"
              format={formatTitle}
            />
          </h2>
          <p className="subtitle">
            {objects.length} objects × {attributes.length} attributes · {incidence.size} incidences
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={exportCxt}>
            Export .cxt
          </button>
          <button className="btn" onClick={exportCsv}>
            Export .csv
          </button>
        </div>
      </div>

      <div className="table-scroll">
        <table className="context-table">
          <thead>
            <tr>
              <th className="corner" />
              {attributes.map((m) => (
                <th key={m.id} className="label attribute">
                  <EditableLabel
                    name={m.name}
                    onRename={(name) => renameItem(setAttributes, m.id, name)}
                    ariaLabel="Attribute name"
                  />
                  <button
                    className="remove"
                    onClick={() => removeAttribute(m.id)}
                    aria-label={`Remove attribute ${m.name}`}
                  >
                    <CrossIcon />
                  </button>
                </th>
              ))}
              <th className="add-cell">
                <button className="add" onClick={addAttribute} aria-label="Add attribute">
                  <PlusIcon />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {objects.map((g) => (
              <tr key={g.id}>
                <th className="label object">
                  <EditableLabel
                    name={g.name}
                    onRename={(name) => renameItem(setObjects, g.id, name)}
                    ariaLabel="Object name"
                  />
                  <button
                    className="remove"
                    onClick={() => removeObject(g.id)}
                    aria-label={`Remove object ${g.name}`}
                  >
                    <CrossIcon />
                  </button>
                </th>
                {attributes.map((m) => {
                  const checked = incidence.has(key(g.id, m.id))
                  return (
                    <td key={m.id}>
                      <button
                        className={`cell${checked ? ' checked' : ''}`}
                        onClick={() => toggle(g.id, m.id)}
                        aria-pressed={checked}
                        aria-label={`${g.name} has ${m.name}`}
                      >
                        {checked && <CrossIcon className="cell-cross" />}
                      </button>
                    </td>
                  )
                })}
                <td />
              </tr>
            ))}
            <tr>
              <th className="add-cell">
                <button className="add" onClick={addObject} aria-label="Add object">
                  <PlusIcon />
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ContextTable
