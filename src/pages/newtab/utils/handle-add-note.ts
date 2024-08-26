import { saveNoteToStorage } from "@src/pages/background";
import { Accessor, Setter } from "solid-js";
import { NoteType } from "../Newtab";

export function handleAddNote({
  newNote,
  prevNotes,
  setNotes,
}: {
  newNote: NoteType;
  prevNotes: Accessor<NoteType[]>;
  setNotes: Setter<NoteType[]>;
}) {
  if (newNote) {
    for (const note of prevNotes()) {
      if (note.text === newNote.text) {
        return;
      }
    }
    newNote.text = newNote.text.trim();
    saveNoteToStorage(newNote.text)
      .then(() => {
        setNotes((prev) => [...prev, newNote]);
      })
      .catch((e) => {
        if (e !== "Not Important") {
          console.error(e);
        }
      });
  }
}
