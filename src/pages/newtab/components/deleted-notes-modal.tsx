import { Accessor, createSignal, onMount } from "solid-js";
import { NoteType } from "../Newtab";
import TrashIcon from "./icons/trash";

export async function fetchDeletedNotes() {
  return new Promise<NoteType[]>((resolve, reject) => {
    chrome.storage.local.get("deleted", (res) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      }
      let deletedNotes: NoteType[] = res.deleted || [];
      resolve(deletedNotes);
    });
  });
}

export default function DeletedNotesModal({
  deletedNotes,
  deleteNotesForever,
}: {
  deletedNotes: Accessor<NoteType[]>;
  deleteNotesForever: (notesToDelete: NoteType[]) => void;
}) {
  function DeletedNoteItem({ note, index }: { note: NoteType; index: number }) {
    return (
      <ul class="w-full h-fit flex flex-row justify-center items-center gap-2 outline rounded-md py-0.5 px-2 bg-zinc-900">
        <li class="w-full text-lg flex flex-row justify-between items-center gap-2">
          <div class="max-w-28 flex flex-row justify-self-start items-center gap-1.5 overflow-x-hidden text-nowrap">
            <span class="text-xs bg-zinc-800 rounded-md font-medium px-0.5">
              {index}.
            </span>
            <span class="">{note.text}</span>
          </div>
          <span
        class="hover:opacity-70 cursor-pointer bg-zinc-700 rounded-sm pb-0.5"
            onClick={() => deleteNotesForever([note])}
          >
            <TrashIcon />
          </span>
        </li>
      </ul>
    );
  }

  return (
    <ul class="min-w-40 w-fit h-full flex flex-col justify-start items-start gap-2 py-1 px-3">
      {deletedNotes().map((note, index) => {
        return <DeletedNoteItem note={note} index={index} />;
      })}
    </ul>
  );
}
