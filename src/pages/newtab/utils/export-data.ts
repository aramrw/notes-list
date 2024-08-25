import { NoteType } from "../Newtab";

export function exportData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("notes", (res) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }

      const notes: NoteType[] = res.notes;

      // Convert notes to a JSON string
      const notesJson = JSON.stringify(notes, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([notesJson], { type: "application/json" });

      // Trigger the download directly
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "notes.json";
      downloadLink.click();

      // Clean up the URL object
      URL.revokeObjectURL(url);
      resolve(notes);
    });
  });
}
