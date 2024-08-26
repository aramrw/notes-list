import { Setter } from "solid-js";
import { NoteType } from "../Newtab";

export async function get10Notes() {
  return new Promise<NoteType[]>((resolve, _reject) => {
    chrome.storage.local.get("notes", (result) => {
      const currentNotes: NoteType[] = result.notes || [];
      resolve(currentNotes.slice(0, 10));
    });
  });
}

export async function getAllNotes() {
  return new Promise<NoteType[]>((resolve, _reject) => {
    chrome.storage.local.get("notes", (result) => {
      const currentNotes: NoteType[] = result.notes || [];
      resolve(currentNotes);
    });
  });
}

export async function deleteNotesFromDB(
  notesToDelete: NoteType[],
  setNotes: Setter<NoteType[]>,
  setDeletedNotes: Setter<NoteType[]>
) {
  chrome.storage.local.get("notes", (result) => {
    const currentNotes = result.notes || [];
    const newNotes: NoteType[] = currentNotes.filter(
      (note: NoteType) =>
        !notesToDelete.some((toDelete) => toDelete.text === note.text)
    );
    chrome.storage.local.set({ notes: newNotes });
    setNotes(newNotes);
  });

  chrome.storage.local.get("deleted", (res) => {
    const deletedNotes: NoteType[] = res.deleted || [];
    deletedNotes.push(...notesToDelete);
    chrome.storage.local.set({ deleted: deletedNotes });
    setDeletedNotes(deletedNotes);
  });
}

export async function deleteNotesForever(notesToDelete: NoteType[]) {
  return new Promise<NoteType[]>((resolve, reject) => {
    chrome.storage.local.get("deleted", (res) => {
      let deletedNotes: NoteType[] = res.deleted || [];
      if (!deletedNotes) {
        reject("No Deleted Notes Found");
      }
      deletedNotes = deletedNotes.filter(
        (n) => !notesToDelete.some((toDel) => toDel.text === n.text)
      );
      chrome.storage.local.set({ deleted: deletedNotes });
      resolve(deletedNotes);
    });
  });
}
