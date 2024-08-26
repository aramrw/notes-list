import { Setter } from "solid-js";
import { NoteType } from "../Newtab";
import { deleteNotesFromDB, get10Notes } from "./db-notes";

export default async function copyNotes(
  notes: NoteType[],
  setNotes: Setter<NoteType[]>,
  setDeletedNotes: Setter<NoteType[]>
) {
  if (notes.length === 0) {
    return;
  }
  const newNotes: NoteType[] = await get10Notes();
  let notesTextArray: string[] = [];
  for (const note of newNotes) {
    notesTextArray.push(note.text);
  }
  const notes_linebroken_string = notesTextArray.join("\n");
  await navigator.clipboard.writeText(notes_linebroken_string);

  deleteNotesFromDB(newNotes, setNotes, setDeletedNotes);
}
