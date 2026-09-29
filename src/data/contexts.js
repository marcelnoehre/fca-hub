import { parseCxt } from '../utils/parseCxt.js'

const loaders = import.meta.glob('../contexts/*/*.cxt', { query: '?raw', import: 'default' })

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })

export const categories = Object.entries(
  Object.keys(loaders).reduce((groups, path) => {
    const [, category, name] = path.match(/\/contexts\/([^/]+)\/([^/]+)\.cxt$/)
    ;(groups[category] ??= []).push({ path, category, name })
    return groups
  }, {}),
)
  .map(([name, files]) => ({ name, files: files.sort(byName) }))
  .sort(byName)

export async function loadContext(file) {
  const text = await loaders[file.path]()
  return { name: file.name, ...parseCxt(text) }
}
