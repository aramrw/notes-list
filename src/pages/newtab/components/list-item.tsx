import "@src/styles/index.css";
import TrashIcon from "./icons/trash";
import { NoteType } from "../Newtab";
import { updateNoteInStorage } from "../utils/update-note-in-storage";
import { createEffect, createSignal, Setter } from "solid-js";
import { cn } from "@src/lib/utils";
import clsx from "clsx";
import clearSelection from "../utils/clear-selection";

export default function ListItem({
  note,
  index,
  setNotes,
  deleteNotes,
  setDeletedNotes,
}: {
  note: NoteType;
  index: number;
  setNotes: Setter<NoteType[]>;
  setDeletedNotes: Setter<NoteType[]>;
  deleteNotes: (
    notesToDelete: NoteType[],
    setNotes: Setter<NoteType[]>,
    setDeletedNotes: Setter<NoteType[]>
  ) => Promise<void>;
}) {
  const [isDisabled, setIsDisabled] = createSignal<boolean>(true);
  const [isCopied, setIsCopied] = createSignal<boolean>(false);
  const [isConfirmedChange, setIsConfirmedChange] =
    createSignal<boolean>(false);
  const [isHoverDelete, setIsHoverDelete] = createSignal<boolean>(false);

  createEffect(() => {
    if (isConfirmedChange()) {
      setTimeout(() => {
        setIsConfirmedChange(false);
      }, 1500);
    } else if (isCopied()) {
      setTimeout(() => {
        setIsCopied(false);
      }, 750);
    }
  });

  return (
    <div class="relative flex items-center">
      {isCopied() && (
        <div class="absolute top-0 left-0 animate-pulse text-xs pl-1 text-gray-500 font-medium">
          copied
        </div>
      )}
      <ul
        class={clsx(
          "max-h-fit max-w-60 min-w-60 flex flex-row justify-between items-center gap-2 outline outline-1 outline-zinc-700 rounded-sm py-0.5 px-2 bg-zinc-900",
          !isDisabled() && "outline-zinc-400",
          isConfirmedChange() && "outline-green-500 animate-pulse",
          isHoverDelete() && "hover:outline-red-800"
        )}
        onClick={() => {
          setTimeout(() => {
            if (isDisabled()) {
              setIsCopied(true);
              navigator.clipboard.writeText(note.text);
            }
          }, 250);
        }}
      >
        <li>
          <span class="text-xs bg-zinc-800 font-medium px-0.5 h-fit w-fit rounded-sm border border-zinc-700 select-none">
            {index}.
          </span>
        </li>
        <li
          class="h-fit max-h-fit text-nowrap overflow-hidden select-none animate-in cursor-pointer"
          onDblClick={() => {
            setIsDisabled(false);
          }}
          onMouseLeave={() => {
            clearSelection();
            setIsDisabled(true);
          }}
        >
          <input
            class={cn(
              "h-fit max-h-fit bg-zinc-900 text-white text-center max-w-44 outline-none cursor-pointer"
            )}
            value={note.text}
            readOnly={isDisabled()}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter") {
                let text = (e.currentTarget as HTMLInputElement).value;
                let newNote: NoteType = { text, timestamp: Date.now() };
                updateNoteInStorage(note, newNote);
                setIsDisabled(true);
                navigator.clipboard.writeText(note.text);
                setIsCopied(true);
                setIsConfirmedChange(true);
              }
            }}
          />
        </li>
        <li
          class="cursor-pointer bg-zinc-800 rounded-sm outline outline-1 outline-zinc-700 hover:outline-red-800"
          onClick={() => deleteNotes([note], setNotes, setDeletedNotes)}
          onMouseOver={() => setIsHoverDelete(true)}
          onMouseLeave={() => setIsHoverDelete(false)}
        >
          <TrashIcon />
        </li>
      </ul>
    </div>
  );
}
