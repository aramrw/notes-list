import "@src/styles/index.css";
import styles from "./Newtab.module.css";
import ListItem from "./components/list-item";
import { Accessor, createSignal, onMount, Setter } from "solid-js";
import { saveNoteToStorage } from "../background";
//import { rejects } from "assert";
//import Archive from "./components/icons/archive";
import ArchiveIcon from "./components/icons/archive";
import DeletedNotesModal, {
  fetchDeletedNotes,
} from "./components/deleted-notes-modal";
import { exportData } from "./utils/export-data";
import { importData } from "./utils/import-data";

export type NoteType = {
  text: string;
  timestamp: number;
};

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

const Newtab = () => {
  const [notes, setNotes] = createSignal<NoteType[]>([]);
  const [isShowModal, setIsShowModal] = createSignal<boolean>(false);
  const [deletedNotes, setDeletedNotes] = createSignal<NoteType[]>([]);

  onMount(() => {
    loadNotesFromStorage();
    fetchDeletedNotes()
      .then((notes) => {
        setDeletedNotes(notes);
      })
      .catch((e) => {
        console.error(`Err Fetching Deleted Notes: ${e}`);
      });
  });

  async function loadNotesFromStorage() {
    chrome.storage.local.get("notes", (result) => {
      if (result.notes) {
        setNotes(result.notes);
      } else {
        setNotes([]);
      }
    });
  }

  async function deleteNotesFromDB(notesToDelete: NoteType[]) {
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

  async function deleteNotesForever(notesToDelete: NoteType[]) {
    chrome.storage.local.get("deleted", (res) => {
      let deletedNotes: NoteType[] = res.deleted || [];
      deletedNotes = deletedNotes.filter(
        (n) => !notesToDelete.some((toDel) => toDel.text === n.text)
      );
      chrome.storage.local.set({ deleted: deletedNotes });
      setDeletedNotes(deletedNotes);
    });
  }

  async function get10Notes() {
    return new Promise<NoteType[]>((resolve, _reject) => {
      chrome.storage.local.get("notes", (result) => {
        const currentNotes: NoteType[] = result.notes || [];
        resolve(currentNotes.slice(0, 10));
      });
    });
  }

  async function copyNotes() {
    if (notes().length === 0) {
      return;
    }
    const newNotes: NoteType[] = await get10Notes();
    let notesTextArray: string[] = [];
    for (const note of newNotes) {
      notesTextArray.push(note.text);
    }
    const notes_linebroken_string = notesTextArray.join("\n");
    await navigator.clipboard.writeText(notes_linebroken_string);

    // delete notes after copying
    deleteNotesFromDB(newNotes);
  }

  function Nav() {
    return (
      <nav class="mb-5 mt-0.5 w-full border-b border-b-zinc-700 py-1 pb-1.5 shadow-lg bg-zinc-900 px-3">
        <menu class="flex flex-row justify-between items-center gap-2 w-full">
          <li class="w-fit">
            <div class="flex h-full flex-col justify-center items-center">
              <ArchiveIcon
                class="hover:opacity-70 cursor-pointer size-8 bg-zinc-900 rounded-sm p-1 border-2 border-zinc-700"
                onClick={() => {
                  setIsShowModal((prev) => !prev);
                }}
              />
            </div>
          </li>
          <div class="w-full flex flex-row justify-center items-center gap-2">
            <li>
              <AddNoteSection />
            </li>
            <li class="text-base">
              <button
                onClick={copyNotes}
                class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border-2 border-zinc-700"
              >
                Copy
              </button>
            </li>
            <li class="text-base font-medium opacity-20 select-none">
              <span>{notes().length}</span> notes
            </li>
          </div>
          <li class="w-fit">
            <ImportExportSection />
          </li>
        </menu>
      </nav>
    );
  }

  function ImportExportSection() {
    return (
      <div class="flex flex-row gap-2 items-center w-full">
        <button
          onClick={(e) =>
            importData().then((imported) => {
              setNotes((prev) => [...prev, ...imported]);
            })
          }
          class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border-2 border-zinc-700"
        >
          Import
        </button>
        <button
          onClick={(e) => exportData()}
          class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border-2 border-zinc-700"
        >
          Export
        </button>
      </div>
    );
  }

  function AddNoteSection() {
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
          class="font-medium rounded-sm px-2 h-fit text-black text-base text-center bg-zinc-100 border-2 border-zinc-600 focus-visible:border-zinc-100"
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
          class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border-2 border-zinc-700"
        >
          + New
        </button>
      </div>
    );
  }

  function renderNotes() {
    return notes().length > 0 ? (
      <ul class="grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 py-1 md:grid-cols-2 grid-cols-1">
        {notes().map((note, _index) => (
          <ListItem
            note={note}
            deleteNotes={deleteNotesFromDB}
            index={_index}
          />
        ))}
      </ul>
    ) : (
      <span class="text-2xl font-medium">You have 0 notes.</span>
    );
  }

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Nav />
        <ul class="flex flex-row justify-self-center items-between h-full w-full max-h-[43rem] overflow-y-auto">
          <li class="w-fit">
            {isShowModal() && (
              <DeletedNotesModal
                currentNotes={notes}
                deletedNotes={deletedNotes}
                setDeletedNotes={setDeletedNotes}
                deleteNotesForever={deleteNotesForever}
                setNotes={setNotes}
              />
            )}
          </li>
          <li class="w-full flex flex-row justify-center items-start">
            {renderNotes()}
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Newtab;
