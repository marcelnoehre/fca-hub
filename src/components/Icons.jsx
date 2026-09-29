// Stroke icons drawn in the current text color; size them via CSS.

export function CrossIcon({ className }) {
  return (
    <svg className={`icon ${className ?? ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  )
}

export function PlusIcon({ className }) {
  return (
    <svg className={`icon ${className ?? ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5 V19 M5 12 H19" />
    </svg>
  )
}
