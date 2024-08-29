import { detectBrowser } from "@src/lib/detect-browser";
import clsx from "clsx";
import { Accessor, Setter, createSignal } from "solid-js";
import { NoteType } from "../Newtab";
import { deleteNotesForever } from "../utils/db-notes";
import { handleAddNote } from "../utils/handle-add-note";
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

export async function reviveDeletedNotes(
  notesToRevive: NoteType[]
): Promise<NoteType[]> {
  return new Promise<NoteType[]>((resolve, reject) => {
    chrome.storage.local.get("deleted", (res) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      // Retrieve the existing deleted notes or initialize as an empty array
      let deletedNotes: NoteType[] = res.deleted || [];
      // Create a set of texts to revive for faster lookup
      const notesToReviveSet = new Set(notesToRevive.map((note) => note.text));
      // Filter out notes that are to be revived
      const updatedNotes = deletedNotes.filter(
        (note) => !notesToReviveSet.has(note.text)
      );
      // Save the updated list back to storage
      chrome.storage.local.set({ deleted: updatedNotes }, () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(updatedNotes);
      });
    });
  });
}

export default function DeletedNotesModal({
  currentNotes,
  deletedNotes,
  setDeletedNotes,
  setNotes,
}: {
  currentNotes: Accessor<NoteType[]>;
  deletedNotes: Accessor<NoteType[]>;
  setDeletedNotes: Setter<NoteType[]>;
  setNotes: Setter<NoteType[]>;
}) {
  const [isHoverDelete, setIsHoverDelete] = createSignal<boolean>(false);

  function DeletedNoteItem({ note, index }: { note: NoteType; index: number }) {
    return (
      <li
        class={clsx(
          "w-full h-8 min-h-8 text-lg flex flex-row justify-between items-center gap-2 overflow-hidden cursor-pointer outline-1 outline-dashed outline-zinc-700 px-1 py-1.5 rounded-sm hover:outline-zinc-400 opacity-60 hover:opacity-100",
          detectBrowser().name === "Chrome" && "py-2.5",
          isHoverDelete() && "hover:outline-red-700 hover:animate-pulse",
        )}
        onClick={() => {
          reviveDeletedNotes([note]).then((updatedDeletedNotes) => {
            setDeletedNotes(updatedDeletedNotes);
            handleAddNote({ newNote: note, prevNotes: currentNotes, setNotes });
          });
        }}
      >
        <div class="max-w-32 flex flex-row justify-self-start items-center gap-1.5 overflow-x-hidden text-nowrap">
          <span
            class="text-xs bg-zinc-800 rounded-sm font-medium px-0.5 outline-1 outline-dashed outline-zinc-700 ml-0.5 select-none">
            {index}.
          </span>
          <span class="text-xl ml-1">{note.text}</span>
        </div>
        <span
          class="w-fit cursor-pointer bg-zinc-800 rounded-sm outline-1 outline-dashed outline-zinc-700 mr-1 hover:outline-red-700"
          onClick={(e: Event) => {
            e.stopPropagation();
            deleteNotesForever([note]).then((dNotes) => {
              setDeletedNotes(dNotes);
              setIsHoverDelete(false)
            });
          }}
          onMouseOver={() => setIsHoverDelete(true)}
          onMouseLeave={() => setIsHoverDelete(false)}
        >
          <TrashIcon />
        </span>
      </li>
    );
  }

  return (
    <ul class="min-w-52 max-w-52 h-full flex flex-col justify-start items-start gap-2 py-1 px-3 max-h-[30rem] overflow-y-scroll border-r-2 border-r-zinc-700">
      {deletedNotes().map((note, index) => {
        return <DeletedNoteItem note={note} index={index} />;
      })}
    </ul>
  );
}
