export const CSV_SEPARATOR = ';'

const TRUE_VALUES = ['1', 'x', 'true']
const FALSE_VALUES = ['', '0', '.', 'false']

function splitRows(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === CSV_SEPARATOR) {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (quoted) throw new Error('Unterminated quoted field')
  if (field !== '' || row.length) rows.push([...row, field])
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

export function parseCsv(text) {
  const [header, ...body] = splitRows(text.replace(/^\uFEFF/, ''))
  if (!header || header.length < 2) {
    throw new Error(`Expected a header row with attributes separated by "${CSV_SEPARATOR}"`)
  }

  const attributes = header.slice(1).map((name, index) => ({ id: index + 1, name: name.trim() }))
  const objects = body.map((row, index) => ({ id: index + 1, name: row[0].trim() }))

  const values = new Map()
  body.forEach((row, r) => {
    if (row.length > header.length) {
      throw new Error(`Row ${r + 2} has ${row.length} entries, expected ${header.length}`)
    }
    attributes.forEach((m, c) => values.set(`${objects[r].id}:${m.id}`, (row[c + 1] ?? '').trim()))
  })

  const normalized = [...values.values()].map((value) => value.toLowerCase())
  const manyValued = normalized.some(
    (value) => !TRUE_VALUES.includes(value) && !FALSE_VALUES.includes(value),
  )

  if (manyValued) return { objects, attributes, incidence: new Set(), values, manyValued }

  const incidence = new Set(
    [...values].filter(([, value]) => TRUE_VALUES.includes(value.toLowerCase())).map(([k]) => k),
  )
  return { objects, attributes, incidence, values: new Map(), manyValued }
}
