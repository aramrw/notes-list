import { Setter } from "solid-js";
import { NoteType } from "../../Newtab";
import { exportData } from "../../utils/export-data";
import importData from "../../utils/import-data";

export default function ImportExportSection({
  setNotes,
}: {
  setNotes: Setter<NoteType[]>;
}) {
  return (
    <div class="flex flex-row gap-2 items-center w-full">
      <button
        onClick={(_) =>
          importData().then((imported) => {
            setNotes((prev) => [...prev, ...imported]);
          })
        }
        class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border border-zinc-700"
      >
        Import
      </button>
      <button
        onClick={(_) => exportData()}
        class="font-medium bg-zinc-900 rounded-sm px-2 text-base hover:opacity-90 border border-zinc-700"
      >
        Export
      </button>
    </div>
  );
}
