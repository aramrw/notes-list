import { NoteType } from "../newtab/Newtab";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addNote",
    title: "Add note",
    contexts: ["selection"],
  });
});

export function saveNoteToStorage(text: string) {
  return new Promise<NoteType>((resolve, reject) => {
    if (text === "") {
      reject("text is empty.");
    }
    const newNote: NoteType = { text, timestamp: Date.now() };
    chrome.storage.local.get("notes", (result) => {
      const currentNotes: NoteType[] = result.notes || [];
      let duplicateFound = false;
      for (const note of currentNotes) {
        if (note.text.trim() === text.trim()) {
          duplicateFound = true;
          break;
        }
      }
      if (!duplicateFound) {
        currentNotes.push(newNote);
        chrome.storage.local.set({ notes: currentNotes }, () => {
          if (chrome.runtime.lastError) {
            console.error("Err saving to storage:", chrome.runtime.lastError);
            reject(`Err saving to storage: ${chrome.runtime.lastError}`);
          } else {
            //console.log("Note saved");
            resolve(newNote);
          }
        });
      } else {
        reject("duplicate found; skipping.");
      }
    });
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "copy_text") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          func: function getSelectionText() {
            return window.getSelection().toString();
          },
        })
        .then((results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }

          // results is an array of InjectionResultDetails
          if (results && results[0] && results[0].result) {
            saveNoteToStorage(results[0].result).catch((e) => {
              console.error(e);
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  if (info.menuItemId === "addNote") {
    saveNoteToStorage(info.selectionText).catch((e) => {
      if (e !== "Not Important") {
        console.error(e);
      }
    });
  }
});
