const DEFAULT_CALENDLY_URL = 'https://calendly.com/purveshnaik007a/meeting-with-purvesh?month=2026-08'

export function calendlyUrl() {
  return import.meta.env.VITE_CALENDLY_URL || DEFAULT_CALENDLY_URL
}

export function openCalendly() {
  const url = calendlyUrl()
  const opened = window.open(url, '_blank', 'noopener,noreferrer')

  if (!opened) {
    window.location.assign(url)
  }
}
