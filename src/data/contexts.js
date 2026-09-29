import { parseCxt } from '../utils/parseCxt.js'
import { parseCsv } from '../utils/parseCsv.js'

const loaders = import.meta.glob('../contexts/*/*.{cxt,csv}', { query: '?raw', import: 'default' })

const parsers = { cxt: parseCxt, csv: parseCsv }

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })

export const categories = Object.entries(
  Object.keys(loaders).reduce((groups, path) => {
    const [, category, name, format] = path.match(/\/contexts\/([^/]+)\/([^/]+)\.(cxt|csv)$/)
    ;(groups[category] ??= []).push({ path, category, name, format })
    return groups
  }, {}),
)
  .map(([name, files]) => ({ name, files: files.sort(byName) }))
  .sort(byName)

export async function loadContext(file) {
  const text = await loaders[file.path]()
  return { name: file.name, ...parsers[file.format](text) }
}
