import clsx from "clsx";
import { Accessor, Setter } from "solid-js";
import { NoteType } from "../../Newtab";
import copyNotes from "../../utils/copy-notes";
import ArchiveIcon from "../icons/archive";
import GearIcon from "../icons/gear";
import AddNoteSection from "./add-notes-sections";
import ImportExportSection from "./import-export-section";

export default function Nav({
  notes,
  deletedNotes,
  setNotes,
  setDeletedNotes,
  setIsShowModal,
}: {
  notes: Accessor<NoteType[]>;
  deletedNotes: Accessor<NoteType[]>;
  setNotes: Setter<NoteType[]>;
  setDeletedNotes: Setter<NoteType[]>;
  setIsShowModal: Setter<boolean>;
}) {
  return (
    <nav class="mb-5 mt-0.5 w-full border-b border-b-zinc-700 py-1 pb-1.5 shadow-lg bg-zinc-900 px-3">
      <menu class="flex flex-row justify-between items-center gap-2 w-full">
        <li class="w-fit flex h-full flex-col justify-center items-center">
          <ArchiveIcon
            class={clsx(
              "hover:opacity-70 cursor-pointer size-8 bg-zinc-900 rounded-sm p-0.5 border border-zinc-700"
              // deletedNotes.length === 0 && "hover:opacity-50 cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (deletedNotes().length === 0) {
                setIsShowModal(false);
								return;
              }
              setIsShowModal((prev) => !prev);
            }}
          />
        </li>
        <div class="w-full flex flex-row justify-center items-center gap-2">
          <li>
            <AddNoteSection notes={notes} setNotes={setNotes} />
          </li>
          <li class="text-base">
            <button
              onClick={() => copyNotes(notes(), setNotes, setDeletedNotes)}
              class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border border-zinc-700"
            >
              Copy
            </button>
          </li>
          <li class="text-base font-medium opacity-20 select-none">
            <span>{notes.length}</span> notes
          </li>
        </div>
        <li class="w-fit">
          <ImportExportSection setNotes={setNotes} />
        </li>
        <li
          class="w-fit flex h-full flex-col justify-center items-center"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          <GearIcon
            class={clsx(
              "hover:opacity-70 cursor-pointer size-8 bg-zinc-900 rounded-sm p-0.5 border border-zinc-700"
            )}
          />
        </li>
      </menu>
    </nav>
  );
}
