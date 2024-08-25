import { NoteType } from "../Newtab";

export function triggerDialog() {
  return new Promise((resolve, reject) => {
    // Create an input element of type 'file'
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    // Trigger the file picker
    input.onchange = () => {
      const file = input.files?.[0];
      //console.log(file);
      if (!file) {
        return reject(new Error("No file selected"));
      }

      // Read the file content as text
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const notes: NoteType[] = JSON.parse(e.target?.result as string);
          resolve(notes); // Return the parsed notes
        } catch (error) {
          reject(new Error("Failed to parse JSON file"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      reader.readAsText(file); // Read the file
    };

    input.click(); // Programmatically open the file picker dialog
  });
}

export function importData(): Promise<NoteType[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("notes", (res) => {
      let err = chrome.runtime.lastError;
      if (err) {
        console.error(`Error Importing Data: ${err}`);
        return reject(err);
      }

      let notes: NoteType[] = res.notes || [];

      // Trigger the file import dialog
      triggerDialog()
        .then((importedNotes) => {
          if (!Array.isArray(importedNotes)) {
            console.error(`ImportedNotes is NOT an Array: ${importedNotes}`);
            return reject(new Error("Invalid data format for imported notes"));
          }

          // Ensure importedNotes is not null and handle duplicates
          let newNotes = [...notes];
          const existingTexts = new Set(notes.map(note => note.text));

          for (const importedNote of importedNotes as NoteType[]) {
            if (!existingTexts.has(importedNote.text)) {
              newNotes.push(importedNote);
              existingTexts.add(importedNote.text);
            }
          }

          // Save the updated notes back to storage
          chrome.storage.local.set({ notes: newNotes }, () => {
            if (chrome.runtime.lastError) {
              console.error(`Database Error While Importing Notes: ${chrome.runtime.lastError.message}`);
              return reject(chrome.runtime.lastError);
            }

            console.log(newNotes);
            resolve(newNotes);
          });
        })
        .catch((err) => {
          console.error(`Import Data DialogTrigger Error: ${err}`);
          reject(err);
        });
    });
  });
}

