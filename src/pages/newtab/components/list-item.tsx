import "@src/styles/index.css";
import styles from "./Newtab.module.css";
import { createSignal, onMount, Accessor } from "solid-js";
import TrashCan from "@src/assets/img/trashcan.svg";
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
    <ul class="w-fit flex flex-row justify-self-center items-center gap-2 outline rounded-sm py-0.5 px-2 bg-zinc-900">
      <li>
        <span class="text-sm">{index}.</span> <span>{note.text}</span>
      </li>
      <li
        class="hover:opacity-60 cursor-pointer"
        onClick={() => deleteNotes([note])}
      >
        <TrashIcon />
      </li>
    </ul>
  );
}
