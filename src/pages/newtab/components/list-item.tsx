import "@src/styles/index.css";
import TrashIcon from "./icons/trash";
import { NoteType } from "../Newtab";

export default function ListItem({
  note,
  index,
  deleteNotes,
}: {
  note: NoteType;
  index: number;
  deleteNotes: (notesToDelete: NoteType[]) => void;
}) {
  return (
    <ul class="max-w-60 min-w-60 flex flex-row justify-between items-center gap-2 outline rounded-lg py-0.5 px-2 bg-zinc-900">
      <li>
        <span class="text-xs bg-zinc-800 rounded-md font-medium px-0.5">
          {index}.
        </span>
      </li>
      <li class="text-nowrap overflow-hidden">
        <span>{note.text}</span>
      </li>
      <li
        class="hover:opacity-70 cursor-pointer bg-zinc-700 rounded-sm pb-0.5"
        onClick={() => deleteNotes([note])}
      >
        <TrashIcon />
      </li>
    </ul>
  );
}
