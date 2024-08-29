import { detectBrowser } from "@src/lib/detect-browser";

export default function clearSelection() {
  if (window.getSelection) {
    let browser = detectBrowser().name;
    const selection = window.getSelection();

    if (browser === 'Chrome' || browser === 'Chromium') {
      if (selection) {
        selection.removeAllRanges();
      }
    } else if (browser === 'Firefox') {
      const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
      if (activeElement && typeof activeElement.selectionStart === 'number') {
        activeElement.setSelectionRange(activeElement.selectionStart, activeElement.selectionStart);
      }
      if (selection) {
        selection.removeAllRanges(); // This ensures that the selection is cleared in Firefox
      }
    }
  }
}

