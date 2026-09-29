const isCount = (line) => /^\d+$/.test(line)

export function parseCxt(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trimEnd())

  if (lines[0]?.trim().toUpperCase() !== 'B') {
    throw new Error('Not a Burmeister file: first line must be "B"')
  }

  let i = isCount(lines[1]) && isCount(lines[2]) && !isCount(lines[3]) ? 1 : 2
  const objectCount = Number(lines[i++])
  const attributeCount = Number(lines[i++])
  if (!Number.isInteger(objectCount) || !Number.isInteger(attributeCount)) {
    throw new Error('Missing object/attribute counts')
  }
  while (lines[i] === '') i++

  const readNames = (count, what) => {
    const names = lines.slice(i, i + count)
    if (names.length < count) throw new Error(`Expected ${count} ${what} names`)
    i += count
    return names.map((name, index) => ({ id: index + 1, name: name.trim() }))
  }

  const objects = readNames(objectCount, 'object')
  const attributes = readNames(attributeCount, 'attribute')

  const rows = lines.slice(i).map((line) => line.trim()).filter(Boolean)
  if (rows.length < objectCount) {
    throw new Error(`Expected ${objectCount} incidence rows, found ${rows.length}`)
  }

  const incidence = new Set()
  objects.forEach((g, row) => {
    const cells = rows[row]
    if (cells.length !== attributeCount) {
      throw new Error(`Row ${row + 1} has ${cells.length} entries, expected ${attributeCount}`)
    }
    attributes.forEach((m, col) => {
      const cell = cells[col]
      if (cell === 'x' || cell === 'X') incidence.add(`${g.id}:${m.id}`)
      else if (cell !== '.') throw new Error(`Invalid entry "${cell}" in row ${row + 1}`)
    })
  })

  return { objects, attributes, incidence }
}
