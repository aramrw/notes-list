import { NoteType } from "../Newtab";
import packageJson from "../../../../package.json";

export const [majorV, minorV, patchV, labelV = "0"] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export function exportData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("notes", (res) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      chrome.storage.local.get("deleted", (_dRes) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        const notes: NoteType[] = res.notes || [];
        //const dNotes: NoteType[] = dRes.deleted || [];

        // Convert notes to a JSON string
        const notesJson = JSON.stringify(notes, null, 2);
        //const dNotesJson = JSON.stringify(notes, null, 2);

        // Create a Blob from the JSON string
        const blob = new Blob([notesJson], { type: "application/json" });
        //const dBlob = new Blob([dNotesJson], { type: "application/json" });

        // Trigger the download directly
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.style.opacity = "1";
        downloadLink.href = url;
        downloadLink.download = `qnt_backup_${majorV}.${minorV}.${patchV}.${labelV}.json`;
        downloadLink.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);
        resolve(notes);
      });
    });
  });
}
