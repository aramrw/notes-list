import "@src/styles/index.css";
import styles from "./Newtab.module.css";
import ListItem from "./components/list-item";
import { createSignal, onMount, Accessor, Setter } from "solid-js";
import { saveNoteToStorage } from "../background";
//import { rejects } from "assert";
//import Archive from "./components/icons/archive";
import ArchiveIcon from "./components/icons/archive";
import DeletedNotesModal, {
  fetchDeletedNotes,
} from "./components/deleted-notes-modal";

export type NoteType = {
  text: string;
  timestamp: number;
};

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

  async function deleteNotes(notesToDelete: NoteType[]) {
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
      setDeletedNotes((prev) => [...prev, ...deletedNotes]);
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

  function handleAddNote({ newNote }: { newNote: NoteType }) {
    if (newNote) {
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

  async function get10Notes() {
    return new Promise<NoteType[]>((resolve, reject) => {
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
    deleteNotes(newNotes);
  }

  function Nav() {
    return (
      <nav class="mb-20 mt-2 w-full">
        <menu class="flex flex-row justify-between items-center gap-2 pl-0.5">
          <li class="w-fit">
            <div class="flex h-full flex-col justify-center items-center">
              <ArchiveIcon
                class="hover:opacity-70 cursor-pointer size-9"
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
                class="font-medium bg-zinc-400 rounded-md px-2 text-base hover:opacity-80"
              >
                Copy
              </button>
            </li>
            <li class="text-base">
              <span>{notes().length}</span> notes
            </li>
          </div>
        </menu>
      </nav>
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
          placeholder={"Enter Word..."}
          class="font-medium border rounded-md px-2 h-fit text-black text-base text-center"
        />
        <button
          onClick={(e) => {
						e.currentTarget
            handleAddNote({ newNote: newNote() });
            setNewNote({ text: "", timestamp: Date.now() });
          }}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              handleAddNote({ newNote: newNote() });
              setNewNote({ text: "", timestamp: Date.now() });
            }
          }}
          class="font-medium bg-zinc-500 rounded-md px-2 text-base hover:opacity-80"
        >
          + New
        </button>
      </div>
    );
  }

  function renderNotes() {
    return notes().length > 0 ? (
      <ul class="flex flex-col gap-2 justify-start items-start">
        {notes().map((note, _index) => (
          <ListItem note={note} deleteNotes={deleteNotes} index={_index} />
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
        <ul class="flex flex-row justify-self-center items-between h-full w-full max-h-[39rem] overflow-y-auto px-5 py-2">
          <li class="w-fit">
            {isShowModal() && (
              <DeletedNotesModal
                deletedNotes={deletedNotes}
                deleteNotesForever={deleteNotesForever}
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
