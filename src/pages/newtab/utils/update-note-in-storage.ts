import { NoteType } from "../Newtab";

export async function updateNoteInStorage(
  noteToFind: NoteType,
  updatedNote: NoteType
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.get("notes", (res) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }

      let notes: NoteType[] = res.notes || [];

      // Find the index of the note to update
      const index = notes.findIndex((note) => note.text === noteToFind.text);

      if (index === -1) {
        return reject(new Error("Note not found"));
      }

      // Update the specific note
      notes[index] = updatedNote;

      // Save the updated notes back to storage
      chrome.storage.local.set({ notes }, () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      });
    });
  });
}
