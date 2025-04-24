export function copyToClipboard(text: string) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(text)
  }
  else {
    document.execCommand('copy', true, text)
  }
}
