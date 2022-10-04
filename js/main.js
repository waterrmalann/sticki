"use strict";

console.log("_       __     __                    __");
console.log("| |     / /__  / /_  ____  ____ _____/ /");
console.log("| | /| / / _ \/ __ \/ __ \/ __ `/ __  / ");
console.log("| |/ |/ /  __/ /_/ / /_/ / /_/ / /_/ /  ");
console.log("|__/|__/\___/_.___/ .___/\__,_/\__,_/   ");
console.log("                 /_/                    ");
console.log("Alan | V1.0 2022")


const e_notesContainer = document.getElementById('notesContainer');
const e_addNote = document.getElementById('addNote');

const e_themeModal = document.getElementById('themeModal');
const e_themeModalOpen = document.getElementById('themeModalOpen');
const e_themeModalClose = document.getElementById('themeModalClose');

const e_backgroundColor = document.getElementById('backgroundColor');
const e_cardColor = document.getElementById('cardColor');
const e_cardTextColor = document.getElementById('cardTextColor');

var appData = {
    'identifier': 0,
    'notes': [],
    'backgroundColor': '',
    'cardColor': '',
    'cardTextColor': ''
};

function uniqueID() {
    appData.identifier += 1;
    return 'n' + appData.identifier;
}

function loadData() {
    let _data = localStorage.getItem("webpad-appData");
    if (_data) {
        appData = JSON.parse(_data);
    }
}

function saveData() {
    localStorage.setItem("webpad-appData", JSON.stringify(appData));
}

function syncColors() {
    document.documentElement.style.setProperty('--background-clr', appData.backgroundColor);
    document.documentElement.style.setProperty('--card-clr', appData.cardColor);
    document.documentElement.style.setProperty('--card-text-clr', appData.cardTextColor);
    
    saveData();
}

function createNote(id, content, toDatabase = true) {
    const _noteElement = document.createElement("textarea");
    _noteElement.classList.add("note");
    _noteElement.value = content;
    _noteElement.placeholder = "Take a note...";
    _noteElement.id = id;

    _noteElement.addEventListener("change", () => {
        updateNote(id, _noteElement.value);
    });
    _noteElement.addEventListener("dblclick", () => {
        const _confirmation = confirm("Are you sure you wish to delete this note?");
        if (_confirmation) {
            deleteNoteByElement(_noteElement);
        }
    });
    e_notesContainer.insertBefore(_noteElement, e_addNote);

    if (toDatabase) {
        const _noteObject = {
            'id': id,
            'content': content
        }
        appData.notes.push(_noteObject);
    }

    saveData();
}

function deleteNoteByElement(element) {
    appData.notes.splice(appData.notes.findIndex(e => e.id === element.id), 1);
    e_notesContainer.removeChild(element);

    saveData();
}

function updateNote(id, content) {
    let _target = appData.notes.find(_note => _note.id === id);
    _target.content = content;

    saveData();
}


e_themeModalOpen.addEventListener('click', () => {
    e_themeModal.style.display = 'block';
})
e_themeModalClose.addEventListener('click', () => {
    e_themeModal.style.display = 'none';
})
window.addEventListener('click', (e) => {
    if (e.target == e_themeModal) {
        e_themeModal.style.display = 'none';
    }
})

loadData();
appData.notes.forEach((_note) => {
    createNote(_note.id, _note.content, false);
});

e_addNote.addEventListener("click", () => createNote(uniqueID(), ""));

if (!appData.backgroundColor) {
    appData.backgroundColor = getComputedStyle(document.querySelector(":root")).getPropertyValue("--background-clr").trim()
}

if (!appData.cardColor) {
    appData.cardColor = getComputedStyle(document.querySelector(":root")).getPropertyValue("--card-clr").trim()
}

if (!appData.cardTextColor) {
    appData.cardTextColor = getComputedStyle(document.querySelector(":root")).getPropertyValue("--card-text-clr").trim()
}

e_backgroundColor.value = appData.backgroundColor;
e_cardColor.value = appData.cardColor;
e_cardTextColor.value = appData.cardTextColor;

syncColors();

e_backgroundColor.addEventListener('change', () => {
    appData.backgroundColor = e_backgroundColor.value;
    syncColors();
})

e_cardColor.addEventListener('change', () => {
    appData.cardColor = e_cardColor.value;
    syncColors();
})

e_cardTextColor.addEventListener('change', () => {
    appData.cardTextColor = e_cardTextColor.value;
    syncColors();
})

for (const element of document.querySelectorAll('.colorbox')) {
    element.style.backgroundColor = element.dataset.colorboxClr;
    element.addEventListener('click', () => {
        appData[element.dataset.colorboxOf] = element.dataset.colorboxClr;
        syncColors();
    })
}