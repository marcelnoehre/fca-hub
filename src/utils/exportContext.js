import { CSV_SEPARATOR } from './parseCsv.js'

export function toCxt(objects, attributes, has) {
  const lines = [
    'B',
    '',
    String(objects.length),
    String(attributes.length),
    '',
    ...objects.map((g) => g.name),
    ...attributes.map((m) => m.name),
    ...objects.map((g) => attributes.map((m) => (has(g, m) ? 'X' : '.')).join('')),
  ]
  return lines.join('\n') + '\n'
}

const csvEscape = (value) =>
  /[";\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value

export function toCsv(objects, attributes, valueOf) {
  const header = ['', ...attributes.map((m) => m.name)]
  const rows = objects.map((g) => [g.name, ...attributes.map((m) => valueOf(g, m))])
  return [header, ...rows].map((row) => row.map(csvEscape).join(CSV_SEPARATOR)).join('\n') + '\n'
}

export function downloadFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
