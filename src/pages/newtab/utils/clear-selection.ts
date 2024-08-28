export default function clearSelection() {
  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    } else {
		}
  }
}
