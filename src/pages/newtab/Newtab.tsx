import "@src/styles/index.css";
import styles from "./Newtab.module.css";
import ListItem from "./components/list-item";
import { createSignal, onMount } from "solid-js";
import DeletedNotesModal, {
  fetchDeletedNotes,
} from "./components/deleted-notes-modal";
import { deleteNotesFromDB, getAllNotes } from "./utils/db-notes";
import Nav from "./components/navbar/navbar";

export type NoteType = {
  text: string;
  timestamp: number;
};

const Newtab = () => {
  const [notes, setNotes] = createSignal<NoteType[]>([]);
  const [isShowModal, setIsShowModal] = createSignal<boolean>(false);
  const [deletedNotes, setDeletedNotes] = createSignal<NoteType[]>([]);

  onMount(() => {
    getAllNotes().then((notes) => {
      setNotes(notes);
    });
    fetchDeletedNotes()
      .then((notes) => {
        setDeletedNotes(notes);
      })
      .catch((e) => {
        console.error(`Err Fetching Deleted Notes: ${e}`);
      });
  });

  function renderNotes() {
    return notes().length > 0 ? (
      <ul class="grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 py-1 md:grid-cols-2 grid-cols-1">
        {notes().map((note, _index) => (
          <ListItem
            note={note}
            setNotes={setNotes}
            setDeletedNotes={setDeletedNotes}
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
        <Nav
          notes={notes}
          deletedNotes={deletedNotes}
          setNotes={setNotes}
          setDeletedNotes={setDeletedNotes}
          setIsShowModal={setIsShowModal}
        />
        <ul class="flex flex-row justify-self-center items-between h-full w-full max-h-[43rem] overflow-y-auto">
          <li class="w-fit">
            {isShowModal() && (
              <DeletedNotesModal
                currentNotes={notes}
                deletedNotes={deletedNotes}
                setDeletedNotes={setDeletedNotes}
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
