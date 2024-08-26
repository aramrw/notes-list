import { Accessor, createSignal, Setter } from "solid-js";
import { NoteType } from "../../Newtab";
import { handleAddNote } from "../../utils/handle-add-note";

export default function AddNoteSection({
  notes,
  setNotes,
}: {
  notes: Accessor<NoteType[]>;
  setNotes: Setter<NoteType[]>;
}) {
  const [newNote, setNewNote] = createSignal<NoteType>({
    text: "",
    timestamp: Date.now(),
  });

  return (
    <div class="flex flex-row gap-2 items-center">
      <input
        type="text"
        value={newNote ? newNote()?.text : ""}
        onInput={(e) => {
          setNewNote({ text: e.target.value, timestamp: Date.now() });
        }}
        placeholder={"入力..."}
        class="font-medium rounded-sm px-2 h-fit text-black text-base text-center bg-zinc-100 border border-zinc-600 focus-visible:border-zinc-100"
      />
      <button
        onClick={(e) => {
          e.currentTarget;
          handleAddNote({ newNote: newNote(), prevNotes: notes, setNotes });
          setNewNote({ text: "", timestamp: Date.now() });
        }}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            handleAddNote({ newNote: newNote(), prevNotes: notes, setNotes });
            setNewNote({ text: "", timestamp: Date.now() });
          }
        }}
        class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border border-zinc-700"
      >
        + New
      </button>
    </div>
  );
}
